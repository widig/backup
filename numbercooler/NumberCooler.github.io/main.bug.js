

Router.addPage({name:"bug",template:"base"},function(args, template, router) {
	
	
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
	
	var p = origin_lt_container.elementNewPacket("<div id=\"container\"><div id=\"label\"></div></div>");
	
	function setStyle(target,style) {
		for(var key in style) {
			target.style[key] = style[key];
		}
	}
	var szw = 400, szh = 300;
	setStyle(p.el.container,{
		position : "absolute",
		left : "0px",
		top : "0px",
		width : (szw+400)+ "px",
		height : szh + "px",
		backgroundSize : szw + "px "  + szh + "px",
		backgroundPosition : "0px 0px",
		backgroundRepeat : "no-repeat",
		backgroundImage : "url(/resources/bug.svg)",
		border : "solid 1px #000",
		backgroundColor : "#000",
		cursor : "default"
	});
	
	setStyle(p.el.label,{
		position : "absolute",
		left : "413px",
		top : "10px",
		width : "372px",
		height : "275px",
		border : "solid 1px #000",
		fontFamily : "monospace",
		textAlign : "center",
		fontSize : "150px",
		lineHeight : "260px",
		color : "#fff"
	});
	p.el.label.innerHTML = "BUG";
	
	
	
	
});