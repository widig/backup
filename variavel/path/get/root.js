

var fs = require("fs");
var path = require("path");

module.exports = function(req,res) {
	res.send(fs.readFileSync("public" + path.sep + "index.html","utf8"));
	res.end();
	
}