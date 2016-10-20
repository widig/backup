var _global = [["global"],[{$:["idCount"],idCount:0}],[]];
_global.generateId = function() {
	_global[1][0].idCount += 1;
	return _global[1][0].idCount;
};

// machine abstraction
var app = {
	set : {},
	instances : {},
	info : {},
	history : []
};
function Machine(options) {
	options = options || {
		name : "main"
	};
	var obj = [
		["machine"],[
			{
				$:["name","stack","memory","warnings","errors","interrupt","timer"]
				, name : options.name 
				, stack : [["stack"],[{$:[]}],[]]
				, memory: [["memory"],[{$:[]}],[]]
				, warnings : [["warnings"],[{$:[]}],[]]
				, errors : [["errors"],[{$:[]}],[]]
				, interrupt : [["interrupt"],[{$:[]}],[]]
				, timer : [["timer"],[{$:[]}],[]]
				, log : [["log"],[{$:[]}],[]]
				, runtime : [["runtime"],[{$:[]}],[]]
				, lang : [
					["lang"],
					[{ // user-space
						$:[]
					}],[
						// components of generic language(which is bs.)
						[["config"],[{$:["selected"],selected:"BookScript"}],[]]
						// may store date and time changes if want to log and fit something.
					]
				]
			}
		],[
			// components of machine tp.
		]
	];
	if("creator" in options) {
		obj[1][0].$.push("creator");
		obj[1][0].$.push("date");
		obj[1][0].creator = options.creator;
		obj[1][0].date = new Date();
	}
	obj.language = null;
	obj.bind = function(lang) { // bind to language
		obj.language = lang;
	}
	// update memory model
	return obj;
}
_global[1][0].$shared = [["$shared"],[{$:[]}],[]]; // concious storage
// $shared == cache
// level 0
// level 1
// level 2

// setup of main machine
function createMachine() {
	var _mc = Machine({name:_global.generateId(),creator:_global});
	_global[2].push(_mc);
	return _mc;
}

function Lang(options) {
	var topArgs = [];
	for(var x = 0; x < arguments.length;x++) {
		topArgs.push(arguments[x]);
	}
	app.history.push( topArgs );
	for(var key in options) {
		if(key == "cmd") {
			if(options.cmd == "set") {
				
				app.set[ arguments[1] ] = Admin({cmd:"load"}, arguments[1], arguments[2] );
				return app.set[ arguments[1] ];
				
			} else if(options.cmd == "boot") {
				//console.log(">>>>>>>>>>>>>");
				var mc = createMachine();
				//console.log("machine:",mc);
				app.instances[ arguments[1] ] = app.set[ arguments[2] ]( mc ,_global);
				app.info[ arguments[1] ] = {
					machine : mc,
					name : arguments[1],
					instance : app.instances[arguments[1]],
					version : [1,0],
					enabled : true
				};
				mc.bind( app.instances[ arguments[1] ] );
				
				/* 
					convert [ 
						["lang"],
						[{}],
						[
							[["main"]],
							[["customRule"]]
						] 
					]
					to
					{
						"main" : [
							[ [0,] ]
						],
						"customRule" : [
							[ [] ]
						]
					}
				*/
				
				var before = app.instances[ arguments[1] ].lang;
				var after = {};
				if(before[0][0] == "lang") {
					for(var x = 0; x < before[2].length;x++) {
						var rule = before[2][x];
						var i = after[ rule[0][0] ] = [];
						for(var y = 0; y < rule[2].length;y++) {
							if(rule[2][y][0][0] == "option") {
								var option = rule[2][y];
								var j = [];
								for(var z = 0; z < option[2].length;z++) {
									var item = option[2][z];
									if(item[0][0] in Go) {
										if("value" in item[1][0]) {
											var a = Go[ item[0][0] ]( item[1][0].value );
											if(item[0][0] == "string" && "ignoreCase" in item[1][0]) {
												a.push({ignoreCase:item[1][0].ignoreCase});
											} else if(item[0][0] == "ruleAmount" && "min" in item[1][0] && "max" in item[1][0]) {
												a.push(item[1][0].min);
												a.push(item[1][0].max);
											}  else if(item[0][0] == "set" && "function" in item[1][0] && "arguments" in item[1][0]) {
												a.push(item[1][0]["function"]);
												a.push(item[1][0]["arguments"]);
											}
											j.push(a);
										} else if(item[0][0] == "codeRange" && "min" in item[1][0] && "max" in item[1][0]) {
											a.push(item[1][0].min);
											a.push(item[1][0].max);
											j.push(a);
										}
									}
								}
								i.push(j);
							}
						}
					}
				}
				app.instances[ arguments[1] ].lang = after;
				
				return app.instances[ arguments[1] ];
			} else if(options.cmd == "use") {
				return app.instances[ arguments[1] ];
				
			} else if(options.cmd == "isBooted") {
				return ( arguments[1] in app.info);
			} else if(options.cmd == "isRunning") {
				
				
				
				
			} else if(options.cmd == "run") {
				if(app.info[ arguments[1] ].enabled) {
					
					//console.log("!!!! RUN");
					var data = arguments[2];
					function getString(rule) {
						var sb = [];
						if(rule.type == 0) { // get in
							sb.push( getString() );
						} else if(rule.type == 1) { // string
							
						} else if(rule.type == 4) { // charset
							
						} else if(rule.type == 7) { // coderange
							
						} else if(rule.type == 11) { // anychar
						
						}
						return sb.join("");
					}
					if(data.result) {
						var stack = [ data ];
						while(stack.length>0) {
							var rule = stack.shift();
							//console.log(rule,rule.name);
							
							
							if("data" in rule) { // get string of each item to pass to event
								for(var x = 0; x < rule.data.length;x++) {
									stack.unshift(rule.data[rule.data.length-1-x]);
								}
							}
							
							
							if(rule.name in app.instances[ arguments[1] ].events) {
								//
								
								var arr = [];
								for(var x = 0; x < rule.data.length;x++) {
									if("range" in rule.data[x]) {
										arr.push( data.code.substring( rule.data[x].range[0], rule.data[x].range[1] ) );
									}
								}
								//console.log("@@ TRIGGER!!",rule.index,arr);
								// first argument is context, which is the machine
								app.instances[ arguments[1] ].events[ rule.name ]( 
									app.info[ arguments[1] ].machine,rule.index, arr 
								);
								
							}
						}
						//console.log("!!",data);
					}
					//
				}
			} else if(options.cmd == "enable") {
				app.info[ arguments[1] ].enabled = true;
			} else if(options.cmd == "disable") {
				app.info[ arguments[1] ].enabled = false;
			} else if(options.cmd == "run") {
				app.instances[ arguments[1] ]
				
			} else if(options.cmd == "finish") {
				app.instances[ arguments[1] ].close();
				delete app.instances[ arguments[1] ];
				delete app.info[ arguments[1] ];
			} else if(options.cmd == "list") {
				var arr = [];
				for(var key in app.set) arr.push(key);
				return arr;
			}
		}
	}
	return null;
	
}


module.exports = Lang;