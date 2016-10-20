
// us-layout


var csi = '\033[';
var attributes = undefined;
var output_owner = process.stdout;
var output = process.stdout.write;
var xy = {};
var stdin = process.stdin;
stdin.setRawMode( true );

stdin.setEncoding( 'utf8' );
var dataKey = -1;
stdin.on( 'data', function( key ){
	dataKey = key;
	var s = [];
	var t = [];
	for(var x = 0; x < dataKey.length;x++) {
		s.push("" + dataKey.charCodeAt(x));
		t.push(dataKey.charCodeAt(x));
	}
	if(dataKey.length==1 && t[0]==8) {
		console.log("BACKSPACE");
	} else if(dataKey.length==1 && t[0]==9) {
		console.log("TAB");
	} else if(dataKey.length==1 && t[0]==13) {
		console.log("ENTER");
	} else if(dataKey.length==1 && t[0]==32) {
		console.log("SPACE");
	} else if(dataKey.length==1 && t[0]==27) {
		console.log("ESCAPE");
	} else if(dataKey.length==1 && t[0]==33) {
		console.log("!");
	} else if(dataKey.length==1 && t[0]==64) {
		console.log("@");
	} else if(dataKey.length==1 && t[0]==35) {
		console.log("#");
	} else if(dataKey.length==1 && t[0]==36) {
		console.log("$");
	} else if(dataKey.length==1 && t[0]==37) {
		console.log("%");
	} else if(dataKey.length==1 && t[0]==94) {
		console.log("^");
	} else if(dataKey.length==1 && t[0]==38) {
		console.log("&");
	} else if(dataKey.length==1 && t[0]==42) {
		console.log("*");
	} else if(dataKey.length==1 && t[0]==40) {
		console.log("(");
	} else if(dataKey.length==1 && t[0]==41) {
		console.log(")");
	} else if(dataKey.length==1 && t[0]==45) {
		console.log("-");
	} else if(dataKey.length==1 && t[0]==95) {
		console.log("_");
	} else if(dataKey.length==1 && t[0]==61) {
		console.log("=");
	} else if(dataKey.length==1 && t[0]==43) {
		console.log("+");
	} else if(dataKey.length==1 && t[0]==59) {
		console.log(";");
	} else if(dataKey.length==1 && t[0]==39) {
		console.log("'");
	} else if(dataKey.length==1 && t[0]==44) {
		console.log(",");
	} else if(dataKey.length==1 && t[0]==46) {
		console.log(".");
	} else if(dataKey.length==1 && t[0]==47) {
		console.log("/");
	} else if(dataKey.length==1 && t[0]==58) {
		console.log(":");
	} else if(dataKey.length==1 && t[0]==60) {
		console.log("<");
	} else if(dataKey.length==1 && t[0]==62) {
		console.log(">");
	} else if(dataKey.length==1 && t[0]==63) {
		console.log("?");
	} else if(dataKey.length==1 && t[0]==34) {
		console.log("\"");
	} else if(dataKey.length==1 && t[0]==91) {
		console.log("[");
	} else if(dataKey.length==1 && t[0]==93) {
		console.log("]");
	} else if(dataKey.length==1 && t[0]==92) {
		console.log("\\");
	} else if(dataKey.length==1 && t[0]==96) {
		console.log("`");
	} else if(dataKey.length==1 && t[0]==123) {
		console.log("{");
	} else if(dataKey.length==1 && t[0]==124) {
		console.log("|");
	} else if(dataKey.length==1 && t[0]==125) {
		console.log("}");
	} else if(dataKey.length==1 && (t[0]>= 48 && t[0] <=57)) {
		console.log(""+(t[0]-48));
	} else if(dataKey.length==1 && (t[0]>= 97 && t[0] <=122)) {
		var t0 = "abcdefghijklmnopqrstuvwxyz";
		console.log(""+t0.charAt(t[0]-97));
	} else if(dataKey.length==1 && (t[0]>= 65 && t[0] <=90)) {
		var t0 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		console.log(""+t0.charAt(t[0]-65));
	} else if(dataKey.length==3 && t[0] == 27 && t[1]==91) {
		if(t[2] == 68) {
			console.log("LEFT");
		} else if(t[2] == 67) {
			console.log("RIGHT");
		} else if(t[2] == 65) {
			console.log("UP");
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
		
	write(dataKey.length + ",keycode:"+s.join(","));
	stdin.pause();
});
function getkey() {
	stdin.resume();	
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
	write(csi+n+'@');
}
function del(n) {
	write(csi+n+'P');
}
function right(n) {
	
	write(csi+n+'C');
}
function left(n) {
	write(csi+n+'D');
}
function up(n) {
	write(csi+n+'A');
}
function down(n) {
	write(csi+n+'B');
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
/*
gotoxy(10,10);
write("B");
cleartoeol();
gotoxy(5,10);
write("B");
*/
clear();
gotoxy(1,1);
getkey();
