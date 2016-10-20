module.exports = function(callback) {
	return function(req,res) {
		req.debug = true;
		console.log('--------------------------------------------------------------------------------');
		console.log('Request Type:', req.method);
		console.log('Request URL:', req.originalUrl);
		console.log('Request Params:', req.params);
		console.log('Request Query:', req.query);
		console.log();
		return callback(req,res);
	};
}