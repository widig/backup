Class.define("UI.Button",{ 
	from :["WithDOMElements"] 
	, ctor : function() {
		this.on("nodeBuild",function(target) {
			var doc = [];
			doc.push('<div id="Button" class="UI_Button" style="position:relative;border:solid 1px #000;padding:3px;border-radius:3px;margin:3px;">button</div>');
			var controller = this.elementNewPacket(doc.join(""));
			var sz = UI.Window.getStringSize("button",controller.el.Button.style);
			BrowserTools.setStyle(
				controller.el.Button ,{
				width : sz[0] + "px",
				height : sz[1] + "px",
				cursor : "default",
				events : {
					mouseover : function() {
						BrowserTools.setStyle(
							controller.el.Button ,{
							backgroundColor : "#ccc"
						});
					},
					mouseout : function() {
						BrowserTools.setStyle(
							controller.el.Button ,{
							backgroundColor : "white"
						});
					},
					mousedown : function() {
						BrowserTools.setStyle(
							controller.el.Button ,{
							backgroundColor : "#eee"
						});
					},
					mouseup : function() {
						BrowserTools.setStyle(
							controller.el.Button ,{
							backgroundColor : "#ccc"
						});
					},
				}
			});
			this.getAttribute = function(attrib) {
				if(attrib == "text") {
					return controller.el.Button.innerHTML;
				}
			}
			this.setAttribute = function(attrib,value) {
				if(attrib == "text") {
					controller.el.Button.innerHTML = value;
					var sz = UI.Window.getStringSize(value,controller.el.Button.style);
					BrowserTools.setStyle(
						controller.el.Button ,{
						width : sz[0] + "px",
						height : sz[1] + "px"
					});
				}
			}
			this.addEventListener = function(a,b,c) {
				var evt = {};
				evt[a] = b;
				BrowserTools.setStyle(
					controller.el.Button, {
					events : evt
				})
			}
		});
		this.on("nodeDispose",function() {
			
			return true;
		});
	}
	, proto : {
		nodeBuild : function(target) {
			this.elementDefineParent(target);
			this.emit("nodeBuild");
			return true;
		},
		nodeDispose : function() {
			this.emit("nodeDispose");
			return true;
		},
	}
});