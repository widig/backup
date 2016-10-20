
Class.define("NotePanel",{
ctor : function() {
	
	// ASCII PROJECT
	// 
	// build : 
	//     model -> skeleton -> sphere                                        -> [type] ball
	//                          box|block
	//                          piramid|cone
	//                          human
	//                          support|[type]cycle|drone/car|truck|plane
	//     scene -> park
	//              desert
	//              city
	//              jungle
	//              
	//     movie -> text              |             | [ ] dialogs
	//              melody            |             | [ ] music
	//              hit               | workflow -> | [ ] subtitles
	//              stretch           |             | [ ] voice audio
	//              liquid            |             | [ ] interactive    | workflow -> (2)
	//              particles         |
	//   
	//   (2)  game equations -> board
    //                          run
	//                          pinball
	//                          air hockey (ad environment)
	//
	//
	var root_tree = {
		model : {
			skeleton : {
				sphere : { "$" : {} },
				box_1_block : { box : { "$" : {} }, block : {} },
				piramid_1_cone : { piramid : {}, cone : {} },
				human : {},
				support_1_2_type_2_cycle_1_drone_3_car_1_truck_1_plane : {
					support : {},
					_2_type_2_cycle : {},
					drone_3_car : {},
					truck : {},
					plane : {}
				}
			}
		},
		scene : {
			park : {}, desert : {}, city : {}, jungle : {}
		},
		movie : {
			text : {}, melody : {}, hit : {}, stretch : {}, liquid : {}, particles : {}
		}
	};
	var movie_panel = {
		options : ["dialogs","music","subtitle","voice audio","interactive"]
	};
	var game_equations_tree = {
		board : {}, run : {}, pinball : {}, air__hockey : {}
	};
},
proto :{
	
}})
Router.addPage({name:"notes",template:"base"},function(args, template, router) {
	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	
	var $ = BrowserTools.setStyle;
	var $$ = BrowserTools.arraySetStyle;
	var rollover = BrowserTools.inoutStyle;
	
	function curry(f,a,b) { var _a = a, _b = b; return function(target) { f.apply(target,[a,b]); }; }
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt");
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	var p = origin_lt_container.elementNewPacket(
		"<div id=\"container\">"+
			"<table id=\"table\">"+
				"<tr id=\"menu\">"+
					"<td rowspan=\"2\" id=\"mock\" width=\"50\"></td>"+
					"<td><span id=\"filenameCaption\"></span><div id=\"changedMark\"></div></td>"+
					"<td rowspan=\"2\" id=\"setDocument\" width=\"50\"></td>"+
					"<td rowspan=\"2\" id=\"getDocument\" width=\"50\"></td>"+
					"<td rowspan=\"2\" id=\"downloadDocument\" width=\"50\"></td>"+
					"<td rowspan=\"2\" id=\"uploadDocument\" width=\"50\"></td>"+
					"<td rowspan=\"2\" id=\"backupDocument\" width=\"50\"></td>"+
					// cloud backup
					"<td rowspan=\"2\" width=\"*\"></td>"+
				"</tr>"+
				"<tr>"+
					"<td id=\"tdInput\">"+
						"<input id=\"DocumentName\" type=\"text\"/><div id=\"divInputSelect\"></div>"+
						"<div id=\"selectDocument\"></div>"+
					"</td>"+
				"</tr>"+
			"</table>"+
			"<div id=\"panelInputSelect\"></div>" +
			"<input id=\"btnUpload\" type=\"file\" name=\"fileselect[]\" multiple=\"multiple\"/>" +
			"<textarea id=\"control\" spellcheck=\"false\"></textarea>" + 
		"</div>"
	);
	
	var sz = UI.Window.getBounds();
	// notes inputSelection
	var panelInputSelectControl = {};
	
	var cmd = {
		set : function() { 
			$(p.el.changedMark,{ color :"#fff"},"");
			// check if reference do exists
			var fs = this.get_fs();
			var full_name = p.el.DocumentName.value;
			arr = name.split(".");
			if(arr.length>0) {
				var base = arr[0] in fs.nodes ? fs.nodes[ arr[0] ] : null;
				if( base == null && arr.length == 1) {
					fs.nodes[ arr[0] ] = {
						type : "file",
						mime : "text/plain"
					};
				} else if(arr.length==1) {
					if( base.type == "file" && base.mime == "text/plain") {
						// exists, do nothing	
					} else {
						UI.Window.consoleLog( name, base.type, base.mime );
						throw "unexpected type.";
					}
				} else if(arr.length > 1) {
					if(base == null) {
						fs.nodes[ arr[0] ] = {
							type : "folder",
							name : arr[0], // partial name
							nodes : {}
						};
					}
					base = fs.nodes[arr[0]];
					var step = 1;
					while(step < arr.length) {
						if( base.type == "folder" && step + 1 < arr.length) {
							if( arr[step] in base.nodes ) {
								base = base.nodes[ arr[ step ] ];
							} else {
								base.nodes[ arr[ step] ] = { type : "folder", nodes : {} };
								base = base.nodes[ arr[ step ] ];
							}
						} else if(base.type == "folder" ) {
							if( step == arr.length-1 ) {
								if( arr[step] in base.nodes && base.nodes[ arr[step] ].type == "file" && base.nodes[ arr[step] ].mime == "text/plain") {
									// the one, do nothing
								} else if( !(arr[step] in base.nodes) ) {
									base.nodes[ arr[step] ] = {
										type : "file",
										mime : "text/plain"
									};
								} else {
									UI.Window.consoleLog( name );
									throw "it is not a valid path";
								}
							} else {
								UI.Window.consoleLog( name );
								throw "it is not a valid path";
							}
						} else if( base.type == "file" && step +1 < arr.length) {
							throw "it is not a valid path";
						} else if( base.type == "file" && step == arr.length-1) {
							
						}
						step += 1;
					}
					
				}
			} else {
				throw "must have a name"; // deal with it
			}
			localStorage.setItem("index." + p.el.DocumentName.value,p.el.control.value); 
		},
		get : function() { 
			// check if reference do exists
			var fs = this.get_fs();
			
			p.el.control.value = localStorage.getItem(p.el.DocumentName.value); 
		},
		download : function() { Download.text( p.el.control.value , p.el.DocumentName.value ); },
		upload : function(files) {
			//var files = e.target.files || e.dataTransfer.files;
			var files = files.target.files;
			for (var i = 0, f; f = files[i]; i++) {
				var reader = new FileReader();
				reader.onload = (function(current) { return function(e) { p.el.control.value = e.target.result; }; })(f);
				reader.readAsText(f);
				return;
			}
		},
		backup : function() {
			localStorage.setItem(p.el.DocumentName.value+"_backup",p.el.control.value); 
		},
		get_fs : function() {
			// load reference tree
			var data = localStorage.getReservedItem("index");
			if(data == null) { // init reference tree
				data = {
					type : "folder",
					name : "index",
					nodes : {}
				};
				localStorage.setReservedItem("index",JSON.stringify(data));
			}
			return JSON.parse( data );
		},
		update_fs : function(target) {
			
		},
		backup_fs : function() {
			
		}
	}
	$( origin_lt, { width : sz[0] + "px", height : sz[1] + "px", overflow : "hidden" });
	$( p.el.mock, { backgroundColor: "#000" } );
	$( p.el.container, { border : "solid 1px #fff", position : "absolute", left : "0px", top : "0px", width : sz[0] + "px", height : sz[1] + "px" });
	$( p.el.table, { 
		position : "absolute", left : "0px", top : "0px",
		attribs : { width : "100%", border : 0, cellpadding : 0, cellspacing : 0}
	});
	$( p.el.menu, {
		attribs : {
			height : 30 
		}
	});
	//var f = curry(inoutStyle, { backgroundColor : "#000", color : "#fff" }, { backgroundColor : "#fff", color : "#000" } );
	var y = 48;
	
	$( p.el.control, {
		position : "relative", left : "0px", top : y+"px", width : (sz[0]-4-20) + "px", height : (sz[1]-y-3-18) + "px", margin : "0px",
		fontFamily : "monospace", border : "0", outline : "0", borderTop : "solid 1px #000", borderBottom : "solid 1px #000", resize : "none",
		padding : "10px",
		events : {
			keyup : function(e) { if(e.keyCode == KeyCode.CTRL) { ctrl = false; } },
			keydown : function(e) {
				if(e.keyCode == KeyCode.CTRL) { ctrl = true; }
				else if(
					e.keyCode == KeyCode.ALT || e.keyCode == KeyCode.SHIFT || e.keyCode == KeyCode.ESCAPE ||
					e.keyCode == KeyCode.LEFT || e.keyCode == KeyCode.UP || e.keyCode == KeyCode.DOWN || e.keyCode == KeyCode.RIGHT ||
					e.keyCode == KeyCode.PAGEDOWN || e.keyCode == KeyCode.PAGEUP || e.keyCode == KeyCode.HOME || e.keyCode == KeyCode.INSERT || e.keyCode == KeyCode.END
				) { 
				}
				else if(ctrl && e.keyCode == KeyCode.S) { 
					console.log("saving");
					cmd.set(); 
					e.preventDefault(); 
				} 
				else if(ctrl && e.keyCode == KeyCode.G) { cmd.get(); e.preventDefault(); }
				else if(ctrl && e.keyCode == KeyCode.D) { cmd.download(); e.preventDefault(); }
				else if(ctrl) {
					if(e.keyCode == KeyCode.V) {
						$(p.el.changedMark,{
							color : "#f00"
						},"(changed)");
					}
				} 
				else if( e.keyCode >= KeyCode.F1 && e.keyCode <= KeyCode.F12) {
					
				} else {
					$(p.el.changedMark,{
						color : "#f00"
					},"(changed)");
				}
				
				return false;
			}
		}
	});
	
	var data = localStorage.getItem("pages.notes2.data");
	if(Object.prototype.toString.apply(data)=="[object String]") { p.el.control.value = data; }
	var w = parseInt(100/(3));
	//f( p. el.download );
	var ctrl = false;
	
	$(p.el.filenameCaption,{
		paddingLeft : "10px",
		fontFamily : "monospace",
		fontSize : "15px"
	},"Location:");
	$(p.el.changedMark,{
		float : "right",
		fontFamily : "monospace",
		paddingRight : "10px"
	},"");
	
	$(p.el.tdInput,{
		width : "450px",
		position : "relative",
		top : "-5px",
		paddingLeft : "10px",
		paddingRight : "10px"
	});
	
	var boolSwitchPanelInputSelect = false;
	
	$(p.el.divInputSelect,{
		float : "right",
		position : "relative",
		border: "solid 1px #eeeeee",
		backgroundColor : "#ccc",
		width : "19px",
		height : "13px",
		left : "0px",
		top : "0px",
		events : {
			click : function() {
				if(!boolSwitchPanelInputSelect) {
					$( p.el.panelInputSelect, {
						display :""
					});
					boolSwitchPanelInputSelect = true;
				} else {
					$( p.el.panelInputSelect, {
						display :"none"
					});
					boolSwitchPanelInputSelect = false;
				}
				// fill with files
				//for(var key in json_menu) {
					//create_link(key,json_menu,_page_menu_container,0,[],[]);
				//}
			}
		}
	});
	$( p.el.panelInputSelect, {
		position : "absolute",
		display : "none",
		left : "49px",
		top : "48px",
		width : "470px",
		height : "300px",
		border : "solid 1px #000",
		backgroundColor : "#fff",
		overflowX : "hidden",
		zIndex : 2
	});
	rollover.apply( p.el.divInputSelect, [{ backgroundColor : "#888"},{ backgroundColor : "#ccc"}]);
	
	$( p.el.DocumentName, {
		fontFamily : "monospace",
		paddingLeft : "5px",
		width : "410px",
		outline : "none",
		border : "0px",
		value : "pages.notes2.data"
	});
	
	
	$( p.el.setDocument, {
		cursor : "pointer",
		backgroundColor : "#800",
		fontFamily : "monospace",
		fontSize : "15px",
		textAlign : "center",
		color : "white",
		events : {
			"click" : function() { cmd.set(); }
		}
	},"set");
	rollover.apply( p.el.setDocument, [{ backgroundColor : "#F00"},{ backgroundColor : "#800"}]);
	
	$( p.el.getDocument, {
		cursor : "pointer",
		backgroundColor : "#008",
		fontFamily : "monospace",
		fontSize : "15px",
		textAlign : "center",
		color : "white",
		events : {
			"click" : function() { cmd.get(); }
		}
	},"get");
	rollover.apply( p.el.getDocument, [{ backgroundColor : "#00F"},{ backgroundColor : "#008"}]);
	$( p.el.downloadDocument,{
		cursor : "pointer",
		backgroundColor : "#880",
		fontFamily : "monospace",
		fontSize : "15px",
		textAlign : "center",
		color : "white",
		events : {
			click : function() { cmd.download(); }
		}
	},"down");
	rollover.apply( p.el.downloadDocument, [{ backgroundColor : "#FF0", color : "#000" },{ backgroundColor : "#880", color : "#FFF" }]);
	$( p.el.uploadDocument,{
		cursor : "pointer",
		backgroundColor : "#080",
		fontFamily : "monospace",
		fontSize : "15px",
		textAlign : "center",
		color : "white"
	},"up");
	rollover.apply( p.el.uploadDocument, [{ backgroundColor : "#0F0", color : "#000"},{ backgroundColor : "#080", color : "#FFF"}]);
	
	
	$( p.el.backupDocument,{
		cursor : "pointer",
		backgroundColor : "#088",
		fontFamily : "monospace",
		fontSize : "15px",
		textAlign : "center",
		color : "white",
		events : {
			click : function() { cmd.backup(); }
		}
	},"last");
	rollover.apply( p.el.backupDocument, [{ backgroundColor : "#0FF", color : "#000"},{ backgroundColor : "#088", color : "#FFF"}]);
	
	
	UI.Window.on("resize",function() {
		
		var sz = UI.Window.getBounds();
		$( origin_lt, { width : (sz[0]-2) + "px", height : sz[1] + "px" });
		$( p.el.container, { width : (sz[0]-2) + "px", height : sz[1] + "px" });
		$( p.el.control, { width : (sz[0]-4-20) + "px", height : (sz[1]-y-5-16) + "px" });
		return true;
	});
	$( p.el.btnUpload, {
		cursor : "pointer",
		position : "absolute",
		left : "670px",
		top : "0px",
		width : "50px",
		height : "100px",
		outline : "none",
		backgroundColor : "#f00",
		opacity : 0.0,
		events : {
			"mouseover" : function() { $(p.el.uploadDocument,{ backgroundColor : "#0F0", color : "#000"}); },
			"mouseout" : function() { $(p.el.uploadDocument,{ backgroundColor : "#080", color : "#FFF"}); },
			"dragover" : function() { $(p.el.uploadDocument,{ backgroundColor : "#0F0", color : "#000"}); },
			"dragleave" : function() { $(p.el.uploadDocument,{ backgroundColor : "#080", color : "#FFF"}); },
			"change" : function(e) { cmd.upload( e ); },
			"drop" : function(e) {
				var files = e.target.files || e.dataTransfer.files;
				cmd.upload(files);
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		}
	});
	
	
});