
Class.define("UI");
UI = {}; // UI.init and UI.load are the main





var BrowserTools = {};
BrowserTools.debug = function(message) {
	var e = new Error(message);
	console.error(e.stack);
}
BrowserTools.setStyle = function(target,opt,inner) {
	if("dispose" in opt) {
		
		if("events" in opt) for(var key in opt.events) {
			if( Object.prototype.toString.apply(opt.events[key]) == "[object Array]" ) {
				for(var x = 0; x < opt.events[key].length;x++ ) {
					target.removeEventListener(key,opt.events[key][x]);
				}
			} else {
				target.removeEventListener(key,opt.events[key]);	
			}
		}
		console.log("disposing.");
		
	} else {
		
		for(var key in opt) { if(key!="events" && key!="attribs" && key!="value") target.style[key] = opt[key]; } 
		if(inner) target.innerHTML = inner; 
		if("events" in opt) for(var key in opt.events) {
			if( Object.prototype.toString.apply(opt.events[key]) == "[object Array]" ) {
				if( opt.events[key].length > 1 && Object.prototype.toString.apply( opt.events[key][ 1 ] ) == "[object Boolean]" ) {
					// pwm 50%
					for(var x = 0; x < opt.events[key].length;x+=2 ) {
						target.addEventListener(key,opt.events[key][x],opt.events[key][x+1]);
					}
				} else {
					if( Object.prototype.toString.apply( opt.events[key][ opt.events[key].length -1 ] ) == "[object Boolean]" ) {
						for(var x = 0; x < opt.events[key].length;x++ ) {
							target.addEventListener(key,opt.events[key][x],opt.events[key][ opt.events[key].length -1 ]);
						}
					} else { // default
						for(var x = 0; x < opt.events[key].length;x++ ) {
							target.addEventListener(key,opt.events[key][x]);
						}	
					}
				}
			} else {
				//console.log("defining click 2",opt.events[key])
				//console.log(key);
				target.addEventListener(key,opt.events[key]);	
			}
		}
		if("attribs" in opt) for(var key in opt.attribs) target.setAttribute(key,"" + opt.attribs[key]);
		if("value" in opt) target.value = opt.value;
	}
}

BrowserTools.arraySetStyle = function(target,opt) { 
	for(var key in opt) if(key !="events" && key !="attribs" && key != "value") for(var x = 0; x < target.length;x++) target[x].style[key] = opt[key];
	if(inner) for(var x = 0; x < target.length;x++) target[x].innerHTML = inner;
	if("events" in opt) for(var key in opt.events) for(var x = 0; x < target.length;x++) target[x].addEventListener(key, opt.events[key]);
	if("attribs" in opt) for(var key in opt.attribs) for(var x = 0; x < target.length;x++) target[x].setAttribute(key, "" + opt.attribs[key]);
	if("value" in opt) for(var x = 0; x < target.length;x++) target[x].value = opt.value;
}

BrowserTools.inoutStyle = function(a,b) {
	var self = this;
	this.addEventListener("mouseover",function() { for(var key in a) self.style[key] = a[key]; });
	this.addEventListener("mouseout",function() { for(var key in b) self.style[key] = b[key]; });
}
BrowserTools.inIframe = function() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}


var JSONTools = {};
JSONTools.pretty_stringfy = function(json) {
	var debug = false;
	var cache = {};
	function tabs(n) {
		if(n in cache) return cache[n];
		cache[0] = "";
		cache[1] = "\t";
		for(var x = 2; x <= n;x++) cache[x] = cache[x-1] + "\t";
		return cache[n];
	}
	function str_format(str) {
		var ret = [];
		for(var x = 0; x < str.length;x++) {
			if(str.charAt(x) == 9 ) {
				ret.push("\\t");
			} else if(str.charAt(x) == 10 ) {
				ret.push("\\n");
			} else if(str.charAt(x) == 13 ) {
				ret.push("\\r")
			} else {
				ret.push(str.charAt(x));
			}
		}
		return "\"" + ret.join("") + "\"";
	}
	function json_obj(builder,target,level) {
		if(level==0) builder.push(tabs(level) + "{");
		var keys = [];
		for(var key in target) {
			
			keys.push(key);
		}
		keys.sort();
		for(var x = 0; x < keys.length;x++) {
			var key = keys[x];
			var val = target[ key ];
			var type = Object.prototype.toString.apply(val);
			var comma = (x>0) ? "," : " ";
			if(type == "[object String]") {
				builder.push(tabs(level+1) + comma + "\"" + key + "\" : " + str_format(val) );
			} else if(type == "[object Number]") {
				builder.push(tabs(level+1) + comma + "\"" + key + "\" : " + val );
			} else if(type == "[object Array]") {
				builder.push(tabs(level+1) + comma + "\"" + key + "\" : [");
				json_arr( builder, val, level+1);
			} else if(type == "[object Object]") {
				builder.push(tabs(level+1) + comma + "\"" + key + "\" : {");
				json_obj( builder, val, level+1);
			} else {
				throw "not implemented."
			}
		}
		if(level==0) builder.push(tabs(level) + "}");
		else builder.push(tabs(level) + "}");
	}
	function json_arr(builder,target,level) {
		
		if(level==0) builder.push(tabs(level) + "[");
		var keys = [];
		for(var key in target) keys.push(key);
		keys.sort();
		for(var x = 0; x < keys.length;x++) {
			var key = keys[x];
			var val = target[ key ];
			var type = Object.prototype.toString.apply(val);
			var comma = (x>0) ? "," : " ";
			if(type == "[object String]") {
				builder.push(tabs(level+1) + comma + str_format(val) );
			} else if(type == "[object Number]") {
				builder.push(tabs(level+1) + comma + val );
			} else if(type == "[object Array]") {
				builder.push(tabs(level+1) + comma + "[");
				json_arr( builder, val, level+1);
			} else if(type == "[object Object]") {
				builder.push(tabs(level+1) + comma + "{");
				json_obj( builder, val, level+1);
			} else {
				throw "not implemented."
			}
		}
		if(level==0) builder.push(tabs(level) + "]");
		else builder.push(tabs(level) + "]");
	}
	var build = [];
	json_obj(build,json,0);
	return build.join("\r\n");
}


if("localStorage" in window) {
	// front-end developer level protect against unawareness
	var save = window.localStorage.setItem;
	var load = window.localStorage.getItem;
	// reserved keys
	var reserved = ["index"];
	
	
	Object.defineProperty( window.localStorage, "setItem", { 
		configurable : false,
		get : function() { 
			return function(key,value) {
				if( reserved.indexOf( key ) > -1 ) {
					throw "use setReservedItem, be carefull.";
				} else {
					return save.apply(window.localStorage,[key,value]);
				}
			}
		}
	});
	Object.defineProperty( window.localStorage, "setReservedItem", { 
		configurable : false,
		get : function() { 
			return function(key,value) {
				if( reserved.indexOf( key) > -1 ) {
					return save.apply(window.localStorage,[key,value]);	
				} else {
					throw "use setItem";
				}
			}
		}
	});
	Object.defineProperty( window.localStorage, "getItem", {
		configurable : false,
		get : function() {
			return function(key) {
				if( reserved.indexOf( key ) > -1 ) {
					throw "use getReservedItem, be careful.";
				} else {
					return load.apply(window.localStorage,[key]);
				}
			};
		}
	});
	Object.defineProperty( window.localStorage, "getReservedItem",{
		configurable : false,
		get : function() {
			return function(key) {
				if( reserved.indexOf( key) > -1 ) {
					return load.apply(window.localStorage,[key]);
				} else {
					throw "use setItem";
				}
			};
		}
	});
	
}
KeyCode = {
	// us keyboard (no layout)
	
	BACKSPACE : 8,
	TAB : 9,
	ENTER : 13,
	SPACE : 32,
	SHIFT : 16,
	CTRL : 17,
	CONTROL : 17,
	ALT : 18,
	CAPSLOCK : 20,
	ESCAPE : 27,
	SCROLLLOCK : 145,
	PAUSE : 19,
	
	
	UP : 38,
	DOWN : 40,
	LEFT : 37,
	RIGHT : 39,
	
	
	INSERT : 45,
	DELETE : 46,
	HOME: 36,
	END : 35,
	PAGEUP : 33,
	PAGEDOWN : 34,
	
	
	D0 : 48,
	D1 : 49,
	D2 : 50,
	D3 : 51,
	D4 : 52,
	D5 : 53,
	D6 : 54,
	D7 : 55,
	D8 : 56,
	D9 : 57,
	
	A : 65,
	B : 66,
	C : 67,
	D : 68,
	E : 69,
	F : 70,
	G : 71,
	H : 72,
	I : 73,
	J : 74,
	K : 75,
	L : 76,
	M : 77,
	N : 78,
	O : 79,
	P : 80,
	Q : 81,
	R : 82,
	S : 83,
	T : 84,
	U : 85,
	V : 86,
	W : 87,
	X : 88,
	Y : 89,
	Z : 90,
	
	
	
	
	BACKTICK : 192,
	SLASH : 191,
	BACKSLASH : 220,
	BRACKET_LEFT : 219,
	BRACKET_RIGHT : 221,
	SEMICOLON : 186,
	QUOTE : 222,
	COMMA : 188,
	PERIOD : 190,
	EQUAL : 187,
	DASH : 189,
	
	NUMPAD : 144,
	NUMPAD_0 : 96,
	NUMPAD_1 : 97,
	NUMPAD_2 : 98,
	NUMPAD_3 : 99,
	NUMPAD_4 : 100,
	NUMPAD_5 : 101,
	NUMPAD_6 : 102,
	NUMPAD_7 : 103,
	NUMPAD_8 : 104,
	NUMPAD_9 : 105,
	NUMPAD_DOT : 110,
	NUMPAD_MUL : 106,
	NUMPAD_ADD : 107,
	NUMPAD_SUB : 109,
	NUMPAD_MUL : 111,
	
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12:123
	
	
	// abnt2 keyboard (pt-br layout)
	
	
};

Class.define("UI.Style", { 
	from : ["WithEvents"]
	, ctor:function() {
		// myStyle.insertRule("#blanc { color: white }", 0);
		// myStyles.deleteRule(0);
		this.internal["UI.Style"].dict = {};
		
		this.el = document.createElement("style");
		this.el.appendChild(document.createTextNode(""));
		document.head.appendChild(this.el);
		this.sheet = this.el.sheet;
	}
	, proto: {
		printList : function() {
			// gather all stylesheets into an array
			console.log("STYLES:");
			var ss = document.styleSheets;
			// loop through the stylesheets
			for (var i = 0; i < ss.length; ++i) {
				// loop through all the rules
				for (var j = 0; j < ss[i].cssRules.length; ++j) {
					console.log( ss[i].cssRules[j].cssText);
				}
			}
		},
		create : function(name,rule) {
			//console.log(this.sheet);
			if(rule==undefined || rule == null) {
				if(Type.isArray(name)) {
					rule = name;
					for(var x = 0; x < rule.length;x++) {
						this.sheet.insertRule(rule[x],0);
						for(var key in this.internal["UI.Style"].dict ) {
							this.internal["UI.Style"].dict[key] += 1;
						}
					}
				} else {
					rule = name;
					var rule2 = this.sheet.insertRule(rule,0);
					for(var key in this.internal["UI.Style"].dict ) {
						this.internal["UI.Style"].dict[key] += 1;
					}
				}
			} else {
				var rule2 = this.sheet.insertRule(rule,0);
				for(var key in this.internal["UI.Style"].dict ) {
					this.internal["UI.Style"].dict[key] += 1;
				}
				this.internal["UI.Style"].dict[ name ] = 0;
				//this.internal["UI.Style"].dict[ name ] = 0;
			}
			
		},
		get : function(name) {
		
		},
		set : function(name) {
		
		},
		remove : function(name) {
			var sel = -1;
			for(var k in this.internal["UI.Style"].dict) {
				if(name == k) {
					sel = this.internal["UI.Style"].dict[k];
					break;
				}
			}
			if(sel != -1) {
				for(var k in this.internal["UI.Style"].dict) {	
					if( this.internal["UI.Style"].dict[k] >= sel) {
						this.internal["UI.Style"].dict[k] -= 1;
					}
				}
			}
			//console.log(sel,this.internal["UI.Style"].dict[ name ]);
			this.sheet.deleteRule( this.internal["UI.Style"].dict[ name ]+1 );
			
		},
		find_keyframe : function(rule) {
			// gather all stylesheets into an array
			var ss = document.styleSheets;
			// loop through the stylesheets
			for (var i = 0; i < ss.length; ++i) {
				// loop through all the rules
				for (var j = 0; j < ss[i].cssRules.length; ++j) {
					// find the -webkit-keyframe rule whose name matches our passed over parameter and return that rule
					if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule)
						return ss[i].cssRules[j];
				}
			}
			// rule not found
			return null;
		}
	}
});
Class.define("UI.Document", { 
	from : ["WithEvents"]
	, ctor : function() {
		var self = this.internal["UI.Document"];
		self.data = document;
		this.on("on", function(event,callback) {
			self.data.addEventListener(event,callback);
			return true;
		});
		this.on("off",function(event,callback) {
			self.data.removeEventListener(event,callback);
			return true;
		});
		
		var _styles = Class.create("UI.Style");
		
		Object.defineProperty(this,"style",{
			get : function() {
				return _styles;
			}
		});
		
	}
	, proto : {
		get : function() {
			var self = this.internal["UI.Document"];
			return self.data;
		}
	}
});


function _Struct_UIWindow() {}
_Struct_UIWindow.prototype.data = window;
_Struct_UIWindow.prototype.loaded = false;
_Struct_UIWindow.prototype.keyboard = {};

Class.define("UI.Window", { 
	from : ["WithEvents"]
	, struct: _Struct_UIWindow
	, ctor : function() {
		
		
		var self = this.internal["UI.Window"];
		
		self.keyboard.enabled = true;
		self.keyboard.shift = false;
		self.keyboard.capslock = false;
		self.keyboard.alt = false;
		self.keyboard.ctrl = false;
		
		
		this.on("on", function(event,callback) {
			if(event=="load") {
				if(self.loaded) {
					callback();
				} else {
					self.data.addEventListener(event,callback);
				}
			} else {
				self.data.addEventListener(event,callback);
			}
			return true;
		});
		this.on("off",function(event,callback) {
			self.data.removeEventListener(event,callback);
			return true;
		});
		
		Object.defineProperty(this,"keyboard",{
			get : function() {
				return this.internal["UI.Window"].keyboard;
			}
		});
		
	}
	,proto : {
		get : function() {
			
		},
		getStringSize : function(str,style) {
			var s = document.createElement("span");
			s.style.visibility = "hidden";
			BrowserTools.setStyle(s,style);
			s.style.padding = "0px";
			s.style.margin = "0px";
			s.innerHTML = str;
			UI.Body.get().appendChild(s);
			var w = s.offsetWidth;
			var h = s.offsetHeight;
			UI.Body.get().removeChild(s);
			return [w,h];
		},
		getBounds : function() {
			var window_width = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
			window_height = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
			return [ window_width, window_height ];
		}
	}
});



Class.define("UI.History",{ 
	
	// behaves not WithEvents, custom on, off and emit
	// that have an extra argument 'state' besides event and callback
	
	ctor : function() {
	
		this.ready = false;
		
		
			
		var self = this;
		
		this.ready = true;
		this.last_state = "";
		this.state = "";
		this.last_args = [];
		this.args = [];
	
	
		this.handlers = { 
			load : { generic: [], specific: {} },
			unload : { generic : [], specific : {} }
		};
		this.extractHash = function ( url ) { return url .replace(/^[^#]*#/, '') .replace(/^#+|#+$/, '') ; };
		this.getArgs = function() { return self.args; };
		this.getState =  function ( ) { return self.state; };
		this.setState = function ( state, args ) { 
			self.last_args = self.args;
			self.last_state = self.state;
			//state = self.extractHash(state);
			self.args = args;
			self.state = state; 
			return self.state; 
		};
		this.getHash = function ( ) { return self.extractHash(window.location.hash || location.hash); };
		this.setHash = function ( hash ) {
			hash = self.extractHash(hash);
			if ( typeof window.location.hash !== 'undefined' ) {
				if ( window.location.hash !== hash ) { window.location.hash = hash; }
			} else if ( location.hash !== hash ) {
				location.hash = hash;
			}
			return hash;
		};
		this.parse_state = function(query) {
			var data = query.split(":");
			return data.shift();
		};
		this.parse_args = function(query) {
			var data = query.split(":");
			data.shift();
			return data;
		};
		this.go = function ( to, opt ) {
			//console.log("history",to,opt);
			if(opt==undefined || opt==null || Object.prototype.toString.apply(opt) != "[object Object]") opt = {};
			
			var to_base = self.parse_state( self.extractHash(to) );
			var to_args = self.parse_args( self.extractHash(to) );
			
			var	hash_base = self.parse_state( self.getHash() );
			var force = false;
			
			if("force" in opt && opt.force === true) {
				force = true;
				console.log("force true");
			}
			
			if( self.extractHash(to) != this.getHash() ) {
				//console.log("target hash:",self.extractHash(to)," current hash:",this.getHash());
				//console.log("history A",opt);	
				
				self.emit("unload",this.getHash());
				
				self.setHash(to);
				
			} else if ( to_base !== hash_base ) { 
				//console.log("history B",opt);	
				
				//var state = self.getState();
				
				self.setHash(to);
				self.setState(to_base, to_args );
				
			} else if(true || force) {
				//console.log("history C",to_base,opt);	
				
				if(self.last_state != to_base || force) {
					//console.log("history: unload ", self.last_state);
					self.emit("unload",self.last_state, self.last_args);
				} else if(self.parse_state( self.getHash() ) != to_base ) {
					//console.log("history: unload ", self.getState());
					self.emit("unload",self.getState(),self.getArgs() );
				}
				//console.log("history C2",to_base);	
				
				self.emit("load",to_base,to_args); 
				
				self.setState(to_base, to_args );
				
				self.last_state = to_base;
				self.last_args = to_args;
				
				("callback"  in opt)&&opt.callback();
				
			}
			
			return true;
		};
		this.where = function() {
			return self.last_state;
		};
		this.hashchange = function ( e ) { 
			// this makes things load twice
			
			self.go( self.getHash() ); 
			return true;
		};
		this.on = function ( event, state, handler ) {
			//console.log("installing",event,state);
			var target = null;
			if(event=="load") { target = this.handlers.load; } 
			else if(event=="unload") { target = this.handlers.unload; } 
			else { throw "window.History event '"+event+"' unknown."; }
			if ( handler != undefined && handler != null && Object.prototype.toString.apply(handler) == "[object Function]"	) {
				if ( typeof target.specific[state] === 'undefined' ) { target.specific[state] = []; }
				target.specific[state].push(handler);
			} else if( Object.prototype.toString.apply(state) == "[object Function]" ) {
				target.generic.push(state);
			} else { throw "window.History on called with bad arguments." }
			return true;
		};
		this.off = function(event, state, callback) {
			var target = null;
			if(event=="load") { target = this.handlers.load; } 
			else if(event=="unload") { target = this.handlers.unload; } 
			else { throw "window.History event '"+event+"' unknown."; }
			if ( 
				callback != undefined && callback != null &&
				Object.prototype.toString.apply(callback) == "[object Function]"
			) {
				if(state in target.specific) {
					for(var x = target.specific[state].length-1; x >= 0;x--) {
						if(target.specific[state][x]==callback) {
							target.specific[state].splice(x,1);
							return true;
						}
					}
				}
			} else if( Object.prototype.toString.apply(state) == "[object Function]" ) {
				for(var x = 0; x < target.generic.length;x++) {
					if(target.generic[x] == callback) { 
						target.generic.splice(x,1); 
						return true; 
					}
				}
			} else { throw "window.History off called with bad arguments." }
			return false;
		};
		
		this.emit = function ( event, state, args ) {
			var i, n, handler, list;
			var target = null;
			
			if(state==undefined||state==null) {
				state = self.getState();
				//console.log("state:",state);
				args = self.getArgs();
			}
			
			if(event=="load") { 
			
				target = self.handlers.load; 
				
				list = target.generic;
				for ( i = 0, n = list.length; i < n; ++i ) { 
					
					list[i](state);
				}
				//console.log("history.emit A",target.specific,state);
				
				if ( state in target.specific ) {
					
					list = target.specific[state];
					for ( i = 0, n = list.length; i < n; ++i ) { 
						list[i](state,args); 
					}
				}
				//console.log("LOADED??");
				
			}
			else if(event=="unload") { 
			
				target = self.handlers.unload; 
				
				if ( state in target.specific ) {
					list = target.specific[state];
					for ( i = 0, n = list.length; i < n; ++i ) { list[i](state,args); }
				}
				list = target.generic;
				
				for ( i = 0, n = list.length; i < n; ++i ) { 
					list[i](state); 
				}
			
			} 
			else { throw "window.History event '"+event+"' unknown."; }
			
			return true;
		};
	
	
	}
	, proto : {
		init : function() {
			var hash = this.getHash();
			this.setState( this.parse_state( hash ), this.parse_args ( hash ) );
			window.addEventListener("hashchange", this.hashchange);
			this.emit("load");
		},
		start : function(start_page) {
			var hash = UI.History.getHash();
			var hash_arr = hash.split(":");
			if(hash_arr.length>0) {
				if(hash_arr[0]=="") hash_arr[0] = start_page;
				hash = hash_arr.join(":");
			} else {
				hash = start_page;
			}
			UI.History.go("#"+hash);
		}
		
	}
});

Class.define("UI.Head",{
	from : ["WithDOMElements"]
	, ctor : function() {
		var self = this.internal["UI.Body"];
		this.elementDefineParent(document.head);
		this.container = this;
		
		this.on( "on", function(event,callback) {
			document.head.addEventListener(event,callback);
			return true;
		});
		this.on("off",function(event,callback) {
			document.head.removeEventListener(event,callback);
			return true;
		});
		
	}
	, proto : {
		get : function() {
			return this.internal.WithDOMNode.parent;
		},
		Container : function() {
			return this;
		},
		nodeBuild : function(target) {
			return true;
		}
	}
});
Class.define("UI.Body",{ 
	from : ["WithDOMElements"] 
	, ctor : function() {
		
		var self = this.internal["UI.Body"];
		
		this.elementDefineParent(document.body);
		self.data = document.body;
		var windowBody = this;
		
		self.__selectstart_event = function(e) { e.preventDefault(); return false; };
		
		
		this.container = this;
		
		
		this.on( "on", function(event,callback) {
			document.body.addEventListener(event,callback);
			return true;
		});
		this.on("off",function(event,callback) {
			document.body.removeEventListener(event,callback);
			return true;
		});
		
		
		
		
	}
	, proto : {
		get : function() {
			return this.internal.WithDOMNode.parent;
		},
		Container : function() {
			return this;
		},
		nodeBuild : function(target) {
			return true;
		},
		RenderLoop : function() {
			var time = window.performance.now();
			
			// check data ready
			
			
			// render
			UI.Body.elementRender(time);
			
			// the caller are in UI.load, UI.init -> so it's self calling if initialized
			
			
			if(UI.Body.debug) {
				//console.log("debug");
				setTimeout(UI.Body.RenderLoop,0);
			} else {
				requestAnimationFrame(UI.Body.RenderLoop);
			}
			
		},
		canSelect : function(value) {
			if(value===true) {
				this.off("selectstart",this.internal["UI.Body"].__selectstart_event);
			} else if(value===false) {
				this.on("selectstart",this.internal["UI.Body"].__selectstart_event);
			}
		}
	}
});
UI.History = Class.create("UI.History");
UI.Window = Class.create("UI.Window");
var head = document.getElementsByTagName("head")[0];
UI.Head = Class.create("UI.Head");
UI.Head.nodeBuild();
UI.Document = Class.create("UI.Document");

UI.init = function(callback) {
	console.log("calling UI.init");
	var self = this;
	this.Window.on("load",function() {
		console.log("[UI.boot]");
		
		window.focus();		
		// clear all previous html components, that might be saved with save file.
		
		var body = document.getElementsByTagName("body")[0];
		
		body.visited = false;
		var stack = [body];
		var k = 0;
		while(stack.length>0) {
			var item = stack.pop();
			var pushed = false;
			if( item.childNodes.length > 0 && item.visited == false) {
				item.visited = true;
				stack.push(item);
				for(var x = 0; x < item.childNodes.length;x++) {
					item.childNodes[x].visited = false;
					stack.push( item.childNodes[x] );
				}
				pushed = true;
			}
			var removed = false;
			if(!pushed && stack.length>0 && item!= body) { // leaf
				if(item.parentNode!=null)
					item.parentNode.removeChild( item );
				removed = true;
			}
			if(item.visited && !removed && stack.length>0 && item != body) {
				item.parentNode.removeChild( item );
				removed = true;
			}
		}
	
		
		
		
		
		self.Body = Class.create("UI.Body");
		
		self.Body.nodeBuild();
		
		self.Window.internal["UI.Window"].loaded = true;
				
		
		
		
		UI.History.on("load",function(state) {
			console.log("loading:["+state+"]");
		});
		UI.History.on("unload",function(state) {
			console.log("unloading:["+state+"]");
		});
		UI.History.init();
	
		
		
		callback.apply(self);
	});
	
	
	
};

