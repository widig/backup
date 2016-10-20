

UI.boot_callback = null;
UI.boot = function(callback) {
	UI.boot_callback = callback;
	//callback();
};
UI.init = function(callback) {
	
	console.log("INIT");
	
	var self = this;
	
	self.Body = null;
	
	this.Window = Class.create("UI.Window");
	
	
	this.Window.on("load",function() {
		self.Document = Class.create("UI.Document");	
		
		//console.log("focus");
		window.focus();
		
		if(UI.boot_callback!=null) UI.boot_callback();
		
		self.Body = Class.create("UI.Body");
		
		self.Body.nodeBuild();
		
		
		self.Window.internal["UI.Window"].loaded = true;
		
		
		
		
		
		self.Body.RenderLoop();
		
		callback.apply(self);
		
		
	});
	
	this.Window.on("resize",function() {
		if(self.Body==null) {
			// not loaded yet
			
		} else {
			self.Body.setSize(window.innerWidth,window.innerHeight);
		}
	});
	
	
};







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
			if( Type.isObject(opt) ) {
				name = opt.name;
			} else if( Type.isString(opt) ) {
				name = opt;
			}
			
			var value = this.internal.Router.template[ name ] = new RouteTemplateInstance();
			value.name = name;
			value.load = load || null;
			value.unload = unload || null;
			
			
		},
		addRedirect : function(oldname,newname) {
			History.on("load",oldname,function(state,args){
				History.go("#"+newname+":" + args.join(":"));
			});
		},
		addPage : function(opt,load,unload) {
			//console.log("page",opt);
			
			var router = this;
			
			var has_template = true;
			var name = "";
			if( Type.isObject(opt) ) {
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
				
			} else if(Type.isString(opt)) {
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
				
				History.on("load",name,function(state,args){
					
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
				History.on("unload",name,function(state,args){
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
				var self = this.internal.Router;
				console.log("installing history on load " + name);
				History.on("load",name,function(state,args) {
					console.log("HISTORY LOAD:",state,args);
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
					self.current_page = value;
					
				});
				History.on("unload",name,function(state,args) {
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