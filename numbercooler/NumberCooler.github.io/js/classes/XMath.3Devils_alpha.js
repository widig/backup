



Class.define("XMath.3Devils_alpha",{
	from  : ["WithEvents","WithAlias","WithArray"],
	ctor : function(target) {
		
		var i = this.internal["XMath.3Devils_alpha"].data = {};
		i.canvas = target;
		i.mouse = {
			left : 0,
			top : 0,
			button : 0,
			dragging : false,
			backup : null // start point
		};
		i.keyboard = {
		};
		i.padding = [0,0,0,0]; // left,top,right,bottom
		i.border = [0,0,0,0]; // left,top,right,bottom
		i.size = [1,1];
		i.aspect = [1,1];
		i.source = [1,1];
		i.global = {};
		
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
				
				
				this.emit("objectmove",[i.mouse]);
				
				// end mouse in frame code
				//console.log(i.mouse);
			} else {
				i.mouseInFrame = false;
			}
			
			
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
				
				
			
				i.mouse.button |= 0xF & event.button;
				
				// if in any image map then emit start_drag
				this.emit("drag",[i.mouse]);
			
			
				// end mouse in frame code
				//console.log(i.mouse);
			} else {
				i.mouseInFrame = false;
			}
			
			
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
				
				
				
				
			
				i.mouse.button &= ~( (~0xF) | event.button );
				// if dragging then emit stop_drag
				this.emit("drop",[i.mouse]);
			
				
				// end mouse in frame code
				//console.log(i.mouse);
			} else {
				i.mouseInFrame = false;
			}
			
			
			
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
		
		
		
		Object.defineProperty(this, "canvas", { get : function() { return i.canvas; } } )
		var GL = null;
		
		i.canvas.addEventListener("webglcontextcreationerror", function(e) {
			console.log(e.statusMessage || "Unknown error"); 
		}, false);
		
		var webgl_string = [ "webgl","experimental-webgl"];
		var error = 0;
		for(var x = 0; x < webgl_string.length;x++) {
			
			try {  
				GL = i.canvas.getContext(webgl_string[x], {antialias: true, alpha: true});  
				error = 0;
			} catch (e) { 
				error = 1;
			}
		}
		if( !error ) {
			i.context = GL;
			Object.defineProperty(this,"context", { get : function() { return i.context; }});
		} else throw "cant init webgl.";
		
		i.canvas.addEventListener("webglcontextlost", function(e) {
			console.log(e); 
			throw "lost context.";
		}, false);
		i.canvas.addEventListener("webglcontextrestored", function(e) {
			console.log(e); 
			throw "restored context.";
		}, false);
		
		i.enabled = false;
		i.sceneSelectedName = "";
		i.source = [1,1];
		i.size = [1,1];
		i.sceneSelected = -1;
		
		Object.defineProperty(this,"sceneSelectedName", { 
			get : function() { return i.sceneSelectedName; },
			set : function(val) {
				i.sceneSelectedName = val;
				
			}
		});
		
		Object.defineProperty(this,"isPlaying",{ get : function() { return i.enabled; } });
		
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
		console.log("events");
		
		this.on("play",function() {
			console.log("PLAY enabled");
			i.enabled = true;
		});
		
		this.on("pause",function() {
			console.log("PAUSE0");
			i.enabled = false;
		});
		
		this.on("stop",function() {
			console.log("STOP0");
			i.enabled = false;
		});
		
		this.on("next",function() {
			i.sceneSelected = ( i.sceneSelected + 1 ) % this.itemAmount();
		});
		
		this.on("previous",function() {
			i.sceneSelected = ( i.sceneSelected - 1 ) % this.itemAmount();
		});
		
		
		console.log("canvas");
		
	},
	proto : {
		setGlobal : function(set) {
			var i = this.internal["XMath.3Devils_alpha"].data;
			i.global = set;
		},
		RunFrame : function() {
			var i = this.internal["XMath.3Devils_alpha"].data;
			
			if(this.isPlaying) {
				if( i.sceneSelected >= 0 && i.sceneSelected < this.itemAmount() ) {
					
					var GL = this.context;
					GL.viewport(0, 0, this.width, this.height);
					GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
					
					GL.clearColor(0.0, 0.0, 0.0, 1.0);
					GL.enable(GL.DEPTH_TEST);
					
					this.varGet(this.sceneSelectedName).build( i.context );
					
					this.emit("whileKey",[i.keyboard]);
					
					GL.finish();
					
				}
			}
		},
		setSize : function(opt) {
			if("width" in opt) this.width = opt.width;
			if("height" in opt) this.height = opt.height;
			if("sourceX" in opt) this.sourceX = opt.sourceX;
			if("sourceY" in opt) this.sourceY = opt.sourceY;
		},
		PlayPause : function() {
			if(this.isPlaying) {
				this.emit("pause");
			} else {
				this.emit("play");
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
		PlaylistEnqueue : function() {
			
		},
		PlaylistPush : function() {
			
		},
		PlaylistRemove : function() {
			
		},
		New : function(name,live) {
			var i = this.internal["XMath.3Devils_alpha"].data;
			
			var scene = Class.create("XMath.3Devils_alpha.Scene",{ "XMath.3Devils_alpha.Scene" : [this,i.global] });
			this.varSet(name,scene);
			this.itemPush(scene);
			this.sceneSelectedName = name;
			this.emit("next");			
			if(live) {
				this.emit("play");
			}
			return scene;
		},
		Get : function(name) {
			return this.varGet(name);
		},
		Load : function(data) {
			var scene = this.New();
			var point = this.StartPoint();
			point.x = 0; point.y = 0;
			
		},
		Save : function() {
			
		}
	}
});

Class.define("XMath.3Devils_alpha.Entity",{
	ctor : function() { // the user body, camera can move based on body, this is a skeleton, selfie shit
	
		Object.defineProperty(this,"camera",{
			
		});
		Object.defineProperty(this,"skeletonToCamera",{
			
		});
		
	}, 
	proto : {
		
	}
});
Class.define("XMath.3Devils_alpha.TextureGenerator",{
	from : ["WithEvents"]
	, ctor : function(callback) {
		// ghost canvas
		
		// better to buffer drawed images
		
		
		var cpu = {
			instance : null,
			boot : function() {
				var self = this;
				this.instance = new Worker("/js/build/nctg.js");
				this.instance.addEventListener('message', function(e) { // router
					var json = e.data;
					try { 
						//console.log(json.app,json.method);
						cpu.SO.type[ cpu.selectedSO ].app[json.app][ json.method ].apply(
							cpu.SO.type[ cpu.selectedSO ].app[json.app],json.args); 
					} catch(e) { }
				}, false);
			}, 
			SO : {
				type : {
					alpha : {
						app : {
						}
					}
				},
				
			},
			selectedSO : "alpha"
		};
		cpu.SO.type[ cpu.selectedSO ].app.nctg = {
			jobsRunning : {},
			reset : function() {
				
			},
			done : function(data) {
				
				// data.name
				// data.value
				console.log("TEXTURE DRAWING DONE");
				//console.log("DONE!!!!!!!!!!!!!!!! IMAGE SENT",data);
				if( data.name in this.jobsRunning ) {
					
					var canvas = document.createElement("canvas");
					canvas.setAttribute("width",data.size);
					canvas.setAttribute("height",data.size);
					canvas.style.position = "relative";
					canvas.style.width = data.size + "px";
					canvas.style.height = data.size + "px";
					canvas.style.border = "solid 1px #00F";
					var ctx = canvas.getContext("2d");
					var imgData = ctx.getImageData(0,0,data.size,data.size);
					imgData.data.set(data.value);
					ctx.putImageData(imgData,0,0);
					//console.log("DONE!!!!!!!!!!!!!!!! TO CANVAS");	
					if(this.jobsRunning[data.name].type == "texture") {
				
						console.log("TEXTURE EMIT DRAW EVENT");				
						
						//console.log("DONE!!!!!!!!!!!!!!!! IMAGE SENT");
						var image = new Image();
						image.setAttribute("src",canvas.toDataURL());
						var callback = this.jobsRunning[data.name].callback;
						
						//console.log("DONE!!!!!!!!!!!!!!!! IMAGE SENT",callback);
						
						callback&&callback( data.name, image )
						
						
					} else if(this.jobsRunning[data.name].type == "canvas") {
						callback&&callback(canvas);
					}
					
				}
				// registered callback
			}
		};
		cpu.boot();
		cpu.SO.type[ cpu.selectedSO ].app.nctg.reset();
		/*
		var imgData = ctx.getImageData(0,0,64,64);
		for(var x = 0; x < 64;x++) {
			for(var y = 0; y < 64;y++) {
				var pos = 4* ( y*64+x );
				imgData.data[ pos + 0 ] = 0;
				imgData.data[ pos + 1 ] = 0;
				imgData.data[ pos + 2 ] = 0;
				imgData.data[ pos + 3 ] = 255;
			}
		}
		ctx.putImageData(imgData,0,0);
		
		var image = new Image();
		image.style.position = "relative";
		image.style.border = "solid 1px #ff0000";
		image.setAttribute("src",canvas.toDataURL());
		document.body.appendChild(image);
		*/
		
		this.Draw = function(name,size,type,callback) {
			console.log("TEXTURE DRAWING");
			var jobs = cpu.SO.type[ cpu.selectedSO ].app.nctg.jobsRunning;
			jobs[name] = {
				name : name,
				type : type,
				callback : callback
			};
			cpu.instance.postMessage({ 
				app : "nctg", method: "draw", args: [{name : name, size : size}] 
			});
		}
	},
	proto : {
		
	}
});

Class.define("XMath.3Devils_alpha.DigitalCamera",{ // this is a digital camera
	from : [ "WithArray", "WithEvents"] // array is lens array
	, ctor : function() {
		console.log("camera ctor");
		var V3 = function(a,b,c) { 
			var p = Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]});  
			console.log(p.x);
			return p;
		};
		var M4 = function() { 
			return Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]}); 
		};

		var i = this.internal["XMath.3Devils_alpha.DigitalCamera"].data = {};
		
		i.up = V3(0,1,0);
		i.rotation = [];
		
		i.left = -1;
		i.right = 1;
		i.top = 1;
		i.bottom = -1;
		i.near = 1;
		i.far = 100;
		i.type = "limited-perspective";
		if(i.type == "limited-perspective") {
			
			i.lookAt = V3(0,0,0);
			i.position = V3(0,0,-1); // 45 deg
			
		} else {
			var human = false;
			if(human) {
				i.position = V3(0,1.7,-2);
				i.lookAt = V3(0,1.7,-1);
			} else {
				i.position = V3(0,0,-2);
				i.lookAt = V3(0,0,-1);
			}
		
		}
		
		i.walk = {}; // directions to keyboard
		i.walk.xaxisto = [ 0, 45, 90, 135, 180, 225, 270, 315 ] // z
		i.walk.xaxisto_index = 0;
		i.walk.yaxisto = [ 0, 45, 90, 135, 180, 225, 270, 315 ] // z
		i.walk.yaxisto_index = 0;
		i.walk.zaxisto = [ 0, 45, 90, 135, 180, 225, 270, 315 ] // z
		i.walk.zaxisto_index = 0;
		
		
		Object.defineProperty(this,"walkZeroLeftAngle",{
			get : function() { return i.walk.yaxisto[ i.walk.yaxisto_index ]; }
		});
		this.turnYLeft = function() {
			i.walk.yaxisto_index = ( i.walk.yaxisto_index + 1 ) % i.walk.yaxisto.length;
		};
		Object.defineProperty(this,"walkZeroRightAngle",{
			get : function() { return i.walk.yaxisto[ i.walk.yaxisto.length - 1 - i.walk.yaxisto_index ]; }
		});
		this.turnYRight = function() {
			i.walk.yaxisto_index = ( i.walk.yaxisto_index - 1 + i.walk.yaxisto.length) % i.walk.yaxisto.length;
		};
		Object.defineProperty(this,"walkDownAngle",{
			get : function() { return i.walk.xaxisto[ i.walk.xaxisto_index ]; }
		})
		this.turnXFront = function() {
			i.walk.xaxisto_index = ( i.walk.xaxisto_index + 1 ) % i.walk.xaxisto.length;
		};
		Object.defineProperty(this,"walkUpAngle",{
			get : function() { return i.walk.xaxisto[ i.walk.xaxisto.length - 1 - i.walk.xaxisto_index ]; }
		});
		this.turnXBack = function() {
			i.walk.xaxisto_index = ( i.walk.xaxisto_index - 1 + i.walk.xaxisto.length) % i.walk.xaxisto.length;
		};
		Object.defineProperty(this,"walkOneLeftAngle",{
			get : function() { return i.walk.zaxisto[ i.walk.zaxisto_index ]; }
		})
		this.turnZCcw = function() {
			i.walk.zaxisto_index = ( i.walk.zaxisto_index + 1 ) % i.walk.zaxisto.length;
		};
		Object.defineProperty(this,"walkOneRightAngle",{
			get : function() { return i.walk.zaxisto[ i.walk.zaxisto.length - 1 - i.walk.zaxisto_index ]; }
		});
		this.turnZCw = function() {
			i.walk.zaxisto_index = ( i.walk.zaxisto_index - 1 + i.walk.zaxisto.length) % i.walk.zaxisto.length;
		};
		
		Object.defineProperty(this,"type",{
			get : function() { return i.type; },
			set : function(val) {
				i.type = val;
				// emit event to reload programs
			}
		});
		
		Object.defineProperty(this,"position",{
			get : function() {
				return i.position;
			},
			set : function(val) {
				i.position.data.set(val.data);
			}
		});
		
		Object.defineProperty(this,"lookAt",{
			get : function() {
				return i.lookAt;
				
			},
			set : function(val) {
				i.lookAt.data.set(val.data);
			}
		});
		
		
		Object.defineProperty(this,"fieldOfViewVertical",{
			get : function() {
				return -1;
			}
		});
		Object.defineProperty(this,"fieldOfViewHorizontal",{
			get : function() {
				return -1;
			}
		});
		// cube view for orthogonal
		// box view for iso
		// trapezoid inner box for perspective
		
		// not used at non linear, z is non linear, x and y are pure at that description
		Object.defineProperty(this,"depthSize",{
			get : function() { return i.depthSize; },
			set : function(val) { i.depthSize = val; }
		});
		Object.defineProperty(this,"verticalSize",{
			get : function() { return i.verticalSize; },
			set : function(val) { i.verticalSize = val; }
		});
		Object.defineProperty(this,"horizontalSize",{
			get : function() { return i.horizontalSize; },
			set : function(val) { i.horizontalSize = val; }
		});
		
		Object.defineProperty(this,"left",{
			get : function() { return i.left; },
			set : function(val) { i.left = val; }
		});
		Object.defineProperty(this,"right",{
			get : function() { return i.right; },
			set : function(val) { i.right = val; }
		});
		Object.defineProperty(this,"top",{
			get : function() { return i.top; },
			set : function(val) { i.top = val; }
		});
		Object.defineProperty(this,"bottom",{
			get : function() { return i.bottom; },
			set : function(val) { i.bottom = val; }
		});
		
		
		Object.defineProperty(this,"up",{
			get : function() {
				return i.up;
			},
			set : function(val) {
				i.up.data.set(val.data);
			}
		});
		
		Object.defineProperty(this,"rotation",{
			get : function() { return i.rotation; }
		});
		
		Object.defineProperty(this,"near",{
			get : function() { return i.near; },
			set : function(val) {
				i.near = val;
			}
		});
		Object.defineProperty(this,"far",{
			get : function() { return i.far; },
			set : function(val) {
				i.far = val;
			}
		});
		
		
	},
	proto : {
		SlideForward : function(val) { // absolute
			var c = this;
			var mode = "absolute";
			if(mode=="absolute") {
				if( c.walkZeroLeftAngle == 0 ) {
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
				if( c.walkZeroLeftAngle == 45 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
				if( c.walkZeroLeftAngle == 90 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
				}
				if( c.walkZeroLeftAngle == 135 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
				if( c.walkZeroLeftAngle == 180 ) {
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
				if( c.walkZeroLeftAngle == 225 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
				if( c.walkZeroLeftAngle == 270 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
				}
				if( c.walkZeroLeftAngle == 315 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
			} else if(mode == "relative") {
				
			}
		},
		SlideBackward : function(val) { // absolute
			var c = this;
			var mode = "absolute";
			if(mode == "absolute") {
				if( c.walkZeroLeftAngle == 0 ) {
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
				if( c.walkZeroLeftAngle == 45 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
				if( c.walkZeroLeftAngle == 90 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
				}
				if( c.walkZeroLeftAngle == 135 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
				if( c.walkZeroLeftAngle == 180 ) {
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
				if( c.walkZeroLeftAngle == 225 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
				if( c.walkZeroLeftAngle == 270 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
				}
				if( c.walkZeroLeftAngle == 315 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
			} else if(mode == "relative") {
				
			}
		},
		SlideUp : function(val) {
			var mode = "absolute";
			if(mode == "abosolute") {
				this.position.y += 1;
				this.lookAt.y += 1;
			} else if(mode == "relative") {
				
			}
		},
		SlideDown : function(val) {
			var mode = "absolute";
			if(mode == "abosolute") {
				this.position.y -= 1;
				this.lookAt.y -= 1;
			} else if(mode == "relative") {
				
			}
		},
		SlideLeft : function(val) {
			
			console.log(" @@  TEST  @@  ",val);
			
			
			
			var c = this;
			var mode = "absolute";
			if(mode == "absolute") {
				if( c.walkZeroLeftAngle == 0 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
				}
				if( c.walkZeroLeftAngle == 45 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
				if( c.walkZeroLeftAngle == 90 ) {
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
				if( c.walkZeroLeftAngle == 135 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
				if( c.walkZeroLeftAngle == 180 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
				}
				if( c.walkZeroLeftAngle == 225 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
				if( c.walkZeroLeftAngle == 270 ) {
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
				if( c.walkZeroLeftAngle == 315 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
			} else if(mode == "relative") {
				
			}
		},
		SlideRight : function(val) {
			var c = this;
			var mode = "absolute";
			if(mode == "absolute") {
				if( c.walkZeroLeftAngle == 0 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
				}
				if( c.walkZeroLeftAngle == 45 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
				if( c.walkZeroLeftAngle == 90 ) {
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
				if( c.walkZeroLeftAngle == 135 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
					c.position.z = Math.round(c.position.z) + val;
					c.lookAt.z = Math.round(c.position.z) + val;
				}
				if( c.walkZeroLeftAngle == 180 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
				}
				if( c.walkZeroLeftAngle == 225 ) {
					c.position.x = Math.round(c.position.x) - val;
					c.lookAt.x = Math.round(c.position.x) - val;
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
				if( c.walkZeroLeftAngle == 270 ) {
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
				if( c.walkZeroLeftAngle == 315 ) {
					c.position.x = Math.round(c.position.x) + val;
					c.lookAt.x = Math.round(c.position.x) + val;
					c.position.z = Math.round(c.position.z) - val;
					c.lookAt.z = Math.round(c.position.z) - val;
				}
			} else if(mode == "relative") {
				
			}
		},
		TurnLeft : function(val) { // absolute
			var c = this;
			var V3 = function(a,b,c) { 
				var p = Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]});  
				return p;
			};
			var mode = "absolute";
			if(mode == "absolute") {
				c.rotation.push( V3(0,Math.PI/4,0) );
				c.turnYLeft();
			} else if(mode == "relative") {
			}
		},
		TurnRight : function(val) { // absolute
			var c = this;
			var V3 = function(a,b,c) { 
				var p = Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]});  
				return p;
			};
			var mode = "absolute";
			if(mode == "absolute") {
				c.rotation.push( V3(0,-Math.PI/4,0) );
				c.turnYRight();
			} else if(mode == "relative") {
			}
		},
		TurnDown : function(val) { // absolute
			var c = this;
			var V3 = function(a,b,c) { 
				var p = Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]});  
				return p;
			};
			var mode = "absolute";
			if(mode == "absolute") {
				c.rotation.push( V3(Math.PI/4,0,0) );
			} else if(mode == "relative") {
				
			}
		},
		TurnUp : function(val) { // absolute
			var c = this;
			var V3 = function(a,b,c) { 
				var p = Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]});  
				return p;
			};
			var mode = "aboslute";
			if(mode == "absolute") {
				c.rotation.push( V3(-Math.PI/4,0,0) );
			} else if(mode == "relative") {
				
			}
		},
		TurnCcw : function() { // absolute
			var c = this;
			var V3 = function(a,b,c) { 
				var p = Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]});  
				return p;
			};
			var mode = "aboslute";
			if(mode == "absolute") {
				c.rotation.push( V3(0,0,Math.PI/4) );
			} else if(mode == "relative") {
				
			}
		},
		TurnCw: function() { // absolute
			var c = this;
			var V3 = function(a,b,c) { 
				var p = Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]});  
				return p;
			};
			var mode = "aboslute";
			if(mode == "absolute") {
				c.rotation.push( V3(0,0,-Math.PI/4) );;
			} else if(mode == "relative") {
			}
		}
		
	}
});
Class.define("XMath.3Devils_alpha.Lens",{
	ctor : function() {
		
		var i = this.internal["XMath.3Devils_alpha.Lens"].data = {};
		i.data.position = V3(0,0,-1);
		i.data.normal = V3(0,0,1);
		i.data.rotation = V3(0,0,0);
		i.data.angle = 0;
		i.data.nearA = 1;
		i.data.farA = 100;
		i.data.nearB = 1;
		i.data.farB = 100;
		i.data.geometry = null;
		i.data.texture = null;
		i.data.enabled = false;
		
		Object.defineProperty(this,"enabled",{
			get : function() {
				return i.data.enabled;
			},
			set : function(val) {
				i.data.enabled = val;
			}
		});
		
		Object.defineProperty(this,"position",{
			get : function() {
				return i.data.position;
			},
			set : function(val) {
				i.data.position.data.set(val.data);
			}
		});
		
		Object.defineProperty(this,"rotation",{
			get : function() {
				return i.data.rotation;
			},
			set : function(val) {
				i.data.rotation.data.set(val.data);
			}
		});
		
		Object.defineProperty(this,"angle",{
			get : function() {
				return i.data.angle;
			},
			set : function(val) {
				i.data.angle = val;
			}
		});
		Object.defineProperty(this,"nearA",{
			get : function() {
				return i.data.nearA;
			},
			set : function(val) {
				i.data.nearA = val;
			}
		});
		Object.defineProperty(this,"farA",{
			get : function() {
				return i.data.farA;
			},
			set : function(val) {
				i.data.farA = val;
			}
		});
		Object.defineProperty(this,"nearB",{
			get : function() {
				return i.data.nearB;
			},
			set : function(val) {
				i.data.nearB = val;
			}
		});
		Object.defineProperty(this,"farB",{
			get : function() {
				return i.data.farB;
			},
			set : function(val) {
				i.data.farB = val;
			}
		});
		Object.defineProperty(this,"geometry",{
			get : function() {
				return i.data.geometry;
			},
			set : function(val) {
				i.data.geometry = val;
			}
		});
		
	},
	proto : {
		
	}
});

Class.define("XMath.Axis",{
	from : ["XMath.V3"]
	, ctor : function(a,b,c) {
		
		var r = Math.sqrt( a*a + b*b + c*c );
		this.x = a/r;
		this.y = b/r;
		this.z = c/r;
		
	}, 
	proto : {
	}
});
Class.define("XMath.3Devils_alpha.ObjectGroup",{
	from : [ "WithArray", "WithAlias","WithEvents"],
	ctor : function() {
		
	},
	proto : {
		
	}
	
});

Class.define("XMath.3Devils_alpha.Space",{
	// dynamic load scenes, when trigger border areas or change camera angle or step
	
});
Class.define("XMath.3Devils_alpha.Scene",{
	from : ["WithEvents"],
	ctor : function(parent,global) {
		global = global || {};
		this.context = parent.context;
		var GL = this.context;
		
		
		
		
		
		var i = this.internal["XMath.3Devils_alpha.Scene"].data = {};
		i.global = global;
		i.camera = Class.create("XMath.3Devils_alpha.DigitalCamera");
		i.wireframe = false;
		i.cache = {};
		
		i.cache.programs = {}; // programs
		
		//this.program = GL.createProgram();
		
		// request change name
		i.cache.objects = {}; // geometry, and primitive build stuff
		i.cache.object_count = 0;
		
		var V3 = function(a,b,c) { return Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]}); };
		var M4 = function() { return Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]}); };
		var axis = function(a,b,c) { 
			return Class.create("XMath.Axis",{ 
					"XMath.V3" : [ "Float32Array" ]
					, "XMath.Axis" : [ a,b,c ]
				}
			); 
		};
		
		this.axis = [  // used to move cursor
			[axis(1,0,0),axis(0,1,0),axis(0,0,1)]
		]; // stack of the drawing program
		this.stack = [ // used to build a skeleton
		];
		
		
		var _location = V3(0,0,0);
		var _cursor_rotation = V3(0,0,0);
		
		var nctg = Class.create("XMath.3Devils_alpha.TextureGenerator");
		
		
		
		
		
		var _textures = {};
		Object.defineProperty(this,"textureGenerator",{ get : function() { return nctg; } });
		Object.defineProperty(this,"textures",{ get : function() { return _textures; } });
		
		this.textureUpdate = function(name) { 
			// triggered from obj.Texture, but optimization makes this an internal 
			// function with public access throught the classes
			// in order to handle worker async vs webgl async
			if( name in this.textures ) {
				while( this.textures[name].pending.length > 0 ) {
					var obj = this.textures[name].pending.shift();
					obj.TextureEvent(name);
				}
			}
		}
		
		this.objectUpdate = function(name) {
			// mappings
			if( name in this.internal["XMath.3Devils_alpha.Scene"].data.cache.objects) {
				while( this.internal["XMath.3Devils_alpha.Scene"].data.cache.objects[name].pending.length > 0) {
					var obj = this.internal["XMath.3Devils_alpha.Scene"].data.cache.objects[name].pending.shift();
					//console.log(name,obj);
					obj.BuildEvent(name);
				}
			}
		}
		
		Object.defineProperty(this,"camera",{ get : function() { return i.camera; } });
		
		Object.defineProperty(this,"lastAxis",{ get : function() { return this.axis[this.axis.length-1]; } });
		Object.defineProperty(this,"location",{ get : function() { return _location; } });
		this.locationZero = function() {
			_location.x = 0;
			_location.y = 0;
			_location.z = 0;
		};
		this.locationAt = function(x,y,z) {
			_location.x = x;
			_location.y = y;
			_location.z = z;
		};
		
		Object.defineProperty(this,"cursorRotation", { get : function() { return _cursor_rotation; } });
		Object.defineProperty(this,"wireframe", { get : function() {
			return i.wireframe;
		}});
		
		
		
		var shift = false;
		parent.on("startKey",function(keyboard,key) {
		
			if(key == KeyCode.SHIFT) {
				shift = true;
			}
		});
		
		parent.on("whileKey",function(keyboard) {
			if(shift) {
			}
		});
		parent.on("endKey",function(keyboard,key) {
			
			if( key==KeyCode.D1 ) {
				console.log("WIREFRAME CALL");
				if(i.wireframe) {
					i.wireframe = false;
				} else {
					i.wireframe = true;
				}
			}
			
			if( !keyboard[KeyCode.SHIFT] && (key==KeyCode.UP || key == KeyCode.W) ) {
				i.camera.SlideForward(1.0);
			}
			if( !keyboard[KeyCode.SHIFT] && (key==KeyCode.DOWN|| key==KeyCode.S) ) {
				i.camera.SlideBackward(1.0);
			}
			if( !keyboard[KeyCode.SHIFT] && (key==KeyCode.LEFT||key==KeyCode.A) ) {
				i.camera.SlideLeft(1.0);
			}
			if( !keyboard[KeyCode.SHIFT] && (key==KeyCode.RIGHT||key==KeyCode.D) ) {
				i.camera.SlideRight(1.0);
			}
			if( !keyboard[KeyCode.SHIFT] && key==KeyCode.PAGEUP ) {
				i.camera.SlideUp(1.0);
			}
			if( !keyboard[KeyCode.SHIFT] && key==KeyCode.PAGEDOWN ) {
				i.camera.SlideDown(1.0);
			}
			if( !keyboard[KeyCode.SHIFT] && key == KeyCode.NUMPAD_8 ) {
				i.camera.TurnDown(1.0);
			}
			if( !keyboard[KeyCode.SHIFT] && key == KeyCode.NUMPAD_2 ) {
				i.camera.TurnUp(1.0);
			}
			if( !keyboard[KeyCode.SHIFT] && key==KeyCode.NUMPAD_7 ) {
				i.camera.TurnCcw(1.0);
			}
			if( !keyboard[KeyCode.SHIFT] && key==KeyCode.NUMPAD_9 ) {
				i.camera.TurnCw(1.0);
			}
			if( !keyboard[KeyCode.SHIFT] && (key==KeyCode.DELETE||key==KeyCode.Q) ) { // rotate direction of walk
				i.camera.TurnLeft(1.0);
			}
			if( !keyboard[KeyCode.SHIFT] &&(key==KeyCode.END||key==KeyCode.E) ) { // rotate direction of walk
				i.camera.TurnRight(1.0);
			}
			
			
			if(key == KeyCode.SHIFT) {
				shift = false;
			}
			
			
		});
		this.objects = Class.create("XMath.3Devils_alpha.ObjectGroup");
		this.objects.on("itemInputFilter",function(index,replace,value) {
			// method to call start points
			//console.log("INPUT FILTER");
			
			
			// that uses drag and drop
			parent.on("objectmove",function(mouse) {
				//console.log("objectmove");
				// is it dragging?
				if(mouse.dragging) {
					// yes
					console.log("RAYTRACE");
						// refresh object position of selected point
						value.MouseMoveTo(mouse);
						
				} else {
					// no
						// just ignore
				}
			});
			parent.on("drag",function(mouse) {
				console.log("drag");
				// this point is visible?
				if(value.enabled) {
					// yes
					// are inside this point?
					if( value.raytrace(mouse) ) {
						
						// yes
							// save current point as start point
							console.log("RAYTRACE");
							
							mouse.backup = [ mouse.left,mouse.right ];
							value.MouseMoveTo(mouse);
							mouse.dragging = true;
							
					} else {
						// no
					}
				} else {
					// no
						// just ignore
				}
			});
			parent.on("drop",function(mouse) {
				console.log("drop");
				// clear start point
				// map object to mouse.backup;
				if(value.enabled) {
					if(mouse.dragging) {
						console.log("RAYTRACE");
						value.MouseMoveTo(mouse);
						mouse.dragging = false;
					}
				}
				
				
			});
			
			
			
			return true;
		});
		
		
		this.build = function(GL) {
			var mapping = [];
			
			
			for(var x = this.objects.itemAmount()-1;x >=0;x--) {
				
				//console.log("SCENE",x);
				
				
				
				/*  
				
					XMath.3Devils_alpha.Geometry is constrained with line bellow in the build call 
					
					
				*/
				var check = this.objects.itemGetAt(x).build(GL,this);
				if(check) {
					//console.log("LOAD MAPPING");
					mapping[x] = this.objects.itemGetAt(x).loadMapping(GL);
					
					
					//console.log("LOADING PROGRAM")
					this.objects.itemGetAt(x).loadProgram(GL);
					//console.log("RENDER OBJECT")
					
					this.objects.itemGetAt(x).render(GL,mapping[x],this);
					
				}
				
			}
		
		}
	},
	proto : {
		ResetStack : function() {
			while(this.axis.length>1) this.axis.pop();
			return this;
		},
		SkeletonStack : function() {
			var s = {};
			
			// not implemented
			
			return s;
		},
		GotoPolarX : function(rv,ru,av,au) {
			
			var radius = rv/ru;
			var original = av*Math.PI/au;
			var absoluteAngle = this.cursorRotation.x;
			var axis = function(a,b,c) { 
				return Class.create("XMath.Axis",{ 
						"XMath.V3" : [ "Float32Array" ]
						, "XMath.Axis" : [ a,b,c ]
					}
				); 
			};
			
		},
		GotoPolarY : function(rv,ru,av,au) {
			var radius = rv/ru;
			var original = av*Math.PI/au;
			var absoluteAngle = this.cursorRotation.y;
			var axis = function(a,b,c) { 
				return Class.create("XMath.Axis",{ 
						"XMath.V3" : [ "Float32Array" ]
						, "XMath.Axis" : [ a,b,c ]
					}
				); 
			};
			
		},
		GotoPolarZ : function(rv,ru,av,au) {
			var radius = rv/ru;
			var original = av*Math.PI/au;
			var absoluteAngle = this.cursorRotation.z;
			var axis = function(a,b,c) { 
				return Class.create("XMath.Axis",{ 
						"XMath.V3" : [ "Float32Array" ]
						, "XMath.Axis" : [ a,b,c ]
					}
				); 
			};
			
			/*
			console.log("@@@@","AXIS");
			console.log(this.lastAxis[0].x,this.lastAxis[0].y,this.lastAxis[0].z);
			console.log(this.lastAxis[1].x,this.lastAxis[1].y,this.lastAxis[1].z);
			console.log(this.lastAxis[2].x,this.lastAxis[2].y,this.lastAxis[2].z);
			*/
			// rotate current z, must re check after spherical
			
			// set new axis
			var a = axis(0,0,0);
			a.x = radius*Math.cos(original)*this.lastAxis[0].x;
			a.y = radius*Math.sin(original)*this.lastAxis[0].y;
			a.z = 1 * this.lastAxis[0].z;
			var _sa = a.clone();
			a.normalize();
			var b = axis(0,0,0);
			b.x = -radius*Math.sin(original) * this.lastAxis[1].x;
			b.y = radius*Math.cos(original) * this.lastAxis[1].y;
			b.z = 1 * this.lastAxis[1].z;
			var _sb = b.clone();
			b.normalize();
			var c = axis(0,0,0);
			c.x = this.lastAxis[2].x;
			c.y = this.lastAxis[2].y;
			c.z = this.lastAxis[2].z;
			var _sc = c.clone();
			
			c.normalize();
			// set location
			this.location.x += radius * Math.cos(original+absoluteAngle);
			this.location.y += radius * Math.sin(original+absoluteAngle);
			this.location.z += 0;
			//console.log(this.location.x,this.location.y,this.location.z);
			this.cursorRotation.z += original;
			this.axis.push([a,b,c]);
			this.stack.push([_sa,_sb,_sc]);
			
			return this;
		},
		StartPoint : function(a,b,c) {
			var obj = Class.create("XMath.3Devils_alpha.StartPoint", { 
				"XMath.3Devils_alpha.WebGlPrimitive" : [this],
				"XMath.3Devils_alpha.StartPoint" : [this]// copy axis stack 
				
			});
			
			this.objects.itemPush(obj);
			
			return obj;
			
		},
		Geometry : function() {
			
		},
		Cube : function(w,h,d,x,y,z,type) { // centered
			// face and backface only, just for test
			var obj = Class.create("XMath.3Devils_alpha.TestCube", {
					"XMath.3Devils_alpha.WebGlPrimitive" : [this],
					"XMath.3Devils_alpha.TestCube" : [this,w,h,d,x,y,z,type]
			});
			this.objects.itemPush(obj);
			return obj;
		},
		Remove : function(pt) {
			for(var x = 0; x < this.objects.itemAmount();x++) {
				if(this.objects.itemGetAt(x)==pt) {
					this.objects.itemSplice(x,1);
					return;
				}
			}
		}
	}
});

Class.define("XMath.3Devils_alpha.WebGlPrimitive",{
	from : ["WithEvents","WithArray","WithAlias"],
	ctor : function(scene) {
		this.context = scene.context;
		this.programAssert = false;
		this.map = {};
		var GL = this.context;
		this.program = GL.createProgram();
		
		//console.log("PRIMITIVE");
		this.loadMapping = function(GL) { // built geometry time
			if(!this.programAssert) {
				//console.log("MAPPING");
				this.map = {};
				var r = this.map;
				
				if("u" in this.targets) {
					for(var x = 0; x < this.targets.u.length;x++)
						//console.log(this.targets.aa[x]);
						r[ this.targets.u[x] ] = GL.getUniformLocation(this.program, this.targets.u[x] );
				}
				if("aa" in this.targets) {
					for(var x = 0; x < this.targets.aa.length;x++) {
						//console.log(this.targets.aa[x]);
						r[ this.targets.aa[x] ] = GL.getAttribLocation(this.program, this.targets.aa[x] );
						GL.enableVertexAttribArray( r[ this.targets.aa[x] ] );
					}
				}
				this.programAssert = true;
			}
			return this.map;
		};
		this.shaders = [];
		var createShader = function(GL,type,code) {
			var shader = GL.createShader(type);
			GL.shaderSource(shader, code);
			GL.compileShader(shader);
			var tname = {};
			tname[ GL.VERTEX_SHADER ] = "VERTEX";
			tname[ GL.FRAGMENT_SHADER ] = "FRAGMENT";
			if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
				alert("ERROR IN "+ tname[type]+" SHADER : " + GL.getShaderInfoLog(shader));
				throw "cant compile shader : " + code;
			}
			return shader;
		}
		this.loadProgram = function(GL) {
			GL.useProgram(this.program);
		};
		
		// preload textures? or let it alive?
		
		var self = this;
		this.textureLoaded = false;
		
			
		
		
		// just a test
		
		//this.texture = initTextures(); // each object call their init texture on live mode, it's texture generator job to handle identical works
		
		
	
		this.Program = function(GL,name,targets,vertex,fragment) {
			
			if(name in scene.internal["XMath.3Devils_alpha.Scene"].data.cache.programs) {
				var cache = scene.internal["XMath.3Devils_alpha.Scene"].data.cache.programs[name];
				this.targets = cache.targets;
				this.shaders = [ cache.vs, cache.fs ];
				this.program = cache.program;
				//console.log("LOADED PROGRAM FROM CACHE");
			} else {
				var vs = createShader( GL,GL.VERTEX_SHADER, vertex);
				var fs = createShader( GL, GL.FRAGMENT_SHADER, fragment);
				this.targets = targets;
				this.shaders = [ vs, fs ];	
				var cache = scene.internal["XMath.3Devils_alpha.Scene"].data.cache.programs[name] = {
					targets : targets,
					vs : vs,
					fs : fs,
					program : GL.createProgram()
				}
				this.program = cache.program;
				
				GL.attachShader(this.program, this.shaders[0]);
				GL.attachShader(this.program, this.shaders[1]);
				
				GL.linkProgram(this.program);
				GL.validateProgram(this.program);
				if( GL.isContextLost() ) {
					throw "context was lost";
				}
				if ( !GL.getProgramParameter( this.program, GL.LINK_STATUS) ) {
					var info = GL.getProgramInfoLog(this.program);
					throw "LINK Could not compile WebGL program. \n\n" + info;
				}
			}
			
			
		}
		
		
		
		/*
		this.position = Class.creae("XMath.V3");
		this.rotation = Class.creae("XMath.V3");
		this.scale = Class.creae("XMath.V3");
		
		this.render = function(GL,vars) {
			itemMap(function(k,v) {
				v.render(GL,vars);
			});
		};
		*/
		
	},
	proto : {
		
	}
});

Class.define("XMath.3Devils_alpha.Concept",{ // still to think about
	from : [ "XMath.3Devils_alpha.WebGlPrimitive"],
	ctor : function(scene,vs,fs) {
		if(vs) {
			var i = this.internal["XMath.3Devils_alpha.Concept"].data = {};
			var scene_global = scene.internal["XMath.3Devils_alpha.Scene"].data.global;
			this.Program(GL
				,"default"
				,{
					u : [
						"Matrix0",
						"CamRange","CamAt","CamScale","CamPointer",
						"CamRotationM4","CamRotationV3",
						"ObjRotation","ObjTranslation","ObjScale",
						"uSampler","tex_options"
					]
					, aa : [
						"pt",
						"n_pt",
						"color",
						"tex_pt"
					]
				}
				,scene_global[vs]
				,scene_global[fs]
			);
		} else {
			// coding time
			var i = this.internal["XMath.3Devils_alpha.Concept"].data = {};
			i.vars = {
				u : {},
				aa : {},
				v : {}
			};
			i.code = {
				vs : {
					head : [],
					body : []
				},
				fs : {
					head : [],
					body : []
				}
			};
		}
	},
	proto : {
		pushProgram : function(name,debug) {
			var i = this.internal["XMath.3Devils_alpha.Concept"].data;
			
			for( var u in i.vars.u ) {
				if( i.vars.u[u].vs ) {
					i.code.vs.head.push( "uniform " + i.vars.u[u].type + " " + i.vars.u[u].name + ";\r\n" );
				}
				if( i.vars.u[u].fs ) {
					i.code.fs.head.push( "uniform " + i.vars.u[u].type + " " + i.vars.u[u].name + ";\r\n" );
				}
			}
			
			for( var aa in i.vars.aa ) {
				if( i.vars.aa[aa].vs ) {
					i.code.vs.head.push( "attribute " + i.vars.aa[aa].type + " " + i.vars.aa[aa].name + ";\r\n" );
				}
				if( i.vars.aa[aa].fs ) {
					i.code.fs.head.push( "attribute " + i.vars.aa[aa].type + " " + i.vars.aa[aa].name + ";\r\n" );
				}
			}
			
			for( var v in i.vars.v )  {
				i.code.vs.head.push(
					"varying " + i.vars.v[v].type + " " + i.vars.v[v].name + ";\r\n"
				);
				i.code.fs.head.push(
					"varying " + i.vars.v[v].type + " " + i.vars.v[v].name + ";\r\n"
				);
			}
				
			if(debug) {
				
				var vs = i.code.vs.head.join("") + i.code.vs.body.join("");
				var fs = i.code.fs.head.join("") + i.code.fs.body.join("");
				console.log(vs);
				console.log(fs);
				this.Program(GL,name,{
					u : this.uniforms,
					a : this.attributes
				},vs,fs);
				
			} else {
				this.Program(GL,name,{
					u : i.vars.u,
					a : i.vars.aa
				},i.code.vs.head.join("") + i.code.vs.body.join(""),i.code.fs.head.join("") + i.code.fs.body.join(""));
			}
			
			
			
			
			i.proto.v3 = {
				vset : function(_source,_destiny) {
					i.code.vs.body.push( _source + " = " + _destiny);
				}
			};
			var self = this;
			function set_v3(v) {
				// set events on each function
				v.on("shader",function(name,args) {
					if(name in i.proto.v3) {
						i.proto.v3[name].apply(self,args);
					}
				});
			}
			
			this.uniform = function(name,type) {
				var i = this.internal["XMath.3Devils_alpha.Concept"].data;
					
				var types = ["vec2","vec3","vec4","mat4"];
				if(types.indexOf(type)!=-1) {
					if( type == "vec3") {
						i.vars.u.push( name );
						var v3 = Class.create("XMath.V3",{"XMath.V3" : [0,0,0]});
						set_v3(v3);
						return v3;
					}
				}
				// return correct type that will log
			}
			this.varying = function(name,type) {
				var i = this.internal["XMath.3Devils_alpha.Concept"].data
				var types = ["vec2","vec3","vec4","mat4"];
				if(types.indexOf(type)!=-1) {
					if( type == "vec3") {
						i.vars.v.push( name );
						var v3 = Class.create("XMath.V3",{"XMath.V3" : [0,0,0]});
						set_v3(v3);
						return v3;
						
					}
				}
			}
			this.attribute = function(name, type) {
				var i = this.internal["XMath.3Devils_alpha.Concept"].data
				var types = ["vec2","vec3","vec4","mat4"];
				if(types.indexOf(type)!=-1) {
					if( type == "vec3") {
						i.vars.aa.push( name );
						var v3 = Class.create("XMath.V3",{"XMath.V3" : [0,0,0]});
						set_v3(v3);
						return v3;
					}
				}
			}
		
		},
		clearProgram : function() {
			var i = this.internal["XMath.3Devils_alpha.Concept"].data;
			i.vars = {
				u : [],
				aa : [],
				v : []
			};
			i.code = {
				vs : {
					head : [],
					body : []
				},
				fs : {
					head : [],
					body : []
				}
			};
			// GC?
		},
		
		fs_temporary : function(name,type) {
			["float","int","bool","vec2","vec3","vec4","mat4"]
		},
		vs_temporary : function(name,type) {
			["float","int","bool","vec2","vec3","vec4","mat4"]
		},
		fs_conditional : function(code,ok,fail) {
			var i = this.internal["XMath.3Devils_alpha.Concept"].data
			if(ok && fail) {
				i.code.vs.body.push("if(" + code + "){\r\n")
				ok.apply(this,[]);
				i.code.vs.body.push("} else {\r\n");	
				fail.apply(this,[]);
				i.code.vs.body.push("}\r\n");
			} else if(ok) {
				i.code.vs.body.push("if(" + code + "){\r\n")
				ok.apply(this,[]);
				i.code.vs.body.push("}\r\n");	
			}
		},
		vs_conditional : function(code,ok,fail) { // will run on main
			var i = this.internal["XMath.3Devils_alpha.Concept"].data
			if(ok && fail) {
				i.code.vs.body.push("if(" + code + "){\r\n")
				ok.apply(this,[]);
				i.code.vs.body.push("} else {\r\n");	
				fail.apply(this,[]);
				i.code.vs.body.push("}\r\n");
			} else if(ok) {
				i.code.vs.body.push("if(" + code + "){\r\n")
				ok.apply(this,[]);
				i.code.vs.body.push("}\r\n");	
			}
		},
		vs_statement : function(code) { // will run on main
			i.code.vs.body.push(code+"\r\n");
		},
		fs_statement : function(code) {
			i.code.fs.body.push(code+"\r\n");
		},
		bind : function(map,type,name,priority,size,count,callback) {
			
			if(map[name + "Array"]==null) {
				
				if(type == GL.ELEMENT_ARRAY_BUFFER) {
					map[name + "Array"] = new Uint16Array( size*count );
				} else if(type == GL.ARRAY_BUFFER) {
					map[name + "Array"] = new Float32Array( size*count );	
					if((name+"ArrayOffset") in i.current.offset) {
						map[name + "ArrayOffset"] = i.current.offset[name + "ArrayOffset"];
					} else {
						map[name + "ArrayOffset"] = new Float32Array( size * count );
					}
					i.current.offset[name + "ArrayOffset"] = map[name + "ArrayOffset"];
				} else {
					console.log(type);
					throw "not implemented";
				}
				map[name + "Buffer"] = GL.createBuffer();
				map[name + "Buffer"].itemSize = size;
				map[name + "Buffer"].numItems = count;
				
				callback&&callback(map[name+"Array"],map[name+"ArrayOffset"]);
				
				GL.bindBuffer(type, map[name + "Buffer"]);
				GL.bufferData(type, map[name + "Array"], priority);
				
				this[name + "Buffer"] = map[name + "Buffer"];
				this[name + "Array"] = map[name + "Array"];
			} else {
				
				GL.bindBuffer(type, map[name + "Buffer"]);
				GL.bufferData(type, map[name + "Array"], priority);
				
				this[name + "Buffer"] = map[name + "Buffer"];
				this[name + "Array"] = map[name + "Array"];
			}
		},
		setBuilder : function(build_callback) {
			
			/*
			
				build callback sample
				
				
				geometry.setBuilder(function(context,scene,map) {
					// type:
					//    GL.ARRAY_BUFFER (direct packet)
					//    GL.ELEMENT_ARRAY_BUFFER (indexed packet)
					//    GL.ARRAY_BUFFER_BINDING
					//    GL.ELEMENT_ARRAY_BUFFER_BINDING
					// name:
					//    any string
					// priority
					//    GL.STATIC_DRAW
					//    GL.DYNAMIC_DRAW
					//    GL.STREAM_DRAW
					// size:
					//    int (in general, 3 from vec3, 4 from vec4), just for counting purposes
					// count:
					//    number of elements with 'size'
					// callback:
					//    the drawer function
					
					// this is the geometry, warranty, or nothing
					
					
					// defined by ,type                  ,name    ,priority       ,size ,count  ,callback
					this.bind(map,GL.ELEMENT_ARRAY_BUFFER,"index" ,GL.STATIC_DRAW ,3    ,steps  ,function(buf) {
						
						buf[0] = 0; // first 3 components
						buf[1] = 1;
						buf[2] = steps;
						for(var x = 1; x < steps;x++) {
							buf[3*x+0] = 0; // first 3 components
							buf[3*x+1] = x;
							buf[3*x+2] = x+1;
						}
					});
				});
			*/
			
			var i = this.internal["XMath.3Devils_alpha.Geometry"].data;
			if( Object.prototype.toString.apply(build_callback) == "[object Function]" ) {
				i.build_callback = build_callback;
			} else {
				throw "must be a build callback.";
			}
		},
		build : function(context, scene) { // this is constrained with Scene.build
		
			var create_or_load_map = function(scene) {
				var c = 1;
				var geom_name = "" +  c + "_" + i.current.version;
				var debug_str = "" +  c + "_" + i.current.version;
				
				i.history.push(geom_name);
				var j = scene.internal["XMath.3Devils_alpha.Scene"].data.cache;
				
				j.object_count += 1;
				var loaded = false;
				var init = false;
				if(!(geom_name in j.objects)) {
					//console.log(j.object_count,geom_name);
					console.log(debug_str);
					
					j.objects[geom_name] = {
						name : geom_name,
						loaded : false,
						pending : [self]
					};
					i.buffer_packets += 1;
					loaded = false;
					init = false;
					
				} else {
					if( j.objects[geom_name].loaded ) {
						loaded = true;
						init = true;
						
					} else {
						loaded = false;
						init = true;
						//pending request
						j.objects[geom_name].pending.push(self);
					}
				}
				//console.log("<<",i.buffer_packets);
				return {
					init : init,
					name : geom_name,
					loaded : loaded,
					map : j.objects[geom_name]
				}
			}
			
			var map_result = create_or_load_map(scene);
			if(!map_result.loaded && !map_result.init) {
				var check = false;
				check = i.build_callback.apply(this,[context,scene]); // ## GEOMETRY CALLBACK ##
				if(Object.prototype.toString.apply(check) == "[object Boolean]")  {
					map.loaded = check;
					return check;
				}
			}
			return false;
		},
		setRender : function() {
			var i = this.internal["XMath.3Devils_alpha.Concept"].data;
			if( Object.prototype.toString.apply(render_callback) == "[object Function]" ) {
				i.render_callback = render_callback;
			} else {
				throw "must be a build callback.";
			}
		},
		render : function(context, vars, scene) {
			i.render_callback.apply(this,[context,vars,scene]);
		}
	}
});


Class.define("XMath.3Devils_alpha.Face",{
	from : [ "XMath.3Devils_alpha.Concept" ],
	ctor : function(block_options,instance_options) {
		/*
			SETUP0:
				block_options {
					face-name
					size
				},
				instance_options {
					location : [x,y,z]
					rotation : [ [0,0,0] ]
				}
		*/
		
		// push instance to geometry seek with : dots, edges and faces
		
		
		
		
		
		
		
		this.setBuilder(function() {
			
		});
		this.setRender(function() {
			
		});
		// set program
	},
	proto : {
		
	}
})

Class.define("XMath.3Devils_alpha.Material",{ // magnetic(require skeleton), gas, liquid, solid, optic, sand-plastic-glass

});
Class.define("XMath.3Devils_alpha.BearRing", { // may be with axis
	
});
Class.define("XMath.3Devils_alpha.Bolt", {
	
});
Class.define("XMath.3Devils_alpha.ClickLock", {
	
});
Class.define("XMath.3Devils_alpha.Display", {
		
});
Class.define("XMath.3Devils_alpha.GearWheel", {
	
});
Class.define("XMath.3Devils_alpha.Hidraulic", { // this must have power supply
	
});
Class.define("XMath.3Devils_alpha.WheelWings", {
	
});
Class.define("XMath.3Devils_alpha.Spring", { // may be hidraulic

});
Class.define("XMath.3Devils_alpha.Transistor", { // may be hidraulic

});
Class.define("XMath.3Devils_alpha.ExplosiveGas", { // may be hidraulic

});
Class.define("XMath.3Devils_alpha.Valve", { // may be hidraulic

});
Class.define("XMath.3Devils_alpha.MockEngine", { // this must have power supply

});

Class.define("XMath.3Devils_alpha.StartPoint", {
	from : ["XMath.3Devils_alpha.WebGlPrimitive"]
	, ctor : function(scene) {
		var self = this;
		var i = this.internal["XMath.3Devils_alpha.StartPoint"].data = {};
		i.current = {
			texture0_loaded : false,
			texture0_is_loaded : function() {
				return this.texture0_loaded;
			},
			texture0_set : function() {
				this.texture0_loaded = true;
			}
		};
		
		
		i.map = {
			
		};
		
		i.current.version = 1;
		i.current.color_dword = 0;
		i.current.color = Class.create("XMath.V4",{ "XMath.V4" : [ "Float32Array", 0,0,1.0,1.0 ] });
		i.current.size = 0.05;
		i.current.sides = 100;
		i.current.pts = 1;
		i.current.triangles = 0;
		
		i.current.width = 1;
		i.current.height = 1;
		i.current.fixed = false;
		i.current.offset = {};
		i.current.angleOffsetX = 0;
		i.current.angleOffsetZ = 0;
		i.current.angleOffsetY = 0;
		
		i.current.texture0_name = "";
		i.current.texture0_buffer = null;
		
		Object.defineProperty(this,"offsetArray",{ get : function() { return i.current.offset; } });
		
		i.shape = {};
		i.shape.points = [];
		i.shape.index = [];
		i.shape.mode = "y-width-1face";
		
		i.scene = scene;
		i.enabled = true;
		i.buffer_packets = 0;
		i.history = [];
		
		// i.mapcache = {};
		// 
		
		var create_or_load_map = function(scene) {
			var geom_name = "" +  i.current.color_dword + "//" 
				+ i.current.size + "//" 
				+ i.current.sides + "//" 
				+ i.current.angleOffsetZ + "//" 
				+ i.current.angleOffsetX + "//" 
				+ i.current.angleOffsetY + "//" 
				+ i.shape.points.length + "//"
				+ i.current.version;
			var debug_str = "color:" +  i.current.color_dword + "\r\n" 
				+ "size:" + i.current.size + "//" 
				+ "sides:" + i.current.sides + "//" 
				+ "aoZ:" + i.current.angleOffsetZ + "//" 
				+ "aoX:" + i.current.angleOffsetX + "//" 
				+ "aoY:" + i.current.angleOffsetY + "//" 
				+ "pts:" + i.shape.points.length + "//"
				+ "ver:" + i.current.version;
			
				
			i.history.push(geom_name);
			var j = scene.internal["XMath.3Devils_alpha.Scene"].data.cache;
			
			j.object_count += 1;
			var loaded = false;
			var init = false;
			if(!(geom_name in j.objects)) {
				//console.log(j.object_count,geom_name);
				console.log(debug_str);
				
				j.objects[geom_name] = {
					name : geom_name,
					geometryBuffer : null,
					geometryArray : null,
					normalBuffer : null,
					normalArray : null,
					indexBuffer : null,
					indexArray : null,
					colorBuffer : null,
					colorArray : null,
					loaded : false,
					pending : [self]
				};
				i.buffer_packets += 1;
				loaded = false;
				init = false;
				
			} else {
				if( j.objects[geom_name].loaded ) {
					loaded = true;
					init = true;
					
				} else {
					loaded = false;
					init = true;
					//pending request
					j.objects[geom_name].pending.push(self);
				}
			}
			//console.log("<<",i.buffer_packets);
			return {
				init : init,
				name : geom_name,
				loaded : loaded,
				map : j.objects[geom_name]
			}
		}
		
		var GL = scene.context;
		
		
		Object.defineProperty(this,"enabled",{ get : function() { return i.enabled; } });
		
		// scene.location is start point
		var V3 = function(a,b,c) { return Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]}); };
		var _location = V3(scene.location.x,scene.location.y,scene.location.z);
		
		i.shape.points.push( _location.clone() );
		
		Object.defineProperty(this,"location",{ get : function() { return _location; } });
		Object.defineProperty(this,"x",{
			get : function() { return _location.x; }, 
			set : function(val) {
				_location.x = val;
			}
		});
		Object.defineProperty(this,"y",{ 
			get : function() { return _location.y; }, 
			set : function(val) {
				_location.y = val;
			}
		});
		
		Object.defineProperty(this,"z",{ 
			get : function() { return _location.z; },
			set : function(val) {
				this.location.z = val;
			}
		});
		
		// self rotation has an order
		var _rotation = [];
		Object.defineProperty(this,"rotation",{ get : function() { return _rotation; } });
		
		
		
				
		var axis = function(a,b,c) { 
			return Class.create("XMath.Axis",{ 
					"XMath.V3" : [ "Float32Array" ]
					, "XMath.Axis" : [ a,b,c ]
				}
			); 
		};

		this.axis = [ 
			[axis(1,0,0),axis(0,1,0),axis(0,0,1)]
		]; // stack of the drawing program
		
		
		
		// 2d
		// start by point (a circle), close each step
		// go to line, (a rectangle)
		// then triangle
		// then 2 triangle or 3 triangles, based on angle
		// tesselate the rest
		// 3d proto
		
		this.type = "triangle";
		// how to mutate from one class to another?
		
		var V3 = function(a,b,c) { return Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]}); };
		var M4 = function() { return Class.create("XMath.M4",{ "XMath.M4" : [ "Float32Array" ] } ); };
		
		this.count = 1;
		
		//var color = [0,0,1,1];
		//this.colors = new Float32Array(16);
		//for(var y = 0; y < 3;y++) for(var x = 0; x < 4;x++) this.colors[y*4+x] = color[x];
		
		
			
		
		var steps = i.current.sides;
		this.build = function(GL,scene) {
			
			// find for a name of identical geometry
			var map_result = create_or_load_map(scene);
			
			if(!map_result.loaded && !map_result.init) {
				console.log("NOT CACHED");
				
				if(this.count==1) {
					steps = i.current.sides;
					var map = map_result.map;
					// if number of points is 1
					i.current.map = map;
					var radius = i.current.size;
					//console.log("@",this.x,this.y,this.z);
					
					
					var map_bind = function(render_context, map,type,name,priority,size,count,callback) {
						if(map[name + "Array"]==null) {
							
							if(type == GL.ELEMENT_ARRAY_BUFFER) {
								map[name + "Array"] = new Uint16Array( size*count );
							} else if(type == GL.ARRAY_BUFFER) {
								map[name + "Array"] = new Float32Array( size*count );	
								if((name+"ArrayOffset") in i.current.offset) {
									map[name + "ArrayOffset"] = i.current.offset[name + "ArrayOffset"];
								} else {
									map[name + "ArrayOffset"] = new Float32Array( size * count );
								}
								i.current.offset[name + "ArrayOffset"] = map[name + "ArrayOffset"];
							} else {
								console.log(type);
								throw "not implemented";
							}
							map[name + "Buffer"] = GL.createBuffer();
							map[name + "Buffer"].itemSize = size;
							map[name + "Buffer"].numItems = count;
							
							callback&&callback(map[name+"Array"],map[name+"ArrayOffset"]);
							
							GL.bindBuffer(type, map[name + "Buffer"]);
							GL.bufferData(type, map[name + "Array"], priority);
							
							render_context[name + "Buffer"] = map[name + "Buffer"];
							render_context[name + "Array"] = map[name + "Array"];
						} else {
							
							GL.bindBuffer(type, map[name + "Buffer"]);
							GL.bufferData(type, map[name + "Array"], priority);
							
							render_context[name + "Buffer"] = map[name + "Buffer"];
							render_context[name + "Array"] = map[name + "Array"];
						}
					}
					
					if(steps==4) {
						
					} else {
						
					}
					map_bind(this, map, GL.ARRAY_BUFFER,"pt",GL.STATIC_DRAW,3,1+steps,function(buf,offset) { // central point + steps points
						console.log("start",self.x,self.y,self.x,steps)
						buf[0] = 0 + offset[0];
						buf[1] = 0 + offset[1];
						buf[2] = 0 + offset[2];
						for(var y = 1; y < steps+1;y++) {
							var a = radius*Math.sin( y*2*Math.PI/steps + scene.cursorRotation.z + i.current.angleOffsetZ);
							var b = radius*Math.cos( y*2*Math.PI/steps + scene.cursorRotation.z + i.current.angleOffsetZ);
							var signal = b > 0 ? true : false;
							buf[3*y+0] = a + offset[3*y+0] ;
							buf[3*y+1] = b * Math.cos( i.current.angleOffsetX) + offset[3*y+1];
							buf[3*y+2] = radius * Math.sin( signal ? i.current.angleOffsetX : -i.current.angleOffsetX) + offset[3*y+2];
							// rot z then rot x, why not working?
						}
					});
					
					map_bind(this,map, GL.ARRAY_BUFFER,"n_pt",GL.STATIC_DRAW,3,1+steps,function(buf) { // central point + step points
						for(var y = 0; y < steps+1;y++) {
							buf[3*y+0] = 0;
							buf[3*y+1] = Math.sin( i.current.angleOffsetX );
							buf[3*y+2] = -Math.cos( i.current.angleOffsetX );
						}
						
					});
					map_bind(this,map, GL.ARRAY_BUFFER,"tex_pt",GL.STATIC_DRAW,2,1+steps,function(buf) {
						buf[0] = 0.5;
						buf[1] = 0.5;
						var last = 0;
						var a_step = 2*Math.PI/steps;
						for(var y = 1; y < 1+steps;y++) {
							buf[2*y+0] = 0.5 + Math.cos( (y-1)*a_step + i.current.angleOffsetZ + a_step + Math.PI/2 - Math.PI)/2;
							buf[2*y+1] = 0.5 + Math.sin( (y-1)*a_step + i.current.angleOffsetZ + a_step + Math.PI/2- Math.PI)/2;
						}
					});
					
					map_bind(this,map,GL.ARRAY_BUFFER,"color",GL.STATIC_DRAW,4,1+steps,function(buf) { // central point + step points
						for(var y = 0; y < steps+1;y++) {
							buf[4*y+0] = i.current.color.cr;
							buf[4*y+1] = i.current.color.cg;
							buf[4*y+2] = i.current.color.cb;
							buf[4*y+3] = i.current.color.ca;
						}
					});
					
					
					map_bind(this,map,GL.ELEMENT_ARRAY_BUFFER,"index",GL.STATIC_DRAW,3,steps,function(buf) { //  tricky cause are triangles
						buf[0] = 0; // first 3 components
						buf[1] = 1;
						buf[2] = steps;
						for(var x = 1; x < steps;x++) {
							buf[3*x+0] = 0; // first 3 components
							buf[3*x+1] = x;
							buf[3*x+2] = x+1;
						}
					});
					
					map_bind(this,map,GL.ELEMENT_ARRAY_BUFFER,"wireframe",GL.STATIC_DRAW,2,3*steps,function(buf) {
						function set(x,buf) {
							buf[6*x+0] = 0;
							buf[6*x+1] = x;
							
							buf[6*x+2] = x;
							buf[6*x+3] = x+1;
							
							buf[6*x+4] = 0;
							buf[6*x+5] = x;
						}
						
						buf[0] = 0;
						buf[1] = 1;
						
						buf[2] = 1;
						buf[3] = steps;
						
						buf[4] = 0;
						buf[5] = steps;
						
						for(var x = 1; x < steps;x++) {
							set(x,buf);
						}
					});
					
					this.raytrace = map.raytrace = function(mouse) {
						// radius 
						// mouse.left 
						// this.ptArray[0]
						// this.ptArray[1]
						// this.ptArray[2]
						
						
						// verify if is inside any triangle
						
						if( steps > 0) {
							for(var _x = 0; _x < steps;_x++) {
								
								var t = [];
								
								
								var x0 = self.ptArray[ 3*self.indexArray[ 3*_x + 0 ] ];
								var y0 = self.ptArray[ 3*self.indexArray[ 3*_x + 0 ] ];
								
								var x1 = self.ptArray[ 3*self.indexArray[ 3*_x + 1 ] + 1 ];
								var y1 = self.ptArray[ 3*self.indexArray[ 3*_x + 1 ] + 1 ];
								
								var x2 = self.ptArray[ 3*self.indexArray[ 3*_x + 2 ] + 2 ];
								var y2 = self.ptArray[ 3*self.indexArray[ 3*_x + 2 ] + 2 ];
								
								console.log(
									
									this.indexArray.length,this.ptArray.length,
									
									"mouse"
									,mouse.left.toPrecision(2)
									,mouse.top.toPrecision(2)
									,"raytrace"
									,x0.toPrecision(2)
									,y0.toPrecision(2)
									,x1.toPrecision(2)
									,y1.toPrecision(2)
									,x2.toPrecision(2)
									,y2.toPrecision(2)
								);
								if( mouse.top  < (y1-y0)/(x1-x0)*(mouse.left+x0) - y0 ) { // 2d map
									// get normal direction
									var invtan = -(x1-x0)/(y1-y0);
									t.push(invtan);
								}
								if( mouse.top < (y2-y1)/(x2-x1)*(mouse.left+x1) - y1) {
									// get normal
									var invtan = -(x2-x1)/(y2-y1);
									t.push(invtan);
								}
								// if we have 2 normals not inverted signal, then it hits
								if( t.length > 1 && t[0]*t[1] > 0) {
									return true;
								}
								if( mouse.top < (y0-y2)/(x0-x2)*(mouse.left+x2) + y2) {
									// get normal
									var invtan = -(x0-x2)/(y0-y2);
									t.push(invtan);
								}
								if(t.length >1 && t[0]*t[1] > 0) {
									return true;
								}
							}
						}
						// if we have 2 normals not inverted signal, then it hits
						
						// do not hit any else.
						return false;
					}
					
					
					map.loaded = true;
					
					console.log("BUILD COMPLETE : POINT", map_result.name);
					
					// call scene to distribute build on this map
					//scene.objectUpdate( map_result.name );
					
					
					this.built = true;
					
					return true;
				} else if(this.count==2) {
					
					steps = i.current.sides;
					steps = 0;
					// not used yet
					
					var map = map_result.map;
					i.current.map = map;
					var lineWidth = i.current.size;
					this.raytrace = map.raytrace = function(mouse) {
					}
					
					var map_bind = function(render_context, map,type,name,priority,size,count,callback) {
						if(map[name + "Array"]==null) {
							
							if(type == GL.ELEMENT_ARRAY_BUFFER) {
								map[name + "Array"] = new Uint16Array( size*count );
							} else if(type == GL.ARRAY_BUFFER) {
								map[name + "Array"] = new Float32Array( size*count );	
								if((name+"ArrayOffset") in i.current.offset) {
									map[name + "ArrayOffset"] = i.current.offset[name + "ArrayOffset"];
								} else {
									map[name + "ArrayOffset"] = new Float32Array( size * count );
								}
								i.current.offset[name + "ArrayOffset"] = map[name + "ArrayOffset"];
							} else {
								console.log(type);
								throw "not implemented";
							}
							map[name + "Buffer"] = GL.createBuffer();
							map[name + "Buffer"].itemSize = size;
							map[name + "Buffer"].numItems = count;
							
							callback&&callback(map[name+"Array"],map[name+"ArrayOffset"]);
							
							GL.bindBuffer(type, map[name + "Buffer"]);
							GL.bufferData(type, map[name + "Array"], priority);
							
							render_context[name + "Buffer"] = map[name + "Buffer"];
							render_context[name + "Array"] = map[name + "Array"];
						} else {
							
							GL.bindBuffer(type, map[name + "Buffer"]);
							GL.bufferData(type, map[name + "Array"], priority);
							
							render_context[name + "Buffer"] = map[name + "Buffer"];
							render_context[name + "Array"] = map[name + "Array"];
						}
					}
					// draw streched cube
					// 8 points
					
			
					//i.shape.points.push(_location);			
					
					var a = i.shape.points[0];
					var b = i.shape.points[1];
					var c = [b.x-a.x,b.y-a.y,b.z-a.z];
					console.log("LINE:" + a.toString() + "//" + b.toString() );
					
					// the two points that connects the drawing
					map_bind( this, map, GL.ARRAY_BUFFER, "pt", GL.STATIC_DRAW, 3,4, function(buf,offset) { 
						
						
						
						var mode = i.shape.mode;
						i.current.angleOffsetZ
						
						if(mode=="x-width-1face") { // bottom to top
							var ysign = c[1] >= 0 ? 1 : -1;
							var zsign = c[2] >= 0 ? 1 : -1;
							
							
							// top left
							buf[0] = -lineWidth + c[0]; // delta x makes shearing
							buf[1] = ysign*c[1]/2;
							buf[2] = zsign*c[2]/2;
							
							// top right
							buf[3] = lineWidth + c[0]; // delta x makes shearing
							buf[4] = ysign*c[1]/2;
							buf[5] = zsign*c[2]/2;
							
							// bottom_left
							buf[6] = -lineWidth;
							buf[7] = -ysign*c[1]/2;
							buf[8] = -zsign*c[2]/2;
							
							// bottom right
							buf[9] = lineWidth;
							buf[10] = -ysign*c[1]/2;
							buf[11] = -zsign*c[2]/2;
							
						} else if(mode == "y-width-1face") { // left to right
							var xsign = c[0] >= 0 ? 1 : -1;
							var zsign = c[2] >= 0 ? 1 : -1;
							
							
							// if line start in origin, then rotation will be hard,
							// if line is centered then drawing runtime is hard
							// pick a choice
							
							
							//Math.sin( angleOffsetX );
							var m = M4();
							m.I();
							m.rotate(i.current.angleOffsetX,[1,0,0]);
							
							// top left
							var tl = V3( -xsign*c[0]/2, lineWidth, -zsign*c[2]/2 ).vmul(m);
							console.log(tl.toString());
							buf[0] = tl.x;
							buf[1] = tl.y;
							buf[2] = tl.z;
							
							// top right
							var tr = V3( xsign*c[0]/2, lineWidth + c[1], zsign*c[2]/2 ).vmul(m);
							console.log(tr.toString());
							buf[3] = tr.x;
							buf[4] = tr.y; // delta y makes shearing
							buf[5] = tr.z;
							
							// bottom left
							var bl = V3(-xsign*c[0]/2,-lineWidth,-zsign*c[2]/2).vmul(m);
							console.log(bl.toString());
							buf[6] = bl.x;
							buf[7] = bl.y;
							buf[8] = bl.z;
							
							// bottom right
							var br = V3(xsign*c[0]/2,-lineWidth + c[1],zsign*c[2]/2).vmul(m);
							console.log(br.toString());
							buf[9] = br.x;
							buf[10] = br.y; // delta y makes shearing
							buf[11] = br.z;
							
							
						} else if(mode == "z-width-1face") { // back to front
							
							var xsign = c[0] >= 0 ? 1 : -1;
							var ysign = c[1] >= 0 ? 1 : -1;
							
							// top left
							buf[0] = -xsign*c[0]/2;
							buf[1] = ysign*c[1]/2;
							buf[2] = lineWidth+c[2]; // delta z makes shearing
							
							// top right
							buf[3] = xsign*c[0]/2;
							buf[4] = ysign*c[1]/2;
							buf[5] = lineWidth+c[2]; // delta z makes shearing
							
							// bottom left
							buf[6] = -xsign*c[0]/2;
							buf[7] = -ysign*c[1]/2;
							buf[8] = -lineWidth;
							
							// bottom right
							buf[9] = xsign*c[0]/2;
							buf[10] = -ysign*c[1]/2;
							buf[11] = -lineWidth;
							
						} else {
							throw "not implemented yet.";
						}
						
					});
					map_bind( this, map, GL.ARRAY_BUFFER, "n_pt", GL.STATIC_DRAW, 3,4, function(buf, offset)  {
						// calculate 1 face normal then apply to all points
						console.log("lineWidth:"+lineWidth+"");
						var p0 = V3( map["ptArray"][0], map["ptArray"][1], map["ptArray"][2] );
						var p1 = V3( map["ptArray"][3], map["ptArray"][4], map["ptArray"][5] );
						console.log("normal A:"+p0.toString()+"");
						console.log("normal B:"+p1.toString()+"");
						p1.vsub(p0);
						var p2 = V3( map["ptArray"][9], map["ptArray"][10], map["ptArray"][11] );
						console.log("normal C:"+p2.toString()+"");
						
						
						
						p2.vsub(p0);
						var p3 = p1.cross(p2);
						console.log("normal p1:"+p1.toString()+"");
						console.log("normal p2:"+p2.toString()+"");
						console.log("normal p3:"+p3.toString()+"");
						p3.normalize();
						for(var x = 0; x < 4;x++) {
							buf[3*x+0] = p3.x;
							buf[3*x+1] = p3.y;
							buf[3*x+2] = p3.z;
						}
						console.log("normal:"+p3.toString()+"");
					});
					map_bind( this, map, GL.ARRAY_BUFFER, "tex_pt", GL.STATIC_DRAW, 2,4, function(buf, offset) { 
						// this texture demands 2 batches cause it can't map circle and squares, they are in different axis
						buf[0] = 0;
						buf[1] = 0;
						buf[0] = 1;
						buf[1] = 0;
						buf[0] = 0;
						buf[1] = 1;
						buf[0] = 1;
						buf[1] = 1;
					});
					
					map_bind( this, map, GL.ARRAY_BUFFER, "color", GL.STATIC_DRAW, 4,4, function(buf, offset) {
						for(var y = 0; y < 4;y++) {
							buf[4*y+0] = i.current.color.cr;
							buf[4*y+1] = i.current.color.cg;
							buf[4*y+2] = i.current.color.cb;
							buf[4*y+3] = i.current.color.ca;
						}
					});
					
					map_bind( this, map, GL.ELEMENT_ARRAY_BUFFER, "index", GL.STATIC_DRAW, 3,2, function(buf, offset) {
						// 12 triangles, 2 triangles for each of 6 square faces
						
						//CW
						buf[0] = 0;
						buf[1] = 2;
						buf[2] = 1;
						
						buf[3] = 1;
						buf[4] = 3;
						buf[5] = 2;
					});
					map_bind( this,map, GL.ELEMENT_ARRAY_BUFFER, "wireframe", GL.STATIC_DRAW, 2, 5, function(buf) {
						buf[0] = 0;
						buf[1] = 1;
						buf[2] = 1;
						buf[3] = 2;
						buf[4] = 0;
						buf[5] = 2;
						buf[6] = 1;
						buf[7] = 3;
						buf[8] = 2;
						buf[9] = 3;
					});
					
					// clear previous points
					map.loaded = true;
					console.log("BUILD COMPLETE : LINE", map_result.name);
					this.built = true;
					return true;
				} else if(this.count==3) {
					throw "not implemented";
				} else {
					throw "not implemented";
				}
			} else if( map_result.init && map_result.loaded ) {
				
				
				// if not changed anything then just need to do it once
				
				
				var map = i.current.map = map_result.map;
				// load cached buffers and arrays
				
				var map_bind2 = function(render_context, map,type,name,priority) {
					GL.bindBuffer(type, map[name + "Buffer"]);
					GL.bufferData(type, map[name + "Array"], priority);
					
					render_context[name + "Buffer"] = map[name + "Buffer"];
					render_context[name + "Array"] = map[name + "Array"];
				}
				map_bind2(this, map, GL.ARRAY_BUFFER,"pt",GL.STATIC_DRAW);
				map_bind2(this,map, GL.ARRAY_BUFFER,"n_pt",GL.STATIC_DRAW);
				map_bind2(this,map, GL.ARRAY_BUFFER,"tex_pt",GL.STATIC_DRAW);
				map_bind2(this,map,GL.ARRAY_BUFFER,"color",GL.STATIC_DRAW);
				map_bind2(this,map,GL.ELEMENT_ARRAY_BUFFER,"index",GL.STATIC_DRAW);
				map_bind2(this,map,GL.ELEMENT_ARRAY_BUFFER,"wireframe",GL.STATIC_DRAW);
				
				this.raytrace = map.raytrace;
				//this.built = true;
				
				return true;
			} else {
				return false;
			}
		}
		
		this.render = function(GL,vars,scene) {
			
			
			// <uniforms>
			
			
			
			var _mock = M4();
			_mock.I();
			GL.uniformMatrix4fv(vars.Matrix0, false, _mock.data);
			
			
			
			// <camera>
			GL.uniform3f(vars.CamScale, 
				1.0,
				1.0,
				1.0
			);
			
			
		
			var _camRotationM4 = M4(); // last matrix (starts with 0), after calc, release not last
			_camRotationM4.I();
			
			for(var x = 0; x < scene.camera.rotation.length;x++) {
				if(scene.camera.rotation[x].y == 0 && scene.camera.rotation[x].z == 0) {
					_camRotationM4.rotate( scene.camera.rotation[x].x,[1,0,0]);
				} else if(scene.camera.rotation[x].x == 0 && scene.camera.rotation[x].z == 0) {
					_camRotationM4.rotate( scene.camera.rotation[x].y,[0,1,0]);
				} else if(scene.camera.rotation[x].x == 0 && scene.camera.rotation[x].y == 0) {
					_camRotationM4.rotate( scene.camera.rotation[x].z,[0,0,1]);
				}
			}
			
			
			
			
			GL.uniformMatrix4fv(vars.CamRotationM4, false, _camRotationM4.data);
			GL.uniform3f(vars.CamRotationV3, 
				0.0,
				0.0,
				0.0
			);
			GL.uniform3f(vars.CamAt, 
				scene.camera.lookAt.x,
				scene.camera.lookAt.y,
				scene.camera.lookAt.z
			);
			GL.uniform3f(vars.CamPointer, 
				scene.camera.position.x,
				scene.camera.position.y,
				scene.camera.position.z
			);
			// </camera>
			
			
			

			// <object>
			GL.uniform3f(vars.ObjScale,1.0,1.0,1.0);
			var _objRotation = M4();
			_objRotation.I();
			for(var x = 0; x < self.rotation.length;x++) {
				//console.log(""+this.rotation[x]);
				if(self.rotation[x].y == 0 && self.rotation[x].z == 0) { // rotate x // ccw
					_objRotation.rotate( self.rotation[x].x,[1,0,0]);
				} else if(self.rotation[x].x == 0 && self.rotation[x].z == 0) { // rotate y // ccw
					_objRotation.rotate( self.rotation[x].y,[0,1,0]);
				} else if(self.rotation[x].x == 0 && self.rotation[x].y == 0) { // rotate z // ccw // must select if is ccw or cw, this is ccw, z+ foward, x+ right, y+ up
					_objRotation.rotate( self.rotation[x].z,[0,0,1]);
				}
			}
			GL.uniformMatrix4fv(vars.ObjRotation, false, _objRotation.data);
			GL.uniform3f(vars.ObjTranslation, self.x,self.y,self.z);
			// </object>

			
			// </uniforms>
			
			
			
			// <attribs>
			GL.bindBuffer(GL.ARRAY_BUFFER, self.ptBuffer);
			GL.vertexAttribPointer(vars.pt, self.ptBuffer.itemSize, GL.FLOAT, false, 0, 0);
			
			GL.bindBuffer(GL.ARRAY_BUFFER, self.n_ptBuffer);
			GL.vertexAttribPointer(vars.n_pt, self.n_ptBuffer.itemSize, GL.FLOAT, false, 0, 0);
			
			GL.bindBuffer(GL.ARRAY_BUFFER, self.colorBuffer);
			GL.vertexAttribPointer(vars.color, self.colorBuffer.itemSize, GL.FLOAT, false, 0, 0);
			
			GL.bindBuffer(GL.ARRAY_BUFFER, self.tex_ptBuffer);
			GL.vertexAttribPointer(vars.tex_pt, self.tex_ptBuffer.itemSize, GL.FLOAT, false, 0, 0);
			
			
			var texture_options = 0;
			if(i.current.texture0_is_loaded()) {
				
				//console.log("TEXTURE LOADED. RENDER.");
				texture_options |= 1;
				GL.uniform1i(vars.tex_options, texture_options);	
				GL.activeTexture(GL.TEXTURE0);
				GL.bindTexture(GL.TEXTURE_2D, 
					i.current.texture0_buffer
				);
				GL.uniform1i(vars.uSampler, 0);
				
			} else {
				GL.uniform1i(vars.tex_options, texture_options);	
			}
			
			
			
			//GL.enable(gl.CULL_FACE);
			//GL.cullFace(gl.FRONT);
		
			if(scene.wireframe) {
				GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, self.wireframeBuffer);
				GL.drawElements(GL.LINES, self.wireframeBuffer.numItems*self.wireframeBuffer.itemSize, GL.UNSIGNED_SHORT, 0);	
			} else {
				//console.log( self.indexBuffer.numItems*self.indexBuffer.itemSize );
				GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, self.indexBuffer);
				GL.drawElements(GL.TRIANGLES, self.indexBuffer.numItems*self.indexBuffer.itemSize, GL.UNSIGNED_SHORT, 0);
			}
			// </attribs>
			
			
		}
		
		/*
		
			[ x 0 0  ]
			[        ]
			[        ]
			[        ]
			
			
			[sx 0  0  tx ]
			[0  sy 0  ty ]
			[0  0  sz tz ]
			[0  0  0  1  ]
		 */
		// variable numbers of rotations and translations based on stack skeleton, this will create too many programs
		// how many levels is a good choice?
		// spherical cordinates must be done before all that stuff
		// major culling and clipping must be done by geographical coordinates
		// minor culling may be done on render
		// camera space planet vehicle floor instance (instance rebuild or get from cache of loaded frame)
		// buffer programs by skeleton configuration, attach objects to skeleton piece that must be treat like that piece positioning
		// better to select on render which pieces will go to that program
		// the nr of local lights rebuild the shader
		// the nr of local framebuffers rebuild the shader
		// the nr of textures rebuild the shader
		
		
		// i: gl_VertexID;
		// i: int gl_InstanceID;
		// o: vec4 gl_Position;
		// o: float gl_PointSize;
		// o: float gl_ClipDistance[];
		
		//vec4 gl_Position;
		//float gl_PointSize;
		//float gl_ClipDistance[];
		// i:in vec4 gl_FragCoord;
		// i:in bool gl_FrontFacing;
		// o:gl_FragColor
		var scene_global = scene.internal["XMath.3Devils_alpha.Scene"].data.global;
		
		
		// here we start the travel
		
		//console.log("TRAVEL START");
		
		this.Program(GL
			,"default"
			,{
				u : [
					"Matrix0",
					"CamRange","CamAt","CamScale","CamPointer",
					"CamRotationM4","CamRotationV3",
					"ObjRotation","ObjTranslation","ObjScale",
					"uSampler","tex_options"
				]
				, aa : [
					"pt",
					"n_pt",
					"color",
					"tex_pt"
				]
			}
			,scene_global.dot_vs
			,scene_global.dot_fs
		);
		//console.log("ASYNC?");
		
		this.GotoPolarZ = function(rv,ru,av,au) {
			scene.GotoPolarZ(rv,ru,av,au);
			return this;
		};
		
		this.StartPoint = function() {
			return scene.StartPoint();
		};
		
		
		this.AngleOffsetZ = function(angle) {
			i.current.angleOffsetZ = angle;
			return this;
		};
		this.AngleOffsetY = function(angle) {
			i.current.angleOffsetY = angle;
			return this;
		};
		this.AngleOffsetX = function(angle) {
			i.current.angleOffsetX = angle;
			return this;
		};
		
		this.Width = function(w) { // set filter on dot-4sides
			i.current.width = w;
			return this;
		};
		this.Height = function(h) { // set filter on dot-4sides
			i.current.height = h;
			return this;
		};
		this.Size = function(sz) {
			i.current.size = sz;
			return this;
			
		};
		this.ShapeMode = function(mode) { // set filter on counting points geometry
			// registered modes filter
			i.shape.mode = mode;
			
			return this;
		};
		this.Sides = function(sd) {
			i.current.sides = sd;
			return this;
		};
		
		
		this.TextureEvent = function(args) {
			// trigger texture to be used on render
			var i = this.internal["XMath.3Devils_alpha.StartPoint"].data
			i.current.texture0_buffer = scene.textures[args].buffer;
			i.current.texture0_name = args;
			i.current.texture0_set();
			//console.log("TEXTURE LOADED. EVENT.");
			
		};
		this.BuildEvent = function(args) {
			// trigger geometry to be used on render
			
			
		};
		this.Texture = function(name) {
			//console.log("TEXTURE: START LOADING");
			i.current.texture0_loaded = false; // this is about webgl trigger
			if(!( name in scene.textures)) {
				scene.textures[name] = {
					loaded : false,
					buffer : GL.createTexture(),
					image : null,
					pending : [this]
				};
				// it enqueue only one image but all objects that use that image is warned through scene textureUpdate
				scene.textureGenerator.Draw(name,512,"texture",function(name,image) { // call worker to generate texture
					image.addEventListener("load",function() { 
						console.log("LOADED image");
						//console.log("LOADED?????",image);
						scene.textures[name].image = image; // loaded texture async
						GL.bindTexture(GL.TEXTURE_2D, scene.textures[name].buffer);
						GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
						GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
						GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
						GL.generateMipmap(GL.TEXTURE_2D);
						GL.bindTexture(GL.TEXTURE_2D, null);
						console.log("ABC");
						// i.current is lost so it triggers scene to trigger all that requested this image
						scene.textureUpdate(name);	
						
						
					});
					image.addEventListener("error",function() { 
						// load error texture 
					});
					
					
					scene.textures[name].loaded = true;
				});
			} else {
				i.current.texture0_name = name;
				// this make a 0time loop at compiler
				if(scene.textures[name].loaded) {
					i.current.texture0_loaded = true; // webgl trigger
					i.current.texture0_buffer = scene.textures[name].buffer;
				} else {
					// enqueue triggers when it loads
					scene.textures[name].pending.push(this);
					
				}
			}
			
			return this;
		};
		this.Color = function(r,g,b,a) {
			if(g) {
				
			} else {
				var dword = r;
				var _a = (0xFF000000 & dword ) >> 24, _r = (0xFF0000 & dword) >> 16, _g = (0xFF00  & dword) >> 8, _b = (0xFF & dword);
				var i = this.internal["XMath.3Devils_alpha.StartPoint"].data;
				_a = 0xFF ^ _a;
				i.current.color = Class.create("XMath.V4",{ "XMath.V4" : [ "Float32Array", _r/255,_g/255,_b/255,_a/255 ] });
				i.current.color_dword = dword;
			}
			return this;
		};
		
		this.Refresh = function() {
			var i = this.internal["XMath.3Devils_alpha.StartPoint"].data;
			
			this.built = false;
			return this;
		}
		this.GotoSpherical = function(rv,ru,av,au,bv,bu) {
			scene.GotoSpherical(rv,ru,av,au,bv,bu);
			return this;
		};
		this.ResetStack = function() {
			scene.ResetStack();
			return this;
		};
		
	}
	, proto : {
		TranslateOffset : function( x, y, z) {
			this.x += x;
			this.y += y;
			this.z += z;
		},
		SelfRotateX : function(angle) {
			var V3 = function(a,b,c) { return Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]}); };
			this.rotation.push( V3(angle,0,0) );
			return this;
		},
		SelfRotateY : function(angle) {
			var V3 = function(a,b,c) { return Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]}); };
			this.rotation.push( V3(0,angle,0) );
			return this;
		},
		SelfRotateZ : function(angle) {
			var V3 = function(a,b,c) { return Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]}); };
			this.rotation.push( V3(0,0,angle) );
			return this;
		},
		MouseMoveTo : function(mouse) {
			// convert scene camera
			
			// mouse.left
			// mouse.top
			// mouse.backup
			// get diff
			// apply diff
			
			
			
			
			this.built = false;
			
			return true;
		},
		LineTo : function() {
			// if this is a one point, mark second point and increase count
			// if this is a two point, mark third point and draw triangle
			
			// if number of points is 2
			// draw a stick
			
			// if number of points is 3
			// draw a triangle, extruded by min height and centered.
			
			
			// if number of points is 4 or more
				// check if convex
				// check is aligned
			var i = this.internal["XMath.3Devils_alpha.StartPoint"].data;
			this.count += 1;
			var V3 = function(a,b,c) { return Class.create("XMath.V3",{ "XMath.V3" : [ "Float32Array", a,b,c ]}); };
			var _location = V3(i.scene.location.x,i.scene.location.y,i.scene.location.z);
			i.shape.points.push(_location);
			
			console.log(this.count);
			if(this.count==1) { // line
				
				
				
				return this;
				
				
				// send type line to render points array
				
			} else if(this.count==2) { // type : [ triangle | 3 point line ], keyboard : [ p() : switch render type ]
				
				return this;
				
				// default type is 3 point line
				
				
				// update "program" that renders a dot, this includes, geometry, normals, indexes, 
				
				
				
			} else if(this.count==3) { // two faces | ~trapezoid
			
				
			
				
			} else if(this.count==4) { // three faces=pentagon | trapezoid | bumerang
			
			} else if(this.count==5) { // four faces=hexagon|
				
			} else if(this.count==6)
				return this;
			
			
		},
		Grab : function() {
			// drop
		},
		Pull : function() {
			
		},
		Push : function() {
			
		},
		Extrude : function() { // from face
		
		},
		Pyramid : function() { // from face
			
		},
		To : function(method) { // from face
		
		},
		ToThen: function(method) {
			
		},
		Globe : function() {
			
		},
		Union : function() {
			
		},
		Subtract : function() {
			// return intersection
		},
		Mark : function() {
			// return cutted faces that intersect with another geometry
		},
		Intersect : function() {
			
		},
		SelectPoints : function() {
			// move
			// remove
		},
		SelectEdges : function() {
			// move
			// remove
			// divide(method)
		},
		SelectFaces : function() {
			// move
			// remove
			// divide(method)
		}
	}
});
