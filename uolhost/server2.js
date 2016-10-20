// Load the http module to create an http server.
var http = require('http');
var os = require('os');
var ifaces = os.networkInterfaces();
var fs = require('fs');


var config = {port:80};

config.port = process.env.PORT || config.port;

// Configure our HTTP server to respond with Hello World to all requests.
function CreateServerTest1() {
	var local = JSON.parse( fs.readFileSync("./ip.json") );
	if(local.online) {
		var server = http.createServer(function (request, response) {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("<!doctype html><html><body><frameset cols=\"*,100%\">");
			response.end("<frame src=\"blank.html\"></frame>");
			response.end("<frame src=\""+local.location+"\"></frame>");
			response.end("</frameset></body></html>");

		});
		// Listen on port 8080, IP defaults to 127.0.0.1
		server.listen(config.port);
		console.log("Listening on port: " + (process.env.PORT || config.port));
		
	} else {
		var server = http.createServer(function (request, response) {

			var alias = 0;
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("<!doctype html><html><body>");
			Object.keys(ifaces).forEach(function(ifname) {
				ifaces[ifname].forEach(function(iface) {
					response.write(ifname + ":" + alias + ":" + iface.address);
					response.write("<br/>");
					alias += 1;
				});
				
			// Listen on port 8080, IP defaults to 127.0.0.1
			});
			response.write("Hello World 5 " + config.port);
			response.end("</body></html>");
		});
		server.listen(config.port);
		console.log("Listening on port: " + (process.env.PORT || config.port));
	}
}
function CreateServer() {
	var server = http.createServer(function() {
		res.writeHead(302,{"location":"https://www.google.com","connection":"close","content-type":"text/html"});
		res.write("<!doctype html><html><body>302</body></html>");
		res.end();
	});
	server.listen(config.port);
	console.log("Listening on:" + config.port);
}
CreateServerTest1();
