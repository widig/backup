var http = require("http");
var fs = require("fs");
var lpath = require("path");
var os = require("os");
var _process = process;
var JSZip = require("./jszip");
var SHA3 = require("./sha3.js");


var shell = function(id) {
	this.id = id;
	this._cwd = _process.cwd();
};

shell.prototype.ls = function(id,path) {
	if(id!=this.id) throw "access denied";
	if(!path) {
		var items = fs.readdirSync(this._cwd);
		var ret = {};
		ret.files = [];
		ret.directories = [];
		for(var x = 0; x < items.length;x++) {
			var stat = fs.lstatSync(this._cwd + lpath.sep + items[x]);
			if(stat.isDirectory()) {
				ret.directories.push(items[x]);
			} else if(stat.isFile()) {
				ret.files.push(items[x]);
			
			}
		}
		return ret;
	}
};
shell.prototype.cwd = function(id) {
	if(id!=this.id) throw "access denied";
	return this._cwd;
};
shell.prototype.cd = function(id,path) {
	if(id!=this.id) throw "access denied";
	if(!path) return this._cwd;
	if(path.indexOf("..")==0) { // parent
		if(path=="..") {
			var parts = this._cwd.split(lpath.sep)
			parts.pop();
			this._cwd = parts.join(lpath.sep);
		}
	} else if(path.indexOf(".")==0) { // relative
		
	} else if(path.indexOf("/")==0) { // absolute
	
	} else {
		var path = this._cwd + "/" + path;
		if(fs.existsSync(path)) {
			var stat = fs.lstatSync(path);
			if(stat.isDirectory()) {
				var path = lpath.resolve(path);
				console.log(path);
				this._cwd = path;
			}
		} else {
			console.log("not valid directory.");
		}
	}
}
shell.prototype.mkdir_force = function(id,target) {
	if(id!=this.id) throw "access denied";
	var r = [ this.exists(target), this.isdir(target) ];
	if(r[0] && !r[1]) this.rm(target);
	if(!r[0] || !r[1]) this.mkdir(target);
	
};
shell.prototype.mkdir = function(id,path) {
	if(id!=this.id) throw "access denied";
	if(!path) return;
	if(path.indexOf("..")==0) { // parent
	} else if(path.indexOf(".")==0) { // relative
	} else if(path.indexOf("/")==0) { // absolute
	} else {
		var path = this._cwd + "/" + path;
		if(!fs.existsSync(path)) {
			fs.mkdirSync(path);
		} else {
			console.log("path already exists.");
		}
	}
};
shell.prototype.exists = function(id,path) {
	if(id!=this.id) throw "access denied";
	if( fs.existsSync(path) ) {
		return true;
	}
	return false;
};
shell.prototype.isdir = function(id,path) {
	if(id!=this.id) throw "access denied";
	if( fs.existsSync(path) ) {
		var s = fs.lstatSync(path);
		if( s.isDirectory() )
			return true;
		return false;
	} else {
		return false;
	}
};
shell.prototype.isfile = function(id,path) {
	if(id!=this.id) throw "access denied";
	if( fs.existsSync(path) ) {
		var s = fs.lstatSync(path);
		if( s.isFile() )
			return true;
		return false;
	} else {
		return false;
	}
};
shell.prototype.copy = function(id,path1,path2) {
	if(id!=this.id) throw "access denied";
	console.log("copy from ",path1," to ",path2);
	
	fs.createReadStream(path1).pipe(fs.createWriteStream(path2));
	
	
};
shell.prototype.rm = function(id,path) {
	if(id!=this.id) throw "access denied";
	if(this.isfile(path)) {
		fs.unlinkSync(path);
	} else if(this.isdir(path)) {
		deleteFolderRecursive = function(path) {
			var files = [];
			if( fs.existsSync(path) ) {
				files = fs.readdirSync(path);
				files.forEach(function(file,index){
					var curPath = path + "/" + file;
					if(fs.lstatSync(curPath).isDirectory()) { // recurse
						deleteFolderRecursive(curPath);
					} else { // delete file
						fs.unlinkSync(curPath);
					}
				});
				fs.rmdirSync(path);
			}
		};
		deleteFolderRecursive(path);
	}
};
shell.prototype.read = function(id,file) {
	if(id!=this.id) throw "access denied";
	return fs.readFileSync(file);
};
shell.prototype.readUtf8 = function(id,file) {
	if(id!=this.id) throw "access denied";
	return fs.readFileSync(file,"UTF-8");
};
shell.prototype.echo =function(id,file,data) {
	if(id!=this.id) throw "access denied";
	fs.writeFileSync(file,data);
};
shell.prototype.zip = function(id,file,options) {
	if(id!=this.id) throw "access denied";
	var zf = new JSZip();
	if(options.mode == "read") {
		console.log("READ");
		var data = fs.readFileSync(file);
		var zf = new JSZip(data,"binary");
		if( !("data" in options) ) options.data = {};
		for(var f in options.data) {
			console.log( f);
			options.data[f] = zf.file(f).asText();
		}
		return options.data;
	} else if(options.mode == "list") {
		var data = fs.readFileSync(file);
		var zf = new JSZip(data);
		var ret = {};
		for (var f in zf.files) {
			//console.log( zf.files[f] );
			ret[ zf.files[f].name ] = true;
		}
		return ret;
	} else if(options.mode == "add") {
		var data = fs.readFileSync(file);
		var zf = new JSZip(data);
		for(var f in options.data) {
			zf.file( f, options.data[f] );
		}
		var buffer = zf.generate({type:"nodebuffer"});
		fs.writeFileSync(file, buffer);
	} else if(options.mode == "remove") {
		var data = fs.readFileSync(file);
		var zf = new JSZip(data);
		for(var f in options.data) {
			zf.remove( f );
		}
		var buffer = zf.generate({type:"nodebuffer"});
		fs.writeFileSync(file, buffer);
	} else if(options.mode == "blank") {
		var zf = new JSZip();
		var buffer = zf.generate({type:"nodebuffer"});
		fs.writeFileSync(file, buffer);
	} else if(options.mode == "write") {
		var zf = new JSZip();
		// add files
		for(var f in options.data) {
			zf.file( f, options.data[f] );
		}
		var buffer = zf.generate({type:"nodebuffer"});
		fs.writeFileSync(file, buffer);
	}
};

function StringTools() {

}
StringTools.prototype.toHex = function(val) {
	var alpha = [
		"0","1","2","3",
		"4","5","6","7",
		"8","9","A","B",
		"C","D","E","F"
	];
	var sb = [];
	for(var x = 0; x < val.length;x++) {
		var c = (val.charCodeAt(x) >>>0)
		sb.push( alpha[ (c & 0xF0)>>4 ] + alpha[ ( c & 0xF ) ] );
	}
	return sb.join("");
}

StringTools.prototype.fromHex = function(val) {
	var alpha = {
		"0":0,"1":1,"2":2,"3":3,
		"4":4,"5":5,"6":6,"7":7,
		"8":8,"9":9,"A":10,"B":11,
		"C":12,"D":13,"E":14,"F":15
	};
	var sb = [];
	for(var x = 0; x < val.length;x+=2) {
		sb.push( String.fromCharCode( (alpha[ val.charAt(x) ] << 4 ) | alpha[ val.charAt(x+1) ] ) );
	}
	return sb.join("");
}


/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = { // not default 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._$",
	
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}
StringTools = new StringTools();
StringTools.atob = function(str) {
	return Base64.decode(str);
}
StringTools.btoa = function(str) {
	return Base64.encode(str);
}


function HandlerArguments() {
}

function Server() {
	var sessions = {};
	
	function handler2(req,res,qs) {
		var arr_url = req.url.split('?');
		var base_url = arr_url[0];
		
		
		
		
		var sent = false;
		var process = {};
		
		var nbase_url = base_url;
		
		// var nbase_url = (base_url in router[req.method] ? base_url : "*");
		// var found = nbase_url in router[req.method];
		//var ntype = found && "type" in router[req.method][nbase_url] ? router[req.method][ nbase_url].type : "invalid";
		var enabled = true; //found && (!("enabled" in router[req.method][nbase_url]) || router[req.method][nbase_url].enabled);
		
		
		// get ip
		var machine_ip = req.headers['x-forwarded-for'] || 
			req.connection.remoteAddress || 
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;
		//console.log("    ip:",machine_ip);
		
		
		console.log(
			[ "[" + machine_ip + "]:[", req.method, nbase_url,"]"].join(" ")
		);
		for(var header in req.headers) {
			console.log("    "  + header+":"+req.headers[header]);
		}
		
		if("referer" in req.headers) {
			if(req.headers.referer.indexOf("http://localhost/")!=0) {
				console.log("500 WRONG REFERER",req.headers.referer,req.url);
				//console.log("500 WRONG REFERER");
				res.writeHead(500, [
					["Content-Type","text/plain"]
				]);
				res.end( "only localhost available" );
			}
		}
		var cookies = {};
		
		if("cookie" in req.headers) {
			//console.log("    req.cookie:",req.headers["cookie"]);
			var full_cookie = req.headers["cookie"];
			cookie_vars = full_cookie.split(";");
			for(var c in cookie_vars) {
				var item = cookie_vars[c].split("=");
				cookies[ item[0].trim() ] = item[1];
			}
		}
		
		//console.log("    qs:",qs);
		
		
		
		//console.log("    cookies:",cookies);
		console.log();
		
		console.log("  response:");
		
		
		
		if(!("id0" in cookies)) { // set machine
			// block DoS

			
			// generate machine session
			
			process.cookie = {};
			var alpha = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
			while(true) {
				var code = [];
				for(var x = 0; x < 2*8;x++) {
					code.push( alpha[ parseInt( Math.random()*16 ) ] );
				}
				code = code.join("");
				if(!(code in sessions)) {	
					// associate ip with machine
					sessions[code] = {
						ip : machine_ip,
						port : [],
						clients : {}
					}
					process.cookie["id0"] = code;
					break;
				}
			}	
		} else {
			// check ip
			if( cookies.id0 in sessions ) { // verify machine
				if( sessions[cookies.id0].ip == machine_ip) {
					// load data in memory if it is stored.
					process.cookie = {};
					process.cookie["id0"] = cookies.id0;
					//console.log( sessions[cookies.id0].ip, machine_ip);
					//throw "bad";
				} else {
					// generate machine session
					process.cookie = {};
					var alpha = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
					while(true) {
						var code = [];
						for(var x = 0; x < 2*8;x++) {
							code.push( alpha[ parseInt( Math.random()*16 ) ] );
						}
						code = code.join("");
						if(!(code in sessions)) {	
							// get ip
							sessions[code] = {
								ip : machine_ip,
								port : [],
								clients : {}
							}
							process.cookie["id0"] = code;
							break;
						}
					}
					
				}
			} else {
				
				// treat as if was first contact.
				// generate machine session
				process.cookie = {};
				var alpha = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
				while(true) {
					var code = [];
					for(var x = 0; x < 2*8;x++) {
						code.push( alpha[ parseInt( Math.random()*16 ) ] );
					}
					code = code.join("");
					if(!(code in sessions)) {	
						// get ip
						sessions[code] = {
							ip : machine_ip,
							port : [],
							clients : {}
						}
						process.cookie["id0"] = code;
						break;
					}
				}
				
			}
		}
		
		var has_auth = false;
		var client_cookie = "";
		if( (process.cookie["id0"] in sessions) && 
			("cookie" in qs) &&
			( qs["cookie"] != "" ) &&
			( qs["cookie"] in sessions[ process.cookie["id0"] ].clients )
		) {
			client_cookie = qs["cookie"];
			has_auth = true;
		}
		
		var target = null;
		if( "csrf" in qs) {
			for(var x = 0; x < sessions[ process.cookie["id0"] ].port.length;x++) {
				console.log( sessions[ process.cookie["id0"] ].port[x].ccode )
				if( sessions[ process.cookie["id0"] ].port[x].ccode == qs["csrf"] ) {
					target = sessions[ process.cookie["id0"] ].port[x];
				}
			}
		}
		
		var header = [];
		var build = [];
		
		var path = nbase_url.split("/");
		var base_path = _process.cwd() + lpath.sep + ".." + lpath.sep + "NumberCooler.github.io" + lpath.sep;
		var server_path = _process.cwd() + lpath.sep;
		if(nbase_url.charAt(0)=="/") path.shift();
		if(nbase_url=="/") path[0] = "index.html";
		path = base_path + path.join(lpath.sep);
		console.log("    path:",path);
		
		
		
		if( nbase_url == "/action" ) { // prioritary json services
			throw "disabled."; // it requires a planned environment.
			if( "data" in qs ) {
				// qs["data"]
				
				var str = StringTools.fromHex( qs["data"] );
				var json = JSON.parse(str);
				
				//console.log(str);
				console.log("    method:",json.method);
				if(json.method=="index.refresh") {
					// save new json
					
					
				} else if(json.method=="auth") {
					
					/*
						var hash = SHA3.sha3_512.create();
						for(var i = 0;i < bytes.length;++i) {
						  hash.update([bytes[i]]);
						}
						hash.hex()=="";
					*/
				} else if(json.method=="command") {
					
					var sh = null;
					var id = 0;
					if(!("shell" in sessions[ process.cookie["id0"] ])) {
						id = sessions[process.cookie["id0"]].shellId = ( (Math.random()*256*256*256)>>>0 );
						sh = sessions[ process.cookie["id0"] ].shell = new shell(id);
						console.log("A");
					} else {
						id = sessions[process.cookie["id0"]].shellId;
						sh = sessions[ process.cookie["id0"] ].shell;
						console.log("B");
					}
					process.code = 200;
					process.mime = "application/json";
					var r = { result : true };
					
					if(json.data == "ls") {
						r.data = sh.ls(id,"");
					} else if(json.data=="cwd") {
						r.data = sh.cwd(id,"");
					} else if(json.data.indexOf("cd ")==0) {
						var arr = json.data.split(" ");
						arr.shift();
						console.log("cd " + arr.join(" "));
						sh.cd(id,arr.join(" "));
						r.data = sh.cwd(id,"");
					}
					build.push(JSON.stringify(r));
					console.log("C");
				} else if(json.method == "save") {
					console.log("    name:",json.name);
					var id = 0;
					
					if(!("shell" in sessions[ process.cookie["id0"] ])) {
						id = sessions[process.cookie["id0"]].shellId = ( (Math.random()*256*256*256)>>>0 );
						sh = sessions[ process.cookie["id0"] ].shell = new shell(id);
						console.log("A");
					} else {
						id = sessions[process.cookie["id0"]].shellId;
						sh = sessions[ process.cookie["id0"] ].shell;
						console.log("B");
					}
					
					var start = "data:image/jpeg;base64,";
					if(json.value.indexOf(start)==0) {
						fs.writeFile(_process.cwd() + lpath.sep + "movies"  + lpath.sep + json.name + ".jpeg", 
							json.value.substring(start.length), 
							'base64', 
							function(err){
								if (err) throw err
								console.log('File saved.')
							})
					}
					//
					//data: '.mime_content_type($image).';base64,
					
					process.code = 200;
					process.mime = "application/json";
					build.push(JSON.stringify({result:true}));
					
				} else if(json.method == "load") {
					process.code = 200;
					process.mime = "application/json";
					build.push(JSON.stringify({result:true}));
					
				} else if(json.method == "timeline") {
					
				} else if(json.method == "push") {
					var calendar_protocol = {
						"0" : "request_calendar_display",
						"1" : "store_calendar_display"
					};
					for(var x in json) {
						console.log("@@@",x);
						
					}
					if("data" in json) {
						var strlen = 0;
						if( Object.prototype.toString.apply(json.data)=="[object String]" )
							strlen = json.data.length;
						if(strlen > 1000) {
							throw "bad socket";
						}
						console.log(JSON.stringify( json),json.data.length );
						if( json.data.length == 2 && calendar_protocol[ json.data[0] ] == "store_calendar_display") {
							var sh = null;
							var id = 0;
							if(!("shell" in sessions[ process.cookie["id0"] ])) {
								id = sessions[process.cookie["id0"]].shellId = ( (Math.random()*256*256*256)>>>0 );
								sh = sessions[ process.cookie["id0"] ].shell = new shell(id);
								console.log("A");
							} else {
								id = sessions[process.cookie["id0"]].shellId;
								sh = sessions[ process.cookie["id0"] ].shell;
								console.log("B");
							}
							var file = "."+lpath.sep+"ProFiles"+lpath.sep+"calendar_display.info";
							var data = "";
							if( sh.exists(id,file) ) 
								data = sh.readUtf8(id,file);
							console.log("write A",json.data);
							fs.writeFileSync(file,data + "" + json.data[1] + "\r\n");
							console.log("write B");
							process.code = 200;
							process.mime = "application/json";
							build.push( JSON.stringify({ result: true }) );
						} else if( json.data.length == 1 && calendar_protocol[ json.data[0] ] == "request_calendar_display" ) {
							
							var sh = null;
							var id = 0;
							if(!("shell" in sessions[ process.cookie["id0"] ])) {
								id = sessions[process.cookie["id0"]].shellId = ( (Math.random()*256*256*256)>>>0 );
								sh = sessions[ process.cookie["id0"] ].shell = new shell(id);
								console.log("A");
							} else {
								id = sessions[process.cookie["id0"]].shellId;
								sh = sessions[ process.cookie["id0"] ].shell;
								console.log("B");
							}
							var file = "."+lpath.sep+"ProFiles"+lpath.sep+"calendar_display.info";
							var data = "";
							if( sh.exists(id,file) )  data = sh.readUtf8(id,file);
							var arr = data.split("\r\n");
							process.code = 200;
							process.mime = "application/json";
							if(arr.length>1)
								console.log("request:",arr[arr.length-2]);
							if(arr.length>0) {
								build.push(JSON.stringify({result:true , data : arr[arr.length-2] }));
							} else {
								build.push(JSON.stringify({result:true, data : "1" }));
							}
						} else {
							process.code = 200;
							process.mime = "application/json";
							build.push( JSON.stringify({ result: false }) );
						}
					} else {
						process.code = 200;
						process.mime = "application/json";
						build.push( JSON.stringify({ result: false }) );
					}
				}
			}
		} else {
			function index_html(process,build) {
				var index = JSON.parse( fs.readFileSync(base_path + "/index.json") );
				var doc = [];
				doc.push("<!--\r\n\
NumberCooler\r\n\
	options:\r\n\
		1)\r\n\
		request credentials at:\r\n\
		https://www.facebook.com/NumberCooler-127742840944252/\r\n\
		anonymous not allowed.\r\n\
		2)\r\n\
		anonymous:\r\n\
		copy and paste on your localhost and deal with the code by yourself.\r\n\
		it's on github, if you don't know this, you are wasting time with this source.\r\n\
// -->\r\n\
<!doctype html>\r\n\
<head>\r\n");
				for(var x = 0; x < index.javascript.length;x++) {
					doc.push("    <script src=\"" + index.javascript[x] + "\"></script>\r\n");
				}
				for(var x = 0; x < index.styles.length;x++) {
					doc.push("    <link rel=\"stylesheet\" href=\"" + index.styles[x] + "\"/>");
				}
				doc.push("</head>\r\n<body></body>\r\n</html>");
				fs.writeFileSync(base_path + "/index.html",doc.join(""));
				process.code = 200;
				process.mime = "text/html";
				build.push(doc.join(""));
				
				// must update index.json
				
			}
			var scripts = {
				"/sample/video.mp4" : function(process,build) {
					process.code = 200;
					process.mime = "video/mp4";
					process.stream = server_path + "resources/►8-Bit Electro Gaming Mix Sept 2015 ◄ (-￣▽￣)-.mp4";
					
				},
				"/js/build/ppu.js" : function(process,build) {
					process.code = 200;
					process.mime = "application/javascript";
					var files = [
						base_path+"/js/works/ppu/header.txt"
						, base_path+"/js/jsbn.js"
						, base_path+"/js/works/ppu/fix.js" // this is because html sandbox
						, base_path+"/js/Interpreter.js"
						, base_path+"/js/Languages.LOGICUNIT.js"
						, base_path+"/js/works/ppu/index.js"
					];
					var result = [];
					for(var x = 0; x < files.length;x++) {
						var data = fs.readFileSync(files[x]);
						result.push(data);
						build.push(data);
					}
					fs.writeFileSync(base_path + "/js/build/ppu.js",result.join("") );
					
					
					
				},
				"/js/build/nctg.js" : function(process,build) {
					process.code = 200;
					process.mime = "application/javascript";
					var files = [
						base_path+"/js/works/nctg/index.js"
					];
					var result = [];
					for(var x = 0; x < files.length;x++) {
						var data = fs.readFileSync(files[x]);
						result.push(data);
						build.push(data);
					}
					fs.writeFileSync(base_path + "/js/build/nctg.js",result.join("") );
				},
				"/" : function(process,build) {
					index_html(process,build);
				},
				"/index.html" : function(process,build) {
					index_html(process,build);
				}
			};
			var routed = false;
			for(var url in scripts) {
				if(nbase_url == url) {
					// route
					routed = true;
					scripts[url](process,build);
					break;
				}
			}
			
			
			if(!routed) {
				if( !fs.existsSync(path) ) {
					if(path.indexOf("notfound")>=0) {
						process.code = 200;
						var ext = lpath.extname(path);
						if( ext == ".html" ) {
							process.mime = "text/html";
							build.push("<!doctype html><html></html>");
						} else if( ext == ".css" ) {
							process.mime = "text/css";
							build.push("");
						} else if( ext == ".js" ) {
							process.mime = "application/javascript";
							build.push("");
						} else {
							process.code = 404;
							process.mime = "text/html";
							build.push("<!doctype html><html><body>404</body></html>");
						}
					} else {
						process.code = 404;
						process.mime = "text/html";
						build.push("<!doctype html><html><body>404</body></html>");
					}
				} else {
					process.code = 200;
					var ext = lpath.extname(path);
					if( ext == ".html" ) {
						process.mime = "text/html";
						if(path.indexOf("notfound")>=0) {
							build.push("<!doctype html><html></html>");
						} else {
							build.push(fs.readFileSync( path ));
						}
					} else if( ext == ".css" ) {
						process.mime = "text/css";
						if(path.indexOf("notfound")>=0) {
							build.push("");
						} else {
							build.push(fs.readFileSync( path ));
						}
					} else if( ext == ".txt") {
						process.mime = "text/plain";
						if(path.indexOf("notfound")>=0) {
							build.push("");
						} else {
							build.push(fs.readFileSync( path ));
						}
					} else if( ext == ".js" ) {
						process.mime = "application/javascript";
						if(path.indexOf("notfound")>=0) {
							build.push("");
						} else {
							build.push(fs.readFileSync( path ));
						}
					} else if( ext == ".svg") {
						process.mime = "image/svg+xml";
						build.push(fs.readFileSync( path ));
					} else if( ext == ".obj") {
						process.mime = "text/plain";
						build.push(fs.readFileSync( path ));
					} else if( ext == ".mp3") {
						process.mime = "audio/mpeg";
						process.stream = path;
						//var data = fs.readFileSync( path, "binary" );
						//header.push( [ 'Content-Length', data.length ] );
						//build.push(data);
						
					} else if( ext == ".png") {
						process.mime = "image/png";
						//process.stream = true;
						process.stream = path;
						//var data = fs.readFileSync( path, "binary" );
						
						//header.push( [ 'Content-Length', data.length ] );
						//build.push(data);
						
					} else if(ext == ".glsl") {
						process.mime = "text/plain";
						build.push(fs.readFileSync( path ));
					} else {
						process.code = 500;
						//console.log( "500 ERROR FILE FORMAT ",path );
						
						
						process.mime = "text/html";
						build.push("<!doctype html><html><body>500</body></html>");
						
					}
				}
			}
		}
		
		if("cookie" in process) {
			for(var key in process.cookie) {
				header.push(["Set-Cookie", key + "=" + process.cookie[key] + ";Path=/;"] );
			}
		}
		
		
		//header.push( [ 'Last-Modified', new Date().toUTCString() ] );
		
		header.push( [ 'Content-Type', process.mime ] );
		//console.log(header);
		
		res.writeHead(process.code, header);
		for(var hkey in header) {
			console.log("    "+header[hkey][0].toLowerCase() + ":" + header[hkey][1])
		}
		
		if("stream" in process) {
			fs.createReadStream(process.stream).pipe(res);
		} else {
			res.end( build.join("") );
		}
	}
	function handler(req,res) {
		console.log("================================================================================");
		console.log(JSON.stringify(sessions));
		var arr_url = req.url.split('?');
		var base_url = arr_url[0];
		arr_url.shift();
		arr_url = arr_url.join("").split("&");
		var qs = {};
		for(var x = 0; x < arr_url.length;x++) {
			var obj = arr_url[x].split('=');
			qs[ obj[0] ] = obj[1];
		}
		if (req.method == 'POST') {
			console.log("[200] " + req.method + " to " + req.url);
			var cbuffer = [];
			req.on('data', function(chunk) {
				cbuffer.push( chunk.toString());
			});
			req.on('end', function() {
				var arr = cbuffer.join("").split("&");
				for(var x = 0; x < arr.length;x++) {
					var obj = arr[x].split("=");
					qs[ obj[0] ] = obj[1];
				}
				handler2(req,res,qs);
			});
		} else {
			handler2(req,res,qs);
		}
		
	}
	
	this.server = http.createServer(handler);
	this.server.on("error",function(err) {
		console.log("err:",err);
	});
	
}
Server.prototype.addHandler = function(name,method,pattern,tags,callback) { // callback return HandlerArguments

}
Server.prototype.removeHandler = function(name) {
	
}
Server.prototype.listHandlers = function() {
	
}

Server.prototype.start = function() {
	this.server.listen(80, "127.0.0.1");
}
Server.prototype.stop = function() {
	
}
function main() {
	var server = new Server();
	// install handlers
	server.start();
	server.listHandlers();
}

main();

