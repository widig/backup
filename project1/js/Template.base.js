
var selection_start_backup = document.onselectstart;
function no_selection(target) {
	target.addEventListener("selectstart",function(e) { e.preventDefault(); return false; });
}

console.log("DEF BASE");

Router.addTemplate("base",function(args) {
	//console.log("base template");
	base_container.apply(this);
	var origin_lt = this.Container().elementNew("origin_lt","div");
	origin_lt.style.position = "absolute";
	origin_lt.style.left = "0px";
	origin_lt.style.top = "0px";
	origin_lt.style.width = "0px";
	origin_lt.style.height = "0px";
	
	var origin_lt_map = this.Container().elementNew("origin_lt_map","div");
	origin_lt_map.style.position = "absolute";
	origin_lt_map.style.left = "0px";
	origin_lt_map.style.top = "0px";
	origin_lt_map.style.width = "0px";
	origin_lt_map.style.height = "0px";
	origin_lt_map.style.zIndex = 50;
	
	var origin_rt = this.Container().elementNew("origin_rt","div");
	origin_rt.style.position = "absolute";
	origin_rt.style.right = "0px";
	origin_rt.style.top = "0px";
	origin_rt.style.width = "0px";
	origin_rt.style.height = "0px";
	
	var origin_lt_container = this.Container().elementGetContents("origin_lt");
});
function base_container() {
	this.container.style.position = "absolute";
	this.container.style.left = "0px";
	this.container.style.top = "0px";
	this.container.style.width = "1px";
	this.container.style.height = "1px";
}