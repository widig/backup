

var csi = '\033[';
var attributes = undefined;
var output_owner = process.stdout;
var output = process.stdout.write;
var xy = {};
var stdin = process.stdin;
stdin.setRawMode( true );
stdin.setEncoding( 'utf8' );
stdin.pause();

var input = {};

input.count = 0;
input.log = [];
input.buffer = [];
input.callback = null;
input.pos = [0,0];
input.pause = true;

stdin.on( 'data', function( key ){
	var dataKey = key || -1;
	var s = [];
	var t = [];
	var enter = false;
	var skip = false;
	for(var x = 0; x < dataKey.length;x++) {
		s.push("" + dataKey.charCodeAt(x));
		t.push(dataKey.charCodeAt(x));
	}
	if(dataKey.length==1 && t[0]==8) {
		if(input.buffer.length>0) {
			input.buffer.pop();
			input.count += 1;
			left(1);
			write(" ");
			left(1);
		}
		skip = true;
		
	} else if(dataKey.length==1 && t[0]==9) {
		console.log("TAB");
	} else if(dataKey.length==1 && t[0]==13) {
		enter = true;
		skip = true;
	} else if(dataKey.length==1 && t[0]==32) {
		input.buffer.push(" ");
	} else if(dataKey.length==1 && t[0]==27) {
		console.log("ESCAPE");
	} else if(dataKey.length==1 && t[0]==33) {
		input.buffer.push("!");
	} else if(dataKey.length==1 && t[0]==64) {
		input.buffer.push("@");
	} else if(dataKey.length==1 && t[0]==35) {
		input.buffer.push("#");
	} else if(dataKey.length==1 && t[0]==36) {
		input.buffer.push("$");
	} else if(dataKey.length==1 && t[0]==37) {
		input.buffer.push("%");
	} else if(dataKey.length==1 && t[0]==94) {
		input.buffer.push("^");
	} else if(dataKey.length==1 && t[0]==38) {
		input.buffer.push("&");
	} else if(dataKey.length==1 && t[0]==42) {
		input.buffer.push("*");
	} else if(dataKey.length==1 && t[0]==40) {
		input.buffer.push("(");
	} else if(dataKey.length==1 && t[0]==41) {
		input.buffer.push(")");
	} else if(dataKey.length==1 && t[0]==45) {
		input.buffer.push("-");
	} else if(dataKey.length==1 && t[0]==95) {
		input.buffer.push("_");
	} else if(dataKey.length==1 && t[0]==61) {
		input.buffer.push("=");
	} else if(dataKey.length==1 && t[0]==43) {
		input.buffer.push("+");
	} else if(dataKey.length==1 && t[0]==59) {
		input.buffer.push(";");
	} else if(dataKey.length==1 && t[0]==39) {
		input.buffer.push("'");
	} else if(dataKey.length==1 && t[0]==44) {
		input.buffer.push(",");
	} else if(dataKey.length==1 && t[0]==46) {
		input.buffer.push(".");
	} else if(dataKey.length==1 && t[0]==47) {
		input.buffer.push("/");
	} else if(dataKey.length==1 && t[0]==58) {
		input.buffer.push(":");
	} else if(dataKey.length==1 && t[0]==60) {
		input.buffer.push("<");
	} else if(dataKey.length==1 && t[0]==62) {
		input.buffer.push(">");
	} else if(dataKey.length==1 && t[0]==63) {
		input.buffer.push("?");
	} else if(dataKey.length==1 && t[0]==34) {
		input.buffer.push("\"");
	} else if(dataKey.length==1 && t[0]==91) {
		input.buffer.push("[");
	} else if(dataKey.length==1 && t[0]==93) {
		input.buffer.push("]");
	} else if(dataKey.length==1 && t[0]==92) {
		input.buffer.push("\\");
	} else if(dataKey.length==1 && t[0]==96) {
		input.buffer.push("`");
	} else if(dataKey.length==1 && t[0]==123) {
		input.buffer.push("{");
	} else if(dataKey.length==1 && t[0]==124) {
		input.buffer.push("|");
	} else if(dataKey.length==1 && t[0]==125) {
		input.buffer.push("}");
	} else if(dataKey.length==1 && (t[0]>= 48 && t[0] <=57)) {
		input.buffer.push("" + (t[0]-48));
	} else if(dataKey.length==1 && (t[0]>= 97 && t[0] <=122)) {
		var t0 = "abcdefghijklmnopqrstuvwxyz";
		input.buffer.push("" + t0.charAt(t[0]-97));
	} else if(dataKey.length==1 && (t[0]>= 65 && t[0] <=90)) {
		var t0 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		input.buffer.push("" + t0.charAt(t[0]-65));
	} else if(dataKey.length==3 && t[0] == 27 && t[1]==91) {
		if(t[2] == 68) {
			console.log("LEFT");
		} else if(t[2] == 67) {
			console.log("RIGHT");
		} else if(t[2] == 65) {
			//console.log("UP");
			if(input.log.length>0) {
				var data = input.log.pop();
				while(input.buffer.length>0) {
					input.buffer.pop();
					left(1);
					write(" ");
					left(1);
				}
				input.count += 1;
				skip = true;
				for(var x = 0; x < data.length;x++) {
					input.buffer.push(data.charAt(x));
				}
				write(data);
			}
		} else if(t[2] == 66) {
			console.log("DOWN");
		}
	} else if(dataKey.length==4 && t[0] == 27 && t[1]==91) {
		if(t[2] == 50 && t[3] == 126) {
			console.log("INSERT");
		} else if(t[2] == 51 && t[3] == 126) {
			console.log("DELETE");
		} else if(t[2] == 49 && t[3] == 126) {
			console.log("HOME");
		} else if(t[2] == 52 && t[3] == 126) {
			console.log("END");
		} else if(t[2] == 53 && t[3] == 126) {
			console.log("PAGEUP");
		} else if(t[2] == 54 && t[3] == 126) {
			console.log("PAGEDOWN");
		} else if(t[2] == 91 && t[3] == 65) {
			console.log("F1");
		} else if(t[2] == 91 && t[3] == 66) {
			console.log("F2");
		} else if(t[2] == 91 && t[3] == 67) {
			console.log("F3");
		} else if(t[2] == 91 && t[3] == 68) {
			console.log("F4");
		} else if(t[2] == 91 && t[3] == 69) {
			console.log("F5");
		}
	} else if(dataKey.length==5 && t[0]==27 && t[1]==91) {
		if(t[2] == 49 && t[3] == 55&& t[4] == 126) {
			console.log("F6");
		} else if(t[2] == 49 && t[3] == 56 && t[4] == 126) {
			console.log("F7");
		} else if(t[2] == 49 && t[3] == 57 && t[4] == 126) {
			console.log("F8");
		} else if(t[2] == 50 && t[3] == 48 && t[4] == 126) {
			console.log("F9");
		} else if(t[2] == 50 && t[3] == 49 && t[4] == 126) {
			console.log("F10");
		} else if(t[2] == 50 && t[3] == 51 && t[4] == 126) {
			console.log("F11");
		} else if(t[2] == 50 && t[3] == 52 && t[4] == 126) {
			console.log("F12");
		}
	}
	if(!skip && input.buffer[input.buffer.length-1]) {
		write(input.buffer[input.buffer.length-1]);
	}
	if((!skip && input.count == 0) || enter) {
		var data = input.buffer.join("");
		var len = input.buffer.length;
		while(len>0) { input.buffer.pop(); len-= 1; }
		input.pause = true;
		input.callback&&input.callback(data);
		if(input.pause == true) {
			stdin.pause();
		}
		return;
	} else if(!skip && input.count>0) {
		input.count -= 1;
	}
});

function getkey(callback) {
	input.count = 1;
	input.callback = callback || null;
	if(input.pause == true) stdin.resume();	
	input.pause = false;
}
function getnkeys(n,callback) {
	input.count = n-1;
	input.callback = callback || null;
	if(input.pause == true) stdin.resume();
	input.pause = false;
}

var fg = {
	black:csi+'30m',
	red:csi+'31m',
	green:csi+'32m',
	yellow:csi+'33m',
	blue:csi+'34m',
	magenta:csi+'35m',
	cyan:csi+'36m',
	lightgray:csi+'37m',
	darkgray:csi+'30;1m',
	lightred:csi+'31;1m',
	lightgreen:csi+'32;1m',
	lightyellow:csi+'33;1m',
	lightblue:csi+'34;1m',
	lightmagenta:csi+'35;1m',
	lightcyan:csi+'36;1m',
	white:csi+'37;1m',
};
var bg = {
	black:csi+'40m',
	red:csi+'41m',
	green:csi+'42m',
	yellow:csi+'43m',
	blue:csi+'44m',
	magenta:csi+'45m',
	cyan:csi+'46m',
	white:csi+'47m',
};
var normal = csi+'0m';

/* functions */
function gotoxy(x,y) {
	write(csi+y+';'+x+'H');
}
function getxy() {
	write(csi+'6n');
}
function pushxy(name,x,y) {
	if(!name) {
		write(csi+'s');
	}
	else if(x && y) {
		xy[name.toLowerCase()] = {x:x,y:y};
	}
}
function popxy(name) {
	if(!name) {
		write(csi+'u');
	}
	else if(xy[name.toLowerCase()]){
		gotoxy(xy[name.toLowerCase()].x,xy[name.toLowerCase()].y);
	}
}
function ins(n) {
	n = n == 0 ? 0 : 1;
	if(n) write(csi+n+'@');
}
function del(n) {
	n = n == 0 ? 0 : 1;
	if(n) write(csi+n+'P');
}
function right(n) {
	n = n == 0 ? 0 : 1;
	if(n) write(csi+n+'C');
}
function left(n) {
	n = n == 0 ? 0 : 1;
	if(n) write(csi+n+'D');
}
function up(n) {
	n = n == 0 ? 0 : 1;
	if(n) write(csi+n+'A');
}
function down(n) {
	n = n == 0 ? 0 : 1;
	if(n) write(csi+n+'B');
}
function clear() {
	write(csi+'0J');
}
function cleartoeol() {
	write(csi+'0K');
}
function home() {
	gotoxy(1,1);
}
function write(str) {
	output.apply(output_owner,[str]);
}
function strlen(str) {
	return str.replace(/\033(s|u|\d+[ABCDJKLMPSTXZn]|\d+(;\d\d?)?[Hfm])/g,'').length;
}
function input2(n,callback) {
	n = n || 256;
	getnkeys(n,function(data) {
		console.log();
		callback&&callback(data);
	});
}
function terminal_quitString(n,callback) {
	n = n || 256;
	getnkeys(n,function(data) {
		console.log();
		callback&&callback(data);
		if(data != "quit") terminal_quitString(n,callback);
	});
}
function terminal(n,callback) {
	n = n || 256;
	getnkeys(n,function(data) {
		console.log();
		if(callback) {
			if(!callback(data))
				terminal(n,callback);
		}
	});
}

Ansi =  {
	del : del,
	ins : ins,
	up : up,
	down : down,
	left : left,
	right : right,
	clear : clear,
	home : home,
	cleartoeol : cleartoeol,
	write : write,
	getxy : getxy,
	gotoxy : gotoxy,
	getnkeys : getnkeys,
	getkey : getkey,
	bg : bg,
	fg : fg,
	input : input2,
	terminal_quitString : terminal_quitString,
	terminal : terminal,
	controller : input
};

function createblock(x,y,z) {
	return [
		[-1+x,1+y,z],
		[1+x,1+y,z],
		[-1+x,-1+y,z],
		[1+x,-1+y,z]
	];
}
var amb = {
	static : { // standard
		mass : {
			location : {
				"0" : [
					[ 1 ]
				]
			}
		},
		temperature : {
			location : {
				"0" : [
					[ 0 ]
				]
			}
		},
		density : { // pressure
			location : {
				"0" : [ // from ground
					[0.1,0.1,0.1]
				]
			}
		},
		mov : { // weather prediction
			location : {
				"0" : [
					[ 0, 0, 0 ],
					[ 0, 0, 0 ],
					[ 0, 0, 0 ]
				]
			}
		}
	},
	dynamic : { // objects, weather surprise (ice/storm)
		createblock(0,0,2)
	}
};
var vehicle = {
	points : [
		[-1,1,0],
		[1,1,0],
		[-1,-1,0],
		[1,-1,0]
	],
	mov : [
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0]
	],
	bugs : { // vehicle problems that input errors.
		
	}
	update : function() {
		for(var x = 0; x < this.points.length;x++) {
			for(var y = 0; y < 3;y++) {
				this.points[x][y] += this.mov[0][y];
			}
		}
		for(var x = this.points.length-1; x >= 0;x--) {
			for(var y = 0; y < 3;y++) {
				this.points[x-1][y] += this.points[x][y];
			}
		}
	}
};
setInterval(function() {
	vehicle.update();
},100);
Ansi.terminal_quitString(256,function(data) {
	console.log(data);
	if(data == "vx+") {
		
	} else if(data == "vx-") {
	
	} else if(data == "vy+") {
	
	} else if(data == "vy-") {
	
	}
	console.log(JSON.stringify(vehicle));
});

