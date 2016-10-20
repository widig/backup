

Router.addPage({name:"tools.tan_deg",template:"base"},function(args, template, router) { // this is coupled, requires temporary.musicplayer defined

	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	var window_width = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
	window_height = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
	
	//origin_lt.style.position = "absolute";
	origin_lt.style.width = window_width + "px";
	origin_lt.style.height = window_width + "px";
	origin_lt.style.overflowX = "hidden";
	var p = origin_lt_container.elementNewPacket(
		"<center><table id=\"table\" width=\"200\">"+
			"<tr>"+
				"<td id=\"degCaption\"></td>"+
				"<td id=\"tanCaption\"></td>"+
			"</tr>"+
		"</table></center>"
	);
	p.el.degCaption.innerHTML = "deg";
	p.el.tanCaption.innerHTML = "tan";
	
	for(var x = 0; x <= 1920;x++) {
		var tr = p.$.table.elementNew("tr" + (x), "tr");
		var td0 = p.$.table.elementGetContents("tr" + (x)).elementNew("td0_" + (x),"td");
		var td1 = p.$.table.elementGetContents("tr" + (x)).elementNew("td1_" + (x),"td");
		td0.innerHTML = 180*Math.atan(x)/Math.PI;
		td1.innerHTML = x;
	}
	

});