

Router.addPage({name:"current-tasks.lesson3",template:"base"},function(args, template, router) {
	
	
	// this loads two viewports, and respective scene to setup display in 16:9 aspect on any viewports by iterating through viewports 
	// to setup all viewports to selected aspect
	
	// todo: then create a bone geometry to check vs shader correct construction
	
	
	
	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	// minimum code to start
	
	function setStyle(target,opt) {
		for(var key in opt) {
			target.style[key] = opt[key];
		}
	}
	function arraySetStyle(target,opt) {
		for(var key in opt) {
			for(var x = 0; x < target.length;x++) {
				target[x].style[key] = opt[key];
			}
		}
	}
	
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	
	var packet = origin_lt_container.elementNewPacket(
		"<div id=\"container\"></div>"+
		"<div id=\"panelControl\">"+
			"<div id=\"uploadDiv\"><input id=\"btnUpload\" type=\"file\" name=\"fileselect[]\" multiple=\"multiple\"/></div>" +
			"<table width=\"100%\">" +
				"<tr height=\"50\">" + 
					"<td width=\"25%\" id=\"btnPrevious\"></td>" + 
					"<td width=\"25%\" id=\"btnPlayPause\"></td>" + 
					"<td width=\"25%\" id=\"btnStop\"></td>" +
					"<td width=\"25%\" id=\"btnNext\"></td>" +
				"</tr>" +
			"</table>" +
			"<table width=\"200\">"+
				"<tr height=\"25\"><td width=\"50%\" rowspan=\"2\"><textarea type=\"text\" id=\"txtId\"/></td><td id=\"btnSave\"></td></tr>"+
				"<tr height=\"25\"><td id=\"btnLoad\"></td></tr>"+
				"<tr height=\"50\"><td id=\"btnBrowser\"></td><td id=\"btnDisk\"></td></tr>" +
			"</table>"+
			"<div id=\"instanceController\">"+
				"<table width=\"200\">"+
					"<tr><td id=\"posCaption\" colspan=\"3\"></td></tr>"+
					"<tr><td id=\"posXCaption\" width=\"20\"></td><td id=\"posbarX\" width=\"100\"><div id=\"postrackerX\"></div></td><td></td></tr>"+
					"<tr><td id=\"posYCaption\" width=\"20\"></td><td id=\"posbarY\" width=\"100\"><div id=\"postrackerY\"></div></td><td></td></tr>" +
					"<tr><td id=\"posZCaption\" width=\"20\"></td><td id=\"posbarZ\" width=\"100\"><div id=\"postrackerZ\"></div></td><td></td></tr>" +
				"</table>"+
				"<table width=\"200\">"+
					"<tr><td id=\"sclCaption\" colspan=\"3\"></td></tr>"+
					"<tr><td id=\"sclXCaption\" width=\"20\"></td><td id=\"sclbarX\" width=\"100\"><div id=\"scltrackerX\"></div></td><td></td></tr>"+
					"<tr><td id=\"sclYCaption\" width=\"20\"></td><td id=\"sclbarY\" width=\"100\"><div id=\"scltrackerY\"></div></td><td></td></tr>" +
					"<tr><td id=\"sclZCaption\" width=\"20\"></td><td id=\"sclbarZ\" width=\"100\"><div id=\"scltrackerZ\"></div></td><td></td></tr>" +
				"</table>"+
				"<table width=\"200\">"+
					"<tr><td id=\"rotCaption\" colspan=\"3\"></td></tr>"+
					"<tr><td id=\"rotXCaption\" width=\"20\"></td><td id=\"rotbarX\" width=\"100\"><div id=\"rottrackerX\"></div></td><td></td></tr>"+
					"<tr><td id=\"rotYCaption\" width=\"20\"></td><td id=\"rotbarY\" width=\"100\"><div id=\"rottrackerY\"></div></td><td></td></tr>" +
					"<tr><td id=\"rotZCaption\" width=\"20\"></td><td id=\"rotbarZ\" width=\"100\"><div id=\"rottrackerZ\"></div></td><td></td></tr>" +
				"</table>"+
			"</div>" +
		"</div>" + 
		"<div id=\"imgTest\"></div>"
	);
	
	
	
	var window_width = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
	window_height = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
	
	origin_lt.style.position = "absolute";
	origin_lt.style.top = "0px";
	origin_lt.style.left = "0px";
	origin_lt.style.width = (window_width)+"px";
	origin_lt.style.height = (window_height)+"px";
	origin_lt.style.overflow = "hidden";
	
	

	
	
	var size = [window_width-200-30,window_height-10];
	
	packet.el.container.style.position = "absolute";
	packet.el.container.style.left = "0px";
	packet.el.container.style.top = "0px";
	
	window_width = window_width-200;
	window_height = window_height;
	
	
	console.log("BEGIN CTOR ######################################");
	
	
	
	
	
	var fw = Class.create("3Devils");
	
	// load
	var preload = [
	
	]; // is an array of static resources that goes to global
	
	// live
	
	var stage = fw.NewStage("main_stage",packet.$.container); // stage is a canvas element that goes to container
	stage.setSize(size[0],size[1]);
	
	
	stage.canvas.style.border = "solid 5px #000";
	// unique stage to render the scene
	
	var viewport1 = stage.NewViewport("q1",0,0,size[0],size[1]);
	//viewport1.ClearColor(255,255,255,255); // move clear color to stage
	
	// two view ports splitted in 4x4
	
	var layer1 = viewport1.NewLayer();
	// first layer at viewport
	
	var keyframe1 = layer1.NewKeyFrame();
	// keyframe duration = 1 (default)
	var camera = keyframe1.NewCamera("default_camera");
	camera.aspect = (size[0])/size[1];
	camera.fieldOfViewDeg = 1;
	
	
	var scene1 = keyframe1.NewScene("opening");
	// scene is at 0,0,0 no rotation by default
	
	var skeleton1 = scene1.NewSkeleton("base_triangle");
	// in this sample skeleton is at 0,0,0 no rotation
	
	var concept1 = skeleton1.NewConcept(); // may clone other concept here
	concept1.drawing({
		
		source: localStorage.getItem("index.shaders.vertex.flat"),
		location_points : 3,
		location : new Float32Array([
			-0.5, -0.5, 0.0,
			-0.5,  0.5, 0.0,
			 0.5, -0.5, 0.0,
			 0.5,  0.5, 0.0
		]),
		index_points : 6,
		index : new Uint16Array([
			0, 1, 2,
			2, 1, 3
		])
	});
	concept1.material({
		//source: localStorage.getItem("index.shaders.fragment.blue"),
		color : "#0f0"
	});
	concept1.wireframe(false);
	// size[1050,453]
	// 24.12651538848879 1x1
	// 46.285806655883796 2x1
	// 65.33043289184572 3x1
	// 81.05045700073242 4x1
	// 93.79623794555665 5x1
	// 104.10075759887697 6x1
	// 112.47765731811523 7x1
	// 119.35300827026367 8x1
	// 125.05894851684572 9x1
	// 129.84807586669913 10x1
	// 133.9117813110351 11x1
	// 137.39487457275374 12x1
	// 140.40833282470695 13x1
	// 143.03765106201163 14x1
	// 145.3495864868164 15x1
	// 147.39672088623044 16x1
	// 149.2210006713866  17x1
	// 150.85616302490232 18x1
	// 152.32961273193354 19x1
	// 153.6637649536132 20x1
	// 154.8771286010741 21x1
	// 155.98514556884749 22x1
	// 157.000862121582 23x1 
	// 157.93514251708976 24x1
	// 157.95058441169996 24x1
	// 158.81223297120007 25x1
	// 159.6097488404001 26x1
	// 160.34998321540007 27x1
	// 161.0387344361001 28x1
	// 161.66834259033183 29x1
	// 162.26958465576166 30x1
	// 162.8449935914001 31x1
	// 163.37345123299997 32x1
	// 163.87058258060003 33x1
	// 164.339012146 34x1
	// 164.78116607669995 35x1
	// 165.1991195678999 36x1
	// 165.5948867797999 37x1
	// 165.9701766967999 38x1
	// 166.32642364510008 39x1
	// 166.66515350349997 40x1
	// 166.9876174927 41x1
	// 167.29485321050004 42x1
	// 167.58795928959998 43x1
	// 167.86794281010006 44x1
	// 168.13559722910006 45x1
	// 168.39171600349997 46x1
	// 168.62895965576163 47x1
	// 168.864387512207 48x1
	// 169.09026336669916 49x1
	// 169.30715179443354 50x1
	// 169.51563262939445 51x1
	// 169.71616363525376 52x4
	// 169.90920257568348 53x4
	// 170.09511566162104 54x4
	// 170.2743301391601 55x4
	// 170.4472427368164 56x4
	// 170.61405181884757 57x16
	// 170.77519989013663 58x16
	// 170.9308395385741 59x16
	// 171.081443786621 60x16
	// 171.63677215576166 64x4
	// 172.1271286010742 68x16
	// 172.35140228271473 70x16
	// 172.56325531005848 72x16
	// 173.3051528930664 80x16
	// 81
	// 174.0476150512695 90x16
	// 174.18096160889988 92x1
	// 99
	// 144
	// 169
	// 174.6419143676757 100x16
	// 121x
	// 175.8158187867 128x1
	// 177.20786285400374 192x4
	// 177.319480895996 200x16
	// 225x
	// 177.90721893320003 256x1
	// 289
	// 178.21280670166016 300x16
	// 178.3245315551757 320x4
	// 324
	// 361
	// 178.60373687744135 384x4
	// 178.659553527832 400x16
	// 441
	// 178.80315399169916  448x4
	// 178.88294219970695 480x16
	// 484
	// 178.9276657104492 500x16
	// 178.91979217530013 512x1
	// 529
	// 576
	// 179.10639190673828 600x16
	// 625
	// 179.162239074707 640x16
	// 676
	// 179.23401641845703 700x16
	// 729
	// 179.301887512207 768x16
	// 784
	// 179.32978057861328  800x1
	// 841
	// 179.4042739868163 900x16
	// 961
	// 179.4172439575194 920x16
	// 179.46384429931635  1000x16
	// 179.47640228271464 1024x1
	// 179.5035781860351 1080x16
	// 1089
	// 1156
	// 1225
	// 179.58116912841794 1280x16
	// 1296
	// 1369
	// 1444
	// 179.64206695556632 1500x16
	// 1521
	// 1600
	// 1681
	// 1764
	// 1849
	// 179.72016143798825 1920x16

	// 179.7311172485351 2000x16
	// 179.7374191284178  2048x1
	var szh = 1;
	var szw = 3; // it need a display that can reach that
	
	
	//var concept1_instance1 = concept1.instance();
	//concept1_instance1.location.x = 0.0;
	
	var i = concept1.instance();
	i.scale.x = 2.0;
	
	
	/*
	for(var x = 0; x < szw;x++) {
		if(szw % 2 == 0) { // even
			
			i.location.x = - (szw/2) + 0.5 + x;
			i.scale.y = 1.0;
		} else { // odd
			var i = concept1.instance();
			i.location.x = - (szw-1)/2 + x;
			i.scale.y = 1.0;
		}
	}
	for(var x = 0; x < szh;x++) {
		if( szh % 2 == 0) {
			var i = concept1.instance();	
			i.location.y = - (szh/2) + 0.5 + x;
		} else {
			if( (szh-1)/2 == x) { } 
			else {
				var i = concept1.instance();	
				i.location.y = - (szh-1)/2 + x;
			}
		}
	}
	*/
	
	
	
	
	
	
	
	
	
	
	
	stage.Draw();
	// copy render to canvas and test if reach the border
	
	var current_fov = 1;
	var canvas_test = document.createElement("canvas");
	var tmp_sz = [ size[0],size[1]];
	var start_y = (tmp_sz[1]/2)>>>0;
	var start_x = (tmp_sz[0]/2)>>>0;
	canvas_test.setAttribute("width",tmp_sz[0]);
	canvas_test.setAttribute("height",tmp_sz[1]);
	var ctx_test = canvas_test.getContext("2d");
	var img = new Image();
	var str = [];
	var base = 1;
	var signal = 1;
	function f1(src) {
		img.onload = function() {
			var bounds = [0,0,0,0];
			ctx_test.drawImage(img, 0, 0);
			var imgData = ctx_test.getImageData(0,0,tmp_sz[0],tmp_sz[1]);
			var len0 = str.length;
			var x = 0,pos = 0;
			for(x = 0; x < len0;x++) str.pop();
			for(x = 0; x < tmp_sz[0] && x < 10;x++) { pos = (start_y*tmp_sz[0] + x) << 2; str.push(parseInt( imgData.data[pos+1] )); }
			for(x = 0; x < tmp_sz[0];x++) { pos = (start_y*tmp_sz[0] + x) << 2; if(imgData.data[pos+1] > 200) { bounds[0] = x; break; } }
			for(x = 0; x < tmp_sz[1];x++) { pos = (x*tmp_sz[0] + start_x) << 2; if(imgData.data[pos+1] > 200) { bounds[3] = x; break; } }
			for(x = tmp_sz[0]-1; x>=0;x--) { pos = (start_y*tmp_sz[0] + x) << 2; if(imgData.data[pos+1] > 200) { bounds[1] = x; break; } }
			for(x = tmp_sz[1]-1; x>=0 ;x--) { pos = (x*tmp_sz[0] + start_x) << 2; if(imgData.data[pos+1] > 200) { bounds[2] = x; break; } }
			if( signal > 0 && bounds[0] == 0 && current_fov < 179.999999999999999999999999) {
				//console.log(current_fov,"ASPECT:",(size[0]/size[1]).toPrecision(3),"BOUNDS:",bounds,tmp_sz[0],tmp_sz[1],str);
				current_fov += signal*base;
				camera.fieldOfViewDeg = current_fov;
				stage.Draw();
				f1( stage.canvas.toDataURL("image/png") );
			} else if(signal <0 && bounds[0] > 0 && current_fov < 179.999999999999999999999999) {
				current_fov += signal*base;
				camera.fieldOfViewDeg = current_fov;
				stage.Draw();
				f1( stage.canvas.toDataURL("image/png") );
			} else {
				if(base < 0.000000000000000001) {
					console.log(current_fov,"ASPECT:",(size[0]/size[1]).toPrecision(3),"BOUNDS:",bounds,tmp_sz[0],tmp_sz[1],str);
					return;
				}
				base /= 10;
				signal = -signal;
				current_fov += signal*base;
				console.log(current_fov,"ASPECT:",(size[0]/size[1]).toPrecision(3),"BOUNDS:",bounds,tmp_sz[0],tmp_sz[1],str);
				f1( stage.canvas.toDataURL("image/png") );
			}
		};
		img.src = src;
	
	}
	f1(stage.canvas.toDataURL("image/png"));
	
	
	
	var json = fw.Save();
	localStorage.setItem("lesson1.model",JSON.stringify(json));
	
	
	function print_file(file) {
		console.log("-----------------------------------------------")
		console.log("PRINT FILE");
		console.log("shaders.vs.length:",file.shaders.vs.length);
		for(var x = 0; x < file.shaders.vs.length;x++) {
			console.log(file.shaders.vs[x]);
		}
		console.log("shaders.fs.length:",file.shaders.fs.length);
		for(var x = 0; x < file.shaders.fs.length;x++) {
			console.log(file.shaders.fs[x]);
		}
		console.log("stages.length:",file.stages.length);
		for(var x0 = 0; x0 < file.stages.length;x0++) {
			var s = file.stages[x0];
			var str = "stage["+x0+"].";
			console.log(str + "name:",s.name);
			console.log(str + "padding:",s.padding);
			console.log(str + "border:",s.border);
			console.log(str + "size:",s.size);
			console.log(str + "aspect:",s.aspect);
			console.log(str + "reduce:",s.reduce);
			console.log(str + "state:",s.state);
			console.log(str + "actors.length:",s.actors.length);
			console.log(str + "viewports.length:",s.viewports.length);
			for(var x1 = 0; x1 < s.viewports.length;x1++) {
				var vp = s.viewports[x1];
				str = "stage["+x0+"].viewport["+x1+"].";
				console.log(str + "name",vp.name);
				console.log(str + "bounds",vp.bounds);
				console.log(str + "layers.length",vp.layers.length);
				for(var x2 = 0; x2 < vp.layers.length;x2++) {
					var la = vp.layers[x2];
					str = "stage["+x0+"].viewport["+x1+"].layer[" + x2 + "].";
					console.log(str + "layers.length",la.layers.length);
					console.log(str + "keyframes.length",la.keyframes.length);
					for(var x3 = 0; x3 < la.keyframes.length;x3++) {
						var ke = la.keyframes[x3];
						str = "stage["+x0+"].viewport["+x1+"].layer[" + x2 + "].keyframes[" + x3 + "].";
						var xt = 0;
						for(var k in ke.scenes) xt+=1;
						console.log(str + "scenes.length",xt);
						xt = 0;
						for(var x4 in ke.scenes) {
							var sc = ke.scenes[x4];
							str = "stage["+x0+"].viewport["+x1+"].layer[" + x2 + "].keyframes[" + x3 + "].scenes[\"" + x4 + "\"].";
							xt += 1;
							console.log( str + "name",sc.name);
							console.log( str + "location",sc.location);
							console.log( str + "scale",sc.scale);
							console.log( str + "rotation",sc.rotation[0],sc.rotation[1]);
							console.log( str + "skeletons.length",sc.skeletons.length);
							for(var x5 = 0; x5 < sc.skeletons.length;x5++) {
								var sk = sc.skeletons[x5];
								str = "stage["+x0+"].viewport["+x1+"].layer[" + x2 + "].keyframes[" + x3 + "].scenes[\"" + x4 + "\"].skeletons[" + x5 + "].";
								console.log(str + "name",sk.name);
								console.log(str + "location",sk.location);
								console.log(str + "scale",sk.scale);
								console.log(str + "rotation",sk.rotation[0],sk.rotation[1]);
								console.log(str + "skeletons.length",sk.skeletons.length);
								console.log(str + "concepts.length",sk.concepts.length);
								
								for(var x6 = 0; x6 < sk.concepts.length;x6++) {
									var cp = sk.concepts[x6];
									str = "stage["+x0+"].viewport["+x1+"].layer[" + x2 + "].keyframes[" + x3 + "].scenes[\"" + x4 + "\"].skeletons[" + x5 + "].concepts[" + x6 + "].";
									
									console.log(str + "location",cp.location);
									console.log(str + "scale",cp.scale);
									console.log(str + "rotation",cp.rotation[0],cp.rotation[1]);
									
									console.log(str + "drawing.source_index",cp.drawing.source_index);
									
									console.log(str + "drawing.location_points",cp.drawing.location_points);
									console.log(str + "drawing.location",cp.drawing.location);
									console.log(str + "drawing.index_points",cp.drawing.index_points);
									console.log(str + "drawing.index",cp.drawing.index);
									
									console.log(str + "material.source_index",cp.material.source_index);
									console.log(str + "material.color",cp.material.color);
									
									
									console.log(str + "instances.length", cp.instances.length);
									for(var x7 = 0; x7 < cp.instances.length;x7++) {
										var it = cp.instances[x7];
										str = "stage["+x0+"].viewport["+x1+"].layer[" + x2 + "].keyframes[" + x3 + "].scenes[\"" + x4 + "\"].skeletons[" + x5 + "].concepts[" + x6 + "].instances[" + x7 + "].";
										
										
										console.log(str + "location",it.location);
										console.log(str + "scale",it.scale);
										console.log(str + "rotation",it.rotation[0],it.rotation[1]);
									
									}
									
								
								}
								
							}
						}
					}
					
				}
			}
		}
		console.log("-----------------------------------------------")
	}
	
	//print_file(json);
	
	
	
	
	
	
	///------------------------------------------------------------------
	// <div panel control>
	var control = {};
	control.saveMode = 0;
	
	
	function handleFiles(files) {
		console.log("HANDLE 1",files);
		var files = files.target.files;
		for (var i = 0, f; f = files[i]; i++) {
			console.log("HANDLE 3");
			var reader = new FileReader();
			reader.onload = (function(theFile) {
				return function(e) {
					console.log(">>",e.target.result);
					var p = JSON.parse(e.target.result);
					var stages = fw.Load(p,{ "main_stage" : packet.$.container});
					stages.main_stage.Draw();
					console.log( "LOADED! ");
				};
			})(f);
			reader.readAsText(f);
			return;
		}
	}
	
	
	
	setStyle( packet.el.uploadDiv, {
		position : "absolute",
		top : "113px",
		left : "112px",
		width : "89px",
		height : "55px",
	});
	
	setStyle(packet.el.btnUpload,{
		width : "89px",
		height : "55px",
		opacity : 0.0
	});
	packet.el.uploadDiv.addEventListener("mousemove",function() {
		setStyle( packet.el.btnLoad,{ backgroundColor : "#000", color : "#FFF" });
	});
	packet.el.uploadDiv.addEventListener("mouseout",function() {
		setStyle( packet.el.btnLoad,{ backgroundColor : "#FFF", color : "#000" });
	});
	packet.el.uploadDiv.addEventListener("mouseover",function() {
		setStyle( packet.el.btnLoad,{ backgroundColor : "#000", color : "#FFF" });
	});
	setStyle( packet.el.btnLoad,{ backgroundColor : "#FFF", color : "#000" });
	packet.el.uploadDiv.addEventListener("dragover", function(e) {
		setStyle( packet.el.btnLoad,{ backgroundColor : "#000", color : "#00F" });
		e.stopPropagation();
		e.preventDefault();
		return false;
	}, false);
	packet.el.uploadDiv.addEventListener("dragleave", function(e) {
		setStyle( packet.el.btnLoad,{ backgroundColor : "#FFF", color : "#000" });
		e.stopPropagation();
		e.preventDefault();
		return false;
	
	}, false);
	packet.el.uploadDiv.addEventListener("drop", function(e) {
		console.log("drop");
		// cancel event and hover styling
		
		// fetch FileList object
		console.log("HANDLE DROP");
		var files = e.target.files || e.dataTransfer.files;
		handleFiles(files);
		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			console.log( f.name );
			
		}
		setStyle( packet.el.btnLoad,{ backgroundColor : "#FFF", color : "#000" });
		e.stopPropagation();
		e.preventDefault();
		return false;
	}, false);
	
	packet.el.uploadDiv.addEventListener("click",function(e) {
		if(control.saveMode == 1) { // localStorage
			fw.Load(JSON.parse( localStorage.getItem(packet.el.txtId.value) ));
		}
	});
	
	packet.el.btnUpload.addEventListener("change",function(e) {
		console.log("HANDLE 2");
		if(control.saveMode == 0) { // disk
			var files = e.target.files || e.dataTransfer.files;
			handleFiles(e);
		}
	});
	packet.el.btnUpload.addEventListener("click",function() {
		console.log("ok");
		
	});
	
	
	packet.el.btnUpload.addEventListener("change",function() {
		// upload file
	});
	
	
	no_selection(packet.el.panelControl);
	
	arraySetStyle([
		packet.el.btnPrevious,
		packet.el.btnPlayPause,
		packet.el.btnStop,
		packet.el.btnNext
	],{
		fontFamily : "monospace",
		fontWeight : "bold",
		fontSize : "30px",
		textAlign : "center",
		backgroundColor : "#888",
		color : "#000"
	});
	
	packet.el.btnPrevious.innerHTML = "1";
	packet.el.btnPlayPause.innerHTML = "2";
	packet.el.btnStop.innerHTML = "3";
	packet.el.btnNext.innerHTML = "4";
	
	
	
	setStyle(packet.el.panelControl,{
		position : "absolute",
		left : ( (window.innerWidth || document.documentElement.clientWidth || body.clientWidth) - 220 ) + "px",
		top : "0px",
		width : "200px",
		height : ( (window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight) - 20 ) + "px",
		cursor : "default",
		border : "solid 10px #000"
	});
	
	setStyle(packet.el.btnSave,{
		textAlign : "center",
		fontFamily : "monospace",
		fontWeight : "bold",
		fontSize : "30px",
		backgroundColor : "#FFF",
		color : "#000"
	});
	no_selection(packet.el.btnSave);
	
	packet.el.txtId.style.width = "100px";
	packet.el.txtId.style.height = "100px";
	packet.el.btnSave.innerHTML = "SAVE";
	
	
	packet.el.btnSave.addEventListener("mousemove",function(){
		setStyle(packet.el.btnSave,{
			backgroundColor : "#000",
			color : "#FFF"
		});
	});
	packet.el.btnSave.addEventListener("mouseout",function(){
		setStyle(packet.el.btnSave,{
			backgroundColor : "#FFF",
			color : "#000"
		});
	});
	packet.el.btnSave.addEventListener("mouseover",function(){
		setStyle(packet.el.btnSave,{
			backgroundColor : "#000",
			color : "#FFF"
		});
	});
	packet.el.btnSave.addEventListener("mousedown",function(){
		setStyle(packet.el.btnSave,{
			color : "#F00"
		});
		if(control.saveMode == 0) {
			var json = fw.Save();
			var filename = packet.el.txtId.value;
			Download.text( JSON.stringify(json) ,filename)
		} else if(control.saveMode==1) {
			var json = fw.Save();
			var filename = packet.el.txtId.value;
			localStorage.setItem( filename, JSON.stringify(json) );
		}
	});
	
	setStyle(packet.el.btnLoad,{
		textAlign : "center",
		fontFamily : "monospace",
		fontWeight : "bold",
		fontSize : "30px",
		backgroundColor : "#FFF",
		color : "#000"
	});
	packet.el.btnLoad.innerHTML = "LOAD";
	
	no_selection(packet.el.btnLoad);
	
	packet.el.btnLoad.addEventListener("mousemove",function(){
		setStyle(packet.el.btnLoad,{
			backgroundColor : "#000",
			color : "#FFF"
		});
	});
	packet.el.btnLoad.addEventListener("mouseout",function(){
		setStyle(packet.el.btnLoad,{
			backgroundColor : "#FFF",
			color : "#000"
		});
	});
	packet.el.btnLoad.addEventListener("mouseover",function(){
		setStyle(packet.el.btnLoad,{
			backgroundColor : "#000",
			color : "#FFF"
		});
	});
	packet.el.btnLoad.addEventListener("mousedown",function(){
		setStyle(packet.el.btnLoad,{
			color : "#00F"
		});
		
		
	});
	
	
	
	
	packet.el.btnDisk.innerHTML = "DISK";
	no_selection(packet.el.btnDisk);
	
	
	setStyle(packet.el.btnDisk,{
		textAlign : "center",
		fontFamily : "monospace",
		fontWeight : "bold",
		fontSize : "22px",
		backgroundColor : "#FFF",
		borderBottom : "solid 5px #00F",
		color : "#000"
	});
	
	
	packet.el.btnDisk.addEventListener("mousemove",function() {
		setStyle(packet.el.btnDisk,{
			backgroundColor : "#000",
			color : "#FF0"
		});
	});
	packet.el.btnDisk.addEventListener("mouseout",function() {
		setStyle(packet.el.btnDisk,{
			backgroundColor : "#FFF",
			color : "#000"
		});
	});
	packet.el.btnDisk.addEventListener("mouseover",function() {
		setStyle(packet.el.btnDisk,{
			backgroundColor : "#000",
			color : "#FF0"
		});
	});
	packet.el.btnDisk.addEventListener("mousedown",function() {
		setStyle(packet.el.btnDisk,{
			backgroundColor : "#000",
			borderBottom : "solid 5px #00F",
			color : "#0F0"
		});
		setStyle(packet.el.btnBrowser,{
			borderBottom : ""
		});
		control.saveMode = 0;
		packet.el.btnUpload.style.display = "";
	});
	
	packet.el.btnBrowser.innerHTML = "BROWSER";
	no_selection(packet.el.btnBrowser);
	setStyle(packet.el.btnBrowser,{
		textAlign : "center",
		fontFamily : "monospace",
		fontWeight : "bold",
		fontSize : "22px",
		
		backgroundColor : "#FFF",
		color : "#000"
	});
	packet.el.btnBrowser.addEventListener("mousemove",function() {
		setStyle(packet.el.btnBrowser,{
			backgroundColor : "#000",
			color : "#FF0"
		});
	});
	packet.el.btnBrowser.addEventListener("mouseout",function() {
		setStyle(packet.el.btnBrowser,{
			backgroundColor : "#FFF",
			color : "#000"
		});
	});
	packet.el.btnBrowser.addEventListener("mouseover",function() {
		setStyle(packet.el.btnBrowser,{
			backgroundColor : "#000",
			color : "#FF0"
		});
	});
	packet.el.btnBrowser.addEventListener("mousedown",function() {
		setStyle(packet.el.btnBrowser,{
			backgroundColor : "#000",
			borderBottom : "solid 5px #00F",
			color : "#0F0"
		});
		setStyle(packet.el.btnDisk,{
			borderBottom : ""
		});
		control.saveMode = 1;
		
		packet.el.btnUpload.style.display = "none";
		
	});
	
	
	
	
	
	
	
	// position controls
	function slider_container(index,label,caption,base,tracker) {
		index[ label + "Caption" ].innerHTML = caption;
		index[ label + "XCaption" ].innerHTML = "X:";
		index[ label + "YCaption" ].innerHTML = "Y:";
		index[ label + "ZCaption" ].innerHTML = "Z:";
		var caption_style = {
			fontFamily : "monospace",
			fontWeight : "bold",
			fontSize : "16px"
		};
		var base_style = {
			backgroundColor : "#000"
		}
		setStyle( index[ label + "Caption" ], caption_style);
		setStyle( index[ label + "XCaption" ], caption_style);
		setStyle( index[ label + "YCaption" ], caption_style);
		setStyle( index[ label + "ZCaption" ], caption_style);
		setStyle( index[ base + "X" ],base_style);
		setStyle( index[ base + "Y" ],base_style);
		setStyle( index[ base + "Z" ],base_style);
		var tracker_style = {
			position: "relative", left : "40px", top : "0px", width : "20px", height : "20px",
			backgroundColor : "#ff0",
			borderRadius : "50%"
		};
		setStyle(index[ tracker + "X" ],tracker_style);
		setStyle(index[ tracker + "Y" ],tracker_style);
		setStyle(index[ tracker + "Z" ],tracker_style);
		return [ index[tracker + "X"], index[tracker + "Y"], index[tracker + "Z"] ];
	}
	function slider_control(target,callback) {
		this.start_pos = [0,0];
		this.left = 40;
		this.min = 0;
		this.max = 80;
		this.value = 50;
		this.enabled = false;
		var self = this;
		target.addEventListener("mousedown",function(e) {
			self.start_pos[0] = e.screenX;
			self.start_pos[1] = e.screenY;
			self.enabled = true;
		});
		UI.Window.on("mouseup",function(e) {
			self.enabled = false;
		});
		UI.Window.on("mousemove",function(e) {
			if(self.enabled) {
				var pos = [ e.screenX,e.screenY];
				//console.log(start_pos);
				var p = [ pos[0] - self.start_pos[0], pos[1] - self.start_pos[1] ];
				
				if(p[0] + self.left < self.min) {
					self.left = self.min;
					
				} else if(p[0] + self.left > self.max) {
					self.left = self.max;
				} else {
					self.left = p[0] + self.left;
				}
				self.start_pos[0] = pos[0];
				self.start_pos[1] = pos[1];
				self.value = parseInt( 100 * ( self.left / (self.max - self.min) ) );
				var dx = self.value - 50;
				callback(dx);
				target.style.left = self.left + "px";
			}
		});
		
	}
	function bind_vec3( controls, stage, target) {
		var s = [];
		new slider_control(controls[0],function(dx) {
			target.x = 4*dx/100;
			stage.Draw();	
		});
		new slider_control(controls[1],function(dx) {
			target.y = 4*dx/100;
			stage.Draw();	
		});
		new slider_control(controls[2],function(dx) {
			target.z = 4*dx/100;
			stage.Draw();	
		});
	}
	
	packet.el.instanceController.position = "relative";
	packet.el.instanceController.style.width = "198px";
	packet.el.instanceController.style.height = "225px";
	packet.el.instanceController.style.left = "0px";
	packet.el.instanceController.style.top = "0px";
	packet.el.instanceController.style.border = "solid 1px #f00";
	packet.el.instanceController.style.overflow = "auto";
	packet.el.instanceController.style.overflowX = "hidden";
	
	var tracker1 = slider_container(packet.el,"pos","position","posbar","postracker");
	bind_vec3( tracker1, stage, scene1.location );
	
	var tracker2 = slider_container(packet.el,"scl","scale","sclbar","scltracker");
	//bind_vec3( tracker2, stage, concept1_instance1.location );
	
	// var tracker3 = slider_container(packet.el,"rot","rotation","rotbar","rottracker");
	// bind_vec3( tracker3, stage, scene1.location );
	
	
	
	UI.Window.on("resize",function() {
		
		// set rulers
		
		// set render at center with dominant left top if overscaled
		
		// set status bar
		
		// set toolbar
		
		
	});
	
	
	// fw.get("basic_stage").canvas.style -> must track at mutation
	function _main(global) {
		fw.setGlobal(global);
		var program = "default"; // sample of texture, face occlusion on left right cubes
		if(program=="default")  {
			
		}
	}
	if(preload.length>0) {
		ImportList(preload)
		.done(function(results,info) {
			// results is an array of preload data
			
			// filter here bad data
			
			_main({
				// results[0]
				// results[1]
			});
		})
		.fail(function(infos) {
			console.log("[system] preload fail.");
		})
		.send();
	} else {
		_main({});
	}
	
	
	
	
});