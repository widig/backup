
Class.define("UI.Page",{ from  : ["WithEvents"] ,
	ctor : function(args) {

	
		var internal = this.internal["UI.Page"].data = {};
		
		if(args != undefined && args != null && Object.prototype.toString.apply(args) == "[object Object]") {
			if("input" in args) {
				internal.args = args.input;
			} else {
				internal.args = [];
			}
		}
		//console.log("UI.Page ctor args:",args);
		
		
		this.wde = Class.create("WithDOMElements");
		
		this.on("UI.Page.args",function(args) {
			//console.log("PAGE ARGS RECEIVER",this);
			var stack = [this.wde];
			while(stack.length>0) {
				var target = stack.pop();
				//target.emit("UI.Page.args",[args]);
				for(var x = 0; x < target.itemAmount();x++) {
					var item = target.itemGetAt(x);
					if( target.elementIsComplex( item.name ) ) {
						if("UI.Page" in item.complex.internal) {
							item.complex.emit("UI.Page.args",[args]);
							stack.push(item.complex.wde);
							//console.log("UI.Page.args !!",item);
						} else if("WithDOMElements" in item.complex.internal) {
							item.complex.emit("UI.Page.args",[args]);
							stack.push(item.complex);
						} else {
							if("WithEvents" in item.complex.internal) {
								item.complex.emit("UI.Page.args",[args]);
							}
						}
					} else if("contents" in item){
						stack.push(item.contents);
					}
				}
			}
			return 1;
		});
		
		this.on("nodeBuild",function() {
			var div = this.container = this.wde.elementNew("container","div");
			div.style.position = "relative";
			div.style.width = "100%";
			div.style.height = "100%";
			return true;
		});
		
	}
	, proto : {
		widgetArguments : function() {
			return this.internal["UI.Page"].data.args;
		},
		widgetStart : function() {
			this.emit("widgetStart");
		},
		widgetStop : function() {
			this.emit("widgetStop");
		},
		widgetPause : function() {
			this.emit("widgetPause");
		},
		widgetResume : function() {
			this.emit("widgetResume");
		},
		widgetReset : function() {
			this.emit("widgetReset");
		},
		widgetShutdown : function() {
			this.emit("widgetShutdown");
		},
		elementRender : function(time) {
			//console.log("render page",time);
			this.reDial();
			this.wde.elementRender(time);
		},
		nodeBuild : function(target) {
			//console.log("UI.Page.nodeBuild");
			
			this.wde.elementDefineParent(target);
			this.emit("nodeBuild");
			return true;
		},
		exportContainerToPage : function(page) {
			
		},
		importContainerFromPage : function(page) {
		
		},
		Container : function() {
			return this.wde.elementGetContents("container");
		},
		nodeDispose : function() {
			this.emit("nodeDispose");
			var items = this.wde.itemClear();
			this.wde.varClear();
			delete items;
			return true;
		}
	}
});