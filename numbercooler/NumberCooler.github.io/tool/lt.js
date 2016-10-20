var fs = require("fs");
var path = require("path");
var args = [];
process.argv.forEach(function (val, index, array) {
	args.push(val);
});

if(args.length!=4) {
	console.log("****************************************************************")
	console.log();
	console.log("Purpose: change operation system line terminator from text files");
	console.log();
	console.log("script [u2w|w2u] path");
	console.log();
	console.log("****************************************************************")
	return;
}

var mode = 0;
if(args[2]=="u2w") {
	mode = 1;
} else if(args[2]=="w2u") {
	mode = 2;
}
var cwd = process.cwd();


function change_lt(file,mode) {
	if(mode) {
		var data = fs.readFileSync(file,"UTF8");
		if(mode==1) {
			data = data.split("\n").join("\r\n");
		} else if(mode==2) {
			data = data.split("\r\n").join("\n");
		}
		fs.writeFileSync( file,data );
	}
}


var cp = path.normalize(args[3]);
if(!path.isAbsolute(cp)) {
	cp = cwd + path.sep + cp;
}
//console.log(args[3]);

var mimes = [".js",".html",".htm",".css",".json",".bat"];

function mime_filter(file) {
	return ( mimes.indexOf( path.extname(path.basename(file)) )!=-1 );
}

if(fs.existsSync(cp)) {
	if( fs.lstatSync(cp).isDirectory() ) {
		var stack = [ cp ];
		while(stack.length>0) {
			var target = stack.pop();
			console.log("target",target);
			var items = fs.readdirSync(target);
			for(var x = 0; x < items.length;x++) {
				//console.log(items[x]);
				var aname = target + path.sep + items[x];
				console.log(aname);
				if( fs.lstatSync(aname).isDirectory()) {
					stack.push(aname);
				} else {
					if( mime_filter(aname) ) {
						change_lt(aname,mode);
					}
				}
			}
		}
	} else if( fs.lstatSync(cp).isFile() ) {
		if( mime_filter(cp) ) {
			change_lt(cp,mode);
		}
	}
} else {
	console.log("Path not found.");
}
