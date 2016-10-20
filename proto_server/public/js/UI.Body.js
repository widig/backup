

Class.define("UI.Body",{ from : ["WithDOMElements"] , ctor :
	function(){
	
		this.debug = true;
		
		this.elementDefineParent(document.body);
		var windowBody = this;
		
		if("ContextManager" in window) {
			var body_addEventListener_map = ContextManager.createMap(null,document.body,"addEventListener",function(map,result,ir){
				
				return result;
			});
			body_addEventListener_map.addPattern(function() {
				console.log("body.addEventListener",JSON.stringify( Array.prototype.slice.call(arguments) ));	
				return {
					cancel : false,
					hastracks : true,
					tracks : [1],
					require : ["default"]
				}
			});
			
			var body_removeEventListener_map = ContextManager.createMap(null,document.body,"removeEventListener",function(map,result,ir) {
				return result;
			});
			body_removeEventListener_map.addPattern(function() {
				console.log("body.removeEventListener",JSON.stringify( Array.prototype.slice.call(arguments) ));	
				var check = false;
				var sel_value = null;
				for( var x = 0; x < body_addEventListener_map.applied.length;x++) {
					if( 
						body_addEventListener_map.applied[x][0][0] == arguments[0] &&
						body_addEventListener_map.applied[x][1][0] == arguments[1] &&
						body_addEventListener_map.applied[x][2][0] == arguments[2]
					) {
						sel_value = body_addEventListener_map.applied[x][1][1];
						check = true;
						break;
					}
				}
				var r = {
					cancel : !check,
					hastracks : false
				};
				if( check ) {
					r.replace = true;
					r.replaceCursor = [1];
					r.replaceValue = [sel_value];
				}
				return r;
			});
		}
		
		var i = this.internal["UI.Body"];
		i.console = {
			_state : false,
			uploading : false,
			uploading_return : false,
			uploading_last : null,
			input_buffer : [],
			output_buffer : [],
			lineCount : 0,
			lines : [],
			historyCursor : -1,
			history : [],
			input : function(opt) {
				this.state = true;
				while(this.input_buffer.length>0)
					this.input_buffer.pop();
				if("display" in opt) {
					this.prompt = opt.display;
				}
				this.callback = opt.callback;
			},
			historyUp : function() {
				if( this.historyCursor > -1 ) {
					this.historyCursor -= 1;
					if(this.historyCursor >= 0 && this.historyCursor < this.history.length ) {
						var data = [];
						var sel = this.history[ this.history.length - 1 - this.historyCursor ];
						for(var x = 0; x < sel.length;x++)
							data.push(sel.charAt(x));
						this.input_buffer = data;
					}
					
					if(this.historyCursor == -1)
						this.input_buffer = [];
				}
				this.refresh();
			},
			historyDown : function() {
				if( this.historyCursor >= -1 ) {
				
					if(this.historyCursor + 1 < this.history.length)
						this.historyCursor += 1;
					if(this.historyCursor >= 0 && this.historyCursor < this.history.length) {
						var data = [];
						var sel = this.history[ this.history.length - 1- this.historyCursor ];
						for(var x = 0; x < sel.length;x++)
							data.push(sel.charAt(x));
						this.input_buffer = data;
					} else {
						this.input_buffer = [];
					}
					
				}
				this.refresh();
				
				
			},
			save : function() {
				
			},
			restore : function() {
			
			},
			execute : function() {
				var data = this.input_buffer.join("");
				if(data!="") {
					while(this.input_buffer.length>0) {
						this.input_buffer.pop();
					}
					var self = this;
					// send to local handler (coproc)
					// send to server?
					var k = Class.create("Kernel");
					k.setUploadCallback(function(pass_data) {
						windowBody.updialog.style.display = "";
						self.uploading = true;
						console.log("upload callback in");
						if( self.uploading_last == null ) {
							self.uploading_last = function(evt) {
								pass_data({result:true,data : evt.target.files });
								windowBody.updialog.style.display = "none";
							}
							windowBody.updialog.addEventListener('change', self.uploading_last);
						} else {
							windowBody.updialog.removeEventListener('change', self.uploading_last);
							self.uploading_last = function(evt) {
								pass_data({result:true,data : evt.target.files });
								windowBody.updialog.style.display = "none";
							}
							windowBody.updialog.addEventListener('change', self.uploading_last);
						}
					});
					
					
					
					var parts = data.split(" ");
					
					if(parts[0]=="login") {
						parts.shift();
						var j = parts.join(" ")
						k.login(j
							,function(data) {
								//self.output_buffer.push(JSON.stringify(data));
								//alert(JSON.stringify(data));
								if(data.result) {
									self.output_buffer.push("{\"result\":true}");
									localStorage.setItem("csrf-cookie",data.csrf_cookie);
									localStorage.setItem("username",parts[1]);
									//document.getElementById("panelLogin").style.display = "none";
									//document.getElementById("lblErrorMessage").style.display = "none";
									//load_terminal();
									//logout.style.display = "";
									
									// goto
									History.go("#home");
								} else {
									self.output_buffer.push(JSON.stringify(data));
								}
								self.refresh();
							}
							,function(r) {
								self.output_buffer.push(JSON.stringify(r));
								console.log("FAIL:",JSON.stringify(r));
								self.refresh();
							}
						);
					} else if(parts[0]=="logout") {
						parts.shift();
						k.logout(parts.join(" ")
							,function(r) {
								self.output_buffer.push(JSON.stringify(r));
								self.refresh();
							}
							,function(r) {
								self.output_buffer.push(JSON.stringify(r));
								console.log("FAIL:",JSON.stringify(r));
								self.refresh();
							}
						);
					} else if(data=="set local") {
						k.setMode("local");
						this.prompt = "local:/>";
						self.output_buffer.push(JSON.stringify({result:true}));
						self.output_buffer.push(data);
						self.history.push(data);
						self.historyCursor = -1;
						self.refresh();
					} else if(data=="set remote") {
						k.setMode("remote");
						this.prompt = "remote:/>";
						self.output_buffer.push(JSON.stringify({result:true}));
						self.output_buffer.push(data);
						self.history.push(data);
						self.historyCursor = -1;
						self.refresh();
					} else {
						
						k.run( data
							, function(r) {
								// r.output
								// r.path
								if(data.indexOf("cd")==0 && "path" in r) {
									console.log("at "+k.getMode()+ "[" + r.path +"]");
									if(k.getMode()=="local") {
										self.prompt = "local:"  + r.path + "/>";
									} else if(k.getMode()=="remote") {
										
									}
								}
								if("output" in r) {
									self.output_buffer.push("EOF>>");
									var parts = r.output.split("\r\n");
									var c = 0;
									for(var x = parts.length-1;x>=0;x--) {
										var parts2 = parts[x].split("\n");
										for(var y = parts2.length-1;y>=0;y--) {
											if(c==0 && parts2[y]=="") {
											
											} else {
												self.output_buffer.push(parts2[y]);
											}
											c++;
										}
									}
									self.output_buffer.push("<<");
									self.output_buffer.push(JSON.stringify(r));
									
								} else if("value" in r) {
									self.output_buffer.push(JSON.stringify(r.value));
									self.output_buffer.push(JSON.stringify(r));
								} else {
									self.output_buffer.push(JSON.stringify(r));
								}
								self.output_buffer.push(data);
								self.history.push(data);
								self.historyCursor = -1;
								self.refresh();	
							}
							, function(r) {
								self.output_buffer.push(JSON.stringify(r));
								self.output_buffer.push(data);
								console.log("FAIL:",JSON.stringify(r));
								self.refresh();
							} 
						);
						
					}
					
				}
				
			},
			output : function(val) {
				this.output_buffer.unshift(val);
				this.refresh();
			},
			pause : function() {
				// if it is a blocking command
				
			},
			resume : function() {
				// resume input from blocking command
				
			},
			clear : function() {
				while( this.output_buffer.length > 0 ) {
					this.output_buffer.pop();
				}
			},
			cursorStart : function() {
				var c = this;
				this.cursorStop();
				this.cursorId = setInterval(function() {
					if(c.cursor) {
						self.console_cursor.style.backgroundColor = "black";
						c.cursor = false;
					} else {
						self.console_cursor.style.backgroundColor = "lime";
						c.cursor = true;
					}
				
				},500);
			},
			cursorStop : function() {
				clearInterval(this.cursorId);
			},
			cursorId : 0,
			cursor : false,
			prompt : "local:/>",
			callback : function(data){ console.log(data); },
			refresh : function(time) {
				
				
				self.console_text.nodeValue = this.prompt + this.input_buffer.join("");
				
				if(this.output_buffer.length>this.lineCount) {
					// add lines
					for(var x = this.lineCount; x < this.output_buffer.length;x++) {
						var line = document.createTextNode("");
						var nl = document.createElement("br");
						this.lines.push( [ line, nl ] );
						self.console_history.appendChild(line);
						self.console_history.appendChild(nl);
					}
					
				} else if(this.output_buffer.length < this.lineCount) {
					// remove lines
					
					for(var x = this.lineCount; x > this.output_buffer.length;x--) {
						var p = this.lines[ x-1];
						self.console_history.removeChild( p[1] );
						self.console_history.removeChild( p[0] );
					}
				}
				for(var x = 0; x <  this.output_buffer.length;x++) {
					var p = this.lines[this.output_buffer.length-1-x];
					p[0].nodeValue = this.output_buffer[x];
				}
				//self.console_history.innerHTML = this.output_buffer.join("<br/>");
			}
		};
		Object.defineProperty(i.console,"state",{
			get : function() {
				return i.console._state;
			},
			set : function(val) {
				if(true && !i.console._state) {
					i.console.cursorStart();
				} else if(false && i.console._state) {
					i.console.cursorStop();
				}
				i.console._state = val;
				i.console.refresh();
			}
		});
		
		Object.defineProperty(this,"console",{
			get : function() { return i.console; }
		});
		
		i.__selectstart_event = function(e) { e.preventDefault(); return false; };
		
		
		
		
		
		this.on( "on", function(event,callback) {
			document.body.addEventListener(event,callback);
			return true;
		});
		this.on("off",function(event,callback) {
			document.body.removeEventListener(event,callback);
			return true;
		});
		
		
		
		
		
		this.data = this.elementNew("container","div");
		//console.log(this.data);
		
		
		this.data.style.position = "absolute";
		this.data.style.left = "0px";
		this.data.style.top = "0px";
		this.data.style.overflow = "";
		this.data.style.zIndex = 1;
		this.data.style.width = window.innerWidth + "px";
		this.data.style.height = window.innerHeight + "px";	
		
		
		this.filter = this.elementNew("filter","div");
		this.filter.style.position = "fixed";
		this.filter.style.overflow = "hidden";
		this.filter.style.left = "0px";
		this.filter.style.top = "0px";
		this.filter.style.width = window.innerWidth + "px";
		this.filter.style.height = window.innerHeight + "px";
		this.filter.style.backgroundColor = "#000";
		this.filter.style.opacity = 0.5;
		this.filter.style.zIndex = 2;
		this.filter.style.display = "none";
		
		
		// in front goes dialogs
		this.front = this.elementNew("front","div");
		this.front.style.position = "fixed";
		this.front.style.overflow = "hidden";
		this.front.style.left = "0px";
		this.front.style.top = "0px";
		this.front.style.width = window.innerWidth + "px";
		this.front.style.height = window.innerHeight + "px";
		this.front.style.zIndex = 3;
		this.front.style.display = "none";
		
		// console is above all but may be disabled
		this.console_div = this.elementNew("console","div");
		this.console_div.style.position = "fixed";
		this.console_div.style.overflow = "hidden";
		this.console_div.style.left = "0px";
		this.console_div.style.top = "0px";
		this.console_div.style.width = window.innerWidth + "px";
		this.console_div.style.height = window.innerHeight + "px";
		this.console_div.style.backgroundColor = "#000";
		this.console_div.style.fontFamily = "Courier New";
		this.console_div.style.fontSize = "18px";
		this.console_div.style.fontWeight = "bold";
		this.console_div.style.color = "#fff";
		this.console_div.style.opacity = 0.9;
		this.console_div.style.zIndex = 4;
		this.console_div.style.display = "none";
		
		// this.elementGetContents("console")
		this.console_text = document.createTextNode("");
		this.console_div.appendChild(this.console_text);
		
		
		this.console_cursor  = this.elementGetContents("console").elementNew("cursor","span");
		this.console_cursor.style.position = "relative";
		this.console_cursor.style.width = "10px";
		this.console_cursor.style.height = "10px";
		this.console_cursor.style.backgroundColor = "lime";
		this.console_cursor.innerHTML = "&nbsp";
		
		this.console_history = this.elementGetContents("console").elementNew("history","div"); // result_value
		
		this.updialog = this.elementGetContents("console").elementNew("upload_dialog","div");
		this.updialog.style.position = "absolute";
		this.updialog.style.right = "10px";
		this.updialog.style.top = "10px";
		this.updialog.style.width = "250px";
		this.updialog.style.height = "40px";
		this.updialog.style.backgroundColor = "#fff";
		this.updialog.style.border = "solid 1px #000";
		this.updialog.style.color = "#000";
		this.updialog.style.display = "none";
		
		this.updialog_inputfile = this.elementGetContents("console").elementGetContents("upload_dialog").elementNew("input_file","input");
		this.updialog_inputfile.setAttribute("type","file");
		this.updialog_inputfile.backgroundColor = "#00f";
		this.updialog_inputfile.position = "absolute";
		this.updialog_inputfile.left = "10px";
		this.updialog_inputfile.top = "10px";
		this.updialog_inputfile.width = "100px";
		this.updialog_inputfile.height = "20px";
		
		
		this.container = this.elementGetContents("container");
		TabIndexCount.reset(1);
		var self = this;
		UI.Window.on("paste",function(e) {
			console.log("PASTE");
			if(!self.internal["UI.Body"].console.state) return;
			
			var cmd = self.internal["UI.Body"].console;
			var input_buffer = cmd.input_buffer;
			
			var paste = e.clipboardData.getData("text");
			var data = [];
			for(var x = 0; x < paste.length;x++) {
				input_buffer.push(paste.charAt(x));
			}
			cmd.refresh();
		});
		
		UI.Window.on("keydown",function(e) {
			if(self.internal["UI.Body"].console.state) e.preventDefault();
			
			// manage shortcuts
			
			//console.log(e.keyCode);
			
			if(!UI.Window.keyboard.enabled) return;
			
			if(!self.consoleState()) {
				// handle turn on console
				if(e.keyCode == 119) {
					if( self.consoleState() )
						self.consoleHide();
					else
						self.consoleShow();
					e.preventDefault(); 
					e.returnValue = false;
				}
				return false;
			}
			
			
			
			
			//console.log(e);
			
			// us keyboard
			if(e.keyCode==16) {
				UI.Window.keyboard.shift = true;
				
				
			} else {
				var shift = UI.Window.keyboard.shift;
				
				var cmd = self.internal["UI.Body"].console;
				var input_buffer = cmd.input_buffer;
				var output_buffer = cmd.output_buffer;
				var history = cmd.history;
				if(e.keyCode==8) { // backspace 
					if(input_buffer.length>0) {
						input_buffer.pop();
					}
					
				} else if(e.keyCode==KeyCode.TAB) { // tab
					
				} else if(e.keyCode==10) {
				
				} else if(e.keyCode==KeyCode.ENTER) {
					setTimeout(function() {
						cmd.execute();
					},0);
					
					
				} else if(e.keyCode==KeyCode.CONTROL) { // control
					UI.Window.keyboard.ctrl = true;
				} else if(e.keyCode==KeyCode.ALT) { // alt
					UI.Window.keyboard.alt = true;
					
				} else if(e.keyCode==20) { // caps lock
					
				} else if(e.keyCode==KeyCode.ESCAPE) { // escape
					while(input_buffer.length>0) input_buffer.pop();
					cmd.historyCursor = -1;
					
				} else if(e.keyCode==KeyCode.SPACE) {
					if(input_buffer[ input_buffer.length-1 ] != " ")
						input_buffer.push(" ");
				} else if(e.keyCode==KeyCode.PAGEUP) { // page up
					
				} else if(e.keyCode==KeyCode.PAGEDOWN) { // page down
					
				} else if(e.keyCode==KeyCode.END) { // end
					
				} else if(e.keyCode==KeyCode.HOME) { // home
					
				} else if(e.keyCode==KeyCode.LEFT) { // left
				
					
				} else if(e.keyCode==KeyCode.UP) { // up
					
					cmd.historyUp();
					
				} else if(e.keyCode==KeyCode.RIGHT) { // right
					
					
				} else if(e.keyCode==KeyCode.DOWN) { // down
					cmd.historyDown();
					
				} else if(e.keyCode==KeyCode.INSERT) { // insert
					
				} else if(e.keyCode==KeyCode.DELETE) { // delete
					
				} else if(e.keyCode >= 48 && e.keyCode <= 57) { // numbers
					if(shift) {
						if(e.keyCode==48) {
							input_buffer.push(")");
						} else if(e.keyCode==49) {
							input_buffer.push("!");
						} else if(e.keyCode==50) {
							input_buffer.push("@");
						} else if(e.keyCode==51) {
							input_buffer.push("#");
						} else if(e.keyCode==52) {
							input_buffer.push("$");
						} else if(e.keyCode==53) {
							input_buffer.push("%");
						} else if(e.keyCode==54) {
							input_buffer.push("^");
						} else if(e.keyCode==55) {
							input_buffer.push("&");
						} else if(e.keyCode==56) {
							input_buffer.push("*");
						} else if(e.keyCode==57) {
							input_buffer.push("(");
						}
					} else {
						input_buffer.push(String.fromCharCode(e.keyCode));
					}
				} else if(e.keyCode >= 65 && e.keyCode <= 90) { // letters
					if(e.keyCode == 67 && UI.Window.keyboard.ctrl) { // cancel or copy, depending on state
						self.emit("ctrl-c");
						
						//65 a b 67c  de 70 fghijklmno
						// 80 pqrstuv
						//
					} else if(e.keyCode == 86 && UI.Window.keyboard.ctrl) {
						
						
					} else if(shift) {
						input_buffer.push(String.fromCharCode(e.keyCode));
					} else {
						input_buffer.push(String.fromCharCode(e.keyCode+32));
					}
				} else if(e.keyCode >= 96 && e.keyCode <= 105) { // keypad 0-9
					input_buffer.push(String.fromCharCode(e.keyCode-48));
					
				} else if(e.keyCode == 106) {
					input_buffer.push("*");
					
				} else if(e.keyCode == 107) {
					input_buffer.push("+");
					
				} else if(e.keyCode == 109) {
					input_buffer.push("-");
					
				} else if(e.keyCode == 110) {
					input_buffer.push(".");
					
				} else if(e.keyCode == 111) {
					input_buffer.push("/");
					
				} else if(e.keyCode >= 112 && e.keyCode <= 123) { // Fn
					
					if(e.keyCode == KeyCode.F11) {
						function toggleFullScreen() {
							if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
								(!document.mozFullScreen && !document.webkitIsFullScreen)) {
									if (document.documentElement.requestFullScreen) {  
										document.documentElement.requestFullScreen();  
									} else if (document.documentElement.mozRequestFullScreen) {  
										document.documentElement.mozRequestFullScreen();  
									} else if (document.documentElement.webkitRequestFullScreen) {  
										document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
									}  
							} else {  
								if (document.cancelFullScreen) {  
									document.cancelFullScreen();  
								} else if (document.mozCancelFullScreen) {  
									document.mozCancelFullScreen();  
								} else if (document.webkitCancelFullScreen) {  
									document.webkitCancelFullScreen();  
								}  
							}  
						}
						toggleFullScreen();
						
					}
					if(e.keyCode == KeyCode.F8) {
						
						if( self.consoleState() )
							self.consoleHide();
						else
							self.consoleShow();
						
					}
					
					//e.preventDefault(); 
					//return false;
						
				} else if(e.keyCode==186) {
					if(shift) {
						input_buffer.push(":");
					} else {
						input_buffer.push(";");
					}
				} else if(e.keyCode==187) {
					if(shift) {
						input_buffer.push("+");
					} else {
						input_buffer.push("=");
					}
				} else if(e.keyCode==188) {
					if(shift) {
						input_buffer.push("<");
					} else {
						input_buffer.push(",");
					}
				} else if(e.keyCode==189) {
					if(shift) {
						input_buffer.push("_");
					} else {
						input_buffer.push("-");
					}
				} else if(e.keyCode==190) {
					if(shift) {
						input_buffer.push(">");
					} else {
						input_buffer.push(".");
					}
				} else if(e.keyCode==191) {
					if(shift) {
						input_buffer.push("?");
					} else {
						input_buffer.push("/");
					}
				} else if(e.keyCode==192) {
					if(shift) {
						input_buffer.push("~");
					} else {
						input_buffer.push("`");
					}
				} else if(e.keyCode==219) {
					if(shift) {
						input_buffer.push("{");
					} else {
						input_buffer.push("[");
					}
				} else if(e.keyCode==220) {
					if(shift) {
						input_buffer.push("|");
					} else {
						input_buffer.push("\\");
					}
				} else if(e.keyCode==221) {
					if(shift) {
						input_buffer.push("}");
					} else {
						input_buffer.push("]");
					}
				} else if(e.keyCode==222) {
					if(shift) {
						input_buffer.push("\"");
					} else {
						input_buffer.push("'");
					}
				} else {
					input_buffer.push("[keycode:" + e.keyCode + "]");
				}
				cmd.refresh();
			}
			e.returnValue = false;
			return false;
		});
		
		UI.Window.on("keyup",function(e) {
			if(!UI.Window.keyboard.enabled) return;
			if(self.internal["UI.Body"].console.state) e.preventDefault();
			
			if(e.keyCode==16) {
				UI.Window.keyboard.shift = false;
			} else if(e.keyCode==17) { // ctrl
				UI.Window.keyboard.ctrl = false;
			} else if(e.keyCode==18) { // alt
				UI.Window.keyboard.alt = false;
			}
			if(self.internal["UI.Body"].console.state) {
				return false;
			}
		});
		UI.Window.on("keypress",function(e) {
			if(self.internal["UI.Body"].console.state) e.preventDefault();
			
			
			if(self.internal["UI.Body"].console.state) {
				return false;
			}
		});
		
		
		var _styles = Class.create("UI.Style");
		
		Object.defineProperty(this,"style",{
			get : function() {
				return _styles;
			}
		});
		
		//var _lang_htmlcss_collapser = Class.create("Lang.HTMLCSS_Collapser",{});
		
		//Object.defineProperty(this,"htmlcss_collapser",{ get : function() { return _lang_htmlcss_collapser; } });
		
		
	}
	, proto : {
		get : function() {
			return this.internal.WithDOMNode.parent;
		},
		Container : function() {
			return this.elementGet("container");
		},
		nodeBuild : function(target) {
			return true;
		},
		nodeDispose : function() {
			TabIndexCount.reset(1);
			this.container.nodeDispose(); // remove all only inside div:container, which is permanent
			return true;
		},
		mode : function(type) {
			// page, app
			if(type=="page") {
				this.data.style.overflow = "";
			} else if(type=="app") {
				this.data.style.overflow = "hidden";
			}
		},
		consoleShow : function() {
			this.console_div.style.display = "";
			this.internal["UI.Body"].console.state = true;
			UI.Window.keyboard.enabled = true;
			
			// resume command line program
			
		},
		consoleLog : function() {
			var args = Array.prototype.slice.apply(arguments);
			var i = this.internal["UI.Body"];
			var c = i.console;
			var str = [];
			for(var x = 0; x < args.length;x++) {
				str.push( "" + args[x] );
			}
			if(true) { // debug
				console.log(str.join(" "));
			}
			c.output_buffer.push(str.join(" "));
			c.refresh();
		},
		consoleHide : function() {
			this.console_div.style.display = "none";
			this.internal["UI.Body"].console.state = false;
			// UI.Window.keyboard.enabled = false;
			// pause command line program
			
		},
		consoleSwitch : function() {
			if( this.internal["UI.Body"].console.state ) {
				this.consoleHide();
			} else {
				this.consoleShow();
			}
		},
		consoleState : function() {
			return this.internal["UI.Body"].console.state;
		},
		consoleHandler : function(handler) {
			this.internal["UI.Body"].console.callback = handler;
		},
		block : function() {
			this.filter.style.display = "";
		},
		unblock : function() {
			this.filter.style.display = "none";
		},
		reset : function() {
			TabIndexCount.reset(1);
		},
		RenderLoop : function() {
			var time = window.performance.now();
			
			// check data ready
			
			
			// render
			UI.Body.elementRender(time);
			
			// the caller are in UI.load, UI.init -> so it's self calling if initialized
			
			
			if(UI.Body.debug) {
				//console.log("debug");
				setTimeout(UI.Body.RenderLoop,0);
			} else {
				requestAnimationFrame(UI.Body.RenderLoop);
			}
			
		},
		canSelect : function(value) {
			if(value===true) {
				this.off("selectstart",this.internal["UI.Body"].__selectstart_event);
			} else if(value===false) {
				this.on("selectstart",this.internal["UI.Body"].__selectstart_event);
			}
		},
		setSize : function(w,h) {
			this.data.style.width = w + "px";
			this.data.style.height = h + "px";
			
			this.filter.style.width = w + "px";
			this.filter.style.height = h + "px";
			
			this.console_div.style.width = w + "px";
			this.console_div.style.height = h + "px";
			
			this.emit("domResize",[w,h]);
		}
	}
});