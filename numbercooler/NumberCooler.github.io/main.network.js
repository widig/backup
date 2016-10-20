
Router.addPage({name:"network",template:"base"},function(args,template,router) { // control panel, navigate
	// expose router map
	
	
	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	
	var origin_lt_map_container = template.Container().elementGetContents("origin_lt_map"); 
	var origin_lt_map = template.Container().elementGet("origin_lt_map");
	origin_lt_map_container.elementsClear();
	
	var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
	h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
		
	//origin_lt.style.backgroundColor = "#fff";
	//origin_lt.style.width = w + "px";
	//origin_lt.style.height = h + "px";
	
	var width = 372;
	var height = 400;
	var div = origin_lt_map_container.elementNew("controller","div");
	div.style.position = "absolute";
	div.style.left = (w - width) +"px";
	div.style.top = "10px";
	div.style.width = width + "px";
	div.style.height = height + "px";
	
	var MapController = origin_lt_map_container.elementGetContents("controller");
	
	var div_header = MapController.elementNew("head","div");
	div_header.innerHTML = "Map Controller";
	div_header.style.padding = "10px";
	div_header.style.border = "solid 1px #000";
	div_header.style.backgroundColor = "#008";
	div_header.style.color = "#fff";
	
	var div_body = MapController.elementNew("body","div");
	div_body.style.border = "solid 1px #000";
	div_body.style.height = height + "px";
	div_body.style.overflowY = "scroll";
	
	var MapControllerBody = MapController.elementGetContents("body");
	
	var list = MapControllerBody.elementNew("list","table");
	list.setAttribute("cellpadding","0");
	list.setAttribute("cellspacing","0");
	list.style.width = "100%";
	var lineNr = 0;
	
	
	
	
	
	var tr = MapControllerBody.elementGetContents("list").elementNew("line"+lineNr,"tr");
		
	var td0 = MapControllerBody.elementGetContents("list").elementGetContents("line"+lineNr).elementNew("td");
	td0.innerHTML = lineNr;
	td0.style.cursor = "pointer";
	td0.style.padding = "10px";
	td0.style.backgroundColor = "#fff";
	td0.style.color = "#000";
		
	var td1 = MapControllerBody.elementGetContents("list").elementGetContents("line"+lineNr).elementNew("td");
	td1.innerHTML = "Shell";
	td1.style.cursor = "pointer";
	td1.style.padding = "10px";
	td1.style.backgroundColor = "#fff";
	td1.style.color = "#000";
	
	tr.addEventListener("mouseover",function() {
		td0.style.backgroundColor = "#000";
		td0.style.color = "#fff";
		td1.style.backgroundColor = "#000";
		td1.style.color = "#fff";
	});
	tr.addEventListener("mouseout",function() {
		td0.style.backgroundColor = "#fff";
		td0.style.color = "#000";
		td1.style.backgroundColor = "#fff";
		td1.style.color = "#000";
	});
	tr.addEventListener("click",function() {
		UI.Body.consoleSwitch();
		
	});
	lineNr++;
	
	
	router.varEach(function(key,value) {
		
		var tr = MapControllerBody.elementGetContents("list").elementNew("line"+lineNr,"tr");
		
		var td0 = MapControllerBody.elementGetContents("list").elementGetContents("line"+lineNr).elementNew("td");
		td0.innerHTML = lineNr;
		td0.style.cursor = "pointer";
		td0.style.padding = "10px";
		td0.style.backgroundColor = "#fff";
		td0.style.color = "#000";
			
		var td1 = MapControllerBody.elementGetContents("list").elementGetContents("line"+lineNr).elementNew("td");
		td1.innerHTML = key;
		td1.style.cursor = "pointer";
		td1.style.padding = "10px";
		td1.style.backgroundColor = "#fff";
		td1.style.color = "#000";
			
		tr.addEventListener("mouseover",function() {
			td0.style.backgroundColor = "#000";
			td0.style.color = "#fff";
			td1.style.backgroundColor = "#000";
			td1.style.color = "#fff";
		});
		tr.addEventListener("mouseout",function() {
			td0.style.backgroundColor = "#fff";
			td0.style.color = "#000";
			td1.style.backgroundColor = "#fff";
			td1.style.color = "#000";
		});
		tr.addEventListener("click",function() {
			History.go("#" + key);
		});
		lineNr++;
	});
});