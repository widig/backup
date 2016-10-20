


Router.addPage({name:"tests",template:"base",locked:true},function(args,template) {

	var self = this;
	base_container.apply(this);
	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	
	var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
		h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
		
		
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	
	//console.log(" >>>",origin_lt);
	origin_lt.style.backgroundColor = "#fff";
	origin_lt.style.width = w + "px";
	origin_lt.style.height = h + "px";
	origin_lt_container.elementsClear();

	console.log("@@@@@@@@ TEST");

	var btn = origin_lt_container.elementNew("button","div");
	btn.style.position = "absolute";
	btn.style.left = "10px";
	btn.style.top = "10px";
	btn.style.width = "100px";
	btn.style.height = "100px";
	btn.style.backgroundColor = "#000";
	
	var btn2 = origin_lt_container.elementNew("button2","div");
	
	btn2.style.position = "absolute";
	btn2.style.left = "120px";
	btn2.style.top = "10px";
	btn2.style.width = "100px";
	btn2.style.height = "100px";
	btn2.style.backgroundColor = "#000";
	
	ContextManager.enableFlag("Base");
	
	
	// 14(0,15)=15
	
	
	var f0 = function() {
		console.log("click 1");
	};
	
	console.log("!!!!!!!!!! tracking begin")
	UI.Body.on("mousedown",f0);
	
	
	UI.Body.on("mousedown",function() {
		console.log("click 2");
		console.log("--------------");
	});
	console.log("!!!!!!!!!! tracking end")
	var reg = false;
	
	var f = function() {
		if(reg) {
			console.log(" flag base off disable click1 ");
			ContextManager.disableFlag("Base");
			reg = false;
		} else {
			console.log(" flag base on click1 and click2");
			ContextManager.enableFlag("Base");
			reg = true;
		}
	};
	btn.addEventListener("click",f);
	
	
	var reg2 = true;
	btn2.addEventListener("click",function() {
		if(reg2) {
			console.log("remove click1 from event list");
			UI.Body.off("mousedown",f0);
			
			reg2 = false;
		} else {
			console.log("add click1 from event list");
			UI.Body.on("mousedown",f0);
			reg2 = true;
		}
	});
	
	
	//ContextManager.enableFlag("Base");
	
	
	UI.Window.on("resize",function() {
		
		var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
		h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
		
		origin_lt.style.width = w + "px";
		origin_lt.style.height = h + "px";
	
	});
});