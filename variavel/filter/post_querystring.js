var querystring = require("querystring");
module.exports = function(callback) {
	return function(req,res) {
		var postdata = [];
		req.on('end', function() {
			req.body = querystring.parse(postdata.join(""));
			if("debug" in req && req.debug) {
				console.log('Request Body:', req.body);
				console.log('.');
				console.log();
			}
			return callback(req,res);
		});
		req.on('data', function(postdataChunk){
			postdata.push(postdataChunk);
		});
	};
}
