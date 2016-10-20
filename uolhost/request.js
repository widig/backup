var http = require('http');

function makeRequest(url) {
	//var data = JSON.stringify({ 'important': 'data' });
	//var cookie = 'something=anything';
	var url_parts = url.split("/");
	var host = url_parts.shift();
	url_parts.unshift("");
	var path = url_parts.join("/");
	if(path == "") path = "/";
	var ret = {
		status : 0
	};
	console.log("request : ["+host+"] ["+path+"]");
	var options = {
	    hostname : host,
	    port : 80,
	    path : path,
	    method : "GET",
	    headers : {
		//'Cookie': cookie,
		//'Content-Type': 'application/json',
		//'Content-Length': Buffer.byteLength(data,'utf8')
	    }
	};
	function callback(data) {
		ret.data = data;
	}
	var request = http.request(options,function(response) {
		var data = [];
		console.log(response.statusCode);
		response.setEncoding("utf8");
		console.log("["+JSON.stringify(response.headers)+"]");
		response.on("data",function(chunk) {
			ret.status = 1;
			data.push(chunk);
		});
		response.on("end",function() {
			callback(data.join());
			ret.status = 2;
		});
	});
	request.on("error",function(e) {
		ret.status = 3;
		ret.code = e.message;
	});
	//request.write(data);
	request.end();
	return ret;
}
var data = makeRequest("www.google.com/index.html");
var loop = 0;
function test() {
	if(data.status == 2) {
		console.log(data.data);
	} else if(data.status <=1) {
		setTimeout(test,0);
	}
}
loop = setTimeout(test,0);