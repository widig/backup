Class.define("3Devils",{
	from  : ["WithEvents","WithAlias","WithArray"],
	ctor : function() {
		console.log("[system] 3Devils");
		
		var i = this.internal["3Devils"].data = {};
		i.clock = Class.create("XMath.Clock", { "XMath.Clock" : [true] });
		i.at = 0;
		i.state = "boot";
		
		i.stages_hash = {};
		i.stages = [];
		i.global = {};
		i.history = [];
		i.historyLog = false;
		i.ids = 0;
		i.programs = {
			"default" : null
		};
		i.enabled = false;
		
		i.cache = {};
		i.cache.shaders = {};
		i.cache.shaders.vs = [];
		i.cache.shaders.fs = [];
		i.cache.program = {};
		i.cache.textures = {};
		i.cache.geometries = {};
		Object.defineProperty(this,"vertexCache", { get : function() { return i.cache.shaders.vs; } } );
		Object.defineProperty(this,"fragmentCache", { get : function() { return i.cache.shaders.fs; } } );
		Object.defineProperty(this,"programCache", { get : function() { return i.cache.program; } } );
		Object.defineProperty(this,"texturesCache", { get : function() { return i.cache.textures; } } );
		Object.defineProperty(this,"geometriesCache", { get : function() { return i.cache.geometries; } } );
		
		i.scenarioSelectedName = "";
		i.scenarioSelected = -1;
		Object.defineProperty(this,"scenarioSelectedName", { 
			get : function() { return i.scenarioSelectedName; },
			set : function(val) {
				i.scenarioSelectedName = val;
			}
		});
		Object.defineProperty(this,"isPlaying",{ get : function() { return i.enabled; } });
		
		
		this.on("play",function() {
			// check stages that has that scene on scenario
			
			var shutdown = false;
			var i = this.internal["3Devils"].data;
			
			if(i.state == "boot") {
				i.start = clock.start();
				i.at = 0;
				this.emit("next");
				
			} else if(i.state == "live") {
				// start recording
			} else if(i.state == "playing") {
				// master sound back
				
				i.at += clock.getDelta(); // refresh current time
			} else if(i.state == "pause") {
				i.start = clock.start();
				
				var delta = clock.getDelta();
				var cycles = clock.getCycles();
				
				i.at += delta;
				
			} else if(i.state == "stoped") {
				var stoped_interval = clock.getDelta();
				console.log("[system] it was stoped for : " + stoped_interval);
				i.start = clock.start();
				i.at = 0;
			} else { // shutdown
				shutdown = true;
			}
			
			if(!shutdown) {
				i.enabled = true;
				i.state = "playing";
				console.log("PLAY enabled");
				if(i.scenarioSelectedName !="") {
					for(var x = 0; x < i.stages.length;x++) {
						if( i.stages.check(i.scenarioSelectedName) ) {
							i.stages[x].play();	
						}
					}
				}
				
			}
		});
		
		this.on("pause",function() {
			if(i.state == "boot") {
				// count?
			} else if(i.state == "live") {
				// stop recording
				throw "not implemented =Q= BUG"; // may put a bug here
			} else if(i.state == "playing") {
				// master sound fade
				var i = this.internal["3Devils"].data;
				i.at = clock.getDelta();
				console.log("PAUSED at ", i.at);
				i.state = "paused";
				i.enabled = false;
			} else if(i.state == "stoped") {
				// do nothing
			} else if(i.state == "paused") {
				// do nothing
				// count?
			} else { // shutdown
			
			}
			
		});
		this.on("stop",function() {
			var i = this.internal["3Devils"].data;
			i.start = clock.start();
			i.clock.stop();
			i.at = 0;
			i.state = "stoped";
			i.enabled = false;
		});
		this.on("next",function() {
			var i = this.internal["3Devils"].data;
			i.scenarioSelected = ( i.scenarioSelected + 1 ) % i.scenes.length;
		});
		this.on("previous",function() {
			var i = this.internal["3Devils"].data;
			i.scenarioSelected = ( i.scenarioSelected - 1 ) % i.scenes.length;
		});
		
	},
	proto : {
		historyBegin : function() {
			var i = this.internal["3Devils"].data;
			i.historyLog = true;
		},
		historyDump : function() {
			
			var i = this.internal["3Devils"].data;
			if(i.historyLog) {
				for(var x = 0; x < i.history.length;x++) {
					console.log( i.history[x] );
				}
			}
		},
		setGlobal : function(set) {
			var i = this.internal["3Devils"].data;
			for(var key in set)
				if(!(key in i.global))
					i.global[key] = set[key];
			// broadcast global update to all stages
			for(var x = 0; x < i.stages.length;x++) {
				i.stages[x].emit("setGlobal");
			}
			return this;
		},
		getGlobal : function() {
			var i = this.internal["3Devils"].data;
			return i.global;
		},
		PlayPause : function(mode,external_animation_callback) { // mode = &[live=build|file] &function(scene -> so someone that is a bot talked to you on INTERNET and is saying something important? is it an meteour? changes my pocket?)
			if( mode == "live") {
				var i = this.internal["3Devils"].data;
				i.state = "live";
				if(this.isPlaying) {
					this.emit("pause"); // do not record anything on file
				} else {
					this.emit("play"); // continue to record
				}
			} else { // static file, do not modify without passing throught security guard (oen orez)
				if(this.isPlaying) {
					this.emit("pause"); 
				} else {
					this.emit("play");
				}
			}
		},
		Stop : function() {
			this.emit("stop");
		},
		Previous : function() {
			this.emit("previous");
		},
		Next : function() {
			this.emit("next");
		},
		Goto : function(scene_name) {
			var i = this.internal["3Devils"].data;
			i.scenarioSelectedName = scene_name;
		},
		PlaylistEnqueue : function(scene_name) {
			
		},
		PlaylistPush : function(scene_name) {
			
		},
		PlaylistRemove : function(scene_name) {
			
		},
		Load : function(data,bindings) {
			
			// last play history
			
			var i = this.internal["3Devils"].data;
			i.at = 0;
			i.start = i.clock.start();
			var ret = {};
			
			// load local stages
			
			// clear cache shaders
			var len0 = i.cache.shaders.vs.length;
			var len1 = i.cache.shaders.fs.length;
			for(var x = 0; x < len0;x++) {
				i.cache.shaders.vs.pop();
			}
			for(var x = 0; x < len1;x++) {
				i.cache.shaders.fs.pop();
			}
			
			for(var x = 0; x < data.shaders.vs.length;x++) {
				i.cache.shaders.vs.push( data.shaders.vs[x] );
			}
			for(var x = 0; x < data.shaders.fs.length;x++) {
				i.cache.shaders.fs.push( data.shaders.fs[x] );
			}
			
			
			// clear current stages
			var skeys = [];
			for(var key in i.stages_hash)
				skeys.push(key);
			for(var x = 0; x < skeys.length;x++)
				delete i.stages_hash[skeys[x]];
			
			
			// i.stages
			
			for(var x = 0; x < i.stages.length;x++) {
				var j = i.stages[x].internal["3Devils.Stage"].data;
				j.parent.elementsClear();
			}
			var len0 = i.stages.length;
			for(var x = 0; x < len0;x++) {
				i.stages.pop();
			}
			
			
			for( var x = 0; x < data.stages.length;x++) {
				if( data.stages[x].name in bindings) {
					var stage = this.NewStage(data.stages[x].name, bindings[ data.stages[x].name ]);
					
					
					stage.Load(data.stages[x]);
					
					ret[ data.stages[x].name ] = stage;
				} else {
					console.log( data.stages[x].name );
					throw "unkown stage";
				}
			}
			
			return ret;
			
		},
		Save : function() {
			console.log("FW SAVE");
			var i = this.internal["3Devils"].data;
			
			var ret = {};
			ret.shaders = {};
			ret.shaders.fs = [];
			ret.shaders.vs = [];
			
			for(var x = 0; x < i.cache.shaders.vs.length;x++) {
				ret.shaders.vs.push( i.cache.shaders.vs[x] );
			}
			for(var x = 0; x < i.cache.shaders.fs.length;x++) {
				ret.shaders.fs.push( i.cache.shaders.fs[x] );
			}
			
			ret.stages = [];
			// save local stages
			for(var x = 0;x < i.stages.length;x++) {
				var stage = {};
				ret.stages.push(stage);
				i.stages[x].Save(stage);
			}
			
			ret.signature = "NumberCooler 3Devils";
			ret.version = [1,0];
			
			return ret;
		},
		NewStage : function(name,target) { // build mode
			var i = this.internal["3Devils"].data;
			var stage = Class.create("3Devils.Stage",{ "3Devils.Stage" : [this,name,target] });
			i.stages_hash[name] = stage;
			i.stages.push(stage);
			return stage;
		},
		NewActor : function() {
			
		},
		RemoveActor : function() {
			
		},
		ActorCommand : function() {
			
		},
		Get : function(name) {
			return i.stages_hash[name];
		},
		
	}
});




/*

	
	stage ->
		scene ->	| instance 
						|skeleton
							|geometry:object
								|materials
							|framebuffers
						|skeleton
							|lights
						| actors binding
						| camera
					| active camera
	program_pool
	program [ skeleton ]->  |[ lights ],[light setup by pattern] -> [fragment]
							|[ geometry ],[textures],[lights] -> [fragment]
	program_camera_type = objects + materials + camera_instance + lights + framebuffers; it must be indexed by 3Devils
	
	
*/



Class.define("3Devils.Stage",{ // the initial idea was to be a scene pool, but now its a canvas handler and pointer scene pool, scene is independent of stages, because viewport ambient
	from : ["WithEvents"],
	ctor : function(framework,stage_name,parent) {
		
		var self = this;
		var i = this.internal["3Devils.Stage"].data = {};
		
		// storage
		i.name = stage_name;
		i.actors = [];
		i.viewports = [];
		
		i.padding = [0,0,0,0]; // left,top,right,bottom
		i.border = [0,0,0,0]; // left,top,right,bottom
		i.size = [1,1];
		i.aspect = [1,1];
		i.source = [1,1];
		i.reduce = 0;
		Object.defineProperty(this,"reduce",{ get : function() { return i.reduce; }, set : function(val) { 
			if( Object.prototype.toString.apply(val) == "[object Number]" && parseInt(val)==parseFloat(val)) {
				i.reduce = val; 
			} else {
				throw "reduce value must be integer";
			}
		}});
		i.parent = parent;
		i.state = "boot";
		i.dom_style = {};
		i.style = {};
		i.style.clearColor = [0,0,0,1];
		var str_white = "rgb(255, 255, 255)";
		var str_solid = "solid";
		i.borderColor = [str_white,str_white,str_white,str_white];
		i.borderStyle = [str_solid,str_solid,str_solid,str_solid];
		
		// volatile
		i.cache = {};
		i.cache.program = {};
		Object.defineProperty(this,"programCache", { get : function() { return i.cache.program; } } );
		
		i.mouse = {
			left : 0,
			top : 0,
			button : 0,
			at_stage : null,
			dragging : false,
			backup : null // start point
		};
		i.keyboard = { };
		i.extensions = null;
		i.framework = framework;
		Object.defineProperty(this,"framework",{ get : function() { return i.framework; } });
		
		
		var canvas = parent.elementNew(stage_name,"canvas");
		canvas.style.display = ""; // may be none? dependends on purpose
		canvas.style.position = "absolute";
		canvas.style.left = "0px";
		canvas.style.top = "0px";
		canvas.style.width = "100px";
		canvas.style.height = "100px";
		canvas.style.backgroundColor = "#FFF";
		canvas.style.color = "#FFF";
		canvas.style.border = "solid 0px #FFF";
		
		i.canvas = canvas;
		Object.defineProperty(this, "canvas", { get : function() { return i.canvas; } } )
		Object.defineProperty(this, "canvasContainer" , { get : function() { return parent.elementGetContents(stage_name); } });
		
		i.canvas.addEventListener("mousemove",function(e) {
			event.stopPropagation();
			event.preventDefault();
			
			self.emit("mousemove",[e]);
			
			return false;
		});
		i.canvas.addEventListener("mousedown",function(e) {
			event.stopPropagation();
			event.preventDefault();
			
			self.emit("mousedown",[e]);
			
			
			return false;
		});
		i.canvas.addEventListener("mouseup",function(e) {
			event.stopPropagation();
			event.preventDefault();
			
			self.emit("mouseup",[e]);
			
			
			return false;
		});
		i.canvas.addEventListener("webglcontextcreationerror", function(e) {
			console.log(e.statusMessage || "Unknown error"); 
		}, false);
		
		var GL = null;
		var webgl_string = [ "webgl","experimental-webgl","moz-webgl","webkit-3d"];
		var error = 0;
		for(var x = 0; x < webgl_string.length;x++) {
			try {  
				GL = i.canvas.getContext(webgl_string[x], {antialias: true, alpha: true});  
				error = 0;
				console.log("using ",webgl_string[x]);
				break;
			} catch (e) { 
				error = 1;
			}
		}
		if( !error ) {
			i.context = GL;
			Object.defineProperty(this,"context", { get : function() { return i.context; }});
			i.extensions = GL.getSupportedExtensions();
			console.log("list of webgl extensions for this hardware:");
			console.log(i.extensions);
			i.canvas.addEventListener("webglcontextlost", function(e) {
				console.log(e); 
				//throw "lost context.";
				e.preventDefault();
				
				// may cancel event loop
				
				
			}, false);
			i.canvas.addEventListener("webglcontextrestored", function(e) {
				console.log(e); 
				throw "restored context.";
				
				// restore data
				
				// may restore event loop
				
				
			}, false);
		} else {
			throw "cant init webgl.";
		}
		
		
		// observer is used to check changes on html (only on live mode)
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				var i = self.internal["3Devils.Stage"].data;
				/*
				console.log("DOM CHANGE"
					,mutation
					,mutation.target.style
				);
				*/
				var st = mutation.target.style;
				i.border = [
					isNaN( parseInt(st.borderLeftWidth) ) ? 0 : parseInt(st.borderLeftWidth),
					isNaN( parseInt(st.borderTopWidth) ) ? 0 : parseInt(st.borderTopWidth),
					isNaN( parseInt(st.borderRightWidth) )? 0 : parseInt(st.borderRightWidth),
					isNaN( parseInt(st.borderBottomWidth) )? 0 : parseInt(st.borderBottomWidth)
				];
				i.padding = [
					isNaN( parseInt(st.paddingLeft) ) ? 0 : parseInt(st.paddingLeft),
					isNaN( parseInt(st.paddingTo) ) ? 0 : parseInt(st.paddingTop),
					isNaN( parseInt(st.paddingRight) )? 0 : parseInt(st.paddingRight),
					isNaN( parseInt(st.paddingBottom) )? 0 : parseInt(st.paddingBottom)
				];
				i.borderColor = [
					st.borderLeftColor,
					st.borderTopColor,
					st.borderRightColor,
					st.borderBottomColor
				];
				i.borderStyle = [
					st.borderLeftStyle,
					st.borderTopStyle,
					st.borderRightStyle,
					st.borderBottomStyle
				];
				//console.log(" @@@@",i.border,i.padding,i.borderColor,i.borderStyle);
				
				
				
			});
			
		});
		// configuration of the observer:
		var config = { 
			attributes: true, 
			childList: true, 
			characterData: true, 
			subtree : true, 
			attributeOldValue: true, 
			characterDataOldValue: true, 
			/*
				// cant track this
				attributeFilter: true 
			*/
		};
		observer.observe(i.canvas,config);
		
		Object.defineProperty(this,"width",{
			get : function() {  return i.size[0]; },
			set : function(val) { 
				i.size[0] = val; 
				i.canvas.setAttribute("width",val);
			}
		});
		Object.defineProperty(this,"height",{
			get : function() {  return i.size[1];  },
			set : function(val) { 
				i.size[1] = val; 
				i.canvas.setAttribute("height",val);
			}
		});
		Object.defineProperty(this,"sourceX",{
			get : function() { return i.source[0]; },
			set : function(val) {
				i.source[0] = val;
				i.canvas.style.width = val+"px";
			}
		});
		Object.defineProperty(this,"sourceY",{
			get : function() { return i.source[1]; },
			set : function(val) {
				i.source[1] = val;
				i.canvas.style.height = val+"px";
			}
		});
		
		
		
		
		
		var hidden; 
		if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
		  hidden = "hidden";
		} else if (typeof document.mozHidden !== "undefined") {
		  hidden = "mozHidden";
		} else if (typeof document.msHidden !== "undefined") {
		  hidden = "msHidden";
		} else if (typeof document.webkitHidden !== "undefined") {
		  hidden = "webkitHidden";
		}
		
		i.display = {
			hiddenName : hidden,
			enabled : true,
			focus : true,
			debug : false,
			element : i.canvas
		};
		
		// multi scenario with user trying to confuse program ???
		
		
		// dangerous situation, how to put console at top level?
		
		UI.Window.on("resize",function(e) {
			self.emit("resize",[e]);
		});
		UI.Window.on("blur",function() {
			//console.log("BLUR");
			i.display.enabled = false;
		});
		UI.Window.on("focus",function() {
			//console.log("FOCUS");
			i.display.enabled = true;
		});
		UI.Window.on("keydown",function(e) {
			// if has focus
			
			
			self.emit("keydown",[e])
		});
		UI.Window.on("keyup",function(e) {
			// if has focus
			self.emit("keyup",[e])
		});
		
		
		
		this.on("keydown",function(event) {
			i.keyboard[ event.keyCode ] = {
				value : true
			};
			this.emit("keydown_stage",[i.keyboard]);
			return true;
		});
		
		
		this.on("keyup",function(event) {
			if(event.keyCode in i.keyboard) {
				i.keyboard[ event.keyCode ].value = false;
			} else {
				i.keyboard[ event.keyCode ] = {
					value : false
				};
			}
			this.emit("keyup_stage",[i.keyboard]);
			return true;
			
		});
		
		
		this.on("mousemove",function(event) {
			var rect = event.target.getBoundingClientRect();
			if( 
				(event.clientX-rect.left) > (i.padding[0] + i.border[0]) &&
				(event.clientX-rect.left) < (i.source[0] + i.padding[0] + i.border[0]) &&
				(event.clientY-rect.top) > (i.padding[1] + i.border[1]) &&
				(event.clientY-rect.top) < (i.source[1] + i.padding[1] + i.border[1])
			) {
				i.mouse.left = 2 * ( 
				( 
					(event.clientX-(rect.left + i.padding[0]+i.border[0]))
				) / i.source[0] ) - 1;
				i.mouse.top = 2 * (
				(
					(event.clientY-(rect.top + i.padding[1]+i.border[1]))
				) / i.source[1] ) - 1;
				i.mouseInFrame = true;
				// start mouse in frame
				// this is [-1,1] inside stage -> must convert to viewport then to camera aspect
				self.emit("mousemove_stage",[i.mouse]);
				
				
				// end mouse in frame code
				//console.log(i.mouse);
			} else {
				i.mouseInFrame = false;
			}
			
			return true;
		});
		this.on("mousedown",function(event) {
			
			var rect = event.target.getBoundingClientRect();
			if( 
				(event.clientX-rect.left) > (i.padding[0] + i.border[0]) &&
				(event.clientX-rect.left) < (i.source[0] + i.padding[0] + i.border[0]) &&
				(event.clientY-rect.top) > (i.padding[1] + i.border[1]) &&
				(event.clientY-rect.top) < (i.source[1] + i.padding[1] + i.border[1])
			) {
				i.mouse.left = 2 * ( 
				( 
					(event.clientX-(rect.left + i.padding[0]+i.border[0]))
				) / i.source[0] ) - 1;
				i.mouse.top = 2 * (
				(
					(event.clientY-(rect.top + i.padding[1]+i.border[1]))
				) / i.source[1] ) - 1;
				i.mouseInFrame = true;
				// start mouse in frame
				
				// this is [-1,1] inside stage -> must convert to viewport then to camera aspect
				i.mouse.button |= 0xF & ( 1 << (event.button+1) );
				// if in any image map then emit start_drag
				
				self.emit("mousedown_stage",[i.mouse]);
			
				
		
				// end mouse in frame code
				//console.log(i.mouse);
			} else {
				i.mouseInFrame = false;
			}
			return true;
			
		});
		this.on("mouseup",function(event) {
			var rect = event.target.getBoundingClientRect();
			if( 
				(event.clientX-rect.left) > (i.padding[0] + i.border[0]) &&
				(event.clientX-rect.left) < (i.source[0] + i.padding[0] + i.border[0]) &&
				(event.clientY-rect.top) > (i.padding[1] + i.border[1]) &&
				(event.clientY-rect.top) < (i.source[1] + i.padding[1] + i.border[1])
			) {
				i.mouse.left = 2 * ( 
				( 
					(event.clientX-(rect.left + i.padding[0]+i.border[0]))
				) / i.source[0] ) - 1;
				i.mouse.top = 2 * (
				(
					(event.clientY-(rect.top + i.padding[1]+i.border[1]))
				) / i.source[1] ) - 1;
				i.mouseInFrame = true;
				// start mouse in frame
				
			
				i.mouse.button &= ~( (~0xF) | ( 1 << (event.button+1) ) );
				// if dragging then emit stop_drag
				self.emit("mouseup_stage",[i.mouse]);
				
				
				
				// end mouse in frame code
				//console.log(i.mouse);
			} else {
				i.mouseInFrame = false;
			}
			return true;
			
			
		});
		
		this.on("keydown",function(e) {
			i.keyboard[ e.keyCode ] = {
				value : true
			}
			//console.log(e.keyCode);
			this.emit("beforeStartKey",[i.keyboard,e.keyCode]);
			this.emit("startKey",[i.keyboard,e.keyCode]);
		});
		
		this.on("keyup",function(e) {
			if(e.keyCode in i.keyboard) {
				i.keyboard[ e.keyCode ].value = false;
			} else {
				i.keyboard[ e.keyCode ] = {
					value : false
				}
			}
			this.emit("endKey",[i.keyboard,e.keyCode]);
			this.emit("afterEndKey",[i.keyboard,e.keyCode]);
			
		});
		
		
		this.on("setGlobal",function() {
			var global = i.framework.getGlobal();
			
		});
		
	}, 
	proto : {
		Draw : function() {
			var i = this.internal["3Devils.Stage"].data;
			
			
			//this.context.clear(gl.COLOR_BUFFER_BIT);
			var gl = this.context;
			
			gl.viewport(0,0,this.width,this.height); // just to clear and full layer
			
			gl.clearColor(
				i.style.clearColor[0], // r
				i.style.clearColor[1], // g
				i.style.clearColor[2], // b
				i.style.clearColor[3]  // a
			);
			gl.clear( gl.COLOR_BUFFER_BIT );
			
			
			
			for(var x = 0; x < i.viewports.length;x++) {
				i.viewports[x].Draw(this.context);
			}
			this.context.finish();
		},
		setSize : function(w,h) {
			var i = this.internal["3Devils.Stage"].data;
			console.log("set size");
			
			var last = [ this.width, this.height ];
			var diff = [ w - this.width, h - this.height ];
			
			this.width = w << i.reduce;
			this.height = h << i.reduce;
			this.sourceX = w;
			this.sourceY = h;
			
			
			
		},
		NewViewport : function(name,x,y,w,h) {
			var i = this.internal["3Devils.Stage"].data;
			var viewport = Class.create("3Devils.Viewport",{ "3Devils.Viewport" : [this,name,x,y,w,h] });
			i.viewports.push(viewport);
			return viewport;
			
		},
		ClearColor : function(r,g,b,a) {
			console.log("??????",r,g,b,a);
			var i = this.internal["3Devils.Stage"].data;
			if(arguments.length>1) {
				i.style.clearColor[0] = r/255;
				i.style.clearColor[1] = g/255;
				i.style.clearColor[2] = b/255;
				i.style.clearColor[3] = a/255;
				console.log("set",i.style.clearColor);
			} else { // dword
				
			}
		},
		Load : function(stage_context) {
			var i = this.internal["3Devils.Stage"].data;
			var c = stage_context;
			i.name = c.name;
			
			for(var x = 0; x < 4;x++) {
				i.padding[x] = c.padding[x];
				i.border[x] = c.border[x];
			}
			for(var x = 0; x < 2;x++) {
				i.size[x] = c.size[x];
				i.aspect[x] = c.aspect[x];
				i.source[x] = c.source[x];
			}
			i.reduce = c.reduce;
			i.state = c.state;
			
			var len0 = i.actors.length;
			for(var x = 0; x < len0;x++) {
				i.actors.pop();
			}
			
			for(var x = 0; x < c.actors.length;x++) {
				// create new actor instance
			}
			
			
			for(var x = 0; x < c.viewports.length;x++) {
				var vp = c.viewports[x];
				var vpi = this.NewViewport( vp.name,vp.bounds[0],vp.bounds[1],vp.bounds[2], vp.bounds[3] );
				vpi.Load( vp );
			}
			
			i.canvas.style.paddingLeft = c.padding[0];
			i.canvas.style.paddingTop = c.padding[1];
			i.canvas.style.paddingRight = c.padding[2];
			i.canvas.style.paddingBottom = c.padding[3];
			
			
			i.canvas.style.borderLeft = c.borderStyle[0] + " " + c.border[0] + "px " + c.borderColor[0];
			i.canvas.style.borderTop = c.borderStyle[1] + " " + c.border[1] + "px " + c.borderColor[1];
			i.canvas.style.borderRight = c.borderStyle[2] + " " + c.border[2] + "px " + c.borderColor[2];
			i.canvas.style.borderBottom = c.borderStyle[3] + " " + c.border[3] + "px " + c.borderColor[3];
			
			this.setSize( c.source[0], c.source[1] );
			
			
		},
		Save : function(stage_context) {
			var i = this.internal["3Devils.Stage"].data;
			// fill the context with things that will be used on load (overwrite mode)
			
			// container binds are the "player"
			
			var c = stage_context;
			c.name = i.name;
			//console.log("SAVING");
			
			//console.log(i.border,i.borderStyle,i.borderColor);
			
			c.padding = [i.padding[0],i.padding[1],i.padding[2],i.padding[3]];
			c.borderStyle = [i.borderStyle[0],i.borderStyle[1],i.borderStyle[2],i.borderStyle[3]];
			c.borderColor = [i.borderColor[0],i.borderColor[1],i.borderColor[2],i.borderColor[3]];
			c.border = [i.border[0],i.border[1],i.border[2],i.border[3]];
			c.size = [i.size[0],i.size[1]];
			c.aspect = [i.aspect[0],i.aspect[1]];
			c.source = [i.source[0],i.source[1]];
			c.reduce = i.reduce;
			c.state = i.state;
			
			c.actors = [];
			for(var x = 0; x < i.actors.length;x++) {
				
				var actor = i.actors[x].Save();
				c.actors.push(actor);
			}
			
			for(var x = 0; x < i.viewports.length;x++) {
				c.viewports = [];
				var viewport = {};
				i.viewports[x].Save(viewport);
				c.viewports.push(viewport);
				
			}
			
		}
	}
});

Class.define("3Devils.Viewport",{
	from : ["WithEvents"],
	ctor : function(stage,name,x,y,w,h) {
		var self = this;
		var i = this.internal["3Devils.Viewport"].data = {};
		i.stage = stage;
		i.clearColor = [0.0,0.0,1.0,1.0];
		i.layers = [];
		
		i.mouse = {};
		i.mouseIn = false;
		
		Object.defineProperty(this,"stage",{ get : function() { return i.stage; }});
		i.name = name;
		i.x = x;
		i.y = y;
		i.w = w;
		i.h = h;
		
		Object.defineProperty(this,"name",{ get : function() { return i.name; }, set : function(val) { i.name = val; } });
		Object.defineProperty(this,"x",{ get : function() { return i.x; }, set : function(val) { i.x = val; } });
		Object.defineProperty(this,"y",{ get : function() { return i.y; }, set : function(val) { i.y = val; } });
		Object.defineProperty(this,"width",{ get : function() { return i.w; }, set : function(val) { i.w = val; } });
		Object.defineProperty(this,"height",{ get : function() { return i.h }, set : function(val) { i.h = val; } });
		console.log("VIEWPORT INIT",name);
		
		i.stage.on("mousemove_stage",function(mouse) {
			// check if is in this viewport
			//console.log("mousemove_viewport",self.name,JSON.stringify(mouse));
			if( 
				((mouse.left+1)/2 > (self.x/i.stage.width)) &&
				((mouse.left+1)/2 < ((self.x+self.width)/i.stage.width)) &&
				((mouse.top+1)/2 > (self.y/i.stage.height)) &&
				((mouse.top+1)/2 < ((self.y+self.height)/i.stage.height))
			) {
				i.mouse.left = 2*( ( (mouse.left+1)/2 - (self.x/i.stage.width) )/(self.width/i.stage.width) ) - 1;
				i.mouse.top = 1 - 2*( ( (mouse.top+1)/2 - (self.y/i.stage.height) )/(self.height/i.stage.height) );
				i.mouse.button = mouse.button;
				i.mouseIn = true;
				console.log("mousemove_viewport",self.name,i.mouse);
				self.emit("mousemove_viewport",[i.mouse]);
			} else {
				i.mouseIn = false;
			}
			return true;
		});
		
		i.stage.on("mousedown_stage",function(mouse) {
			// check if is in this viewport
			if( 
				((mouse.left+1)/2 > (self.x/i.stage.width)) &&
				((mouse.left+1)/2 < ((self.x+self.width)/i.stage.width)) &&
				((mouse.top+1)/2 > (self.y/i.stage.height)) &&
				((mouse.top+1)/2 < ((self.y+self.height)/i.stage.height))
			) {
				i.mouse.left = 2*( ( (mouse.left+1)/2 - (self.x/i.stage.width) )/(self.width/i.stage.width) ) - 1;
				i.mouse.top = 1 - 2*( ( (mouse.top+1)/2 - (self.y/i.stage.height) )/(self.height/i.stage.height) );
				i.mouse.button = mouse.button;
				i.mouseIn = true;
				console.log("mousemove_viewport",self.name,i.mouse);
				self.emit("mousemove_viewport",[i.mouse]);
			} else {
				i.mouseIn = false;
			}
			return true;
		});
		
		i.stage.on("mouseup_stage",function(mouse) {
			// check if is in this viewport
			if( 
				((mouse.left+1)/2 > (self.x/i.stage.width)) &&
				((mouse.left+1)/2 < ((self.x+self.width)/i.stage.width)) &&
				((mouse.top+1)/2 > (self.y/i.stage.height)) &&
				((mouse.top+1)/2 < ((self.y+self.height)/i.stage.height))
			) {
				i.mouse.left = 2*( ( (mouse.left+1)/2 - (self.x/i.stage.width) )/(self.width/i.stage.width) ) - 1;
				i.mouse.top = 1 - 2*( ( (mouse.top+1)/2 - (self.y/i.stage.height) )/(self.height/i.stage.height) );
				i.mouse.button = mouse.button;
				i.mouseIn = true;
				console.log("mousemove_viewport",self.name,i.mouse);
				self.emit("mousemove_viewport",[i.mouse]);
			} else {
				i.mouseIn = false;
			}
			return true;
		});
		
		
	}, 
	proto :{
		Draw : function(gl) {
			var i = this.internal["3Devils.Viewport"].data;
			
			
			// request the values that are defined to this framebufffer
			// fw.Request(this, { type : "framebuffer", value : {} } );
			
			
			
			// this is used to select where (-1,1) range goes after buffer flush on draw.
			// so we can create rectangle splits of drawings
			// example: splitting in perspective, left, top, ortho camera
			// in html we may share with other canvas , its not a game
			
			// after you select the view port, that render flush begun.
			//console.log([this.x,this.y,this.width,this.height]);
			gl.viewport(this.x,this.y,this.width,this.height);
			
			// viewport must be defined before clear anything
			//console.log(i.clearColor);
			/*
			gl.clearColor(
				i.clearColor[0], // r
				i.clearColor[1], // g
				i.clearColor[2], // b
				i.clearColor[3]  // a
			);
			gl.clear( gl.COLOR_BUFFER_BIT );
			*/
			
			for(var x = 0; x < i.layers.length;x++) {
				i.layers[x].Draw(gl);
			}
		},
		NewLayer : function() {
			var i = this.internal["3Devils.Viewport"].data;
			var layer = Class.create("3Devils.Layer",{ "3Devils.Layer" : [this] });
			i.layers.push(layer);
			return layer;
		},
		Save : function(viewport_context) {
			var i = this.internal["3Devils.Viewport"].data;
			viewport_context.name = this.name;
			var self = this;
			viewport_context.bounds = [self.x,self.y,self.width,self.height];
			
			
			viewport_context.layers = [];
			for(var x = 0; x < i.layers.length;x++) {
				var layer = {};
				i.layers[x].Save(layer);
				viewport_context.layers.push(layer);
			}
			
		},
		Load : function(viewport_context) {
			var i = this.internal["3Devils.Viewport"].data;
			
			/*
			i.name = viewport_context.name;
			this.x = viewport_context.bounds[0];
			this.y = viewport_context.bounds[0];
			this.width = viewport_context.bounds[0];
			this.height = viewport_context.bounds[0];
			*/
			

			var len0 = i.layers.length;
			for(var x = 0; x < len0;x++) i.layers.pop();
			
			for(var x = 0; x < viewport_context.layers.length;x++) {
				var _layer = this.NewLayer();
				_layer.Load( viewport_context.layers[x] );
			}
			
		}
	}
});


Class.define("3Devils.Layer",{
	from : ["WithEvents"],
	ctor : function(parent) {
		var i = this.internal["3Devils.Layer"].data = {};
		i.viewport = parent;
		Object.defineProperty(this,"viewport",{ get : function() { return i.viewport; }});
		i.name = "";
		i.keyframes = [];
		i.layers = [];
	},
	proto : {
		Draw : function(gl) {
			
			// request the values that are used in frame recording
			// fw.Request(this, { type : "movie", value : {} } );
			
			
			var i = this.internal["3Devils.Layer"].data;
			for(var x = 0; x < i.layers.length;x++) {
				i.layers[x].Draw(gl);
			}
			
			for(var x = 0; x < i.keyframes.length;x++) {
				i.keyframes[x].Draw(gl);
			}
		},
		
		
		//
		// get keyframes at (relative time)
		//
		
		NewKeyFrame : function() {
			var i = this.internal["3Devils.Layer"].data;
			var keyframe = Class.create("3Devils.KeyFrame",{ "3Devils.KeyFrame" : [this] })
			i.keyframes.push(keyframe);
			return keyframe;
		},
		NewLayer : function() {
			var i = this.internal["3Devils.Layer"].data;
			var layer = Class.create("3Devils.Layer",{ "3Devils.Layer" : [this.viewport] });
			i.layers.push( layer );
			return layer;
		},
		Load : function(layer_context) {
			var i = this.internal["3Devils.Layer"].data;
			
			var len0 = i.layers.length;
			var len1 = i.keyframes.length;
			for(var x = 0; x < len0;x++) i.layers.pop();
			for(var x = 0; x < len1;x++) i.keyframes.pop();
			
			for(var x = 0; x < layer_context.layers.length;x++) {
				var layer = this.NewLayer();
				layer.Load( layer_context.layers[x] );
			}
			for(var x = 0; x < layer_context.keyframes.length;x++) {
				var keyframe = this.NewKeyFrame();
				keyframe.Load( layer_context.keyframes[x] );
			}
		},
		Save : function(layer_context) {
			
			var i = this.internal["3Devils.Layer"].data;
			layer_context.layers = [];
			layer_context.keyframes = [];
			
			for(var x = 0; x < i.layers.length;x++) {
				var layer = {};
				i.layers[x].Save(layer);
				layer_context.layers.push(layer);
			}
			for(var x = 0; x < i.keyframes.length;x++) {
				var keyframe = {};
				i.keyframes[x].Save(keyframe);
				layer_context.keyframes.push( keyframe );
			}
			
		}
	}
});

Class.define("3Devils.KeyFrame",{
	from : ["WithEvents"],
	ctor : function(parent) {
		var i = this.internal["3Devils.KeyFrame"].data = {};
		i.duration = 0;
		i.scenes = {};
		i.cameras = {};
		
		i.actionsAtBegin = [];
		i.actionsAtEnd = []; // for example remove ConceptInstance from keyframe, stop playing sound
		
		i.selected_camera = "";
		i.layer = parent;
		i.mouse = {};
		
		Object.defineProperty(this,"layer",{ get : function() { return i.layer; }});
		Object.defineProperty(this,"duration",{
			get :function() { return i.duration; }
		});
		
		
		i.layer.viewport.on("mousemove_viewport",function(mouse) {
			// convert to camera space
			
			
			
			this.emit("mouseup_keyframe",[i.mouse]);
		});
		i.layer.viewport.on("mousedown_viewport",function(mouse) {
			// convert to camera space
			this.emit("mouseup_keyframe",[i.mouse]);
		});
		i.layer.viewport.on("mouseup_viewport",function(mouse) {
			// convert to camera space
			
			this.emit("mouseup_keyframe",[i.mouse]);
		});
		
	},
	proto : {
		Draw : function(gl) {
			var i = this.internal["3Devils.KeyFrame"].data;
			
			
			// request the values that are used in this program
			// fw.Request(this, { type : "program", value : {} } );
			
			
			// define current projection here and camera position here
			
			for(var name in i.scenes) {
				i.scenes[name].Draw(gl);
			}
		},
		AddSound : function(start,resource_name) {
			start = start || 0.0;
			return this;
		},
		AddScript : function(name,callback) {
			
		},
		TurnScript : function(name,enable) {
			
		},
		SetCamera : function(name) {
			var i = this.internal["3Devils.KeyFrame"].data;
			if(name in i.cameras) {
				i.selected_camera = name;
			}
		},
		NewCamera : function(name,type) {
			name = name || "default_camera";
			type = type || "perspective";
			var i = this.internal["3Devils.KeyFrame"].data;
			var camera = Class.create("3Devils.Camera",{ "3Devils.Camera" : [this,name,type] });
			i.cameras[name] = camera;
			if(i.selected_camera == "") {
				i.selected_camera = name;
			}
			return camera;
		},
		NewCameraFrom : function(camera) {
			
		},
		GetCurrentCamera : function() {
			var i = this.internal["3Devils.KeyFrame"].data;
			return this.GetCamera(i.selected_camera);
		},
		GetCamera : function(name) {
			var i = this.internal["3Devils.KeyFrame"].data;
			if(name in i.cameras) {
				return i.cameras[name];
			}
			return null;
		},
		NewScene : function(name) {
			var i = this.internal["3Devils.KeyFrame"].data;
			var scene = Class.create("3Devils.Scene",{ "3Devils.Scene" : [this,name] });
			i.scenes[name] = scene;
			return scene;
		},
		Load : function(keyframe_context) {
			var i = this.internal["3Devils.KeyFrame"].data;
			
			i.duration = keyframe_context.duration;
			
			var s_keys = [];
			for(var key in i.scenes) {
				s_keys.push(key);
			}
			for(var x = 0; x < s_keys.length;x++) {
				delete i.scenes[s_keys[x]];
			}
			var c_keys = [];
			for(var x = 0; x < c_keys.length;x++) {
				delete i.cameras[c_keys[x]];
			}
			
			for(var key in keyframe_context.scenes)  {
				var scene = this.NewScene( keyframe_context.scenes[key].name );
				scene.Load( keyframe_context.scenes[key] );
				
			}
			for(var key in keyframe_context.cameras) {
				var camera = this.NewCamera( keyframe_context.cameras[key].name );
				camera.Load( keyframe_context.cameras[key] );
			}
			
		},
		Save : function(keyframe_context) {
			var i = this.internal["3Devils.KeyFrame"].data;
			keyframe_context.duration = i.duration;
			keyframe_context.scenes = {};
			for(var key in i.scenes) {
				var scene = {};
				i.scenes[key].Save(scene);
				keyframe_context.scenes[key] = scene;
			}
			keyframe_context.cameras = {};
			for(var key in i.cameras) {
				var camera = {};
				i.cameras[key].Save(camera);
				keyframe_context.cameras[key] = camera;
			}
			
		}
		
	}
});

Class.define("3Devils.Instance",{
	ctor : function() {
		
		var i = this.internal["3Devils.Instance"].data = {};
		
		var V3 = function(a,b,c) {
			a = a || 0;
			b = b || 0;
			c = c || 0;
			return Class.create("XMath.V3",{ "XMath.V3" : ["Float32Array",a,b,c] });
		};
		i.location = V3(0,0,0);
		i.rotation = [ V3(1,0,0), V3(0,1,0), V3(0,0,1) ];
		
		
		i.scale = V3(1,1,1);
		
		Object.defineProperty(this,"location", { get : function() { return i.location; } });
		Object.defineProperty(this,"rotation", { get : function() { return i.rotation; } });
		Object.defineProperty(this,"scale", { get : function() { return i.scale; } });
		
		Object.defineProperty(this,"up", { get : function() { return i.rotation[1]; } });
		Object.defineProperty(this,"front", { get : function() { return i.rotation[2]; } });
		Object.defineProperty(this,"right", { get : function() { return i.rotation[0]; } });
		
	},
	proto : {
		LoadInstance : function(instance) {
			
			var V3 = function(a,b,c) {
				a = a || 0;
				b = b || 0;
				c = c || 0;
				return Class.create("XMath.V3",{ "XMath.V3" : ["Float32Array",a,b,c] });
			};
			var M4 = function() {
				return Class.create("XMath.M4",{ "XMath.M4" : ["Float32Array"] });
			};
		
			this.location.x = instance.location[0];
			this.location.y = instance.location[1];
			this.location.z = instance.location[2];
			
			this.scale.x = instance.scale[0];
			this.scale.y = instance.scale[1];
			this.scale.z = instance.scale[2];
			
			
			// x axis
			this.rotation[0].x = instance.rotation[0][0];
			this.rotation[0].y = instance.rotation[0][1];
			this.rotation[0].z = instance.rotation[0][2];
			// y axis
			this.rotation[1].x = instance.rotation[1][0];
			this.rotation[1].y = instance.rotation[1][1];
			this.rotation[1].z = instance.rotation[1][2];
			// z axis
			
			var x = V3(this.rotation[0][0],this.rotation[0][1],this.rotation[0][2]);
			var y = V3(this.rotation[0][0],this.rotation[0][1],this.rotation[0][2]);
			var z = V3(0,0,0);
			x.cross(y,z);
			z.normalize();
			
			this.rotation[2].x = z.x;
			this.rotation[2].y = z.y;
			this.rotation[2].z = z.z;
			
			
		},
		RotateAbsX : function(angle) {
			var M4 = function() {
				return Class.create("XMath.M4",{ "XMath.M4" : ["Float32Array"] });
			};
			var i = this.internal["3Devils.Instance"].data;
			var m = M4();
			m.rotate( angle, [1,0,0] );
			i.rotation[0].vmul(m);
			i.rotation[1].vmul(m);
			i.rotation[2].vmul(m);
			return this;
			
		},
		
		RotateAbsY : function(angle) {
			var M4 = function() {
				return Class.create("XMath.M4",{ "XMath.M4" : ["Float32Array"] });
			};
			var i = this.internal["3Devils.Instance"].data;
			var m = M4();
			m.rotate( angle, [0,1,0] );
			i.rotation[0].vmul(m);
			i.rotation[1].vmul(m);
			i.rotation[2].vmul(m);
			return this;
		},
		RotateAbsZ : function(angle) {
			var M4 = function() {
				return Class.create("XMath.M4",{ "XMath.M4" : ["Float32Array"] });
			};
			var i = this.internal["3Devils.Instance"].data;
			var m = M4();
			m.rotate( angle, [0,0,1] );
			i.rotation[0].vmul(m);
			i.rotation[1].vmul(m);
			i.rotation[2].vmul(m);
			
			
			
			return this;
		},
		RotateRelX : function(angle) {
			var M4 = function() {
				return Class.create("XMath.M4",{ "XMath.M4" : ["Float32Array"] });
			};
			var i = this.internal["3Devils.Instance"].data;
			var m = M4();
			
			m.rotate( angle, [i.rotation[0].x,i.rotation[0].y,i.rotation[0].z] );
			console.log(180*angle/Math.PI,
				"Y:"+[i.rotation[1].x,i.rotation[1].y,i.rotation[1].z],m.toString());
			i.rotation[1].vmul(m);
			console.log(180*angle/Math.PI,"Z:"+[i.rotation[2].x,i.rotation[2].y,i.rotation[2].z],m.toString());
			i.rotation[2].vmul(m);
			
			
			i.rotation[1].normalize();
			i.rotation[2].normalize();
			
			console.log(
				"AFTER:",
				"X:"+[i.rotation[0].x,i.rotation[0].y,i.rotation[0].z],
				"Y:"+[i.rotation[1].x,i.rotation[1].y,i.rotation[1].z],
				"Z:"+[i.rotation[2].x,i.rotation[2].y,i.rotation[2].z]
			);
			
			return this;
		},
		RotateRelY : function(angle) {
			var M4 = function() {
				return Class.create("XMath.M4",{ "XMath.M4" : ["Float32Array"] });
			};
			var i = this.internal["3Devils.Instance"].data;
			var m = M4();
			m.rotate( angle, [i.rotation[1].x,i.rotation[1].y,i.rotation[1].z] );
			i.rotation[0].vmul(m);
			i.rotation[2].vmul(m);
			
			i.rotation[0].normalize();
			i.rotation[2].normalize();
			
			return this;
		},
		RotateRelZ : function(angle) {
			var V3 = function(a,b,c) {
				a = a || 0;
				b = b || 0;
				c = c || 0;
				return Class.create("XMath.V3",{ "XMath.V3" : ["Float32Array",a,b,c] });
			};
			var M4 = function() {
				return Class.create("XMath.M4",{ "XMath.M4" : ["Float32Array"] });
			};
			var i = this.internal["3Devils.Instance"].data;
			var x = V3(i.rotation[0][0],i.rotation[0][1],i.rotation[0][2]);
			var y = V3(i.rotation[0][0],i.rotation[0][1],i.rotation[0][2]);
			var z = V3(0,0,0);
			x.cross(y,z);
			z.normalize();
			var m = M4();
			m.rotate( angle, [z.x,z.y,z.z] );
			i.rotation[0].vmul(m);
			i.rotation[1].vmul(m);
			
			i.rotation[0].normalize();
			i.rotation[1].normalize();
			
			return this;
		},
		GetAxis : function() {
			var V3 = function(a,b,c) {
				a = a || 0;
				b = b || 0;
				c = c || 0;
				return Class.create("XMath.V3",{ "XMath.V3" : ["Float32Array",a,b,c] });
			};
			var i = this.internal["3Devils.Instance"].data;
			var x = V3(i.rotation[0][0],i.rotation[0][1],i.rotation[0][2]);
			var y = V3(i.rotation[0][0],i.rotation[0][1],i.rotation[0][2]);
			var z = V3(0,0,0);
			x.cross(y,z);
			z.normalize();
			return [x,y,z];
		},
		SaveInstance : function(instance) {
			instance.location = [ this.location.x, this.location.y, this.location.z ];
			instance.scale = [ this.scale.x, this.scale.y, this.scale.z ];
			instance.rotation = [
				[this.rotation[0].x, this.rotation[0].y, this.rotation[0].z],
				[this.rotation[1].x, this.rotation[1].y, this.rotation[1].z]
			];
			
		}
	}
});



Class.define("3Devils.Camera",{
	from : ["WithEvents","3Devils.Instance"],
	ctor : function(parent,name,type) {
		var self = this;
		
		/*
		// fov reach h-pixels
		
		//42.998.169.600 possible virtualizations
		
		// (1/2048)x(1/2048)
		// (1/1920)x(1/1920)
		// (1/1024)x(1/1024)
		// (1/1000)x(1/1000)
		// (1/900)x(1/900)
		// (1/800)x(1/800)
		// (1/700)x(1/700)
		// (1/600)x(1/600)
		// (1/512)x(1/512)
		// (1/500)x(1/500)
		// (1/400)x(1/400)
		// (1/256)x(1/256)
		// (1/200)x(1/200)
		// (1/128)x(1/128)
		// (1/100)x(1/100)
		// (1/64)x(1/64)
		// (1/32)x(1/32)
		// (1/16)x(1/16)
		// (1/10)x(1/10)
		// (1/8)x(1/8)
		// (1/5)x(1/5)
		// (1/4)x(1/4)
		// (1/2)x(1/2) ?
		// angles to cover sub units
		// 12.19845151901245 1x1 (STABLE)
		// 24.12651538848879 2x1 (STABLE)
		// 35.54817771911621  3x1 (STABLE)
		
		
		// 81.050457000 4x1
		// 93.796237945 5x1
		// 104.100757598 6x1
		// 112.477657318 7x1
		// 119.353008270 8x1
		// 125.058948516 9x1
		// 129.848075866 10x1
		// 133.911781311 11x1
		// 137.394874572 12x1
		// 140.408332824 13x1
		// 143.037651062 14x1
		// 145.349586486 15x1
		// 147.396720886 16x1
		// 149.221000671  17x1
		// 150.856163024 18x1
		// 152.329612731 19x1
		// 153.663764953 20x1
		// 154.877128601 21x1
		// 155.985145568 22x1
		// 157.000862121 23x1 
		// 157.935142517 24x1
		// 157.950584411 24x1
		// 158.812232971 25x1
		// 159.609748840 26x1
		// 160.349983215 27x1
		// 161.038734436 28x1
		// 161.668342590 29x1
		// 162.269584655 30x1
		// 162.844993591 31x1
		// 163.373451232 32x1
		// 163.870582580 33x1
		// 164.339012146 34x1 (probably standard precision)
		// 164.781166076 35x1
		// 165.199119567 36x1
		// 165.594886779 37x1
		// 165.970176696 38x1
		// 166.326423645 39x1
		// 166.665153503 40x1
		// 166.987617492 41x1
		// 167.294853210 42x1
		// 167.587959289 43x1
		// 167.867942810 44x1
		// 168.135597229 45x1
		// 168.391716003 46x1
		// 168.628959655 47x1
		// 168.864387512 48x1
		// 169.090263366 49x1
		// 169.307151794 50x1
		// 169.515632629 51x1
		// 169.716163635 52x4
		// 169.909202575 53x4
		// 170.095115661 54x4
		// 170.274330139 55x4
		// 170.447242736 56x4
		// 170.614051818 57x16
		// 170.775199890 58x16
		// 170.930839538 59x16
		// 171.081443786 60x16
		// 171.636772155 64x4
		// 172.127128601 68x16
		// 172.351402282 70x16
		// 172.563255310 72x16
		// 173.305152893 80x16
		// 81
		// 174.047615051 90x16
		// 174.180961608 92x1
		// 99
		// 144
		// 169
		// 174.641914367 100x16
		// 121x
		// 175.815818786 128x1
		// 177.207862854 192x4
		// 177.319480895 200x16
		// 225x
		// 177.907218933 256x1
		// 289
		// 178.212806701 300x16
		// 178.324531555 320x4
		// 324
		// 361
		// 178.603736877 384x4
		// 178.659553527 400x16
		// 441
		// 178.803153991  448x4
		// 178.882942199 480x16
		// 484
		// 178.927665710 500x16
		// 178.919792175 512x1
		// 529
		// 576
		// 179.106391906 600x16
		// 625
		// 179.162239074 640x16
		// 676
		// 179.234016418 700x16
		// 729
		// 179.301887512 768x16
		// 784
		// 179.329780578  800x1
		// 841
		// 179.404273986 900x16
		// 961
		// 179.417243957 920x16
		// 179.463844299 1000x16
		// 179.476402282 1024x1
		// 179.503578186 1080x16
		// 1089
		// 1156
		// 1225
		// 179.581169128 1280x16
		// 1296
		// 1369
		// 1444
		// 179.642066955 1500x16
		// 1521
		// 1600
		// 1681
		// 1764
		// 1849
		// 179.720161437 1920x16
		// 1936
		// 179.731117248 2000x16
		// 2025
		// 179.737419128 2048x16
		*/
	
		var i = this.internal["3Devils.Camera"].data = {};
		i.name = name;
		i.keyframe = parent;
		i.stage = i.keyframe.layer.viewport.stage;
		//this.rotation[2].z = -1;
		i.stage.on("keydown_stage",function(keys) {
			// if(KeyCode.Q in keys && keys[ KeyCode.Q ].value) alert("OK");
			function ik(k) {
				return k in keys && keys[k].value;
			}
			if( ik(KeyCode.UP) ) {
				self.location.x = self.location.x + self.front.x;
				self.location.y = self.location.y + self.front.y;
				self.location.z = self.location.z + self.front.z;
			} else if( ik(KeyCode.DOWN) ) {
				self.location.x = self.location.x - self.front.x;
				self.location.y = self.location.y - self.front.y;
				self.location.z = self.location.z - self.front.z;
			} else if( ik(KeyCode.LEFT) ) {
				self.location.x = self.location.x - self.right.x;
				self.location.y = self.location.y - self.right.y;
				self.location.z = self.location.z - self.right.z;
			} else if( ik(KeyCode.RIGHT) ) {
				self.location.x = self.location.x + self.right.x;
				self.location.y = self.location.y + self.right.y;
				self.location.z = self.location.z + self.right.z;
			} else if( ik(KeyCode.PAGEUP) ) {
				self.location.x = self.location.x + self.up.x;
				self.location.y = self.location.y + self.up.y;
				self.location.z = self.location.z + self.up.z;
			} else if( ik(KeyCode.PAGEDOWN) ) {
				self.location.x = self.location.x - self.up.x;
				self.location.y = self.location.y - self.up.y;
				self.location.z = self.location.z - self.up.z;
			} else if( ik(KeyCode.NUMPAD_0) ) {
				// reset camera
				
			} else if( ik(KeyCode.NUMPAD_1) ) {
				
			} else if( ik(KeyCode.NUMPAD_2) ) {
				self.RotateRelX( Math.PI/4 );
			} else if( ik(KeyCode.NUMPAD_3) ) {
				
			} else if( ik(KeyCode.NUMPAD_4) ) {
				self.RotateRelY( -Math.PI/4 );
			} else if( ik(KeyCode.NUMPAD_5) ) {
				
			} else if( ik(KeyCode.NUMPAD_6) ) {
				self.RotateRelY( Math.PI/4 );
			} else if( ik(KeyCode.NUMPAD_7) ) {
				
			} else if( ik(KeyCode.NUMPAD_8) ) {
				self.RotateRelX( -Math.PI/4 );
			} else if( ik(KeyCode.NUMPAD_9) ) {
				
			}
			i.stage.Draw();
			UI.Body.consoleLog("KEY");
			
			
			return true;
		});
		i.stage.on("keyup_stage",function(keys) {
			
			return true;
		});
		
		i.type = type || "perspective";
		Object.defineProperty(this,"type",{ get : function() { return i.type; }, 
			set : function(t) {
				if(t == "orthogonal" || t == "perspective" || t == "parallax" || t == "xflat" || t == "yflat" || t == "zflat" || t == "voxelmap") {
					i.type = t;
					this.Set({ type : i.type });
				} else {
					throw "unkown camera type.";
				}
			}	
		});
		
		if(i.type == "perspective") {
			this.Set({
				type : type,
				fov : 90.0,
				aspect : 640/400,
				near : 1.0,
				far : 100.0
			});
		} else if(i.type == "orthogonal") {
			this.Set({
				type : type,
				fov : 90.0,
				aspect : 640/400,
				near : 1.0,
				far : 100.0
			})
		}
	},
	proto : {
		Set : function(options) {
			var i = this.internal["3Devils.Camera"].data;
			i.config = {};
			if( ("type" in options && options.type == "orthogonal") || (i.type == "orthogonal" ) ) {
				if("fov" in options) {
					i.fov = options.fov;
					Object.defineProperty(this, "fieldOfViewDeg", {
						configurable: true,
						get : function() { return i.fov; },
						set : function(val) { 
							if( Object.prototype.toString.apply( val ) == "[object Number]" ) {
								i.fov = val;
							}
						}
					});
				}
				if("aspect" in options) {
					i.aspect = options.aspect;
					Object.defineProperty(this, "aspect", {
						configurable: true,
						get : function() { return i.aspect; },
						set : function(val) { 
							if( Object.prototype.toString.apply( val ) == "[object Number]" ) {
								i.aspect = val;
							}
						}
					});
				}
				if("near" in options) {
					i.near = options.near;
					Object.defineProperty(this, "near", {
						configurable: true,
						get : function() { return i.near; },
						set : function(val) { 
							if( Object.prototype.toString.apply( val ) == "[object Number]" ) {
								i.near = val;
							}
						}
					});
				}
				if("far" in options) {
					i.far = options.far;
					Object.defineProperty(this, "far", {
						configurable: true,
						get : function() { return i.far; },
						set : function(val) { 
							if( Object.prototype.toString.apply( val ) == "[object Number]" ) {
								i.far = val;
							}
						}
					});
				}
			} else if( ("type" in options && options.type == "perspective") || ( i.type == "perspective") ) {
				if("fov" in options) {
					i.fov = options.fov;
					Object.defineProperty(this, "fieldOfViewDeg", {
						configurable: true,
						get : function() { return i.fov; },
						set : function(val) { 
							if( Object.prototype.toString.apply( val ) == "[object Number]" ) {
								i.fov = val;
							}
						}
					});
				}
				if("aspect" in options) {
					i.aspect = options.aspect;
					Object.defineProperty(this, "aspect", {
						configurable: true,
						get : function() { return i.aspect; },
						set : function(val) { 
							if( Object.prototype.toString.apply( val ) == "[object Number]" ) {
								i.aspect = val;
							}
						}
					});
				}
				if("near" in options) {
					i.near = options.near;
					Object.defineProperty(this, "near", {
						configurable: true,
						get : function() { return i.near; },
						set : function(val) { 
							if( Object.prototype.toString.apply( val ) == "[object Number]" ) {
								i.near = val;
							}
						}
					});
				}
				if("far" in options) {
					i.far = options.far;
					Object.defineProperty(this, "far", {
						configurable: true,
						get : function() { return i.far; },
						set : function(val) { 
							if( Object.prototype.toString.apply( val ) == "[object Number]" ) {
								i.far = val;
							}
						}
					});
				}
				
			} else {
				throw "not implemented";
			}
		},
		Load : function(camera_context) {
			var i = this.internal["3Devils.Camera"].data;
			this.LoadInstance(camera_context);
			var map = {
				1 : "orthogonal",
				2 : "perspective",
				3 : "parallax",
				4 : "xflat",
				5 : "yflat",
				6 : "zflat",
				7 : "voxelmap"
			};
			i.type = map[ camera_context.type ];
		},
		Save : function(camera_context) {
			var i = this.internal["3Devils.Camera"].data
			this.SaveInstance(camera_context);
			var map = {
				"orthogonal" : 1,
				"perspective" : 2,
				"parallax" : 3,
				"xflat" : 4,
				"yflat" : 5,
				"zflat" : 6,
				"voxelmap" : 7
			};
			camera_context.type = map[ i.type ];
		}
	}
});

Class.define("3Devils.Scene",{
	from : ["WithEvents","3Devils.Instance"],
	ctor : function(parent,name) {
		
		var i = this.internal["3Devils.Scene"].data = {};
		i.name = name;
		i.skeletons = [];
		i.keyframe = parent;
		
		Object.defineProperty(this,"name",{ get : function() { return i.name; } });
		Object.defineProperty(this,"keyframe",{ get : function() { return i.keyframe; }});
		
	}, 
	proto : {
		Draw : function(gl) {
			var i = this.internal["3Devils.Scene"].data;
			// request the values that are used in this program
			// fw.Request(this, { type : "program", value : {} } );
			
			// define current scene position and rotation
			
			for(var x = 0; x < i.skeletons.length;x++) {
				i.skeletons[x].Draw(gl);
			}
		},
		NewSkeleton : function(name) {
			var i = this.internal["3Devils.Scene"].data;
			var skeleton = Class.create("3Devils.Skeleton",{ "3Devils.Skeleton" : ["scene",this,name] });
			i.skeletons.push(skeleton);
			return skeleton;
		},
		definePhysics : function(model) { // set once per scene
		
		},
		Load : function(scene_context) {
			var i = this.internal["3Devils.Scene"].data;
			
			this.LoadInstance(scene_context);
			i.name = scene_context.name;
			var len0 = i.skeletons.length;
			for( var x = 0; x < len0;x++) i.skeletons.pop();
			for(var x = 0; x < scene_context.skeletons.length;x++) {
				var skeleton = this.NewSkeleton( scene_context.skeletons[x].name );
				skeleton.Load( scene_context.skeletons[x] );
				
			}
			
		},
		Save : function(scene_context) {
			
			var i = this.internal["3Devils.Scene"].data;
			
			scene_context.name = i.name;
			this.SaveInstance(scene_context);
			
			scene_context.skeletons = [];
			for(var x = 0; x < i.skeletons.length;x++) {
				var skeleton = {};
				i.skeletons[x].Save(skeleton);
				scene_context.skeletons.push(skeleton);
			}
		}
	}
});

Class.define("3Devils.Skeleton",{ // 256x256 at any scale loaded from file
	from : ["WithEvents","3Devils.Instance"],
	ctor : function(owner_type,parent,name) {
		
		var i = this.internal["3Devils.Skeleton"].data = {};
		i.name = name;
		i.ownerType = owner_type;
		if(owner_type == "skeleton") {
			i.skeleton = parent;
		} else if(owner_type == "scene") {
			i.scene = parent;	
		} else {
			throw "not implemented";
		}
		
		i.skeletons = [];
		i.concepts = [];
		
		Object.defineProperty(this,"name",{ get : function() { return i.name; } });
		Object.defineProperty(this,"parent",{ get : function() { if( i.ownerType == "skeleton" ) return i.skeleton; return i.scene; } });
		Object.defineProperty(this,"parentType",{ get : function() { return i.ownerType; } });
		
	}, 
	proto : {
		Draw : function(gl) {
			
			// request the values that are used in this program
			// fw.Request(this, { type : "program", value : {} } );
			
			var i = this.internal["3Devils.Skeleton"].data;
			// define current skeleton position and rotation
			
			for(var x = 0; x < i.concepts.length;x++) {
				i.concepts[x].Draw(gl);
			}
			
			for(var x = 0; x < i.skeletons.length;x++) {
				i.skeletons[x].Draw(gl);
			}
			
		},
		NewConcept : function(clone) {
			var i = this.internal["3Devils.Skeleton"].data;
			clone = clone || null;
			var concept = Class.create("3Devils.Concept",{ "3Devils.Concept" : [this,clone] });
			i.concepts.push( concept );
			return concept;
		},
		NewSkeleton : function(name) {
			var i = this.internal["3Devils.Skeleton"].data;
			var skeleton = Class.create("3Devils.Skeleton",{ "3Devils.Skeleton" : ["skeleton",this,name] });
			i.skeletons.push(skeleton);
			return skeleton;
		},
		Save : function(skeleton_context) {
			var i = this.internal["3Devils.Skeleton"].data;
			
			
			skeleton_context.name = i.name;
			this.SaveInstance(skeleton_context);
			
			skeleton_context.skeletons = [];
			skeleton_context.concepts = [];
			for(var x = 0; x < i.skeletons.length;x++) {
				var skeleton = {};
				i.skeletons[x].Save(skeleton);
				skeleton_context.skeletons.push( skeleton );
			}
			for(var x = 0; x < i.concepts.length;x++) {
				var concept = {};
				i.concepts[x].Save(concept);
				skeleton_context.concepts.push(concept);
			}
			
		},
		Load : function(skeleton_context) {
			var i = this.internal["3Devils.Skeleton"].data;
			
			i.name = skeleton_context.name;
			this.LoadInstance(skeleton_context);
			
			var len0 = i.skeletons.length;
			for(var x =0; x < len0;x++) i.skeletons.pop();
			var len1 = i.concepts.length;
			for(var x = 0; x < len1;x++) i.concepts.pop();
			
			for(var x = 0; x < skeleton_context.skeletons.length;x++) {
				var skeleton = this.NewSkeleton( skeleton_context.skeletons[x].name);
				skeleton.Load( skeleton_context.skeletons[x] );
			}
			
			for(var x = 0; x < skeleton_context.concepts.length;x++) {
				var concept = this.NewConcept( skeleton_context.concepts[x].name );
				concept.Load( skeleton_context.concepts[x] );
			}
			
			
			
		}
	}
});


Class.define("3Devils.Concept",{
	from : ["WithEvents","3Devils.Instance"],
	ctor : function(parent,clone) {
		
		// must check if is in the same stage or must create... another program???
		
		
		
		var i = this.internal["3Devils.Concept"].data = {};
		i.skeleton = parent;
		Object.defineProperty(this,"skeleton",{ get : function() { return i.skeleton; } });
		
		i.drawing = {};
		i.material = {};
		
		var p = i.skeleton;
		while( p.parentType == "skeleton")
			p = p.parent;
		if( p.parentType != "scene") {
			throw "must check";
		}
		
		i.scene = p.parent;
		i.keyframe = i.scene.keyframe;
		i.stage = i.keyframe.layer.viewport.stage;
		i.framework = i.stage.framework;
		
		if(clone!=null) {
			var j = clone.internal["3Devils.Concept"].data;
			i.drawing.source = j.drawing.source;
			i.drawing.location = j.drawing.location;
			i.drawing.location_points = j.drawing.location_points;
			i.drawing.location_buffer = null;
			i.drawing.index = j.drawing.index;
			i.drawing.index_points = j.drawing.index_points;
			i.drawing.index_buffer = null;
			i.drawing.ready = false;
			
			i.material.source = j.material.source;
			
			i.instances = [];
			i.program = null;
			
			
		} else {
			
			i.drawing.source = "";
			i.drawing.location = null;
			i.drawing.location_points = 0;
			i.drawing.location_buffer = null;
			i.drawing.index = null;
			i.drawing.index_points = 0;
			i.drawing.index_buffer = null;
			i.drawing.ready = false;
			
			i.material.source = "";
			
			i.instances = [];
			
			i.program = null;
			
			
			
			
			
			
			
			// checks to be done
			
			
			i.requests = [];
			i.uniforms = {};
			
			i.checks = {};
			var _checks = [
				  false /* 0: built */
				, false /* 1: released */
				, false /* 2: hasProgram */
				, false /* 3: mustBindPoints */
				, false /* 4: mustTransferPoints */
				, false /* 5: mustBindIndex */
				, false /* 6: mustTransferIndex */
				, false /* 7: uniforms */
				, false /* 8: afterTranslation */
				, false /* 9: afterRotation */
			];
			this.on("reset",function() {
				for(var x = 0; x < _checks.length;x++) _checks[x] = 0;
			});
			Object.defineProperty(i.checks,"built", {  get : function() { return _checks[0]; }  });
			Object.defineProperty(i.checks,"hasProgram", {  get : function() { return _checks[2]; }  });
			Object.defineProperty(i.checks,"mustBindPoints", {  get : function() { return _checks[3]; }  });
			Object.defineProperty(i.checks,"mustTransferPoints", {  get : function() { return _checks[4]; }  });
			Object.defineProperty(i.checks,"mustBindIndex", {  get : function() { return _checks[5]; }  });
			Object.defineProperty(i.checks,"mustTransferIndex", {  get : function() { return _checks[6]; }  });
			Object.defineProperty(i.checks,"uniformsSent", { get : function() { return i.uniforms; } });
			
			localStorage.setItem("debug.afterTranslation", JSON.stringify( { "debug.afterTranslation" :  false } ) );
			localStorage.setItem("debug.afterRotation", JSON.stringify( { "debug.afterRotation" :  false } ) );
			Object.defineProperty(i.checks,"afterTranslation", { get : function() { return JSON.parse( localStorage.getItem("debug.afterTranslation") ); } });
			Object.defineProperty(i.checks,"afterRotation", { get : function() { return i.uniforms; } });
			
			Object.defineProperty(i.checks,"released", { get : function() { return _checks[1]; } });
			
			
			Object.defineProperty(this,"checks",{ get : function() { return i.checks; } });
		
		
		
		
		}
		
	},
	proto : {
		Reset : function() {
			emit("reset");
			
		},
		Draw : function(gl) {
			console.log("AT DRAW");
			var self = this;
			
			var i = this.internal["3Devils.Concept"].data;
			
			var fw = i.framework;
			var st = i.stage;
			var prog = null;
			
			// check if geometry is in cache
			if(i.drawing.location_buffer == null) i.drawing.location_buffer = gl.createBuffer();
			if(i.drawing.index_buffer == null) i.drawing.index_buffer = gl.createBuffer();
			if(i.drawing.wireframe_buffer == null) i.drawing.wireframe_buffer = gl.createBuffer();
			
			if(true) { // need to refresh data?
				gl.bindBuffer(gl.ARRAY_BUFFER, i.drawing.location_buffer);
				gl.bufferData(gl.ARRAY_BUFFER, i.drawing.location, gl.STATIC_DRAW);
			
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, i.drawing.index_buffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, i.drawing.index, gl.STATIC_DRAW);
			}
			if(i.material.wireframe) {
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, i.drawing.wireframe_buffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, i.drawing.wireframe, gl.STATIC_DRAW);
			}
			
			var iof = fw.vertexCache.indexOf( i.drawing.source );
			if( iof == -1) {
				fw.vertexCache.push(i.drawing.source);
				i.drawing.vertexSelected = fw.vertexCache.length-1;
			} else {
				i.drawing.vertexSelected = iof;
			}
			
			iof = fw.fragmentCache.indexOf(i.material.source);
			if( iof == -1) {
				fw.fragmentCache.push(i.material.source);
				i.material.fragmentSelected = fw.fragmentCache.length-1;
			} else {
				i.material.fragmentSelected = iof;
			}
			
			
			var program_name = i.drawing.vertexSelected + "_" + i.material.fragmentSelected;
			if( !((program_name) in st.programCache) ) { // saving program on cache
				// parse program and get attributes, uniforms, varying to save a map to use further
				//console.log("AT DRAW COMPILING");
				
				var _0 = "createShader", _1 = "shaderSource", _2 = "compileShader", _3 = "getShaderParameter";
				var fs = gl[_0](gl.FRAGMENT_SHADER);
				gl[_1](fs,i.material.source); gl[_2](fs);
				if (!gl[_3](fs, gl.COMPILE_STATUS)) {
					console.log("FS ########################################");
					console.log( gl.getShaderInfoLog(fs) );
					return null;
				}
				var vs = gl[_0](gl.VERTEX_SHADER);
				gl[_1](vs, i.drawing.source); gl[_2](vs);
				if (!gl[_3](vs, gl.COMPILE_STATUS)) {
					console.log("VS ########################################");
					console.log( gl.getShaderInfoLog(vs) );
					return null;
				}
				i.program = gl.createProgram();
				gl.attachShader(i.program, vs);
				gl.attachShader(i.program, fs);
				gl.linkProgram(i.program);
				if (!gl.getProgramParameter(i.program, gl.LINK_STATUS)) {
					alert("Could not initialise shaders");
				}
				// cache program
				st.programCache[ program_name ] = i.program;
				prog = i.program;
				
			} else {
				i.program = st.programCache[ program_name ];
				prog = st.programCache[ program_name ];
			}
			
			// program selection
			gl.useProgram(prog);
			
			//console.log("OK PROGRAM LOAD");
			
			// updating data
			var map = {
				attrib : {},
				uniform : {}
			};
			map.attrib.location = gl.getAttribLocation(prog, "location");
			gl.enableVertexAttribArray( map.attrib.location );
			
			
			map.uniform.instance_by = gl.getUniformLocation(prog, "instance_by");
			map.uniform.instance_tox = gl.getUniformLocation(prog, "instance_tox");
			map.uniform.instance_toy = gl.getUniformLocation(prog, "instance_toy");
			map.uniform.instance_at = gl.getUniformLocation(prog, "instance_at");
			
			map.uniform.concept_by = gl.getUniformLocation(prog, "concept_by");
			map.uniform.concept_tox = gl.getUniformLocation(prog, "concept_tox");
			map.uniform.concept_toy = gl.getUniformLocation(prog, "concept_toy");
			map.uniform.concept_at = gl.getUniformLocation(prog, "concept_at");
			
			map.uniform.skeleton_by = gl.getUniformLocation(prog, "skeleton_by");
			map.uniform.skeleton_tox = gl.getUniformLocation(prog, "skeleton_tox");
			map.uniform.skeleton_toy = gl.getUniformLocation(prog, "skeleton_toy");
			map.uniform.skeleton_at = gl.getUniformLocation(prog, "skeleton_at");
			
			map.uniform.scene_by = gl.getUniformLocation(prog, "scene_by");
			map.uniform.scene_tox = gl.getUniformLocation(prog, "scene_tox");
			map.uniform.scene_toy = gl.getUniformLocation(prog, "scene_toy");
			map.uniform.scene_at = gl.getUniformLocation(prog, "scene_at");
			
			map.uniform.camera_by = gl.getUniformLocation(prog, "camera_by");
			map.uniform.camera_tox = gl.getUniformLocation(prog, "camera_tox");
			map.uniform.camera_toy = gl.getUniformLocation(prog, "camera_toy");
			map.uniform.camera_at = gl.getUniformLocation(prog, "camera_at");
			
			
			
			// aspect 1.0 angles
			// 2 x 2 : 52.6
			// 3 x 3 : 73.3 ???
			// 4 x 4 : 
			// 5 x 5 :
			// 6 x 6 :
			// 7 x 7 :
			// 8 x 8 :
			// 9 x 9 :
			// 10 x 10 :
			// aspect 2.0 angles (vertical)
			// 2 x 4 :
			// aspect 0.5 angles (horizontal)
			// 4 x 2 :
			// aspect full hd ratio -> 1920x1080 (16:9), apect: 0.5625
			// 1.77777d x 1 :
			// 16 x 9 :
			
			// set camera
			
			var camera = i.keyframe.GetCurrentCamera();
			if(camera.type == "perspective" || camera.type == "orthogonal" ) {
				
				map.uniform.aspect = gl.getUniformLocation(prog, "aspect");
				map.uniform.fov = gl.getUniformLocation(prog, "fov");
				map.uniform.near = gl.getUniformLocation(prog, "near");
				map.uniform.far = gl.getUniformLocation(prog, "far");
				
				gl.uniform1fv(map.uniform.aspect,new Float32Array([camera.aspect]));
				gl.uniform1fv(map.uniform.fov,new Float32Array([camera.fieldOfViewDeg]));
				gl.uniform1fv(map.uniform.near,new Float32Array([camera.near]));
				gl.uniform1fv(map.uniform.far,new Float32Array([camera.far]));
				
				gl.uniform3fv(map.uniform.camera_by,new Float32Array([ camera.scale.x, camera.scale.y, camera.scale.z ]));
				gl.uniform3fv(map.uniform.camera_tox,new Float32Array([ camera.rotation[2].x, camera.rotation[2].y, camera.rotation[2].z ]));
				gl.uniform3fv(map.uniform.camera_toy,new Float32Array([ camera.rotation[1].x, camera.rotation[1].y, camera.rotation[1].z ]));
				gl.uniform3fv(map.uniform.camera_at,new Float32Array([ camera.location.x, camera.location.y, camera.location.z ]));
				console.log("LOCATION:" + [ camera.location.x, camera.location.y, camera.location.z ], "FRONT:" + [ camera.rotation[2].x, camera.rotation[2].y, camera.rotation[2].z ], 
					"UP:" + [ camera.rotation[1].x, camera.rotation[1].y, camera.rotation[1].z ] );
				// check if type change
				
			} else {
				
				// show [debug info] camera not selected
			}
			
			
			
			
			
			gl.uniform3fv(map.uniform.concept_by,new Float32Array([ self.scale.x, self.scale.y, self.scale.z ]));
			gl.uniform3fv(map.uniform.concept_tox,new Float32Array([ self.rotation[0].x, self.rotation[0].y, self.rotation[0].z ]));
			gl.uniform3fv(map.uniform.concept_toy,new Float32Array([ self.rotation[1].x, self.rotation[1].y, self.rotation[1].z ]));
			gl.uniform3fv(map.uniform.concept_at,new Float32Array([ self.location.x, self.location.y, self.location.z ]));
			
			gl.uniform3fv(map.uniform.skeleton_by,new Float32Array([ self.skeleton.scale.x, self.skeleton.scale.y, self.skeleton.scale.z ]));
			gl.uniform3fv(map.uniform.skeleton_tox,new Float32Array([ self.skeleton.rotation[0].x, self.skeleton.rotation[0].y, self.skeleton.rotation[0].z ]));
			gl.uniform3fv(map.uniform.skeleton_toy,new Float32Array([ self.skeleton.rotation[1].x, self.skeleton.rotation[1].y, self.skeleton.rotation[1].z ]));
			gl.uniform3fv(map.uniform.skeleton_at,new Float32Array([ self.skeleton.location.x, self.skeleton.location.y, self.skeleton.location.z ]));
			
			gl.uniform3fv(map.uniform.scene_by,new Float32Array([ i.scene.scale.x, i.scene.scale.y, i.scene.scale.z ]));
			gl.uniform3fv(map.uniform.scene_tox,new Float32Array([ i.scene.rotation[0].x, i.scene.rotation[0].y, i.scene.rotation[0].z ]));
			gl.uniform3fv(map.uniform.scene_toy,new Float32Array([ i.scene.rotation[1].x, i.scene.rotation[1].y, i.scene.rotation[1].z ]));
			gl.uniform3fv(map.uniform.scene_at,new Float32Array([ i.scene.location.x, i.scene.location.y, i.scene.location.z ]));
			
			
			
				
				
			// multiples pushs with different uniforms?
			for(var x = 0; x < i.instances.length;x++) { // may fork, between object definition and object instance classes (think about it)
				//console.log("INSTANCE",i.instances[x].location.x,i.instances[x].location.y,i.instances[x].location.z);
			
				// uniform set for each instance
				gl.uniform3fv(map.uniform.instance_by,new Float32Array([ i.instances[x].scale.x,i.instances[x].scale.y,i.instances[x].scale.z ]));
				gl.uniform3fv(map.uniform.instance_tox,new Float32Array([ i.instances[x].rotation[0].x,i.instances[x].rotation[0].y,i.instances[x].rotation[0].z ]));
				gl.uniform3fv(map.uniform.instance_toy,new Float32Array([ i.instances[x].rotation[1].x,i.instances[x].rotation[1].y,i.instances[x].rotation[1].z ]));
				gl.uniform3fv(map.uniform.instance_at,new Float32Array([ i.instances[x].location.x,i.instances[x].location.y,i.instances[x].location.z ]));
				
				
				// flush buffers
				
				gl.bindBuffer(gl.ARRAY_BUFFER, i.drawing.location_buffer);
				gl.vertexAttribPointer(map.attrib.location, 3 , gl.FLOAT, false, 0, 0); // 3 -> vec3
				
				
				if(i.material.wireframe) {
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, i.drawing.wireframe_buffer);
					gl.drawElements(gl.LINES, i.drawing.wireframe_lines, gl.UNSIGNED_SHORT, 0);
				} else {
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, i.drawing.index_buffer);
					gl.drawElements(gl.TRIANGLES, i.drawing.index_points, gl.UNSIGNED_SHORT, 0);
				}
				
			
			}
			
			//console.log("SHOULD HAVE FLUSHED BY NOW");
			
		},
		drawing : function(opts) {
			console.log("DRAWING");
			var i = this.internal["3Devils.Concept"].data;
			// may compile parents other options
			
			if("geometryName" in opts) {
				i.drawing.source = opts.source; // vertex source
				console.log(i.drawing.source);
				
				/*
				
				
				//
				// [x x]
				// [xxx]6
				//
				
				var concept1 = skeleton1.NewConcept(); // may clone other concept here
				concept1.drawing({
					source: localStorage.getItem("flat.vs.glsl"),
					location_points : 3,
					location : new Float32Array([
						-1.0,  1.0, 0.0,
						 1.0,  1.0, 0.0,
						-1.0, -1.0, 0.0,
						 0.0, -1.0, 0.0,
						 1.0, -1.0, 0.0
					]),
					index_points : 6,
					index : new Uint16Array([
						0, 2, 3,
						1, 3, 4
					])
				});
				
				//
				// [x x]
				// [xxx]
				//
				var concept1 = skeleton1.NewConcept(); // may clone other concept here
				concept1.drawing({
					source: localStorage.getItem("flat.vs.glsl"),
					location_points : 3,
					location : new Float32Array([
						-1.0,  1.0, 0.0,
						 1.0,  1.0, 0.0,
						-1.0, -1.0, 0.0,
						 0.0, -1.0, 0.0,
						 1.0, -1.0, 0.0
					]),
					index_points : 6,
					index : new Uint16Array([
						0, 2, 3,
						1, 3, 4
					])
				});
	
				// [xx]
				// [ x]
				// [xx]
				var concept1 = skeleton1.NewConcept(); // may clone other concept here
				concept1.drawing({
					source: localStorage.getItem("flat.vs.glsl"),
					location_points : 3,
					location : new Float32Array([
						-1.0,  1.0, 0.0,
						 1.0,  1.0, 0.0,
						 1.0,  0.0, 0.0,
						-1.0, -1.0, 0.0,
						 1.0, -1.0, 0.0
					]),
					index_points : 6,
					index : new Uint16Array([
						0, 1, 2,
						2, 4, 3
					])
				});
	
				// [xx]
				// [x ]
				// [xx]
				var concept1 = skeleton1.NewConcept(); // may clone other concept here
				concept1.drawing({
					source: localStorage.getItem("flat.vs.glsl"),
					location_points : 3,
					location : new Float32Array([
						-1.0,  1.0, 0.0,
						 1.0,  1.0, 0.0,
						-1.0,  0.0, 0.0,
						-1.0, -1.0, 0.0,
						 1.0, -1.0, 0.0
					]),
					index_points : 6,
					index : new Uint16Array([
						0, 1, 2,
						2, 4, 3
					])
				});
				
				//
				// [xxx]
				// [x x]
				//
				var concept1 = skeleton1.NewConcept(); // may clone other concept here
				concept1.drawing({
					source: localStorage.getItem("flat.vs.glsl"),
					location_points : 3,
					location : new Float32Array([
						-1.0,  1.0, 0.0,
						 0.0,  1.0, 0.0,
						 1.0,  1.0, 0.0,
						-1.0, -1.0, 0.0,
						 1.0, -1.0, 0.0
					]),
					index_points : 6,
					index : new Uint16Array([
						0, 1, 3,
						1, 2, 4
					])
				});
	
				*/
				if(opts.name == "[xx][x ]") {
					i.drawing.location_points = 3;
					i.drawing.location = new Float32Array([
						-1.0,  1.0, 0.0,
						 1.0,  1.0, 0.0,
						-1.0, -1.0, 0.0,
					]);
					i.drawing.index_points = 3;
					i.drawing.index = new Uint16Array([
						0, 1, 2
					]);
				} else if(opts.name == "[xx][ x]") {
					i.drawing.location_points = 3;
					i.drawing.location = new Float32Array([
						-1.0,  1.0, 0.0,
						 1.0,  1.0, 0.0,
						 1.0, -1.0, 0.0,
					]);
					i.drawing.index_points = 3;
					i.drawing.index = new Uint16Array([
						0, 1, 2
					]);
				} else if(opts.name == "[ x][xx]") {
					i.drawing.location_points = 3;
					i.drawing.location = new Float32Array([
						-1.0, -1.0, 0.0,
						 1.0,  1.0, 0.0,
						 1.0, -1.0, 0.0,
					]);
					i.drawing.index_points = 3;
					i.drawing.index = new Uint16Array([
						0, 1, 2
					]);
				} else if(opts.name == "[x ][xx]") {
					i.drawing.location_points = 3;
					i.drawing.location = new Float32Array([
						-1.0, -1.0, 0.0,
						-1.0,  1.0, 0.0,
						 1.0, -1.0, 0.0,
					]);
					i.drawing.index_points = 3;
					i.drawing.index = new Uint16Array([
						0, 1, 2
					]);
				} else if(opts.name == "[ x ][xxx]") {
					i.drawing.location_points = 3;
					i.drawing.location = new Float32Array([
						-1.0, -1.0, 0.0,
						0.0,  1.0, 0.0,
						 1.0, -1.0, 0.0,
					]);
					i.drawing.index_points = 3;
					i.drawing.index = new Uint16Array([
						0, 1, 2
					]);
				} else if(opts.name == "[x],size:[2,2]") {
					i.drawing.location_points = 3;
					i.drawing.location = new Float32Array([
						-1.0, -1.0, 0.0,
						-1.0,  1.0, 0.0,
						 1.0, -1.0, 0.0,
						 1.0,  1.0, 0.0
					]);
					i.drawing.index_points = 6;
					i.drawing.index = new Uint16Array([
						0, 1, 2,
						2, 1, 3
					]);
				} else if(opts.name == "[x],size:[1,1]") {
					i.drawing.location_points = 3;
					i.drawing.location = new Float32Array([
						-0.5, -0.5, 0.0,
						-0.5,  0.5, 0.0,
						 0.5, -0.5, 0.0,
						 0.5,  0.5, 0.0
					]);
					i.drawing.index_points = 6;
					i.drawing.index = new Uint16Array([
						0, 1, 2,
						2, 1, 3
					]);
				}
			} else {
				i.drawing.source = opts.source; // vertex source
				//console.log(i.drawing.source);
				
				if("add" in opts) {
					
				} else {
					i.drawing.location_points = opts.location_points; // number of points
					i.drawing.location = opts.location; // data
					i.drawing.index_points = opts.index_points;
					i.drawing.index = opts.index;
				}
				
				i.drawing.ready = true;
			}
			
		},
		material : function(opts) {
			console.log("MATERIAL");
			var i = this.internal["3Devils.Concept"].data;
			if("color" in opts)  {
				var re = /(^#[0-9a-fA-F]{3}$)|(^#[0-9a-fA-F]{6}$)/g;
				if( re.test(opts.color) ) {
					var hex = { 0 : 0, 1: 1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, "a":10, "A":10, "b":11, "B":11, "c":12, "C":12, "d":13, "D":13, "e":14, "E":14, "f":15, "F":15 };
					if(opts.color.length==4) {
						var r = hex[ opts.color.charAt(1) ]/15;
						var g = hex[ opts.color.charAt(2) ]/15;
						var b = hex[ opts.color.charAt(3) ]/15;
						this.set({ "material.color" : [r,g,b,1.0] });
					} else if(opts.color.length==7) {
						var r = ( (hex[ opts.color.charAt(1) ] << 4) + (hex[ opts.color.charAt(2)]) )/255;
						var g = ( (hex[ opts.color.charAt(3) ] << 4) + (hex[ opts.color.charAt(4)]) )/255;
						var b = ( (hex[ opts.color.charAt(5) ] << 4) + (hex[ opts.color.charAt(6)]) )/255;
						this.set({ "material.color" : [r,g,b,1.0] });
					}
				}
				i.material.wireframe = false;
			} else if("source" in opts) {
				i.material.source = opts.source;
				i.material.color = 0;
				i.material.wireframe = false;
			}
			
			
			//console.log(i.material.source);
			console.log("______________________________________________");
			
		},
		wireframe : function(bool) {
			var i = this.internal["3Devils.Concept"].data;
			
			if( Object.prototype.toString.apply(bool) == '[object Boolean]') {
				i.material.wireframe = bool;
				if(bool) {
					var used = {};
					var windex = [];
					for(var x = 0; x < i.drawing.index.length;x+=3) {
						var p0 = i.drawing.index[x+0];
						var p1 = i.drawing.index[x+1];
						
						windex.push(p0);
						windex.push(p1);
						
						
						p0 = i.drawing.index[x+1];
						p1 = i.drawing.index[x+2];
						
						
						windex.push(p0);
						windex.push(p1);
						
						
						
						p0 = i.drawing.index[x+2];
						p1 = i.drawing.index[x+0];
						
						
						windex.push(p0);
						windex.push(p1);
						
						
					}
					i.drawing.wireframe = new Uint16Array( windex );
					i.drawing.wireframe_lines = windex.length;
				}
			} else {
				throw 'wireframe argument must be boolean.';
			}
		},
		instance : function() {
			var i = this.internal["3Devils.Concept"].data;
			var _instance = Class.create("3Devils.Object", { "3Devils.Object" : [this] })
			i.instances.push(_instance);
			return _instance;
		},
		bindInstance : function(instance) {
			var i = this.internal["3Devils.Concept"].data;
			i.instances.push(instance);
			return instance;
		},
		/*
		definePoints : function(amount,callback) {
			var i = this.internal["3Devils.Geometry"].data
			i.points.amount = amount;
			i.points.array = new Float32Array(3*amount);
			callback(i.points.array);
			i.checks.mustBindPoints = true;
			i.checks.built = false;
		},
		defineIndex : function(amount,callback) {
			var i = this.internal["3Devils.Geometry"].data
			i.index.amount = amount;
			i.index.array = new Uint16Array(1*amount);
			callback(i.index.array);
			i.checks.mustBindPoints = true;
			i.checks.built = false;
		},
		defineMaterial : function() {
			
		},
		*/
		color : function(color) {
			
		},
		get : function(target) {
			var r = {};
			for(var x = 0; x < target.length;x++) {
				if(target[x] == "material.color") {
					if(!("material" in r)) r.material = {};
					r.material.color = i.material.color;
				}
			}
		},
		set : function(targets) {
			
			var i = this.internal["3Devils.Concept"].data;
			var fs_changed = false;
			var fs_code = [];
			fs_code.push("void main(void){");
			for(var key in targets) {
				if(key == "material.color") { // this is slower than passing uniform, but it's more acuratte on long term where there will be low use of solid colors that are not mapped
					var value = targets[key];
					var r = value[0];
					var g = value[1];
					var b = value[2];
					i.material.color = value;
					fs_code.push("\tgl_FragColor=vec4(" + r.toPrecision(4) + "," + g.toPrecision(4) + "," + b.toPrecision(4) + ",1.0);");
					fs_changed = true;
				}
			}
			fs_code.push("}");
			if(fs_changed) { // update program
				i.material.source = fs_code.join("\r\n");
			}
		},
		Save : function(concept_context) {
			var i = this.internal["3Devils.Concept"].data;
			
			
			this.SaveInstance(concept_context);
			
			
			concept_context.drawing = {};
			concept_context.material = {};
			
			concept_context.drawing.source_index = i.framework.vertexCache.indexOf( i.drawing.source );
			
			concept_context.drawing.location_points = i.drawing.location_points; // number of points
			concept_context.drawing.location = [];
			for(var x = 0; x < i.drawing.location.length;x++)
				concept_context.drawing.location.push( i.drawing.location[x] );
			
			concept_context.drawing.index_points = i.drawing.index_points;
			concept_context.drawing.index = [];
			for(var x = 0; x < i.drawing.index.length;x++)
				concept_context.drawing.index.push( i.drawing.index[x]);
			
			concept_context.material.source_index = i.framework.fragmentCache.indexOf( i.material.source );
			
			concept_context.material.color = i.material.color;
			
			
			concept_context.instances = [];
			for(var x = 0; x < i.instances.length;x++) {
				var instance = {};
				i.instances[x].Save(instance);
				concept_context.instances.push( instance );
			}
			
		},
		Load : function(concept_context) {
			
			var i = this.internal["3Devils.Concept"].data;
			this.LoadInstance( concept_context );
			
			
			var vs_code_index = concept_context.drawing.source_index;
			var fs_code_index = concept_context.material.source_index;
			
			var fw = i.framework;
			i.drawing.source = fw.vertexCache[ vs_code_index ];
			i.drawing.color = concept_context.color;
			
			i.material.source = fw.fragmentCache[ fs_code_index ];
			
			i.drawing.location_points = concept_context.drawing.location_points;
			i.drawing.location = new Float32Array(concept_context.drawing.location.length);
			for(var x = 0; x < concept_context.drawing.location.length;x++)
				i.drawing.location[x] = concept_context.drawing.location[x];
			
			i.drawing.index_points = concept_context.drawing.index_points;
			i.drawing.index = new Uint16Array( concept_context.drawing.index.length );
			for(var x = 0; x < concept_context.drawing.index.length;x++)
				i.drawing.index[x] = concept_context.drawing.index[x];
			
			var len0 = i.instances.length;
			for(var x = 0; x < len0;x++) i.instances.pop();
			
			for(var x = 0; x < concept_context.instances.length;x++) {
				var i = this.instance();
				console.log( concept_context.instances[x] );
				
				i.Load( concept_context.instances[x] );
			}
			
		}
	}
});


Class.define("3Devils.Object",{
	from : ["WithEvents","3Devils.Instance"],
	ctor : function(concept) {
		var i = this.internal["3Devils.Object"].data = {};
		
		i.concept = concept;
		
		i.mouse = {};
		
		Object.defineProperty(this,"concept",{ get : function() { return i.concept; } });
		
		var j = i.concept.internal["3Devils.Concept"].data;
		
		// set mouse
		
		j.keyframe.on("mousemove_keyframe",function(mouse) {
			// must track all skeleton up
			
			
			this.emit("mousemove_object",[i.mouse]);
		});
		
		j.keyframe.on("mousedown_keyframe",function(mouse) {
			// must track all skeleton up
			
			this.emit("mousedown_object",[i.mouse]);
		});
		
		j.keyframe.on("mouseup_keyframe",function(mouse) {
			// must track all skeleton up
			
		
			this.emit("mouseup_object",[i.mouse]);
		});
		
	},
	proto : {
		
		Save : function(instance_context) {
			this.SaveInstance(instance_context);
			
		},
		Load : function(instance_context) {
			this.LoadInstance(instance_context);
			
		}
	}
})