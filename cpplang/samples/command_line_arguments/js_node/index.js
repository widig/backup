var fs = require("fs");

var args = {};
//
process.argv.forEach(function (val, index, array) {
	console.log(index + ': ' + val);
	if(index == 2) {
		args.mode = val;
	}
	if(index == 3) {
		args.file = val;
	}
});

function padleft(str,c) {
	if( c - str.length > 0) {
		c = c-str.length;
		var b = [];
		for(var x = 0; x < c;x++) {
			b.push("0");
		}
		return b.join("") + str;
	}
	return str;
}
	
if("file" in args) {
	if(args.mode == "hex") {
		var buffer = fs.readFileSync(args.file);
		var strbuffer = [];
		for(var x = 0; x < buffer.length;x++) {
			if(x==0) {
				strbuffer.push("");
			}
			if(x%16==0) {
				strbuffer.push( padleft( x.toString(16), 4) + " :");
			}
			var s = buffer[x].toString(16);
			strbuffer.push(""+s.length == 1 ? "0" + s : s);
			
			if(x%8==3 || x %8 == 7) {
				strbuffer.push("|");
			}
			if(x%16 == 15) {
				
				var b = [];
				for(var y = x - 15 ;y < x+1;y++) {
					if(buffer[y] == 0 || buffer[y] == 10 || buffer[y] == 13) {
						b.push(".");
					} else {
						b.push(String.fromCharCode( buffer[y] ));
					}
				}
				strbuffer.push(b.join("") );
				strbuffer.push("\r\n");
			}
		}
		console.log(strbuffer.join(" "));
	}
}
