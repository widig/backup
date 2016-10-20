

Class.define("UI.PixelDrawig",{
	
});
Class.define("UI.3DDrawig",{
	
});
Class.define("UI.SvgDrawig",{
	
});
Class.define("UI.EditorActionPanel",{
	// build wall, create item, remove item, move item, build stairs, build floor, plain floor
});
Class.define("UI.PersonActionPanel",{
	// drink, get, push, pull, drop, enter x, press big button, access env. (mobile things, information dropped item)
});

Class.define("UI.RadarMapping",{
	
});
Class.define("UI.SwitchButton",{
	
});
Class.define("UI.LabelledCheckbox",{
	
});
Class.define("UI.DatePicker",{
	
});
Class.define("UI.Docker",{
	
});
Class.define("UI.Numeric",{
	
});
Class.define("UI.Range",{
	
});
Class.define("UI.List",{
	
});

Class.define("UI.WindowFrame",{
	ctor : function() {
		// set anchor control ( left, top, right, bottom )
		// set resize control ( vertical border, horizontal border )
		// set full screen control at title, undock at title
		// set resize border around control over undocked window
	},
	proto : {
		
	}
});

Router.addPage({name:"frame",template:"base"},function(args, template, router) {
	
	var $ = BrowserTools.setStyle;
	var $$ = BrowserTools.arraySetStyle;
	var rollover = BrowserTools.inoutStyle;
	
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	
	origin_lt_container.elementsClear();
	var window_width = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
	window_height = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
	
	$(origin_lt,{
		overflow : "hidden",
		width : window_width + "px",
		height : window_height + "px"
	});
	UI.Body.get().style.overflow = "hidden";
	var p = origin_lt_container.elementNewPacket("\
		<div id=\"page_menu\">\
			<div id=\"menu_title\"></div>\
			<div id=\"menu_body\"></div>\
		</div>\
		<div id=\"tool_window\">\
			<div id=\"tool_window_head\">\
			</div>\
			<div id=\"tool_window_body\"></div>\
		</div>\
		<div id=\"_window1\">\
			<div id=\"frame1_headbar\">\
				<div id=\"frame1_title\"></div>\
				<div id=\"headbar_menu\">\
					<div id=\"btnFullscreen\"></div>\
				</div>\
			</div>\
			<iframe id=\"frame1\"></iframe>\
		</div>\
		<div id=\"timeline\">\
		</div>\
		<div id=\"_desc\"></div>\
		<iframe id=\"music_player\"></iframe>\
		<div id=\"toggle\"></div>\
		<div id=\"debug_window\">\
			<div id=\"debug_window_head\">\
			</div>\
			<div id=\"debug_window_body\"></div>\
		</div>"
	);
	// iframe is losting context when loading old pages
	
	
	function setStyle(target,style) { for(var key in style) { target.style[key] = style[key]; } }
	$(p.el._desc,{
		position : "absolute", left : "1570px", top : "20px", width : "300px", height : "100px",
		border : "solid 1px #000", padding : "10px"
	},"none");
	
	
	$(p.el.page_menu,{
		position : "absolute", 
		border : "solid 1px #000", overflow : "hidden"
	});
	$(p.el.menu_body,{
		position : "relative", width : "200px", height : "363px", overflowY : "auto"
	})
	var page_menu_container = p.$.menu_body;
	$(p.el.menu_title,{
		position : "relative",
		fontFamily : "monospace", fontSize : "30px",
		paddingLeft : "10px",
		borderBottom : "solid 1px #000",
		backgroundColor : "#008", color : "#fff"
	},"menu");
	$(p.el._window1,{
		position : "absolute",
		overflow : "hidden",
		border : "solid 1px #000"
	});
	$(p.el.frame1_headbar,{
		position : "absolute",
		left : "0px", top : "0px", width : "1280px", height : "37px",
		fontFamily : "monospace", fontSize : "30px",
		backgroundColor : "#00000F", color : "#fff"
	});
	$(p.el.frame1_title,{
		"position" : "absolute",
		"left" : "0px",
		"top" : "0px"
	},"/tools/notes");
	$(p.el.headbar_menu,{
		"position" : "absolute",
		"top" : "0px",
		"left" : (1280-60) + "px",
		width : "60px"
	});
	
	
	var self = this;
	this.fullscreen = false;
	
	$(p.el.btnFullscreen,{
		backgroundColor : "#338",
		width : "50px",
		height : "38px",
		events : {
			"mouseover" : function() {
				$(p.el.btnFullscreen,{ backgroundColor : "#ccc" });
			},
			"mouseout" : function() {
				$(p.el.btnFullscreen,{ backgroundColor : "#338" });
			},
			"click" : function() {
				if(!self.fullscreen) {
					var window_width = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
					window_height = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
					var wm = 2;
					$(p.el._window1,{ left : "0px", top : "0px", height : (window_height -2) + "px", width: (window_width-wm) + "px" });
					frame1.setAttribute("width","" + (window_width-wm));
					frame1.setAttribute("height","" + (window_height-38));
					$(p.el._desc,{ display : "none" });
					$(p.el.music_player,{display : "none"});
					$(p.el.toggle,{display : "none"});
					
					p.el.page_menu.style.display = "none";
					$(p.el.frame1_headbar, { width : (window_width-wm)+"px" } );
					$(p.el.headbar_menu,{ "left" : (window_width-wm-60) + "px" });
					self.fullscreen = true;
				} else {
					toggle_state = 0;
					$(p.el._window1,{ left : "260px", top : "20px", width : "1280px", height : "500px", });
					frame1.setAttribute("width","1280");
					frame1.setAttribute("height","463");
					$(p.el._desc,{ display : "" });
					$(p.el.music_player,{display : ""});
					$(p.el.toggle,{display : ""});
					$(p.el.frame1_headbar, { left : "0px", top : "0px", width : "1280px", height : "37px"} );
					$(p.el.headbar_menu,{ "top" : "0px", "left" : (1280-60) + "px", width : "60px" });
					p.el.page_menu.style.display = "";
					self.fullscreen = false;
				}
				
			}
		}
	});
	
	
	var frame1 = p.el.frame1;
	$(frame1,{
		position : "absolute",
		left : "0px",
		top : "37px",
		attribs: {
			width : 1280,
			height : 463,
			frameBorder : 0,
			src : "/#notes2"
		}
	});
	
	var music_player = p.el.music_player;
	
	$(music_player,{
		position : "absolute",
		left : "1570px",
		top : "157px",
		border : "solid 1px #f00",
		attribs : {
			width : 310,
			height : 187,
			frameBorder : 0
		}
	});
	
	var toggle = p.el.toggle;
	var toggle_state = 0;
	$( p.el.toggle, {
		position : "absolute",
		top : "354px",
		left : "1570px",
		border : "solid 1px #000",
		width : "320px",
		height : "50px",
		textAlign : "center",
		lineHeight : "50px",
		cursor : "default",
		events : {
			"click" : function() {
				if(toggle_state == 0) {
					toggle_state = 1;
					$( p.el._window1, {
						left : "0px", height : "937px", width : "1510px"
					});
					$( p.el.frame1_title,{
						width : "1510px",
						attribs : {
							width : 1510,
							height : 910
						}
					});
					$( p.el.page_menu, {
						display : "none"
					});
				} else {
					$( p.el._window1,{
						width : "1280px",
						left : "260px",
						height : "500px"
					});
					$( p.el.frame1_title, {
						width : "1280px"
					});
					$( frame1, {
						attribs : {
							width : 1280,
							height : 463
						}
					});
					$( p.el.page_menu,{
						display : ""
					});
					toggle_state = 0;
				}
			},
			"mouseover" : function() {
				$( p.el.toggle, {
					backgroundColor : "#000",
					color : "#fff"
				});
			},
			"mouseout" : function() {
				$( p.el.toggle, {
					backgroundColor : "#fff",
					color : "#000"
				});
			}
		}
	},"toggle");
	
	$( p.el.debug_window, {
		position : "absolute",
		top : "420px",
		height : "635px",
		width : "310px",
		border : "solid 1px #000"
	});
	$( p.el.debug_window_head, {
		position : "absolute",
		left : "0px",
		top : "0px",
		width : "300px",
		fontFamily : "monospace", fontSize : "30px",
		paddingLeft : "10px",
		borderBottom : "solid 1px #000",
		backgroundColor : "#008", color : "#fff"
	},"frame_debug");
	$( p.el.debug_window_body, {
		position : "absolute",
		left : "0px",
		top : "37px",
		width : "300px",
		height : "597px",
		fontFamily : "monospace", fontSize : "30px",
		paddingLeft : "10px",
		borderBottom : "solid 1px #000",
		backgroundColor : "#ccc", color : "#fff"
		
	},"body");
	
	
	$( p.el.tool_window, {
		position : "absolute",
		left : "5px",
		top : "420px",
		height : "565px",
		width : "310px",
		border : "solid 1px #000"
	});
	$( p.el.tool_window_head, {
		position : "absolute",
		left : "0px",
		top : "0px",
		width : "310px",
		fontFamily : "monospace", fontSize : "30px",
		paddingLeft : "10px",
		borderBottom : "solid 1px #000",
		backgroundColor : "#008", color : "#fff"
	},"frame_tools");
	$( p.el.tool_window_body, {
		position : "absolute",
		left : "0px",
		top : "37px",
		width : "310px",
		height : "528px",
		fontFamily : "monospace", fontSize : "30px",
		paddingLeft : "10px",
		borderBottom : "solid 1px #000",
		backgroundColor : "#ccc", color : "#fff"
		
	},"body");
	$( p.el.timeline, {
		position : "absolute",
		left : "320px",
		top : "800px",
		width : "500px",
		height : "200px",
		border : "solid 1px #000"
	});
	
	function setLayout() {
		var sz = UI.Window.getBounds();
		var wm = 2;
		if(self.fullscreen) {
			
			$(p.el._window1,{ left : "0px", top : "0px", height : (sz[1] -2) + "px", width: (sz[0]-wm) + "px" });
			frame1.setAttribute("width","" + (sz[0]-wm));
			frame1.setAttribute("height","" + (sz[1]-38));
			$(p.el.frame1_headbar, { width : (sz[0]-wm)+"px" } );
			$(p.el.headbar_menu,{ "left" : (sz[0]-wm-60) + "px" });
		} else {
			
			p.el.debug_window_body.innerHTML = "OK";
			
			$(p.el.page_menu, {
				left : "5px", top : "5px", width : "310px", height : (sz[1]/2-7-2)+"px"
			});
			
			$(p.el.menu_body,{
				position : "relative", width : "310px", height : (sz[1]/2-7-2-37)+"px", overflowY : "auto"
			});
			
			$( p.el.tool_window, {
				left : "5px",
				top : (sz[1]/2+2) + "px",
				height : (parseInt(sz[1]/2) - 7)+"px",
				width : "310px",
			});
			$( p.el.tool_window_head, {
				width : "300px",
			});
			$( p.el.tool_window_body, {
				width : "300px",
				height : "464px",
				
			},"body");
	
			
			$(p.el._window1,{
				left : "320px", top : "5px", width : "1280px", height : (720+37+2)+"px"
			});	
			//frame1.setAttribute("width","" + (sz[0]-wm));
			frame1.setAttribute("height","" + (720));
			
			
			$( p.el.timeline, {
				left : "320px",
				top : ((720+37+2)+10)+"px",
				width : "1280px",
				height : (sz[1]-((720+37+2)+10)-5)+"px",
				border : "solid 1px #000"
			});
	
			
			
			$(p.el._desc,{
				left : (sz[0]-310-5) + "px", top : "5px", width : (310-20)+"px", height : "100px",
			},"none");
			
			
			
			
			$(music_player,{
				left : (sz[0]-310-5)+"px",
				top : (110+20)+"px"
			});
			
			$( p.el.toggle, {
				top : (110+20+187 /*height of musicplayer */+5)+"px",
				left :(sz[0]-315)+"px",
				width : "310px",
			});
			
	
			$( p.el.debug_window, { // quando faz o resize completo as dev tools tem de estar desligadas.
				left : (sz[0]-315)+"px",
				top : (110+20+187 /*height of musicplayer */+5+50 /*toggle height  */ +5) + "px",
				width : "310px"
			});
			p.el.debug_window_body.innerHTML = "OK2";
		}
	}
	setLayout();
	
	UI.Window.on("resize",function() {
		setLayout();
		return true;
	});
	// searchs
	
	// http://stackoverflow.com/search?q=a+b+c
	// https://www.youtube.com/results?search_query=teste
	// https://www.google.com.br/?#q=teste
	// http://www.bing.com/search?q=teste+a
	// https://br.search.yahoo.com/search?p=teste+a
	// https://search.yahoo.com/search?p=teste+a
	// https://github.com/search?utf8=%E2%9C%93&q=addeventlistener
	// https://vimeo.com/search?q=teste
	// https://www.flickr.com/search/?q=teste
	// https://twitter.com/search?q=games%20good&src=typd&lang=en
	// https://developer.mozilla.org/en-US/search?q=webgl
	// https://social.msdn.microsoft.com/Search/en-US?query=system.numerics
	// http://arxiv.org/find/all/1/all:+AND+quaternions+vectors/0/1/0/all/0/1
	// http://lista.mercadolivre.com.br/teste-a-b#D[A:teste-a-b]
	// http://sp.olx.com.br/?q=teste
	
	// wikipedia -> direct
	// save article
	
	
	// load private json
	
	var json_menu = {
		"readme" : "readme",
		"w3c,khronos,ecma" : {
			name : "web standard",
			nodes : {
				// "ecma-262-6.0" : "http://www.ecma-international.org/ecma-262/6.0/",
				"accessibility" : "https://www.w3.org/TR/#tr_Accessibility__All_",
				"performance" : "https://www.w3.org/TR/hr-time/",
				"char-ref" : "https://dev.w3.org/html5/html-author/charref",
				"xmlhttprequest" : "https://www.w3.org/TR/XMLHttpRequest/",
				"dom" : "https://www.w3.org/DOM/Activity",
				"dom events" : "https://www.w3.org/TR/#tr_DOM_events",
				"indexed db api" : "https://www.w3.org/TR/IndexedDB/",
				"audio api" : "https://www.w3.org/TR/webaudio/",
				"file api" : "https://www.w3.org/TR/FileAPI/",
				"web storage" : "https://www.w3.org/TR/webstorage/",
				"cache api" : "https://www.w3.org/TR/DataCache/",
				"ecma-262-5.1" : "http://www.ecma-international.org/ecma-262/5.1/",
				"cors" : "https://www.w3.org/TR/cors/",
				"css2.1" : "https://www.w3.org/TR/CSS2/",
				"css1" : "https://www.w3.org/TR/REC-CSS1/",
				"geolocation api" : "https://www.w3.org/TR/geolocation-API/",
				"web rtc" : "https://www.w3.org/TR/webrtc/",
				"web crypto api" : "https://www.w3.org/TR/WebCryptoAPI/",
				"svg 1.1" : "https://www.w3.org/TR/SVG11/",
				"png" : "https://www.w3.org/TR/PNG/",
				"gif" : {
					name : "gif",
					nodes : {
						"87" : "https://www.w3.org/Graphics/GIF/spec-gif87.txt",
						"89a" : "https://www.w3.org/Graphics/GIF/spec-gif89a.txt"
					}
				},
				"jpeg" : {
					name : "jpeg",
					nodes : {
						"base spec" : "https://www.w3.org/Graphics/JPEG/itu-t81.pdf",
						"trouble"  : "http://localhost:81/jpeg_question/trouble.txt"
					}
				},
				"shadow dom" : "https://www.w3.org/TR/shadow-dom/",
				"webgl 1.0" : "https://www.khronos.org/registry/webgl/specs/latest/1.0/",
				"webgl 2.0" : "https://www.khronos.org/registry/webgl/specs/latest/2.0/",
				"xpath" : {
					name : "xpath",
					nodes : {
						"3.0" : "https://www.w3.org/TR/xpath-30/",
						"2.0" : "https://www.w3.org/TR/xpath20/",
						"1.0" : "https://www.w3.org/TR/xpath/"
					}
				},
			}
		},
		"webgl_learning" : {
			name : "webgl-learning",
			nodes : {
				"notes" : "notes",
				"lesson1" : "http://localhost:81/lesson1%20-%20starting%20weblgl/index.html",
				"lesson2" : "http://localhost:81/lesson2%20-%20color,%20multiple%20objects/index.html",
				"lesson3" : "http://localhost:81/lesson3%20-%20rotation/index.html",
				"lesson4" : "http://localhost:81/lesson4%20-%20mesh%20object/index.html",
				"lesson5" : "http://localhost:81/lesson5%20-%20textures/index.html",
				"lesson6" : "http://localhost:81/lesson6%20-%20camera/index.html",
				"lesson7" : "http://localhost:81/lesson7%20-%20light/index.html",
				"lesson8" : "http://localhost:81/lesson8%20-%20teture%20blending/index.html",
				"lesson9" : "http://localhost:81/lesson9%20-%20particles/index.html",
				"lesson10" : "http://localhost:81/lesson10%20-%20face%20culling,%20multimapping/index.html",
				"lesson11" : "http://localhost:81/lesson11%20-%20mouse,%20light%20control/index.html",
				"lesson12" : "http://localhost:81/lesson12%20-%20reference%20rotation%20research%20fragment%20and%20vertex,%20texture%20load/index.html",
				"lesson13" : "http://localhost:81/lesson13%20-%20close%20lights%20to%20specular%20diffuse%20ambient/index.html",
				"lesson14" : "http://localhost:81/lesson14%20-%20texture%20and%20light%20study/index.html",
				"lesson15" : "http://localhost:81/lesson15%20-%20sphere%20correct%20texture%20and%20lights/index.html",
				"lesson16" : "http://localhost:81/lesson16%20-%20dynamic%20texture,%20camera%20transfer/index.html"
			}
		},
		"weblgl_research" : {
			name : "webgl_research",
			description : "unlimited z depth experiment - parallax",
			nodes : {
				"lab0x00" : "lab0x00",
				"home" : "home"
			},
			
		},
		"cool projects" : {
			name : "cool projects",
			nodes : {
				"js visual6502" : "http://www.visual6502.org/",
				"mechanical" : "http://www.pattakon.com/",
				"virtual piano" : "http://virtualpiano.net/",
				"kineman" : "https://www.kineman.com/",
				"windstorm" : "http://www.zephyrosanemos.com/",
				"three.js" : "https://github.com/mrdoob/three.js/",
				"geometry algorithms" : "http://www.personal.kent.edu/~rmuhamma/Compgeometry/compgeom.html",
				"bezier primer" : "https://pomax.github.io/bezierinfo/",
				"fragment_editor" : "http://editor.thebookofshaders.com/",
				"calculus_basic" : "http://betterexplained.com/guides/calculus/"
			}
		},
		"tools" : {
			name : "tools",
			nodes : {
				"notes" : "notes",
				"camera-calibration" : "camera-calibration",
				"number_table" : "number_table",
				"deg_tan" : "deg_tan",
				"tan_deg" : "tan_deg",
				"rad_tan" : "rad_tan",
				"tan_rad" : "tan_rad"
				
 			}
		},
		"tools-and-docs" : {
			name : "tools-and-docs",
			nodes : {
				"index" : "index"
			}
		},
		"current-tasks" : {
			name : "current-tasks",
			nodes : {
				"lesson1" : "lesson1",
				"lesson2" : "lesson2",
				"lesson3" : "lesson3",
				"lesson4" : "lesson4",
				"lesson5" : "lesson5",
				"lesson6" : "lesson6",
				"lesson7" : "lesson7",
				"lesson8" : "lesson8",
				"lesson9" : "lesson9",
				"lesson10" : "lesson10"
			}
		},
		"music" : {
			name : "music",
			type : "music",
			nodes : {
				"8-Bit Electro Gaming Mix Sept 2015" : { type : "music", base : "youtube", id : "chkElx3HCHA" },
				"Gesaffelstein - Piece Of Future" : { type : "music", base : "youtube", id : "JXkjjbBi6Ck" },
				"Duke Dumont - Ocean Drive" : { type : "music", base : "youtube", id : "KDxJlW6cxRk" },
				"Moby - Natural Blues" : { type : "music", base : "youtube", id : "z3YMxM1_S48" }
			}
		},
		"news" : {
			name : "news",
			nodes : {
				"nytimes" : "http://www.nytimes.com/",
				"washington post" : "https://www.washingtonpost.com/",
				"the guardian" : "http://www.theguardian.com/",
				"atlantic" : "http://www.theatlantic.com/world/",
				"g1" : "http://g1.globo.com/",
				"estadao" : "http://www.estadao.com.br/",
				"terra" : "http://www.terra.com.br/",
				"hacker news" : "https://news.ycombinator.com/",
				"slashdot" : "https://slashdot.org/",
				"techcrunch" : "http://techcrunch.com/",
				"us gizmodo" : "http://us.gizmodo.com/",
				"br gizmodo" : "http://gizmodo.uol.com.br/",
				"adrenaline" : "http://adrenaline.uol.com.br/",
				"kotaku" : "http://kotaku.com/"
			}
		},
		"flags" : "flags"
	};
	
	
	function check_available_url(url) {
		var available_url_list = [
			
			"https://www.w3.org/TR/#tr_Accessibility__All_",
			"https://www.w3.org/TR/hr-time/",
			"https://dev.w3.org/html5/html-author/charref",
			"https://www.w3.org/TR/XMLHttpRequest/",
			"https://www.w3.org/DOM/Activity",
			"https://www.w3.org/TR/#tr_DOM_events",
			"https://www.w3.org/TR/IndexedDB/",
			"https://www.w3.org/TR/webaudio/",
			"https://www.w3.org/TR/FileAPI/",
			"https://www.w3.org/TR/webstorage/",
			"https://www.w3.org/TR/DataCache/",
			"http://www.ecma-international.org/ecma-262/5.1/",
			"https://www.w3.org/TR/cors/",
			"https://www.w3.org/TR/CSS2/",
			"https://www.w3.org/TR/REC-CSS1/",
			"https://www.w3.org/TR/geolocation-API/",
			"https://www.w3.org/TR/webrtc/",
			"https://www.w3.org/TR/WebCryptoAPI/",
			"https://www.w3.org/TR/SVG11/",
			"https://www.w3.org/TR/PNG/",
			"https://www.w3.org/Graphics/GIF/spec-gif87.txt",
			"https://www.w3.org/Graphics/GIF/spec-gif89a.txt",
			"https://www.w3.org/Graphics/JPEG/itu-t81.pdf",
			"http://localhost:81/jpeg_question/trouble.txt",
			
			"https://www.w3.org/TR/shadow-dom/",
			"https://www.khronos.org/registry/webgl/specs/latest/2.0/",
			"https://www.khronos.org/registry/webgl/specs/latest/1.0/",
			"https://www.w3.org/TR/xpath-30/",
			"https://www.w3.org/TR/xpath20/",
			"https://www.w3.org/TR/xpath/",
			
			
			
			"http://localhost:81/lesson1%20-%20starting%20weblgl/index.html",
			"http://localhost:81/lesson2%20-%20color,%20multiple%20objects/index.html",
			"http://localhost:81/lesson3%20-%20rotation/index.html",
			"http://localhost:81/lesson4%20-%20mesh%20object/index.html",
			"http://localhost:81/lesson5%20-%20textures/index.html",
			"http://localhost:81/lesson6%20-%20camera/index.html",
			"http://localhost:81/lesson7%20-%20light/index.html",
			"http://localhost:81/lesson8%20-%20teture%20blending/index.html",
			"http://localhost:81/lesson9%20-%20particles/index.html",
			"http://localhost:81/lesson10%20-%20face%20culling,%20multimapping/index.html",
			"http://localhost:81/lesson11%20-%20mouse,%20light%20control/index.html",
			"http://localhost:81/lesson12%20-%20reference%20rotation%20research%20fragment%20and%20vertex,%20texture%20load/index.html",
			"http://localhost:81/lesson13%20-%20close%20lights%20to%20specular%20diffuse%20ambient/index.html",
			"http://localhost:81/lesson14%20-%20texture%20and%20light%20study/index.html",
			"http://localhost:81/lesson15%20-%20sphere%20correct%20texture%20and%20lights/index.html",
			"http://localhost:81/lesson16%20-%20dynamic%20texture,%20camera%20transfer/index.html",
			
			"http://www.pattakon.com/",
			"http://www.visual6502.org/",
			"http://virtualpiano.net/",
			"https://www.kineman.com/",
			"http://www.zephyrosanemos.com/",
			"https://github.com/mrdoob/three.js/",
			"https://pomax.github.io/bezierinfo/",
			"http://editor.thebookofshaders.com/",
			"http://www.personal.kent.edu/~rmuhamma/Compgeometry/compgeom.html",
			"http://betterexplained.com/guides/calculus/",
			
			// news 
			"http://www.nytimes.com/",
			"https://www.washingtonpost.com/",
			"http://www.theguardian.com/",
			"http://www.theatlantic.com/world/",
			"http://g1.globo.com/",
			"http://www.estadao.com.br/",
			"http://www.terra.com.br/",
			"https://news.ycombinator.com/",
			"https://slashdot.org/",
			"http://techcrunch.com/",
			"http://us.gizmodo.com/",
			"http://gizmodo.uol.com.br/",
			"http://adrenaline.uol.com.br/",
			"http://kotaku.com/"
		];
		for(var x = 0; x < available_url_list.length;x++) {
			if( available_url_list[x].indexOf( url ) == 0 ) {
				return true;
			}	
		}
	}
	function create_link(key,json,parent,level,captionPath,namePath) {
		var t = Object.prototype.toString.apply(json[key]);
		if(key == "_") return;
		
		function element() {
			var page1 = parent.elementNew(key,"div");
			$( page1, {
				paddingLeft : (10*(level+1)) + "px",
				cursor : "default",
				events : {
					"mouseover" : function() {
						$(page1,{color:"#fff", backgroundColor : "#888" });
					}
					, "mouseout" : function() {
						$(page1,{ color : "#000", backgroundColor : "#fff"});
					}
					, "click" : function() {
						p.el.frame1_title.innerHTML = (captionPath.length>0 ? "/" : "" ) + captionPath.join("/") + "/" + key;
						if( check_available_url( json[key] ) ) 
							p.el.frame1.setAttribute("src", json[key] );
						else
							p.el.frame1.setAttribute("src","index.html#" + namePath.join(".") + (namePath.length!=0 ? "." : "") + json[key]);
					}
				}
			},key);
			
		}
		function group() { // or complex leaf
			//console.log("group");
			var state = 0;
			var groupHead = parent.elementNew("groupHead_"+key,"div");
			var groupBody = parent.elementNew("groupBody_"+key,"div");
			var groupBodyContainer = parent.elementGetContents("groupBody_"+key);
			$( groupBody, { display : "none" });
			function element_vp(parent2,level,key,item) {
				var page2 = parent2.elementNew(key,"div");
				$( page2, {
					paddingLeft : (10*(level+1)) + "px",
					cursor : "default",
					events : {
						"mouseover" :function() {
							$( page2, { color : "#fff", backgroundColor : "#888" });
						},
						"mouseout" : function() {
							$( page2, { color : "#000", backgroundColor : "#fff" });
						},
						"click" : function() {
							if( item.type == "music" ) {
								if(item.base == "youtube") {
									p.el._desc.innerHTML = key + "<br/>" + item.base + "//" + item.id;
									localStorage.setItem("temporary.musicplayer","http://www.youtube.com/embed/" + item.id + "?autoplay=1&loop=1");
									p.el.music_player.setAttribute("src","");
									setTimeout(function() {
										p.el.music_player.setAttribute("src","index.html#music_player");		
									},100);
									
								}
							}
						}
					}
				},key);
			}
			if("type" in json[key]) {
				if(json[key].type == "music") {
					for(var subkey in json[key].nodes) {
						// just like element but redirects to music player
						element_vp( groupBodyContainer,level+1,subkey,json[key].nodes[subkey]);
					}
				}
			} else {
				var caption_path_copy = captionPath.slice(0);
				var name_path_copy = namePath.slice(0);
				caption_path_copy.push( key );
				name_path_copy.push( json[key].name );
				for(var subkey in json[key].nodes) {
					create_link( subkey, json[key].nodes, groupBodyContainer, level+1, caption_path_copy, name_path_copy );
				}
			}
			$( groupHead,{
				cursor : "default",
				paddingLeft : (10*(level) + 5) + "px",
				borderLeft : "solid 5px #000",
				events : {
					"click" : function() {
						if(state==0) {
							if("description" in json[key]) p.el._desc.innerHTML = json[key].description;
							$( groupBody, {
								display : "", borderBottom : "solid 1px #000", borderTop : "solid 1px #000"
							});
							state = 1;
						} else {
							$(groupBody, {
								borderBottom : "", borderTop : "", display : "none" 
							});
							if("description" in json[key]) p.el._desc.innerHTML = json[key].description;
							state = 0;
						}
					},
					"mouseover" : function() {
						groupHead.style.borderBottom = "solid 1px #000";
					},
					"mouseout" : function() {
						groupHead.style.borderBottom = "";
					}
				}
			},key);
		}
		if(t == "[object Object]") { group(); } else if(t == "[object String]") { element(); }
	}
	for(var key in json_menu) {
		create_link(key,json_menu,page_menu_container,0,[],[]);
	}
	
	
	
	
});