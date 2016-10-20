var http = require("http");
var fs = require("fs");
var lpath = require("path");
var os = require("os");
var _process = process;

function Server() {
	this.scripts = {
		"mainPage" : ["function","/index.html",function(process,build) {
			process.code = 200;
			process.mime = "text/html";
			var doc = ["<!doctype hhtml><html><head>"]
			doc.push("<script src=\"/units/host/client.js\"></script>");
			doc.push("</head><body></body></html>");
			build.push(doc.join(""));
		}],
		"static" : ["regexp",".*",function(process,build,path,qs) {
			// check if path exists
			console.log(" >>>> ??? ",path);
			//path[1]
			if(path[0] == "/units/host/client.js") {
				console.log(200);
				process.code = 200;
				process.mime = "application/javascript";
				var a = path[1].split(lpath.sep);
				build.push(fs.readFileSync( a.join(lpath.sep) ));
				return true;
			} else if(path[0] == "/js/client.js") {
				console.log(200);
				process.code = 200;
				process.mime = "application/javascript";
				var a = path[1].split(lpath.sep);
				a.pop();
				a.pop();
				a.push("js");
				a.push("Import.js");
				console.log(a.join(lpath.sep));
				
				var doc = [" "," "];
				build.push(fs.readFileSync( a.join(lpath.sep) ));
				build.push(doc.join(""));
				
				return true;
			} else if( !fs.existsSync(path[1]) ) {
				console.log(404);
				process.code = 404;
				process.mime = "text/html";
				var doc = ["<!doctype hhtml><html><head>"]
				doc.push("</head><body>404 - Not Found.</body></html>");
				build.push(doc.join(""));
				return true;
			
			} else {
				console.log(200);
				process.code = 200;
				process.mime = "application/javascript";
				var doc = ["\r\n\r\n"];
				// import
				build.push(doc.join(""));
				return true;
			}
			
		}]
	};
	var self = this;
	var sessions = self.sessions;
	var handlerPart1 = function(req,res) {
		console.log("================================================================================");
		console.log(JSON.stringify(sessions));
		var arr_url = req.url.split('?');
		var base_url = arr_url[0];
		arr_url.shift();
		arr_url = arr_url.join("").split("&");
		var qs = {};
		for(var x = 0; x < arr_url.length;x++) {
			var obj = arr_url[x].split('=');
			qs[ obj[0] ] = obj[1];
		}
		function handlerPart2(req,res,qs) {
			var arr_url = req.url.split('?');
			var base_url = arr_url[0];
			var sent = false;
			var process = {};
			process.code = 404;
			var nbase_url = base_url;
			var enabled = true; 
			var machine_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
			console.log( [ "[" + machine_ip + "]:[", req.method, nbase_url,"]"].join(" ") );
			for(var header in req.headers) {
				console.log("    "  + header+":"+req.headers[header]);
			}
			var lockReferer = false;
			if(lockReferer && ("referer" in req.headers)) {
				if(req.headers.referer.indexOf("http://localhost/")!=0) {
					console.log("500 WRONG REFERER",req.headers.referer,req.url);
					res.writeHead(500, [
						["Content-Type","text/plain"]
					]);
					res.end( "only localhost available" );
				}
			}
			var cookies = {};
			if("cookie" in req.headers) {
				var full_cookie = req.headers["cookie"];
				cookie_vars = full_cookie.split(";");
				for(var c in cookie_vars) {
					var item = cookie_vars[c].split("=");
					cookies[ item[0].trim() ] = item[1];
				}
			}
			console.log();
			console.log("  response:");
			
			if(!("id0" in cookies)) { // set machine
				// block DoS
				process.cookie = {};
				var alpha = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
				while(true) {
					var code = [];
					for(var x = 0; x < 2*8;x++) { // generate machine session
						code.push( alpha[ parseInt( Math.random()*16 ) ] );
					}
					code = code.join("");
					if(!(code in self.sessions)) {	
						// associate ip with machine
						self.sessions[code] = {
							ip : machine_ip,
							port : [],
							clients : {}
						}
						process.cookie["id0"] = code;
						break;
					}
				}
			} else {
				// check ip
				if( cookies.id0 in self.sessions ) { // verify machine
					if( self.sessions[cookies.id0].ip == machine_ip) {
						// load data in memory if it is stored.
						process.cookie = {};
						process.cookie["id0"] = cookies.id0;
					} else { // generate machine session
						process.cookie = {};
						var alpha = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
						while(true) {
							var code = [];
							for(var x = 0; x < 2*8;x++) {
								code.push( alpha[ parseInt( Math.random()*16 ) ] );
							}
							code = code.join("");
							if(!(code in self.sessions)) {	
								// get ip
								self.sessions[code] = {
									ip : machine_ip,
									port : [],
									clients : {}
								}
								process.cookie["id0"] = code;
								break;
							}
						}
						
					}
				} else {
					// treat as if was first contact.
					// generate machine session
					process.cookie = {};
					var alpha = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
					while(true) {
						var code = [];
						for(var x = 0; x < 2*8;x++) {
							code.push( alpha[ parseInt( Math.random()*16 ) ] );
						}
						code = code.join("");
						if(!(code in self.sessions)) {	
							// get ip
							self.sessions[code] = {
								ip : machine_ip,
								port : [],
								clients : {}
							}
							process.cookie["id0"] = code;
							break;
						}
					}
					
				}
			}
			var has_auth = false;
			var client_cookie = "";
			if( (process.cookie["id0"] in self.sessions) && 
				("cookie" in qs) &&
				( qs["cookie"] != "" ) &&
				( qs["cookie"] in self.sessions[ process.cookie["id0"] ].clients )
			) {
				client_cookie = qs["cookie"];
				has_auth = true;
			}
			
			
			
			
			
			var header = [];
			var build = [];
			
			var path = nbase_url.split("/");
			var base_path = _process.cwd() + lpath.sep + ".." + lpath.sep + "numbercooler" + lpath.sep + "NumberCooler.github.io";
			var server_path = _process.cwd() + lpath.sep;
			//if(nbase_url.charAt(0)=="/" && path.length==2 && path[1] == "" && path[0] == "") path.shift();
			if(nbase_url=="/") path[1] = "index.html";
			var npath = base_path + path.join(lpath.sep);
			path = path.join("/");
			
			console.log("    npath:",npath);
			console.log("    path:",path);
			var routed = false;
			for(var urlName in self.scripts) {
				if( self.scripts[urlName][0] == "function") {
					if( self.scripts[urlName][1]==path) {
						console.log("[system]",urlName,path);
						routed = true;
						self.scripts[urlName][2](process,build,[path,npath],qs);
					}
				} else if( self.scripts[urlName][0] == "regexp") {
					if( (new RegExp(self.scripts[urlName][1])).exec( path ) != null ) {
						routed = self.scripts[urlName][2](process,build,[path,npath],qs);
						if(routed) console.log("[system]",urlName,path);
					}
				}
				if(routed) break;
			}
			
			if(!routed) {
				process.code = 404;
				process.mime = "text/html";
				var doc = ["<!doctype html><html><head>"]
				doc.push("</head><body>404 - Not Found</body></html>");
				build.push(doc.join(""));
			}
			if("cookie" in process) {
				for(var key in process.cookie) {
					header.push(["Set-Cookie", key + "=" + process.cookie[key] + ";Path=/;"] );
				}
			}
			//header.push( [ 'Last-Modified', new Date().toUTCString() ] );
			header.push( [ 'Content-Type', process.mime ] );
			res.writeHead(process.code, header);
			for(var hkey in header) {
				console.log("    "+header[hkey][0].toLowerCase() + ":" + header[hkey][1])
			}
			if("stream" in process) {
				fs.createReadStream(process.stream).pipe(res);
			} else {
				res.end( build.join("") );
			}
				
			
		}
		
		if (req.method == 'POST') {
			console.log("[200] " + req.method + " to " + req.url);
			var cbuffer = [];
			req.on('data', function(chunk) {
				cbuffer.push( chunk.toString());
			});
			req.on('end', function() {
				var arr = cbuffer.join("").split("&");
				for(var x = 0; x < arr.length;x++) {
					var obj = arr[x].split("=");
					qs[ obj[0] ] = obj[1];
				}
				handlerPart2(req,res,qs);
			});
		} else {
			handlerPart2(req,res,qs);
		}
	}
	
	this.server = http.createServer(handlerPart1);
	this.server.on("error",function(err) {
		console.log("err:",err);
	});
	
}
Server.prototype.sessions = {};
Server.prototype.addPatternHandler = function(name,method,pattern,tags,callback) { // callback return HandlerArguments
	this.scripts[name] = ["regexp",pattern,function(process,build) {
			process.code = 200;
			process.mime = "text/html";
			var doc = ["<!doctype hhtml><html><head></head><body></body></html>"];
			build.push(doc.join(""));
	}];
}
Server.prototype.addHandler = function(method,pattern,tags,callback) { // callback return HandlerArguments
	this.scripts[name] = ["function",pattern,function(process,build) {
			process.code = 200;
			process.mime = "text/html";
			var doc = ["<!doctype hhtml><html><head></head><body></body></html>"];
			build.push(doc.join(""));
	}];
}
Server.prototype.start = function() {
	this.server.listen(80, "127.0.0.1");
}
Server.prototype.stop = function() {
	this.server.close(function() {
		console.log("server closed.");
	});
}
Server.prototype.listHandlers = function() {
	console.log("Handlers:");
	for(var urlName in this.scripts) {
		console.log("    [" + urlName + "] : [" + this.scripts[urlName][0] + "] : [" + this.scripts[urlName][1] + "]");
	}
}
function main() {
	var server = new Server();
	// install handlers
	server.start();
	server.listHandlers();
	setTimeout(function() {
		server.stop();
	},10000);
}

main();