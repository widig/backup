
function $(target,setup) {
	for(var key in setup) {
		if(key == "style") {
			for(var key2 in setup.style) {
				target.style[key2] = setup.style[key2];
			}
		}
	}
	return target;
}
function tag(target,tag,style) {
	target = target || doccument.getElementsByTagName("body")[0];
	var a = target.appendChild( document.createElement(tag) );
	a.style.position = "absolute";
	a.style.left = "0px";
	a.style.top = "0px";
	a.style.backgroundColor = "#000";	
	return a;
}

