
/*
	0x09.js
*/

function CreateControl(name,custom_html,options) {
	// TODO: must process "reference" in options as a router from controls in this context
	
	var ret = {};
	ret.proto = options.proto || {};
	
	ret.from = ["WithDOMElements"];
	
	if("from" in options) ret.from = ret.from.concat(options.from);
	
	
	ret.proto.Flush = function() {
		var i = this.internal[name].data;
		var keys = [];
		for(var key in i.changes) {
			//console.log(key,i.el[key],ret.changes[key]);
			BrowserTools.setStyle( i.el[key], i.changes[key] );
			// call upcoming events
			
			var evtkeys = [];
			for(var evt in i.eventqueue) {
				if(i.eventqueue[evt].length) {
					var c = i.eventqueue[evt][0];
					for(var x = 1; x < i.eventqueue[evt].length;x++) {
						if(c != i.eventqueue[evt][x]) {
							console.log("dev message: get last or flush each change? depends on how fast it is the real solution. usually faster than 30fps is lost. using only last by now.",evt,c);
							c = i.eventqueue[evt][x];
						}
					}
					this.emit( evt, [ c ]);
				}
				evtkeys.push(evt);
			}
			for(var x = 0; x < evtkeys.length;x++) {
				i.eventqueue[ evtkeys[x] ] = {};
				delete i.eventqueue[ evtkeys[x] ];
			}
			
			keys.push(key);
			
			if("Flush" in i.el[key] ) {
				i.el[key].Flush();
			}
		}
		
		
		
		
		for(var x = 0; x < keys.length;x++) {
			i.changes[keys[x]] = null;
			delete i.changes[ keys[x] ];
		}
		
		
		//BrowserTools.setStyle( i.el[key], ret.extraChanges );
		// no need to set cause it is not css
		
		
	}
	//console.log(ret.proto);
	Class.define(name,{
		from : ret.from,
		ctor : function() {
			self = this;
			var i = this.internal[name].data = {};	
			i.name = name;
			i.$ = null;
			i.el = null;
			i.get = function(path) { return self.elementX(i,path); }
			i.linkStyle = {};
			i.attribs = {};
			i.events = {};
			i.changes = {};
			i.eventqueue = {};
			
			i.self = self;

			Object.defineProperty(this,"style",{ get : function() { return i.linkStyle; } });
			for(var key in options.boot) { 
				if(key == "$") {
					// own styles, own attributes, own events
					
				} else {
					i["style_" + key] = options.boot[key];
				}
			}
			function setp(key,kval) {
				if(key == "attribs") {
					// attrib mapping goes to setAttribute and getAttribute
					
				} else if(key == "events") {
					// install event redirection
					
					/*
					function hook(target, event ) {
						target.addEventListener(event,function() {
							var args = [].splice.apply(arguments,[0]);
							self.emit( evt, args );
						});
						this.on(event,function() {
							var args = [].slice.apply(arguments,[0]);
							if(!(event in i.events)) {
								i.events[event] = [];
							}
							i.events[event].push(args);
							console.log("REPLY?",i.events[event]);
							// emit to dom? nope, this is a custom control
							console.log(" AAA ");
							//this.emit("inner"+event,args);
							
						});
					}
					for(var evt in kval) {
						
						var arr = kval[evt].split(",");
						for(var x = 0; x < arr.length;x++) {
							// set hook over 
							if( i.el == null ) {
								
								console.log("# BEEP #",evt,kval[evt]);	
								
								
								
							} else {
								
								// nunca acontece isso porque e' a definicao de classe ( NULL TIMESPAN )
								
								console.log("# BEEP 2 #",evt,kval[evt]);	
								
								hook( i.el[ arr[x] ], evt );
								
							}
							
						}
						
					}
					*/
				} else {
					var t = Object.prototype.toString.apply(kval);
					if(t == "[object Object]") {
						var c = {};
						if( "get" in kval) c.get = function() {
							return kval.get.apply(self);
						}
						if( "set" in kval) c.set = function(val) {
							kval.set.apply(self,[val]);
						}
						Object.defineProperty(i.linkStyle,key,c);
					} else if(t == "[object String]") {
						Object.defineProperty(i.linkStyle,key,{
							get : function() { 
								var str = kval;
								var split_v1 = str.split(";");
								var arr = split_v1[0].split(",");
								if(arr.length==1) { // direct map
									var mode = 2;
									for(var x = 0; x < arr[0].length;x++) {
										if(arr[0].charAt(x)==":") {
											mode = 0;
											break;
										} else if(arr[0].charAt(x)=="=") {
											mode = 1;
											break;
										}
									}
									if(mode==0) {
										var tuple = arr[0].split(":");
										if(tuple[1].indexOf("|>")!=-1) {
											var tuple1 = tuple[1].split("|>");
											var type = tuple1[1];
											var name = tuple1[0];
											if(type == "float") {
												return parseFloat( i["style_"+ tuple[0]][ name ] ); 
											} else if(type=="integer") {
												return parseInt( i["style_"+ tuple[0]][ name ] ); 
											} else if(type=="string") {
												return "" + i["style_"+ tuple[0]][ name ];
											} else {
												throw "unknown type."
											}
											
										} else {
											return "" + i["style_"+ tuple[0]][ tuple[1] ]; 
										}
									} else if(mode==1) {
										var tuple = arr[0].split("=");
										if(tuple[1].indexOf("|>")!=-1) {
											var tuple1 = tuple[1].split("|>");
											var type = tuple1[1];
											var name = tuple1[0];
											if(type == "float") {
												return parseFloat( i.el[tuple[0]].getAttribute( name ) );
											} else if(type == "integer") {
												return parseInt( i.el[tuple[0]].getAttribute( name ) );
											} else if(type == "string") {
												return "" + i.el[tuple[0]].getAttribute( name );
											} else {
												throw "unknown type."
											}
										} else {
											return "" + i.el[ tuple[0] ].getAttribute(tuple[1]);
										}
									} else {
										throw "unknown mode.";
									}
								} else { // array
									var r1 = [];
									for(var x = 0; x < arr.length;x++) {
										
										
										var mode = 2; // unkown
										for(var y = 0; y < arr[x].length;y++) {
											if(arr[x].charAt(y)==":") {
												mode = 0;
												break;
											} else if(arr[x].charAt(y)=="=") {
												mode = 1;
												break;
											}
										}
										if(mode==0) {
											var tuple = arr[x].split(":");
											if(tuple[1].indexOf("|>")!=-1) {
												var tuple1 = tuple[1].split("|>");
												var type = tuple1[1];
												var name = tuple1[0];
												if(type == "float") {
													r1.push( parseFloat( i["style_"+ tuple[0]][ name ] ) );
												} else if(type=="integer") {
													r1.push( parseInt( i["style_"+ tuple[0]][ name ] ) );
												} else if(type=="string") {
													r1.push( "" + i["style_"+ tuple[0]][ name ] );
												} else {
													throw "unknown type."
												}
												
											} else {
												return i["style_"+ tuple[0]][ tuple[1] ]; 
											}
										} else if(mode==1) {
											var tuple = arr[x].split("=");
											if(tuple[1].indexOf("|>")!=-1) {
												var tuple1 = tuple[1].split("|>");
												var type = tuple1[1];
												var name = tuple1[0];
												if(type == "float") {
													r1.push( parseFloat( i.el[tuple[0]].getAttribute( name ) ) );
												} else if(type == "integer") {
													r1.push( parseInt( i.el[tuple[0]].getAttribute( name ) ) );
												} else if(type == "string") {
													r1.push( "" + i.el[tuple[0]].getAttribute( name ) );
												} else {
													throw "unknown type."
												}
											} else {
												r1.push( ""  + i.el[ tuple[0] ].getAttribute(tuple[1]) );
											}
										} else {
											throw "unknown mode.";
										}
										
									}
									return r1;
								}
							},
							set : function(val) {
								
								//console.log(key,val,kval);
								
								var split_v1 = kval.split(";");
								var arr = split_v1[0].split(",");
								
								for(var x = 0; x < arr.length;x++) {
									
									var mode = 2; // unkown
									for(var y = 0; y < arr[x].length;y++) {
										if(arr[x].charAt(y)==":") {
											mode = 0;
											break;
										} else if(arr[x].charAt(y)=="=") {
											mode = 1;
											break;
										}
									}
									
									if(mode==0) {
										var tuple = arr[x].split(":");
										//console.log(tuple,i);
										
										if(tuple[1].indexOf("|>")!=-1) {
											var tuple1 = tuple[1].split("|>");
											var type = tuple1[1];
											var name = tuple1[0];
											var check = false;
											if(type == "float") {
												if( parseFloat( i["style_" + tuple[0] ][ name ] ) == val ) {
													check = true;
												}
											} else if(type == "integer") {
												if( parseInt( i["style_" + tuple[0] ][ name ] ) == val ) {
													check = true;
												}
											} else if(type == "string") {
												if( (""+ i["style_" + tuple[0] ][ name ] ) == val ) {
													check = true;
												}
											} else {
												throw "unknown type."
											}
											
											if(check) {
												// set value
												
												i["style_" + tuple[0] ][ name ] = val; 
												// changes to x
												if(!( tuple[0] in i.changes)) i.changes[ tuple[0] ] = {};
												i.changes[ tuple[0] ][ name ] = val;
												//console.log("!!!!!!!!!!",!!split_v1[1],!!split_v1[1] && (split_v1[1].length < 16));
												// emit event
												console.log("pre event call");
												
												
												// 5 chamadas por disparo, muito ruim
												// empilha chamada para ser efetuada depois de setar todos os valores
												
												// enqueue event
												console.log("pre event call",split_v1[1],val);
												if(!!split_v1[1]) {
													if( ! (split_v1[1] in i.eventqueue ) ) {
														i.eventqueue[ split_v1[1] ] = [];
													}
													i.eventqueue[ split_v1[1] ].push(val);
												}
												//(!!split_v1[1]) &&split_v1[1].length < 16&& i.self.emit.apply(i.self,[split_v1[1],[val]]);
												
											} else {
												
											}
										} else {
											
											// set value
											i["style_" + tuple[0] ][ tuple[1] ] = val; 
											// changes to x
											if(!( tuple[0] in i.changes)) i.changes[ tuple[0] ] = {};
											i.changes[ tuple[0] ][ tuple[1] ] = val;
											//console.log("!!!!!!!!!!",!!split_v1[1],!!split_v1[1] && (split_v1[1].length < 16));
											
											
											
											// 5 chamadas por disparo, muito ruim
											// empilha chamada para ser efetuada depois de setar todos os valores
												
											// emit event
											console.log("pre event call",split_v1[1],val, " using ", key);
											if(!!split_v1[1]) {
												if( ! (split_v1[1] in i.eventqueue ) ) {
													i.eventqueue[ split_v1[1] ] = [];
												}
												i.eventqueue[ split_v1[1] ].push(val);
											}
											//i.eventqueue.push([i.self,split_v1[1],val]);
											
											//(!!split_v1[1]) &&split_v1[1].length < 16&& i.self.emit.apply(i.self,[split_v1[1],[val]]);
												
											
										}
									} else if(mode == 1) {
										
										//console.log("SETTING ATTRIBUTE");
										var tuple = arr[x].split("=");
										//console.log(tuple,i);
										if(tuple[1].indexOf("|>")!=-1) {
											var tuple1 = tuple[1].split("|>");
											var type = tuple1[1];
											var name = tuple1[0];
											var check = false;
											var nval = val;
											console.log(type,name,tuple[0],i.el[tuple[0]].getAttribute(name));
											if(type == "float") {
												if( parseFloat( i.el[tuple[0]].getAttribute(name) ) != val ) {
													nval = parseFloat(val);
													check = true;
												}
											} else if(type == "integer") {
												if( parseInt( i.el[tuple[0]].getAttribute(name) ) != val ) {
													nval = parseInt(val);
													check = true;
												}
											} else if(type == "string") {
												if( (""+ i.el[tuple[0]].getAttribute(name) ) != val ) {
													nval = "" + val;
													check = true;
												}
											} else {
												throw "unknown type."
											}
											if(check) {
												// set value
												i.el[tuple[0]].setAttribute( name, nval );
												
												
												// 5 chamadas por disparo, muito ruim
												// empilha chamada para ser efetuada depois de setar todos os valores
												
												console.log("pre event call",split_v1[1],val);
												if(!!split_v1[1]) {
													if( ! (split_v1[1] in i.eventqueue ) ) {
														i.eventqueue[ split_v1[1] ] = [];
													}
													i.eventqueue[ split_v1[1] ].push(val);
												}
												//(!!split_v1[1]) &&split_v1[1].length < 16&& i.self.emit.apply(i.self,[split_v1[1],[val]]);
												
												
											}
										} else {
											if(i.el[tuple[0]].getAttribute(tuple[1]) == val) {
												
											} else {
												
												i.el[ tuple[0] ].setAttribute( tuple[1], val )
												
												
												// 5 chamadas por disparo, muito ruim
												// empilha chamada para ser efetuada depois de setar todos os valores
												
												// emit event
												console.log("pre event call",split_v1[1],val);
												if(!!split_v1[1]) {
													if( ! (split_v1[1] in i.eventqueue ) ) {
														i.eventqueue[ split_v1[1] ] = [];
													}
													i.eventqueue[ split_v1[1] ].push(val);
												}
												//(!!split_v1[1]) &&split_v1[1].length < 16&& i.self.emit.apply(i.self,[split_v1[1],[val]]);
											}
										}
									} else {
										throw "unkown mode.";
									}
								}
							}
						});
					}
				}
			}
			function seta(key,kval) {
				i.attribs[key] = kval;
			}
			for(var key in options.map) {
				setp(key,options.map[key]);
			}
			
			Object.defineProperty(self,"setAttribute",{
				get : function() {
					return function(key,val) {
						if("attribs" in options.map && key in options.map.attribs) {
							
							var split_v1 = options.map.attribs[key].split(";");
							var arr = split_v1[0].split(",");
							
							var mode = 2; // unkown
							
							for(var x = 0; x < arr.length;x++) {
								
								for(var y = 0; y < arr[x].length;y++) {
									if(arr[x].charAt(y)==":") {
										mode = 0;
										break;
									} else if(arr[x].charAt(y)=="=") {
										mode = 1;
										break;
									}
								}
							
								if(mode == 0) {
									
									
									var tuple = arr[x].split(":");
									
									
									
								} else if(mode == 1) {
									
									var tuple = arr[x].split("=");
									
									var attrib_key = i.el[ tuple[0] ].getAttribute( tuple[1] );
									if(attrib_key != val ) {
										i.el[ tuple[0] ].setAttribute( tuple[1], val );
										// change
										split_v1[1]&&split_v1[1].length < 16 && i.self.emit.apply(i.self,[
											split_v1[1],
											[val]
										]);
									}
									
								} else {
									throw "unkown mode.";
								}
								
								
							}
							
							
							
						} else {
							if(val == i.attribs[key]) {
								
							} else {
								i.attribs[key] = val;
							}
						}
					}
					
				}
			});
			Object.defineProperty(self,"getAttribute",{
				get : function() {
					
					return function(key) {
						if("attribs" in options.map && key in options.map.attribs) {
							var arr = options.map.attribs[key].split(",");
							if(arr.length == 1) {
								var tuple = arr.split(":");
								return i.el[ tuple[0] ].getAttribute( tuple[1] );
							} else {
								var r1 = [];
								for(var x = 0; x < arr.length;x++) {
									var tuple = arr.split(":");
									r1.push( i.el[ tuple[0] ].getAttribute( tuple[1] ) );
								}
								return r1;
							}
						} else {
							return i.attribs[key];
						}
					}
					
				}
			});
			
			self.on("load",function() {
				
				var p = self.elementNewPacket(custom_html);
				i.$ = p.$, i.el = p.el;
				for(var key in p.el) {
					if(!(("style_"+key) in i)) {
						i["style_"+key] = {};
					}
				}
				
				
				if( "events" in options ) {
					
					console.log("BEFORE CUSTOM1 CTOR")
					
					
				}
				if("$" in options.boot) {
					BrowserTools.setStyle( self, options.boot.$ );
				}
				for(var key in options.boot) {
					if(key=="$") {
					} else {
						BrowserTools.setStyle( i.el[ key ], i["style_"+key] )
					}
				}
				
				
				
				
				
				// run before constructor
				
				options.ctor&&options.ctor.apply(self,[ i, BrowserTools.setStyle ]);
				
		
				// run after constructor
				
				// set events
				
				function set_evt(key,options) {
					self.on(key, function(e,i,$) {
						
						console.log("pre event call");
						options.events[key].apply(self,[e,self.internal[ self.internal.type ].data,BrowserTools.setStyle]);
						return true;
					});
				}
				function set_client_evt(key,target) {
					var config = { events : {} };
					config.events[ key ] = function(e) {
						//	console.log(target,i.el[target]); // i.el[target] e' o elemento que recebe o evento
						// NEED prevent default ????????
						//var from = target;
						console.log("before emit",key);
						var r = self.emit(key,[e, i, BrowserTools.setStyle  ]); // component events had the event trigger and css controls
						console.log("after emit",key);
						return r;
					};
					BrowserTools.setStyle.apply(self, [  i.el[ target ], config ]);
				}
				if( "events" in options ) {
					//console.log("AFTER CUSTOM1 CTOR")
					// options definition event for this component
					for(var key in options.events) set_evt(key,options);
					// mapping dom element call
					if( "map" in options ) {
						if("events" in  options.map) {
							for(var evt in options.map.events) {
								var arr = options.map.events[evt].split(",");
								for(var x = 0; x < arr.length;x++) {
									
									console.log("SET EVENT",evt);
									set_client_evt(evt,arr[x],x);
								}
							}
						}
					}
				}
		
				
				return true;
			});
			self.on("unload",function() {
				
				return true;
			});
		},
		proto : ret.proto
	});
	return ret;
}


