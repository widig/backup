

Class.define("History",{ 
	
	// behaves not WithEvents, custom on, off and emit
	// that have an extra argument 'state' besides event and callback
	
	ctor : function() {
	
		this.ready = false;
		
		
			
		this.construct();
	
	
	}
	, proto : {
		construct : function() {
			var self = this;
		
			if ( this.ready ) { return; } // singleton
			
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
				if ( 
					handler != undefined && handler != null &&
					Object.prototype.toString.apply(handler) == "[object Function]"
				) {
					if ( typeof target.specific[state] === 'undefined' ) { target.specific[state] = []; }
					target.specific[state].push(handler);
				} else if( Object.prototype.toString.apply(state) == "[object Function]" ) {
					target.generic.push(state);
				} else { throw "window.History on called with bad arguments." }
				return true;
			};
			this.off = function(event, state,callback) {
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
		},
		init : function() {
			var hash = this.getHash();
			this.setState( this.parse_state( hash ), this.parse_args ( hash ) );
			window.addEventListener("hashchange", this.hashchange);
			this.emit("load");
		}
	}
});
History = Class.create("History");