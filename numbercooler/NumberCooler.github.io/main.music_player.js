

Router.addPage({name:"music_player",template:"base"},function(args, template, router) { // this is coupled, requires temporary.musicplayer defined

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
	
	var url = localStorage.getItem("temporary.musicplayer");
	
	/*
	var div = origin_lt_container.elementNew("label","div");
	div.style.fontSize = "8px";
	div.style.fontFamily = "monospace";
	div.style.padding = "10px";
	div.innerHTML = url.substring(11);
	*/
	//UI.Window.on("error",function(e) { console.log("!!!!",e); return true; });
	
	if(url!=null) {
		try {
			var youtube = origin_lt_container.elementNew("youtube","iframe");
			youtube.style.position = "absolute";
			youtube.style.left = "10px";
			youtube.style.top = "10px";
			youtube.setAttribute("width","300");
			youtube.setAttribute("height","168");
			youtube.setAttribute("frameborder","0");
			youtube.setAttribute("src",url);
		} catch(e) {
			
		}
	}
	
});