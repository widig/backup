
Router.addPage({name:"webgl_research.lab0x00",template:"base"},function(args, template, router) {
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	
	// cartridge loaded? (check message on localStorage)
	// 		yes
	// 			
	//		no
	//			dialog to screen, upload and download buttons
	//				drag and drop upload
	
	
	
	
	
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
	
	
	var en = "elementNew", egc = "elementGetContents", olc = origin_lt_container;
	var CartridgeEnginePanel = olc[en]("cartridge_engine","div");
	CartridgeEnginePanel.style.position = "absolute";
	CartridgeEnginePanel.style.left = (window_width-100) + "px";
	CartridgeEnginePanel.style.top = (window_height-200) + "px";
	CartridgeEnginePanel.style.width = "100px";
	CartridgeEnginePanel.style.height = "200px";
	CartridgeEnginePanel.style.border = "solid 1px #000";
	CartridgeEnginePanel.style.backgroundColor = "#fff";
	
	
	var CE_upload = olc[egc]("cartridge_engine")[en]("upload","div");
	CE_upload.style.position = "absolute";
	CE_upload.style.left = "0px";
	CE_upload.style.top = "0px";
	CE_upload.style.width = "100px";
	CE_upload.style.textAlign = "center";
	CE_upload.style.height = "100px";
	CE_upload.style.textAlign = "center";
	CE_upload.style.lineHeight = "100px";
	CE_upload.style.fontFamily = "Helvetica";
	CE_upload.style.fontSize = "18px";
	CE_upload.style.fontWeight = "bold";
	CE_upload.style.textAlign = "center";
	CE_upload.style.cursor = "default";
	CE_upload.innerHTML = "upload";
	CE_upload.addEventListener("mousedown",function() {
		
	});
	
	var CE_download = olc[egc]("cartridge_engine")[en]("download","div");
	CE_download.style.position = "absolute";
	CE_download.style.left = "0px";
	CE_download.style.top = "100px";
	CE_download.style.width = "100px";
	CE_download.style.height = "100px";
	CE_download.style.fontFamily = "Helvetica";
	CE_download.style.fontSize = "18px";
	CE_download.style.fontWeight = "bold";
	CE_download.style.textAlign = "center";
	CE_download.style.lineHeight = "100px";
	CE_download.style.backgroundColor = "#CCC";
	CE_download.style.cursor = "default";
	CE_download.innerHTML = "download";
	CE_download.addEventListener("click",function() {
		
		// download json of the current state : {
		//		file version, file signature, file date, file comments
		// 		walker position, walker view, aditional actions from default
		// }
		
	});
	var self = this;
	
	// load shaders
	ImportList([{
		method : "get",
		json : false,
		url : "/glsl/vertex.glsl"
	},{
		method : "get",
		json : false,
		url : "/glsl/fragment.glsl"
	},{
		method : "get",
		json : false,
		url : "/glsl/dot.vertex.glsl"
	},{
		method : "get",
		json : false,
		url : "/glsl/dot.fragment.glsl"
	},{
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
		
		// scene start
		// accept only integers
		// alpha = start right(1,0,0) goes to z direction by this angle, alpha split,beta = [start up(0,1,0) goes to x direction (1,0,0) by this angle, beta split
		// turtle graphics
		/*
		var point = scene
			.GotoPolar(1,3,90,180)
			.GotoPolar(1,3,45,180)
			.GotoPolar(1,3,45,180)
			.GotoPolar(1,3,45,180)
			.StartPoint();
		point.x = 0;
		point.y = 0;
		*/
		
		/*
		var reset = false;
		if(reset) {
			Disk.set("bios",{});
		}
		*/
		
		
		/*
		var boot_disk = Disk.get("bios");
		if(boot_disk) {
			formatDisplay.Load(boot_disk);
			
			this.elementRender = function() {
				formatDisplay.RunFrame();
			}
		} else {
			*/
		
		
		
		console.log("OK@B");
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
			//console.log("BLUR");
			display.enabled = false;
		});
		UI.Window.on("focus",function() {
			//console.log("FOCUS");
			display.enabled = true;
		});
		
		var scene = formatDisplay.New("default_scene",true);
		
		
		var clock = Class.create("XMath.Clock", { "XMath.Clock" : [] });
		clock.start();
		var last_timestamp = clock.getElapsedTime();
		
		scene.camera.type = "limitless";
		
		
		var program = "grid2"; // sample of texture, face occlusion on left right cubes
		
		// save program selected scene name
		
		if(program=="limited-perspective-raycast")  {
			var origin = scene.StartPoint();
			origin
				.Sides(4)
				.Color(0xFF)
				.Size(1)
				.Refresh();
			
			var globalCounterCycle = 0;
			var globalCounter = 0;
			var elementCounter = 0;
			var check1 = false;
			var frame = 0;
			(function(p) {
				
				self.elementRender = function() {
					if( UI.Document.get()[hidden] ) {
						//console.log("CHANGED 1");
						display.focus = false;
					} else {
						//console.log("CHANGED 2");
						display.focus = true;
					}
					if(display.enabled && display.focus) {
						var delta = clock.getDelta();
						globalCounter += delta;
						//console.log(globalCounter);
						if(globalCounter > 1/30) {
							formatDisplay.RunFrame();
							globalCounterCycle += 1;
							if( globalCounterCycle > 1000000 ) {
								globalCounter = 0;
								globalCounterCycle = 0;
							}
						}
						elementCounter += delta;
						if(elementCounter > 0.1) { // 10 blocks per second holding SHIFT
						
							var total_frames = 4;
							var phase = 0;
							var total_angle = 180;
							//p[0].Texture("stripes").Refresh();
							
							/*
								if(frame == 0) {
									console.log("-------------------------------------------------------------------------------")
									for( var mx = 0; mx < 4;mx++) p[mx].Size
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh
									frame = ( frame + 1) % total_frames
								} else if(frame==1) {
									for( var mx = 0; mx < 4;mx++) p[mx].Size
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh
									//p1.Size(0.25).Color(0xFF00).AngleOffsetZ
									frame = ( frame + 1) % total_frames
								} else if(frame==2) {
									for( var mx = 0; mx < 4;mx++) p[mx].Size
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh
									frame = ( frame + 1) % total_frames
								} else if(frame==3) {
									for( var mx = 0; mx < 4;mx++) p[mx].Size
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh
									frame = ( frame + 1) % total_frames
								}
							*/
							
							elementCounter = 0;
							
						}
					}
				};
				if( UI.Document.get()[hidden] ) {
					//console.log("CHANGED 3");
					display.focus = false;
				} else {
					//console.log("CHANGED 4");
					display.focus = true;
				}
				
			})(selected_points);
		} else if(program=="grid2") {
			
			// save scene draw
			
			// number of frames
				// number of points
					// number of calls
						// arguments of calls
			// selection indices and names
			// frame threads 
			// 		- interval
					// frames
						// number of points in selection
						// number of calls for each selected point
							// arguments
					
			
			
			var point = scene.StartPoint();
			
			point.x = 0; point.y = 0;

			var _w = 4, _h = 4, _d = 4;
			var matrix0 = [];
			for(var z = 0; z < _d;z++) {
				for(var y = 0; y < _h;y++) {
					for(var x = 0; x < _w;x++) {
						
						scene.locationAt(-1.5+x,-1.5+y,-1.5+z);
						var pt = scene.StartPoint();
						pt.Sides(4);
						if(x==0 && y == 0 && z == 0)
							pt.Color(0xFF00);
						else if(x==3 && y == 3 && z == 3)
							pt.Color(0xFFFF00);
						else
							pt.Color(0xFF0000);
						pt.Refresh();
						matrix0.push(pt);
					}
				}
			}
			var Matrix0 = function(_x,_y,_z) { return matrix0[ _w*_h*z + _w*y + _x ]; };
			//scene.locationAt(-0.5,-1.5,-1.5);
			
			
			
			
			
			// <sample> four lines y-width-1face example
			
			// </sample>
			
			
			
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.location.x = 0; // está localizado em x = - 1.5
			scene.location.y = 0;// varia o y do array abaixo de 0.5 positivo
			scene.location.z = 64.0+3; // está localizado em z = 1.5
			pt
				.Color(0xcccccc)
				.ShapeMode("x-width-1face")
				.Size(0.5)
				.LineTo()
				.Refresh();
			pt.y = -1.5;
			pt.x = 1.0;
			pt.z = 32.0;
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.locationAt( 3+64, 0, 0);
			pt
				.Size(0.5)
				.Color(0x808080)
				.AngleOffsetX(Math.PI/2)
				.ShapeMode("y-width-1face")
				.LineTo()
				.Refresh();
			pt.x = -32.0; // line position correction
			pt.z = 1.0;
			pt.y = -1.5;
			
			
			
			
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.locationAt(0,0,64+3);
			pt
				.Color(0xcccccc)
				.ShapeMode("x-width-1face")
				.Size(0.5)
				.LineTo()
				.Refresh();
			pt.x = -1.0;
			pt.y = -1.5;
			pt.z = -32.0;
			
			
			// nothing related to order of drawing
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.locationAt( 3+64, 0, 0);
			pt
				.Size(0.5)
				.Color(0x808080)
				.AngleOffsetX(Math.PI/2)
				.ShapeMode("y-width-1face")
				.LineTo()
				.Refresh();
			pt.x = 32.0; // line position correction
			pt.y = -1.5;
			pt.z = -1.0 ;
			
			
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.locationAt( 3+64, 0, 0);
			pt
				.Size(0.5)
				.Color(0x808080)
				.AngleOffsetX(Math.PI/2)
				.ShapeMode("y-width-1face")
				.LineTo()
				.Refresh();
			pt.x = 32.0; // line position correction
			pt.y = -1.5;
			pt.z = -1.0-64;
			
			
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.locationAt( 3+64, 0, 0);
			pt
				.Size(0.5)
				.Color(0x808080)
				.AngleOffsetX(Math.PI/2)
				.ShapeMode("y-width-1face")
				.LineTo()
				.Refresh();
			pt.x = -32.0-2; // line position correction
			pt.y = -1.5;
			pt.z = -1.0-64;
			
			
			// center floor
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.locationAt( 1, 0, 0);
			pt
				.Size(0.5)
				.Color(0xFF)
				.AngleOffsetX(Math.PI/2)
				.ShapeMode("y-width-1face")
				.LineTo()
				.Refresh();
			pt.x = 0; // line position correction
			pt.y = -1.5;
			pt.z = 0;
			
			
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.locationAt( 3, 0, 0);
			pt
				.Size(1.5)
				.Color(0xEE)
				.AngleOffsetX(Math.PI/2)
				.ShapeMode("y-width-1face")
				.LineTo()
				.Refresh();
			pt.x = -1; // line position correction
			pt.y = -1.5;
			pt.z = 3;
			
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.locationAt( 3, 0, 0);
			pt
				.Size(1.5)
				.Color(0xEE)
				.AngleOffsetX(Math.PI/2)
				.ShapeMode("y-width-1face")
				.LineTo()
				.Refresh();
			pt.x = 1; // line position correction
			pt.y = -1.5;
			pt.z = -3;
			
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.locationAt( 3, 0, 0);
			pt
				.Size(1.5)
				.Color(0xEE)
				.AngleOffsetX(Math.PI/2)
				.ShapeMode("y-width-1face")
				.LineTo()
				.Refresh();
			pt.x = -3; // line position correction
			pt.y = -1.5;
			pt.z = -1;
			
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.locationAt( 3.0, 0, 0);
			pt
				.Size(1.5)
				.Color(0xEE)
				.AngleOffsetX(Math.PI/2)
				.ShapeMode("y-width-1face")
				.LineTo()
				.Refresh();
			pt.x = 3; // line position correction
			pt.y = -1.5;
			pt.z = 1;
			
			
			scene.locationAt(0,0,0);
			var pt = scene.StartPoint();
			scene.locationAt( 0, 3.0, 0);
			pt
				.Size(1.5)
				.Color(0x88)
				.AngleOffsetX(Math.PI/2)
				.ShapeMode("x-width-1face")
				.LineTo()
				.Refresh();
			pt.x = 0; // line position correction
			pt.y = 0.0;
			pt.z = 1.5+64;
			
			// <sample>
			scene.location.x = -1.5; // está localizado em x = - 1.5
			scene.location.y = 0.5;// varia o y do array abaixo de 0.5 positivo
			scene.location.z = 1.5; // está localizado em z = 1.5
			for(var px = 0; px < _w ;px++) {
				x = 0, y = 1, z = px;
				var pos = _w*_h*z + _w*y + x;
				matrix0[ pos ]
					.Color(0x80FF80)
					.ShapeMode("x-width-1face")
					.LineTo()
					.Refresh();
				
				matrix0[ pos ].y = -1.0; // line position correction
			}
			
			// </sample>
			
			
			
			
			
			
						
			
			x = 0, y = 0, z = 0;
			
			var globalCounterCycle = 0;
			var globalCounter = 0;
			var elementCounter = 0;
			var check1 = false;
			var frame = 0;
			(function(p) {
				
				self.elementRender = function() {
					if( UI.Document.get()[hidden] ) {
						//console.log("CHANGED 1");
						display.focus = false;
					} else {
						//console.log("CHANGED 2");
						display.focus = true;
					}
					if(display.enabled && display.focus) {
						var delta = clock.getDelta();
						globalCounter += delta;
						//console.log(globalCounter);
						if(globalCounter > 1/30) {
							formatDisplay.RunFrame();
							globalCounterCycle += 1;
							if( globalCounterCycle > 1000000 ) {
								globalCounter = 0;
								globalCounterCycle = 0;
							}
						}
						elementCounter += delta;
						if(elementCounter > 0.1) { // 10 blocks per second holding SHIFT
						
							var total_frames = 4;
							var phase = 0;
							var total_angle = 180;
							//p[0].Texture("stripes").Refresh();
							
							/*
								if(frame == 0) {
									console.log("-------------------------------------------------------------------------------")
									for( var mx = 0; mx < 4;mx++) p[mx].Size
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh
									frame = ( frame + 1) % total_frames
								} else if(frame==1) {
									for( var mx = 0; mx < 4;mx++) p[mx].Size
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh
									//p1.Size(0.25).Color(0xFF00).AngleOffsetZ
									frame = ( frame + 1) % total_frames
								} else if(frame==2) {
									for( var mx = 0; mx < 4;mx++) p[mx].Size
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh
									frame = ( frame + 1) % total_frames
								} else if(frame==3) {
									for( var mx = 0; mx < 4;mx++) p[mx].Size
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh
									frame = ( frame + 1) % total_frames
								}
							*/
							
							elementCounter = 0;
							
						}
					}
				};
				if( UI.Document.get()[hidden] ) {
					//console.log("CHANGED 3");
					display.focus = false;
				} else {
					//console.log("CHANGED 4");
					display.focus = true;
				}
				
			})(selected_points);
		} else if(program=="semi-perspective") {
			var point = scene.StartPoint();
			point.x = 0; point.y = 0;
			
			var selected_points = [];
			


			// walk mrows, filling squares
				// walk ncols, filling squares, cr, lf
					// fill square, push to selected if in range of that selection
					// the range of selection is done by language filtering of attributes that are added to that selection
			

			for(var y = 0;y < 200;y++) {
				for(var x = 0;x < 1;x++) {
					var floor = scene.StartPoint();
					floor.Sides(4);
					floor.AngleOffsetZ(Math.PI/4);
					//floor.AngleOffsetX(Math.PI/2);
					floor.SelfRotateX(Math.PI/2);
					floor.Color(0xFF);
					floor.Size(Math.sqrt(2)/4);
					floor.x = -1.5+0.25;
					floor.y = 0;
					floor.z = x*1+0.25+y*0.5;
					floor.Refresh();
				}
			}
			for(var y = 0;y < 200;y++) {
				for(var x = 0;x < 1;x++) {
					var floor = scene.StartPoint();
					floor.Sides(4);
					floor.AngleOffsetZ(Math.PI/4);
					//floor.AngleOffsetX(Math.PI/2);
					floor.SelfRotateX(Math.PI/2);
					floor.Color(0xFF);
					floor.Size(Math.sqrt(2)/4);
					floor.x = -1.5+0.25+2.5;
					floor.y = 0;
					floor.z = x*1+0.25+y*0.5;
					floor.Refresh();
				}
			}
			
			// red dot
			scene.GotoPolarZ(0.5,1,90,180).StartPoint().Color(0xFF0000).Refresh();
			
			var p0 = scene.GotoPolarZ(0.5,1,90,180)
				.StartPoint()
				.Color(0x00FF00)
				//.Size(Math.sqrt(2)/2)
				.Size(2*Math.sqrt(2)/2)
				.Sides(4)
				.AngleOffsetZ(Math.PI/4)
				.Refresh();
			p0.x = 0;
			p0.y = 0;
			selected_points.push(p0);
			// alpha dot
			scene.GotoPolarZ(0.5,1,90,180).StartPoint().Color(0xFFFF0000).Refresh();
			
			var p1 = scene.GotoPolarZ(0.5,1,0,180)
				.StartPoint()
				.Color(0xFF)
				.Size(Math.sqrt(2)/2)
				.Sides(4)
				.AngleOffsetZ(Math.PI/4)
				.Refresh();
			selected_points.push(p1);
			// yellow dot
			scene.GotoPolarZ(0.5,1,90,180).StartPoint().Color(0xFFFF00).Refresh();
			
			var p2 = scene.GotoPolarZ(0.5,1,0,180)
				.StartPoint()
				.Color(0x808080)
				.Size(Math.sqrt(2)/2)
				.Sides(4)
				.AngleOffsetZ(Math.PI/4)
				.Refresh();
			selected_points.push(p2);
			scene.GotoPolarZ(0.5,1,90,180).StartPoint()
			var p3 = scene.GotoPolarZ(0.5,1,0,180).StartPoint().Sides(6).Size(0.25).Refresh();
			selected_points.push(p3);
			
			scene.GotoPolarZ(0.5,1,0,180).GotoPolarZ(0.5,1,-90,180).StartPoint()
			
			var pa = scene.GotoPolarZ(1,1,-90,180).StartPoint().Sides(6).Size(0.1).Color(0xFF).AngleOffsetZ(Math.PI/2).Refresh();
			
			scene.GotoPolarZ(1,1,0,180).StartPoint()
			scene.GotoPolarZ(1,1,-90,180).StartPoint().Color(0xEDC951).Refresh();
			scene.GotoPolarZ(1,1,0,180).StartPoint().Color(0xEB6841).Refresh();
			scene.GotoPolarZ(1,1,-90,180).StartPoint().Color(0xCC2A36).Refresh();
			scene.GotoPolarZ(1,1,0,180).StartPoint().Color(0x4F3725).Refresh();
			scene.GotoPolarZ(1,1,-90,180).StartPoint().Color(0x00A0B0).Refresh();
			scene.GotoPolarZ(0.9,1,-90,180) // 0.1 above center coming from north
				.StartPoint().Color(0x808080).Refresh();
				//.Color(0xFF)
			
			// instructions to cover corner to next spiral 
			
			
			var globalCounterCycle = 0;
			var globalCounter = 0;
			var elementCounter = 0;
			var check1 = false;
			var frame = 0;
			(function(p) {
				
				self.elementRender = function() {
					if( UI.Document.get()[hidden] ) {
						//console.log("CHANGED 1");
						display.focus = false;
					} else {
						//console.log("CHANGED 2");
						display.focus = true;
					}
					if(display.enabled && display.focus) {
						var delta = clock.getDelta();
						globalCounter += delta;
						//console.log(globalCounter);
						if(globalCounter > 1/30) {
							formatDisplay.RunFrame();
							globalCounterCycle += 1;
							if( globalCounterCycle > 1000000 ) {
								globalCounter = 0;
								globalCounterCycle = 0;
							}
						}
						elementCounter += delta;
						if(elementCounter > 0.8) {
							var total_frames = 4;
							var phase = 0;
							var total_angle = 180;
							p[0].Texture("stripes").Refresh();
								/*
								if(frame == 0) {
									console.log("-------------------------------------------------------------------------------")
									for( var mx = 0; mx < 4;mx++) p[mx].Size(0.15).Sides(4).Color(0xFF).AngleOffsetZ(Math.PI/2);
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh();
									frame = ( frame + 1) % total_frames;
								} else if(frame==1) {
									for( var mx = 0; mx < 4;mx++) p[mx].Size(0.25).Sides(6).Color(0xFF00).AngleOffsetZ(Math.PI/4+Math.PI/8);
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh();
									//p1.Size(0.25).Color(0xFF00).AngleOffsetZ(0);
									frame = ( frame + 1) % total_frames;
								} else if(frame==2) {
									for( var mx = 0; mx < 4;mx++) p[mx].Size(0.25).Sides(6).Color(0xFF).AngleOffsetZ(Math.PI/4);
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh();
									frame = ( frame + 1) % total_frames;
								} else if(frame==3) {
									for( var mx = 0; mx < 4;mx++) p[mx].Size(0.15).Sides(4).Color(0xFF00).AngleOffsetZ(Math.PI/8);
									for( var mx = 0; mx < 4;mx++) p[mx].Refresh();
									frame = ( frame + 1) % total_frames;
								}
								*/
								
			
							
							elementCounter = 0;
						}
					}
					if( UI.Document.get()[hidden] ) {
						//console.log("CHANGED 3");
						display.focus = false;
					} else {
						//console.log("CHANGED 4");
						display.focus = true;
					}
		
					
					
					//formatDisplay.RunFrame();
				}
			})(selected_points);			
		} else if(program=="semi-perspective2") {
			
			// bug
			
			var selected_points = [];
			function gridPoint(selected_points,tilesw,tilesh,map) {
				var packet = [tilesw,tilesh];
				var screen_sz = [2.0,2.0];
				var even_w = packet[0] %2 == 0;
				var even_h = packet[1] %2 == 0;
				var _w = screen_sz[0] / packet[0];
				var _h = screen_sz[1] / packet[1];
				var sides = 4;
				var angle_offset = Math.PI/4;
				
				_w = Math.ceil( _w * 1000000 ) / 1000000;
				_h = Math.ceil( _h * 1000000 ) / 1000000;
				
				var _sz = 0;
				var _nsz = 0;
				if(_h < _w) {
					_sz = _h;
					_nsz = _w;
				} else {
					_sz = _w;
					_nsz = _h;
				}
				var sqrt2 = Math.sqrt(2);
				var minsize = _sz/sqrt2;
				var _row = 0;
				var offset = [0,0]; // offset from 0,0
				console.log("@@@@ GRID:",_w,_h)
				scene.location.x = 0;
				scene.location.y = 0;
				scene.location.y = 0;
				var cdiff = (255-127)/packet[0];
				
				var p0 = scene
					.GotoPolarZ(1-_h/2,1,90,180)
					.GotoPolarZ(1-_w/2,1,90,180)
					.StartPoint()
					.Sides(sides)
					.AngleOffsetZ(angle_offset)
					.Size(minsize)
					.Color((0x7F+cdiff & 0xFF)<<16);
				map&&map(0,0,p0);
				p0.Refresh();
				selected_points.push(p0);
				if(packet[0]>1) {
					p0 = scene
						.GotoPolarZ(_w,1,180,180)
						.StartPoint()
						.Sides(sides)
						.AngleOffsetZ(angle_offset)
						.Size(minsize)
						.Color((0x7F+cdiff*2 & 0xFF)<<16);
					map&&map(1,0,p0);
					p0.Refresh();
					selected_points.push(p0);
					if(packet[0]>2) {
						for(var x = 2; x < packet[0];x++) {
							p0 = scene
								.GotoPolarZ(_w,1,0,180)
								.StartPoint()
								.Sides(sides)
								.AngleOffsetZ(angle_offset)
								.Size(minsize)
								.Color((0x7F+cdiff*(x+1) & 0xFF)<<16);
							map&&map(x,0,p0);
							p0.Refresh();
							selected_points.push(p0);
						}
					}
				}
				_row += 1;
				// cr lf
				while(_row < packet[1]) {
					
					p0 = scene.GotoPolarZ(2-_w,1,180,180)
						.GotoPolarZ( _h, 1, 90, 180 )
						.StartPoint()
						.Sides(sides)
						.Color((0x7F+cdiff & 0xFF)<<16)
						.Size(minsize)
						.AngleOffsetZ(angle_offset);
					map&&map(0,_row,p0);
					p0.Refresh();
					selected_points.push(p0);
					if(packet[1]>1) {
						p0 = scene.GotoPolarZ( _w, 1, 90, 180)
							.StartPoint()
							.Sides(sides)
							.Size(minsize)
							.Color((0x7F+cdiff*2 & 0xFF)<<16)
							.AngleOffsetZ(angle_offset);
						map&&map(1,_row,p0);
						p0.Refresh();
						selected_points.push(p0);	
						if(packet[1]>2) {
							for(var x = 2; x < packet[0];x++) {
								p0 = scene.GotoPolarZ( _w, 1, 0, 180)
									.StartPoint()
									.Sides(sides)
									.Color((0x7F+cdiff*(x+1) & 0xFF)<<16)
									.Size(minsize)
									.AngleOffsetZ(angle_offset);
								map&&map(0,_row,p0);
								p0.Refresh();
								selected_points.push(p0);
							}
						}
					}
					_row += 1;
				}
				
				// position cursor on top left
				var globalCounterCycle = 0;
				var globalCounter = 0;
				var elementCounter = 0;
				var check1 = false;
				var frame = 0;
				var boot = true;
				(function(p) {
					//formatDisplay.RunFrame(); // first build	
					
					self.elementRender = function() {
						var delta = clock.getDelta();
						globalCounter += delta;
						//console.log(globalCounter);
						if(globalCounter > 1/30) {
							formatDisplay.RunFrame();
							globalCounterCycle += 1;
							if( globalCounterCycle > 1000000 ) {
								globalCounter = 0;
								globalCounterCycle = 0;
							}
						}
						elementCounter += delta;
						if(elementCounter > 0.1) {
							var total_frames = 4;
							if(frame == 0) {
								if(boot) {
									console.log("BOOT");
									if(sides==4) { // correction to size, while width and height is not ready
										/*
										for( var mx = 0; mx < p.length;mx++) {
											if( "ptArrayOffset" in p[mx].offsetArray) { // this will break on angle offset, must replace Size with Width and Height of dot
												
												//p[mx].offsetArray.ptArrayOffset[1] += -(_h - _w)/2;
												p[mx].offsetArray.ptArrayOffset[3] += (_nsz - _sz)/2;
												p[mx].offsetArray.ptArrayOffset[6] += -(_nsz - _sz)/2;
												p[mx].offsetArray.ptArrayOffset[9] += -(_nsz - _sz)/2;
												p[mx].offsetArray.ptArrayOffset[12] += (_nsz - _sz)/2;
												
												//p[mx].offsetArray.ptArrayOffset[7] += -(_h - _w);
											}
										}
										for( var mx = 0; mx < p.length;mx++) p[mx].Refresh();
										*/
									}
									
									boot = false;
								}
								
								frame = ( frame + 1) % total_frames;
							} else if(frame==1) {
								//for( var mx = 0; mx < 4;mx++) p[mx].Size(0.25).Sides(6).Color(0xFF00).AngleOffsetZ(Math.PI/4+Math.PI/8);
								//for( var mx = 0; mx < 4;mx++) p[mx].Refresh();
								//p1.Size(0.25).Color(0xFF00).AngleOffsetZ(0);
								frame = ( frame + 1) % total_frames;
							}
						}
						
					}
				})(selected_points);			
				
			}
			
			// if you want to rotate grid, it must be sent as an unique object
			
			// ~ 25k triangles are a lot
			gridPoint(selected_points,2,4,function(x,y,val) {
				val.Color(0xFF00);
				//val.SelfRotateZ(10*Math.PI/180);
				val.SelfRotateY(45*Math.PI/180);
				val.z = 0;
				val.Refresh();
			});
			
			gridPoint(selected_points,4,4,function(x,y,val) {
				val.Color(0xFF);
				val.Sides(4);
				val.AngleOffsetZ(45*Math.PI/180);
				//val.Texture("stripes"); 
				val.z = 0;
				//val.SelfRotateZ(0*Math.PI/180);
				val.Refresh();
			});
			
			
			
		} else if(program=="semi-perspective3") {
			
			// bug
			
			var selected_points = [];
			function gridPoint(selected_points,tilesw,tilesh,map) {
				var packet = [tilesw,tilesh];
				var screen_sz = [2.0,2.0];
				var even_w = packet[0] %2 == 0;
				var even_h = packet[1] %2 == 0;
				var _w = screen_sz[0] / packet[0];
				var _h = screen_sz[1] / packet[1];
				var sides = 4;
				var angle_offset = Math.PI/4;
				
				_w = Math.ceil( _w * 1000000 ) / 1000000;
				_h = Math.ceil( _h * 1000000 ) / 1000000;
				
				var _sz = 0;
				var _nsz = 0;
				if(_h < _w) {
					_sz = _h;
					_nsz = _w;
				} else {
					_sz = _w;
					_nsz = _h;
				}
				var sqrt2 = Math.sqrt(2);
				var minsize = _sz/sqrt2;
				var _row = 0;
				var offset = [0,0]; // offset from 0,0
				console.log("@@@@ H:",_h,_w)
				scene.location.x = 0;
				scene.location.y = 0;
				scene.location.y = 0;
				var cdiff = (255-127)/packet[0];
				
				var p0 = scene
					.GotoPolarZ(1-_h/2,1,90,180)
					.GotoPolarZ(1-_w/2,1,90,180)
					.StartPoint()
					.Sides(sides)
					.AngleOffsetZ(angle_offset)
					.Size(minsize)
					.Color((0x7F+cdiff & 0xFF)<<16);
				map&&map(0,0,p0);
				p0.Refresh();
				selected_points.push(p0);
				if(packet[0]>1) {
					p0 = scene
						.GotoPolarZ(_w,1,180,180)
						.StartPoint()
						.Sides(sides)
						.AngleOffsetZ(angle_offset)
						.Size(minsize)
						.Color((0x7F+cdiff*2 & 0xFF)<<16);
					map&&map(1,0,p0);
					p0.Refresh();
					selected_points.push(p0);
					if(packet[0]>2) {
						for(var x = 2; x < packet[0];x++) {
							p0 = scene
								.GotoPolarZ(_w,1,0,180)
								.StartPoint()
								.Sides(sides)
								.AngleOffsetZ(angle_offset)
								.Size(minsize)
								.Color((0x7F+cdiff*(x+1) & 0xFF)<<16);
							map&&map(x,0,p0);
							p0.Refresh();
							selected_points.push(p0);
						}
					}
				}
				_row += 1;
				// cr lf
				while(_row < packet[1]) {
					
					p0 = scene.GotoPolarZ(2-_w,1,180,180)
						.GotoPolarZ( _h, 1, 90, 180 )
						.StartPoint()
						.Sides(sides)
						.Color((0x7F+cdiff & 0xFF)<<16)
						.Size(minsize)
						.AngleOffsetZ(angle_offset);
					map&&map(0,_row,p0);
					p0.Refresh();
					selected_points.push(p0);
					if(packet[1]>1) {
						p0 = scene.GotoPolarZ( _w, 1, 90, 180)
							.StartPoint()
							.Sides(sides)
							.Size(minsize)
							.Color((0x7F+cdiff*2 & 0xFF)<<16)
							.AngleOffsetZ(angle_offset);
						map&&map(1,_row,p0);
						p0.Refresh();
						selected_points.push(p0);	
						if(packet[1]>2) {
							for(var x = 2; x < packet[0];x++) {
								p0 = scene.GotoPolarZ( _w, 1, 0, 180)
									.StartPoint()
									.Sides(sides)
									.Color((0x7F+cdiff*(x+1) & 0xFF)<<16)
									.Size(minsize)
									.AngleOffsetZ(angle_offset);
								map&&map(0,_row,p0);
								p0.Refresh();
								selected_points.push(p0);
							}
						}
					}
					_row += 1;
				}
				
				// position cursor on top left
				var globalCounterCycle = 0;
				var globalCounter = 0;
				var elementCounter = 0;
				var check1 = false;
				var frame = 0;
				var boot = true;
				(function(p) {
					//formatDisplay.RunFrame(); // first build	
					
					self.elementRender = function() {
						var delta = clock.getDelta();
						globalCounter += delta;
						//console.log(globalCounter);
						if(globalCounter > 1/30) {
							formatDisplay.RunFrame();
							globalCounterCycle += 1;
							if( globalCounterCycle > 1000000 ) {
								globalCounter = 0;
								globalCounterCycle = 0;
							}
						}
						elementCounter += delta;
						if(elementCounter > 0.1) {
							var total_frames = 4;
							if(frame == 0) {
								if(boot) {
									console.log("BOOT");
									if(sides==4) { // correction to size, while width and height is not ready
										/*
										for( var mx = 0; mx < p.length;mx++) {
											if( "ptArrayOffset" in p[mx].offsetArray) { // this will break on angle offset, must replace Size with Width and Height of dot
												
												//p[mx].offsetArray.ptArrayOffset[1] += -(_h - _w)/2;
												p[mx].offsetArray.ptArrayOffset[3] += (_nsz - _sz)/2;
												p[mx].offsetArray.ptArrayOffset[6] += -(_nsz - _sz)/2;
												p[mx].offsetArray.ptArrayOffset[9] += -(_nsz - _sz)/2;
												p[mx].offsetArray.ptArrayOffset[12] += (_nsz - _sz)/2;
												
												//p[mx].offsetArray.ptArrayOffset[7] += -(_h - _w);
											}
										}
										*/
									}
									for( var mx = 0; mx < p.length;mx++) p[mx].Refresh();
									boot = false;
								}
								
								frame = ( frame + 1) % total_frames;
							} else if(frame==1) {
								//for( var mx = 0; mx < 4;mx++) p[mx].Size(0.25).Sides(6).Color(0xFF00).AngleOffsetZ(Math.PI/4+Math.PI/8);
								//for( var mx = 0; mx < 4;mx++) p[mx].Refresh();
								//p1.Size(0.25).Color(0xFF00).AngleOffsetZ(0);
								frame = ( frame + 1) % total_frames;
							}
						}
						
					}
				})(selected_points);			
				
			}
			
			// if you want to rotate grid, it must be sent as an unique object
			
			// ~ 25k triangles are a lot
			gridPoint(selected_points,1,1,function(x,y,val) {
				val.Color(0xFF00);
				val.Sides(4);
				val.Texture("stripes");
				val.SelfRotateY(90*Math.PI/180);
				val.x = 1;
				val.z = 0;
				val.Refresh();
			});
			gridPoint(selected_points,1,1,function(x,y,val) {
				val.Color(0xFF00);
				val.Sides(4);
				val.Texture("stripes");
				val.SelfRotateY(-90*Math.PI/180);
				val.x = -1;
				val.z = 0;
				val.Refresh();
			});
			
			gridPoint(selected_points,1,1,function(x,y,val) {
				val.Color(0x88);
				val.Sides(4);
				//val.Texture("stripes");
				val.SelfRotateY(Math.PI);
				val.x = 0;
				val.z = 1;
				val.Refresh();
			});
			
			
			/*
			gridPoint(selected_points,2,2,function(x,y,val) {
				val.Color(0xFF);
				val.Sides(4);
				val.AngleOffsetZ(45*Math.PI/180);
				
				val.z = 0;
				//val.SelfRotateZ(0*Math.PI/180);
				val.Refresh();
			});
			*/
			
		} 
		
		
		
	})
	.fail(function(infos) {
		console.log("@@@@@@@@@ FAIL AJAX");
	})
	.send();
	
	
	
		
		
		
		
		
		
	/*
		Disk.set("bios",data);
	}
	*/
	
});