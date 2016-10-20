Router.addPage({name:"editor",template:"base"},function(args, template, router) {
	UI.Body.Container().style.overflow = "hidden";
	
	var parent = template.Container().elementGetContents("origin_lt");
	var parent_el = template.Container().elementGet("origin_lt");
	parent.elementsClear();
	
	parent_el.style.position = "absolute";
	parent_el.style.left = "0px";
	parent_el.style.top = "0px";
	var sz = UI.Window.getBounds();
	parent_el.style.width = sz[0] + "px";
	parent_el.style.height = sz[1] + "px";
	parent_el.style.overflow = "hidden";
	
	//parent_el.style.paddingLeft = "1px";
	
	var e = parent.elementNew("e","UI.Editor2");
	//console.log("@@@@@",e);
	e.style.width = parseInt(sz[0]) + "px";
	e.style.height = parseInt(sz[1]) + "px";
	e.style.menuHeight = "70px";
	e.Flush();
	var b = false;
	setInterval(function() {
		var sz = UI.Window.getBounds();
		if(b) {
			e.style.menuHeight = "50px";
			//e.style.width = parseInt(sz[0])/2 + "px";
			b = false;
		} else {
			e.style.menuHeight = "100px";
			//e.style.width = parseInt(sz[0]) + "px";
			b = true;
		}
		e.Flush();
	},1000);
	UI.Window.on("resize",function() {
		var sz = UI.Window.getBounds();
		parent_el.style.width = sz[0] + "px";
		parent_el.style.height = sz[1] + "px";
		
		e.style.width = parseInt(sz[0]) + "px";
		e.style.height = parseInt(sz[1]) + "px";
	});
	
	
});