
Router.addPage({name:"language",template:"base"},function(args,template,router) { // base code
	var kernel = Class.create("Kernel");
	
	
	/*
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	
	
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	
	
	var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
	h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
		
	origin_lt.style.backgroundColor = "#fff";
	origin_lt.style.width = w + "px";
	origin_lt.style.height = h + "px";
	origin_lt_container.elementsClear();
	
	
	
	
	var div = origin_lt_container.elementNew("logo","div");
	div.innerHTML = "&nbsp;NumberCooler&nbsp;";
	div.style.position = "absolute";
	
	
	
	
	
	UI.Window.on("resize",function() {
		
		var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
		h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
		
		origin_lt.style.width = w + "px";
		origin_lt.style.height = h + "px";
	
	});
});
