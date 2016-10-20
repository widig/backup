var Admin = require("./lib/Admin.js");
require = null;
global.require = null;
Object.defineProperty(global,"Admin", {
	get : function() { return Admin; }
});
Admin({cmd:"load"},"fs","fs");
var http = Admin({cmd:"load"},"http","http");
Admin({cmd:"load"},"https","https");
Admin({cmd:"load"},"path","path");
Go = Admin({cmd:"load"},"Go","./Go.js");
Ansi = Admin({cmd:"load"},"Ansi","./Ansi.js");

console.log("NumberCooler Shell 1.0");
console.log(JSON.stringify(Admin({cmd:"loadedList"})));
console.log();
console.log(new Date());
console.log();
console.log("/* START HERE */");
Server = Admin({cmd:"load"},"Server","./Server.js");

Ansi.terminal(256,function(data) {
	// parse data
	/*
		Start server named "a".
		Server "a" route statically the relative directory "".
		
		on parser look for syntaxes that begins with S
	*/
	var r = Go(data);
	if(r.result) {
		return false;
	} 
	// when it got here, machine must make a question about last sentence.
	// would like to exit is a simple question.
	// if not then the second question is about last statement
	// an error? "forgot" about last sentence.
	// not? so it's a new syntax.
	// how to tie new syntax without loosing context? (give some perspective about context), open a temporary context to answer the question.
	// give the temporary context a timeout if it is first time, more time if happened.
	// live
	
	
	console.log("/* END HERE */");	
	
	return true; // quit
});
//var server_tutorial = Server("127.0.0.1",80,"tutorial");


//var doc = "abc";
//var r = StringMap(doc);
Admin({cmd:"load"},"test","./test.js");

//console.log(JSON.stringify(Admin({cmd:"loadedList"})));


