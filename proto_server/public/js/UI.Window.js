


function _Struct_UIWindow() {}
_Struct_UIWindow.prototype.data = window;
_Struct_UIWindow.prototype.loaded = false;
_Struct_UIWindow.prototype.keyboard = {};

Class.define("UI.Window", { 
	from : ["WithEvents"]
	, struct: _Struct_UIWindow
	, ctor : function() {
		
		
		var self = this.internal["UI.Window"];
		
		self.keyboard.enabled = true;
		self.keyboard.shift = false;
		self.keyboard.capslock = false;
		self.keyboard.alt = false;
		self.keyboard.ctrl = false;
		
		
		this.on("on", function(event,callback) {
			if(event=="load") {
				if(self.loaded) {
					callback();
				} else {
					self.data.addEventListener(event,callback);
				}
			} else {
				self.data.addEventListener(event,callback);
			}
			return true;
		});
		this.on("off",function(event,callback) {
			self.data.removeEventListener(event,callback);
			return true;
		});
		
		Object.defineProperty(this,"keyboard",{
			get : function() {
				return this.internal["UI.Window"].keyboard;
			}
		});
		
	}
	,proto : {
		get : function() {
			
		},
		getStringSize : function(str,style) {
			var s = document.createElement("span");
			//s.style.position = "relative";
			s.style.visibility = "hidden";
			
			BrowserTools.setStyle(s,style);
			s.style.padding = "0px";
			s.style.margin = "0px";
			s.innerHTML = str;
			UI.Body.get().appendChild(s);
			
			var w = s.offsetWidth;
			var h = s.offsetHeight;
			
			UI.Body.get().removeChild(s);
			//getStringSize
			
			return [w,h];
		},
		getBounds : function() {
			var window_width = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
			window_height = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
			return [ window_width, window_height ];
		}
	}
});