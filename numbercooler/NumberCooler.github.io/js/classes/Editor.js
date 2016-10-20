
// human memory is pure random from each live. if there is not that much of randomness then is not usefull.


// find [books|products] -> autocomplete on choice
// add [book|product] -> 
// recent [book|product]
// save -> download all
// load -> load all

// BOOKS
	// set title
	// write header
	// write data
	// add image
	// add animation control
	// add table-plot
		// add column
		// add row
		// generate plot
	// add equation
	// add spreadsheet
	// add editor
	// add editor preview
	// add page
	// remove page
	
	// parent
	// previous
	// next
	// index	
	
	// add chapter
	// add subchapter
	
	// remove this (goto previous or blank)
	
// PRODUCTS
	// add station -> framed content
	// add movie
		// add scene
	
// segundo
//$( get("test.base") ,{ backgroundColor : "#880" } );
// terceiro
//$( get("test.base.test.base"),{ backgroundColor : "#888" });
// quarto
//$( get("test.base.test.base.finalA.base"),{ backgroundColor : "#CCC" });
// quinto
//$( get("test.base.test.base.finalA.base.finalB.base"),{ backgroundColor : "#000 " });

// para construir o path 
// 1 vá direto ao nome do controle nessa classe
// 2 acesse o componente e depois o dom element
// 3 acesse o componente e depois o dom element depois o componente depois o dom element
// funciona sempre aos pares componente, dom element se elemento dom estiver aninhado(nested)
// 
// outro tipo de acesso
//    o primeiro acessa direto
//    o segundo aninhamento tem de acessar ao menos 1 componente
//    o terceiro aninhamento já depende da organização do html
			
/*
Class.define("ControlSample",{
	from : ["WithDOMElements"],
	ctor : function() {
		this.on("load",function() {
			var e = this.elementNew("a","div");
			var $ = BrowserTools.setStyle;
			$(e,{
				position : "absolute",
				left : "0px",
				top : "0px",
				width : "100px",
				height : "100px",
				backgroundColor : "#f00"
			});
		});
	}, 
	proto : {
	}
});
Class.define("Menu4",{ from : ["WithDOMElements"],
	ctor : function() {
		this.on("load",function() {
			var p = this.elementNewPacket("<div id=\"base\"></div>");
			var $ = BrowserTools.setStyle;
			$(p.el.base,{
				position : "absolute",
				left : "100px",
				top : "0px",
				width : "100px",
				height : "100px",
				backgroundColor : "#f0f"
			});
		});
	}, 
	proto : {
		
	}
});


Class.define("Menu3",{ from : ["WithDOMElements"],
	ctor : function() {
		this.on("load",function() {
			var p = this.elementNewPacket("<div id=\"base\"><Menu4 id=\"finalB\"></Menu4></div>");
			var $ = BrowserTools.setStyle;
			$(p.el.base,{
				position : "absolute",
				left : "100px",
				top : "0px",
				width : "100px",
				height : "100px",
				backgroundColor : "#f0f"
			});
		});
	}, 
	proto : {
		
	}
});


Class.define("Menu2",{ from : ["WithDOMElements"],
	ctor : function() {
		this.on("load",function() {
			var p = this.elementNewPacket("<div id=\"base\"><Menu3 id=\"finalA\"></Menu3></div>");
			var $ = BrowserTools.setStyle;
			$(p.el.base,{
				position : "absolute",
				left : "100px",
				top : "0px",
				width : "100px",
				height : "100px",
				backgroundColor : "#f0f"
			});
		});
	}, 
	proto : {
		
	}
});



Class.define("Menu",{ from : ["WithDOMElements"],
	ctor : function() {
		this.on("load",function() {
			var p = this.elementNewPacket("<div id=\"base\"><Menu2 id=\"test\"></Menu2></div>");
			var $ = BrowserTools.setStyle;
			$(p.el.base,{
				//display : "none",
				position : "absolute",
				left : "100px",
				top : "0px",
				width : "100px",
				height : "100px",
				backgroundColor : "#ff0"
			});
		});
	}, 
	proto : {
		
	}
});

Class.define("EditorSample",{ from : ["WithDOMElements"],
	ctor : function() {
		var self = this;
		var i = this.internal["Editor"].data = {};
		i.$ = null;
		i.el = null;
		
		this.on("load",function() {
			var p = this.elementNewPacket("<div id=\"base\"><Menu id=\"test\"></Menu></div>");
			i.$ = p.$;
			i.el = p.el;
			var $ = BrowserTools.setStyle;
			var get = function(path) { return self.elementX(p,path); }
			// primeiro
			$( get("base"),{
				position : "absolute",
				//display : "none",
				left : "0px",
				top : "0px",
				width : "100px",
				height : "100px",
				backgroundColor : "#00F"
			});
			// segundo
			$( get("test.base") ,{ backgroundColor : "#880" } );
			// terceiro
			$( get("test.base.test.base"),{ backgroundColor : "#888" });
			// quarto
			$( get("test.base.test.base.finalA.base"),{ backgroundColor : "#CCC" });
			// quinto
			$( get("test.base.test.base.finalA.base.finalB.base"),{ backgroundColor : "#000 " });
			
			// para construir o path 
			// 1 vá direto ao nome do controle nessa classe
			// 2 acesse o componente e depois o dom element
			// 3 acesse o componente e depois o dom element depois o componente depois o dom element
			// funciona sempre aos pares componente, dom element se elemento dom estiver aninhado(nested)
			// 
			// outro tipo de acesso
			//    o primeiro acessa direto
			//    o segundo aninhamento tem de acessar ao menos 1 componente
			//    o terceiro aninhamento já depende da organização do html
			
			
		});
	}, 
	proto : {
		
		Block : function() {
			
		}
	}
});
*/

Class.define("TextEditor",{
	from : ["WithDOMElements"],
	ctor : function() {
		var self = this;
		var $ = BrowserTools.setStyle;
		var i = this.internal["TextEditor"].data = {};
		i.loadKeys = function() {
			
		}
		i.value = "";
		i.disabled = false;
		i.mocked = false;
		i.lines = null;
		
		i.cursor = [0,0];
		i._style_link = {};
		i._style = {
			position : "relative",
			left : "0px",
			top : "0px",
			width : "800px",
			display : "",
			fontSize : "14px",
			backgroundColor : "#fff",
			color : "#000"
		};
		i.mode = "raw";
		
		
		Object.defineProperty(this,"mode",{
			get : function() { return i.mode; },
			set : function(val) { i.mode = val; }
		});
		Object.defineProperty(this,"style",{
			get : function() { return i._style_link; }
		});
		Object.defineProperty(i._style_link,"display",{
			get : function() { return i._style.display; },
			set : function(val) { 
				
				i._style.display = val; 
			}
		});
		Object.defineProperty(this,"disabled",{
			get : function() { return i.disabled; },
			set : function(val) { i.disabled = val; }
		});
		
		Object.defineProperty(this,"mocked",{
			get : function() { return i.mocked; },
			set : function(val) { i.mocked = val; }
		});
		
		Object.defineProperty(this,"innerHTML",{
			get : function() { return i.value; },
			set : function(val) { // no style defined
				i.value = val; 
				/// parser do "html"* 
				if(i.mode=="raw") {
					var lines = i.value.split("\r").join("").split("\n");
					i.cursor[0] = lines.length-1;
					i.cursor[1] = lines[i.cursor[0]].length;
					for(var x = 0; x < lines.length;x++) {
						var arr = [];
						var style = {}
						console.log(lines[x]);
						for(var y = 0; y < lines[x].length;y++) {
							arr.push([ lines[x].charAt(y), style ]);
						}
						lines[x] = arr;
					}
					i.lines = lines;
				} else if(i.mode == "html") {
					throw "not implemented";
				} else if(i.mode == "html*") {
					throw "not implemented";
				} else if(i.mode == "md") {
					throw "not implemented";
				} else {
					throw "unknown mode";
				}
				self.Flush();
			}
		});
		this.on("load",function() {
			var p = this.elementNewPacket(
				"<div id=\"base\">" + 
					"<div id=\"head\">" +
						"<UI.Menu id=\"menu\"></UI.Menu>" +
					"</div>" + 
					"<div id=\"table_body\">" +
						"<table id=\"table\" width=\"100%\"></table>"+
					"</div>" +
					"<div id=\"resizeLeftTop\"></div>" +
					"<div id=\"resizeTop\"></div>" +
					"<div id=\"resizeRightTop\"></div>" +
					"<div id=\"resizeLeft\"></div>" +
					"<div id=\"resizeRight\"></div>" +
					"<div id=\"resizeLeftBottom\"></div>" +
					"<div id=\"resizeBottom\"></div>" +
					"<div id=\"resizeRightBottom\"></div>" +
				"</div>"
			);
			i.el = p.el;
			i.$ = p.$;
			$( p.el.base, i._style );
			$( p.el.table, { 
				cursor : "text", backgroundColor : "#fff", color : "#000",
				attribs : { height : "50", cellpadding : 0, cellspacing : 0, border : 0 }  
			} );
			$( p.el.menu, {
				height : "20px",
				backgroundColor : "#eee"
			});
			p.el.menu.Flush();
			var menuitem = p.el.menu.AddHead({
				
			},"FontSize");
			menuitem.style.width = "200px";
			menuitem.AddSeparator();
			var btnInsertPage = menuitem.AddItem({
				caption : "Small",
				events : {
					click : function() { }
				}
			});
			
			return true;
		});
		this.on("unload",function() {
			
			// unload keys
			
			return true;
		});
		
		UI.Window.on("keydown",function(e) {
			if(!i.disabled) {
				//console.log("text",e.keyCode);
				i.el.table.removeAttribute("width");
				
				//console.log(i.value + ch);
				if(e.keyCode == KeyCode.LEFT) {
					
				} else if(e.keyCode == KeyCode.RIGHT) {
					
				} else if(e.keyCode == KeyCode.UP) {
					
				} else if(e.keyCode == KeyCode.DOWN) {
					
				} else if(e.keyCode == KeyCode.PAGEUP) {
					
				} else if(e.keyCode == KeyCode.PAGEDOWN) {
					
				} else if(e.keyCode == KeyCode.HOME) {
					
				} else if(e.keyCode == KeyCode.END) {
					
				} else if(e.keyCode == KeyCode.INSERT) {
					
				} else if(e.keyCode == KeyCode.DELETE) {
					
				} else if(e.keyCode == KeyCode.TAB) {
					
				} else if(e.keyCode == KeyCode.ESCAPE) {
					
				} else if(e.keyCode == KeyCode.ENTER) {
					
				} else if(e.keyCode == KeyCode.BACKSPACE) {
					
				} else if(e.keyCode == KeyCode.SPACE) {
					i.value = i.value + "&nbsp;";
					self.innerHTML = i.value; // too slow
				} else {
					var ch = String.fromCharCode(e.keyCode);
					i.value = i.value + ch;
					self.innerHTML = i.value; // too slow
				}
				
			}
		});
		UI.Window.on("keyup",function(e) {
			if(!i.disabled) {
				
				
				
			}
		});
	},
	proto : {
		Flush : function() {
			var $ = BrowserTools.setStyle;
			var i = this.internal["TextEditor"].data;
			$( i.el.base, i._style );
			
			i.$.table.elementsClear();
			
			function setLine(target) {
				$(target,{
					events : {
						mousedown : function(e) {
							// put cursor at precise char
						}
					}
				});
			}
			
			// mount current view
			if(i.lines!=null) {
				for(var x = 0; x < 40 && x < i.lines.length;x++) {
					var tr0 = i.$.table.elementNew("tr_"+x,"tr");	
					var td0 = i.$.table.elementGetContents("tr_"+x).elementNew("td0_"+x,"td");
					td0.setAttribute("width","40");
					td0.innerHTML = (x+1);
					td0.style.textAlign = "right";
					td0.style.padding = "10px";
					var td1 = i.$.table.elementGetContents("tr_"+x).elementNew("td1_"+x,"td");
					var str = [];
					for(var y = 0; y < i.lines[x].length;y++) {
						str.push(i.lines[x][y][0]);
					}
					console.log(str.join(""));
					td1.innerHTML = (str.join(""));
					td1.style.whiteSpace = "nowrap";
					setLine(td1);
				}
			}
			
			// set cursor at end
			var width = i.el.table.clientWidth;
			console.log("[[",width,"]]");
			
				
			
		},
		Select : function() {
			
		}
	}
});
Class.define("Label",{
	from : ["WithDOMElements"],
	ctor : function() {
		var self = this;
		var $ = BrowserTools.setStyle;
		var i = this.internal["Label"].data = {};
		i.value = "";
		i.cursor = [0,0];
		i.lines = null;
		i._style_link = {};
		i._style = {
			position : "relative",
			padding : "10px",
			fontSize : "30px",
			resize : "both",
			cursor : "default",
			events : {
				mousedown : function() {
					// hide data content and display texteditor
					i.el.value.style.display = "none";
					i.el.editor.style.display = "";
					i.el.editor.innerHTML = i.value;
					i.el.editor.Flush();
				},
				click : function() {
					
				}
			}
		};
		Object.defineProperty(this,"style",{
			get : function() { return i._style_link; }
		});
		Object.defineProperty(i._style_link,"position",{
			get : function() { return i._style.position; },
			set : function(val) { i._style.position = val; }
		});
		Object.defineProperty(i._style_link,"padding",{
			get : function() { return i._style.padding; } ,
			set : function(val) { i._style.padding = val; }
		});
		Object.defineProperty(i._style_link,"fontSize",{
			get : function() { return i._style.fontSize; } ,
			set : function(val) { i._style.fontSize = val; }
		});
		Object.defineProperty(i._style_link,"resize",{
			get : function() { return i._style.resize; } ,
			set : function(val) { i._style.resize = val; }
		});
		Object.defineProperty(this,"innerHTML",{
			get : function() { return i.value; },
			set : function(val) {
				i.value = val;
				i.el.value.innerHTML = val;
			}
		});
		this.on("load",function() {
			var p = this.elementNewPacket("<div id=\"data\"><span id=\"value\"></span><TextEditor id=\"editor\"></TextEditor></div>");
			p.el.editor.style.display = "none";
			p.el.editor.Flush();
			i.el = p.el;
			i.$ = p.$;
			$( p.el.data, i._style );
			return true;
		});
		this.on("unload",function() {
			this.elementRemove("data");
			return true;
		});
	},
	proto : {
		Flush : function() {
			var i = this.internal["Label"].data;
			$( i.el.data, i._style );
		}
	}
});
Class.define("PageLeaf",{ from : ["WithDOMElements"],
	ctor : function() {
		var self = this;
		var i = this.internal["PageLeaf"].data = {};
		i.$ = null;
		i.el = null;
		i.index = 2;
		i.remove_handler = null;
		Object.defineProperty(this,"remove_callback",{ get : function() {
			return i.remove_handler;
		}, set : function(val) {
			i.remove_handler = val;
		}});
		i.remove_extra_arguments = [];
		Object.defineProperty(this,"remove_extra_arguments",{
			get : function() { return i.remove_extra_arguments; }
		});
		i.remove_context = this;
		Object.defineProperty(this,"remove_context",{
			get : function() { return i.remove_context; },
			set : function(val) { i.remove_context = val; }
		});

		i.titles = 0;
		
		i.events_obj = {};
		var _dispose_link = {};
		var _dispose = {
			context : this,
			args : [],
			emit : null,
			handler : Class.create("WithEvents")
		};
		Object.defineProperty(this,"events",{
			get : function() { return i.events_obj; }
		});
		// _dispose
		Object.defineProperty(i.events_obj,"dispose",{
			get : function() { return _dispose_link; }
		});
			Object.defineProperty(_dispose_link,"context",{
				get : function() { return _dispose.context; },
				set : function(val) { _dispose.context = val; }
			});
			Object.defineProperty(_dispose_link,"args",{
				get : function() { return _dispose.args; }
			});
			Object.defineProperty(_dispose_link,"emit",{
				get : function() {
					return _dispose.emit;
				}, set : function(val) {
					_dispose.emit = val;
				}
			});
		//
		
		var get = function(path) { return self.elementX(i,path); }	
		var $ = BrowserTools.setStyle;
		Object.defineProperty(this,"index",{ 
			get : function() { 
				return function(val) {
					if(!val) {
						return i.index;
					} else {
						i.index = val; 
						var sz = UI.Window.getBounds();
						$(get("base"),{ top : ( i.index*(sz[1]) ) + "px" });
					}
				}
			} 
		});
		this.on("load",function() {
			var p = this.elementNewPacket(
				"<div id=\"base\">"+
					"<div id=\"head\">" +
						"<UI.Menu id=\"mnuMain\"></UI.Menu>" +
					"</div>" +
					"<div id=\"body\"></div>" +
				"</div>"
			);
			i.$ = p.$;
			i.el = p.el;
			
			$(p.el.body,{
				position : "relative"
			});
			var menuitem = p.el.mnuMain.AddHead({  },"Page");
			
			
			menuitem.AddItem({},"Previous Page");
			menuitem.AddItem({},"Next Page");
			var mnuRemoveThis = menuitem.AddItem({  },"Remove This");
			mnuRemoveThis.callback = function() {
				console.log("AT REMOVE THIS CALLBACK",_dispose.emit);
				_dispose.emit && _dispose.emit.apply( 
					_dispose.context, 
					_dispose.args
				);
			}
			
			menuitem.Flush();
			
			var menuitem = p.el.mnuMain.AddHead({},"Content");
			
			var btnAddTitle = menuitem.AddItem({
				events : {
					click : function() {
						
						var label = p.$.body.elementNew("title_"+i.titles,"Label");
						$( label, {
							position : "relative",
							padding : "10px",
							fontSize : "30px",
							resize : "both"
						},"[default title]");
						i.titles += 1;
						
					}
				}
			},"Add Title");
			
			var btnAddParagraph = menuitem.AddItem({  },"Add Paragraph");
			
			
			var sz = UI.Window.getBounds();
			$(get("base"),{
				position : "absolute", left : "0px", top : (i.index*sz[1])+"px", width : (sz[0])+"px", height : (sz[1])+"px",
				backgroundColor : "#F00"
			});
			UI.Window.on("resize",function() {
				console.log("resize base");
				var sz = UI.Window.getBounds();
				$(get("base"),{ top : (i.index*sz[1])+"px", width : (sz[0])+"px", height : (sz[1])+"px" });
				return true;
			});
			return true;
		});
		this.on("unload",function() {
			var get = function(path) { return self.elementX(i,path); }	
			this.elementRemove("base");
			return true;
		});
	}, 
	proto : {
		Select : function() {
			
			// add cursor history
			
		},
		AddText : function(style,value) {
			
			// 
			if(style.type == "title") {
				

			
			} else if(style.type == "content") {
				
				
			} else if(style.type == "label") { // svg, canvas, webgl
			
				
			}
			
			
		},
		Save : function(context) {
			
			// save flow
			
		},
		Load : function(context) {
			
			// load flow
			
			
		},
		AddItem : function(name) {
			
		}
	}
});



Class.define("UI.Button",{ from : ["WithDOMElements"],
	ctor : function() {
		var self = this;
		var $ = BrowserTools.setStyle;
		var i = this.internal["UI.Button"].data = {};
		var _get = function(path) { return self.elementX(i,path); }
		i.handler = null;
		Object.defineProperty(this,"callback",{ get : function() {
			return i.handler;
		}, set : function(val) {
			i.handler = val;
		}});
		i.extra_arguments = [];
		Object.defineProperty(this,"extra_arguments",{
			get : function() { return i.extra_arguments; }
		});
		i.context = this;
		Object.defineProperty(this,"context",{
			get : function() { return i.context; }
		});
		
		i._style = {
			left : "25px",
			top : "25px",
			anchor : "top|left",
			sign : "+",
			display : "flex"
		};
		i.style = {};
		Object.defineProperty(this,"style",{
			get : function() {
				return i.style;
			}
		});
		Object.defineProperty(i.style,"left",{
			get : function() { return i._style.left; },
			set : function(v) { i._style.left = v; self.Refresh(); }
		});
		Object.defineProperty(i.style,"top",{
			get : function() { return i._style.top; },
			set : function(v) { i._style.top = v; self.Refresh(); }
		})
		this.on("load",function() {
			// now must componentize with a fake css to translate button
			
			var p = this.elementNewPacket("<div id=\"circle_extension\"></div><div id=\"circle\"></div>");
			i.$ = p.$;
			i.el = p.el;
			
			var sz = UI.Window.getBounds();
			var get = function(path) { return self.elementX(p,path); }
			var add_sign = true;
			
			var pos = "top_left";
			var left = 25; //(sz[0]/2);
			var top = 25;//(sz[1]/2-25);
		
			if(pos == "top_left") {
				
			} else if(pos == "top_right") {
				
				var left = sz[0]-320; //(sz[0]/2);
				var top = 0;//(sz[1]/2-25);
			}
			if(add_sign) {
				$( get("circle"),{ display : "",position : "absolute", left : parseInt(i._style.left)+"px", top : parseInt(i._style.top )+ "px", width : "50px", height : "50px", borderRadius : "50px", backgroundColor : "#EA4", color : "#fff", cursor : "default", textAlign : "center", lineHeight : "50px", fontSize : "50px", fontWeight : "bold", border : "solid 3px #fff" },"+");				
			} else {
				$( get("circle"), { display : "none "} );
				//$( get("circle"),{ position : "absolute", left : (sz[0]/2-50/2) + "px", top : (sz[1]/2-50/2) + "px", width : "50px", height : "50px", borderRadius : "50px", backgroundColor : "#FFF", color : "#fff", cursor : "default", textAlign : "center", lineHeight : "50px", fontSize : "50px", fontWeight : "bold", border : "solid 3px #fff" });
			}
			var length = "flex";
			function mouseover() {
				$( get("circle"), { backgroundColor : "#FFF", color : "#000" } );
				$( get("circle_extension"), { backgroundColor : "#000", color : "#0f0" });
			}
			function mouseout() {
				$( get("circle"), { backgroundColor : "#EA4", color : "#FFF" } );
				$( get("circle_extension"), { backgroundColor : "#FFF", color : "#00f" });
			}
			function mousedown() {
				$( get("circle"), { backgroundColor : "#0f0" } );
			}
			function click() {
				i.handler&&i.handler.apply(i.context,i.extra_arguments);
			}
			if(length=="fixed") {
				var style = { position : "absolute", left : (parseInt(i._style.left)+50/2)+"px", top : top+"px", width : "130px", height : "50px", backgroundColor : "#fff", color : "#00f", borderTopRightRadius : "50px", borderBottomRightRadius : "50px", fontFamily : "monospace", fontSize : "20px", lineHeight : "50px", border : "solid 3px #fff", cursor : "default" };
				if(add_sign) {
					style.paddingLeft = "35px";
				} else {
					style.borderTopLeftRadius = "50px";
					style.borderBottomLeftRadius = "50px";
				}
				$( get("circle_extension"), style,"[Set Mock]");
			} else if(length == "flex") {
				var style = { position : "absolute", left : (parseInt(i._style.left)+50/2)+"px", top : (top)+"px", height : "50px", backgroundColor : "#fff", color : "#00f", borderTopRightRadius : "50px", borderBottomRightRadius : "50px", fontFamily : "monospace", fontSize : "20px", lineHeight : "50px", paddingRight : "35px", border : "solid 3px #fff", cursor : "default" };
				if(add_sign) {
					style.paddingLeft = "35px";
				} else {
					style.paddingLeft = "35px";
					style.borderTopLeftRadius = "50px";
					style.borderBottomLeftRadius = "50px";
				}
				$( get("circle_extension"),style ,"[Set Mock]");
			}
			
			$( get("circle"), { events : {
				"mouseover" : mouseover,
				"mouseout" : mouseout,
				"mousedown" : mousedown,
				"click" : click
			}});
			$( get("circle_extension"), { events : {
				"mouseover" : mouseover,
				"mouseout" : mouseout,
				"mousedown" : mousedown,
				"click" : click
			}});
			
			Object.defineProperty(self,"caption",{
				get : function() {
					return get("circle_extension").innerHTML;
				},
				set : function(val) {
					get("circle_extension").innerHTML = val;
				}
			});
			return true;
			
		});
	}, 
	proto : {
		Refresh : function() {
			var $ = BrowserTools.setStyle;
			var i = this.internal["UI.Button"].data;
			var self = this;
			var get = function(path) { return self.elementX(i,path); }
			$( get("circle"),{ left : parseInt(i._style.left)+"px", top : parseInt(i._style.top )+ "px"});
			$( get("circle_extension"),{ left : (parseInt(i._style.left)+50/2)+"px", top : parseInt(i._style.top )+ "px"});
		}
	}
});



function CreateControl(name,custom_html,options) {
	// TODO: must process "reference" in options as a router from controls in this context
	
	var ret = {};
	ret.proto = options.proto || {};
	
	ret.from = ["WithDOMElements"];
	
	if("from" in options) ret.from = ret.from.concat(options.from);
	
	
	ret.proto.Flush = function() {
		var i = this.internal[name].data;
		var keys = [];
		for(var key in i.changes) {
			//console.log(key,i.el[key],ret.changes[key]);
			BrowserTools.setStyle( i.el[key], i.changes[key] );
			// call upcoming events
			
			var evtkeys = [];
			for(var evt in i.eventqueue) {
				if(i.eventqueue[evt].length) {
					var c = i.eventqueue[evt][0];
					for(var x = 1; x < i.eventqueue[evt].length;x++) {
						if(c != i.eventqueue[evt][x]) {
							console.log("dev message: get last or flush each change? depends on how fast it is the real solution. usually faster than 30fps is lost. using only last by now.",evt,c);
							c = i.eventqueue[evt][x];
						}
					}
					this.emit( evt, [ c ]);
				}
				evtkeys.push(evt);
			}
			for(var x = 0; x < evtkeys.length;x++) {
				i.eventqueue[ evtkeys[x] ] = {};
				delete i.eventqueue[ evtkeys[x] ];
			}
			
			keys.push(key);
			
			if("Flush" in i.el[key] ) {
				i.el[key].Flush();
			}
		}
		
		
		
		
		for(var x = 0; x < keys.length;x++) {
			i.changes[keys[x]] = null;
			delete i.changes[ keys[x] ];
		}
		
		
		//BrowserTools.setStyle( i.el[key], ret.extraChanges );
		// no need to set cause it is not css
		
		
	}
	//console.log(ret.proto);
	Class.define(name,{
		from : ret.from,
		ctor : function() {
			self = this;
			var i = this.internal[name].data = {};	
			i.name = name;
			i.$ = null;
			i.el = null;
			i.get = function(path) { return self.elementX(i,path); }
			i.linkStyle = {};
			i.attribs = {};
			i.events = {};
			i.changes = {};
			i.eventqueue = {};
			
			i.self = self;

			Object.defineProperty(this,"style",{ get : function() { return i.linkStyle; } });
			for(var key in options.boot) { 
				if(key == "$") {
					// own styles, own attributes, own events
					
				} else {
					i["style_" + key] = options.boot[key];
				}
			}
			function setp(key,kval) {
				if(key == "attribs") {
					// attrib mapping goes to setAttribute and getAttribute
					
				} else if(key == "events") {
					// install event redirection
					
					/*
					function hook(target, event ) {
						target.addEventListener(event,function() {
							var args = [].splice.apply(arguments,[0]);
							self.emit( evt, args );
						});
						this.on(event,function() {
							var args = [].slice.apply(arguments,[0]);
							if(!(event in i.events)) {
								i.events[event] = [];
							}
							i.events[event].push(args);
							console.log("REPLY?",i.events[event]);
							// emit to dom? nope, this is a custom control
							console.log(" AAA ");
							//this.emit("inner"+event,args);
							
						});
					}
					for(var evt in kval) {
						
						var arr = kval[evt].split(",");
						for(var x = 0; x < arr.length;x++) {
							// set hook over 
							if( i.el == null ) {
								
								console.log("# BEEP #",evt,kval[evt]);	
								
								
								
							} else {
								
								// nunca acontece isso porque e' a definicao de classe ( NULL TIMESPAN )
								
								console.log("# BEEP 2 #",evt,kval[evt]);	
								
								hook( i.el[ arr[x] ], evt );
								
							}
							
						}
						
					}
					*/
				} else {
					var t = Object.prototype.toString.apply(kval);
					if(t == "[object Object]") {
						var c = {};
						if( "get" in kval) c.get = function() {
							return kval.get.apply(self);
						}
						if( "set" in kval) c.set = function(val) {
							kval.set.apply(self,[val]);
						}
						Object.defineProperty(i.linkStyle,key,c);
					} else if(t == "[object String]") {
						Object.defineProperty(i.linkStyle,key,{
							get : function() { 
								var str = kval;
								var split_v1 = str.split(";");
								var arr = split_v1[0].split(",");
								if(arr.length==1) { // direct map
									var mode = 2;
									for(var x = 0; x < arr[0].length;x++) {
										if(arr[0].charAt(x)==":") {
											mode = 0;
											break;
										} else if(arr[0].charAt(x)=="=") {
											mode = 1;
											break;
										}
									}
									if(mode==0) {
										var tuple = arr[0].split(":");
										if(tuple[1].indexOf("|>")!=-1) {
											var tuple1 = tuple[1].split("|>");
											var type = tuple1[1];
											var name = tuple1[0];
											if(type == "float") {
												return parseFloat( i["style_"+ tuple[0]][ name ] ); 
											} else if(type=="integer") {
												return parseInt( i["style_"+ tuple[0]][ name ] ); 
											} else if(type=="string") {
												return "" + i["style_"+ tuple[0]][ name ];
											} else {
												throw "unknown type."
											}
											
										} else {
											return "" + i["style_"+ tuple[0]][ tuple[1] ]; 
										}
									} else if(mode==1) {
										var tuple = arr[0].split("=");
										if(tuple[1].indexOf("|>")!=-1) {
											var tuple1 = tuple[1].split("|>");
											var type = tuple1[1];
											var name = tuple1[0];
											if(type == "float") {
												return parseFloat( i.el[tuple[0]].getAttribute( name ) );
											} else if(type == "integer") {
												return parseInt( i.el[tuple[0]].getAttribute( name ) );
											} else if(type == "string") {
												return "" + i.el[tuple[0]].getAttribute( name );
											} else {
												throw "unknown type."
											}
										} else {
											return "" + i.el[ tuple[0] ].getAttribute(tuple[1]);
										}
									} else {
										throw "unknown mode.";
									}
								} else { // array
									var r1 = [];
									for(var x = 0; x < arr.length;x++) {
										
										
										var mode = 2; // unkown
										for(var y = 0; y < arr[x].length;y++) {
											if(arr[x].charAt(y)==":") {
												mode = 0;
												break;
											} else if(arr[x].charAt(y)=="=") {
												mode = 1;
												break;
											}
										}
										if(mode==0) {
											var tuple = arr[x].split(":");
											if(tuple[1].indexOf("|>")!=-1) {
												var tuple1 = tuple[1].split("|>");
												var type = tuple1[1];
												var name = tuple1[0];
												if(type == "float") {
													r1.push( parseFloat( i["style_"+ tuple[0]][ name ] ) );
												} else if(type=="integer") {
													r1.push( parseInt( i["style_"+ tuple[0]][ name ] ) );
												} else if(type=="string") {
													r1.push( "" + i["style_"+ tuple[0]][ name ] );
												} else {
													throw "unknown type."
												}
												
											} else {
												return i["style_"+ tuple[0]][ tuple[1] ]; 
											}
										} else if(mode==1) {
											var tuple = arr[x].split("=");
											if(tuple[1].indexOf("|>")!=-1) {
												var tuple1 = tuple[1].split("|>");
												var type = tuple1[1];
												var name = tuple1[0];
												if(type == "float") {
													r1.push( parseFloat( i.el[tuple[0]].getAttribute( name ) ) );
												} else if(type == "integer") {
													r1.push( parseInt( i.el[tuple[0]].getAttribute( name ) ) );
												} else if(type == "string") {
													r1.push( "" + i.el[tuple[0]].getAttribute( name ) );
												} else {
													throw "unknown type."
												}
											} else {
												r1.push( ""  + i.el[ tuple[0] ].getAttribute(tuple[1]) );
											}
										} else {
											throw "unknown mode.";
										}
										
									}
									return r1;
								}
							},
							set : function(val) {
								
								//console.log(key,val,kval);
								
								var split_v1 = kval.split(";");
								var arr = split_v1[0].split(",");
								
								for(var x = 0; x < arr.length;x++) {
									
									var mode = 2; // unkown
									for(var y = 0; y < arr[x].length;y++) {
										if(arr[x].charAt(y)==":") {
											mode = 0;
											break;
										} else if(arr[x].charAt(y)=="=") {
											mode = 1;
											break;
										}
									}
									
									if(mode==0) {
										var tuple = arr[x].split(":");
										//console.log(tuple,i);
										
										if(tuple[1].indexOf("|>")!=-1) {
											var tuple1 = tuple[1].split("|>");
											var type = tuple1[1];
											var name = tuple1[0];
											var check = false;
											if(type == "float") {
												if( parseFloat( i["style_" + tuple[0] ][ name ] ) == val ) {
													check = true;
												}
											} else if(type == "integer") {
												if( parseInt( i["style_" + tuple[0] ][ name ] ) == val ) {
													check = true;
												}
											} else if(type == "string") {
												if( (""+ i["style_" + tuple[0] ][ name ] ) == val ) {
													check = true;
												}
											} else {
												throw "unknown type."
											}
											
											if(check) {
												// set value
												
												i["style_" + tuple[0] ][ name ] = val; 
												// changes to x
												if(!( tuple[0] in i.changes)) i.changes[ tuple[0] ] = {};
												i.changes[ tuple[0] ][ name ] = val;
												//console.log("!!!!!!!!!!",!!split_v1[1],!!split_v1[1] && (split_v1[1].length < 16));
												// emit event
												console.log("pre event call");
												
												
												// 5 chamadas por disparo, muito ruim
												// empilha chamada para ser efetuada depois de setar todos os valores
												
												// enqueue event
												console.log("pre event call",split_v1[1],val);
												if(!!split_v1[1]) {
													if( ! (split_v1[1] in i.eventqueue ) ) {
														i.eventqueue[ split_v1[1] ] = [];
													}
													i.eventqueue[ split_v1[1] ].push(val);
												}
												//(!!split_v1[1]) &&split_v1[1].length < 16&& i.self.emit.apply(i.self,[split_v1[1],[val]]);
												
											}
										} else {
											
											// set value
											i["style_" + tuple[0] ][ tuple[1] ] = val; 
											// changes to x
											if(!( tuple[0] in i.changes)) i.changes[ tuple[0] ] = {};
											i.changes[ tuple[0] ][ tuple[1] ] = val;
											//console.log("!!!!!!!!!!",!!split_v1[1],!!split_v1[1] && (split_v1[1].length < 16));
											
											
											
											// 5 chamadas por disparo, muito ruim
											// empilha chamada para ser efetuada depois de setar todos os valores
												
											// emit event
											console.log("pre event call",split_v1[1],val, " using ", key);
											if(!!split_v1[1]) {
												if( ! (split_v1[1] in i.eventqueue ) ) {
													i.eventqueue[ split_v1[1] ] = [];
												}
												i.eventqueue[ split_v1[1] ].push(val);
											}
											//i.eventqueue.push([i.self,split_v1[1],val]);
											
											//(!!split_v1[1]) &&split_v1[1].length < 16&& i.self.emit.apply(i.self,[split_v1[1],[val]]);
												
											
										}
									} else if(mode == 1) {
										
										//console.log("SETTING ATTRIBUTE");
										var tuple = arr[x].split("=");
										//console.log(tuple,i);
										if(tuple[1].indexOf("|>")!=-1) {
											var tuple1 = tuple[1].split("|>");
											var type = tuple1[1];
											var name = tuple1[0];
											var check = false;
											var nval = val;
											console.log(type,name,tuple[0],i.el[tuple[0]].getAttribute(name));
											if(type == "float") {
												if( parseFloat( i.el[tuple[0]].getAttribute(name) ) != val ) {
													nval = parseFloat(val);
													check = true;
												}
											} else if(type == "integer") {
												if( parseInt( i.el[tuple[0]].getAttribute(name) ) != val ) {
													nval = parseInt(val);
													check = true;
												}
											} else if(type == "string") {
												if( (""+ i.el[tuple[0]].getAttribute(name) ) != val ) {
													nval = "" + val;
													check = true;
												}
											} else {
												throw "unknown type."
											}
											if(check) {
												// set value
												i.el[tuple[0]].setAttribute( name, nval );
												
												
												// 5 chamadas por disparo, muito ruim
												// empilha chamada para ser efetuada depois de setar todos os valores
												
												console.log("pre event call",split_v1[1],val);
												if(!!split_v1[1]) {
													if( ! (split_v1[1] in i.eventqueue ) ) {
														i.eventqueue[ split_v1[1] ] = [];
													}
													i.eventqueue[ split_v1[1] ].push(val);
												}
												//(!!split_v1[1]) &&split_v1[1].length < 16&& i.self.emit.apply(i.self,[split_v1[1],[val]]);
												
												
											}
										} else {
											if(i.el[tuple[0]].getAttribute(tuple[1]) == val) {
												
											} else {
												
												i.el[ tuple[0] ].setAttribute( tuple[1], val )
												
												
												// 5 chamadas por disparo, muito ruim
												// empilha chamada para ser efetuada depois de setar todos os valores
												
												// emit event
												console.log("pre event call",split_v1[1],val);
												if(!!split_v1[1]) {
													if( ! (split_v1[1] in i.eventqueue ) ) {
														i.eventqueue[ split_v1[1] ] = [];
													}
													i.eventqueue[ split_v1[1] ].push(val);
												}
												//(!!split_v1[1]) &&split_v1[1].length < 16&& i.self.emit.apply(i.self,[split_v1[1],[val]]);
											}
										}
									}
								}
							}
						});
					}
				}
			}
			function seta(key,kval) {
				i.attribs[key] = kval;
			}
			for(var key in options.map) {
				setp(key,options.map[key]);
			}
			
			Object.defineProperty(self,"setAttribute",{
				get : function() {
					return function(key,val) {
						if("attribs" in options.map && key in options.map.attribs) {
							
							var mode = 2; // unkown
							for(var y = 0; y < arr[x].length;y++) {
								if(arr[x].charAt(y)==":") {
									mode = 0;
									break;
								} else if(arr[x].charAt(y)=="=") {
									mode = 1;
									break;
								}
							}
							if(mode == 0) {
								
								var split_v1 = options.map.attribs[key].split(":");
								var arr = split_v1[0].split(",");
								for(var x = 0; x < arr.length;x++) {
									var tuple = arr[x].split(":");
									
									var attrib_key = i.el[ tuple[0] ].getAttribute( tuple[1] );
									if(attrib_key != val ) {
										i.el[ tuple[0] ].setAttribute( tuple[1], val );
										// change
										split_v1[1]&&split_v1[1].length < 16 && i.self.emit.apply(i.self,[
											split_v1[1],
											[val]
										]);
									}
								}
								
							} else if(mode == 1) {
								
								
							} else {
								
							}
							
						} else {
							if(val == i.attribs[key]) {
								
							} else {
								i.attribs[key] = val;
							}
						}
					}
					
				}
			});
			Object.defineProperty(self,"getAttribute",{
				get : function() {
					
					return function(key) {
						if("attribs" in options.map && key in options.map.attribs) {
							var arr = options.map.attribs[key].split(",");
							if(arr.length == 1) {
								var tuple = arr.split(":");
								return i.el[ tuple[0] ].getAttribute( tuple[1] );
							} else {
								var r1 = [];
								for(var x = 0; x < arr.length;x++) {
									var tuple = arr.split(":");
									r1.push( i.el[ tuple[0] ].getAttribute( tuple[1] ) );
								}
								return r1;
							}
						} else {
							return i.attribs[key];
						}
					}
					
				}
			});
			
			self.on("load",function() {
				
				var p = self.elementNewPacket(custom_html);
				i.$ = p.$, i.el = p.el;
				for(var key in p.el) {
					if(!(("style_"+key) in i)) {
						i["style_"+key] = {};
					}
				}
				
				
				if( "events" in options ) {
					
					console.log("BEFORE CUSTOM1 CTOR")
					
					
				}
				if("$" in options.boot) {
					BrowserTools.setStyle( self, options.boot.$ );
				}
				for(var key in options.boot) {
					if(key=="$") {
					} else {
						BrowserTools.setStyle( i.el[ key ], i["style_"+key] )
					}
				}
				
				
				
				
				
				// run before constructor
				
				options.ctor&&options.ctor.apply(self,[ i, BrowserTools.setStyle ]);
				
		
				// run after constructor
				
				// set events
				
				function set_evt(key,options) {
					self.on(key, function(e,i,$) {
						
						console.log("pre event call");
						options.events[key].apply(self,[e,self.internal[ self.internal.type ].data,BrowserTools.setStyle]);
						return true;
					});
				}
				function set_client_evt(key,target) {
					var config = { events : {} };
					config.events[ key ] = function(e) {
						//	console.log(target,i.el[target]); // i.el[target] e' o elemento que recebe o evento
						// NEED prevent default ????????
						//var from = target;
						console.log("before emit",key);
						var r = self.emit(key,[e, i, BrowserTools.setStyle  ]); // component events had the event trigger and css controls
						console.log("after emit",key);
						return r;
					};
					BrowserTools.setStyle.apply(self, [  i.el[ target ], config ]);
				}
				if( "events" in options ) {
					//console.log("AFTER CUSTOM1 CTOR")
					// options definition event for this component
					for(var key in options.events) set_evt(key,options);
					// mapping dom element call
					if( "map" in options ) {
						if("events" in  options.map) {
							for(var evt in options.map.events) {
								var arr = options.map.events[evt].split(",");
								for(var x = 0; x < arr.length;x++) {
									
									console.log("SET EVENT",evt);
									set_client_evt(evt,arr[x],x);
								}
							}
						}
					}
				}
		
				
				return true;
			});
			self.on("unload",function() {
				
				return true;
			});
		},
		proto : ret.proto
	});
	return ret;
}



// sample of custom control
var Custom1Def = CreateControl("UI.Custom1","<div id=\"lt\"><div id=\"c\"></div><div id=\"rb\"></div></div>",{
	from : [],
	map : {
		position : "lt:position",
		left : "lt:left",
		top : "lt:top",
		width : {
			get : function() {
				var i = this.internal["UI.Custom1"].data;
				return ( parseInt( i.style_lt.width ) + parseInt( i.style_c.width ) + parseInt( i.style_rb.width ) ) + "px";
			},
			set : function(val) {
				var w = parseInt( parseInt( val )/3 );
				var i = this.internal["UI.Custom1"].data;
				this.style.leftTopWidth = w + "px";
				this.style.middleCenterLeft = w + "px";
				this.style.middleCenterWidth = w + "px";
				this.style.rightBottomLeft = (2*w) + "px";
				this.style.rightBottomWidth = w + "px";
			}
		},
		leftTopWidth : "lt:width",
		middleCenterWidth : "c:width",
		rightBottomWidth : "rb:width",
		height : {
			get : function() { 
				var i = this.internal["UI.Custom1"].data;
				return (parseInt( i.style_lt.height) + parseInt( i.style_c.height) + parseInt( i.style_rb.height ) ) + "px";
			},
			set : function(val) {
				var h = parseInt( parseInt(val) /3 );
				this.style.leftTopHeight = h + "px";
				this.style.middleCenterTop = h + "px";
				this.style.middleCenterHeight = h + "px";
				this.style.rightBottomTop = (2*h)+"px";
				this.style.rightBottomHeight = h + "px";
			}
		},
		leftTopHeight : "lt:height",
		middleCenterHeight : "c:height",
		rightBottomHeight : "rb:height",
		leftTopTop : "lt:top",
		middleCenterTop : "c:top",
		rightBottomTop : "rb:top",
		leftTopLeft : "lt:left",
		middleCenterLeft : "c:left",
		rightBottomLeft : "rb:left",
		innerWidth : "lt:width,c:width,rb:width",
		innerHeight : "lt:height,c:height,rb:height",
		backgroundColor : "lt:backgroundColor,c:backgroundColor,rb:backgroundColor",
		backgroundLeftTopColor : "lt:backgroundColor",
		backgroundMiddleCenterColor : "c:backgroundColor",
		backgroundRightBottomColor : "rb:backgroundColor",
		color : "lt:color,c:color,rb:color",
		colorLeftTop : "lt:color",
		colorMiddleCenter : "c:color",
		colorRightBottom : "rb:color",
		attribs : {
			"class" : "lt:class,c:class,rb:class",
			"extra" : "lt:extra,c:extra,rb:extra"	
		},
		events : {
			"mouseover" : "c", // install emit to component mouseover from lt mousever
			"mouseout" : "c"
		}
	},
	boot : {
		$ : { // non mapped to html css
			attribs : {
				horizontalStep : "50px",
				verticalStep : "50px",
				mode : "step", /* normal has width step and height step */
				mod : 0 /* which comes first */
			}
		},
		lt : { position : "absolute", left : "200px", top : "200px", width : "50px", height : "50px", backgroundColor : "#f00" },
		c : { position : "absolute", left : "50px", top : "50px", width : "50px", height : "50px", backgroundColor : "#0f0" },
		rb : { position : "absolute", left : "100px", top : "100px", width : "50px", height : "50px", backgroundColor : "#000" }
	},
	ctor : function(i,$) {
		// set events
		var self = this;
		
		// this events skips Athings that are used by whom instanciate this control
		/*
		$( i.el.c, {
			events : {
				mouseover : function(e) { // LIVE TIME ???
				
					console.log("EVT mouse over",e);
					// SOLUTION TO THIS CONTEXT EVENT HANDLING
					//self.emit("mousoever",[e]); 
					$( i.el.rb, { backgroundColor : "#f00" } ); 
					
				},
				mouseout : function(e) { // LIVE TIME ???
				
					console.log("EVT mouse out",e);
					// SOLUTION TO THIS CONTEXT EVENT HANDLING
					//self.emit("mouseout",[e]);

					
					
					
				}
			}
		});
		*/
		
	},
	events : {
		mouseover : function(e,i,$) {
			//console.log("Z 1 mouseover 0 ",e,i);
			$( i.el.rb, { backgroundColor : "#f00" } );
			return true;
		},
		mouseout : function(e,i,$) {
			//console.log("Z 2 mouseout 0 ",e,i);
			$( i.el.rb, { backgroundColor : "#000" } ); 
			return true;
		}
	},
	proto : {
		
	}
});



CreateControl(
"UI.MenuPage",
"<div id=\"base\">"+
	"<div id=\"head\">" +
		"<UI.Menu id=\"mnuMain\"></UI.Menu>" +
	"</div>" +
	"<div id=\"body\"></div>" +
"</div>",{
	map : {
		width : "base:width,head:width,body:width,mnuMain:width",
		height : "base:height",
		menuHeight : "menuMain:height",
		index : "$:index;@index"
	},
	boot : {
		base : {
			position : "absolute",  left : "0px",
			overflow : "hidden"
		}
	},
	ctor : function() {
		
	},
	proto : {
		
	}
});

CreateControl("UI.MenuListItem","<div id=\"menulistitem\"></div>",{
	map : {
		width : "menulistitem:width",
		height : "menulistitem:height,menulistitem:lineHeight"
	},
	boot : {
		$ : {
			//width : "100px",
			height : "26px",
		},
		menulistitem : {
			position : "relative",
			left : "0px",
			paddingRight : "10px",
			backgroundColor : "#fff", 
			color : "#000" 
		}
	},
	ctor : function(i,$,boot) {
		var self = this;
		
		i.caption = "";
		i.handler = null;
		Object.defineProperty(this,"callback",{ get : function() {
			return i.handler;
		}, set : function(val) {
			i.handler = val;
		}});
		i.extra_arguments = [];
		Object.defineProperty(this,"extra_arguments",{
			get : function() { return i.extra_arguments; }
		});
		i.context = this;
		Object.defineProperty(this,"context",{
			get : function() { return i.context; }
		});
		var get = function(path) { return self.elementX(i,path); }	
		var $ = BrowserTools.setStyle;
		Object.defineProperty(this,"innerHTML",{ get : function() { return i.caption; },
			set : function(val) { i.caption = val; $( get("menulistitem"), {},val); }
		});
		$(i.el.menulistitem,{
			events : {
				mouseover : function() {
					// theme
					$(i.el.menulistitem,{ backgroundColor : "#000", color : "#fff" });
					return true;
				},
				mouseout : function() {
					// theme
					//console.log(i);
					$(i.el.menulistitem,{ backgroundColor : "#fff", color : "#000" });
					return true;
				},
				click : function() {
					i.handler&&i.handler.apply(i.context,i.extra_arguments);
				}
			}
		});
		
		
	},
	proto : {
		
	}
})


CreateControl("UI.MenuItem","<td id=\"item_cell\"><div id=\"menu_list\"></div><span id=\"item_caption\"></span></td>",{
	map : {
		"headWidth" : "item_cell:width;@width",
		"listWidth" : "menu_list:width",
		"listTop" : "menu_list:top;@listTop",
		"listLeft" : "menu_list:left"
	},
	boot : {
		menu_list : {
			position : "absolute",
			left : "0px",
			top : "0px",
			display : "none",
			textAlign : "right",
			top : "200px",
			width : "150px"
		},
		item_cell : {
			position : "relative",
			cursor : "default",
			textAlign : "center"
		}
	},
	ctor : function(i,$) {
		i.count = 0;
		i.sep = 0;
		i.custom = 0;
		i.caption = "";
		
		this.on("@listTop",function(val) {
			// anchor message to full screen and scroll it.
		});
		
		this.on("@width",function(val) {
			
			/*
			console.log("SET ATTRIBUTE TD" ,parseInt( i.el.item_cell.style.width ),val);
			if( isNaN( parseInt( i.el.item_cell.style.width ) ) ) {
				i.el.item_cell.setAttribute( "width", parseInt( val ) );
			} else {
				i.el.item_cell.setAttribute( "width", parseInt( i.el.item_cell.style.width ) );

			}
			*/
		});
		
		function mouseover() {
			$(i.el.item_cell,{ backgroundColor : "#000", color : "#fff" });
			$(i.el.menu_list,{ display :"" });
		}
		function mouseout() {
			$(i.el.item_cell,{ backgroundColor : "#fff", color : "#000" });
			$(i.el.menu_list,{ display : "none" });
		}
		
		Object.defineProperty(this,"innerHTML",{
			get : function() {
				
			},
			set : function(val) {
				i.el.item_caption.innerHTML = val;
			}
		});
		$(i.el.item_cell,{ events : { "mouseover" : function() { mouseover(); }, "mouseout" : function() { mouseout(); } } });
	},
	events : {
		
	},
	proto : {
		// handle ids of controls being added to this menu
		
		Set : function(id) {
		},
		Show : function(id) { 
		
		},
		Hide : function(id) {
			var i = this.internal["UI.MenuItem"].data;
			console.log("in hide");
			var $ = BrowserTools.setStyle;
			$(i.el.menu_list,{
				display : "none"
			})
		},
		// return id of an caption item, can be a submenu with { json : subtree_object }
		AddItem : function(opts,inner) {
			var i = this.internal["UI.MenuItem"].data;
			
			var $ = BrowserTools.setStyle;
			var item = i.$.menu_list.elementNew("item","UI.MenuListItem");
			item.innerHTML = inner;
			i.count += 1;
			//var style = { height : "30px" }; $(i.el.menu_list,style);
			if("events"  in opts) { if("click" in opts.events) { item.callback = opts.events.click; } }
			
			return item;
		},
		// return id of an specific separator, it is a <DIV>
		AddSeparator : function() {
			var i = this.internal["UI.MenuItem"].data;
			var sep = i.$.menu_list.elementNew("sep_"+i.sep,"div");
			var $ = BrowserTools.setStyle;
			$(sep,{ width : "100%", height : "1px", backgroundColor : "#000" });
			i.sep += 1;
			return sep;
		},
		// return id of a custom control named "..." it is custom and complex.
		AddCustom : function(name) {
			var custom = i.$.menu_list.elementNew("custom_"+i.custom,name);
			i.custom += 1;
			return custom;
		}
	}
});

CreateControl("UI.Menu","<div id=\"menu_container\"><table id=\"table_container\"><tr id=\"row_container\"></tr></table></div>",{
	map : {
		position : "menu_container:position",
		width : "menu_container:width,table_container:width,row_container:width,table_container=width|>integer;@width", // style, not attribute
		height : "menu_container:height,table_container:height,table_container=height|>integer;@height", // style, not attribute
		backgroundColor : "menu_container:backgroundColor,table_container:backgroundColor,row_container:backgroundColor",
		attribs : {
			width : "table_container:width,row_container:width",
			height : "table_container:height"
		}
	},
	boot : {
		menu_container : {
			position : "relative",
			left : "0px", 
			top : "0px", 
			width : "100%", 
			//height : "50px",
			backgroundColor : "#fff",
			fontFamily : "monospace",
			fontSize : "15px"
		},
		table_container : {
			attribs : { 
				//height : "50", 
				cellpadding : "0", 
				cellspacing : "0", 
				border : "0" 
			}
		},
		row_container : {
			
		}
	},
	ctor : function(i,$) {
		//var sz = UI.Window.getBounds();
		
		i.next = 0;
		i.count = 0;
		i.refs = [];
		this.on("@height",function() {
			// change top of extension menu heads panels
			for(var x = 0; x < i.refs.length;x++) {
				
				var control = this.elementGetContents("menu_container");
				control = control.elementGetContents("table_container");
				control = control.elementGetContents("row_container");
				control = control.elementGetContents("head_"+i.refs[x][0]);
				//console.log( "#################",control );
				//console.log("@height:",control.complex,parseInt(this.style.height))
				BrowserTools.setStyle( control.complex, { listTop : parseInt(this.style.height) + "px" });
				control.complex.Flush(); // tricky, it's too early to refresh, need speed
				
			}
		});
		this.on("@width",function(val) {
			
			var control = this.elementGetContents("menu_container");
			control = control.elementGet("table_container");
			console.log("event call @@>>",val);
			control.setAttribute("width",parseInt(val));
			
		});
		//$(i.el.menu_container,{ width : sz[0] + "px" });
		
		UI.Window.on("resize",function() {
			
			// how to get reference data from parent?
			
			
			var sz = UI.Window.getBounds(); 
			//$(i.el.menu_container,{ width : sz[0] + "px" });
			
			
			return true;
		});
		
	},
	proto : {
		AddHead : function(opt,inner) { // ao inserir o segundo elemento algo no redimensionamento da tabela sai errado
			var i = this.internal["UI.Menu"].data;
			var self = this;
			var get = function(path) { return self.elementX(i,path); }
			var parent = this.elementGetContents("menu_container").elementGetContents("table_container").elementGetContents("row_container");
			var item = null;
			
			// remove head_ending before insertion
			
			//parent.elementRemove("head_ending");
			
			if("custom" in opt) {
				item = parent.elementNew("head_"+i.count,opt.custom.name);
				//item.index(i.next); // position of extension at menu
				//item.LoadArgs(opt.custom.args); 
				i.next += 1;
				i.count += 1;
				
			} else {
				
				parent.elementRemove("head_ending");
				
				item = parent.elementNew("head_"+i.count,"UI.MenuItem");
				
				//item.index(i.next);
				
				item.innerHTML = inner;
				i.str_sz = UI.Window.getStringSize( inner,{ 
					padding : "0px",
					margin : "0px",
					fontFamily : i.el.menu_container.style.fontFamily,
					fontSize : i.el.menu_container.style.fontSize 
				});
				
				item.style.height = "40px";
				console.log(">>>>>>>>>>",i.str_sz,i.el.menu_container.style.fontFamily,i.el.menu_container.style.fontSize);
				
				
				
				item.style.headWidth = i.str_sz[0] + "px";
				// also change left of all items
				i.refs.push( [ i.count /* id */, i.next+1 /*order*/, item] );
				
				var sum = 0;
				
				function setx(x) {
					//console.log(x,"list left",parseInt( i.refs[x][2].style.headWidth ),sum)
					
					if( i.refs[x][2].internal.type == "UI.MenuItem" ) {
						console.log("A0",x,sum);
						
						sum += parseInt( i.refs[x][2].style.headWidth );
						console.log("A1",x,sum);
						i.refs[x][2].Flush();
					}
				}
				for(var x = 0; x < i.refs.length;x++) {
					setx(x);
				}
				
				
				var ending = parent.elementNew("head_ending","td");
				ending.setAttribute("width","*");
			
			
				this.Flush();
				
				
				i.next+=1;
				i.count +=1;
				
			}
			console.log("ADDING ENDING");
			// add, right to left buttons or completeness of menu
			
			return item;
		},
		RemoveHead : function(index) {
			throw "does not work anymore, if, once did.";
			
			var i = this.internal["UI.Menu"].data;
			var rm = false;
			var skip = -1;
			for(var x = 0; x < i.refs.length;x++) {
				if(index == i.refs[x][0]) {
					skip = x;
					this.elementGetContents("base").elementRemove("head_"+i.refs[x][0]);
					rm = true;
					i.refs.splice( x,1);
				}
			}
			for(var x = 0; x < i.refs.length;x++) {
				if(i.refs[x][1] == (x+1)) {
				} else {
					var item = this.elementGetContents("base").elementGet("head_"+i.refs[x][0]);
					item.index(x+1);
					i.refs[x][1] = (x+1);
				}
			}
			if(rm) { i.next -= 1; }
		}
	}
});





CreateControl("UI.BackForwardButton","<td><input type=\"text\"/></td>",{
	ctor : function(i,$) {
		Object.defineProperty(this,"index",{ 
			get : function() { 
				return function(val) {
					if(val==undefined) {
						return i.index;
					} else {
						i.index = val; 
						var sz = UI.Window.getBounds();
						//$(get("base"),{ top : ( i.index*(sz[1]) ) + "px" });
						//$(get("menu_list"),{ left : (100*val) + "px" });
						//$(get("menu_list"),{ left : (100*val) + "px" });
					}
				}
			} 
		});
		Object.defineProperty(this,"innerHTML",{
			get : function() { return i.caption; },
			set : function(val) {
				i.caption = val;
				//$( get("item_cell"), { attribs : { width : "100", align : "center" } });
				//$( get("item_caption"), {},val );
			}
		});
	}
});


CreateControl("UI.Menu.Textbox","<td id=\"line\"><input type=\"text0\" id=\"label0\"></input></td>",{
	
	boot : {
		
	},
	events : {
		
	}
	
});


CreateControl(
	"UI.Editor2",
	"<div id=\"base\">"+
		"<UI.Menu id=\"mnuMain\"></UI.Menu>" +
		//"<UI.Custom1 id=\"test_control\"></UI.Custom1>" + 
	"</div>",
{
	map : {
		width : "base:width,mnuMain:width",
		height : "base:height",
		menuHeight : "mnuMain:height"
	},
	boot : {
		// $ : { menuHeight : "50px" }, // not set correctly cause when editor is created(booted), bindings to heads are not defined.
		base : {
			position : "absolute",  left : "0px", top : "0px", width : "640px", height : "480px", 
			overflow : "auto",overflowX : "hidden",backgroundColor : "#00F"
		}
	},
	ctor : function(i,$) {
		var self = this;
		i.next = 0;
		i.count = 0;
		i.refs = [];
		
		
		
		
		
		
		// ****************************
		// a funcao que chama o editor define o width, depois ao criar a pagina o width do menu nao fica definido
		// necessario normalizar o PageLeaf com o UI.Editor2
		
		var menuitem = i.el.mnuMain.AddHead({
		},"Page");
		//menuitem.style.listWidth = "200px";
		
		menuitem.Flush();
		menuitem.AddSeparator();
		var btnInsertPage = menuitem.AddItem({
			events : {
				click : function() {
					var sz = UI.Window.getBounds();
					//console.log(i.self,this,i);
					i.self.InsertBeforePage(0);
					setTimeout(function() { 
						var sz = UI.Window.getBounds();
						i.el.base.scrollTop = i.count*sz[1]; 
					},100);
				}
			}
		},"Insert Page");
		menuitem.AddItem({},"Next Page");
		
		//menuitem = i.el.mnuMain.AddHead({},"Content");
		
		
		var sz = UI.Window.getBounds();
		
		
		$(i.self, { menuHeight : "50px" }); // essa configuracao e' a ultima a ser chamada
		// a configuração do client e'a ultima a ser chamada mas nao completa tudo porque nao atualiza mnuMain
		
		
		$(i.el.base, { height : sz[1]+"px" });
		i.self.Flush();
		i.el.mnuMain.Flush();
		
		var sz = UI.Window.getBounds();
		//$(i.self, {width : sz[0] + "px" });
		$(i.el.base,{ height : (sz[1])+"px", });
			
		UI.Window.on("resize",function() {
			var sz = UI.Window.getBounds();
			//$(i.self, {width : sz[0] + "px" });
			$(i.el.base,{ height : (sz[1])+"px", });
			return true;
		});
	},
	proto : {
		Save : function(context) {
			context.pages = [];
			for(var x = 0; x < i.refs.length;x++) {
				var page_context = {};
				var item = this.elementGetContents("base").elementGet("test_"+i.refs[x][0]);
				item.Save(page_context);
				context.pages.push(page_context);
			}
		},
		Load : function(context) {
			for(var x = 0; x < context.pages.length;x++) {
				// insert page
				var page = this.PushPage();
				page.Load( context.pages[x] );
			}
		},
		InsertBeforePage : function(at) {
			var i = this.internal["UI.Editor2"].data;
			if(at==undefined) { at = 0; }
			if(at >= i.refs.length) {
				at = i.refs.length;
			}
			
			var self = this;
			var colors = ["#f00","#0f0","#00f"];
			var page = this.elementGetContents("base").elementNew("test_"+(i.count),"PageLeaf");
			var base = page.elementGet("base");
			base.style.backgroundColor = colors[i.count%3];
			
			//i.refs.unshift( [ i.count, at+1 ] );
			i.refs.splice(at,0,[i.count,at+1]);
			page.index(at+1);
			
			page.events.dispose.args.push(parseInt(i.count));
			page.events.dispose.context = self;
			page.events.dispose.emit = function(index) {
				console.log("REMOVE CALLBACK",index)
				self.RemovePage(index);
			};
			
			for(var x = at+1;x < i.refs.length;x++) {
				var item = this.elementGetContents("base").elementGet("test_"+i.refs[x][0]);
				item.index(x+1);
				i.refs[x][1] = (x+1);
			}
			i.next+=1;
			i.count +=1;
			
		},
		UnshiftPage : function(at) {
			if(at==undefined) { at = 0; }
			var i = this.internal["UI.Editor2"].data;
			var self = this;
			var colors = ["#f00","#0f0","#00f"];
			var page = this.elementGetContents("base").elementNew("test_"+(i.count),"PageLeaf");
			var base = page.elementGet("base");
			base.style.backgroundColor = colors[i.count%3];
			
			i.refs.unshift( [ i.count, 1 ] );
			page.index(1);
			
			page.remove_extra_arguments.push(parseInt(i.count));
			page.remove_context = self;
			page.remove_callback = function(index) {
				console.log("REMOVE CALLBACK",index)
				self.RemovePage(index);
			}
			for(var x = 1;x < i.refs.length;x++) {
				var item = this.elementGetContents("base").elementGet("test_"+i.refs[x][0]);
				item.index(x+1);
				i.refs[x][1] = (x+1);
			}
			i.next+=1;
			i.count +=1;
		},
		PushPage : function() {
			var i = this.internal["UI.Editor2"].data;
			var self = this;
			var colors = ["#f00","#0f0","#00f"];
			var page = this.elementGetContents("base").elementNew("test_"+(i.count),"PageLeaf");
			var base = page.elementGet("base");
			base.style.backgroundColor = colors[i.count%3];
			page.index(parseInt(i.next)+1);
			page.remove_callback = function(index) {
				console.log("REMOVE CALLBACK",index)
				self.RemovePage(index);
			}
			page.remove_extra_arguments.push(parseInt(i.count));
			page.remove_context = self;
			i.refs.push( [ i.count, i.next+1 ] );
			i.next+=1;
			i.count +=1;
		},
		RemovePage : function(index) {
			var i = this.internal["UI.Editor2"].data;
			console.log("removing",index)
			// reorder remaining leafs
			var rm = false;
			var skip = -1;
			for(var x = 0; x < i.refs.length;x++) {
				if(index == i.refs[x][0]) {
					skip = x;
					console.log("AT ELEMENT REMOVE BEGIN");
					this.elementGetContents("base").elementRemove("test_"+i.refs[x][0]);
					rm = true;
					console.log("AT ELEMENT REMOVE END");
					i.refs.splice( x,1);
				}
			}
			for(var x = 0; x < i.refs.length;x++) {
				if(i.refs[x][1] == (x+1)) {
					
				} else {
					var item = this.elementGetContents("base").elementGet("test_"+i.refs[x][0]);
					item.index(x+1);
					i.refs[x][1] = (x+1);
				}
			}
			if(rm) {
				console.log("removed?",rm)
				i.next -= 1;
			}
			console.log(i.next,x,index,i.refs[x]);
		}
	}
});
/*
Class.define("Editor",{ 
	from : ["WithDOMElements"],
	ctor : function() {
		var self = this;
		var i = this.internal["Editor"].data = {};
		i.$ = null;
		i.el = null;
		i.next = 0;
		i.count = 0;
		i.refs = [];
		
		this.on("load",function() {
			//console.log(self.parent);
			var p = this.elementNewPacket(
				"<div id=\"base\">"+
					"<UI.Menu id=\"mnuMain\"></UI.Menu>"+
					"<UI.Custom1 id=\"test_control\"></UI.Custom1>" + 
				"</div>");
			console.log("@@@",this.parent);
			i.$ = p.$;
			i.el = p.el;
			var $ = BrowserTools.setStyle;
			var get = function(path) { return self.elementX(p,path); }
			
			
			p.el.test_control.style.left = "500px";
			p.el.test_control.style.width = "400px";
			p.el.test_control.style.backgroundRightBottomColor = "#FF0";
			p.el.test_control.Flush();
			p.el.test_control.on("mouseover",function() {
				console.log("?? BEEP ?? 1");
			});
			p.el.test_control.on("mouseout",function() {
				console.log("?? BEEP ?? 2");
			});
			p.el.test_control.setAttribute("width","100");
			console.log( p.el.test_control.getAttribute("width") );
			
			
			// p.el.mnuMain.AddHead({ caption : "BackForwardButton", custom : { name : "UI.BackForwardButton" } });
			var menuitem = p.el.mnuMain.AddHead({},"Page");
			
			menuitem.style.width = "200px";
			menuitem.AddSeparator();
			var btnInsertPage = menuitem.AddItem({
				events : {
					click : function() {
						var sz = UI.Window.getBounds();
						self.InsertBeforePage(0);
						setTimeout(function() { 
							var sz = UI.Window.getBounds();
							p.el.base.scrollTop = i.count*sz[1]; 
						},100);
					}
				}
			},"Insert Page");
			menuitem.AddItem({},"Find Page");
			menuitem.AddSeparator();
			menuitem.AddItem({},"Previous Page");
			menuitem.AddItem({},"Next Page");
			menuitem.AddSeparator();
			p.el.mnuMain.AddHead({},"&#8592;");
			p.el.mnuMain.AddHead({},"&#8594;");
			var menuitem = p.el.mnuMain.AddHead({},"Window");
			menuitem.style.width = "200px";
			menuitem.AddItem({},"List")
			var menuitem = p.el.mnuMain.AddHead({},"Data");
			var btnDataSet = menuitem.AddItem({
				events : {
					click : function() {
						localStorage.setItem("index.editor",JSONTools.pretty_stringify({}));
					}
				}
			},"Set");
			var btnDataGet = menuitem.AddItem({},"Get");
			var btnDataUpload = menuitem.AddItem({},"Upload");
			var btnDataDownload = menuitem.AddItem({},"Download");
			var sz = UI.Window.getBounds();
			$( get("base"),{ 
				position : "absolute",  left : "0px", top : "0px", width : (sz[0]) + "px", height : (sz[1])+"px", 
				overflow : "auto",overflowX : "hidden",backgroundColor : "#00F"
			});
			UI.Window.on("resize",function() {
				var sz = UI.Window.getBounds();
				$(get("base"),{ left : "0px", width : (sz[0]) + "px", height : (sz[1])+"px", });
				return true;
			});
			
			return true;
		});
		
	}, 
	proto : {
		Save : function(context) {
			context.pages = [];
			for(var x = 0; x < i.refs.length;x++) {
				var page_context = {};
				var item = this.elementGetContents("base").elementGet("test_"+i.refs[x][0]);
				item.Save(page_context);
				context.pages.push(page_context);
			}
		},
		Load : function(context) {
			for(var x = 0; x < context.pages.length;x++) {
				// insert page
				var page = this.PushPage();
				page.Load( context.pages[x] );
			}
		},
		InsertBeforePage : function(at) {
			var i = this.internal["Editor"].data;
			if(at==undefined) { at = 0; }
			if(at >= i.refs.length) {
				at = i.refs.length;
			}
			
			var self = this;
			var colors = ["#f00","#0f0","#00f"];
			var page = this.elementGetContents("base").elementNew("test_"+(i.count),"PageLeaf");
			var base = page.elementGet("base");
			base.style.backgroundColor = colors[i.count%3];
			
			//i.refs.unshift( [ i.count, at+1 ] );
			i.refs.splice(at,0,[i.count,at+1]);
			page.index(at+1);
			
			page.events.dispose.args.push(parseInt(i.count));
			page.events.dispose.context = self;
			page.events.dispose.emit = function(index) {
				console.log("REMOVE CALLBACK",index)
				self.RemovePage(index);
			};
			
			for(var x = at+1;x < i.refs.length;x++) {
				var item = this.elementGetContents("base").elementGet("test_"+i.refs[x][0]);
				item.index(x+1);
				i.refs[x][1] = (x+1);
			}
			i.next+=1;
			i.count +=1;
			
		},
		UnshiftPage : function(at) {
			if(at==undefined) { at = 0; }
			var i = this.internal["Editor"].data;
			var self = this;
			var colors = ["#f00","#0f0","#00f"];
			var page = this.elementGetContents("base").elementNew("test_"+(i.count),"PageLeaf");
			var base = page.elementGet("base");
			base.style.backgroundColor = colors[i.count%3];
			
			i.refs.unshift( [ i.count, 1 ] );
			page.index(1);
			
			page.remove_extra_arguments.push(parseInt(i.count));
			page.remove_context = self;
			page.remove_callback = function(index) {
				console.log("REMOVE CALLBACK",index)
				self.RemovePage(index);
			}
			for(var x = 1;x < i.refs.length;x++) {
				var item = this.elementGetContents("base").elementGet("test_"+i.refs[x][0]);
				item.index(x+1);
				i.refs[x][1] = (x+1);
			}
			i.next+=1;
			i.count +=1;
		},
		PushPage : function() {
			var i = this.internal["Editor"].data;
			var self = this;
			var colors = ["#f00","#0f0","#00f"];
			var page = this.elementGetContents("base").elementNew("test_"+(i.count),"PageLeaf");
			var base = page.elementGet("base");
			base.style.backgroundColor = colors[i.count%3];
			page.index(parseInt(i.next)+1);
			page.remove_callback = function(index) {
				console.log("REMOVE CALLBACK",index)
				self.RemovePage(index);
			}
			page.remove_extra_arguments.push(parseInt(i.count));
			page.remove_context = self;
			i.refs.push( [ i.count, i.next+1 ] );
			i.next+=1;
			i.count +=1;
		},
		RemovePage : function(index) {
			var i = this.internal["Editor"].data;
			console.log("removing",index)
			// reorder remaining leafs
			var rm = false;
			var skip = -1;
			for(var x = 0; x < i.refs.length;x++) {
				if(index == i.refs[x][0]) {
					skip = x;
					console.log("AT ELEMENT REMOVE BEGIN");
					this.elementGetContents("base").elementRemove("test_"+i.refs[x][0]);
					rm = true;
					console.log("AT ELEMENT REMOVE END");
					i.refs.splice( x,1);
				}
			}
			for(var x = 0; x < i.refs.length;x++) {
				if(i.refs[x][1] == (x+1)) {
					
				} else {
					var item = this.elementGetContents("base").elementGet("test_"+i.refs[x][0]);
					item.index(x+1);
					i.refs[x][1] = (x+1);
				}
			}
			if(rm) {
				console.log("removed?",rm)
				i.next -= 1;
			}
			console.log(i.next,x,index,i.refs[x]);
		}
	}
});
*/