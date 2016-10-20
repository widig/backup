Class.define("WithEvents",{
	ctor : function() {
		// default struct constructor
		var self = this;
		this.internal.WithEvents.data = {};
		this.internal.WithEvents.dials = {};
		this.internal.WithEvents.dialCounter = 0;
		this.internal.WithEvents.preCheck = function(event,callback,capture) {
			// self filter
			var mode = capture ? "capture" : "bubble";
			//console.log("precheck",event);
			if("on" in self.internal.WithEvents.data) {
				for(var x = 0; x < self.internal.WithEvents.data.on[mode].length;x++) {
					if(!self.internal.WithEvents.data.on[mode][x]( event, callback )) {
						console.log("event blocked");
						return false;
					}
				}
			}
			if(event in self.internal.WithEvents.data) {
				//console.log("search");
				// only one event per callback, otherwise use another queue
				for(var x = 0; x < self.internal.WithEvents.data[event][mode].length;x++) {
					if( self.internal.WithEvents.data[event][mode][x] == callback ) {
						console.log("found same event pointer");
						return false;
					}
				}
				//console.log("not found");
			} else {
				// init this event
				self.internal.WithEvents.data[event] = {
					capture : [],
					bubble : []
				};
				//console.log("init");
			}
			
			return true;
		}
		this.addEventListener = function(a,b,c) {
			return this.on(a,b,c);
		}
		this.removeEventListener = function(a,b,c) {
			return this.off(a,b,c);
		}
	}
	, proto : {
		on : function(event, callback,capture) {
			
			capture = capture || true;
			var mode = !!capture ? "capture" : "bubble";
			var i = this.internal["WithEvents"];
			//console.log("INTERNAL",i);
			if(!i.preCheck.apply(this,[event,callback,capture])) return false;
			i.data[event][mode].push(callback);
			return true;
		},
		pattern : function(pattern, callback, capture) {
			capture = capture || true;
			var mode = !!capture ? "capture" : "bubble";
			var i = this.internal["WithEvents"];
			
			// parse language
			throw "not implemented.";
		},
		onQueue : function(event,callback,capture) {
			capture = capture || true;
			var mode = !!capture ? "capture" : "bubble";
			var i = this.internal["WithEvents"];
			if(!i.preCheck.apply(this,[event,callback,capture])) return false;
			i.data[event][mode].unshift(callback);
			return true;
		},
		onPush : function(event,callback,capture) {
			capture = capture || true;
			var mode = !!capture ? "capture" : "bubble";
			var i = this.internal["WithEvents"];
			if(!i.preCheck.apply(this,[event,callback,capture])) return false;
			if(capture) {
				i.data[event][mode].push(callback);
			} else {
				i.data[event][mode].unshift(callback);
			}
			return true;
		},
		onAfter : function(event,callback_reference,callback,capture) {
			capture = capture || true;
			var mode = !!capture ? "capture" : "bubble";
			var i = this.internal["WithEvents"];
			if(!i.preCheck.apply(this,[event,callback,capture])) return false;
			// find it
			var check = false;
			if(capture) {
				for(var x = 0; x < i.data[event][mode].length;x++) {
					if(i.data[event][mode][x] == callback_reference) {
						// insert after
						check = true;
						i.data[event][mode].splice(x+1,0,callback);
						break;
					}
				}
			} else {
				for(var x = i.data[event][mode].length;x>=0;x--) {
					if(i.data[event][mode][x] == callback_reference) {
						check = true;
						i.data[event][mode].splice(x,0,callback);
						break;
					}
				}
			}
			return check;
		},
		onBefore : function(event,callback_reference,callback,capture) {
			capture = capture || true;
			var mode = !!capture ? "capture" : "bubble";
			var i = this.internal["WithEvents"];
			if(!i.preCheck.apply(this,[event,callback])) return false;
			
			// find it
			var check = false;
			if(capture) {
				for(var x = 0; x < i.data[event][mode].length;x++) {
					if(i.data[event][mode][x] == callback_reference) {
						// insert after
						check = true;
						i.data[event].splice(x,0,callback);
						break;
					}
				}
			} else {
				for(var x = i.data[event][mode].length-1;x>=0;x--) {
					if(i.data[event][mode][x] == callback_reference) {
						// insert after
						check = true;
						i.data[event].splice(x+1,0,callback);
						break;
					}
				}
			}
			return check;
		},
		off : function(event,callback,capture) {
			capture = capture || true;
			var mode = !!capture ? "capture" : "bubble";
			var i = this.internal["WithEvents"];
			if("off" in i.data) {
				for(var x = 0; x < i.data.off[mode].length;x++) {
					if(!i.data.off[mode][x]( event, callback )) {
						return false;
					}
				}
			}
			if(!(event in i.data)) {
				return true;
			}
			for(var x = 0; x < i.data[event][mode].length;x++) {
				if( i.data[event][mode][x] == callback ) {
					i.data[event][mode].splice(x,1);
					return true;
				}
			}
			return false;
		},
		clearEvents : function(event,capture) {
			capture = capture || true;
			var mode = !!capture ? "capture" : "bubble";
			var i = this.internal["WithEvents"];
			if("off" in i.data) {
				for(var x = 0; x < i.data.off[mode].length;x++) {
					if(!i.data.off[mode][x]( event, callback )) {
						return false;
					}
				}
			}
			if(!(event in i.data)) {
				return true;
			}
			i.data[event][mode].splice(0,i.data[event][mode].length);
			return true;
		},
		emit : function(event, args) {
			//console.log("emit0",this);
			//console.log("emit",event,args);
			
			var i = this.internal["WithEvents"];
			//console.log(i.data);
			if(event in i.data) {
				for(var x = 0; x < i.data[event].capture.length;x++) {
					if(Object.prototype.toString.apply(i.data[event].capture[x]) != "[object Function]") {
						console.log(i.data[event].capture[x]);
					}
					if(!i.data[event].capture[x].apply(this,args)) {
						return false;
					}
				}
			}
			// emit bottomHit
			if(("bottomHit"+event) in i.data) {
				for(var x = 0; x < i.data["bottomHit"+event].capture.length;x++) {
					if(!i.data["bottomHit"+event].capture[x].apply(this,args)) {
						return false;
					}
				}
				for(var x = i.data["bottomHit"+event].bubble.length-1;x>=0;x--) {
					if(!i.data["bottomHit"+event].bubble[x].apply(this,args)) {
						return false;
					}
				}
			}
			if(event in i.data) {
				for(var x = i.data[event].bubble.length-1;x>=0;x--) {
					if(!i.data[event].bubble[x].apply(this,args)) {
						return false;
					}
				}
			}
			return true;
		},
		tryCall : function(confirm, event, args, expire) {
			//console.log("first DIAL");
			var i = this.internal.WithEvents;
			var check = false;
			if(event in i.data) {
				var result = "";
				for(var x = 0; x < i.data[event].capture.length;x++) {
					result = i.data[event].capture[x].apply(this,args);
					if( confirm( result, expire ) ) {
						check = true;
						break;
					}
				}
				for(var x = i.data[event].bubble.length;x>=0;x--) {
					result = i.data[event].bubble[x].apply(this,args);
					if(confirm(result,expire) ) {
						check = true;
						break;
					}
				}
				return {
					result : true,
					value : result
				}
			}
			if(!check) {
				var self = this.internal.WithEvents;
				self.dialCounter += 1;
				self.dials[ self.dialCounter ] = {
					id : self.dialCounter,
					confirm : confirm, 
					event : event, 
					args : args,
					expire : expire,
					tries : 1
				}
				return {
					result : false,
					value : self.dialCounter
				}
			}
		},
		cancelCall : function(id) { // byId
			var self = this.internal.WithEvents;
			if(id in self.dials) {
				self.dials[id] = null;
				delete self.dials[id];
			}
		},
		// cancel call by event
		// cancel call by number of tries
		cancelAllCalls : function() {
			var self = this.internal.WithEvents;
			var rm = [];
			for(var key in self.dials)
				rm.push(key);
			for(var x = 0; x < rm.length;x++) {
				self.dials[ rm[x] ] = null;
				delete self.dials[ rm[x] ];
			}
		},
		
		checkDialingState : function(id) {
			var self = this.internal.WithEvents;
			if(id in self.dials) return self.dials[id];
			return null;
		},
		
		reDial : function() {
			
			var self = this.internal.WithEvents;
			var rm = [];
			var c = 0;
			var check = false;
			var dial = null;
			var x = 0;
			var result = 0;
			var key = "";
			for(key in self.dials) {
				dial = self.dials[key];
				check = false;
				if(dial.event in self.data) {
					//console.log("REDIAL",self.data[dial.event].length,self.dialCounter2);
					for(var x = 0; x < i.data[event].capture.length;x++) {
						result = i.data[event].capture[x].apply(this,args);
						if( confirm( result, expire ) ) {
							check = true;
							break;
						}
					}
					for(var x = i.data[event].bubble.length;x>=0;x--) {
						result = i.data[event].bubble[x].apply(this,args);
						if(confirm(result,expire) ) {
							check = true;
							break;
						}
					}
					if(!check) {
						dial.tries += 1;
						if(dial.tries > 1) {
							//console.log("cancel redial");
							rm.push(key);
						}
					} else {
						rm.push(key);
						break;
					}
				} else {
					rm.push(key);
				}
				c += 1;
			}
			for(x = 0; x < rm.length;x++) {
				self.dials[ rm[x] ] = null;
				delete self.dials[ rm[x] ];
				c -= 1;
			}
			if(c==0) {
				self.dialCounter = 0;
			}
		}
	}
});