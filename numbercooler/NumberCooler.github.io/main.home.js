Router.addPage({name:"home",template:"base"},function(args,template) { // loaded presentation, communications panel
	var self = this;
	base_container.apply(this);
	
	
	
	// template altera template
	//var container = template.Container().elementGetContents("item"); 
	//container.elementsClear();
	//template.Container().elementGetContents("origin").elementsClear();
	//var container = template.Container().elementGetContents("origin");
	
	var origin_lt = template.Container().elementGet("origin_lt"); 
	origin_lt.style.backgroundColor = "";
	origin_lt.style.width = "0px";
	origin_lt.style.height = "0px";
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	origin_lt_container.elementsClear();
	
	
	var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
		h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
		
	
		
	var logo = origin_lt_container.elementNew("logo","div");
	logo.innerHTML = "&nbsp;NumberCooler&nbsp;";
	logo.style.position = "absolute";
	
	
	logo.style.left = (w-350) + "px";
	logo.style.top = (h -90) + "px";
	
	logo.style.height = "50px";
	logo.style.border = "solid 10px #fff";
	logo.style.fontFamily = "Verdana";
	logo.style.fontSize = "40px";
	logo.style.color = "#fff";
	logo.style.zIndex = 20;
	logo.style.cursor = "default";
	console.log("before add eventlistener to logo");
	logo.addEventListener("click",function() {
		
		History.go("#editor");
	});
	console.log("after add eventlistener to logo");
	var canvas = origin_lt_container.elementNew("canvas2d_default","canvas");
	canvas.style.position = "absolute";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
	canvas.style.zIndex = 10;
	canvas.style.border = "solid 1px #000";
	
	var reduce = 1;
	
	var display = {
		enabled : true,
		focus : true,
		notes : {
			// hd 1280x720
		},
		mode : 0,
		reduce : 0,
		race : false,
		size : { real : null, virtual : null },
		canvas : null,
		ctx : null,
		frameDuration:10,
		currentFrame : 0,
		dateStart : new Number(new Date()),
		totalFrames : 1,
		debug : false,
		buffer : [],
		control : {
			textscroller : {
				download : {
					init : false
				}
			}
		},
		boot : function(canvas,w,h,reduce) {
			this.canvas = canvas;
			
			// 24fps full 0
			// 90 fps red 1
			// red 2 broke because tile got into fraction, it must resample
			w  = w >> reduce;
			h  = h >> reduce;
			w = w - (w%2);
			h = h - (h%2);
			// reframe fraction
			
			canvas.style.width = (w<<reduce) +"px";
			canvas.style.height = (h<<reduce) +"px";
			console.log("display={real:["+w+","+h+"],virtual:["+(w<<reduce)+","+(h<<reduce)+"]}");
			canvas.setAttribute("width",w);
			canvas.setAttribute("height",h);
			
			this.ctx = canvas.getContext("2d");
			this.reduce = reduce;
			this.size.real = [w,h];
			this.size.virtual = [w<<reduce,h<<reduce];
			var sz = this.size.real;
			this.buffer.push( [ new Uint8Array(w*h*4) ] );
			
			for(var x = 0; x < w*h*4;x+=4) { this.buffer[0][ x+3 ] = 255; }
			imgData = display.ctx.createImageData(w,h);
			imgData.data.set( this.buffer[0] );
			display.ctx.putImageData(imgData,0,0);
		}
	}
	display.boot(canvas,w,h,reduce);
	
	var cpu = {
		instance : null,
		boot : function() {
			var self = this;
			this.instance = new Worker("/js/build/ppu.js");
			this.instance.addEventListener('message', function(e) { // router
				var json = e.data;
				try { 
					//console.log(json.app,json.method);
					cpu.SO.type[ cpu.selectedSO ].app[json.app][ json.method ].apply(null,json.args); 
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
	
	this.elementRender = function(time) {
		//console.log("render page",time);
		//this.reDial();
		//this.wde.elementRender(time);
		//var b = display.buffer.shift();
		
		if( UI.Document.get()[hidden] ) {
			//console.log("CHANGED 1");
			display.focus = false;
		} else {
			//console.log("CHANGED 2");
			display.focus = true;
		}
		
		if(display.enabled && display.focus) {
			if(display.buffer.length>0) {
			
				var c = new Uint8ClampedArray(display.buffer[0].length);
				c.set(display.buffer[0]);
				//console.log(c.length,Object.prototype.toString.apply(display.buffer[0]));
				var imgData = display.ctx.createImageData(display.size.real[0],display.size.real[1]);
				imgData.data.set(c);
				display.ctx.putImageData(imgData,0,0);
				display.buffer.shift();
				
			}
		}
		
		if( UI.Document.get()[hidden] ) {
			//console.log("CHANGED 3");
			display.focus = false;
		} else {
			//console.log("CHANGED 4");
			display.focus = true;
		}
	
	}
	cpu.SO.type[ cpu.selectedSO ].app.textscroller = {
		setTotalFrames : function(args) {
			display.totalFrames = args;
			console.log("duration",args);
			
		},
		reset : function(args) {
			
			var filename = args;
			Import({method:"get",url:"./script/"+filename+".txt"})
			.done(function(data) {
				var text = data;
				cpu.instance.postMessage({ 
					app : "textscroller", method: "init", args: [{ 
						width: display.size.real[0], 
						height : display.size.real[1], 
						text : text 
					}] 
				});
				cpu.instance.postMessage({ 
					app : "textscroller", method: "render", args: [] 
				});
			})
			.send();
		},
		render : function(args) {
			
			if(display.enabled) {
				//console.log("FRAME:",display.currentFrame);
				var imgData = display.ctx.createImageData(display.size.real[0],display.size.real[1]);
				//imgData.data.set( args.data );
				display.buffer.push( args.data );
				
				
				var f = function f() {
					if(display.currentFrame == display.totalFrames) {
						display.currentFrame = 0;
						vid.add(canvas,5000);
						if(!display.control.download.init) {
							display.control.download.init = true;
							var blob = vid.compile();
							label.style.cursor = "pointer";
							label.addEventListener("click",function() {
								Download.go(blob, "video.webm");
							});
						}
						
					} else if(display.currentFrame > display.totalFrame) {
					
					} else if(display.currentFrame < display.totalFrames) {
						vid.add(canvas,100);
					}
				}
				
				var dt2 = new Number(new Date());
				if(dt2-display.dateStart < display.frameDuration) {
					setTimeout(function() {
						
						cpu.SO.type[ cpu.selectedSO ].app.textscroller.render(args);
						
						
					},10);
				} else {
					
					display.dateStart = display.dateStart + display.frameDuration;
					cpu.instance.postMessage({ 
						app : "textscroller",method: "render", args: [] 
					});	
				}
				//display.ctx.putImageData(imgData,0,0);
				display.currentFrame++;
			
			}
		}
	}
	
	cpu.boot();
	// load text to display
	cpu.SO.type[ cpu.selectedSO ].app.textscroller.reset("0_0xF");
	
	
	UI.Window.on("resize",function() {
		console.log("window resize");
		var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
		h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
		
		display.canvas.style.width = w + "px";
		display.canvas.style.height = h + "px";
		logo.style.left = (w-350) + "px";
		logo.style.top = (h -90) + "px";
		
	});
	UI.Window.on("blur",function() {
		//console.log("BLUR");
		display.enabled = false;
	});
	UI.Window.on("focus",function() {
		//console.log("FOCUS");
		display.enabled = true;
		cpu.instance.postMessage({  app : "textscroller",method: "render", args: []  });	
	});
	UI.Window.on("online",function() {
		console.log("ONLINE");
	});
	UI.Window.on("offline",function() {
		console.log("OFFLINE");
	});
	
	

});