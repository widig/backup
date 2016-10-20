
var express = require('express');
var app = express();
var server = require('http').createServer(app);

var port = 80;

app.use(function(req,res,next) {
	console.log('Request Type:', req.method);
	console.log('Request URL:', req.originalUrl);
	console.log('Request Params:', req.params);
	console.log('Request Query:', req.query);
	next();
});

app.use(express.static('public'));
var requestTime = function (req, res, next) {
	req.requestTime = Date.now();
	next();
};
app.use(requestTime);
app.get('/test2', function (req, res) {
	var responseText = 'Hello World!<br>';
	responseText += '<small>Requested at: ' + req.requestTime + '</small>';
	res.send(responseText);
});
app.get('/test',function(req,res) {
	res.json({a:1});
});
app.listen(port, function () {
	console.log('Example app listening on '+port+'!');
});


