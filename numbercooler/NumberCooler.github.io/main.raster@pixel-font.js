

Router.addPage({name:"raster@pixel-font",template:"base"},function(args,template,router) {
	
	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	// read and write pixel font files app
	/*
		Workflow:
			STEP 1: BUILD
				first panel selects width and height of character
			STEP 2: SELECT
				this step select char that need to be draw
			STEP 3:
				draw char
			STEP 3: SAVE
				// compile font (compress step)
				download option
				save on server option
			STEP 4: LOAD
				load from server 
				load from local
				goto step2
	*/
	
	var panel = {
		element : null,
		state : "build",
		events : Class.create("WithEvents"),
		tabs : [
			  {
				name : "build",
				caption : "BUILD",
				data : {
					name : "default font name",
					width : 8,
					height: 12
				},
				methods : {
				},
				mount : function(parent) {
					parent.elementsClear();
					var egc = "elementGetContents";
					var en = "elementNew";
					var table = parent[en]("table","table");
					var t = parent[egc]("table");
					function create_item(x,name) {
						t[en]("tr"+x,"tr")
						var c0 = t[egc]("tr"+x)[en]("td0","td")
						c0.innerHTML = name + ":";
						t[egc]("tr"+x)[en]("td1","td")
						var iw = t[egc]("tr"+x)[egc]("td1")[en]("input")
						iw.value = ""+panel.hash["build"].data[  name  ];
						console.log(">>",name);
						iw.addEventListener("keyup",function() {
							
							var val = iw.value;
							var a = parseInt(val);
							panel.hash["build"].data[name]	= isNaN(a) ? val : a;
							console.log(">>",panel.hash["build"].data[name]);
							
							//panel.hash["build"].methods[]
							
						});
					}
					var index = 0;
					for(var name in panel.hash["build"].data) {
						create_item(index,name);
						index += 1;
					}
				}
			}
			, {
				name : "select",
				caption : "SELECT",
				init : false,
				data : {
					map : {}
				},
				selected_map : null,
				map_controls : [],
				aliases : [],
				mount : function(parent) {
					console.log("mount select");
					
					
					var self = this;
					parent.elementsClear();
					var egc = "elementGetContents";
					var en = "elementNew";
					
					var table = parent[en]("table","table")
					var t = parent[egc]("table");
					
					t[en]("tr0","tr")
						var c0 = t[egc]("tr0")[en]("td0","td");
						
							var dataTitle = t[egc]("tr0")[egc]("td0")[en]("divDataTitle","div");
							dataTitle.innerHTML = "Data Panel";
							var dataBody = t[egc]("tr0")[egc]("td0")[en]("divDataBody","div");
								var tblData = t[egc]("tr0")[egc]("td0")[egc]("divDataBody")[en]("dataTable","table");
									var tblDataContainer = t[egc]("tr0")[egc]("td0")[egc]("divDataBody")[egc]("dataTable");
									tblDataContainer[en]("dataRow0","tr");
										var dataCell00 = tblDataContainer[egc]("dataRow0")[en]("dataCell00","td");
											dataCell00.innerHTML = "alias:";
										var dataCell01 = tblDataContainer[egc]("dataRow0")[en]("dataCell01","td");
											var iname = tblDataContainer[egc]("dataRow0")[egc]("dataCell01")[en]("input");
									tblDataContainer[en]("dataRow1","tr")
										var dataCell10 = tblDataContainer[egc]("dataRow1")[en]("dataCell10","td");
											dataCell10.innerHTML = "array:";
										var dataCell11 = tblDataContainer[egc]("dataRow1")[en]("dataCell11","td");
											var iarray = tblDataContainer[egc]("dataRow1")[egc]("dataCell11")[en]("input");
											iarray.addEventListener("keyup",function() {
												// try parse the data
												// set start array string
											});
					
					t[en]("tr2","tr")
						var td = t[egc]("tr2")[en]("td11","td");
						td.style.verticalAlign = "top";
					
							var frameTable = t[egc]("tr2")[egc]("td11")[en]("frameTable","table");
							frameTable.style.width = "100%";
							var frameTableContainer = t[egc]("tr2")[egc]("td11")[egc]("frameTable");
							
							
								var frameRow = frameTableContainer[en]("frameRow","tr");
								var frameRowContainer = frameTableContainer[egc]("frameRow");
									var frameCol0 = frameRowContainer[en]("frameCol0","td");
									frameCol0.style.width = "50%";
									frameCol0.style.textAlign = "center";
									
										var frameString = frameRowContainer[egc]("frameCol0")[en]("frameString","span");
										frameString.style.fontSize = "10px";
										frameString.innerHTML = "frame:";
						
										frameRowContainer[egc]("frameCol0")[en]("","br");
						
										var frameValue = frameRowContainer[egc]("frameCol0")[en]("frameValue","span");
										frameValue.style.fontSize = "50px";
										frameValue.style.color = "#00f";
										frameValue.innerHTML = "0";
						
									var frameCol1 = frameTableContainer[egc]("frameRow")[en]("frameCol1","td");
									frameCol1.style.backgroundColor = "#00f";
						
										var frameScroll = frameTableContainer[egc]("frameRow")[egc]("frameCol1")[en]("frameScroll","div");
										frameScroll.style.position = "relative";
										frameScroll.style.left = "0px";
										frameScroll.style.top = "0px";
										frameScroll.style.height = "100px";
										frameScroll.setAttribute("width","20")
										frameScroll.innerHTML = " ";
										
					t[en]("tr3","tr")
						var td = t[egc]("tr3")[en]("td10","td");
							td.style.textAlign = "center";
							var display = t[egc]("tr3")[egc]("td10")[en]("display","div");
							var displayc = t[egc]("tr3")[egc]("td10")[egc]("display");
							var canvasDisplay = t[egc]("tr3")[egc]("td10")[en]("canvasDisplay","canvas");
							canvasDisplay.setAttribute("width","300");
							canvasDisplay.setAttribute("height","400");
							canvasDisplay.style.border = "solid 1px #000";
							var ctx = canvasDisplay.getContext("2d");
							canvasDisplay.addEventListener("mousedown",function(e) {
								console.log("click");
							});
					// dom element collection will slow down with large data
					
					function create_pixel(x,y) {
						var s = t[egc]("tr3")[egc]("td10")[egc]("display")[en]( "cell_"+y+"_"+x,"span");
						s.innerHTML = "[x]";
						s.style.border = "solid 1px #000";
						s.style.backgroundColor = "#fff";
						s.style.color = "#000";
						s.style.cursor = "default";
						
						var control = {
							position : [x,y],
							element : s,
							active : false,
							set : function(b) {
								if(b) {
									s.style.backgroundColor = "#000";
									s.style.color = "#fff";
									if( self.selected_map !=null ) {
										var i32s = parseInt( Math.ceil( panel.hash["build"].data.width / 32 ) );
										var packet = i32s;
										i32s = panel.hash["build"].data.height * i32s;
										
										var data = self.selected_map[ packet * this.position[1] + parseInt( Math.floor( this.position[0]/32 ) ) ];
										var pos = 1 << ( 31 - (this.position[0] % panel.hash["build"].data.width));
										//console.log( (pos>>>0).toString(2) );
										data |= pos;
										self.selected_map[ packet * this.position[1] + parseInt( Math.floor( this.position[0]/32 ) ) ] = data;
										iarray.value = JSON.stringify( self.data.map[ iname.value ] );
										
									}
									this.active = true;
								} else {
									s.style.backgroundColor = "#fff";
									s.style.color = "#000";
									if( self.selected_map != null) {
										var i32s = parseInt( Math.ceil( panel.hash["build"].data.width / 32 ) );
										var packet = i32s;
										i32s = panel.hash["build"].data.height * i32s;
										
										var data = self.selected_map[ packet * this.position[1] + parseInt( Math.floor( this.position[0]/32 ) ) ];
										var pos = 1 << ( 31 - (this.position[0] % panel.hash["build"].data.width));
										//console.log( (pos>>>0).toString(2) );
										var inv = pos;
										data &= ( (~(0>>>0)) ^ inv );
										self.selected_map[ packet * this.position[1] + parseInt( Math.floor( this.position[0]/32 ) ) ] = data;
										iarray.value = JSON.stringify( self.data.map[ iname.value ] );
									}
									this.active = false;
								}
							},
							
						};
						self.map_controls.push(
							control
						);
						s.addEventListener("selectstart",function(e) { e.preventDefault(); return false; });
						s.addEventListener("click",function() {
							if( control.active ) {
								console.log(x,y,"false");
								control.set(false);
							} else {
								console.log(x,y,"true");
								control.set(true);
							}
						});
					}
					if(!this.init) {
						console.log("init",panel.hash["build"].data.width);
						
						var f = function() {
							for(var y = 0; y < panel.hash["build"].data.height;y++) {
								for(var x = 0; x < panel.hash["build"].data.width;x++) {
									create_pixel(x,y);
									if(x==panel.hash["build"].data.width-1)
									t[egc]("tr3")[egc]("td10")[egc]("display").nl();
								}	
							}
						}
						f();
						
						this.init = true;
					} else {
						var display = t[egc]("tr3")[egc]("td10").elementGet("display");
						self.selected_map = null;
						console.log("reuse");
						for(var y = 0; y < panel.hash["build"].data.height;y++) {
							for(var x = 0; x < panel.hash["build"].data.width;x++) {
								var c = self.map_controls[ y*panel.hash["build"].data.width + x ];
								var item = t[egc]("tr3")[egc]("td10").elementGet("display");
								item.appendChild( c.element );
								if(x==panel.hash["build"].data.width-1)
								t[egc]("tr3")[egc]("td10")[egc]("display").nl();
								c.set(false);
								
							}
						}
						
						
					}
					iname.addEventListener("keyup",function() {
						// if exists show on display
						if(iname.value in self.data.map) {
							console.log("exists",iname.value);
							self.selected_map = self.data.map[iname.value];
							
							var tmap = self.data.map[ iname.value ];
							console.log(tmap);
							var i32s = parseInt( Math.ceil( panel.hash["build"].data.width / 32 ) );
							var packet = i32s;
							i32s = panel.hash["build"].data.height * i32s;
							console.log("packet:",packet,tmap.length,i32s);
							var k = 0;
							var ki = 0;
							for(var y = 0; y < panel.hash["build"].data.height;y++) {
								for(var x = 0; x < panel.hash["build"].data.width;x++) {
									var c = tmap[ ki ];
									if( c & ( 1 << (31 - k) ) ) {
										//console.log("X");
										self.map_controls[ y*panel.hash["build"].data.width + x ].set(true);
									} else {
										//console.log("[]");
										self.map_controls[ y*panel.hash["build"].data.width + x ].set(false);
									}
									k++;
									if(k==32 || k == panel.hash["build"].data.width) {
										//console.log(k);
										k = 0;
										ki += 1;
									}
								}
							}
							iarray.value = JSON.stringify( self.data.map[ iname.value ] );
							
						} else {// set on change to draw create empty symbol on table ONCE
							console.log("create");
							self.data.map[ iname.value ] = [];
							var i32s = parseInt( Math.ceil( panel.hash["build"].data.width / 32 ) );
							var packet = i32s;
							i32s = panel.hash["build"].data.height * i32s;
							
							
							for(var x = 0; x < i32s;x++) self.data.map[ iname.value ].push(0);
							
							
							for(var y = 0; y < panel.hash["build"].data.height;y++) {
								for(var x = 0; x < panel.hash["build"].data.width;x++) {
									var c = self.map_controls[ y*panel.hash["build"].data.width + x ];
									c.active = false;
									c.element.style.backgroundColor = "#fff";
									c.element.style.color = "#000";
								}
							}
							
							iarray.value = JSON.stringify( self.data.map[ iname.value ] );
							
						}
						self.selected_map = self.data.map[iname.value];
					});
					
					
						
					
					
					
					
					
					
					
				}
			}
			, {
				name : "save",
				caption : "SAVE",
				mount : function(parent) {
					
					
					// local panel
					
					var data = JSON.stringify( {
						name : panel.hash["build"].data.name
						, width: panel.hash["build"].data.width
						, height: panel.hash["build"].data.height
						, map : panel.hash["select"].data.map
					} );
					
					var b = new Buffer(data,"binary");
					b.download("application/octet-stream","font.json");
					
					// remote panel
					
					
					// input name
					
				}
			}
			, {
				name : "load",
				caption : "LOAD",
				mount : function(parent) {
					// local panel -> upload
					
					// remote panel -> download from server
					
					parent.elementsClear();
					parent.elementNew("table")
					parent.elementNew("tr")
					parent.elementNew("td")
					parent.elementNew("td")
					
					parent.elementNew("tr")
					parent.elementNew("td")
					parent.elementNew("td")
					
				}
			}
		],
		hash : {},
		loadState : function(parent) {
			console.log(this.state);
			this.hash[ this.state ].mount( parent );
		},
		convertToArray : function(huge_matrix) {
			
		},
		downloadFontFile : function() {
			
		},
		uploadFontFile : function() {
			
		}
	};
	
	panel.element = origin_lt_container.elementNew("panel","div");
	panel.element_container = origin_lt_container.elementGetContents("panel");
	
	panel.head = panel.element_container.elementNew("head","div");
	panel.head.style.position = "relative";
	panel.head.style.height = "31pxpx";
	panel.head.style.border = "solid 1px #000";
	//panel.head.style.display = "inline";
	//panel.head.style.backgroundColor = "#ff0";
	panel.head_container = panel.element_container.elementGetContents("head");
	
	
	panel.body = panel.element_container.elementNew("body","div");
	panel.body.style.position = "relative";
	panel.body.style.display = "block";
	panel.body_container = panel.element_container.elementGetContents("body");
	
	
	function panel_tab(item) {
		panel.hash[ item.name ] = panel.tabs[x];
		item.element = panel.head_container.elementNew(item.name,"div");
		item.element.style.display = "inline";
		item.element.style.padding = "10px";
		item.element.style.backgroundColor = "#000";
		item.element.style.color = "#fff";
		item.element.style.lineHeight = "30px";
		item.element.style.cursor = "pointer";
		item.element.innerHTML = item.caption;
		item.element.addEventListener("click",function() {
			panel.events.emit("change",item.name);
			panel.state = item.name;
			panel.loadState(panel.body_container);
		});
	}
	
	for(var x = 0; x < panel.tabs.length;x++) {
		var item = panel.tabs[x];
		panel_tab(item);
		
	}
	
	
	panel.loadState(panel.body_container);
	
	
	
	
	
});
