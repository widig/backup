var StringMap = Admin({cmd:"load"},"StringMap","./StringMap.js");
var Lang = Admin({cmd:"load"},"Lang","./Lang.js");

function Go(doc,lang,start,reserved) {
	var debug = false;
	
	var ret = {};
	var packet = null;
	var run = false;
	if(!lang) {
		// loads lang from default language
		console.log("IS RUNNING?",Lang({cmd:"isRunning"},"main"));
		
		// if (this) is in client
		if( Lang({cmd:"isBooted"},"main") ) {
			console.log("not booted");
			lang = Lang({cmd:"use"},"main").lang;
			start = "main";
		} else {
			console.log("booting");
			// if (this) is in server
			var default_lang = Lang({cmd:"set"},"default","../go/default_lang.js");
			
			var lang_obj = Lang({cmd:"boot"},"main","default");
			lang = lang_obj.lang;
			// console.log( "@A",JSON.stringify(lang) );
			start = "main";
		}
		run = true;
	}
	
	if(debug) console.log("GO!",start);
	options = reserved || {
		map : StringMap(doc),
		count : 100,
		backtrack : 0,
		pos : 0,
		cached : {},
		vars : {},
		errors : []
	};
	if(!("map" in options)) {
		options.map = StringMap(doc);
	}
	if(!("count" in options)) {
		options.count = 100;	
	}
	if(!("backtrack" in options)) {
		options.backtrack = 0;	
	}
	if(!("vars" in options)) {
		options.vars = {};
	}
	if(!("cached" in options)) {
		options.cached = {};
	}
	if(!("pos" in options)) {
		options.pos = 0;
	}
	if(!("errors" in options)) {
		options.errors = [];
	}
	if(!("comments" in options)) {
		options.comments = [];
	}
	if(!("callstack" in options)) {
		options.callstack = [start];
	} else {
		options.callstack.push(start);
	}
	
	options.count -= 1;
	if(options.count == 0) {
		if(debug) console.log("error");
		return { result : false, error : true };
	}
	
	
	
	
	
	var parsed = false;
	var backtrack = options.pos;
	var map = options.map;
	var ruleIndex = -1;
	var ruleData = [];
	//console.log(start,lang);
	if( start in lang ) {
		for(var x = 0; x < lang[ start ].length; x++) { // rules
			ruleIndex = x;
			ruleData = [];
			if(debug) console.log("start:",start);
			var rule = true;
			options.pos = backtrack;
			for(var y = 0; y < lang[ start ][x].length;y++) { // rule items
				if( lang[ start ][x][y][0] == 0 ) { // rule test
					var startPos = options.pos;
					var r = Go(doc,lang, lang[ start ][x][y][1], options);
					if(debug) console.log("back to",start,r);
					if(r.result) {
						ruleData.push({
							index : r.index,
							type:0,name:lang[ start ][x][y][1],
							range:[ startPos, options.pos],
							data:r.data
						});
					} else {
						rule = false;
						break;
					}
				} else if( lang[ start ][x][y][0] == 1 ) { // string
					if(debug) console.log("error1?",options.pos,x,y,lang[start][x][y]);
					if( lang[ start ][x][y][1].length > 0) {
						if(lang[ start ][x][y][1].length > (doc.length - options.pos) ) {
							if(debug) console.log("pattern is greater than input.");
							rule = false;
							break;
						} else {
							var useCase = false;
							var useCapitalLetter = false;
							if( lang[ start ][x][y].length == 3 && "ignoreCase" in lang[ start ][x][y][2] && lang[ start ][x][y][2].ignoreCase) {
								useCase = true;
							}
							if( lang[ start ][x][y].length == 3 && "capitalLetter" in lang[ start ][x][y][2] && lang[ start ][x][y][2].capitalLetter) {
								useCapitalLetter = true;
							}
							var regions = null;
							if(useCase) {
								var first_lower = lang[ start ][x][y][1].charAt(0).toLowerCase();
								var first_upper = lang[ start ][x][y][1].charAt(0).toUpperCase();
								var regions = map.where( first_lower );
								var regions2 = map.where( first_upper );
								regions =  regions.concat( regions2 );
							} else {
								regions = map.where( lang[ start ][x][y][1].charAt(0) );
							}
							//console.log("error?",start,x,y,lang[ start ][x][y][1],lang[ start ][x][y][1].charAt(0),regions,regions.length);
							var arr1 = [];
							var arr2 = [];
							for(var z = 0; z < lang[start][x][y][1].length;z++) arr1.push(lang[start][x][y][1].charCodeAt(z));
							for(var z = 0; z < doc.substring(options.pos).length && z < lang[start][x][y][1].length;z++) arr2.push( doc.charCodeAt(z+options.pos) );
							//console.log("test string:",lang[start][x][y][1],doc.substring(options.pos),arr1,arr2);
							var testLen = regions.length;
							var check = false;
							while(testLen>0) {
								var r = regions.shift();
								var c = true;
								for(var z = 1; z < lang[ start ][x][y][1].length;z++) {
									//console.log(r,z,doc.charAt(r+z));
									if(useCase) {
										var cur_lower = lang[ start ][x][y][1].charAt(z).toLowerCase();
										var cur_upper = lang[ start ][x][y][1].charAt(z).toUpperCase();
										if( cur_upper != doc.charAt(r+z) && cur_lower != doc.charAt(r+z) ) {
											c = false;
											break;
										}
									} else {
										if( lang[ start ][x][y][1].charAt(z) != doc.charAt(r+z) ) {
											c = false;
											break;
										}
									}
								}
								if(c) {
									regions.push(r);	
								}
								testLen -= 1;
							}
							// change to cache
							options.cached[ start + ":" + y ] = regions;
							for(var z = 0; z < regions.length;z++) {
								if(regions[z] == options.pos) {
									check = true;
									break;
								}
							}
							//console.log(">>",check,regions,lang[start][x][y][1],options.pos,map.where(lang[ start ][x][y][1].charAt(0)),map);
							if(!check) {
								if (debug) console.log( "pattern string \"" + lang[start][x][y][1] + "\" was not found.");
								rule = false;
								break;
							} else {
								var startPos = options.pos;
								options.pos += lang[ start ][x][y][1].length;
								ruleData.push({type:1,range:[startPos,options.pos]});
							}								
						}
					} else {
						// true for this rule = empty
					}
				} else if( lang[ start ][x][y][0] == 4 ) { // charset
					if( doc.length> 0 && doc.length - options.pos > 0 && lang[ start ][x][y][1].indexOf( doc.charAt(options.pos) ) !=-1 ) {
						//console.log("HERE",doc.charAt(options.pos),lang[start][x][y][1]);
						var startPos = options.pos;
						options.pos += 1;
						ruleData.push({type:4,range:[startPos,options.pos]});
					} else {						
						rule = false;
						break;
					}
				} else if( lang[ start ][x][y][0] == 3 ) { // array of rule (+)
					var startPos = options.pos;
					var dataArray = [];
					var r = Go(doc,lang, lang[ start ][x][y][1], options);
					var ci = 0;
					if(debug) console.log("back to",start);
					if(r.result) {
						dataArray.push(r);
						while(r.result) {
							ci += 1;
							var miniback2 = options.pos;
							r = Go(doc,lang, lang[ start ][x][y][1], options);
							if(debug) console.log("back to",start);
							if(!r.result) {
								options.pos = miniback2;
							} else {
								dataArray.push(r);
							}
						}
						ruleData.push({type:3,count:ci,range:[startPos,options.pos],data:dataArray});
					} else {
						options.pos = startPos;
						rule = false;
						break;
					}
				} else if( lang[ start ][x][y][0] == 2 ) { // empty
					ruleData.push({type:2});
				} else if(lang[ start ][x][y][0] == 5) { // code range
					if( 
						doc.length> 0 && 
						(doc.length - options.pos) > 0 && 
						doc.charCodeAt(options.pos) >= lang[ start ][x][y][1] && 
						doc.charCodeAt(options.pos) <= lang[ start ][x][y][2] 
					) {
						var startPos = options.pos;
						options.pos += 1;
						ruleData.push({type:5,range:[startPos, options.pos]});
					} else {
						rule = false;
						break;
					}
				} else if(lang[start][x][y][0] == 6) { // array of rule(*)
					var miniback = options.pos;
					var dataArray = [];
					var r = Go(doc,lang, lang[ start ][x][y][1], options);
					if(debug) console.log("back to",start);
					var ci = 0;
					if(r.result) {
						dataArray.push(r);
						while(r.result) {
							ci += 1;
							var miniback2 = options.pos;
							r = Go(doc,lang, lang[ start ][x][y][1], options);
							if(debug) console.log("back to",start);
							if(!r.result) {
								options.pos = miniback2;	
							} else {
								dataArray.push(r);
							}
						}
						ruleData.push({type:6,count:ci,range:[miniback,options.pos],data:dataArray});
					} else {
						options.pos = miniback;
						ruleData.push({type:6,count:0,range:[miniback,options.pos],data:[]});
					}
				} else if(lang[start][x][y][0] == 7) { // typed array {n,m}					
					var min = lang[start][x][y][2];
					var max = lang[start][x][y][3];
					var ci = 0;
					var miniback = options.pos;
					var dataArray = [];
					var r = Go(doc,lang,lang[start][x][y][1],options);
					if(r.result) {
						dataArray.push(r);					
						while(r.result) {
							ci += 1;
							if( ci >= max ) {
								break;
							}
							var miniback2 = options.pos;
							r = Go(doc,lang,lang[start][x][y][1],options);
							if(!r.result) {
								options.pos = miniback2;
							} else {
								dataArray.push(r);
							}
						}
						if(ci < min) {
							rule = false;
							break;
						}
						if(rule) {
							ruleData.push({type:7,count:ci,range:[miniback,options.pos],data:dataArray});
						}
					} else {
						options.pos = miniback;
						if(min>0) {
							rule = false;
							break;
						} else {
							ruleData.push({type:7,count:0,range:[miniback,miniback],data:dataArray});
						}
					}						
				} else if(lang[start][x][y][0] == 8) { // set var function
					// 8, target, function, args
					var arr = [];
					for(var z = 0; z < lang[start][x][y][3].length;z++) {
						arr.push( options.vars[ lang[start][x][y][3][z] ] );
					}
					var data = lang[start][x][y][2].apply(null,arr);
					options.vars[ lang[start][x][y][1] ] = data;
					ruleData.push({type:8,range:[options.pos,options.pos],key:lang[start][x][y][1],value:data});
				} else if(lang[start][x][y][0] == 9) { // unset var
					// 9, target
					delete options.vars[ lang[start][x][y][1] ];
					ruleData.push({type:9,range:[options.pos,options.pos],key:lang[start][x][y][1]});
				} else if(lang[start][x][y][0] == 10) { // choice path by var, first path is first bit, second path is second bit
					// 10, target, paths
					var data = options.vars[ lang[start][x][y][1] ];
					var startPos = options.pos;
					var dataArray = [];
					var ruleArray = [];
					for(var z = 0; z < lang[start][x][y][2].length;z++) {
						if( (data & (1<<z)) > 0 ) {
							var r = Go(doc,lang,lang[start][x][y][2][z],options);
							if(r.result) {
								dataArray.push(r);
								ruleArray.push(lang[start][x][y][2][z]);
							} else {
								rule = false;
								break;
							}
						}
					}
					if(rule == false) break;
					else {
						ruleData.push({type:10,value:data,range:[startPos,options.pos],data:dataArray,rules:ruleArray});
					}
				} else if(lang[start][x][y][0] == 11) { // anychar
					if( 
						doc.length> 0 && 
						(doc.length - options.pos) > 0
					) {
						var startPos = options.pos;
						options.pos += 1;
						ruleData.push({type:11,range:[startPos, options.pos]});
					} else {
						rule = false;
						break;
					}
				} else if(lang[start][x][y][0] == 12) { // error
					options.errors.push([options.pos,lang[start][x][y][1]]);
					rule = false;
					break;
				} else if(lang[start][x][y][0] == 13) { // if
					var miniback = options.pos;
					var r = Go(doc,lang, lang[ start ][x][y][1], options);
					if(r.result) {
						options.pos = miniback;
						ruleData.push({type:13, rule: lang[ start ][x][y][1]});
					} else {
						rule = false;
						break;
					}
				} else if(lang[start][x][y][0] == 14) { // ifn
					var miniback = options.pos;
					var r = Go(doc,lang, lang[ start ][x][y][1], options);
					if(!r.result) {
						options.pos = miniback;
						ruleData.push({type:14, rule: lang[ start ][x][y][1]});
					} else {
						rule = false;
						break;
					}
				} else if(lang[start][x][y][0] == 15) {
					options.comments.push( lang[start][x][y][1] );
				} else {
					console.log("item code:",JSON.stringify(lang));
					throw "unkown rule item type";
				}
			}
			if(rule == true) {
				parsed = true;
				break;
			}
		}
	} else {
		throw "unkown " + start + " in given language";
	}
	if(debug) console.log(parsed,start,backtrack,options.pos);
	options.callstack.pop();
	ret.result = parsed;
	ret.name = start;
	ret.index = ruleIndex;
	ret.data = ruleData;
	if(ret.data.length>0) {
		ret.range = [
			backtrack,
			options.pos
		]
	}
	ret.errors = options.errors;
	ret.comments = options.comments;
	ret.code = doc;
	
	if(run) {
		Lang({cmd:"run"},"main",ret);
	}
	return ret;
}

Go["ruleItem"] = function(a) {
	return [0,a];
}
Go["string"] = function(a) {
	return [1,a];
}
Go["tautology"] = function() {
	return [2];
}
Go["oneOrMoreRules"] = function(a) {
	return [3,a];
}
Go["charset"] = function(a) {
	return [4,a];
}
Go["codeRange"] = function(a,min,max) {
	return [5,min,max];
}
Go["zeroOrMoreRules"] = function(a) {
	return [6,a];
}
Go["ruleAmount"] = function(a,min,max) {
	return [7,a,min,max];
}
Go["set"] = function(name,f,args) {
	return [8,name,f,args];
}
Go["unset"] = function(name) {
	return [9,name];
}
Go["choice"] = function(name,choices) {
	return [10,name,choices];
}
Go["anychar"] = function() {
	return [11];
}
Go["error"] = function(a) {
	return [12,a];
}
Go["if"] = function(a) {
	return [13,a];
}
Go["ifn"] = function(a) {
	return [14,a];
}
Go["comments"] = function(a) {
	return [15,a];
}

module.exports = Go;