
Class.define("UI.WindowList",{
	from : ["WithArray","WithEvents"]
	, ctor : function() {
		
	}
	, proto : {
		Add : function(ui_windowdialog$0) {
			this.itemPush(ui_windowdialog$0);
			return this.itemAmount()-1;
		},
		Remove : function(ui_windowdialog$0) {
			// ui_windowdialog$0
			var i = this.itemFindFirstIndex(0,ui_windowdialog$0);
			this.itemRemoveAt(i);
		}
	}
});

UI.WindowList = Class.create("UI.WindowList");

Class.define("UI.Desktop",{
	from : ["WithDOMElements"]
	, ctor : function() {
		var this_window = {
			left : 0,
			top : 0,
			width : 328,
			height : 250,
			state : 0
		};
		this.on("nodeBuild",function(target) {
			
			var self = this;
			var doc = [];
			doc.push('<div id="Desktop" style="position:absolute;left:0px;top:0px;overflow:hidden;background-color:#d4d0c8;">');
				//doc.push('<div id="Background" style="position:relative;left:0px;top:0px;width:100%;height:100%;">');
				//doc.push('</div>');
			doc.push('</div>');
			controller = self.elementNewPacket(doc.join(""));
			self.internal["UI.Desktop"].controller = controller;
			self.data = controller.$.Desktop;
			self.el = controller.el;
			self.$ = controller.$;
			
			self.getAttribute = function(attrib) {
				if(attrib == "x") {
					return this_window.left;
				} else if(attrib == "y") {
					return this_window.top;
				} else if(attrib == "width") {
					return this_window.width;
				} else if(attrib == "height") {
					return this_window.height;
				}
			};
			self.setAttribute = function(attrib,value) {
				if(attrib == "x") {
					var tw = this_window;
					tw.left = parseInt(value);
					controller.el.Desktop.style.left = parseInt(value) + "px";
				} else if(attrib == "y") {
					var tw = this_window;
					tw.top = parseInt(value);
					controller.el.Desktop.style.top = parseInt(value) + "px";
				} else if(attrib == "width") {
					var w = parseInt(value);
					var tw = this_window;
					tw.width = parseInt(value);
					controller.el.Desktop.style.width = parseInt(value) + "px";
				} else if(attrib == "height") {
					var h = parseInt(value);
					var tw = this_window;
					tw.height = parseInt(value);
					controller.el.Desktop.style.height = parseInt(value) + "px";
				} else if(attrib == "bgcolor") {
					controller.el.Desktop.style.backgroundColor = value;
				}
			};
			self.elementDefineParent(controller.el.Desktop);
			self.emit("Desktop.load");
		});
		this.on("nodeDispose",function() {
			
			for(var key in controller.$) {
				console.log("??",key);
				this.elementRemove( key );
			}
			UI.WindowList.Remove(this);
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
		}
	}
});

Class.define("UI.WindowDialog",{ 
	from :["WithDOMElements"] 
	, ctor : function() {
		var controller = null;
		this.internal["UI.WindowDialog"].ready = false;
		this.internal["UI.WindowDialog"].messages = [];
		
		var this_window = {
			left : 0,
			top : 0,
			border : 4,
			width : 328,
			height : 250,
			r_left : 0,
			r_top : 0,
			r_width : 328,
			r_height : 250,
			state : 0,
			titleHeight : 20,
			dragStart : [0,0],
			dragCurrent : [0,0],
			moveable : false,
			title : ""
		};
		this.on("nodeBuild",function(target) {
			
			//BrowserTools.debug("UI.WindowDialog");
			
			var self = this;
			var doc = [];
			doc.push('<div id="Window" style="position:absolute;left:0px;top:0px;">');
				
				//doc.push('<div id="Contents" style="position:absolute;left:4px;top:28px;width:320px;height:216px;background-color:#d4d0c8;overflow:auto;"></div>');
				doc.push('<UI.Desktop id="Contents" x="4" y="28" width="320" height="216"></UI.Desktop>');
				doc.push('<div id="LeftTopBorder" style="position:absolute;left:0px;top:0px;width:4px;height:4px;background-color:#d4d0c8;"><canvas id="BevelLeftTopBorder"></canvas></div>');
				doc.push('<div id="TopBorder" style="position:absolute;left:4px;top:0px;width:320px;height:4px;background-color:#d4d0c8;"><canvas id="BevelTopBorder"></canvas></div>');
				doc.push('<div id="RightTopBorder" style="position:absolute;left:324px;top:0px;width:4px;height:4px;background-color:#d4d0c8;"><canvas id="BevelRightTopBorder"></canvas></div>');
				doc.push('<div id="LeftBorder" style="position:absolute;left:0px;top:4px;width:4px;height:240px;background-color:#d4d0c8;"><canvas id="BevelLeftBorder"></canvas></div>');
				doc.push('<div id="RightBorder" style="position:absolute;left:324px;top:4px;width:4px;height:240px;background-color:#d4d0c8;"><canvas id="BevelRightBorder"></canvas></div>');
				doc.push('<div id="LeftBottomBorder" style="position:absolute;left:0px;top:244px;width:4px;height:4px;background-color:#d4d0c8;"><canvas id="BevelLeftBottomBorder"></canvas></div>');
				
				doc.push('<div id="RightBottomBorder" style="position:absolute;left:324px;top:244px;width:4px;height:4px;background-color:#d4d0c8;"><canvas id="BevelRightBottomBorder"></canvas></div>');
				doc.push('<div id="BottomBorder" style="position:absolute;left:4px;top:244px;width:320px;height:4px;background-color:#d4d0c8;"><canvas id="BevelBottomBorder"></canvas></div>');
				
				doc.push('<div id="Title" style="position:absolute;left:4px;top:4px;width:310px;height:20px;background-color:#0a246a;color:white;font-weight:bold;padding-left:10px;padding-top:4px;">');
					doc.push('<img src="resources/web.png" style="position:absolute;left:3px;top:3px;width:16px;"/>');
					doc.push('<div id="TitleData" style="position:absolute;left:28px;width:310px;overflow: hidden;text-overflow: ellipsis;-o-text-overflow: ellipsis;white-space: nowrap;font-family:Helvetica;cursor:default;"></div>');
				doc.push('</div>');
				doc.push('<canvas id="MinimizeButton"></canvas>');
				doc.push('<canvas id="MaximizeButton"></canvas>');
				doc.push('<canvas id="CloseButton"></canvas>');
				doc.push('');
				
			doc.push('</div>');
			controller = self.elementNewPacket(doc.join(""));
			
			self.internal["UI.WindowDialog"].controller = controller;
			var index = UI.WindowList.Add(self);
			self.data = controller.$.Window;
			self.el = controller.el;
			self.$ = controller.$;
			var captureTitle = false;
			var _ = BrowserTools.setStyle;
			this_window.left = 20*index;
			this_window.top = 85*index;
			_(controller.el.Window,{
				left : (20*index) + "px",
				top : (85*index) + "px",
				zIndex : index,
				events : {
					mousedown : function(e) { // rearrange order, to bring to front
						var sel = null;
						var w = self.internal["UI.WindowDialog"].controller.el.Window;
						var last = parseInt(w.style.zIndex);
						w.style.zIndex = UI.WindowList.itemAmount()-1;
						for(var x = 0; x < UI.WindowList.itemAmount();x++) {
							(function(x) {
								setTimeout(function() {
									var item = UI.WindowList.itemGetAt(x);
									var w1 = item.internal["UI.WindowDialog"].controller.el.Window;
									if(item != self && parseInt(w1.style.zIndex) > last) {
										w1.style.zIndex = parseInt(w1.style.zIndex) - 1;
									}
									
								},0);
							})(x);
						}
					}
				}
			});
			_(controller.el.Title,{
				events : {
					mousedown : function(e) {
						if(this_window.moveable) {
							captureTitle = true;
						}
					}
				}
			});
			
			function canvasSet(el,x,y,w,h) {
				el.style.position = "absolute";
				el.style.left = x+"px";
				el.style.top = y+"px";
				el.setAttribute("width",w);
				el.setAttribute("height",h);
			}
			
			function button_setup(el,text,x,y,w,h) {
				var controller = {};
				var sz = [w,h];	
				canvasSet(el,x,y,sz[0],sz[1]);
				controller.capture = false;
				controller.state = 0;
				BrowserTools.setStyle(el,{
					events : {
						mousedown : function(e) {
							controller.capture = true;
							draw_pressed(el,sz);
							if(text == "Marlett_maximize") {
								if(el.getAttribute("maximized") == "false") {
									draw_text(el,text,-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
								} else {
									draw_text(el,"Marlett_restore",-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
								}
							} else {
								draw_text(el,text,-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);			
							}
							
						},
						mouseout : function(e) {
							draw_normal(el,sz);
							if(text == "Marlett_maximize") {
								if(el.getAttribute("maximized") == "false") {
									draw_text(el,text,-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
								} else {
									draw_text(el,"Marlett_restore",-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
								}
							} else {
								draw_text(el,text,-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
							}
						}
					}
				});
				UI.Window.on("mouseup",function(e) {
					if(controller.capture) {
						draw_normal(el,sz);		
						if(text == "Marlett_maximize") {
							if(el.getAttribute("maximized") == "false") {
								draw_text(el,text,-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
							} else {
								draw_text(el,"Marlett_restore",-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
							}
						} else {
							draw_text(el,text,-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
						}
					}
				});
				
				draw_normal(el,sz);
				if(text == "Marlett_maximize") {
					if(el.getAttribute("maximized") == "false") {
						draw_text(el,text,-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
					} else {
						
						draw_text(el,"Marlett_restore",-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
					}
				} else {
					draw_text(el,text,-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
				}
				return controller;
			}
			function draw_rect(ctx,color,x,y,w,h) {
				ctx.beginPath();
				ctx.fillStyle = color;
				ctx.rect(x,y,w,h);
				ctx.fill();
				ctx.closePath();
			}
			function draw_text(target,text,x,y) {
				var ctx = target.getContext("2d");
				if(text == "Marlett_close") {
					for(var x0 = 1; x0 < 5;x0++) draw_rect(ctx,"#000000",x+x0,y-10+x0,2,2);
					for(var x0 = 1; x0 < 5;x0++) draw_rect(ctx,"#000000",x+x0,y-10-x0+10,2,2);
					for(var x0 = 1; x0 < 5;x0++) draw_rect(ctx,"#000000",x-x0+10,y-10-x0+10,2,2);
					for(var x0 = 1; x0 < 5;x0++) draw_rect(ctx,"#000000",x-x0+10,y-10+x0,2,2);
				} else if(text == "Marlett_minimize") {
					draw_rect(ctx,"#000000",x,y-10-1+10,10-1,2);
				} else if(text == "Marlett_maximize") {
					draw_rect(ctx,"#000000",x,y-10-1+2,12,2);
					draw_rect(ctx,"#000000",x,y-10+2,12,10);
					draw_rect(ctx,"#d4d0c8",x+1,y-10+3,10,8);
				} else if(text == "Marlett_restore") {
					//draw_rect(ctx,"#FF0000",x,y-10-1+2,12,2);
					draw_rect(ctx,"#000000",x+3,y-10+1,9,7);
					draw_rect(ctx,"#d4d0c8",x+1+3,y-10+3,7,4);
					
					draw_rect(ctx,"#000000",x,y-10+2+3,9,7);
					draw_rect(ctx,"#d4d0c8",x+1,y-10+3+4,7,4);
				} else {
					ctx.beginPath();
					ctx.fillStyle = "#000000";
					ctx.font="16px 'Sans Serif'";
					ctx.fillText(text,x,y);
					ctx.closePath();
				}
			}
			function draw_normal(target,sz) {
				var ctx = target.getContext("2d");
				draw_rect(ctx,"#d4d0c8",0,0,sz[0],sz[1]);
				draw_rect(ctx,"#ffffff",0,0,sz[0],1);
				draw_rect(ctx,"#ffffff",0,0,1,sz[1]);
				draw_rect(ctx,"#404040",sz[0]-1,0,1,sz[1]);
				draw_rect(ctx,"#404040",0,sz[1]-1,sz[0],1);
				draw_rect(ctx,"#808080",1,sz[1]-2,sz[0]-2,1);
				draw_rect(ctx,"#808080",sz[0]-2,1,1,sz[1]-2);
			}
			function draw_pressed(target,sz) {
				var ctx = target.getContext("2d");
				draw_rect(ctx,"#d4d0c8",0,0,sz[0],sz[1]);
				draw_rect(ctx,"#000000",0,0,sz[0],1);
				draw_rect(ctx,"#000000",0,0,1,sz[1]);
				draw_rect(ctx,"#ffffff",sz[0]-1,0,1,sz[1]);
				draw_rect(ctx,"#ffffff",0,sz[1]-1,sz[0],1);
			}
			button_setup(controller.el.CloseButton,"Marlett_close",301,6,22,20);
			controller.el.CloseButton.style.backgroundColor = "white";
			
			controller.el.MaximizeButton.setAttribute("maximized","false");
			button_setup(controller.el.MaximizeButton,"Marlett_maximize",279,6,22,20);
			controller.el.MaximizeButton.style.backgroundColor = "white";
			
			
			button_setup(controller.el.MinimizeButton,"Marlett_minimize",257,6,22,20);
			controller.el.MinimizeButton.style.backgroundColor = "white";
			
			self.elementDefineParent(controller.el.Contents.el.Desktop);
			//self.elementDefineController(controller.el.Contents);
			
			BrowserTools.setStyle(controller.el.MinimizeButton,{
				events : {
					click : function() {
						controller.el.Window.style.display = "none";
						//alert("close");
					}
				}
			});
			
			BrowserTools.setStyle(controller.el.CloseButton,{
				events : {
					click : function() {
						controller.el.Window.style.display = "none";
						//alert("close");
					}
				}
			});
			
			BrowserTools.setStyle(controller.el.MaximizeButton,{
				events : {
					click : function() {
						var sz = [0,0], pos = [0,0];
						if( (this_window.state & 1) == 0) {
							this_window.r_left = this_window.left;
							this_window.r_top = this_window.top;
							this_window.r_width = this_window.width;
							this_window.r_height = this_window.height;
							
							// controller.el.Contents.el.Desktop.
							//console.log("@@",self.internal["WithDOMNode"].controller.$.Contents.complex.$.Desktop.internal["WithDOMNode"].parent);
							var desktop = null;
							if(self.internal["WithDOMNode"].controller.$.Desktop) {
								desktop = self.internal["WithDOMNode"].controller.$.Desktop.internal["WithDOMNode"].parent;
							} else {
								desktop = self.internal["WithDOMNode"].controller.$.Contents.complex.$.Desktop.internal["WithDOMNode"].parent;
							}
							
							//console.log("@@",self.internal["WithDOMNode"].controller.$.Desktop.internal["WithDOMNode"].parent);
							var w = parseInt(desktop.style.width);
							var h = parseInt(desktop.style.height);
							var bounds = UI.Window.getBounds();	
							this_window.left = 0;
							this_window.top = 0;
							this_window.width = w;
							this_window.height = h;
							// controller.el.MaximizeButton
							this.setAttribute("maximized","true");
							
							this_window.state |= 1;
							
							
						} else {
							this_window.left = this_window.r_left;
							this_window.top = this_window.r_top;
							this_window.width = this_window.r_width;
							this_window.height = this_window.r_height;
							
							this_window.state &= 0xFFFFFFFE;
							
							this.setAttribute("maximized","false");
							
						}
						self.setAttribute("x",this_window.left);
						self.setAttribute("y",this_window.top);
						self.setAttribute("width",this_window.width);
						self.setAttribute("height",this_window.height);
						//alert(JSON.stringify(this_window));
					}
				}
			});
			
			
			var el = controller.el.BevelRightBorder;
			canvasSet(el,3,0,1,240);
			el.style.backgroundColor = "black";
			
			var el = controller.el.BevelLeftBorder;
			canvasSet(el,1,0,1,240);
			el.style.backgroundColor = "white";
			
			var el = controller.el.BevelBottomBorder;
			canvasSet(el,0,3,320,1);
			el.style.backgroundColor = "black";
			
			var el = controller.el.BevelTopBorder;
			canvasSet(el,0,1,320,1);
			el.style.backgroundColor = "white";
			
			function pixelPaint(imgData,x,y,w,h,r,g,b) {
				var p = [x,y];
				imgData.data[ (p[1]*w+p[0])*4 + 0 ] = r;
				imgData.data[ (p[1]*w+p[0])*4 + 1 ] = g;
				imgData.data[ (p[1]*w+p[0])*4 + 2 ] = b;
				imgData.data[ (p[1]*w+p[0])*4 + 3 ] = 255;
			}
			var el = controller.el.BevelLeftTopBorder;
			el.setAttribute("width",4);
			el.setAttribute("height",4);
			el.style.backgroundColor = "#d4d0c8";
			el.style.position = "absolute";
			el.style.left = "0px";
			el.style.top = "0px";
			var ctx = el.getContext("2d");
			var imgData = ctx.getImageData(0,0,4,4);
			pixelPaint(imgData,1,1,4,4,255,255,255);
			pixelPaint(imgData,2,1,4,4,255,255,255);
			pixelPaint(imgData,3,1,4,4,255,255,255);
			pixelPaint(imgData,1,2,4,4,255,255,255);
			pixelPaint(imgData,1,3,4,4,255,255,255);
			ctx.putImageData(imgData,0,0);
			
			var el = controller.el.BevelRightTopBorder;
			el.setAttribute("width",4);
			el.setAttribute("height",4);
			el.style.backgroundColor = "#d4d0c8";
			el.style.position = "absolute";
			el.style.left = "0px";
			el.style.top = "0px";
			var ctx = el.getContext("2d");
			var imgData = ctx.getImageData(0,0,4,4);
			pixelPaint(imgData,0,1,4,4,255,255,255);
			pixelPaint(imgData,1,1,4,4,255,255,255);
			pixelPaint(imgData,3,0,4,4,0,0,0);
			pixelPaint(imgData,3,1,4,4,0,0,0);
			pixelPaint(imgData,3,2,4,4,0,0,0);
			pixelPaint(imgData,3,3,4,4,0,0,0);
			ctx.putImageData(imgData,0,0);
			
			var el = controller.el.BevelLeftBottomBorder;
			el.setAttribute("width",4);
			el.setAttribute("height",4);
			el.style.backgroundColor = "#d4d0c8";
			el.style.position = "absolute";
			el.style.left = "0px";
			el.style.top = "0px";
			var ctx = el.getContext("2d");
			var imgData = ctx.getImageData(0,0,4,4);
			pixelPaint(imgData,1,0,4,4,255,255,255);
			pixelPaint(imgData,1,1,4,4,255,255,255);
			pixelPaint(imgData,1,2,4,4,255,255,255);
			pixelPaint(imgData,0,3,4,4,0,0,0);
			pixelPaint(imgData,1,3,4,4,0,0,0);
			pixelPaint(imgData,2,3,4,4,0,0,0);
			pixelPaint(imgData,3,3,4,4,0,0,0);
			ctx.putImageData(imgData,0,0);
			
			var el = controller.el.BevelRightBottomBorder;
			el.setAttribute("width",4);
			el.setAttribute("height",4);
			el.style.backgroundColor = "#d4d0c8";
			el.style.position = "absolute";
			el.style.left = "0px";
			el.style.top = "0px";
			var ctx = el.getContext("2d");
			var imgData = ctx.getImageData(0,0,4,4);
			
			pixelPaint(imgData,3,0,4,4,0,0,0);
			pixelPaint(imgData,3,1,4,4,0,0,0);
			pixelPaint(imgData,3,2,4,4,0,0,0);
			pixelPaint(imgData,3,3,4,4,0,0,0);
			
			pixelPaint(imgData,0,3,4,4,0,0,0);
			pixelPaint(imgData,1,3,4,4,0,0,0);
			pixelPaint(imgData,2,3,4,4,0,0,0);
			pixelPaint(imgData,3,3,4,4,0,0,0);
			ctx.putImageData(imgData,0,0);
			
			UI.Window.on("mousedown",function(e) {
				this_window.dragStart[0] = e.pageX;
				this_window.dragStart[1] = e.pageY;
				
				this_window.dragCurrent[0] = e.pageX;
				this_window.dragCurrent[1] = e.pageY;
					
				
			});
			UI.Window.on("mousemove",function(e) {
				if(captureTitle) {
					this_window.dragCurrent[0] = e.pageX;
					this_window.dragCurrent[1] = e.pageY;
					
					var dx = this_window.dragCurrent[0] - this_window.dragStart[0];
					var dy = this_window.dragCurrent[1] - this_window.dragStart[1];
					
					_(controller.el.Window,{
						left : (this_window.left + dx) + "px",
						top : (this_window.top + dy) + "px"
					});
				}
			});
			UI.Window.on("mouseup",function(e) {
				if(captureTitle) {
					
					captureTitle = false;
					var dx = this_window.dragCurrent[0] - this_window.dragStart[0];
					var dy = this_window.dragCurrent[1] - this_window.dragStart[1];
					
					var snap_x = ( this_window.left + dx ) % 10;
					var snap_y = ( this_window.top + dy ) % 10;
					
					_(controller.el.Window,{
						left : (this_window.left + dx - snap_x) + "px",
						top : (this_window.top + dy - snap_y) + "px"
					});
					
					this_window.left += dx - snap_x;
					this_window.top += dy - snap_y;
				}
			});
			self.setTitle = function(title) {
				controller.el.TitleData.innerHTML = title;
				this_window.title = title;
			};
			self.setSize = function(w,h) {
				var tw = this_window;
				with(controller.el) {
					self.setAttribute("width",w);
					self.setAttribute("height",h);
				}
				this_window.width = w;
				this_window.height = h;
			};
			self.getAttribute = function(attrib) {
				if(attrib == "x") {
					return this_window.left;
				} else if(attrib == "y") {
					return this_window.top;
				} else if(attrib == "width") {
					return this_window.width;
				} else if(attrib == "height") {
					return this_window.height;
				} else if(attrib == "title") {
					return this_window.title;
				} else if(attrib == "moveable") {
					return this_window.moveable;
				}
			};
			self.setAttribute = function(attrib,value) {
				if(attrib == "x") {
					var tw = this_window;
					tw.left = parseInt(value);
					controller.el.Window.style.left = parseInt(value) + "px";
				} else if(attrib == "y") {
					var tw = this_window;
					tw.top = parseInt(value);
					controller.el.Window.style.top = parseInt(value) + "px";
				} else if(attrib == "width") {
					var w = parseInt(value);
					var tw = this_window;
					with(controller.el) {
						Title.style.width = (w - 2*tw.border - 10) + "px";
						TitleData.style.width = (w - 2*tw.border - 10) + "px";
						//Contents.style.width = (w - 2*tw.border) + "px";
						controller.el.Contents.el.Desktop.style.width = (w - 2*tw.border) + "px";
						
						
						TopBorder.style.width = (w - 2*tw.border) + "px";
						RightTopBorder.style.left = (w - 1*tw.border) + "px";
						RightBorder.style.left = (w - 1*tw.border) + "px";
						BottomBorder.style.width = (w - 2*tw.border) + "px";
						RightBottomBorder.style.left = (w - 1*tw.border) + "px";
						
						
						canvasSet(BevelBottomBorder,0,3,w - 2*tw.border,1);
						canvasSet(BevelTopBorder,0,1,w - 2*tw.border,1);
						
						canvasSet(CloseButton,w-2*tw.border-19,6,22,20);
						canvasSet(MaximizeButton,w-2*tw.border-41,6,22,20);
						canvasSet(MinimizeButton,w-2*tw.border-63,6,22,20);
						var sz = [22,20];
						
						draw_normal(CloseButton,sz);
						draw_text(CloseButton,"Marlett_close",-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
						
						draw_normal(MaximizeButton,sz);
						if( MaximizeButton.getAttribute("maximized") == "false") {
							draw_text(MaximizeButton,"Marlett_maximize",-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
						} else {
							draw_text(MaximizeButton,"Marlett_restore",-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
							
						}
						
						draw_normal(MinimizeButton,sz);
						draw_text(MinimizeButton,"Marlett_minimize",-1+(sz[1]/3)>>>0,(sz[1]*2/3)>>>0);
					}
					this_window.width = parseInt(value);
					
				} else if(attrib == "height") {
					var h = parseInt(value);
					var tw = this_window;
					with(controller.el) {
						//Contents.style.height = (h - 2*tw.border - 20) + "px";
						LeftBorder.style.height = (h - 2*tw.border) + "px";
						RightBorder.style.height = (h - 2*tw.border) + "px";
						LeftBottomBorder.style.top = (h - 1*tw.border) + "px";
						BottomBorder.style.top = (h - 1*tw.border) + "px";
						RightBottomBorder.style.top = (h - 1*tw.border) + "px";
						
						controller.el.Contents.el.Desktop.style.height = (h - 2*tw.border - 24) + "px";
						
						canvasSet(BevelRightBorder,3,0,1,h - 2*tw.border);
						canvasSet(BevelLeftBorder,1,0,1,h - 2*tw.border);
						
					}
					this_window.height = parseInt(value);
				} else if(attrib == "title") {
					var tw = this_window;
					controller.el.TitleData.innerHTML = value;
					tw.title = value;
				} else if(attrib == "moveable") {
					var tw = this_window;
					if(value == "true")
						tw.moveable = true;
					else if(value == "false")
						tw.moveable = false;
				}
			};
			self.setPosition = function(x,y) {
				this_window.left = x;
				this_window.top = y;
				_(controller.el.Window,{
					left : (this_window.left) + "px",
					top : (this_window.top) + "px"
				});
			};
			self.internal["UI.WindowDialog"].ready = true;
			self.emit("WindowDialog.load");

			return true;
		});
		this.on("nodeDispose",function() {
			
			for(var key in controller.$) {
				console.log("??",key);
				this.elementRemove( key );
			}
			UI.WindowList.Remove(this);
			return true;
		});
	}
	, proto : {
		
		nodeSingleTag : function() {
			return this.data;
		},
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