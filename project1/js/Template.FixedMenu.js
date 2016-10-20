Router.addTemplate("FixedMenu",function(args) {
	//console.log("base template");
	base_container.apply(this);
	var origin_lt = this.Container().elementNew("origin_lt","div");
	origin_lt.style.position = "absolute";
	origin_lt.style.left = "0px";
	origin_lt.style.top = "0px";
	origin_lt.style.width = "0px";
	origin_lt.style.height = "0px";
	
	var origin_lt_menu = this.Container().elementNew("origin_lt_menu","div");
	
	origin_lt_menu.style.position = "fixed";
	origin_lt_menu.style.left = "0px";
	origin_lt_menu.style.top = "0px";
	
	var bounds = UI.Window.getBounds();
	origin_lt_menu.style.width = bounds[0] + "px";
	origin_lt_menu.style.height = "100px";
	origin_lt_menu.style.backgroundColor = "#888";
	origin_lt_menu.style.zIndex = 50;
	
	var menu = Class.create("UI.Controller");
	menu.Add("bar","origin_lt_menu",this.Container());
	
	var p = menu.Contents("bar").elementNewPacket("<div id=\"label\"></div>");
	console.log(p);
	//p.$.label
	//p.el.label
	menu.Add("label","label",menu.Contents("bar"));
	var b = false;
	setInterval(function() {
		if(b) {
			menu.Contents("label").elementsClear();
			menu.Contents("label").elementNewPacket("<span style=\"color:red;font-size:30px;\">Hello</span><span>World!</span>");
			b = false;
		} else {
			menu.Contents("label").elementsClear();
			menu.Contents("label").elementNewPacket("<span style=\"color:red;font-size:20px;\">Hello</span><span style=\"font-size:30px;\">World!</span>");
			b = true;
		}
	},500);
	//menu.Remove("label");
	console.log( ">>",menu.Get("label") );
	
	UI.Window.on("resize",function() {
		console.log("window resize");
		var bounds = UI.Window.getBounds();
		origin_lt_menu.style.width = bounds[0] + "px";
	});
	
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