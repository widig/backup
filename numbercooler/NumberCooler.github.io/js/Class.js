


if (typeof module !== 'undefined' && module.exports) {
	Type = require("./Type.js");
}





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
	console.log("Class define",name);
	
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
	
	
	if( ! Type.isString(name) ) throw "Class.define name must be a string.";
	
	
	
	if( meta != null && ! Type.isObject(meta) && ! Type.isArray(meta) ) throw "Class.define meta must be an object or an array.";
	if( meta == null ) meta = [];
	if( constructor != null && ! Type.isFunction( constructor ) ) throw "Class.define constructor must be an function.";
	if( constructor == null ) constructor = function(){};
	if( destructor != null && ! Type.isFunction( destructor ) ) throw "Class.define destructor must be an function.";
	if( destructor == null ) destructor = function(){};
	
	if( predef != null && ! Type.isObject(predef) ) throw "Class.define prototype must be an object.";
	if( predef == null ) predef = {};
	
	var behaves = [];
	if( "from" in options && Type.isArray(options.from) ) {
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
	
	if( Type.isObject(options) ) {
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
		var type = Type(key);
		if(type.name == "String") {
			var proto = cd.constructor.prototype;
			proto[key] = value;
			return this;
		} else if(type.name == "Object") {
			var proto = cd.constructor.prototype;
			for(var k in key) {
				if(Type.isObject(key[k])) {
					var check = false;
					var count = 0;
					var format = false;
					for(var k1 in key[k]) {
						if(Object.prototype.hasOwnProperty.apply(key[k],[k1])) {
							check = true;
							if(k1=="initProperty" && Type.isFunction(key[k][k1]) ) {
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
		throw "Class.extend where source '" + destiny + "' was not found.";
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
	mode = mode || {debug:true};
	if(mode && "debug" in mode) console.log("Class create",c);
	
	if(
		!(
			Type.isString(c) &&
			( opt==null || opt == undefined || Type.isObject(opt) )
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
					get : function() { return _inline; }
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
			if(Type.isArray(opt[ c.fullName])) {
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

