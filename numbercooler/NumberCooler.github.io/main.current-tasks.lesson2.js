


Router.addPage({name:"current-tasks.lesson2",template:"base"},function(args, template, router) {
	
	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	// load previous lesson
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	
	var packet = origin_lt_container.elementNewPacket("<div id=\"container\"></div>");
	
	var window_width = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
	window_height = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
	
	origin_lt.style.position = "absolute";
	origin_lt.style.top = "0px";
	origin_lt.style.left = "0px";
	origin_lt.style.width = (window_width)+"px";
	origin_lt.style.height = (window_height)+"px";
	origin_lt.style.overflow = "hidden";
	
	window_width = 200;
	window_height = 200;
	
	
	packet.el.container.position = "absolute";
	packet.el.container.left = "0px";
	packet.el.container.top = "0px";
	
	
	console.log("BEGIN CTOR ######################################");
	
	var fw = Class.create("3Devils");
	var stages = fw.Load( JSON.parse(localStorage.getItem("lesson1.model")), {"main_stage" : packet.$.container});
	
	
	stages.main_stage.Draw();
	
	// fw.Load(json);
	// fw.stageBindings({ "basic_stage" : pointer}); /*  all the pointers that are used in */
	// vp0 = stage.viewports[0];
	// lay0 = vp0.layers[0];
	// key0 = lay0.keyframes[0];
	// scn0 = key0.scenes[0];
	// sk0 = scn0.skeletons[0];
	// cp0 = sk0.concepts[0];
	// i0 = cp0.instances[0];
	// MOD
	// stage.Draw();
	
},function() {
	document.onselectstart = selection_start_backup;
});
