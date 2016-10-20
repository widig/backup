/*
ContextManager = (function() {
	var __debug = true;
	function contextmapping(opt) {
		this.enabled = true;
		this.patterns =  []; // name, require,array of operations over each argument, output
		this.applied = []; // [index of pattern, arguments used on method]
		this.parent = null;
		if("parent" in opt) this.parent = opt.parent;
		if("output" in opt) this.output = opt.output;
		else this.output = null;
		this.target = opt.target;
		this.methodBackup = opt.methodBackup;
		this.methodName = opt.methodName;
		this.map = {};
	}
	contextmapping.prototype.setMethod = function(callback) {
		this.methodFlag = callback;
	};
	contextmapping.prototype.getMap = function(name) {
		var current = null;
		var map = this.map;
		if(!(name in map)) {
			throw "map " + name + " not registered.";
		}
		current = map[name];
		return current;
	};
	contextmapping.prototype.addPattern = function(callback) {
		var pattern = { enabled : true, input : callback };
		this.patterns.push(pattern);
		return pattern;
	}
	function contextmanager() {
		this.flag = {};
		this.map = {};
		this.selected = "";
		this.id = 1;
		this.warningLevel = 0;
	}
	contextmanager.prototype.setWarningLevel = function(level) {
		this.warningLevel = level;
	};
	contextmanager.prototype.nextId = function() {
		var r = this.id;
		this.id += 1;
		if(this.id==1000000000) throw "not planned to run so long.";
		return r;
	};
	contextmanager.prototype.enableFlag = function(name) { // just like focus
		if(!(name in this.flag)) { this.flag[name] = { state : true }; }
		this.flag[ name ].state = true;
	};
	contextmanager.prototype.disableFlag = function(name) { // just like blur
		if(!(name in this.flag)) { this.flag[name] = { state : false }; }
		this.flag[ name ].state = false;
	};
	contextmanager.prototype.selectFlag = function(name) {
		if(name in this.flag) {
			this.selected = name;
		}
	};
	contextmanager.prototype.createMap = function(map,obj,method,after) {
		console.log("# CREATE MAP")
		var self = this;
		if(Object.prototype.toString.apply(method)!="[object String]") throw "method must be string";
		var backup = obj[method];
		if(!map) map = this.map;
		var current = null;
		var cm_args = null;
		if(!(obj in map)) {
			cm_args = { target : obj, methodBackup : backup, methodName : method };
			map[cm_args.target] = new contextmapping(cm_args);
		}
		cm_args = map[obj];
		cm_args.output = after ? after : null;
		obj[method] = function() {
			var aargs = Array.prototype.slice.call(arguments);
			var patterns = map[cm_args.target].patterns;
			var check = true;
			var ir = null;
			for(var x = 0; x < patterns.length;x++) {
				var p = patterns[x];
				if(check && p.enabled) {
					ir = p.input(aargs);
					if(("cancel" in ir) && ir.cancel) { // did not match on pattern
						return null;
					} else if(("hastracks" in ir) && ir.hastracks && ("replace" in ir) && ir.replace) {
						throw "not implemented";
					} else if(("hastracks" in ir) && ir.hastracks) { // pattern match
						var applied = [];
						var last = 0;
						ir.tracks.sort();
						for(var y = 0; y < ir.tracks.length;y++) {
							for(var z = last; z < ir.tracks[y];z++) {
								applied.push([ aargs[z] ]);
							}
							var backup_arg = aargs[ ir.tracks[y] ];
							var arr = [];
							arr.push(backup_arg);
							
							aargs[ ir.tracks[y] ] = function() {
								var aargs2 = Array.prototype.slice.call(arguments);
								if( p.enabled ) {
									for(var z = 0; z < ir.require.length;z++) {
										if( !self.flag[ ir.require[z] ].state ) {
											console.log("blocked by context manager.");
											return null;
										}
									}
								}
								return backup_arg.apply( cm_args.target, aargs2 );
							}
							arr.push( aargs[ ir.tracks[y] ]);
							applied.push(arr);
							last = ir.tracks[y]+1;
						}
						for( var z = applied.length; z < aargs.length; z++) {
							applied.push( [ aargs[z] ]);
						}
						map[cm_args.target].applied.push(applied);
						break;
					} else if(("replace" in ir) && ir.replace) {
						for(var y = 0; y < ir.replaceCursor.length;y++) {
							aargs[ ir.replaceCursor[y] ] = ir.replaceValue[y];
						}
						break;
					} else { // do nothing but emit an pre use of function
						break;
					}
				}
			}
			var r = map[cm_args.target].methodBackup.apply( cm_args.target, aargs );
			if( map[cm_args.target].output ){
				return map[cm_args.target].output.apply( cm_args.target, [ map[cm_args.target], r, ir ] );
			}
			return r;
		};
		return map[obj];
	};
	contextmanager.prototype.getMap = function(map,obj) {
		var current = null;
		if(!map) map = this.map;
		if(!(obj in map)) {
			throw "map " + obj + " not registered.";
		}
		current = map[obj];
		return current;
	};
	var e = new contextmanager();
	e.enableFlag("default");
	e.selectFlag("default");
	
	// track all
	var window_addEventListener_map = e.createMap(null,window,"addEventListener",function(map,result,ir){
		return result;
	});
	window_addEventListener_map.addPattern(function() {
		console.log("window.addEventListener",JSON.stringify( Array.prototype.slice.call(arguments) ));	
		return {
			cancel : false,
			hastracks : true,
			tracks : [1],
			require : ["default"]
		}
	});
	var window_removeEventListener_map = e.createMap(null,window,"removeEventListener",function(map,result,ir) {
		return result;
	});
	window_removeEventListener_map.addPattern(function() {
		console.log("window.removeEventListener",JSON.stringify( Array.prototype.slice.call(arguments) ));	
		var check = false;
		var sel_value = null;
		for( var x = 0; x < window_addEventListener_map.applied.length;x++) {
			if( 
				window_addEventListener_map.applied[x][0][0] == arguments[0] &&
				window_addEventListener_map.applied[x][1][0] == arguments[1] &&
				window_addEventListener_map.applied[x][2][0] == arguments[2]
			) {
				sel_value = window_addEventListener_map.applied[x][1][1];
				check = true;
				break;
			}
		}
		var r = {
			cancel : !check,
			hastracks : false
		};
		if( check ) {
			r.replace = true;
			r.replaceCursor = [1];
			r.replaceValue = [sel_value];
		}
		return r;
	});
	
	var document_createElement_map = e.createMap(null,document,"createElement",function(map,result,ir){
		console.log("begin document.createElement map",result);	
		var element_addEventListener_map = e.createMap(null,result,"addEventListener",function(map,result,ir){
			console.log("element.addEventListener");	
			return result;
		});
		element_addEventListener_map.addPattern(function() {
			console.log("element.addEventListener",JSON.stringify( Array.prototype.slice.call(arguments) ));	
			return {
				cancel : false,
				hastracks : true,
				tracks : [1],
				require : ["default"]
			}
		});
		var element_removeEventListener_map = e.createMap(null,result,"removeEventListener",function(map,result,ir) {
			return result;
		});
		element_removeEventListener_map.addPattern(function() {
			console.log("element.removeEventListener",JSON.stringify( Array.prototype.slice.call(arguments) ));	
			var check = false;
			var sel_value = null;
			for( var x = 0; x < element_addEventListener_map.applied.length;x++) {
				if( 
					element_addEventListener_map.applied[x][0][0] == arguments[0] &&
					element_addEventListener_map.applied[x][1][0] == arguments[1] &&
					element_addEventListener_map.applied[x][2][0] == arguments[2]
				) {
					sel_value = element_addEventListener_map.applied[x][1][1];
					check = true;
					break;
				}
			}
			var r = {
				cancel : !check,
				hastracks : false
			};
			if( check ) {
				r.replace = true;
				r.replaceCursor = [1];
				r.replaceValue = [sel_value];
			}
			return r;
		});
		
		console.log("end document.createElement map", result);
		return result;
	});
	document_createElement_map.addPattern(function() {
		console.log("document.createElement",JSON.stringify( Array.prototype.slice.call(arguments) ));
		return {
			cancel : false,
			hastracks : false
		}
	});
	
	// e.onMap("[default]control.addEventListener"); // then this set every result
	// track only keypress example
	
	return e;
})();
*/