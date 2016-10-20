

/*
	
	Class
*/
ClassDefinition = function(full_name,constructor,destructor) {
	Object.defineProperty(this,"fullName",{value : full_name, writeable : false, configurable : false, enumberable : true });
	
	var _ctor = function(){};
	Object.defineProperty(this,"constructor",{value : _ctor, writeable : false, configurable : false, enumberable : true });
	
	var _dtor = function(){};
	Object.defineProperty(this,"destructor",{value : _ctor, writeable : false, configurable : false, enumberable : true });
	
	
	var _load = [constructor];
	Object.defineProperty(this,"load",{value : _load, writeable : false, configurable : false, enumerable : true } );
	
	var _unload = [destructor];
	Object.defineProperty(this,"unload",{value : _unload, writeable : false, configurable : false, enumerable : true } );
	
	var _inherits = [];
	Object.defineProperty(this,"inherits",{value : _inherits , writeable : false, configurable : false, enumberable : true });
	
	var _share = [];
	Object.defineProperty(this,"share",{value : _share , writeable : false, configurable : false, enumberable : true });
	
	var _sealed = { data : false };
	Object.defineProperty(this,"sealed",{
		get : function() { return _sealed.data; },
		set : function(value) { if(value===true || value===false) _sealed.data = value; },
		writeable : true, 
		configurable : false, 
		enumberable : true
	});
	
	var _childClasses = {};
	Object.defineProperty(this,"childClasses",{value : _childClasses , writeable : false, configurable : false, enumberable : true });
	
	var _behaves = [];
	Object.defineProperty(this,"behaves",{value : _behaves , writeable : false, configurable : false, enumberable : true });
	var _properties = [];
	
	Object.defineProperty(this,"properties",{value : _properties, writable : false, configurable : false, enumerable : true });
	
	var _revision = 1;
	Object.defineProperty(this,"revision",{ value : _revision, writeable : true, configurable : false, enumerable : true } );
	
	var _structpointer = {
		data : 0
	};
	Object.defineProperty(this,"struct",{value : _structpointer, writeable : false, configurable: false, enumerable : true } );
	
};
Class = function() {
	(function(self) {
		var data = {};
		Object.defineProperty(self,"data",{
			get : function() { return data; },
			writeable : false,
			configurable : false
		});
		
	})(this);
	
};
Class.prototype.define = function(name,options) {
	// deprecated (name,inherits,constructor,predef)
	var debug = false;
	
	if(debug) {
		console.log("Class define",name);
	}
	
	var meta = null
		, constructor = null
		, destructor = null
		, predef = null;
		
	if(arguments.length==1) {
		// (name)
		name = arguments[0];
	} else if(arguments.length==2) {
		// (name,prototype (aka predef) )
		name = arguments[0];
		options = arguments[1];
		//console.log("opening works");
		// throw "Class.define does not have a '5 arguments or more' constructor.";
	}
	
	options = options || {};
	
	
	if("ctor" in options) {
		constructor = options.ctor;
	}
	if("dtor"  in options) {
		destructor = options.dtor;
	}
	if("from" in options) {
		meta = options.from;
		
	}
	
	if("proto" in options) {
		predef = options.proto;
	}
	
	
	if( ! (Object.prototype.toString.apply(name) == "[object String]") ) throw "Class.define name must be a string.";
	
	
	
	if( meta != null && ! (Object.prototype.toString.apply(meta) == "[object Object]") && ! (Object.prototype.toString.apply(meta) == "[object Array]") ) throw "Class.define meta must be an object or an array.";
	if( meta == null ) meta = [];
	if( constructor != null && ! (Object.prototype.toString.apply(constructor) == "[object Function]") ) throw "Class.define constructor must be an function.";
	if( constructor == null ) constructor = function(){};
	if( destructor != null && ! Type.isFunction( destructor ) ) throw "Class.define destructor must be an function.";
	if( destructor == null ) destructor = function(){};
	
	if( predef != null && ! (Object.prototype.toString.apply(predef) == "[object Object]") ) throw "Class.define prototype must be an object.";
	if( predef == null ) predef = {};
	
	var behaves = [];
	if( "from" in options && (Object.prototype.toString.apply(options.from) == "[object Array]") ) {
		behaves = options.from;
	}
	
	var pathName = name.split(".");
	var target = this.data; // childClasses
	var last_name = null;
	
	while(pathName.length>0) {
		var cur = pathName.shift();
		if(cur.length>256) {
			throw "Class.define name '"+cur+"' too long in '"+name+"'.";
		}
		last_name = cur;
		if(pathName.length==0) break;
		if(!(cur in target)) {
			throw "Class.define '"+name+"' has a invalid path name at '"+cur+"'.";
		}
		target = target[cur].childClasses;
	}
	
	if(last_name in target) console.log("warning: '" + name + "' redefined.","color:#ff0000");

	var cd = target[last_name] = new ClassDefinition(name,constructor,destructor);
	
	if( (Object.prototype.toString.apply(options) == "[object Object]") ) {
		if("struct" in options) {
			cd.struct.data = options.struct;
		}
	}
	
	for(var x = 0; x < behaves.length;x++) {
		//console.log(name);
		Class.behaveLike(name,behaves[x]);
	}
	
	var self_class = this;
	var ret = function(){};
	
	ret.prototype.fullName = name;
	ret.prototype.set = function(key,value) {
		//var type = Type(key);
		if((Object.prototype.toString.apply(key) == "[object String]")) {
			var proto = cd.constructor.prototype;
			proto[key] = value;
			return this;
		} else if((Object.prototype.toString.apply(key) == "[object Object]")) {
			var proto = cd.constructor.prototype;
			for(var k in key) {
				if((Object.prototype.toString.apply(key[k]) == "[object Object]")) {
					var check = false;
					var count = 0;
					var format = false;
					for(var k1 in key[k]) {
						if(Object.prototype.hasOwnProperty.apply(key[k],[k1])) {
							check = true;
							if(k1=="initProperty" && (Object.prototype.toString.apply(key[k][k1]) == "[object Function]") ) {
								format = true;
							}
							count++;
						}
					}
					format = format && (count==1);
					if(!check) {
						cd.properties.push([ k, key[k], 0 ]);
					} else if( format ){
						cd.properties.push([ k, key[k], 1 ]);
					} else {
						proto[k] = Object.create(key[k]); // make a copy
					}
				} else {
					proto[k] = key[k];
				}
			}
		}
	};
	ret.prototype.create = function(opt) {
		return Class.create.apply(Class,[name,opt]);
	};
	ret = new ret;
	if(predef!=undefined && predef!=null && Object.prototype.toString.apply(predef) == "[object Object]") {
		ret.set(predef);
	}
	return ret;
};

Class.prototype.getDefinition = function(name) {
	var pathName = name.split(".");
	var target = this.data;
	while(pathName.length>0) {
		var cur = pathName.shift();
		if(cur.length>512) throw "Class.getDefinition name too long.";
		if(pathName.length==0) {
			if(cur in target) {
				// make a secure copy, translate pointers to names
				target = target[cur];
				console.log("Class.getDefinition is for debug purposes.");
				return target;
			}
			break;
		}
		target = target[cur].childClasses;
	}
	return null;
};

Class.prototype.getPrototypeOf = function(name) {
	var pathName = name.split(".");
	var target = this.data;
	while(pathName.length>0) {
		var cur = pathName.shift();
		if(cur.length>256) throw "Class.getDefinition name too long.";
		if(pathName.length==0) {
			if(cur in target) {
				target = target[cur];
				if(!target.sealed)  return target.constructor.prototype;
				throw "Class.getPrototypeOf '"+name+"' is a sealed class.";			
			}
			break;
		}
		target = target[cur].childClasses;
	}
	throw "Class.getPrototypeOf '"+name+"' does not exists.";
};

Class.prototype.behaveLike = function(destiny,source) {
	
	if(destiny == source) return;
	
	//console.log("behaveLike",destiny,source);
	
	var source_name = source;
	var destiny_name = destiny;
	
	var pathName = destiny.split(".");
	var target = this.data;
	var check = false;
	while(pathName.length>0) {
		var cur = pathName.shift();
		if(pathName.length==0) {
			if(cur in target) {
				check = true;
				target = target[cur];
				
			}
			break;
		}
		target = target[cur].childClasses;
	}
	if(!check) {
		throw "Class.extend where destiny '" + destiny + "' was not found.";
	}
	destiny = target;
	if(destiny.sealed) {
		throw "Class.extend where destiny '" + destiny + "' is sealed.";
	}
	
	
	
	pathName = source.split(".");
	target = this.data;
	check = false;
	while(pathName.length>0) {
		var cur = pathName.shift();
		//console.log(" _ : ", cur);
		if(pathName.length==0) {
			if(cur in target) {
				check = true;
				target = target[cur];
			}
			break;
		}
		target = target[cur].childClasses;
	}
	if(!check) {
		
		throw "Class.extend where source '" + source + "' was not found.";
	}
	source = target;
	
	for(var x = 0; x < destiny.behaves.length;x++) {
		if(destiny.behaves[x] == source) {
			return;
		}
	
	}
	// just a mark to not insert twice
	destiny.behaves.push( source );
	
	for(var x = 0; x < source.behaves.length;x++) {
		//console.log(">>",destiny_name,source.behaves[x].fullName)
		Class.behaveLike(destiny_name,source.behaves[x].fullName);
	}
	
	
	// reorder behaviours cause its need to instanciate correct order and correct unordered marks
	// check dependency
	
	
	var count = 0;
	while(true) {
		var check = false;
		for(var x = destiny.behaves.length-1; x >= 0;x--) {
			for(var y = x-1; y >= 0; y--) {
				// find x in y, if found change place
				var itemA = destiny.behaves[x];
				var itemB = destiny.behaves[y];
				var used = [];
				var stack = [itemB];
				while(stack.length>0) {
					var b = stack.pop();
					used.push(b);
					for(var z = 0; z < b.behaves.length;z++) {
						if( b.behaves[z] == itemA ) {
							// found
							check = true;
							break;
						} else {
							var check2 = false;
							for(var w = 0; w < used.length;w++) {
								if(used[w] == b.behaves[z]) {
									check2 = true;
									break;
								}
							}
							if(!check2) stack.push( b.behaves[z] );
						}
					}
					if(check) break;
					
				}
				if(check) {
					// swap
					count++;
					if(count > ( destiny.behaves.length * destiny.behaves.length + 1) ) {
						throw "Class.define can not resolve references, bad project, past depends on future so async must be a queue with check over time or something better.";
					}
					destiny.behaves[y] = itemA;
					destiny.behaves[x] = itemB;
					break;
				}
			}
			if(check) {
				break;	
			}
		}
		if(!check) break;
	}
	
	for (var k in source.constructor.prototype) {
		destiny.constructor.prototype[k] = source.constructor.prototype[k];
	}
	
	
	destiny.revision += 1;
	
	return destiny; 
	
};

Class.prototype.create = function(c,opt,mode) {
	mode = mode || {debug:false};
	if(mode && "debug" in mode && mode.debug) {
		console.log("Class create",c);
	}
	
	if(
		!(
			(Object.prototype.toString.apply(c) == "[object String]") &&
			( opt==null || opt == undefined || (Object.prototype.toString.apply(opt) == "[object Object]") )
		)
	) {
		throw "Class.create bad arguments.";
	}
	
	var pathName = c.split(".");
	var target = this.data;
	var check = false;
	while(pathName.length>0) {
		var cur = pathName.shift();
		if(pathName.length==0) {
			if(cur in target) {
				check = true;
				target = target[cur];
			}
			break;
		}
		if(cur in target && "childClasses" in target[cur]) {
			target = target[cur].childClasses;
		} else {
			
			throw "Class '"+c+"' is not defined.";
		}
	}
	if(!check) {
		throw "Class.create '" + c + "' was not found.";
	}
	
	c = target;
	//console.log(c);
	opt = opt || {};
	
	var ret_instance = null;
	var new_obj = function() { return {}; }
	var obj_def = function() {
		
		var _internal = new_obj();
		Object.defineProperty(this,"internal",{
			get : function() { return _internal; }
		});
		
		var _type = c.fullName;
		Object.defineProperty(_internal,"type",{
			get : function() { return _type; }
		});
		
		
		var _data = null;
		
		if(c.struct.data != 0) {
			_data = new c.struct.data;
		} else {
			_data = {};
		}
		
		Object.defineProperty(_internal,c.fullName,{
			get : function() { return _data; }
		});
		
		var _rev = c.revision;
		Object.defineProperty(_data,"revision",{
			get : function() { return _rev; }
		});
		
		
		for( var x = 0; x < c.behaves.length;x++) {
			(function(x,c,opt,self) {
				//console.log(">> Class.create [behaves] ", c.fullName, c.behaves[x].fullName);
				
				if( c.behaves[x].fullName in opt) {
					if(Type.isArray( opt[ c.behaves[x].fullName  ] ) ) {
						bargs = opt[ c.behaves[x].fullName ];
					} else {
						throw "Class.create arguments of type '"  + c.behaves[x].fullName + "' must be in array format";
					}
					bargs = opt[ c.behaves[x].fullName ];
				} else {
					bargs = [];
				}
				
				var _inline = new new_obj;
				if( c.behaves[x].struct.data != 0 ) {
					_inline = new c.behaves[x].struct.data;
				}
				
				Object.defineProperty(_internal,c.behaves[x].fullName,{
					get : function() { 
						
						return _inline; 
					}
				});
				
				var _cur_rev = c.behaves[x].revision;
				Object.defineProperty(_inline, "revision",{
					get : function() { return _cur_rev; }
				});
				
				for(var y = 0; y < c.behaves[x].load.length;y++) {
					c.behaves[x].load[y].apply(self, bargs );
				}
				
				
			})(x,c,opt,this);
		}
		

		var aargs = [];
		if( c.fullName in opt) {
			if((Object.prototype.toString.apply(opt[c.fullName]) == "[object Array]")) {
				aargs = opt[ c.fullName ];
			} else {
				throw "Class.create arguments of type '"  + c.fullName + "' must be in array format";
			}
		}
		for(var x = 0; x < c.load.length;x++) {
			c.load[x].apply(this,aargs);
		}
		
	};
	obj_def.prototype = Object.create(c.constructor.prototype);
	
	
	
	
	ret_instance = new obj_def();
	
	for(var x = 0; x < c.properties.length;x++) {
		
		var prop_name = c.properties[x][0];
		var prop_desc = c.properties[x][1];
		var prop_type = c.properties[x][2];
		if(prop_type == 0) {
		
			Object.defineProperty( 
				ret_instance,
				prop_name,
				{ get : function() { return proc_desc; } }
			);

		} else if(prop_type == 1) {
			Object.defineProperty( 
				ret_instance,
				prop_name,
				prop_desc.initProperty()
			);
		}
		
	}
	
	return ret_instance;
	
};
Class.prototype.finish = function(instance,opt) {
	var name = instance.internal.type;
	var pathName = name.split(".");
	var target = this.data;
	while(pathName.length>0) {
		var cur = pathName.shift();
		if(cur.length>256) throw "Class.finish name too long.";
		if(pathName.length==0) {
			if(cur in target) {
				target = target[cur];
				break;
			} else {
				throw "Class.finish name not found.";
			}
		}
		target = target[cur].childClasses;
	}
	
	var aargs = [];
	if( name in opt) {
		if(Type.isArray(opt[ name ])) {
			aargs = opt[ name ];
		} else {
			throw "Class.create arguments of type '"  + c.fullName + "' must be in array format";
		}
	}
	
	for(var x = target.unload.length-1; x >=0;x--) {
		target.load[x].apply(instance,aargs);
	}
	
	for( var x = target.behaves.length-1; x >=0;x--) {
		(function(x,c,opt,self) {
			//console.log(">> Class.create [behaves] ", c.fullName, c.behaves[x].fullName);
			
			if( c.behaves[x].fullName in opt) {
				if(Type.isArray( opt[ c.behaves[x].fullName  ] ) ) {
					bargs = opt[ c.behaves[x].fullName ];
				} else {
					throw "Class.create arguments of type '"  + c.behaves[x].fullName + "' must be in array format";
				}
				bargs = opt[ c.behaves[x].fullName ];
			} else {
				bargs = [];
			}
			for(var y = c.behaves[x].unload.length; y >=0; y--) {
				c.behaves[x].unload[y].apply(self, bargs );
			}
			
		})(x,target,opt,instance);
	}
	
	
};
Class.prototype.undefine = function() {

};
Class.prototype.instanceCheck = function(a) {
	if("internal" in a) {
		if("_typeName"  in a.internal) {
			var type = a.internal._typeName;
			
			var pathName = a.split(".");
			var inner_target = this.data;
			var check = false;
			while(pathName.length>0) {
				var cur = pathName.shift();
				if(pathName.length==0) {
					if(cur in inner_target) {
						check = true;
						inner_target = inner_target[cur];
						
					}
					break;
				}
				inner_target = inner_target[cur].childClasses;
			}
			if(!check) {
				throw "Class.instance parent '" + bname + "' was not found.";
			}
			var a_def = inner_target;
			
			if(a.internal._revision < a_def.revision) {
				return false;
			}
			// now check behaves
			
			return true;
		}
	}
	throw "not event from Class.";
};
Class.prototype.definitionCheck = function(a) {
	// if client can request classes from other source
	
	return true;
};
Class.prototype.instanceOf = function(a,b) {

	// find original
	if(
		!(
			Object.prototype.toString.apply(a) == "[object Object]" &&
			Object.prototype.toString.apply(b) == "[object String]"
		)
	) {
		throw "Class.instance bad arguments.";
	}
	var bname = b;
	
	var pathName = b.split(".");
	var inner_target = this.data;
	var check = false;
	while(pathName.length>0) {
		var cur = pathName.shift();
		if(pathName.length==0) {
			if(cur in inner_target) {
				check = true;
				inner_target = inner_target[cur];
				
			}
			break;
		}
		inner_target = inner_target[cur].childClasses;
	}
	if(!check) {
		throw "Class.instance parent '" + bname + "' was not found.";
	}
	b = inner_target;
	
	if("internal" in a) {
		if(b.fullName in a.internal) return true;
	}
	
	return false;
	
};


if (typeof module !== 'undefined' && module.exports) {
	(function(self){
		var c = null;
		//module.exports = 
		c = new Class();
		Object.defineProperty(self,"Class",{
			get : function() {
				return c;
			}
		});
		Object.preventExtensions(c);
		Object.seal(c);
		self["Class"] = c;
	})(global);
	
} else {
	
	(function(self){
		var c = new Class();
		Object.defineProperty(this,"Class",{
			get : function() {
				return c;
			}
		});
		
		Object.preventExtensions(c);
		Object.seal(c);

	})(window);
	
}


/*
	just a test comments
*/
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



Class.define("WithArray",{ 
	ctor : function() {
		this.internal.WithArray.data = [];
	}
	, from :["WithEvents"]
	, proto: {
		itemPush : function(item) {
			var last = this.internal.WithArray.data.length;
			if(!this.emit("itemInputFilter",[last,null,item])) return false;
			this.internal.WithArray.data.push(item);
			this.emit("itemInsert",[last]);
			return true;
		}
		, itemPop : function() {
			if(this.internal.WithArray.data.length>0) {
				var last = this.internal.WithArray.data.length-1;
				if(!this.emit("itemOutputFilter",[last,this.internal.WithArray.data[last]])) return null;
				var ret = this.internal.WithArray.data.pop();
				this.emit("itemRemove",[last]);
				return ret;
			}
			return null;
		}
		, itemUnshift : function(item) {
			if(!this.emit("itemInputFilter",[0,null,item])) return false;
			this.internal.WithArray.data.unshift(item);
			this.emit("itemInsert",[0]);
			return true;
		}
		, itemShift : function() {
			if(this.internal.WithArray.data.length>0) {
				if(!this.emit("itemOutputFilter",[0,this.internal.WithArray.data[0]])) return null;
				var ret = this.internal.WithArray.data.shift();
				this.emit("itemRemove",[0]);
				return ret;
			}
			return null;
		}
		, itemPeekTop : function() {
			if(this.internal.WithArray.data.length>0) return this.internal.WithArray.data[this.internal.WithArray.data.length-1];
			return null;
		}
		, itemPeekFirst : function() {
			if(this.internal.WithArray.data.length>0) return this.internal.WithArray.data[0];
			return null;
		}
		, itemRemove : function(item) {
			for(var x = 0; x < this.internal.WithArray.data.length;x++) {
				if(this.internal.WithArray.data[x]==item) {
					if(!this.emit("itemOutputFilter",[x,this.internal.WithArray.data[x]])) return null;
					var ret = this.internal.WithArray.data.splice(x,1);
					this.emit("itemRemove",[x]);
					return ret;
				}
			}
			return null;
		}
		, itemRemoveComplex : function(callback) {
			for(var x = 0; x < this.internal.WithArray.data.length;x++) {
				if(callback(x,this.internal.WithArray.data[x])) {
					if(!this.emit("itemOutputFilter",[x,this.internal.WithArray.data[x]])) return null;
					var ret = this.internal.WithArray.data.splice(x,1);
					this.emit("itemRemove",[x]);
					return ret;
				}
			}
			return null;
		}
		, itemRemoveAll : function(item) {
			var check1 = false;
			var check2 = false;
			var mark = [];
			while(true) {
				for(var x = 0; x < this.internal.WithArray.data.length;x++) {
					if(this.internal.WithArray.data[x]==item) {
						if(!this.emit("itemOutputFilter",[x,this.internal.WithArray.data[x]])) return null;
						mark.push(x);
						check1 = true;
						check2 = true;
						break;
					}
				}
				if(!check1) break;
				check1 = false;
			}
			if(check2) {
				var ret = [];
				for(var x = mark.length-1; x >= 0;x--) {
					ret = ret.concat(this.internal.WithArray.data.splice(mark[x],1));
					this.emit("itemRemove",[mark[x]]);
				}
				return ret;
			}
			return false;
		}
		, itemRemoveAllComplex : function(callback) {
			
			var check1 = false;
			var check2 = false;
			
			var mark = [];
			while(true) {
				for(var x = 0; x < this.internal.WithArray.data.length;x++) {
					if(callback(x,this.internal.WithArray.data[x])) {
						if(!this.emit("itemOutputFilter",[x,this.internal.WithArray.data[x]])) return null;
						mark.push(x);
						check1 = true;
						check2 = true;
						break;
					}
				}
				if(!check1) break;
				check1 = false;
			}
			if(check2) {
				var ret = [];
				for(var x = mark.length-1;x>=0;x--) {
					ret.concat(this.internal.WithArray.data.splice(mark[x],1));
					this.emit("itemRemove",[mark[x]]);
				}
				return ret;
			}
			return false;
			
		}
		, itemFindFirstIndex : function(start,item) {
			for(var x = start; x < this.internal.WithArray.data.length;x++) {
				if(this.internal.WithArray.data[x]==item)
					return x;
			}
			return -1;
		}
		// callback(index,value)
		, itemFindFirstIndexComplex : function(start,callback) {
			for(var x = start; x < this.internal.WithArray.data.length;x++) {
				if(callback(x,this.internal.WithArray.data[x])) {
					return x;
				}
			}
			return -1;
		}
		// for replaceAllComplex, use itemMap
		, itemReplaceAll : function(item,replacement) { // commit style
			var check1 = false;
			var check2 = false;
			var mark = [];
			while(true) {
				for(var x = 0; x < this.internal.WithArray.data.length;x++) {
					if(this.internal.WithArray.data[x]==item) {
						if(!this.emit("itemInputFilter",[x,this.internal.WithArray.data[x],replacement])) return false;
						mark.push(x);
						check1 = true;
						check2 = true;
						break;
					}
				}
				if(!check1) break;
				check1 = false;
			}
			if(check2) {
				for(var x = 0; x < mark.length;x++) {
					var oldvalue = this.internal.WithArray.data[mark[x]];
					var newvalue = this.internal.WithArray.data[mark[x]] = replacement;
					this.emit("itemChange",[mark[x],oldvalue,newvalue]);
				}
				return true;
			}
			return false;
		}
		, itemReplaceAllComplex : function(callback) { // commit style
			var check1 = false;
			var check2 = false;
			var mark = [];
			while(true) {
				for(var x = 0; x < this.internal.WithArray.data.length;x++) {
					var oldvalue = this.internal.WithArray.data[x];
					throw "do not return new value?";
					var r = callback(this.internal.WithArray.data[x]);
					if(r==null) {
						if(!this.emit("itemInputFilter",[x,oldvalue,r])) return false;
						mark.push([x,r]); // here using null
						check1 = true;
						check2 = true;
						break;
					}
				}
				if(!check1) break;
				check1 = false;
			}
			if(check2) {
				for(var x = mark.length-1;x>=0;x--) {
					var oldvalue = this.internal.WithArray.data[ mark[x][0] ];
					var newvalue = this.internal.WithArray.data[ mark[x][0] ] = mark[x][1];
					this.emit("itemChange",[mark[x],oldvalue,newvalue]);
				}
				return true;
			}
			return false;
		}
		, itemReplaceAt : function(index,value) {
			if(index >=0 && index < this.internal.WithArray.data.length) {
				if(!this.emit("itemInputFilter",[index,this.internal.WithArray.data[index],value])) return false;
				var oldvalue = this.internal.WithArray.data[index]
				this.internal.WithArray.data[index] = value;
				this.emit("itemChange",[index,oldvalue,value]);
			} else {
				throw "WithArray.itemAt index out of bounds.";
			}
		}
		, itemGetAt : function(index) {
			if(index >=0 && index < this.internal.WithArray.data.length) {
				return this.internal.WithArray.data[index];
			} else {
				throw "WithArray.itemAt index out of bounds.";
			}
		}
		, itemRemoveAt : function(index) {
			if(index >=0 && index < this.internal.WithArray.data.length) {
				if(!this.emit("itemOutputFilter",[index,this.internal.WithArray.data[index]])) return null;
				var r = this.internal.WithArray.data.splice(index);
				this.emit("itemRemove",[index]);
				return r;
			} else {
				throw "WithArray.itemRemoveAt index out of bounds.";
			}
		}
		, itemFindValue : function(callback) {
			for(var x = 0; x < this.internal.WithArray.data.length;x++) {
				if( callback(x,this.internal.WithArray.data[x]) ) {
					return this.internal.WithArray.data[x];
				}
			}
			return null;
		}
		, itemMap : function(callback) { // commit style
			var mark = [];
			for(var x = 0; x < this.internal.WithArray.data.length;x++) {
				var nvalue = callback(x,this.internal.WithArray.data[x]);
				if(!this.emit("itemInputFilter",[x,this.internal.WithArray.data[x],nvalue])) return false;
				mark.push([x,nvalue]);
			}
			for(var x = 0; x < mark.length;x++) {
				var oldvalue = this.internal.WithArray.data[ mark[x][0] ];
				var newvalue = this.internal.WithArray.data[ mark[x][0] ] = mark[x][1];
				this.emit("itemChange",[mark[x][0],oldvalue,newvalue]);
			}
			return false;
		}
		, itemClear : function() { // remove all no check except for output_filter, commit style
			
			for(var y = 0; y < this.internal.WithArray.data.length;y++) {
				//console.log("remove",this.internal.WithArray.data[y]);
				if(!this.emit("itemOutputFilter",[y,this.internal.WithArray.data[y]])) return false;
			}
			var ret = [];
			while(this.internal.WithArray.data.length>0) {
				ret.push( this.internal.WithArray.data.shift() );
				var i = this.internal.WithArray.data.length;
				this.emit("itemRemove",[i]);
			}
			return ret;
		}
		, itemAmount : function() {
			return this.internal.WithArray.data.length;
		}
		, itemSplice : function() {
			return this.internal.WithArray.data.splice.apply( this.internal.WithArray.data, Array.prototype.slice(arguments,0) );
		}
	}
});


/*
	0x08.js
	WithEvents
	WithArray
	WithAlias
	
*/



Class.define("WithAlias",{
	from : ["WithEvents"]
	, ctor :function() { // map reduce requires event tracking, so this is alpha
		this.internal.WithAlias.data = {};
	}
	, proto : {
		varEach : function(map) {
			for(var key in this.internal.WithAlias.data) {
				this.internal.WithAlias.data[key] = map(key,this.internal.WithAlias.data[key]);
			}
		},
		varKeys : function(map) {
			for(var key in this.internal.WithAlias.data) {
				map(key);
			}
		},
		varValues : function(map) {
			for(var key in this.internal.WithAlias.data) {
				map(this.internal.WithAlias.data[key]);
			}
		},
		varSet : function(key,value) {
			this.internal.WithAlias.data[key] = value;
		},
		varExists : function(key) {
			if( key in this.internal.WithAlias.data ) return true;
			return false;
		},
		varGet : function(key) {
			if( key in this.internal.WithAlias.data ) {
				return this.internal.WithAlias.data[key];
			} else {
				return null;
			}
		},
		varRename : function(oldkey,newkey) {
			if( oldkey in this.internal.WithAlias.data ) {
				if( newkey in this.internal.WithAlias.data ) {
					return false;
				} else {
					this.internal.WithAlias.data[newkey] = this.internal.WithAlias.data[oldkey];
					this.varUnset(oldkey);
					this.emit("varRename",[oldkey,newkey]);
					return true;
				}
			} else {
				return false;
			}
		},
		varUnset : function(key) {
			if( key in this.internal.WithAlias.data) {
				this.internal.WithAlias.data[key] = null;
				delete this.internal.WithAlias.data[key];
			}
		},
		varClear : function() {
			var keys = [];
			for(var key in this.internal.WithAlias.data)
				keys.push(key);
			while(keys.length>0) {
				var key = keys.pop();
				this.internal.WithAlias.data[key] = null;
				delete this.internal.WithAlias.data[key];
			}
			
		}
	}
});


Class.define("WithDebug",{
	ctor : function() {
		
	}
	, proto : {
		debug : function(message) {
			var e = new Error(" at " + this.internal.type + " : " + message);
			console.error(e.stack);
		}
	}
});
var nodejs = false;
if (typeof module !== 'undefined' && module.exports) {
	require("../Class.js");
	nodejs = true;
}


Class.define("XMath",{ 
	ctor : function(format) {
		this.internal.XMath.format = format;
	},
	proto : {
		V3 : function(a,b,c) {
			var self = this.internal.XMath;
			return Class.create("XMath.V3",{"XMath.V3":[self.format,a,b,c]});
		},
		V3Array : function(options) { // options are : mean, normalized, ...
			var arr = Class.create("XMath.V3Array", { "XMath.V3Array" : [ this.internal.XMath.format,options ] });
			/* 
				usage:
				arr.on("load",function(pt) { });
			*/
			return arr;
		},
		M4 : function() {
			var self = this.internal.XMath;
			return Class.create("XMath.M4",{ "XMath.M4": [self.format] });
		}
	}
});


XMath = Class.create("XMath",{ "XMath" : ["Float32Array"] });



if (nodejs) {
	
	global.XMath = XMath;
}


Class.define("XMath.UnitCounter",{
	ctor : function() {
		this.value = 0;
	},
	proto : {

		inc : function() {
			this.value += 1;
		},
		dec : function() {
			this.value -= 1;
		},
		get : function() {
			return this.value;
		},
		getInc : function() {
			var r = this.value;
			this.value += 1;
			return r;
		},
		getDec : function() {
			var r = this.value;
			this.value -= 1;
			return r;
		},
		incGet : function() {
			this.value += 1;
			return this.value;
		},
		reset : function(start) {
			if(start==undefined || start==null)
				this.value = 0;
			else
				this.value = start;
		},
		decGet : function() {
			this.value -= 1;
			return this.value;
		},
		str : function() {
			
		}
	}
});

