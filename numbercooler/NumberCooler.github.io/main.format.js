
Router.addPage({name:"format",template:"base"},function(args,template,router) { // page, 2dmodel, 3dmodel
	
	
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
		
	
	var window_width = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
	window_height = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
	
	origin_lt.style.position = "absolute";
	origin_lt.style.top = "0px";
	origin_lt.style.left = "0px";
	origin_lt.style.width = window_width+"px";
	origin_lt.style.height = window_height+"px";
	origin_lt.style.overflow = "hidden";
	
	
	var canvasWebGl = origin_lt_container.elementNew("canvasWebGl","canvas");
	canvasWebGl.style.position = "absolute";
	canvasWebGl.style.left = "0px";
	canvasWebGl.style.top = "0px";
	canvasWebGl.style.border = "solid 1px #000";
	
	
	
	var formatDisplay = Class.create("XMath.3Devils_alpha",{
		"XMath.3Devils_alpha" : [
			canvasWebGl,
			{ axis : [] }
		]
	});
	
	
	canvasWebGl.addEventListener("mousemove",function(e) {
		formatDisplay.emit("mousemove",[e]);
	});
	canvasWebGl.addEventListener("mousedown",function(e) {
		formatDisplay.emit("mousedown",[e]);
	});
	canvasWebGl.addEventListener("mouseup",function(e) {
		formatDisplay.emit("mouseup",[e]);
	});
	window.addEventListener("keydown",function(e) {
		formatDisplay.emit("keydown",[e])
	});
	window.addEventListener("keyup",function(e) {
		formatDisplay.emit("keyup",[e])
	});
	
	var self = this;
	
	// load shaders
	ImportList([{
		method : "get",
		json : false,
		url : "/glsl/limited-perspective.vertex.glsl"
	},{
		method : "get",
		json : false,
		url : "/glsl/limited-perspective.fragment.glsl"
	}])
	.done(function(results,infos) {
		//for(var x = 0; x < results.length;x++) console.log("@@@@@@@@@ LOAD AJAX",results[x]);

		// make it constant after debug
		
		
		var global = {};
		global.square_vs = results[0];
		global.square_fs = results[1];
		global.dot_vs = results[2];
		global.dot_fs = results[3];
		formatDisplay.setGlobal(global);
		
		
		var display = {
			enabled : true,
			focus : true,
			debug : false,
			element : formatDisplay
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
		
		var data = {};
		
		var reduce = 1;
		formatDisplay.setSize(
			{
				width : parseInt(window_width/reduce)
				, height : parseInt(window_height/reduce)
				, sourceX : window_width
				, sourceY : window_height
			}
		);
		
		UI.Window.on("resize",function() {
			var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
			h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
			formatDisplay.setSize(
				{
					width : parseInt(window_width/reduce)
					, height : parseInt(window_height/reduce)
					, sourceX : window_width
					, sourceY : window_height
				}
			);
			
			origin_lt.style.width = w+"px";
			origin_lt.style.height = h+"px";
		});
		UI.Window.on("blur",function() {
			display.enabled = false;
		});
		UI.Window.on("focus",function() {
			display.enabled = true;
		});
		
		
		var scene = formatDisplay.New("default_scene",true);
		
		
		var clock = Class.create("XMath.Clock", { "XMath.Clock" : [] });
		clock.start();
		var last_timestamp = clock.getElapsedTime();
		
		scene.camera.type = "limited-perspective";
		var program = "limited-perspective"; // sample of texture, face occlusion on left right cubes
		// save program selected scene name
		if(program=="limited-perspective")  {
			
			
			
		}
	})
	.fail(function(infos) {
		console.log("@@@@@@@@@ FAIL AJAX");
	})
	.send();
	
});