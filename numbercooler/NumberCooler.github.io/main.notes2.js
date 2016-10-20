var selection_start_backup = document.onselectstart;

Class.define("NotePanel2",{
ctor : function(parent,parent_callback_message,this_callback_context) {
	
	
	
	var i = this.internal["NotePanel2"].data = {};
	i.parent = parent;
	i.owner_callback = parent_callback_message;
	i.next_callback = this_callback_context;
	// ASCII PROJECT
	// 
	// build : 
	//     dialog -> form -> all_controls_sample
	//
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
	
	
	/*
					
		language creation?
		canvas stream movie (youtube proxy?) player
		webgl game player
		audio player
		
		table plotter
		-> table file
		
		
		// every design goes to pdf, pure html, localstorage, json file
		// localStorge accepts program execution
		
		// unified camera control over viewports
		
		menu designer
		control designer
		audio designer
		model designer -> vertex shader designer
		scene designer
		font designer
		workflow designer
		math notes -> mathjax?
			trajectory problems
		image designer -> fragment shader designer
		javascript program to bind imports and exports
		svg designer (ok)
		multimedia designer
		device designer
		
		communicator/messages interface
		forum interface
		pool interface
		request for comments interface (disqus)
		
		
		storage manager
			localStorage
			server
			project assets
			
	*/
					
	
	this.Reset();
	
},
proto :{
	Reset : function() {
		var $ = BrowserTools.setStyle;
		var i = this.internal["NotePanel2"].data;
		var parent = i.parent;
		parent.elementsClear();
		var root_tree = {
			page : {
				blank : {
					"$" : {
					}
				}
			},
			dialog : {
				form : {
					all_controls_sample : {
						"$" : {
							type : "dialog_source",
							menu : ["publish","edit","lock","unlock","tools"]
						}
					}
				}
			},
			model : {
				skeleton : {
					plane : { // gravity better tied than box, stable
						thick : {},
						thin : {}
					},
					sphere : { // dynamic
						"$" : {} 
					},
					icosahedron : {
						
					},
					box : { // a plane that works like a unique particle, dynamic
						"$" : {
							nodes : {
								materials : {
									solid : {
										
									},
									solid_phong : {
									},
									plastic : {
										
									},
									wood : {
										
									},
									glass : {
										
									},
									metal : {
										
									},
									rubber : {
										
									}
								}
							}
						} 
					},
					disk : { // stable or dynamic
						"$" : {}
					},
					ncoil : { // also known as spring
					
					},
					flag : {
						
					},
					pool : { // dynamic
						"$" : {}
					},
					tree : {
					},
					piramid_1_cone : { piramid : { "$" : {} }, cone : { "$" : {} } },
					parts : {
						simple_axis_weld : {
							"$" : {
							}
						},
						same_axis_rotation  : {
							"$" : {
							}
						},
						other_axis_rotation : {
							"$" : {
							}
						},
						y_connector : {
							"$" : {
							}
						},
						t_connector : {
							"$" : {
							}
						},
						x3s_connector : {
							"$" : {
							}
						},
						square_connector : {
							"$" : {
							}
						},
						cube_connector : {
							"$" : {
							}
						},
						custom_connector : {
							"$" : {
							}
						},
						damper : {
							"$" : {
							}
						},
						bone : {
							"$" : {
								
							}
						}
					},
					human : { 
						"$" : {},
						wearing : {
							shoes : {
							},
							pants : {
							},
						},
						arms : {
						},
						legs : {
						},
						hands : {
						},
						body : {
						},
						head : {
						},
						devices : {
						}
					},
					animal : {
						four_feet : {
						},
						six_feet : {
						},
						two_feet : {
						}
					},
					vehicles : {
						support : { 
							"$" : {} 
						},
						_2_type_2_cycle : { 
							"$" : {} 
						},
						drone_3_car : { 
							"$" : {} 
						},
						truck : { 
							"$" : {} 
						},
						plane : { 
							"$" : {} 
						},
						custom : {
							"$" : {}
						}
					}
				},
				text : {
					"$" : {
					},
					banner : {
						"$" : {
						}
					},
					plaque : {
						"$" : {
						}
					},
					stamp : {
						"$" : {
						}
					},
					paper : {
						"$" : {
						}
					},
					editor : {
						"$" : {
						}
					},
					bubble : {
						"$" : {
						}
					}
				}
			},
			scene : {
				park : { 
					"$" : {
						type : "scene.park",
						menu : [ "trees", "path", "people", "lights" ]
					} 
				}, 
				desert : { 
					"$" : {
						type : "scene.desert",
						menu : [ "terrain", "beings", "lights" ]
					} 
				}, 
				city : { 
					"$" : {
						type : "scene.city",
						menu : ["buildings","streets","people","cars","planes","trees","lights"]
					}
				}, 
				jungle : { 
					"$" : {
						type : "scene.jungle",
						menu : ["trees", "beings", "lights"]
					} 
				},
				blank : {
					"$" : {
						menu : ["terrain","lights","to model","boolean","face_bridge","object_projection"]
					}
				}
			},
			movie : {
				melody : { "$" : {} }, 
				hit : { "$" : {} }, 
				force : {"$" : {} },
				travel : { "$" : {} },
				stretch : { "$" : {} }, 
				liquid : { "$" : {} }, 
				particles : { "$" : {} },
				ray : { "$" : {} },
				blank : {
					"$" : ["import","properties","timeline","gravity","wind"]
				}
			},
			shaders : {
				vertex : {
					"$" : {}
				},
				fragment : {
					"$" : {}
				}
			},
			"separator" : {
				"$" : {
					really_a_separator : 0
				}
			},
			list_all_menu_fullnames : {
				"$" : {
					
				}
			},
			notes : {
				"$" : {
					
				}
			}
		};
		var movie_panel = {
			options : ["dialogs","music","subtitle","voice audio","interactive"]
		};
		var game_equations_tree = {
			board : { "$" : {} }, run : { "$" : {} }, pinball : { "$" : {} }, air__hockey : { "$" : {} }
		};
		
		var point = root_tree;
		var previous = null;
		var next = null;
		
		var keys = [];
		for(var key in point) {
			keys.push(key);
		}
		keys.sort();
		
		function set_item(key,last,current) {
			var div = parent.elementNew(key,"div");
			var div_container = parent.elementGetContents(key);
			var def = {
				paddingLeft : "10px",
				fontFamily : "monospace",
				fontSize : "15px",
				height : "50px",
				events : {
					mouseover : function() {
						$(div,{ backgroundColor: "#000", color : "#fff"} );
					},
					mouseout : function() {
						$(div,{ backgroundColor: "#fff", color : "#000"} );
					},
					click : function() {
						// clear current panel
						parent.elementsClear();
						// set current path
						
						// set new panel
						var nkeys = [];
						point = point[key];
						for(var key2 in point) {
							if(key2 != "$") {
								nkeys.push(key2);
							}
						}
						if(nkeys.length==0) {
							var r = i.owner_callback( current.join(".") );
							console.log("##############", r.type);
							i.next_callback( r );
							//this_callback_context( i.callback( current.join(".") ) );
						} else {
							nkeys.sort();
							for(var x = 0; x < nkeys.length;x++) {
								var nkey = nkeys[x];
								if(nkey != "$") {
									// copy current path
									var copy = [];
									for(var y = 0; y < current.length;y++)
										copy.push( current[y] );
									copy.push(nkey);
									set_item(nkey,x==nkeys.length-1,copy);
								}
							}
						}
					}
				}
			}
			
			
			
			var items = [];
			for(var x = 0; x < 5;x++) {
				items.push("<td></td>");
			}
			var html_piece = 
					"<table>"+
					"<tr>"+
						"<td id=\"title\" colspan=\"5\">"+
						"</td>"+
					"</tr>"+
					"<tr>"+
						items.join("");
					"</tr>"+
				"</table>";
				
			var packet = div_container.elementNewPacket(
				html_piece
			);
			// packet.title
			packet.el.title.innerHTML = key;
			if(!last) {
				def.borderBottom = "solid 1px #000";
				$(div,def,"");
				
			} else {
				$(div,def,"");
			}
			
			
		}
		for(var x = 0; x < keys.length;x++) {
			var key = keys[x];
			set_item(key,x==keys.length-1,["index",key]);
		}
		
	}
}})
Router.addPage({name:"note_display",template:"base"},function(args, template, router) {
	
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt");
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	
});
Router.addPage({name:"notes2",template:"base"},function(args, template, router) {
	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	
	
	document.onselectstart = function() { return false; };
	
	var $ = BrowserTools.setStyle;
	var $$ = BrowserTools.arraySetStyle;
	var rollover = BrowserTools.inoutStyle;
	
	function curry(f,a,b) { var _a = a, _b = b; return function(target) { f.apply(target,[a,b]); }; }
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt");
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	var p = origin_lt_container.elementNewPacket(
		"<div id=\"container\">"+
			"<table id=\"table\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" height=\"60\">"+ /*did height 60 to get border */
				"<tr id=\"menu\">"+
					"<td rowspan=\"2\" id=\"gotoFrame\" width=\"50\"></td>"+
					"<td><span id=\"filenameCaption\"></span><div id=\"changedMark\"></div></td>"+
					"<td id=\"SeparatorExtension\"><span id=\"extensionCaption\"></span></td>"+
					"<td rowspan=\"2\" id=\"setDocument\" width=\"50\"></td>"+
					"<td rowspan=\"2\" id=\"getDocument\" width=\"50\"></td>"+
					"<td rowspan=\"2\" id=\"downloadDocument\" width=\"50\"></td>"+
					"<td rowspan=\"2\" id=\"uploadDocument\" width=\"50\"></td>"+
					"<td rowspan=\"2\" id=\"downloadFileSystem\" width=\"50\"></td>"+
					"<td rowspan=\"2\" id=\"syncFileSystem\" width=\"50\"></td>"+
					"<td rowspan=\"2\" width=\"50\"></td>"+
					
					// cloud backup
					"<td rowspan=\"2\" width=\"*\"></td>"+
					"<td rowspan=\"2\" id=\"gotoThis\" width=\"50\"></td>"+
				"</tr>"+
				"<tr>"+
					"<td id=\"tdInput_Filename\">"+
						"<input id=\"DocumentName\" type=\"text\" spellcheck=\"false\"/><div id=\"divInputSelect\"></div>"+
						"<div id=\"selectDocument\"></div>"+
					"</td>"+
					"<td id=\"tdInput_Extension\">"+
						"<input id=\"ExtensionName\" type=\"text\"/><div id=\"changeExtensionButton\"></div>"+
					"</td>"+
				"</tr>"+
			"</table>"+
			"<div id=\"panelInputSelect\"></div>" +
			"<div id=\"clipPanel\"></div>" + 
			"<input id=\"btnUpload\" type=\"file\" name=\"fileselect[]\" multiple=\"multiple\"/>" +
			
			//756
			
			"<div id=\"displayFrame\">"+
				"<iframe id=\"displayDevice\" src=\"/#notes-keyframe\" width=\"200\" height=\"200\" frameBorder=\"0\"></iframe>"+
			"</div>" +
			
			"<textarea id=\"control\" spellcheck=\"false\"></textarea>"+
			
		"</div>"
	);
	
	var editor_globals = {
		font : {
			color : ["#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF","#FF00FF","#000000","#FFFFFF"],
			size : ["12px","16px","20px","24px","28px","32px","36px","40px","44px","48px"]
		}
	};
	
	
	
	var editor = {
		menu : true,
		font : {
			color : localStorage.getItem("index.editor.font.color") ? parseInt( localStorage.getItem("index.editor.font.color") ) : 0,
			size : localStorage.getItem("index.editor.font.size") ? parseInt( localStorage.getItem("index.editor.font.size") ) : 0
		},
		internal : {
			events : {}
		},
		position : [0,0,0],
		visibility : true,
		keyboard : {
			ctrl : false,
			shift : false,
			alt : false
		},
		source : "",
		mode : {
			selected : null
		}
	};
	
	function EditorFileFormat() {
		
	}
	
	EditorFileFormat.PacketContext = function() {
		
	}
	EditorFileFormat.PacketDataView = function(mainDoc,components) {
		
		this.main = mainDoc;
		this.components = components;
		this.context = new EditorFileFormat.PacketContext();
		this.files = {};
		this.current = {
			type : "#index",
			value : "main",
			index : 0,
			subindex : 0,
			stackindex : -1
		};
		this.current.parent = this;
		this.stack = [];
		this.context.components = this.components;
	}
	
	localStorage.setItem("index.editor.font.color",editor.font.color);
	localStorage.setItem("index.editor.font.size",editor.font.size);
	
	
	var sz = UI.Window.getBounds();
	var cmd = {
		loadPacketControl : function(json) {
			console.log("loading packet " + p.el.DocumentName.value);
			if("components" in json) {
				
				var data = editor.mode.data = new EditorFileFormat.PacketDataView(""+p.el.DocumentName.value,json.components);
				
				// must load previous context if is not a new packet
				
				// once loaded you can edit only the refered files. to list components we need to add a control to
				// show manager list in editor
				// change save file to save file and project
				
				for(var x = 0; x < json.components.length;x++) {
					var component = data.files[ json.components[x] ] = [];
					
					
					var generate_packet_file = localStorage.getItem( json.components[x] +".ghtml"); // not an extension
					if(generate_packet_file!=null && Object.prototype.toString.apply(generate_packet_file) == "[object String]") {
						component.push( {
							name : json.components[x] + ".ghtml",
							ext : "js",
							has_index : false
						});
						var f1 = new Function(generate_packet_file);
						var generated_packet = f1.apply(cmd);
						if(generated_packet != null && Object.prototype.toString.apply(generated_packet) == "[object String]") {
							
							var packet = cmd.loadSvgControl.apply(self,[generated_packet]);
							
							var code_file = localStorage.getItem(json.components[x] + ".js");
							if(code_file!=null && Object.prototype.toString.apply(code_file) == "[object String]") {
								component.push({
									name : json.components[x] + ".js",
									ext : "js",
									has_index : false
								});
								console.log(packet);
								
								try {
									var f = new Function( "context","packet",  code_file);
									f.apply(cmd,[data.context,packet]);	
								} catch(e) {
									console.log("error",e);
								}
								
							}
						}
					} else {
						var packet_file = localStorage.getItem( json.components[x] +".phtml"); // not an extension
						var code_file = localStorage.getItem( json.components[x] + ".js"); // not an extension
						if(packet_file!=null && Object.prototype.toString.apply(packet_file) == "[object String]") {
							component.push({
								name : json.components[x] + ".phtml",
								ext : "svg",
								has_index : false
							});
							
							var packet = cmd.loadSvgControl.apply(self,[packet_file]);
							
							if(code_file!=null && Object.prototype.toString.apply(code_file) == "[object String]") {
								console.log("packet:" + packet_file + "\r\ncode:" + code_file);
								try {
									var f = new Function( "context","packet",  code_file);
									f.apply(cmd,[data.context,packet]);
								} catch(e) {
									console.log("error",e);
								}
								component.push({
									name : json.components[x] + ".js",
									ext : "js",
									has_index : false
								});
							}
						} else {
							// unkown state
							p.el.DocumentName.value = "[system message]";
							p.el.ExtensionName.value = "bug";
							p.el.control.value = "packet file error -> " + data.main + "\r\n" + localStorage.getItem(data.main);
							throw "packet file. error state.";
						}
					}
				}
				p.el.control.value = localStorage.getItem(p.el.DocumentName.value);
				
				editor.mode.selected = "packet";
				editor.mode.data = data;
				editor.mode.ComponentPrevious = function() {
					console.log("COMPONENT PREVIOUS ACTION");
					if(editor.mode.data.current.type == "#index") {
						console.log("COMPONENT PREVIOUS ACTION file");
						// get 0 of items
						if( editor.mode.data.components.length > 0) {
							
							if( editor.mode.data.components[0] in editor.mode.data.files && editor.mode.data.files[ editor.mode.data.components[0] ].length>0) {
								var file = editor.mode.data.files[ editor.mode.data.components[0] ][0];
								console.log("COMPONENT PREVIOUS ACTION file ",file.name,file.ext);
								
								editor.mode.data.current.type = "#file";
								editor.mode.data.current.value = editor.mode.data.components[0];
								editor.mode.data.current.index = 0;
								editor.mode.data.current.subindex = 0;
								
								editor.mode.data.current.parent = "#index";
								// if extension is a packet then it is a tree
									
								// load file.name
								p.el.DocumentName.value = file.name;
								p.el.ExtensionName.value = file.ext;
								
								// on get will change type of file
								p.el.control.value = localStorage.getItem(file.name);
								
								
								localStorage.setItem("index.notes.last",JSON.stringify( { name : editor.mode.data.main, ext : "packet" }));

								//no use for now
								localStorage.setItem("index.bind.document",
									JSON.stringify({ 
										screen : "bind", 
										name : p.el.DocumentName.value,
										value : p.el.control.value 
									})
								);
				
								
							} else {
								console.log("COMPONENT PREVIOUS ACTION file not loaded");
							}
						} else {
							console.log("COMPONENT PREVIOUS ACTION no components");
						}
					} else if(editor.mode.data.current.type == "#file") {
						console.log("AT FILE");
						// its a component named editor.mode.data.value
						var pos = -1;
						if( 
							( editor.mode.data.current.index+editor.mode.data.components.length-1) % editor.mode.data.components.length >= 0 && 
							( editor.mode.data.current.index+editor.mode.data.components.length-1) % editor.mode.data.components.length < editor.mode.data.components.length
						) {
							pos = (editor.mode.data.current.index+editor.mode.data.components.length-1)% editor.mode.data.components.length;
						} else { // file has been corrupted meanwhile
							throw "unkown position at packet.index";
						}
						
						var component = editor.mode.data.components[ pos ];
						
						var has = [
							{ ghtml : false },
							{ phtml : false },
							{ js : false }
						];
						
						if( (component + ".ghtml") in localStorage ) {
							has[0].ghtml = true;
						}
						if( (component + ".phtml") in localStorage) {
							has[1].phtml = true;
						}
						if( (component + ".js") in localStorage) {
							has[2].js = true;
						}
						var s = -1;
						var c = false;
						for(var x = 0; x < has.length;x++) {
							for(var key in has[x]) {
								if(has[x][key]) {
									console.log(key);
									s += 1;
									if(s == editor.mode.data.current.subindex-1) {
										// load
										p.el.DocumentName.value = component + "." + key;
										p.el.control.value = localStorage.getItem( component + "." + key );
										console.log("SETTING EXT:",editor.mode.data.files[ component ][s].ext);
										p.el.ExtensionName.value = editor.mode.data.files[ component ][s].ext;
										return;
									}
								}
							}
						}
						var slen = s;
						s = -1;
						for(var x = 0; x < has.length;x++) {
							for(var key in has[x]) {
								if(has[x][key]) {
									console.log(key);
									s += 1;
									if(s == (editor.mode.data.current.subindex+slen+1)%slen) {
										// load
										p.el.DocumentName.value = component + "." + key;
										p.el.control.value = localStorage.getItem( component + "." + key );
										console.log("SETTING EXT:",editor.mode.data.files[ component ][s].ext);
										console.log("SETTING EXT:",editor.mode.data.files[ component ][s].ext);
										p.el.ExtensionName.value = editor.mode.data.files[ component ][s].ext;
										
										return;
									}
								}
							}
						}
					}
				}
				editor.mode.ComponentNext= function() {
					console.log("COMPONENT NEXT ACTION");
					if(editor.mode.data.current.type == "#index") {
						if( editor.mode.data.components.length > 0) {
							if( editor.mode.data.components[0] in editor.mode.data.files && editor.mode.data.files[ editor.mode.data.components[0] ].length > 0) {
								var file = editor.mode.data.files[ editor.mode.data.components[0] ][0];
								console.log("COMPONENT PREVIOUS ACTION file ",file.name,file.ext);
								editor.mode.data.current.type = "#file";
								editor.mode.data.current.value = editor.mode.data.components[0];
								editor.mode.data.current.index = 0;
								editor.mode.data.current.subindex = 0;
								editor.mode.data.current.parent = "#index";
								
								// if extension is a packet then it is a tree
								
								// load file.name
								p.el.DocumentName.value = file.name;
								p.el.ExtensionName.value = file.ext;
								p.el.control.value = localStorage.getItem( file.name );
								
								
								localStorage.setItem("index.notes.last",JSON.stringify( { name : editor.mode.data.main, ext : "packet" }));

								//no use for now
								localStorage.setItem("index.bind.document",
									JSON.stringify({ 
										screen : "bind", 
										name : p.el.DocumentName.value,
										value : p.el.control.value 
									})
								);
								
								
							} else {
								console.log("COMPONENT PREVIOUS ACTION file not loaded");
							}
						} else {
							console.log("COMPONENT PREVIOUS ACTION no components");
						}
					} else if(editor.mode.data.current.type == "#file") {
						console.log("AT FILE");
						var pos = -1;
						if( 
							( editor.mode.data.current.index+editor.mode.data.components.length+1) % editor.mode.data.components.length >= 0 && 
							( editor.mode.data.current.index+editor.mode.data.components.length+1) % editor.mode.data.components.length < editor.mode.data.components.length
						) {
							pos = (editor.mode.data.current.index+ editor.mode.data.components.length+1)% editor.mode.data.components.length;
						} else { // file has been corrupted meanwhile
							throw "unkown position at packet.index";
						}
						var component = editor.mode.data.components[ pos ];
						// verify is component has ghtml, phtml, js
						
						var has = [
							{ ghtml : false },
							{ phtml : false },
							{ js : false }
						];
						
						if( (component + ".ghtml") in localStorage ) {
							has[0].ghtml = true;
						}
						if( (component + ".phtml") in localStorage) {
							has[1].phtml = true;
						}
						if( (component + ".js") in localStorage) {
							has[2].js = true;
						}
						var s = -1;
						
						for(var x = 0; x < has.length;x++) {
							for(var key in has[x]) {
								if(has[x][key]) {
									console.log(key,s,editor.mode.data.current.subindex);
									s += 1;
									if(s == (editor.mode.data.current.subindex+1)) {
										
										// load
										p.el.DocumentName.value = component + "." + key;
										p.el.control.value = localStorage.getItem( component + "." + key );
										console.log("found:",component+"." + key, editor.mode.data.files);
										p.el.ExtensionName.value = editor.mode.data.files[ component ][s].ext;
										console.log("SETTING EXT:",editor.mode.data.files[ component ][s].ext);
										return;
									}
								}
							}
						}
						var slen = s;
						s = -1;
						for(var x = 0; x < has.length;x++) {
							for(var key in has[x]) {
								if(has[x][key]) {
									console.log(key,s,editor.mode.data.current.subindex);
									s += 1;
									if(s == (editor.mode.data.current.subindex+1)%slen) {
										// load
										p.el.DocumentName.value = component + "." + key;
										p.el.control.value = localStorage.getItem( component + "." + key );
										console.log("found:",component+"." + key, editor.mode.data.files);
										p.el.ExtensionName.value = editor.mode.data.files[ component ][s].ext;
										console.log("SETTING EXT:",editor.mode.data.files[ component ][s].ext);
										return;
									}
								}
							}
						}
						
						
					}
				}
				editor.mode.UpSubtree = function() {
					
				}
				editor.mode.DownSubtree = function() {
					
				}
				editor.mode.reload = function(backup) {
					
					
					p.$.displayFrame.elementsClear();
					console.log("LOADING BYPASS CONTROL");
					var packet_file = null;
					if(backup) {
						var last_data = editor.mode.data;
						var last_doc = p.el.DocumentName.value;
						var last_ext = p.el.ExtensionName.value;
						var last_sels = p.el.control.selectionStart;
						var last_sele = p.el.control.selectionEnd;
						var scrollTop = p.el.control.scrollTop;
						
						cmd.set(); // save current
						
						p.el.DocumentName.value = editor.mode.data.main;
						
						packet_file = localStorage.getItem(editor.mode.data.main);
						var packet = JSON.parse(packet_file);
						cmd.loadPacketControl.apply(self,[packet]);
						
						editor.mode.data = data;
						
						p.el.DocumentName.value = last_doc;
						p.el.ExtensionName.value = last_ext;
						p.el.control.value = localStorage.getItem(last_doc);
						p.el.control.selectionStart = last_sels;
						p.el.control.selectionEnd = last_sele;
						p.el.control.scrollTop = scrollTop;
					} else {
						var last_data_context = editor.mode.data.context;
						cmd.set(); // save current
						p.el.DocumentName.value = editor.mode.data.main;
						p.el.ExtensionName.value = "packet";
						packet_file = localStorage.getItem(editor.mode.data.main);
						try {
							
							var packet = JSON.parse(packet_file);
							cmd.loadPacketControl.apply(self,[packet]);
							
							editor.mode.data.context = last_data_context;
							
						} catch(e) {
							// display message;
							//alert("write a better message for:",e.message);
							throw e;
						}
					}
					
				}
				
				console.log("packet loaded.");
				
			} else {
				
				p.el.control.value = localStorage.getItem(p.el.DocumentName.value);
				console.log("error on load packet. missing 'components' key.");
				
				
			}
		},
		loadSvgControl : function(svgdoc) {
			
			// svg won't change editor except by events
			
			var self3 = this;
			var events_to_set = editor.internal.events;
			var svg = {};
			svg.p = null;
			var psvg = null;
			
			var event_handle = {};
			event_handle.nc_onclick = function(el,value) {
				//console.log("C");
				console.log("defining event onclick");
				if(svg.p == null) {
					setTimeout(function() {
						event_handle.nc_onclick(el,value);
					},0);
				} else {
					var target = null;
					if(el in svg.p.el) target = svg.p.el[el];
					else target = document.getElementById(el);
					console.log(target);
					$( target, {
						cursor : "pointer",
						events : {
							click : function() {
								// goto document
								//console.log("CLICK",el,""+events_to_set[el].onclick);
								
								console.log("CLICK",""+value);
								// parse javascript: numbercooler:
								if(value.indexOf("javascript:")==0) {
									/*
									
										evaluate javascript if pass thought filter
										
									*/
								} else if(value.indexOf("numbercooler:")==0) {
									var subdoc = value.substring("numbercooler:".length);
									/*
										goto('index.assets.svg.index');
										eval('index.assets.svg.index.events')
											evaluate custom function file with 'el' and 'onclick'
									*/
									
									
									// create page and rename link to goto page like wiki
									
									
									
								} else {
									
									var data = cmd.getDocumentData(""+value);
									if(data[1]==null || data[1]=="") {
										var current_url = p.el.DocumentName.value;
										
										
										p.el.DocumentName.value = ""+value;
										p.el.ExtensionName.value = "svg";
										
										// this is a pattern to create a page
										// how to load other patterns?
										// then we may program by clicking on the picture.
										
										/*
											known functions:
											
											// each page controls a voxel in 3d world. new voxel connection is 'manual'
											// virtual reality system
											
											* back to previous page
												* change this button to ...
												* delete this button
											
											* menus to select items on page
											* textarea to write
											* hyperlink selected text on textarea
											
											* create the next next page
												* change this button to ...
												* delete this button
											
											* goto page menu drop down
												* add this page to favorites
												* organize favorites
											
											* take notes about this location
												* organize notes
											
											
											* replace left right menu with up down left right foward backward cube
											
											the next and previous page has two names, ( a 3d location number with domain ) and domain and name system
											this is a private internet.
											
										*/
										
										var page = [
											"\r\n\r\n\r\n\r\n\r\n<svg:svg width=\"1920\" height=\"1080\">",
											"\t<svg:g transform=\"translate(0 0)\">"
										];
										
										var direction = {
											0 : {
												type : "up"
											},
											1 : {
												type : "foward",
												event : function() {
													// move position on click
												}
											},
											2 : {
												type : "up"
											},
											3 : {
												type : "left"
											},
											4 : {
												type : "menu"
											},
											5 : {
												type : "right"
											},
											6 : {
												type : "down"
											},
											7 : {
												type : "backward"
											},
											8 : {
												type : "down"
											}
										};
										for(var x = 0; x < 3;x++) {
											for(var y = 0; y < 3;y++) {
												page.push( "\t\t<svg:rect x=\""+(10+30*x)+"\" y=\""+(10+30*y)+"\" width=\"30\" height=\"30\" onclick=\"index.assets.svg.map00000000_00000000_00000000\"/>" );
												var pos = y*3 + x;
												var type = direction[pos];
											}
										}
										
										page.push("\t\t<svg:rect x=\"120\" y=\"10\" width=\"100\" height=\"100\" onclick=\""+current_url+"\"/>");
										page.push("\t\t</svg:g>\r\n");
										page.push("</svg:svg>");

						
										cmd.set();
										
										// show editor?
										
										$( p.el.control, { display: "" });
										editor.visibility = true;
										
										
									} else {
										console.log(data[1]);
										p.el.DocumentName.value = ""+value;
										cmd.get(p.el.DocumentName.value,p.el.ExtensionName.value);
									}
								}
								
							}
						}
					});
				}
			}
			event_handle.nc_onmouseout = function(el,value) {
				//console.log("B");
				console.log("defining event onmouse out");
				var target = null;
				if(svg.p==null) {
					setTimeout(function() {
						event_handle.nc_onmouseout(el,value);
					},0);
				} else {
					if(el in svg.p.el) target = svg.p.el[el];
					else target = document.getElementById(el);
					console.log(target);
					$( target, {
						cursor : "pointer",
						events : {
							mouseout : function() {
								// script to run
								// events_to_set[el].onmouseover;
								
								// get document
								// 
								console.log("MOUSEOUT");
								var data = cmd.getDocumentData(value);
								console.log(data);
								if(data[0] == "js") {
									var f = new Function("svg","clock","editor",data[1]);
									f( svg.p, {},{});
								}
							}
						}
					});
				}
				
			}
			event_handle.nc_onmouseover = function(el,value) {
				
				console.log("A");
				console.log("defining event onmouse over");
				if(svg.p == null) {
					setTimeout(function() {
						event_handle.nc_onmouseover(el,value);
					},0);
				} else {
					var target = null;
					if(el in svg.p.el) target = svg.p.el[el];
					else target = document.getElementById(el);
					console.log(target);
					$( target, {
						cursor : "pointer",
						events : {
							mouseover : function() {
								// script to run
								// events_to_set[el].onmouseover;
								console.log("MOUSEOVER");
								
								
								var data = cmd.getDocumentData(value);
								console.log(data);
								if(data[0] == "js") {
									var f = new Function("svg","clock","editor",data[1]);
									f( svg.p, {},{});
								}
								// get document
								// events_to_set[el].onmouseover
								
							}
						}
					});
				}
			}
			console.log("AFTER SVG TAGS");
			console.log(svgdoc);
			svg.p = psvg = p.$.displayFrame.elementNewPacket("<div id=\"label\">"+svgdoc+"</div>","",{
				attributes : ["onclick","onmouseover","onmouseout","begin","end","xlink:href","fill"],
				ask : function(clue,target) {
					//console.log("inside answer",clue);
					if(clue.type == "stream") {
						if(clue.value=="<!--") { return 2; }
						if(clue.value=="-->") { return 1; }
						return 0;
					} else if(clue.type=="later_attribute") { // rebase ids named on attributes.
						if(clue.key == "begin") {
							var value_arr = clue.value.split(";");
							
							for(var x = 0; x < value_arr.length;x++) {
								var check = false;
								try {
									if( isNaN( parseInt(value_arr[x]) ) ) {
										check = false;
									} else {
										check = true;
									}
									//console.log(">>",parseInt(value_arr[x]) );
								} catch(e) {
									
								}
								console.log("check:",check);
								if(!check && value_arr[x].indexOf("accessKey")!=0) {
									var arr = value_arr[x].split(".");
									console.log(arr[0], target.el);
									if(arr[0] in target.el) {
										arr[0] = target.el[ arr[0] ].getAttribute("id");
									}
									var renamed_path = arr.join(".");
									value_arr[x] = renamed_path;
								}
							}
							return {
								key : "begin",
								value : value_arr.join(";")
							}
							// use target to change ids
						} else if(clue.key == "end") {
							var value_arr = clue.value.split(";");
							for(var x = 0; x < value_arr.length;x++) {
								var check = false;
								try {
									if( isNaN( parseInt(value_arr[x]) ) ) {
										check = false;
									} else {
										check = true;
									}
									//console.log(">>",parseInt(value_arr[x]) );
								} catch(e) {
									
								}
								console.log("check:",check);
								if(!check && value_arr[x].indexOf("accessKey")!=0) {
									var arr = value_arr[x].split(".");
									console.log(arr[0], target.el);
									if(arr[0] in target.el) {
										arr[0] = target.el[ arr[0] ].getAttribute("id");
									}
									var renamed_path = arr.join(".");
									value_arr[x] = renamed_path;
								}
							}
							return {
								key : "begin",
								value : value_arr.join(";")
							}
							// use target to change ids
						} else if(clue.key == "fill") {
							if( clue.value && clue.value.indexOf("url") == 0) {
								var nc_id = clue.value.substring(5,clue.value.length-1);
								var renamed = "";
								if( nc_id in target.el) {
									renamed = target.el[ nc_id ].getAttribute("id");
								}
								return {
									key : "fill",
									value : "url(#" + renamed + ")"
								};
							} else {
								return {
									key : "fill",
									value : clue.value
								};
							}
						} else if(clue.key == "xlink:href") {
							if( clue.value.indexOf("#") == 0) {
								var nc_id = clue.value.substring(1);
								var renamed = "";
								if(nc_id in target.el) {
									renamed = target.el[nc_id].getAttribute("id");
								}
								return {
									svg : true,
									key : "href",
									value : "#" + renamed
								}
							} else {
								return {
									svg : true,
									key : "href",
									value : clue.value
								}
							}
						}
					} else if(clue.type == "attribute") {
						//console.log("inside answer attribute",clue);
						if(clue.key=="fill") {
							return 100;
						} if( clue.key=="begin" ) {
							return 100;
						} else if( clue.key=="end" ) {
							return 100;
						} else if( clue.key=="xlink:href") {
							return 100;
						} else if( clue.key == "onmouseover" ) {
							if("id" in clue) {
								console.log("ASK ONMOUSEOVER");
								console.log(clue.element,clue.id);
								var id = clue.id;
								console.log("pushing mouseover events",id);
								if(!(id in events_to_set)) { events_to_set[id] = {}; }
								events_to_set[id][ clue.key ] = "" + clue.value;
								event_handle.nc_onmouseover(clue.id,clue.value);
								return 1;	
							}
							
						} else if(clue.key == "onmouseout") {
							if("id" in clue) {
								console.log("ASK ONMOUSEOUT");
								console.log(clue.element,clue.id);
								var id = clue.id;
								
								console.log("pushing mouseout events",id);
								if(!(id in events_to_set)) { events_to_set[id] = {}; }
								events_to_set[id][ clue.key ] = ""+clue.value;
								
								event_handle.nc_onmouseout(clue.id,clue.value);
								return 1;	
							}
							
						} else if(clue.key == "onclick") {
							//console.log("inside onclick",clue);
							if("id" in clue) {
								var id = clue.id;
								console.log("pushing click events",id);
								if(!(id in events_to_set)) { events_to_set[id] = {}; }
								events_to_set[id][ clue.key ] = ""+clue.value;
								event_handle.nc_onclick(clue.id,clue.value);
								return 1;
							} 
							
						} else if(clue.key.indexOf("on")==0) {
							// emit event and receive event timespace
							return 0; // not implemented
						} else {
							return 0;
						}
						return 0;
					}
					return 0;
				},
				ask_owner : self,
				ask_args : []
			});
			
			console.log("AFTER SVG TAGS");
			
			// store svg events in somewhere outter of this function cause it will be called again, when you create another dimension more space is required for matrix
			
			// store current styles of svg drawings just like events was stored.
			
			
			// load svg init system file
			return svg.p;
			
		},
		showMenu : function() {
			var sz = UI.Window.getBounds();
			$(p.el.table,{
				display : ""
			});
			$(p.el.btnUpload,{
				display : ""
			});
			// resize control
			$(p.el.control,{
				top : 48+"px", width : (sz[0]-20) + "px", height : (sz[1]-48-3-18) + "px"
			});
			// resize content
			$(p.el.displayFrame,{
				top : 48+"px", width : (sz[0]-20) + "px", height : (sz[1]-48-3-18) + "px"
			});
			
		},
		hideMenu : function() {
			var sz = UI.Window.getBounds();
			$(p.el.table,{ display : "none" });
			$(p.el.btnUpload,{ display : "none" });
			// resize control
			$(p.el.control,{
				top : "0px",
				left : "0px",
				height : (sz[1]-15) + "px"
			});
			// resize content
			$(p.el.displayFrame,{
				top : "0px",
				left : "0px"
			});
		},
		getFileHeader : function(filename) {
			// check if reference do exists
			var fs = this.get_fs();
			filename = filename || p.el.DocumentName.value;
			arr = filename.split(".");
			var ret = null;
			if(arr[0] == "index" && arr.length>1) {
				var pointer = fs.nodes;
				for(var x = 1; x < arr.length;x++) {
					if( arr[x] in pointer ) {
						if(pointer[ arr[x] ].type == "folder" && x==arr.length-1) {
							pointer[arr[x]].type = "file,folder";
							pointer[arr[x]].nodes = {};
							ret = pointer[ arr[x] ];
						} else if(pointer[ arr[x] ].type == "folder") {
							pointer = pointer[ arr[x] ].nodes;
						} else if(pointer[ arr[x] ].type == "file" && x < arr.length-1) {
							pointer[arr[x]].type = "file,folder";
							pointer[arr[x]].nodes = {};
							pointer = pointer[ arr[x] ].nodes;
						} else if( pointer[arr[x] ].type == "file" && x == arr.length-1) {
							ret = pointer[ arr[x] ];
						}
					} else {
						if(x < arr.length-1) {
							pointer[ arr[x] ] = {
								type : "folder",
								nodes : {}
							};
							pointer = pointer[ arr[x] ].nodes;
						} else {
							pointer[ arr[x] ] = {
								type : "file"
							};
							ret = pointer[ arr[x] ];
						}
					}
				}
				return [fs,ret];
			} else {
				console.log("not a index file");
				return [fs,null];
			}
		},
		set : function() { 
			$(p.el.changedMark,{ color :"#fff"},".");
			// check if reference do exists
			var obj = this.getFileHeader();
			if(obj[1] != null) {
				var fs = obj[0];
				var fh = obj[1];
				fh.ext = p.el.ExtensionName.value;
				this.set_fs(fs);
				console.log("index changed.");
			}
			// update document
			try {
				localStorage.setItem(p.el.DocumentName.value,p.el.control.value); 
			} catch(e) {
				p.el.control.value = localStorage.setReservedItem("index",JSONTools.pretty_stringfy(JSON.parse(p.el.control.value)));
				throw e;
			}
		},
		getDocumentData : function(filename) {
			var self2 = this;
			var fs = this.get_fs();
			var arr = filename.split(".");
			if( arr[0] == "index" && arr.length>1 ) {
				var data = localStorage.getItem(filename); 
				if(!data) {
					data = "";
				} else {
					if(data == "") {
						localStorage.removeItem(filename);
						var obj = this.getFileHeader(filename);
						if(obj[1]!=null) {
							var fs = obj[0];
							var fh = obj[1];
							
							p.el.ExtensionName.value = fh.ext;
						}
					} else {
						// based on document.name
						var obj = this.getFileHeader(filename);
						if(obj[1]!=null) {
							var fs = obj[0];
							var fh = obj[1];
							p.el.ExtensionName.value = fh.ext;
							this.set_fs(fs);
							console.log("index changed.");
						}
					}
				}
				var obj = this.getFileHeader(filename);
				return [ obj[1].ext, data ];
			} else {
				throw "not an indexed file.";
			}
		},
		get : function(filename,extension) { 
			console.log("cmd.get "+filename);
			
			
			
			var self2 = this;
			// check if reference do exists
			// load fs
			var fs = this.get_fs();
			filename = filename || p.el.DocumentName.value;
			// check if file is a index file and is tracked on fs
			var arr = filename.split(".");
			if( arr[0] == "index" && arr.length>1 ) {
				
				var data = localStorage.getItem(filename); 
				if(!data) {
					//localStorage.setItem(filename,"");
					data = "";
				} else {
					if(data == "") {
						localStorage.removeItem(filename);
						
						// based on document.name
						var obj = this.getFileHeader(filename);
						if(obj[1]!=null) {
							var fs = obj[0];
							var fh = obj[1];
							
							p.el.ExtensionName.value = fh.ext;
							extension = fh.ext;
						}
					} else {
						// based on document.name
						var obj = this.getFileHeader(filename);
						if(obj[1]!=null) {
							var fs = obj[0];
							var fh = obj[1];
							p.el.ExtensionName.value = fh.ext;
							extension = fh.ext;
							this.set_fs(fs);
							console.log("index changed.");
						}
					}
				}
				if(data!="") {
					// based on document.name
					var obj = this.getFileHeader(filename);
					if(obj[1]!=null) {
						var fs = obj[0];
						var fh = obj[1];
						extension = fh.ext;
						this.set_fs(fs);
						console.log("index changed.");
					}
				}
				$(p.el.changedMark,{
					color : "#fff"
				},".");
				console.log("AT CMD GET ",filename,extension);
				
				if(extension=="json") {
					p.$.displayFrame.elementsClear();
					
					p.el.control.value = JSONTools.pretty_stringfy( JSON.parse(data) );
					
					editor.mode.selected = "json";
					
					editor.mode.data = null;
					editor.mode.stack = null;
					
					
					localStorage.setItem("index.notes.last",JSON.stringify( { name : filename, ext : extension }));
				
					//no use for now
					localStorage.setItem("index.bind.document",
						JSON.stringify({ 
							screen : "bind", 
							name : filename,
							value : p.el.control.value 
						})
					);
					
					
				} else if(extension == "packet") {
					// in fact a json with elements and components to load
					console.log("loading packet");
					
					
					
					var json = localStorage.getItem(filename);
					
					console.log(json);
					var packetdoc = JSON.parse(json);
					self2.loadPacketControl.apply(self,[packetdoc]); // packet handles editor
					
					console.log("loaded packet");
					
					
					// besides last file loaded in project
					localStorage.setItem("index.notes.last",JSON.stringify( { name : filename, ext : extension }));
					
					//no use for now
					localStorage.setItem("index.bind.document",
						JSON.stringify({ 
							screen : "bind", 
							name : filename,
							value : p.el.control.value 
						})
					);
					
					
				} else if(extension=="svg") { // associate language to prefered parsers -> html, json specific format
				
				
					// create link and add svg to linked data
					console.log("loading svg");
					
					var svgdoc = localStorage.getItem(filename);
					
					self2.loadSvgControl.apply(self,[svgdoc]);
					p.el.control.value = svgdoc;
					
					editor.mode.selected = "svg";
					editor.mode.data = null;
					editor.mode.stack = null;
					
					console.log("loaded svg");
					
					
				} else {
					
					editor.mode.selected = "default";
					editor.mode.data = null;
					editor.mode.stack = null;
					
					p.$.displayFrame.elementsClear();
					p.el.control.value = data;
					
					localStorage.setItem("index.notes.last",JSON.stringify( { name : filename, ext : extension }));
					
					//no use for now
					localStorage.setItem("index.bind.document",
						JSON.stringify({ 
							screen : "bind", 
							name : filename,
							value : data
						})
					);
				}
				
				
				
					
				//$(p.el.displayDevice, { attribs : { src : "/#notes-keyframe" } });
				//p.el.displayDevice.contentWindow.addEventListener("load",function() {
					//console.log("loaded");
				//});
				//p.el.displayDevice.contentWindow.postMessage( "reload","http://localhost/");
				console.log("GET AND SET");
				
				
				
				console.log("--------------------------------------------------------");
				console.log("--------------------------------------------------------");
				console.log("-- rendering END.");
				
				
				return {
					name : filename,
					ext : extension
				}
			} else { // files out of index filesystem
			
				// raw localStorage
				try {
					p.el.control.value = localStorage.getItem(filename); 
					
					localStorage.setItem("index.bind.document",
						JSON.stringify({
							screen : "bind",
							value : p.el.control.value
						})
					);
					
					// try identify document type
					
					console.log("trying to parse document in format:");
					
					var mimes = [
						{
							type : "svg"
						}
					];
					for(var x = 0; x < mimes.length;x++) {
						if( p.el.control.value.indexOf("<svg")!= -1 ) {
							p.el.ExtensionName.value = "svg";
						}
					}
					
					
					//p.el.ExtensionName.value = "txt";
					//p.el.displayDevice.contentWindow.postMessage( "reload", "teste" );
					
					
					console.log("GET AND SET",filename);
					
				} catch(e) { // debuggin index
					p.el.control.value = localStorage.getReservedItem("index");
					p.el.ExtensionName.value = "json";
					throw e;
				}
			}
		},
		download : function() { 
			this.set();
			Download.text( p.el.control.value, p.el.DocumentName.value + "." + fp.ext); 
		},
		downloadAll : function() {
			var fs = this.get_fs();
			// split structure into pieces to zip
			var zip = new JSZip();
			var path = [
				[fs.nodes,zip,[]]
			];
			zip.file("___NCFS___.json",JSONTools.pretty_stringfy(fs));
			while(path.length>0) {
				var item = path.shift();
				var p = item[0];
				var z = item[1];
				var n = item[2];
				for(var key in p) {
					if(p[key].type == "file") {
						var filename = n.slice(0);
						filename.push( key );
						var data = localStorage.getItem("index." + filename.join(".") );
						z.file( key + ("ext" in p[key] ? "." + p[key].ext : ""), data );
					} else if(p[key].type == "folder") {
						var foldername = n.slice(0);
						foldername.push(key);
						var folder = z.folder( key );
						path.push([ p[key].nodes, folder, foldername ] );
					} else if(p[key].type.indexOf("file")!=-1 && p[key].type.indexOf("folder")!=-1) {
						var name = n.slice(0);
						name.push(key);
						var data = localStorage.getItem("index." + name.join(".") );
						z.file( key + ("ext" in p[key] ? "." + p[key].ext : ""), data );
						var folder = z.folder( key ); // carefull, original must have same file and folder path name
						path.push([ p[key].nodes, folder, name ] );
					}
				}
			}
			Download.zip(zip,"fs.zip");
		},
		upload : function(files) {
			// identify if it is a zip file system or a single file
			var set_item = function(zip,file,fullname) {
				zip.file(file).async("string").then(function(data) {
					console.log("writing ",fullname);
					localStorage.setItem(fullname,data);
				});
			}
			
			var self2 = this;
			//var files = e.target.files || e.dataTransfer.files;
			var files = files.target.files;
			for (var i = 0, f; f = files[i]; i++) {
				if(f.name.indexOf(".zip") == f.name.length-4) {
					var reader = new FileReader();
					reader.onload = (function(current) { return function(e) { 
						console.log("ZIP");
						var zip = new JSZip();
						zip.loadAsync(e.target.result).then(function(zip) {
							zip.file("___NCFS___.json").async("string").then(function (data) {
								console.log("AT INDEX");
								var json = JSON.parse(data);
								if( json.signature == "NumberCooler FileSystem" && json.version[0] == 1 && json.version[1] == 0) {
									console.log("MATCH SIGNATURE");
									// reset all current index files and overwrite with this packet, the workspace
									var old_fs = self2.get_fs();
									console.log("got fs");
									
									var p = old_fs.nodes;
									var stack = [ [old_fs.nodes,["index"]] ];
									var files = [];
									console.log("p1");
									while(stack.length>0) {
										console.log("p2");
										var obj = stack.shift();
										var f1 = obj[0];
										var n = obj[1];
										for(var key in f1) {
											console.log("item:",key,f1[key]);
											if( f1[key].type.indexOf("file") != -1) {
												var cpy = n.slice(0);
												cpy.push(key);
												files.push( cpy.join(".") );
											}
											if( f1[key].type.indexOf("folder") != -1) {
												var cpy = n.slice(0);
												cpy.push(key);
												stack.push([ f1[key].nodes, cpy ]);
											}
										}
										console.log("p3");
									}
									// remove all files (danger! do not change core and overwrite your unique backup)
									for(var x = 0; x < files.length;x++) {
										console.log("REMOVING ", files[x]);
										localStorage.removeItem( files[x] );
									}
									
									localStorage.removeItem("index");
									
									// all clear
									console.log("ALL CLEAR");
									
									// load uploaded workspace
									console.log("ALL CLEAR2");
									console.log("index redefined",json);
									localStorage.setReservedItem("index", JSONTools.pretty_stringfy(json));
									console.log("index redefined");
									
									var path = [
										[json.nodes,zip,[]]
									];
									while(path.length>0) {
										var item = path.shift();
										var p = item[0];
										var z = item[1];
										var n = item[2];
										for(var key in p) {
											if(p[key].type == "file") {
												var filename = n.slice(0);
												filename.push( key );
												set_item( z,key + ("ext" in p[key] ? "." + p[key].ext : ""), "index." + filename.join(".") );
											} else if(p[key].type == "folder") {
												var foldername = n.slice(0);
												foldername.push(key);
												var folder = z.folder( key );
												path.push([ p[key].nodes, folder, foldername ] );
											} else if(p[key].type.indexOf("file")!=-1 && p[key].type.indexOf("folder")!=-1) {
												var name = n.slice(0);
												name.push(key);
												set_item( z,key + ("ext" in p[key] ? "." + p[key].ext : ""), "index." + name.join(".") );
												var folder = z.folder( key ); // carefull, original must have same file and folder path name
												path.push([ p[key].nodes, folder, name ] );
											}
										}
									}
									
									console.log("UPLOAD ZIP COMPLETE!");
								}
							});
						});
					}; })(f);
					reader.readAsArrayBuffer(f);
				} else {
					var reader = new FileReader();
					reader.onload = (function(current) { return function(e) { 
						p.el.control.value = e.target.result; 
					}; })(f);
					reader.readAsText(f);	
				}
				return;
			}
		},
		sync : function() {
			// start worker to hash content and check the overall state
			// name workspace, password, protection(backup) level & expiration (based on credits)
			
			
			//throw "not implemented";
		},
		get_fs : function() {
			// load reference tree
			var data = window.localStorage.getReservedItem("index");
			if(data == null) { // init reference tree
				data = {
					type : "folder",
					version : [1,0],
					signature : "NumberCooler FileSystem",
					nodes : {
						
					}
				};
				return data;
			} else {
				//console.log(data);
				return JSON.parse( data );
			}
		},
		set_fs : function(json) {
			window.localStorage.setReservedItem("index",JSONTools.pretty_stringfy(json) );
		},
		update_fs : function(target) {
			
		},
		backup_fs : function() {
			
		},
		renameExtension : function() {
			var obj = this.getFileHeader();
			if(obj[1] != null) {
				var fs = obj[0];
				var fh = obj[1];
				fh.ext = p.el.ExtensionName.value;
				this.set_fs(fs);
				console.log("index changed.");
			}
		},
		checkIfModeChange : function(filename) {
			if(editor.mode.selected == "packet") {
				// check if filename is in packet stack
				
				
			} else {
				return true;
			}
		}
	}
	$( origin_lt, { width : sz[0] + "px", height : sz[1] + "px", overflow : "hidden" });
	//$( p.el.mock, { backgroundColor: "#000" } );
	$( p.el.container, { border : "none", position : "absolute", left : "0px", top : "0px", width : sz[0] + "px", height : sz[1] + "px" });
	$( p.el.table, {  position : "absolute", left : "0px", top : "0px", attribs : { width : "100%", border : 0, cellpadding : 0, cellspacing : 0} });
	$( p.el.menu, { attribs : { height : 30  } });
	//var f = curry(inoutStyle, { backgroundColor : "#000", color : "#fff" }, { backgroundColor : "#fff", color : "#000" } );
	
	
	var keynames = {};
	for(var key_name in KeyCode) {
		keynames[ KeyCode[key_name] ] = key_name;
	}
	$( window, {
		events : {
			keydown : function(e) {
				
				console.log("WINDOW KEYDOWN:", e.keyCode in keynames ? keynames[ e.keyCode ] : e.keyCode );
				
				if(e.keyCode == KeyCode.CTRL) {
					editor.keyboard.ctrl = true;
				}
				if(e.keyCode == KeyCode.SHIFT) {
					editor.keyboard.shift = true;
				}
				if(e.keyCode == KeyCode.ALT) {
					editor.keyboard.alt = true;
				}
				if(editor.keyboard.ctrl && e.keyCode == KeyCode.SPACE) {
					if(editor.visibility) {
						cmd.set();
						$( p.el.control, { display: "none" });
						console.log("textarea should be hidden.");
						editor.visibility = false;
					} else {
						$( p.el.control, { display: "" });
						editor.visibility = true;
						console.log("textarea should be visible.");
					}
				}
				
			},
			keyup : function(e) {
				console.log("WINDOW KEYUP:", e.keyCode in keynames ? keynames[ e.keyCode ] : e.keyCode );
				if(e.keyCode == KeyCode.CTRL) {
					editor.keyboard.ctrl = false;
				}
				if(e.keyCode == KeyCode.SHIFT) {
					editor.keyboard.shift = false;
				}
				if(e.keyCode == KeyCode.ALT) {
					editor.keyboard.alt = false;
				}
				
				
			}
		}
	});
	$( p.el.control, {
		position : "relative", left : "0px", top : 48+"px", width : (sz[0]-20) + "px", height : (sz[1]-48-3-18) + "px", margin : "0px",
		color : editor_globals.font.color[ editor.font.color ],
		fontSize : editor_globals.font.size[ editor.font.size ],
		lineHeight : parseInt( parseFloat(editor_globals.font.size[ editor.font.size ]) *1.14 ) + "px",
		fontFamily : "monospace", border : "0", outline : "0", borderTop : "solid 1px #000", borderBottom : "solid 1px #000", resize : "none",
		background: "transparent",
		whiteSpace: "pre", tabSize : 4,
		padding : "10px",
		events : {
			keyup : function(e) { 
				console.log("CONTROL KEYUP:", e.keyCode in keynames ? keynames[ e.keyCode ] : e.keyCode );
				if(e.keyCode == KeyCode.CTRL) { 
					editor.keyboard.ctrl = false;
				}
				if(e.keyCode == KeyCode.SHIFT) {
					editor.keyboard.shift = false;
					
				}
				if(e.keyCode == KeyCode.ALT) {
					editor.keyboard.alt = false;
				}
				
				
				
			},
			keydown : function(e) {
				console.log("CONTROL KEYDOWN:", e.keyCode in keynames ? keynames[ e.keyCode ] : e.keyCode );
				if(e.keyCode == KeyCode.CTRL) { 
					editor.keyboard.ctrl = true;
				}
				if(e.keyCode == KeyCode.SHIFT) {
					editor.keyboard.shift = true;
				}
				if(e.keyCode == KeyCode.ALT) {
					editor.keyboard.alt = true;
				}
				
				if(editor.keyboard.ctrl) {
					if(editor.keyboard.shift) {
						if(editor.keyboard.alt) {
							
						} else {
							if(e.keyCode == KeyCode.LEFT) {
								console.log("CTRL+SHIFT+LEFT");
								if(editor.mode.selected == "packet") {
									console.log("CHANGING TO PREVIOUS ITEM ON COMPONENT");
									
									editor.mode.ComponentFilePrevious();
									
								}
							}
							else if(e.keyCode == KeyCode.RIGHT) {
								console.log("CTRL+SHIFT+RIGHT");
								if(editor.mode.selected == "packet") {
									console.log("CHANGING TO NEXT ITEM ON COMPONENT");
									
									editor.mode.ComponentFileNext();
									
								}
							}
						}
					} else if(editor.keyboard.alt) {
						if(e.keyCode == KeyCode.LEFT) {
							console.log("CTRL+ALT+LEFT");
							if(editor.mode.selected == "packet") {
								console.log("CHANGING TO PREVIOUS COMPONENT");
								editor.mode.ComponentPrevious();
								
							}
						}
						else if(e.keyCode == KeyCode.RIGHT) {
							console.log("CTRL+ALT+RIGHT");
							if(editor.mode.selected == "packet") {
								console.log("CHANGING TO NEXT COMPONENT");
								editor.mode.ComponentNext();
								
							}
						}
						else if(e.keyCode == KeyCode.UP) {
							console.log("CTRL+ALT+UP");
							if(editor.mode.selected == "packet") {
								console.log("CHANGING TO COMPONENT INDEX : ", editor.mode.data);
								editor.mode.reload(false);
								
							}
						}
						else if(e.keyCode == KeyCode.DOWN) {
							console.log("CTRL+ALT+DOWN");
							if(editor.mode.selected == "packet") {
								// if current component is packet push on stack
								console.log("CHAGING STACK OF PACKETS");
								
							}
						}
					} else {
						if(e.keyCode == KeyCode.TAB) {
							e.preventDefault(); 
							e.stopPropagation();
							return false;
						} 
						else if(e.keyCode == KeyCode.A) {
							p.el.control.select();
						}
						else if(e.keyCode == KeyCode.S) { 
							console.log("saving");
							var backup = "";
							if(editor.mode.selected == "packet") {
								// may set a backup to rewind changes render good and show error message with invalid commands.
								if( editor.mode.data.current.type == "#index" ) {
									var error_value = p.el.control.value;
								}
							}
							cmd.set(); 
							if(editor.mode.selected == "packet") {
								editor.mode.reload(true); // reload but keep current file to be edit.
							}
							
							e.preventDefault(); 
							e.stopPropagation();
							return false;
						}
						else if(e.keyCode == KeyCode.M) {
							// show and hide menu and resize everything
							if(!editor.menu) { // show
								cmd.showMenu();
								editor.menu = true;
							} else { // hide (default is editor.menu==true)
								cmd.hideMenu();
								editor.menu = false;
							}
						}
						else if( 
							(e.keyCode == KeyCode.G) || 
							(e.keyCode == KeyCode.ENTER)
						) { 
						
							// must do same check that enter on DocumentName do.
							
							// from inside editor, so recover the last filename used to load this
							// and do the correct get
							
							
							
							if(cmd.checkIfModeChange()) {
								
							}
							
							cmd.get(p.el.DocumentName.value,p.el.ExtensionName.value); 
							e.preventDefault(); 
							e.stopPropagation();
							return false;
						}
						else if(e.keyCode == KeyCode.D) { 
							cmd.download(); e.preventDefault(); 
						}
						else if(e.keyCode == KeyCode.X) { // cut
							throw "not implemented.";
						}
						else if(e.keyCode == KeyCode.C) { // copy
							editor.clipboard = p.el.control.value.substring( p.el.control.selectionStart,p.el.control.selectionEnd );
						}
						else if(e.keyCode == KeyCode.V) { // paste
							$(p.el.changedMark,{
								color : "#f00"
							},"(changed)");
							
							if("clipboard" in editor) {
								var el = p.el.control;
								var val = el.value, start = el.selectionStart, end = el.selectionEnd;
								el.value = val.slice(0, start) + editor.clipboard + val.slice(end);
							}
						}
						else if( e.keyCode == KeyCode.R) { // reload entire window
							window.location.href = window.location.href;
							
							return true;
						} else {
							return true;
						}
					}
				}
				else {
					if( e.keyCode >= KeyCode.F1 && e.keyCode <= KeyCode.F12) {
						if(e.keyCode == KeyCode.F2) { // change editor font color
							editor.font.color = ( editor.font.color + 1 ) % editor_globals.font.color.length;
							$( p.el.control,{ color : editor_globals.font.color[ editor.font.color ] } );
							localStorage.setItem("index.editor.font.color",editor.font.color);
							
							e.preventDefault();
							e.stopPropagation();
							return false;
						}
						if(e.keyCode == KeyCode.F4) { // change editor font size
							editor.font.size = ( editor.font.size + 1 ) % editor_globals.font.size.length;
							$( p.el.control,{ fontSize : editor_globals.font.size[ editor.font.size ] } );
							localStorage.setItem("index.editor.font.size",editor.font.size);
							
							e.preventDefault();
							e.stopPropagation();
							return false;
						}
					}
					else if (e.keyCode == KeyCode.TAB) { // ident code, smart code goes here to identify how many tabs it got.
						e.preventDefault();
						var s = p.el.control.selectionStart;
						p.el.control.value = 
							p.el.control.value.substring(0,p.el.control.selectionStart) + "\t" 
							+ p.el.control.value.substring(p.el.control.selectionEnd);
						p.el.control.selectionEnd = s+1; 
						
						$(p.el.changedMark,{
							color : "#f00"
						},"(changed)");
						e.preventDefault();
						e.stopPropagation();
						return false;
						
					} else if(e.keyCode == KeyCode.PAGEUP) { // page size is defined to 10 lines
						var s = p.el.control.selectionStart;
						p.el.control.selectionEnd = p.el.control.selectionStart;
						// find previous n rows
						var changeToStart = p.el.control.selectionStart;
						var changeTo = p.el.control.selectionStart;
						var lines = 10;
						var lineCount = 0;
						var last = -1;
						var start = p.el.control.selectionStart;
						var check = false;
						for(var x = start; x >= 0;x--) {
							check = false;
							if(p.el.control.value.charAt(x) == "\n") { lineCount += 1; }
							if(lineCount == lines) {
								for(var y = x; y>=0;y--) { if(p.el.control.value.charAt(y) == "\n") { changeTo = y+1; check = true; break; } }
								if(!check) { changeTo = 0; }
								break;
							}
						}
						if(!check) {
							changeTo = 0;
						} else { for(var y = changeTo; y>=0;y--) { if(p.el.control.value.charAt(y) == "\n") { changeTo = y+1; break; } } }
						if(changeTo!=changeToStart) {
							p.el.control.selectionStart = changeTo;
							p.el.control.selectionEnd = changeTo;
							var currentLine = 0;
							var totalLines = 0;
							for(var x = 0; x < p.el.control.selectionStart;x++) {
								if(p.el.control.value.charAt(x) == "\n") { currentLine += 1; totalLines += 1; }
							}
							for(var x = p.el.control.selectionStart;x < p.el.control.length;x++) {
								if(p.el.control.value.charAt(x) == "\n") { currentLine += 1; totalLines += 1; }
							}
							var val = parseInt( p.el.control.style.lineHeight ) * currentLine;
							p.el.control.scrollTop = val;
						}
						e.preventDefault();
						e.stopPropagation();
						return true;
					} else if(e.keyCode == KeyCode.PAGEDOWN) {
						var lines = 10;
						var lineCount = 0;
						var last = -1;
						var start = p.el.control.selectionStart;
						var changeToStart = p.el.control.selectionEnd;
						var changeTo = p.el.control.selectionEnd;
						var check = false;
						for(var x = start; x < p.el.control.value.length; x++) {
							check = false;
							if(p.el.control.value.charAt(x) == "\n") { lineCount += 1; }
							if(lineCount == lines) {
								for(var y = x; y < p.el.control.value.length;y--) {
									if(p.el.control.value.charAt(y) == "\n") { changeTo = y+1; check = true; break; }
								}
								if(!check) { changeTo = p.el.control.value.length; }
								break;
							}
						}
						if(!check) { changeTo = p.el.control.value.length; }
						for(var y = changeTo; y>=0;y--) { if(p.el.control.value.charAt(y) == "\n") { changeTo = y+1; break; } }
						if(changeTo!=changeToStart) {
							p.el.control.selectionStart = changeTo;
							p.el.control.selectionEnd = changeTo;
							var currentLine = 0;
							var totalLines = 0;
							for(var x = 0; x < p.el.control.selectionStart;x++) {
								if(p.el.control.value.charAt(x) == "\n") { currentLine += 1; totalLines += 1; }
							}
							for(var x = p.el.control.selectionStart;x < p.el.control.length;x++) {
								if(p.el.control.value.charAt(x) == "\n") { currentLine += 1; totalLines += 1; }
							}
							var val = parseInt( p.el.control.style.lineHeight ) * currentLine;
							p.el.control.scrollTop = val;
						}
						e.preventDefault();
						e.stopPropagation();
						return true;
					} else if(
						( e.keyCode >= KeyCode.A && e.keyCode <= KeyCode.Z ) ||
						( e.keyCode >= KeyCode.D0 && e.keyCode <= KeyCode.D9 ) ||
						( e.keyCode == KeyCode.ENTER ) ||
						( e.keyCode == KeyCode.SPACE ) ||
						( e.keyCode == KeyCode.BACKSPACE ) ||
						( e.keyCode == KeyCode.DOWN ) ||
						( e.keyCode == KeyCode.UP ) ||
						( e.keyCode == KeyCode.LEFT) ||
						( e.keyCode == KeyCode.RIGHT) ||
						( e.keyCode == KeyCode.INSERT) ||
						( e.keyCode == KeyCode.DELETE) ||
						( e.keyCode == KeyCode.HOME) ||
						( e.keyCode == KeyCode.END) ||
						( e.keyCode == KeyCode.DELETE) ||
						( e.keyCode == KeyCode.BACKTICK) ||
						( e.keyCode == KeyCode.SLASH) ||
						( e.keyCode == KeyCode.BACKSLASH) ||
						( e.keyCode == KeyCode.BRACKET_LEFT) ||
						( e.keyCode == KeyCode.BRACKET_RIGHT) ||
						( e.keyCode == KeyCode.SEMICOLON) ||
						( e.keyCode == KeyCode.QUOTE) ||
						( e.keyCode == KeyCode.COMMA) ||
						( e.keyCode == KeyCode.PERIOD) ||
						( e.keyCode == KeyCode.EQUAL) ||
						( e.keyCode == KeyCode.DASH)
					) { // keys dealt by default textarea
						if(
							( e.keyCode >= KeyCode.A && e.keyCode <= KeyCode.Z ) ||
							( e.keyCode >= KeyCode.D0 && e.keyCode <= KeyCode.D9 ) ||
							( e.keyCode == KeyCode.ENTER ) ||
							( e.keyCode == KeyCode.SPACE ) ||
							( e.keyCode == KeyCode.BACKSPACE ) ||
							( e.keyCode == KeyCode.DELETE) ||
							( e.keyCode == KeyCode.BACKTICK) ||
							( e.keyCode == KeyCode.SLASH) ||
							( e.keyCode == KeyCode.BACKSLASH) ||
							( e.keyCode == KeyCode.BRACKET_LEFT) ||
							( e.keyCode == KeyCode.BRACKET_RIGHT) ||
							( e.keyCode == KeyCode.SEMICOLON) ||
							( e.keyCode == KeyCode.QUOTE) ||
							( e.keyCode == KeyCode.COMMA) ||
							( e.keyCode == KeyCode.PERIOD) ||
							( e.keyCode == KeyCode.EQUAL) ||
							( e.keyCode == KeyCode.DASH)
						) {
							
							
							if( editor.mode.selected ==  "svg" ) {
								
								p.$.displayFrame.elementsClear();
								var svgdoc = p.el.control.value;
								console.log("LOADING BYPASS CONTROL");
								cmd.loadSvgControl.apply(self,[svgdoc]);
								
							} else if(editor.mode.selected == "packet") {
						
								if( editor.mode.data.current.type == "#index" ) {
									// dont reload, just in save case
									
								} else {
									
									editor.mode.reload(true);
									
								}
								
							}
							
							$(p.el.changedMark,{
								color : "#f00"
							},"(changed)");
							
							
						}
						
						return true;
					}
				}
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		}
	});
	
	
	// this loads previous file on editor
	
	var load = JSON.parse(localStorage.getItem("index.notes.last"));
	var data = "";
	if(load) {
		
		var last_notes = load.name;
		console.log("using file :", load.name + "." + load.ext);
		// this covers initial load of data and if user deletes index.notes.last
		data = localStorage.getItem(last_notes ? last_notes : "index.notes");
		if(data==null) {
			load = {
				name : "index.notes",
				ext : "txt"
			};
			localStorage.setItem("index.notes.last",JSON.stringify({ name : "index.notes", ext : "txt"}));
		}
		
		p.el.DocumentName.value = load.name;
		p.el.ExtensionName.value = load.ext;
		
		p.$.displayFrame.elementsClear(); // clearly the boot so no check is needed.
		
		
		// this loads file format
		cmd.get( load.name, load.ext, true );
		
		// load current previous file to edit if is a packet.
		
		editor.source = p.el.DocumentName.value;
		
		
	} else {
		
		p.el.DocumentName.value = "index.notes";
		p.el.ExtensionName.value = "txt";
		
		editor.source = "index.notes";
		
		localStorage.setItem("index.notes.last",JSON.stringify({ name : "index.notes", ext : "txt"}));
		
	}
	p.el.control.select(); // focus
	
	var w = parseInt(100/(3));
	//f( p. el.download );
	var ctrl = false;
	
	$(p.el.filenameCaption,{
		paddingLeft : "10px",
		fontFamily : "monospace",
		fontSize : "15px"
	},"Location:");
	$(p.el.SeparatorExtension,{
		borderLeft : "solid 1px #000"
	});
	$(p.el.extensionCaption,{
		paddingLeft : "10px",
		fontFamily : "monospace",
		fontSize : "15px"
	},"ext.");
	
	$(p.el.changedMark,{
		float : "right",
		fontFamily : "monospace",
		paddingRight : "10px"
	},"");
	
	$(p.el.tdInput_Filename,{
		width : "450px",
		position : "relative",
		top : "-13px",
		paddingLeft : "10px",
		paddingRight : "10px"
	});
	$(p.el.tdInput_Extension,{
		width : "50px",
		position : "relative",
		borderLeft : "solid 1px #000",
		top : "-13px",
		paddingLeft : "10px",
		paddingRight : "10px"
	});
	
	
	var boolSwitchPanelInputSelect = false;
	var init = false;
	var note = null;
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
					if(!init) {
						note = Class.create("NotePanel2",{"NotePanel2" : [ p.$.panelInputSelect, function(doc_name) {
							p.el.DocumentName.value = doc_name;
							
							// must check like enter on DocumentName do.
							
							cmd.get(p.el.DocumentName.value,p.el.ExtensionName.value);
							
							editor.source = p.el.DocumentName.value;
							
							
							
							return { type : "close" };
						}, function(message) {
							//console.log("################ recover",message.type );
							if( message.type == "close" ) {
								$( p.el.panelInputSelect, {
									display : "none"
								});
								boolSwitchPanelInputSelect = false;
								//console.log("################ recover",p.el.divInputSelect );
								
								
								// make the parser to send to notes-keyframe
								
								
							}
						} ] });
						init = true;
					}
					note.Reset();
					
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
	
	var history = [];
	history.copy = [];
	history.mode = 0;
	history.begin = "";
	history.ask = function() { // recover history deleted to free down key
		var len = history.length;
		while(len > 0) history.pop();
		for(var x = 0; x < history.copy.length;x++) {
			history.push(history.copy[x]);
		}
		p.el.DocumentName.value = history.begin;
		history.mode = 0;
	}
	history.ask_handle = null;
	
	$( p.el.DocumentName, {
		position : "absolute",
		fontFamily : "monospace",
		paddingLeft : "5px",
		top : "10px",
		width : "410px",
		outline : "none",
		border : "0px",
		value : last_notes ? last_notes : "index.notes",
		events : {
			"keyup" : function(e) {
				if(e.keyCode == KeyCode.ENTER) {
					if(history.mode == 1) {
						stopTimeout( history.ask_loop );
						history.mode = 0;
					}
					history.push( p.el.DocumentName.value );
					history.copy.push( p.el.DocumentName.value );
					
					console.log(p.el.DocumentName.value,p.el.ExtensionName.value);
					
					// if is not a component file of project then unload project, 
					// warn user about unloading project(???)
					if(editor.mode.selected=="packet") {
						
						
						// check if the file to be loaded is in tree class 
						var file_to_load = p.el.DocumentName.value;
						var check = false;
						
						
						// run throught the tree
						
						var stack = [];
						// find components that are packets.
						for(var x = 0; x < editor.mode.data.components.length;x++) {
							var component = editor.mode.data.components[x];
							stack.push(component);
						}
						while(stack.length>0) {
							var component = stack.pop();
							// if file without inner extension is not found then is not a packet
							if( component in localStorage) {
								var packet_file = localStorage.getItem( component );
								var json = JSON.parse(packet_file);
								if("components" in json) { // probably a packet
									if( component == file_to_load ) {
										check = true;
										break;
									} else {
										for(var x = 0; x < json.components.length;x++) {
											stack.push( json.components[x] );
										}
									}
								}
							} else {
								// try find phtml, ghtml, js
								if( (component + ".phtml") in localStorage) {
									if( (component + ".phtml") == file_to_load ) {
										// its a inside project file so don't unload project
										check = true;
										break;
									}
								}
								if( (component + ".ghtml") in localStorage) {
									if( (component + ".ghtml") == file_to_load ) {
										// its a inside project file so don't unload project
										check = true;
										break;
									}
								}
								if( (component + ".js") in localStorage) {
									if( (component + ".js") == file_to_load ) {
										// its a inside project file so don't unload project
										check = true;
										break;
									}
								}
							}
						}
						if(check) {
							
							// its a inside project file so don't unload project
							
							cmd.get(p.el.DocumentName.value,p.el.ExtensionName.value);
							
						} else {
							
							p.$.displayFrame.elementsClear();
							
							var file = cmd.get(p.el.DocumentName.value,p.el.ExtensionName.value,true); // true means, new packet
							
							if(file.ext == "svg") {
								
								// set editor to svg mode
								editor.mode.selected = "svg";
								editor.mode.data = {};
								
							} else if(file.ext == "json") {
								
								// set editor to json mode
								editor.mode.selected = "json";
								editor.mode.data = {};
								
							} else if(file.ext == "packet") {
								// a new packet but get will handle that.
								
								// already set to correct packet
							} else {
								
								// set editor to txt mode
								editor.mode.selected = "txt";
								editor.mode.data = {};
								
							}
							
						}
					} else {
						
						// just svg
						p.$.displayFrame.elementsClear();
						cmd.get(p.el.DocumentName.value,p.el.ExtensionName.value,true);	
						
					}
					editor.source = p.el.DocumentName.value;
					
				} else if(e.keyCode == KeyCode.UP) { // auto clear previous options
					e.stopPropagation();
					e.preventDefault();	
						
					if(history.length>0) {
						if( history.mode == 0){
							history.begin = history.pop();
							history.mode = 1;
							// give 5 seconds to user press enter, or reset to begin
							history.ask_handle = setTimeout(history.ask,3000);
						}
						if(history.length>0) {
							p.el.DocumentName.value = history.pop();
						} else {
							// return to begin
							p.el.DocumentName.value = history.begin;
						}
						return false;
					}
					// cmd history up
				} else if(e.keyCode == KeyCode.DOWN) {
					// show available actions [default is always get the default enter behaviour]
					
					
					
				} else if(e.keyCode == KeyCode.CTRL) {
					// activate autocomplete
					
					// shutdown autocomplete
				}
			}
		}
	});
	$( p.el.ExtensionName, {
		fontFamily : "monospace",
		paddingLeft : "5px",
		width : "30px",
		outline : "none",
		border : "solid 1px #000"
	});
	
	
	$( p.el.changeExtensionButton, {
		position : "absolute",
		left : "50px",
		top : "5px",
		width : "10px",
		height : "17px",
		backgroundColor : "#0F0",
		border : "solid 1px #000",
		events : {
			"mouseover" : function() { $( p.el.changeExtensionButton, { backgroundColor : "#000" } ); },
			"mouseleave" : function() { $( p.el.changeExtensionButton, { backgroundColor : "#0F0" } ); },
			"click" : function() {
				cmd.renameExtension();
			}
		}
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
			"click" : function() { 
				
				// must do same check that enter on DocumentName do.
				
				cmd.get(p.el.DocumentName.value,p.el.ExtensionName.value); 
				
				
				editor.source = p.el.DocumentName.value;
				
				
			}
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
	
	
	$( p.el.downloadFileSystem, {
		cursor : "pointer",
		backgroundColor : "#088",
		fontFamily : "monospace",
		fontSize : "15px",
		textAlign : "center",
		color : "white",
		events : {
			click : function() { cmd.downloadAll(); }
		}
	},"dfs");
	rollover.apply( p.el.downloadFileSystem, [{ backgroundColor : "#0FF", color : "#000" },{ backgroundColor : "#088", color : "#FFF" }]);
	
	$( p.el.syncFileSystem, {
		cursor : "pointer",
		backgroundColor : "#808",
		fontFamily : "monospace",
		fontSize : "15px",
		textAlign : "center",
		color : "white",
		events : {
			click : function() { cmd.sync(); }
		}
	},"sync");
	rollover.apply( p.el.syncFileSystem, [{ backgroundColor : "#F0F", color : "#000" },{ backgroundColor : "#808", color : "#FFF" }]);
	
	
	$( p.el.gotoFrame, {
		cursor : "pointer",
		backgroundColor : "#000",
		fontFamily : "monospace",
		fontSize : "15px",
		textAlign : "center",
		color : "white",
		events : {
			click : function() { 
				// set session document
				if( !BrowserTools.inIframe() ) {
					localStorage.setItem("index.notes.last",JSON.stringify({name:p.el.DocumentName.value,ext : p.el.ExtensionName.value }));
					
					History.go("/#frame"); 
				}
			}
		}
	},"home");
	
	
	rollover.apply( p.el.gotoFrame, [{ backgroundColor : "#888", color : "#FFF" },{ backgroundColor : "#000", color : "#FFF" }]);
	
	$( p.el.gotoThis, {
		cursor : "pointer",
		backgroundColor : "#000",
		fontFamily : "monospace",
		fontSize : "15px",
		textAlign : "center",
		color : "white",
		events : {
			click : function() { 
				// set session document
				console.log("CLICK");
				if( BrowserTools.inIframe() ) {
					window.parent.location.href = "/#tools.notes";
				}
				
			}
		}
	},"this");
	rollover.apply( p.el.gotoThis, [{ backgroundColor : "#888", color : "#FFF" },{ backgroundColor : "#000", color : "#FFF" }]);
	
	UI.Window.on("resize",function() {
		
		var sz = UI.Window.getBounds();
		$( origin_lt, { width : (sz[0]) + "px", height : sz[1] + "px" });
		$( p.el.container, { width : (sz[0]) + "px", height : sz[1] + "px" });
		
		//if(editor.menu) {
		
		$( p.el.control, { width : (sz[0]-20) + "px", height : (sz[1]-48-4-18) + "px" });		
			// resize menu
			// resize displayFrame
		$( p.el.displayFrame, { width : (sz[0]) + "px", height : (sz[1]-48-4-18) + "px" });
		$( p.el.clipPanel, { width : (sz[0]) + "px", height : (sz[1]-48-4-18) + "px" });
		//} else {
		//}
		return true;
	});
	$( p.el.btnUpload, {
		cursor : "pointer",
		position : "absolute",
		left : "720px",
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
	
	var sz = UI.Window.getBounds();
	$(p.el.clipPanel,{
		position : "absolute",
		left : "0px",
		top : "48px",
		width : (sz[0]) + "px", 
		height : (sz[1]-48-4-18) + "px",
		backgroundColor : "#fff"
		
	});
	
	$(p.el.displayFrame,{
		position : "absolute",
		left : "0px",
		top : "48px",
		width : (sz[0]) + "px", 
		height : (sz[1]-48-4-18) + "px",
		backgroundColor : "#fff"
	});
	/*
	$(p.el.txtEditor, {
		position: "absolute",
		left : "0px",
		top : "50px",
		display : "none",
		width : (sz[0]-5) + "px",
		height : (sz[1]-54) + "px",
		border : "solid 1px #000",
		//backgroundColor : "#fff",
		fontFamily : "monospace",
		fontSize : "15",
		opacity: 0.5
	},"teste");
	*/
	
	
	
},function() {
	document.onselectstart = selection_start_backup;
});