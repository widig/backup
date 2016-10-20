
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var fs = require("fs");
var path = require("path");
var port = 80;
var querystring = require("querystring");
var Hash = require("./lib/hash.js");

app.use(function(req,res,next) {
	req.sessionCache = fs.existsSync("session.json") ? JSON.parse( fs.readFileSync("session.json") ) : {};
	console.log('Request Type:', req.method);
	console.log('Request URL:', req.originalUrl);
	console.log('Request Params:', req.params);
	console.log('Request Query:', req.query);
	console.log();
	next();
});

app.use(express.static('public'));
var generator = require("./lib/generator.js");

app.get("/",function(req,res) {
	if("action" in req.query && req.query.action == "edit") {
		var scripts = fs.readFileSync("routes\\index\\index_scripts.json","utf8");
		var json = JSON.parse(scripts);
		var ret = {
			files : json,
			data : {}
		};
		for(var x = 0; x < ret.files.length;x++) {
			ret.data[ ret.files[x] ] = fs.readFileSync(ret.files[x],"utf8");
		}
		res.json( ret );
	} else if("action" in req.query && req.query.action == "update") {
		
	} else {
		return generator({scripts:"routes\\index\\index_scripts.json",styles:"routes\\index\\index_styles.json"})(req,res);
	}
});
app.post("/",function(req,res) {
	if("action" in req.query && req.query.action == "update") {
		var postdata = "";
		req.on('end', function() {
			req.body = querystring.parse(postdata);
			console.log('Request Body:',req.body);
			// verify if file belongs to assert of app.get/ files served.
			var file = fs.readFileSync("routes\\index\\index_scripts.json","utf8");
			var json = JSON.parse(file);
			var sent = false;
			var code = 0;
			for(var x = 0; x < json.length;x++) {
				if(json[x] == req.body.filename) {
					res.json({result:true,data:req.body.filedata});
					code = 1;
					sent = true;
					break;
				}
			}
			if(!sent) res.json({result:false});
			else {
				// nothing to do with client
				
				// start thread
				if(code == 1) {
					console.log("WRITING FILE ",req.body.filename);
					fs.writeFileSync(req.body.filename,req.body.filedata);
					//req.body.filename
					//req.body.filedata

				}
			}
			console.log();
			console.log();
		});
		req.on('data', function(postdataChunk){
		    postdata += postdataChunk;
		});
		
	}
});

app.get("/action",function(req,res) {
	res.json({a:1});
});
app.get("/json.login",function(request,response) {
	if(!fs.existsSync("users")) {
		response.json({result:false});
		fs.mkdirSync("users");
		fs.writeFileSync("users"+path.sep+"info.json","{}");
		return;
	} 
	if("username" in request.query && "password" in request.query) { // relogin (new session)
		// get users/info.json
		if(fs.existsSync("users"+path.sep + "info.json")) {
			var users = JSON.parse( fs.readFileSync("users"+path.sep + "info.json", "utf8") );
			if(request.query.username in users) {
				var a = users[ request.query.username ].password;
				Hash.sha3_512_start();
				var b = Hash.sha3_512_iter( request.query.password ).data;
				console.log("users[ request.query ].password",a);
				console.log("request.query.password",request.query.password,b);
				if( request.query.username in users && a == b ) {
					var id = Hash.guid();
					var hash = request.sessionCache;
					if(id in hash) while(id in hash) id = Hash.guid();
					hash[id] = {
						csrf:id,
						username:request.query.username,
						log:[["in",new Date()]]
					}
					fs.writeFileSync("session.json",JSON.stringify(hash));
					response.json({result:true,csrf_cookie:id});
				} else {
					response.json({result:false,message:"incorrect username or password"});
				}
			} else {
				response.json({result:false,message:"incorrect username or password"});
			}
		} else {
			response.json({result:false,message:"no users."});
		}
	} else if("csrf_cookie" in request.query) { // auto relogin (reuse session)
		// relogin
		var hash = request.sessionCache;
		if(hash==null) {
			response.json({result:false,message:"server internal error(2)."});
		} else {
			if(request.query.csrf_cookie in hash) {
				hash[ request.query.csrf_cookie ].log.push(["rein",new Date()]);
				response.json({result:true});
				fs.writeFileSync("session.json",JSON.stringify(hash));
			} else {
				response.json({result:false});
			}
		}
	}
});
app.get("/json.register",function(request,response) {
	console.log(JSON.stringify(request.query));
	if("username" in request.query && "password" in request.query && "token" in request.query) {
		
		console.log("FIND FOR ",request.query.token);
		var tokens = JSON.parse( fs.readFileSync("tokens.json") );
		var check = false;
		if(request.query.token in tokens) check = true;
		if(check) {
			console.log("FOUND TOKEN");
			if(!fs.existsSync("users")) fs.mkdirSync("users");
			if(!fs.existsSync("users"+path.sep+"info.json")) fs.writeFileSync("users"+path.sep+"info.json","{}");
			var info = JSON.parse( fs.readFileSync("users"+path.sep+"info.json") );
			// recheck of token reuse, do not allow duplicates
			var check = false;
			for(var username in info) {
				if(info[username].token == request.query.token) {
					check = true;
					console.log("TOKEN HAS ALREADY BEEM USED.");
					response.json({result:false,message:"token has already been used."});
					delete tokens[ request.query.token ];
					fs.writeFileSync("tokens.json",JSON.stringify(tokens));
					return;
				}
			}
			
			if(!check && request.query.username in info) {
				console.log("USERNAME HAS ALREADY BEEN TAKEN.");
				response.json({result:false,message:"username has already been taken."});
			} else {
				var id = Hash.guid();
				var hash = request.sessionCache;
				while(id in hash) id = Hash.guid();
				hash[id] = {csrf:id,username:request.query.username,log:[["in",new Date()]]};
				fs.writeFileSync("session.json",JSON.stringify(hash));
				Hash.sha3_512_start();
				info[request.query.username] = { 
					token : request.query.token,
					password : Hash.sha3_512_iter(request.query.password).data
				};
				console.log("A0",request.query.password,info[request.query.username].password);
				fs.writeFileSync("users"+path.sep+"info.json",JSON.stringify(info));
				console.log("REGISTERED AND LOGGED AS " + id);
				if(!fs.existsSync("users"+path.sep+request.query.username)) fs.mkdirSync("users"+path.sep+request.query.username);
				if(!fs.existsSync("users"+path.sep+request.query.username+path.sep+"history.json")) 
					fs.writeFileSync("users"+path.sep+request.query.username+path.sep+"history.json","{}");
				response.json({result:true,csrf_cookie:id});
			}
			delete tokens[ request.query.token ];
			fs.writeFileSync("tokens.json",JSON.stringify(tokens));
			return;
		} else {
			console.log("TOKEN NOT FOUND");
			response.json({result:false,message:"token not found."});
			return;
		}
	} else {
		console.log("INVALID ARGUMENTS TO REGISTER");
		response.json({result:false,message:"invalid arguments to register a username."});
		return;
	}
});

app.get("/json.tokens",function(req,res) {
	
	function generateTokens(n) {
		if(!fs.existsSync("users")) fs.mkdirSync("users");
		if(!fs.existsSync("users"+path.sep+"info.json")) fs.writeFileSync("users"+path.sep+"info.json","{}");
		var users_info = fs.readFileSync("users"+path.sep+"info.json");
		var list = {};
		for(var x = 0; x < n;x++) {
			var id = Hash.guid();
			while(id in list) id = Hash.guid();
			var next = false;
			for(var username in users_info) {
				if(id == users_info[username].token) {
					next = true;
					break;
				}
			}
			if(next) {
				x--;
				continue;
			}
			list[id] = {};
		}
		fs.writeFileSync("tokens.json",JSON.stringify(list));
	}
	generateTokens(64);
	var doc = [];
	doc.push("<!doctype html>");
	doc.push("<html>");
	doc.push("<body>");
	var tokens = JSON.parse(fs.readFileSync("tokens.json","utf8"));
	doc.push( JSON.stringify(tokens) );
	doc.push("</body>");
	doc.push("</html>");
	res.send(doc.join("\r\n"));
	res.end();
});

app.get("/json.logout",function(request,response) {
	if("csrf_cookie" in request.query) {
		// csrf_cookie -> username -> log out
		var hash = request.sessionCache;
		if(hash==null) {
			response.json({result:false,message:"server internal error(1)."});
			response.end();
		} else {
			var logout_date = new Date();
			if(request.query.csrf_cookie in hash) {
				hash[ request.query.csrf_cookie ].log.push(["out",logout_date]);
				// transfer log from session to history in user, using logout date
				if(fs.existsSync(
					"users"+path.sep
					+hash[request.query.csrf_cookie ].username+path.sep
					+"history.json"
				)) {
					var history = JSON.parse( fs.readFileSync("users"+path.sep+hash[request.query.csrf_cookie ].username+path.sep+"history.json") );
					history[ logout_date.valueOf() ] = hash[ request.query.csrf_cookie ].log;
					fs.writeFileSync("users"+path.sep+hash[request.query.csrf_cookie ].username+path.sep+"history.json",JSON.stringify(history));
				}
				// remove session
				delete hash[request.query.csrf_cookie];
				fs.writeFileSync("session.json",JSON.stringify(hash));
				response.json({result:true});
				response.end();
				
			} else {
				response.json({result:false,message:"wrong cookie.(1)"});
				response.end();
			}
		}
	} else {
		response.json({result:false,message:"wrong cookie.(2)"});
		response.end();
	}
});
app.listen(port, function () {
	console.log('Example app listening on '+port+'!');
});


app.use(function(req,res) {
	console.log();
});

