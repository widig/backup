

// require Interpreter.js

Interpreter = (function() {

	
	function PreParser(micro_format) { // return micro format, with graph reduction
		/*
			"alpha" : [ // compile to mapping
				x [ 
					y [1,"a",0] 
				]
			]
		*/
		for(var key in micro_format) {
			var el = micro_format[key];
			
			if(key.indexOf("[charset]")!=-1) { // this will remove order of evaluation to a single evaluation if possible
				var charset = {};
				var sel = [];
				var seli = 0;
				for(var x = 0; x < el.length;x++) {
					for(var y = 0; y < el[x].length;y++) {
						var item = el[x][y];
						if(item[0]==1 && item[1].length==1 && item[2]==0 && el[x].length==1) {
							//console.log("\t",x,y,"\"" + item[1] + "\"");
							charset[ item[1] ] = true;
							sel.push(x);
						}
					}
				}
				if(sel.length>0)  {
					while(sel.length>0) {
						el.splice( sel.pop(), 1 );
					}
					el.push( [ [ 3, charset, 0 ] ] );
					//console.log(JSON.stringify(el));
					var nkey = key.replace("[charset]","");
					micro_format[nkey] = micro_format[key];
					delete micro_format[key];
				}
			}
		}
		//console.log();
		//console.log(JSON.stringify(micro_format));
		return micro_format;
		
	}
	function Parser(doc,micro_format,global_context) { // filter
		// 0 rule
		// 1 string
		
		function postParser(target) {
			//console.log("IN:",target[0][0],target[0][1]);
			var p = [target,0,""];
			var item = p[0];
			var rule = micro_format[ item[0][0] ][ item[0][1] ];
			var has_parent = false;
			//console.log("BEFORE",item[0][0]);
			var val = [];
			
			for(var x = rule.length; x>= 1; x--) {
				if( rule[x-1][0] == 0) { // rule
					var m = postParser(item[x]);
					p[2] = m.string + p[2];
					val.unshift(m);
				} else if(rule[x-1][0] == 1) { // string
					p[2] = item[x] + p[2];
					val.unshift({
						type : 1,
						string : item[x]
					});
				} else if(rule[x-1][0] == 3) { // charset
					p[2] = item[x] + p[2];
					val.unshift({
						type : 3,
						string : item[x]
					});
				} else if(rule[x-1][0] == 4) { // anychar
					p[2] = item[x] + p[2];
					val.unshift({
						type : 4,
						string : item[x]
					});
				} else if(rule[x-1][0] == 5) { // empty
					val.unshift({
						type : 5,
						string : ""
					});
				}
				item.pop();
			}
			//console.log("OUT:",target[0][0],target[0][1],p[2]);
			target[0] = {
				ruleName : target[0][0],
				ruleIndex : target[0][1],
				type : 0,
				string : p[2],
				value : val
			};
			//console.log("AFTER",item[0][0],p[2]);
			return target[0];
		}
		function inParser(target,range) {
			var str = "";
			var rule = micro_format[ target[0][0] ][ target[0][1] ];
			for(var x = range-1; x>= 0; x--) {
				try {
					if( rule[x][0] == 0) { // rule
						var m = inParser(target[1+x], micro_format[ target[1+x][0][0] ][ target[1+x][0][1] ].length);
						str = m.string + str;
					} else if(rule[x][0] == 1) { // string
						str = target[1+x] + str;
					} else if(rule[x][0] == 2) { // string
						str = target[1+x] + str;
					} else if(rule[x][0] == 3) { // charset
						str = target[1+x] + str;
					} else if(rule[x][0] == 4) { // anychar
						str = target[1+x] + str;
					} else if(rule[x][0] == 5) { // empty
						
					}
				} catch(e) {
					//console.log(x,rule,e);
				}
			}
			return {
				ruleName : target[0][0],
				ruleIndex : target[0][1],
				string : str
			};
		}
		var debug = false;
		if("debug" in global_context)
			debug = !!global_context.debug;
		
		var result = false;
		var format = micro_format;
		
		var data_args = [["main",0]];
		for(var x = 0; x < micro_format[ "main" ][ 0 ][ 0 ].length;x++)
			data_args.push([]);
		var stack = [ [ ["main",0], 0, 0, 0 /*start at*/, 0 /*count*/, data_args /*data*/, 0 /*mode*/] ];
		var x = 0;
		var cur = null;
		var cache = {};
		
		for(;x < doc.length;) {
			var state = 0;
			if(debug) console.log("ch:",doc.charAt(x));
			while(stack.length>0) {
				cur = stack[stack.length-1];
				//console.log(cur[0]);
				if(debug) console.log(JSON.stringify(stack));
				var substate = 0;
				var item = micro_format[ cur[0][0] ][ cur[1] ][ cur[2] ];
				
				cur[5][0][1] = cur[1];
				cur[0][1] = cur[1];
				
				if(item[0]==7) { // this rule to get into
					if(item[2]==0) {
						var data1 = inParser( cur[5], cur[2] );
						var nr = item[1](data1.string);
						// if(debug) 
							// console.log("Q:","["+data1.string+"]","A:",nr);
						item[0] = 8;
						item[1] = [ nr, item[1] ];
					}
				}
				
				// console.log("KEY:",cur[0]);
				// if("javascript" in global_context && global_context.javascript)
				
				while( item[0] == 0 || item[0] == 8) { // rule -> auto get in
					if(item[0]==0) {
						
						var data_args = [ [item[1],0] ];
						for(var y = 0; y < micro_format[ cur[0][0] ][ cur[1] ].length;y++) data_args.push([]);
						stack.push( [ [item[1],0], 0, 0, x, 0, data_args, item[2] ] );
						//if(debug) console.log("push ",item[1]);
						//if(debug) console.log(cur[0],cur[1],cur[2],format[cur[0]]);
						cur = stack[ stack.length-1 ];
						cur[5][0][1] = cur[1];
						cur[0][1] = cur[1];
						try {
							item = micro_format[ cur[0][0] ][ cur[1] ][ cur[2] ];
						} catch(e) {
							console.log("!! rule not found:",cur[0][0],cur[1],cur[2]);
							throw e;
						}
						substate = 0; // try subrule
						
					}
					if(item[0]==8) { // currently losing track of what rule was choosed.
						item[0] = 7;
						//console.log("??",item[1][0]);
						var data_args = [ [item[1][0],0] ];
						for(var y = 0; y < micro_format[ cur[0][0] ][ cur[1] ].length;y++) data_args.push([]);
						stack.push( [ [item[1][0],0], 0, 0, x, 0, data_args, item[2]] );
						cur = stack[ stack.length-1];
						cur[5][0][1] = cur[1];
						cur[0][1] = cur[1];
						
						item[1] = item[1][1];
						
						item = micro_format[ cur[0][0] ][ cur[1] ][ cur[2] ];
						substate = 0;
					}
				}
				
				if(item[0]==1) { // string
					var r1 = doc.indexOf( item[1], x ) == x; 
					if( item[2] == 0 ) { // true
						if( r1 ) {
							//console.log(cur,item[1]);
							cur[ 5 ][ 1 + cur[2] ] = item[1];
							substate = 1;
							x += item[1].length;
						} else {
							if(debug) console.log("not found",item[1],x);
							substate = 2;
						}
					} else if(item[2]== 1) { // false
						if( r1 ) {
							
							cur[1] = micro_format[cur[0][0]].length; // fail rule going end of subrules
							
							// console.log("BIG FAIL");
							substate = 2; // fail, then go to next subrule
						} else {
							substate = 2;
						}
					}
				} else if(item[0]==2) {
					console.log("[[LANG]]");
					if( (x + "_" + cur[0][0]) in cache ) {
						if(item[2]==0) {
							cur[ 5 ][ 1 + cur[2] ] = cache[(x + "_" + cur[0][0])];
							substate = 1;
							x += cur[ 5 ][ 1 + cur[2] ].length;
						} else {
							substate = 2;
						}
					} else {
						if( item[2] == 0) {
							global_context.javascript = true;
							global_context.filter = item[3].filter;
							//console.log("!!!",item[3]);
							var r = Parser(doc.substring(x),PreParser(item[1]),global_context);
							delete global_context.filter;
							delete global_context.javascript;
							if(r[1]) {
								var dt = doc.substring(x,x+r[0]);
								cache[ x + "_" + cur[0][0] ] = dt;
								cur[ 5 ][ 1 + cur[2] ] = dt;
								substate = 1;
								console.log("PARSED >>"+dt+"<<");
								x += dt.length;
							} else {
								substate = 2;
							}
						}
					}
					console.log("[[/LANG]]");
				} else if(item[0]==3) { // charset
					if(item[2] == 0) {
						var ch = doc.substring(x,x+1)
						if( ch in item[1] ) {
							cur[5][0][1] = cur[1];
							cur[ 5 ][ 1 + cur[2] ] = ch;
							substate = 1;
							x += 1;
						} else {
							substate = 2;
						}
					} else if(item[2]==1) {
						var ch = doc.substring(x,x+1)
						if( ch in item[1] ) {
							cur[1] = format[cur[0][0]].length;
							substate = 2;
						} else {
							substate = 2;
						}
					}
				} else if(item[0]==4) { // any
					if(item[2]==0) {
						if(x+1 < doc.length) {
							cur[ 5 ][ 1 + cur[2] ] = doc.substring(x,x+1);
							substate = 1;
							x += 1;
						} else {
							substate = 2;
						}
					} else if(item[2]==1) {
						if(x+1 < doc.length) {
							cur[1] = micro_format[cur[0][0]].length;
							substate = 2;
						} else {
							substate = 2;
						}
					}
				} else if(item[0]==5) { // empty
					if(item[2]==0) {
						cur[ 5 ][ 1 + cur[2] ] = "";
						substate = 1;
					} else if(item[2]==1) { // disable this subrule by enqueue a [5,"",1], enable by shifting [ 5,"",1 ]
						cur[1] = micro_format[cur[0][0]].length;
						substate = 2;
					}
				} 
				
				if(substate==1) { // rule
					
					if(debug) console.log("!! FOUND",x,item[1],item[1].length,doc.length);
					if(x == doc.length) {
						// fail
						if(debug) console.log("FOUND END");
					}
					while(true) {
						//console.log("B");
						if( ( cur[2] + 1 ) <  micro_format[ cur[0][0] ][ cur[1] ].length ) {
							cur[2] += 1; // next item on subrule
							if(debug) console.log("NEXT SUBRULE",JSON.stringify(cur));
							break;
						} else {
							//console.log("Z");
							if(debug) console.log("END SUBRULE",JSON.stringify(cur));
							var first = false;
							if( cur[4] == 0)
								first = true;
							cur[4] += 1;
							// final, then ok
							if(stack.length>0) {
								// before popping, copy all data to upper stack
								
								stack.pop();
								if(stack.length>0) {
									var parent = stack[ stack.length-1 ];
									parent[ 5 ][ 1 + parent[2] ] = cur[5];
								
									cur = stack[stack.length-1];
									item = micro_format[ cur[0][0] ][ cur[1] ][ cur[2] ];
									
									if(cur[6]==1) { // an ok rule that need to fail
										cur[1] = micro_format[cur[0][0]].length;
										//console.log("BIG FAIL");
										substate = 2; // fail, then go to next subrule
										break;
									}
								} else {
									if(cur[6]==1) { // an ok rule that need to fail
										//console.log("BIG FAIL");
									}
								}
							} else {
								//console.log("BREAK");
								break;
							}
							
						}
					}
					if(debug) console.log(JSON.stringify(stack));		
					if(debug) console.log("new x:",x);
				}
				
				
				if(substate==2) {
					// fail
					var substate2 = 1;
					// try next subrule
					//x = cur[3];
					while(true) {
						if( ( cur[1] + 1 ) <  micro_format[ cur[0][0] ].length ) {
							cur[1] += 1;
							cur[2] = 0;
							substate2 = 0;
							if(debug) console.log("NEXT SUBRULE");
							break;
						} else {
							if(stack.length>0) {
								stack.pop();
							}
							if(stack.length>0) {
								cur = stack[stack.length-1];
								item = micro_format[cur[0][0]][cur[1]][cur[2]];
							} else {
								break;
							}
						}
					}
					
					// next subrule not found
					if(substate2==1) {
						state = 1; // stack is empty
						if(debug) console.log("STACK IS EMPTY:",stack.length==0);
						break;
					}
					
					x = cur[3]; // backtrack
					
					if(debug) console.log("BACKTRACK");
					if(debug) console.log("X:",x);
				}
				
				
			}
			if(debug) console.log("STATE:",state);
			if(state==1) {
				if(debug) console.log("FAIL");
				break;
			}
			if(stack.length==0) {
				if(state==2 || state==0) {
					if(debug) console.log("OK",cur[4]);
					result = true;
					break;
				} else {
					if(debug) console.log("FAIL");
					break;
				}
				
			}
			if(debug) console.log("NEXT",x,doc.length);
		}
		if(result) {
			
			var r = postParser(cur[5]);
			//console.log(JSON.stringify(r));
			
			function walk(target,context) {
				//console.log(JSON.stringify(target));
				var stack = [[target,0]];
				if("boot" in context)
					context.boot(context);
				var handlers = {};
				// mount filters
				for( var f in context.filter) {
					var parts = f.split(".");
					context.filter[f].name = parts;
					//console.log("F:",f,parts);
					if( !(parts[ parts.length-1] in handlers))
						handlers[ parts[ parts.length-1] ] = [];
					handlers[ parts[ parts.length-1] ].push( context.filter[f] );
				}
				
				while(stack.length>0) {
					var p = stack.pop();
					if(p[0].type==0) {
						var name = [p[0].ruleName];
						for(var z = stack.length-1; z >=0;z--) {
							name.push( stack[z][0].ruleName );
						}
						//name = p[0].ruleName;
						name = name.join(".");
						//console.log(name,p[0].string);
						if(p[1]==0) {
							
							if(p[0].ruleName in handlers) {
								//console.log(p[0].ruleName);
								var check = false;
								for(var z = 0; z < handlers[p[0].ruleName].length;z++) {
									var filter = handlers[p[0].ruleName][z];
									check = false;
									for(var y = 0; y < filter.name.length;y++) {
										//console.log( "     ",filter.name[ filter.name.length-1-y ], p[0].ruleName, stack[ stack.length-1-y][0].ruleName,filter.name.length,y );
										if( y== 0 && filter.name[ filter.name.length-1-y ] != p[0].ruleName ) {
											//console.log("A");
											check = true;
											break;
										} else if( y>0 && filter.name[ filter.name.length-1-y] != stack[ stack.length-y][0].ruleName) {
											//console.log("B");
											check = true;
											break;
										}
									}
									if(!check) {
										if("before" in filter) {
											var lctx = filter.before;
											if("select" in lctx) {
												var args = [];
												for(var y = 0; y < lctx.select.length;y++) {
													if( lctx.select[y] < p[0].value.length ) {
														args.push( p[0].value[ lctx.select[y] ].string );
													} else {
														args.push("");
													}
												}
												//console.log("calling handler",p[0].ruleName);
												lctx.handler(global_context, p[0].ruleIndex, args);
											} else {
												var args = [];
												for(var y = 0; y < p[0].value.length;y++)  {
													if( y < p[0].value.length) {
														args.push(p[0].value[ y ].string );
													} else {
														args.push("");
													}
												}
												//console.log("calling handler");
												lctx.handler(global_context,p[0].ruleIndex,args);
											}
										}
									}
								}
								
							}
						}
						if(p[1] < p[0].value.length) {
							stack.push( [ p[0], p[1] + 1] );
							stack.push( [ p[0].value[ p[1] ], 0 ] );
							
							//console.log(p[0].ruleName, p[0].value[ p[1] ].ruleName);
							
						} else {
							//console.log("END");
							if(p[0].ruleName in handlers) {
								//console.log(p[0].ruleName);
								var check = false;
								for(var z = 0; z < handlers[p[0].ruleName].length;z++) {
									var filter = handlers[p[0].ruleName][z];
									check = false;
									for(var y = 0; y < filter.name.length;y++) {
										//console.log( "     ",filter.name[ filter.name.length-1-y ], p[0].ruleName, stack[ stack.length-1-y][0].ruleName,filter.name.length,y );
										if( y== 0 && filter.name[ filter.name.length-1-y ] != p[0].ruleName ) {
											//console.log("A");
											check = true;
											break;
										} else if( y>0 && filter.name[ filter.name.length-1-y] != stack[ stack.length-y][0].ruleName) {
											//console.log("B");
											check = true;
											break;
										}
									}
									if(!check) {
										if("after" in filter) {
											var lctx = filter.after;
											if("select" in lctx) {
												var args = [];
												for(var y = 0; y < lctx.select.length;y++) {
													if( lctx.select[y] < p[0].value.length) {
														args.push( p[0].value[ lctx.select[y] ].string );
													} else {
														args.push("");
													}
												}
												lctx.handler(global_context,p[0].ruleIndex, args);
											} else {
												var args = [];
												for(var y = 0; y < p[0].value.length;y++) {
													if( y < p[0].value.length) {
														args.push(p[0].value[ y ].string );
													} else {
														args.push("");
													}
												}
												lctx.handler(global_context,p[0].ruleIndex, args);
											}
											
											
										}
									}
								}
								
							}
						}
					}
				}
				
				if("shutdown" in context)
					context.shutdown(context);
					
			}
			
			
			
			walk(r,global_context);
			
			return [x,result,global_context];
		}
		return [x,result];
	}

	return {
		pre : PreParser,
		parser : Parser
	};
	
})();
