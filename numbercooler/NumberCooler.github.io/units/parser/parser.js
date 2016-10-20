
// set stable 1.0
// already parses partial
// 1.5 have events and timeout
// 2.0 reduce loops: x X | x by using first x that was parsed ok -> maybe hard to debug, specially if add a function that changes context

var lang = {};
lang.charset = function(str) {
	var r = [];
	for(var x = 0; x < str.length;x++) r.push( [ [1,str.charAt(x)] ]);
	return r;
}
lang.html = {
	main : [ 
		[ [0,"tags"] ]
	],
	alpha  : lang.charset("a"),
	word : [
		[ [0,"alpha"], [0,"word"] ],
		[ [0,"alpha"] ]
	],
	tag : [
		[ [1,"<"], [0,"word"], [1,">"] ]
	],
	tags : [
		[ [0,"tag"], [0,"tags"] ],
		[ [0,"tag"] ]
	]
};
function Parser(json,doc,opts) {
	var r = ["main",{rule:0},[]];
	var cur = json.main;
	var stack = [["main",cur,0 /*2 rule*/,0 /*3 token*/,0 /*4 state*/, 0 /* backtrack */, r]];
	var pos = 0;
	var last = 0;
	// set start time
	var tabs = function(n) {
		var str = [];
		for(var x = 0; x < n;x++) str.push("    ");
		return str.join("");
	}
	
	var debug = 1;
	
	while(stack.length>0) {
		// check timeout
		var check = true;
		var stack_item = stack.pop();
		var statement_name = stack_item[0];
		var statement = stack_item[1];
		var rule = stack_item[2];
		var token = stack_item[3];
		var $token = statement[ rule ][ token ];
		console.log(tabs(stack.length)+"cur:"+statement_name);
		
		stack_item[6][1].rule = rule;
		//console.log(tabs(stack.length)+JSON.stringify(r)+"::",JSON.stringify(stack_item[6]));
		//console.log();
		//console.log(doc,"[",statement_name,rule,token,"] pos:",pos,"type:",$token[0],"state:",stack_item[4],JSON.stringify(stack));
		if(pos >= doc.length) {
			//console.log("break", JSON.stringify(stack_item),JSON.stringify(stack));
			//break;
		}
		if( stack_item[4] == -1) { // fail
			if(debug==1) console.log(1);
			//console.log(":: fail rule");	
			last = 0;
			pos = stack_item[5];
			if( rule + 1 >= statement.length) { // fail statement -> will fail at trying a loop
				if(debug==1) console.log(2);
				if(stack.length>0) {
					if(debug==1) console.log(3);
					stack[ stack.length -1 ][4] = -1;
				}
			} else {
				if(debug==1) console.log(4);
				stack_item[2] += 1;
				stack_item[3] = 0;
				stack_item[4] = 0;
				
				// trying next rule, clear all items
				var len = stack_item[6][2].length;
				while(len>0) {
					stack_item[6][2].pop();
					len -= 1;
				}
				stack.push( stack_item );
				
			}
		} else if(stack_item[4] == 0) {
			
			if( $token[0] == 0 ) {
				
				if($token[1] in json) {
					if(debug==1) console.log(6);
					stack_item[4] = 0;
					var t = [];
					t[0] = $token[1];
					console.log(tabs(stack.length+1)+$token[1]);
					t[1] = {rule:0};
					t[2] = [];
					stack_item[6][2].push( t );
					stack.push(stack_item);
					stack.push([$token[1],json[$token[1]],0,0,0,pos, t]);
				} else {
					throw "not found: " + $token[1];
				}
			} else if( $token[0] == 1) {
				if(debug==1) console.log(7);
				var check = true;
				if(pos >= doc.length) {
					check = false;
				} else {
					for(var x = 0; (x < $token[1].length) && (pos +x < doc.length);x++) {
						if($token[1][x] != doc.charAt(pos+x)) {
							check = false;
							break;
						}
					}
				}
				if( check ) {
					if(debug==1) console.log(8);
					console.log("ok",$token[1],pos,$token[1].length);
					stack_item[6][2].push( [$token[1],{ at : pos },[] ]);
					
					last = 1;
					pos += $token[1].length;
					if( token + 1 >= statement[rule].length ) { // found rule
						if(debug==1) console.log(9);
						if(stack.length>0) {
							if(debug==1) console.log(10);
							stack[ stack.length-1][4] = 1;
						}
					} else {
						if(debug==1) console.log(11);
						// next token
						stack_item[3] += 1;
						stack_item[4] = 0;
						stack.push(stack_item);
					}
				} else {
					if(debug==1) console.log(12);
					//console.log("fail",$token[1]);
					last = 0;
					pos = stack_item[5]; // backtrack
					if( rule + 1 >= statement.length) {
						if(debug==1) console.log(13);
						if(stack.length>0) {
							if(debug==1) console.log(14);
							
							stack[ stack.length - 1 ][4] = -1;
						}
					} else {
						if(debug==1) console.log(15);
						stack_item[2] += 1;
						stack_item[3] = 0;
						stack_item[4] = 0;
						var len = stack_item[6][2].length;
						while(len>0) {
							stack_item[6][2].pop();
							len -= 1;
						}
						stack.push(stack_item);
					}
				}
			} else if($token[0] == 2) { // empty
				if(debug==1) console.log(17);
				last = 1;
				if( token + 1 >= statement[rule].length ) { // found rule
					if(debug==1) console.log(18);
					if(stack.length>0) {
						if(debug==1) console.log(19);
						stack[ stack.length-1][4] = 1;
					}
				} else {
					if(debug==1) console.log(20);
					stack_item[3] += 1;
					stack_item[4] = 0;
					stack.push(stack_item);
				}
			} else if($token[0] == 3) { // any char
				if(debug==1) console.log(21);
				if( pos + 1 < doc.length) {
					if(debug==1) console.log(22);
				}
			} else {
				throw "rule " + rule[0]
			}
		} else if(stack_item[4] == 1) {
			if(debug==1) console.log(23);
			if( token + 1 >= statement[rule].length ) {
				if(debug==1) console.log(24);
				if(stack.length>0) {
					// this is will dequeue, parent state is unkown
					
					// check if has more tokens
					var parent = stack[stack.length-1];
					if( parent[3] + 1 >= parent[1][ parent[2] ].length ) { // found rule
						if(debug==1) console.log(25);
						if(stack.length>0) {
							if(debug==1) console.log(10);
							parent[4] = 1;
						}
					} else {
						if(debug==1) console.log(26);
						// next token
						parent[3] += 1;
						parent[4] = 0;
					}
					//if(debug==1) console.log(25);
					//stack[ stack.length-1 ][4] = 1;
					
					
					
				}
			} else {
				if(debug==1) console.log(27);
				// rule has next token
				//console.log("!",JSON.stringify(stack));
				stack_item[3] += 1;
				stack_item[4] = 0;
				stack.push(stack_item);
			}
		}
	}
	if(debug==1) console.log(28);
	return {
		document : doc,
		tree : last == 1 ? r : null,
		result : last == 1,
		lastChar : pos
	}
}
console.log( JSON.stringify( Parser(lang.html,"<a><bc\">") ) );
//console.log( JSON.stringify( Parser(lang.html,"<a>") ) );
//console.log( JSON.stringify( Parser(lang.html,"<a><a><a><a>") ) );
//console.log( JSON.stringify( Parser(lang.html,"<aa><a>") ) );
