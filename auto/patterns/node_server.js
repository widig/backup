var http = require("http");
var fs = require("fs");
var querystring = require("querystring");

function server(){
	this.debugFlag = true;
	this.host = JSON.parse( fs.readFileSync("./meta.json","utf8") ).host;
	this.port = JSON.parse( fs.readFileSync("./meta.json","utf8") ).port;
	this.terminate_token = JSON.parse( fs.readFileSync("./meta.json","utf8") ).terminate_token;
	this.timer = new Date();
	this.timeout = -1;
	this.running = true;
	var self = this;
	this.handle = http.createServer(function(req,res) {
		return handler.apply(self,[req,res]);
	});
	process.on('SIGINT', function() {
		fs.appendFileSync("log.txt","[-] " + self.host + ":" + self.port + " -> " + new Date().toISOString() +"\r\n");
	    	process.exit();
	});
	this.handle.on("error",function(err) {
		fs.appendFileSync("log.txt","[error]" + err + "\r\n");
	});
	if(this.timeout>0) {
		this.TimeOutService = setInterval(function() {
			if(self.timeout>0) {
				if( (new Date()).valueOf() > (self.timer.valueOf() + self.timeout) ) {
					self.stop();
				}
			}
		},10000);
	}
}
server.prototype.start = function() {
	this.handle.listen( this.port, this.host );
	fs.appendFileSync("log.txt","[+] " + this.host + ":" + this.port + " -> " + new Date().toISOString() +"\r\n");
}
server.prototype.stop = function() {
	var self = this;
	this.handle.close(function() {
		if(self.debugFlag) console.log("[system] server " + self.host + " at port " + self.port + " stoped.");
		fs.appendFileSync("log.txt","[-] " + self.host + ":" + self.port + " -> " + new Date().toISOString() +"\r\n");
	});
	if(this.timeout>0) {
		clearInterval(this.TimeOutService);
	}
}

function processing(request,response,container) {

	response.setHeader('Content-Type','text/html');
	response.writeHead(200,{'Content-Type':'text/html'});
	if(container.method == "post") {
		
		var build = [];
		build.push("<!doctype html>");
		build.push("<html>");
		build.push("<head>");
		build.push("<script>");
		// client lease container data
		build.push(`var container = ${container};`);
		build.push("</script>");
		build.push("</head>");
		build.push("<body>");
		build.push("<table>");
		build.push("<tr>");
		build.push("<td>");
		build.push(`${container.method}`);
		build.push("</td>");
		build.push("</tr>");
		build.push("<tr>");
		build.push("<td>");
		build.push(`${container.path}`);
		build.push("</td>");
		build.push("</tr>");
		for(var key in container.post) {
			build.push("<tr>");
			build.push("<td>");
			build.push(`${key} : ${container.post[key]}`);
			build.push("</td>");
			build.push("</tr>");
		}
		build.push("</table>");
		build.push("</body>");
		build.push("</html>");
		response.end(build.join(""));
		
		if(container.path == "/action") {
			console.log(this.terminate_token + ":" + container.post.token);
			if("msg" in container.post && "token" in container.post && container.post.msg == "shutdown" && this.terminate_token == container.post.token) {
				console.log("request stop");
				this.stop();
			}
		}
	} else if(container.method == "get") {
		var build = [];
	
		var build = [];
		build.push("<!doctype html>");
		build.push("<html>");
		build.push("<head>");
		build.push("<script>");
		build.push("var container = " + JSON.stringify(container) + ";");
		build.push("</script>");
		build.push("</head>");
		build.push("<body>");
		build.push("<table>");
		build.push("<tr>");
		build.push("<td>");
		build.push(container.method);
		build.push("</td>");
		build.push("</tr>");
		build.push("<tr>");
		build.push("<td>");
		build.push(container.path);
		build.push("</td>");
		build.push("</tr>");
		for(var key in container.get) {
			build.push("<tr>");
			build.push("<td>");
			build.push(key + ":" + container.get[key]);
			build.push("</td>");
			build.push("</tr>");
		}
		build.push("</table>");
		build.push("</body>");
		build.push("</html>");
		response.end(build.join(""));
	} else {
		response.end('<!doctype html><html><body><table><tr><td>'+container.method+'</td></tr><tr><td>'+container.path+'</td></tr></table></body></html>');
	}
	
}

function handler(request,response) {
	
	if(this.running) {
		var container = {};
		var arr_url = request.url.split('?');
		var base_url = arr_url[0]; // without arguments and hashes
		arr_url.shift(); // remove base_url
		container.cookies = {};
		container.post = {};
		container.get = querystring.parse(arr_url.join("?"));
		container.path = base_url;
		container.clientIp = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
		if("cookie" in request.headers) {
			var full_cookie = request.headers["cookie"];
			cookie_vars = full_cookie.split(";");
			for(var c in cookie_vars) { var item = cookie_vars[c].split("="); container.cookies[ item[0].trim() ] = item[1]; }
		}
		if (request.method == 'POST') {
				container.method = "post";
				var cbuffer = [];
				request.on('data', function(chunk) {
					cbuffer.push( chunk.toString());
				});
				var self = this;
				request.on('end', function() {
					container.post = querystring.parse(cbuffer.join(""));
					if(self.debugFlag) {
						var message = "request [ method : " + container.method + ", url: \"" + base_url + "\", get: "+JSON.stringify(container.get)+", post: "+JSON.stringify(container.post)+", cookies: "+JSON.stringify(container.cookies)+" ]"
						if(self.debugFlag) console.log("[system] " + message);
						fs.appendFileSync("log.txt","[i] " + self.host + ":" + self.port + " -> " + message+"\r\n");
					}
					processing.apply(self,[request,response,container]);
				});
			} else if(request.method == 'GET') {
				container.method = "get";
				if(this.debugFlag) {
					var message = "request [ method : " + container.method + ", url: \"" + base_url + "\", get: "+JSON.stringify(container.get)+", cookies:"+JSON.stringify(container.cookies)+"]";
					if(this.debugFlag) console.log("[system] " + message);
					fs.appendFileSync("log.txt","[i] " + this.host + ":" + this.port + " -> " + message+"\r\n");
				}
				processing.apply(this,[request,response,container]);
			}
			
	} else {
		response.writeHead(500, {"content-type": "text/html","connection":"close"});
		response.write("<!doctype html><html><body>500</body></html>");
		response.end();
		self.stop();
	}
}

var s = new server();
s.start();