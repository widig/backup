



Class.define("UI.Controller",{
	from : ["WithDOMElements"]
	, ctor : function() {
		var self = this.internal["UI.Controller"];
		self.items = {};
	}
	, proto : {
		Add : function(name,containerName,container) {
			var self = this.internal["UI.Controller"];
			if(!(name in self.items)) {
				var item = {
					name : name,
					nameInContainer:containerName,
					container : container,
					contents : container.elementGetContents(containerName)
				};
				self.items[name] = item;
				console.log("[@]",item.contents);
			}
		},
		Remove : function(name) {
			var self = this.internal["UI.Controller"];
			if(name in self.items) {
				console.log( self.items[name].nameInContainer );
				//self.items[name].container.elementsClear();
				self.items[name].container.elementRemove( self.items[name].nameInContainer );
			}
		},
		Get : function(name) {
			var self = this.internal["UI.Controller"];
			if(name in self.items) {
				return self.items[name].contents.internal["WithDOMNode"].parent;
			}
		},
		Contents : function(name) {
			var self = this.internal["UI.Controller"];
			if(name in self.items) {
				return self.items[name].contents;
			}
		}
	}
});
Class.define("UI.Page",{ from  : ["WithDOMElements"] ,
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
		
		
		this.on("UI.Page.args",function(args) {
			//console.log("PAGE ARGS RECEIVER",this);
			var stack = [this];
			while(stack.length>0) {
				var target = stack.pop();
				//target.emit("UI.Page.args",[args]);
				for(var x = 0; x < target.itemAmount();x++) {
					var item = target.itemGetAt(x);
					if( target.elementIsComplex( item.name ) ) {
						if("UI.Page" in item.complex.internal) {
							item.complex.emit("UI.Page.args",[args]);
							stack.push(item.complex);
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
			var div = this.container = this.elementNew("container","div");
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
		nodeBuild : function(target) {
			this.elementDefineParent(target);
			this.emit("nodeBuild");
			return true;
		},
		exportContainerToPage : function(page) { // print
		},
		importContainerFromPage : function(page) {
		
		},
		Container : function() {
			return this.elementGetContents("container");
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




function RoutePageInstance() {
	this.name = "";
	this.page = null;
	this.template = null;
	this.locked = false;
	this.args = [];
	this.renderId = -1;
	this.dynamic = false;
};
function RouteTemplateInstance() {
	this.name = "";
	this.page = null;
	this.args = [];
	this.loaded = false;
	this.load = null;
	this.unload = null;
	this.renderId = -1;
};

Class.define("Router",{ 
	from  :[ "WithAlias" ] 
	, ctor : function() {


		this.messages = [];
		
		this.current_page = null;
		this.current_template = null;
		
		this.internal.Router.template= {};
		
		
	}
	, proto : {
		addTemplate : function(opt,load,unload) {
			var name = "";
			if( (Object.prototype.toString.apply(opt) == "[object Object]") ) {
				name = opt.name;
			} else if( (Object.prototype.toString.apply(opt) == "[object String]") ) {
				name = opt;
			}
			
			var value = this.internal.Router.template[ name ] = new RouteTemplateInstance();
			value.name = name;
			value.load = load || null;
			value.unload = unload || null;
			
			
		},
		addRedirect : function(oldname,newname) {
			UI.History.on("load",oldname,function(state,args){
				UI.History.go("#"+newname+":" + args.join(":"));
			});
		},
		getPage : function() {
			return {
				el : this.current_page.page.elementGet("container"),
				$ : this.current_page.page.elementGetContents("container")
			};
		},
		getTemplate : function() {
			return null;
		},
		addPage : function(opt,load,unload) {
			//console.log("page",opt);
			var router = this;
			var has_template = true;
			var name = "";
			if( (Object.prototype.toString.apply(opt) == "[object Object]") ) {
				if( !("template" in opt) ) {
					has_template = false;
					//console.log("has no template for",opt.name)
				} else {
					// console.log("has template for",opt.name);
				}
				if("name" in opt) {
					name = opt.name;
				} else {
					throw "Router.page, no name defined.";
				}
				
				//console.log("..",opt.template);
				
			} else if( (Object.prototype.toString.apply(opt) == "[object String]") ) {
				has_template = false;
				name = opt;
				opt = {};
				
				
			}
			
			if(has_template) {
				
				var value = this.varGet(name);
				if(value == null) {
					value = new RoutePageInstance();
					value.name = name;
					value.dynamic = "dynamic" in opt && opt.dynamic;
					value.locked = "locked" in opt && opt.locked;
					if(value.dynamic) value.source = opt.source;
				} else {
					throw "Router.page name '" + name + "' already defined.";
				}
				
				
				
				if( !(opt.template in this.internal.Router.template) ) {
					console.log( JSON.stringify( this.internal.Router.template ) );
					// template not defined
					console.log("template ["+opt.template+ "] not found.");
					throw "Router.page, template '" + opt.template + "' not defined.";
					
				}
				
				var self = this.internal.Router;
				
				UI.History.on("load",name,function(state,args){
					
					if( !self.template[ opt.template ].loaded ) {
						//console.log( "disposing teplate1")
						// if current template is different from last template
						if(self.template[ opt.template ] != self.current_template && self.current_template != null) {
							//console.log( "disposing teplate2")
							// unload last template
							self.current_template.page.nodeDispose();
							self.current_template.loaded = false;
							self.current_template = null;
						}
						//console.log(args);
						self.template[ opt.template ].page = UI.Body.container.elementNew("page","UI.Page",{input:args});
						if( self.template[ opt.template ].load != null ) {
							//console.log( "disposing teplate3")
							//console.log("loading template ", self.template[ opt.template ].name);
							self.template[ opt.template ].load.apply( self.template[ opt.template ].page , [args,null,router])
						}
						self.template[ opt.template ].loaded = true;
					}
					
					value.template = self.template[ opt.template ].page;
					self.current_page = value;
					self.current_template = self.template[ opt.template ];
					
					
					if(value.page==null) {
						
						value.page = value.template.Container().elementNew("page", "UI.Page",{ input : args });
						
						//console.log("loading :>>?",value.name);
						
						if(args==undefined || args==null) args = "";
						load.apply(value.page,[args,value.template,router]);
						
						
						
						value.renderId = requestAnimationFrame(UI.Body.RenderLoop);
						
					} else {
					
						value.page.emit("UI.Page.args",[args]);
					}
					
					value.template.emit("reload");
					
					
					value.args = args;
					
					
				});
				UI.History.on("unload",name,function(state,args){
					console.log("unload",name);
					
					var value = self.current_page;
					
					
					//if(value.renderId != -1) cancelAnimationFrame(value.renderId);
					if(value.page!=null) value.page.nodeDispose();
					
					while(value.args.length>0) value.args.pop();
					
					//value.renderId = -1;
					
					value.page = null;
					
				});
				this.varSet(name,value);
			
			} else {
				
				var value = this.varGet(name);
				
				if(value==null) {
					value = new RoutePageInstance();
					value.name = name;
					value.locked = "locked" in opt && opt.locked;
					value.dynamic = "dynamic" in opt && opt.dynamic;
					if(value.dynamic) value.source = opt.source;
				} else {
					throw "Router.page name '" + name + "' already defined.";
				}
				this.current_page = value;
				var self = this.internal.Router;
				console.log("installing history at " + name);
				UI.History.on("load",name,function(state,args) {
					//console.log("HISTORY LOAD:",state,args);
					if(self.current_template!=null && self.current_template.loaded) {
						self.current_template.page.nodeDispose();
						self.current_template.loaded = false;
					}
					
					if(value.page == null) {
						value.page = UI.Body.container.elementNew("page", "UI.Page",{ input : args });
						if(args==undefined || args==null) args = "";
						load.apply(value.page,[args]);
						value.renderId = requestAnimationFrame(UI.Body.RenderLoop);
					} else {
						value.page.emit("UI.Page.args",[args,null,router]);
					}
					value.args = args;
					
					
				});
				UI.History.on("unload",name,function(state,args) {
					var value = self.current_page;
					
					if(value.renderId != -1) cancelAnimationFrame(value.renderId);
					if(value.page!=null) value.page.nodeDispose();
					while(value.args.length>0) value.args.pop();
					
					value.renderId = -1;
					value.page = null;
					
				});
				
				this.varSet(name,value);
				
				
			}
		},
		forceAddPage : function(opt,load,unload) {
			try {
				this.addPage(opt,load,unload);
			} catch(e) {
				this.removePage(opt);
				this.addPage(opt,load,unload);
			}
		},
		removePage : function(opt) {
			
		}
	}
});


Router = Class.create("Router");