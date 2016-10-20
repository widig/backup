var express = require("express");
var app = express();

var fs = require("fs");
var path = require("path");

function checkInstall() {

	
	
	var app_path = "." + path.sep + "node_modules" + path.sep + "widig_start" + path.sep;
	
	var file;
	
	file = app_path + "index.json";
	if( fs.existsSync(file) && !fs.existsSync("index.json") ) {
		console.log("copying 'index.json'");
		fs.writeFileSync("index.json",fs.readFileSync(file,"utf8"),"utf8");
	}
	
	if( !fs.existsSync("path") ) {
		console.log("creating 'path'");
		fs.mkdirSync("path");
	}
	var http_methods = ["connect","options","head","trace","get","post","put","delete","all"];
	for(var x = 0; x < http_methods.length;x++) {
		if( !fs.existsSync("path" + path.sep + http_methods[x]) ) {
			console.log("creating 'path/"+ http_methods[x]+"'");
			fs.mkdirSync("path" + path.sep + http_methods[x]);
		}
	}
	
	file = app_path + "path" + path.sep + "get" + path.sep + "root.js";
	if( fs.existsSync(file) && !fs.existsSync("path" + path.sep + "get" + path.sep + "root.js") ) {
		console.log("copying 'path/get/root.js'");
		fs.writeFileSync("path" + path.sep + "get" + path.sep + "root.js",fs.readFileSync(file,"utf8"),"utf8");
	}
	
	var params = ["first.js","second.js","third.js","fourth.js","fifth.js","sixth.js","seventh.js"];
	for(var x = 0; x < params.length;x++) {
		file = app_path + "path" + path.sep + "get" + path.sep + params[x];
		if( fs.existsSync(file) && !fs.existsSync("path" + path.sep + "get" + path.sep + params[x]) ) {
			console.log("copying 'path/get/"+params[x]+"'");
			fs.writeFileSync("path" + path.sep + "get" + path.sep + params[x],fs.readFileSync(file,"utf8"),"utf8");
		}
	}
	
	if(!fs.existsSync("public")) {
		console.log("creating 'public'");
		fs.mkdirSync("public");
	}
	
	file = app_path + "public" + path.sep + "index.html";
	if(fs.existsSync(file) && !fs.existsSync("public" + path.sep + "index.html")) {
		console.log("copying 'public/index.html'");
		fs.writeFileSync("public" + path.sep + "index.html",fs.readFileSync(file,"utf8"),"utf8");
	}
	
	file = app_path + "public" + path.sep + "form.html";
	if(fs.existsSync(file) && !fs.existsSync("public" + path.sep + "form.html")) {
		console.log("copying 'public/form.html'");
		fs.writeFileSync("public" + path.sep + "form.html",fs.readFileSync(file,"utf8"),"utf8");
	}
	
	if(!fs.existsSync("public" + path.sep + "js")) {
		console.log("creating 'public/js'");
		fs.mkdirSync("public" + path.sep + "js");
	}
	
	file = app_path + "public" + path.sep + "js" + path.sep + "Import.js";
	if(fs.existsSync(file) && !fs.existsSync("public" + path.sep + "js" + path.sep + "Import.js")) {
		console.log("copying 'public/js/Import.js'");
		fs.writeFileSync("public" + path.sep + "js" + path.sep + "Import.js",fs.readFileSync(file,"utf8"),"utf8");
	}
	
	if( !fs.existsSync("filter") ) {
		console.log("creating 'filter'");
		fs.mkdirSync("filter");
	}
	
	file = app_path + "filter" + path.sep + "debug.js";
	if(fs.existsSync(file) && !fs.existsSync("filter" + path.sep + "debug.js")) {
		console.log("copying 'filter/debug.js'");
		fs.writeFileSync("filter" + path.sep + "debug.js",fs.readFileSync(file,"utf8"),"utf8");
	}
	
	file = app_path + "filter" + path.sep + "post_querystring.js";
	if(fs.existsSync(file) && !fs.existsSync("filter" + path.sep + "post_querystring.js")) {
		console.log("copying 'filter/post_querystring.js'");
		fs.writeFileSync("filter" + path.sep + "post_querystring.js",fs.readFileSync(file,"utf8"),"utf8");
	}
	
	if( !fs.existsSync("config") ) {
		console.log("creating 'config'");
		fs.mkdirSync("config");
	}
	
	file = app_path + "config" + path.sep + "config.json";
	if(fs.existsSync(file) && !fs.existsSync("config" + path.sep + "config.json")) {
		console.log("copying 'config/config.json'");
		fs.writeFileSync("config" + path.sep + "config.json",fs.readFileSync(file,"utf8"),"utf8");
	}
	
	file = app_path + "config.js";
	if(fs.existsSync(file) && !fs.existsSync("config.js")) {
		console.log("copying 'config.js'");
		fs.writeFileSync("config.js",fs.readFileSync(file,"utf8"),"utf8");
	}
	
	if( !fs.existsSync("global") ) {
		console.log("creating 'global'");
		fs.mkdirSync("global");
	}
	
}
function runServer() {
	var index = JSON.parse( fs.readFileSync("."+path.sep+"index.json","utf8") );
	var config = JSON.parse( fs.readFileSync("."+path.sep+"config" + path.sep+"config.json","utf8") );
	console.log(process.cwd());
	function installRoutes(a) {
		for(var key in index.get) {
			var target = require(process.cwd()  + path.sep + "path" + path.sep + a + path.sep + index[a][key][ index[a][key].length-1 ]);
			var hook = function(callback) {
				return function(req,res) {
					// global hook begin
					
					// global hook end
					return callback(req,res);
				}
			};
			target = hook(target);
			if(index[a][key].length>1) {
				for(var x = index[a][key].length-2; x >= 0; x--) {
					target = require(process.cwd() + path.sep + "filter" + path.sep + index[a][key][x])(target);
				}
			}
			app[a](key,target);
		}
	}
	function installGlobal(when) {
		for(var key in index[when+"_global"]) {
			app.use(require(process.cwd() + path.sep + "global" + path.sep + index[when+"_global"]));
		}
	}
	app.use(express.static("public"));
	if("load" in index) installGlobal("load");
	var http_methods = ["connect","options","head","trace","get","post","put","delete","all"];
	for(var x = 0; x < http_methods.length;x++) {
		if(http_methods[x] in index) {
			installRoutes(http_methods[x]);
		}
	}
	if("unload" in index) installGlobal("unload");
	app.listen(config.port,function() {
		console.log("widig_start is running at port "+config.port+".");
	});
}

function Main() {
	checkInstall();
	runServer();
}

function Index(a) {
	if(a != undefined && a != null && Object.prototype.toString.apply(a) == "[object Object]") {
		fs.writeFileSync("."+path.sep+"index.json",JSON.stringify(a),"utf8");
		return a;
	} else {
		var index = JSON.parse( fs.readFileSync("."+path.sep+"index.json","utf8") );
		return index;
	}
}

function Config() {
	this.checkInstall = checkInstall;
	this.runServer = runServer;
	this.run = Main;
	this.index = Index;
}

module.exports = new Config();