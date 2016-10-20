
Router.addPage({name:"genroute",template:"base",locked:true},function(args,template,router) {
	
	
	
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
	
	
	origin_lt.style.backgroundColor = "#fff";
	origin_lt.style.width = w + "px";
	origin_lt.style.height = h + "px";
	origin_lt_container.elementsClear();
	console.log(":ROUTER",JSON.stringify(Router));
	
	var r = parseInt( Math.random()*10 ) + 1;
	console.log("DEF RANDOM ",r);
	
	function define_r() {
		router.addPage({name:(r+""),template:"base",dynamic:true,source:"404"},function(args,template,router) {	
			console.log(":ROUTER",JSON.stringify(Router));
			var self = this;
			base_container.apply(this);
			
			var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
			var origin_lt = template.Container().elementGet("origin_lt");
	
			var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
				h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
			
			origin_lt.style.backgroundColor = "#fff";
			origin_lt.style.width = w + "px";
			origin_lt.style.height = h + "px";
			origin_lt_container.elementsClear();
			
			var panel2 = origin_lt_container.elementNew("panel2","div");
			panel2.style.fontFamily = "Helvetica";
			panel2.style.fontSize = "100px";
			panel2.innerHTML = ""+r;
			
			var b = origin_lt_container.elementNew("link2","a");
			b.innerHTML = "goto 404";
			b.style.fontFamily = "Helvetica";
			b.style.fontSize = "100px";
			b.style.color= "#00f";
			b.style.cursor = "pointer";
			b.addEventListener("click",function() {
				console.log("click");
				History.go("#404");
			});
			
			origin_lt_container.nl();
			
			var c = origin_lt_container.elementNew("link3","a");
			c.innerHTML = "goto home";
			c.style.fontFamily = "Helvetica";
			c.style.fontSize = "100px";
			c.style.color= "#00f";
			c.style.cursor = "pointer";
			c.addEventListener("click",function() {
				console.log("click");
				History.go("#home");
			});
			
			UI.Window.on("resize",function() {
				
				var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
				h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
				
				origin_lt.style.width = w + "px";
				origin_lt.style.height = h + "px";
			
			});
		
		});
	}
	
	try {
		define_r();
	} catch(e) {
		console.log("@@@",e);
	}
	
	
	
	
	var panel = origin_lt_container.elementNew("panel","div");
	panel.innerHTML = "Page Not Found";
	
	
	var a = origin_lt_container.elementNew("link","a");
	a.innerHTML = "goto test";
	a.style.fontFamily = "Helvetica";
	a.style.fontSize = "100px";
	a.style.color = "#00f";
	a.style.cursor = "pointer";
	
	a.addEventListener("click",function() {
		History.go("#"+r);
	});
	
	UI.Window.on("resize",function() {
		
		var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
		h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
		
		origin_lt.style.width = w + "px";
		origin_lt.style.height = h + "px";
	
	});
	
});