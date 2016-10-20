
DOMElementCount = Class.create("XMath.UnitCounter");

TabIndexCount = Class.create("XMath.UnitCounter");


var ____HtmlTags2 = [
	"a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont",
	"bdi","bdo","big","blockquote","body","br","button","canvas","center","cite","code","col",
	"colgroup","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed",
	"fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3",
	"h4","h5","h6","head","header","hr","html","i","iframe","img","input","ins","kbd","keygen","label",
	"legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noframes","noscript",
	"object","ol","opgroup","option","output","p","param","pre","progress","q","rp","rt","ruby",
	"s","samp","script","section","select","small","source","span","strike","strong","style","sub",
	"summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","u","ul",
	"var","video","wbr"
];
var ____HtmlTags3 = {};
for(var x = 0; x < ____HtmlTags2.length;x++) {
	____HtmlTags3[ ____HtmlTags2[x] ] = true;
}
var ____SvgTags2 = [
	"svg","altGlyph","altGlyphDef","altGlyphItem","animate","animateColor","animateMotion","animateTransform",
	"circle","clipPath","color-profile","cursor","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite",
	"feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB",
	"feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight",
	"feSpecularLighting","feSpotLight","feTile","feTurbulence","filter",
	"font","font-face","font-face-format","font-face-name","font-face-src","font-face-uri",
	"foreignObject","g","glyph","glyphRef","hkern","image","line","linearGradient","marker","mask","metadata","missing-glyph",
	"mpath","path","pattern","polygon","polyline","radialGradient","rect","set","stop","switch","symbol","text",
	"textPath","tref","tspan","use","view","vkern"
]
var ____SvgTags3 = {};
for(var x = 0; x < ____SvgTags2.length;x++) {
	____SvgTags3[ ____SvgTags2[x] ] = true;
}

Object.defineProperty(this, "____HtmlTags",{
	value : ____HtmlTags3,
	writable : false,
	configurable : false,
	enumerable : false
});
Object.defineProperty(this,"____SvgTags",{
	value : ____SvgTags3,
	writable : false,
	configurable : false,
	enumerable : false
});
//console.log("???? NOT WINDOW THIS-->",this);

Class.define("WithDOMNode", {
	from : ["WithArray","WithAlias"]
	,ctor : function() {
		this.internal.WithDOMNode.parent = null;
		this.internal.WithDOMNode.controller = null;
	},
	proto : {
		nodeBuild : function(target) {
			this.elementDefineParent(target);
			this.emit("nodeBuild");
			return true;
		},
		elementDefineParent : function(parent) {
			if( this.internal.WithDOMNode.parent == null ) {
				var p = parent;
				if(parent === undefined || parent === null) {
					p = document.body;
				}
				Object.defineProperty(this.internal.WithDOMNode,"parent",{
					get : function() { return p; }
				});
			} else {
				if(parent==this.internal.WithDOMNode.parent) {
					// same, do nothing
				} else {
					//if(this.internal.type != "UI.WindowDialog") console.error("WithDOMNode parent already defined");
					p = parent;
					Object.defineProperty(this.internal.WithDOMNode,"parent",{
						get : function() { return p; }
					});
				}
			}
		},
		elementDefineController : function(controller) {
			if( this.internal.WithDOMNode.controller == null ) {
				var c = controller;
				if(controller == undefined || controller == null) {
					c = UI.Body;
				}
				Object.defineProperty(this.internal.WithDOMNode,"controller",{
					get : function() { return c; }
				});
			} else {
				if(controller == this.internal.WithDOMNode.controller) {
				} else {
					console.error("WithDOMNode controller already defined");
					c = controller;
					Object.defineProperty(this.internal.WithDOMNode,"controller",{
						get : function() { return c; }
					});
					
				}
			}
		},
		nodeDispose : function() {
			this.itemClear();
			this.varClear();
			this.emit("nodeDispose");
			return true;
		}
	}
});
Class.define("WithDOMElements",{
	from : ["WithDOMNode","WithDebug"]
	, ctor : 
		function() {
	
		this.internal.WithDOMElements.data = {};
		this.internal.WithDOMElements.parent = null;
		this.internal.WithDOMElements.localId = 0;
		
		var movie = this.internal.WithDOMElements.movie = {};
		movie.state = 0; // 0 not buffered, 1 play, 2 pause, 3 reset
		movie.mode = 0; // 0 infinite loop, 1 play once
		movie.fps = 0; // 0 static
		movie.frame = 0;
		movie.endframe = 1;
		movie.start = window.performance.now();
		movie.lasframe = 0;
		
		this.internal.WithDOMElements.default_itemInputFilter_lock = function(index,oldvalue,newvalue) {
			return false;
		};
		var self = this;
		this.internal.WithDOMElements.default_itemInputFilter = function(index,oldvalue,newvalue) {
			
			var debug = false;
			
			if(debug) {
				self.debug("default_itemInputFilter " + newvalue.tag);
			}
			//	{ 
			//		tag : "div",
			//		id : "",
			//		parent : object,
			//	}
			//	
			//	console.log("input filter");
			
			if(newvalue.tag=="complex_element") {
				// verify if newvalue.complex behaves
				var id = "_" + DOMElementCount.getInc();
				newvalue.id = id;
				// set parent of complex
				if( !newvalue.complex.nodeBuild(newvalue.parent) ) {
					var keys = [];
					for(var x in newvalue.complex_extended) {
						if(x.indexOf("Deep")!=0 && x!="self")
							keys.push(x);
					}
					throw "error on build " + newvalue.name + " of type [" + keys.join("|") + "]";
				}
				// complex load event
				if( "WithEvents" in newvalue.complex.internal ) {
					newvalue.complex.emit("load",[newvalue.complex.internal[newvalue.complex.internal.type].data]);
				}
			} else {
				var el = null;
				var svg_tags = window.____SvgTags;
				var is_svg = newvalue.tag in svg_tags;
				if(is_svg) {
					el = document.createElementNS("http://www.w3.org/2000/svg",newvalue.tag);
					el.setAttributeNS('http://www.w3.org/2000/svg','xlink','http://www.w3.org/1999/xlink');
				} else {
					el = document.createElement(newvalue.tag);
				}
				
				var id = "_" + DOMElementCount.getInc();
				newvalue.id = id;
				el.setAttribute("id",id);
				newvalue.parent.appendChild(el);
				newvalue.el = el;
				// if is not svg and is in svg then add textnode
				if("args" in newvalue && "pure" in newvalue.args && newvalue.args.pure===true) {
					
				} else {
					tags = window.____HtmlTags;
					var check = newvalue.tag in tags;
					if(check || is_svg) {
						//console.log(newvalue.tag);
						newvalue.contents = Class.create("WithDOMElements");	
						newvalue.contents.elementDefineParent( newvalue.el );
						newvalue.contents.elementDefineController( newvalue.controller );
						
					}
				}
			}
			return true;
		};
		this.on("itemInputFilter",this.internal.WithDOMElements.default_itemInputFilter);
		this.internal.WithDOMElements.default_itemOutputFilter = function(index,value){
			//console.log("REMOVING FILTER");
			if("contents" in value) {
				value.contents.nodeDispose();
			}
			if(value.tag=="complex_element") {
				console.log("UNLOAD?");
				value.complex.emit("unload");
				value.complex.nodeDispose();
				
			} else {
				try {
					value.parent.removeChild( value.el );
					//value.el = null;
					//value.parent = null;
					this.varUnset( value.name );
				} catch(e) {
					console.log(value.name,e);
					console.log("!!",value.parent,value.el);
					var b = [];
					for(var x = 0; x < value.parent.childNodes.length;x++) {
						b.push( x, value.parent.childNodes[x] );
					}
					console.log( b.join(","));
				}
			}
			return true;
		};
		this.on("itemOutputFilter",this.internal.WithDOMElements.default_itemOutputFilter);
		this.on("varRename",function(oldkey,newkey) {
			this.varGet(newkey).name = newkey;
		});
	}
	, proto : {
		elementNew : function(name,path,args) {
			if( this.varGet(name) != null ) {
				console.error( name, " already registered.",this.varGet(name) );
				BrowserTools.debug(name);
			}
			//this.internal.WithDOMElements.localId += 1;
			if(arguments.length==1) {
				path = name;
				name = "_" + this.internal.WithDOMElements.localId;
				args = [];
			} 
			// _ : obter id apos cadastro e tornar name = id
			var svg_tags = window.____SvgTags;
			var check = path in svg_tags;
			var html_tags = window.____HtmlTags;
			check = check || path in html_tags;
			var complex = null;
			var type = "";
			if(check) {
				tag = path;
			} else {
				tag = "complex_element";
				var _class_args = {};
				if(args==undefined || args==null) args = {};
				_class_args[ path ] = [args];
				complex = Class.create(path,_class_args);
				if("elementDefineController" in complex) complex.elementDefineController(this);
				type = path;
			}
			var value = {
				name : name,
				tag : tag,
				el : null,
				type : type,
				complex : complex,
				controller : this,
				parent : this.internal.WithDOMNode.parent
			};
			if(arguments.length >= 2) {
				this.varSet(name,value);
			}
			this.itemPush(value);
			value.args = args;
			if(value.tag=="complex_element") return value.complex;
			return value.el;
		},
		
		elementNewPacket : function( pattern, basename, options ) {
			pattern = pattern.split("\r").join("").split("\n").join("").split("\t").join(" ");
			//console.log("NEW PACKET");
			basename = basename || "";
			var ret = {
				el : {},
				$ : {},
				conv : {}
			};
			var text = [];
			
			var intag = false;
			var intagname = false;
			var intagattrib = false;
			var intagattrib_key = false;
			var intagattrib_val = false;
			var intagattrib_string = false;
			var intext = false;
			
			var stack = [];
			var pointer = [{
				container : this
			}];
			var attributes_to_delete = [];
			var ret_pointer = ret;
			var current = {};
			var current_attribute = null;
			var count = 0;
			var current_el = null;
			var later_attribs = [];
			
			function ask(stream_clue,partial) {
				if("ask" in options) {
					//console.log("asking");
					var extra_args = [stream_clue, partial];
					return options.ask.apply(options.ask_owner,options.ask_args.concat(extra_args));
				}
			}
			var compounds = {};
			
			function tag_handle(tag) {
				if(tag.endTag) {
					if(stack[stack.length-1].tagName == tag.tagName) {
						//console.log("MATCH!");
						stack.pop();
						pointer.pop();
						//console.log("endtag", tag.tagName);
					} else {
						while(stack.length>0) {
							stack.pop();
							pointer.pop();
							if( stack.length >0 && stack[stack.length-1].tagName == tag.tagName ) {
								//console.log("MATCH!")
								//console.log("endtag", tag.tagName);
								return;
							}
						}
						throw "odd tag " + tag.tagName;
					}
				} else {
					if(tag.soleTag) {
					
						//console.log("tag:",tag);
						var id = [basename + ""];
						var check = false;
						var value = "";
						var has_src = false;
						var src = "";
						for(var x = 0; x < tag.attributes.length;x++) {
							if(tag.attributes[x].name=="id") {
								check = true;
								if( tag.attributes[x].value == "") {
									throw "tag with identification must have a name";
								}

								id.push( tag.attributes[x].value );
							} else if(tag.attributes[x].name=="src") {
								
								has_src = true;
								src = tag.attributes[x].value;
								
							}
							if(tag.tagName == "text" && tag.attributes[x].name=="value") {
								value = tag.attributes[x].value;
							}
						}
						var tmp = attributes_to_delete.length;
						while(tmp>0) { tmp-=1; attributes_to_delete.pop(); }
						if(!check) { id.push( "_" + DOMElementCount.getInc() ); }
						id = id.join("");
						if(tag.tagName == "text") {
							if(has_src) {
								// load file from localStorage
								var data = localStorage.getItem(src);
								pointer[pointer.length-1].element.appendChild( document.createTextNode(""+data) );
							} else {
								pointer[pointer.length-1].element.appendChild( document.createTextNode(""+value) );	
							}
							
							// ;
							// append to top container
						} else {
							//console.log("SOLE",id);
							//console.log(pointer[pointer.length-1].);
							var el = null;
							if("elementNew" in pointer[pointer.length-1].container) {
								el = pointer[pointer.length-1].container.elementNew( id, tag.tagName );
							} else {
								el = compounds[pointer[pointer.length-1].tag].elementNew(id, tag.tagName);
							}
							//var el = pointer[pointer.length-1].container.elementNew( id, tag.tagName );
							
							var convert_id = id;
							var direct = false;
							if(!check) {
								convert_id = el.getAttribute("id");
								direct = true;
							}
							
							//id
							var toremove = [];
							
							var elc = null;
							if("elementNew" in pointer[pointer.length-1].container) {
								elc = pointer[pointer.length-1].container.elementGetContents( id );
							} else {
								elc = compounds[pointer[pointer.length-1].tag].elementGetContents( id );
							}
							current_elc = elc;
							current_el = el;
							
							if(check) {
								ret.el[id] = el;
								ret.$[id] = elc;
								ret.conv[id] = el.getAttribute("id");
							}
							var skip = false;
							for(var x = 0; x < tag.attributes.length;x++) {
								skip = false;
								var ask_obj = { 
									type : "attribute", 
									key : tag.attributes[x].name, 
									value : tag.attributes[x].value, 
									id : convert_id, 
									element : el
								};
								if(options) {
									if( "attributes" in options ) {
										//console.log(tag.attributes[x].name,options.attributes,"ask" in options);
									}
								}
								if(options && "attributes" in options && options.attributes.indexOf( tag.attributes[x].name ) != -1) {
									//console.log("[here1 ***]");
									if(options && "ask" in options) {
										//console.log("[here2]");
										//console.log("[here3]");
										//console.log(ask_obj);
										var r = ask(ask_obj,ret);
										//console.log("#attrib."+tag.attributes[x].name+":",r);
										if(r==100) { // do not set element
											var info = { 
												nc_id : convert_id,
												el : el,
												direct : direct,
												tagName : tag.tagName,
												tagAttribName : tag.attributes[x].name,
												tagAttribHasValue : tag.attributes[x].has_value,
											};
											if(info.tagAttribHasValue) info.tagAttribValue = tag.attributes[x].value;
											later_attribs.push(info);
											
										}
										//console.log("[here4]");
										skip = true;
										//console.log("[here6 SE]",x);
									}
								}
								//console.log("SOLE TAG",tag.tagName);
								var t = tag.attributes[x];
								if((!skip) && (t.name != "id")) {
									if(t.value.charAt(0) == "\"" && t.value.charAt( t.value.length-1 ) == "\"") {
										t.value = t.value.substring( 1, t.value.length-1 );
									}
									//console.log("set attrib:",t.name,t.value);
									el.setAttribute( t.name, t.value );
									
								}
								
							}
							if(!check) {
								count += 1;
							}
						}
						return id;
					} else {
						
						//console.log("tag:",tag,pointer[pointer.length-1]);
						
						stack.push(tag);
						
						var id = basename + "";
						var check = false;
						for(var x = 0; x < tag.attributes.length;x++) {
							if(tag.attributes[x].name=="id") {
								check = true;
								if( tag.attributes[x].value == "") {
									throw "tag with identification must have a name";
								}
								id += tag.attributes[x].value;
								break;
							}
						}
						if(!check) {
							id += "_" + DOMElementCount.getInc();
						}
						
						var convert_id = id;
						
						

						//console.log("PAIR",id,tag.tagName);
						//console.log( pointer[pointer.length-1].container );
						var el = null;
						if(false) {
							if( "el" in pointer[pointer.length-1].container && pointer[pointer.length-1].container.el == null ) {
								console.log("A1");
								el = pointer[pointer.length-1].container.complex.elementNew( id, tag.tagName );
							} else {
								console.log("A2");
								el = pointer[pointer.length-1].container.elementNew( id, tag.tagName );
							}
						} else {
							if( "el" in pointer[pointer.length-1].container && pointer[pointer.length-1].container.el == null ) {
								console.log("A3");
								el = pointer[pointer.length-1].container.complex.elementNew( id, tag.tagName );
								// console.log(
							} else {
								//console.log(compounds[pointer[pointer.length-1].tag]);
								if("elementNew" in pointer[pointer.length-1].container) {
									console.log("A4");
									el = pointer[pointer.length-1].container.elementNew( id, tag.tagName );
								} else {
									console.log("A5");
									el = compounds[pointer[pointer.length-1].tag].elementNew(id, tag.tagName);
								}
							}
						}
						//console.log("!!",el);
						var convert_id = id;
						var direct = false;
						if(!check) {
							convert_id = el.getAttribute("id");
							direct = true;
						}
						var elc = null;
						if( "el" in pointer[pointer.length-1].container && pointer[pointer.length-1].container.el == null ) {
							
							if("nodeName" in el) {
								console.log( "@1",el,pointer[pointer.length-1].container.complex.elementGetContents(id),pointer[pointer.length-1].container );
								elc = pointer[pointer.length-1].container.complex.elementGetContents(id)
							} else {
								console.log( "@2",el,pointer[ pointer.length-1 ].container.complex );
								elc = el;//pointer[ pointer.length-1 ].container.complex;
							}
							
							
						} else {
							if("elementNew" in pointer[pointer.length-1].container) {
								elc = pointer[pointer.length-1].container.elementGetContents( id );
							} else {
								elc = compounds[pointer[pointer.length-1].tag].elementGetContents( id );
							}
						}
						//console.log("!!c",elc);
						compounds[ tag ] = pointer[ pointer.length-1].container.complex;
						pointer.push({
							element : el,
							container : elc,
							tag : tag
						});
						
						current_elc = elc;
						current_el = el;
							
						if(check) {
							ret.el[id] = el;
							ret.$[id] = elc;
							ret.conv[id] = el.getAttribute("id");
						}
						
						var skip = false;	
						for(var x = 0; x < tag.attributes.length;x++) {
							skip = false;
								var ask_obj = { 
									type : "attribute", 
									key : tag.attributes[x].name, 
									value : tag.attributes[x].value, 
									id : convert_id, 
									element : el
								};
								if(options) {
									if( "attributes" in options ) {
										//console.log(tag.attributes[x].name,options.attributes,"ask" in options);
									}
								}
								if(options && "attributes" in options && options.attributes.indexOf( tag.attributes[x].name ) != -1) {
									//console.log("[here1 ***]");
									if(options && "ask" in options) {
										//console.log("[here2]");
										//console.log("[here3]");
										console.log(ask_obj);
										var r = ask(ask_obj,ret);
										console.log("#attrib."+tag.attributes[x].name+":",r);
										//console.log("[here4]");
										if(r==100) { // later attribs
											var info = { 
												nc_id : convert_id,
												el : el,
												direct : direct,
												tagName : tag.tagName,
												tagAttribName : tag.attributes[x].name,
												tagAttribHasValue : tag.attributes[x].has_value,
											};
											if(info.tagAttribHasValue) info.tagAttribValue = tag.attributes[x].value;
											later_attribs.push(info);
											
										}
										skip = true;
										console.log("[here6 SE]",x);
										
										
									}
								}
							var t = tag.attributes[x];
							if((!skip) && t.name != "id") {
								if(t.value.charAt(0) == "\"" && t.value.charAt( t.value.length-1 ) == "\"") {
									t.value = t.value.substring( 1, t.value.length-1 );
								}
								
								
								//console.log(t.name,t.value);
								el.setAttribute( t.name, t.value );
							}
						}
						
						if(!check) {
							count += 1;
						}
						
						return id;
					}
				}
			}
			function clear_flags() {
				intag = false;
				intagname = false;
				intagattrib = false;
				intagattrib_key = false;
				intagattrib_val = false;
				intagattrib_string = false;
			}
			if( Object.prototype.toString.apply(pattern) == "[object String]" ) {
				for(var x = 0; x < pattern.length;x++) {
					var ch = pattern.charAt(x);
					/*
					console.log(x,ch,pattern.substring(x),
						"intag",intag,
						"intagname",intagname,
						"intagattrib",intagattrib,
						"intagattrib_key",intagattrib_key,
						"intagattrib_val",intagattrib_val,
						"intagattrib_string",intagattrib_string
					);
					*/
					if(!intag) {
						if( ch == "<" ) {
							if(intext) {
								//console.log(current_el,current_elc);
								current_el.appendChild( document.createTextNode(""+text.join("")) );
								text = [];
							}
							intext = false;
							if(pattern.indexOf("<!--",x)==x) {
								//console.log("@1");
								var end = pattern.indexOf("-->",x);
								if(end!=-1) x = end + 2;
								else x = pattern.length;
								continue;
							} else if(pattern.indexOf("<![CDATA[",x)==x) {
								throw "CDATA not implemented.";
							} else {
								// find comments
								intag = true;
								intagname = true;
								intagattrib = false;
								while(x+1 < pattern.length && pattern.charAt(x+1) == " ") x += 1;
								if( x + 1 < pattern.length && pattern.charAt(x+1) == "/" ) {
									//console.log("mark end tag",pattern.substring(x));
									x += 1;
									current = { tagName : "", endTag : true, soleTag : false, attributes : [] };
								} else {
									//console.log("mark tag start",pattern.substring(x));
									current = { tagName : "", endTag : false, soleTag : false, attributes : [] };
								}
							}
						} else {
							// text value
							if(!intext) {
								text = [];
								text.push(ch);
								intext = true;
							} else {
								text.push(ch);
							}
						}
					} else {
						if(intagname) {
							if(ch == "/") {
								while(x+1 < pattern.length && pattern.charCodeAt(x+1) == " ") x+= 1;
								if(x + 1 < pattern.length && pattern.charAt(x+1) == ">" ) {
									clear_flags(); current.soleTag = true; tag_handle(current);
								} else {
									console.log(x,pattern.substring(x));
									throw "unexpected tag end";
								}
							} else if( ch == ">") {
								clear_flags(); 
								tag_handle(current);
							} else if( ch == " ") {
								intagname = false;
								intagattrib = false;
							} else {
								current.tagName += ch;
							}
						} else if(intagattrib) {
							if(intagattrib_key) {
								if(ch == " ") {
									intagattrib = false;
									current_attribute = null;
								} else if(ch == ">") {
									clear_flags(); tag_handle(current);
								} else if(ch == "/") {
									while(x+1 < pattern.length && pattern.charCodeAt(x+1) == " ") x+= 1;
									if(x + 1 < pattern.length && pattern.charAt(x+1) == ">" ) {
										clear_flags(); current.soleTag = true; tag_handle(current);
									} else throw "unexpected tag end";
								} else if( ch == "=" ) {
									intagattrib_key = false;
									intagattrib_val = true;
								} else {
									current_attribute.name += ch;
								}
								
							} else if(intagattrib_val) {
								if( intagattrib_string ) {
									if(ch == "\"") {
										current_attribute = null;
										intagattrib = false;
										intagattrib_key = false;
										intagattrib_val = false;
										intagattrib_string = false;
									} else {
										current_attribute.has_value = true;
										current_attribute.value += ch;
									}
								} else {
									if( current_attribute.value == "" && ch == "\"" ) {
										intagattrib_string = true;
									} else if(ch == "/") {
										while(x+1 < pattern.length && pattern.charCodeAt(x+1) == " ") x+= 1;
										if(x + 1 < pattern.length && pattern.charAt(x+1) == ">" ) {
											clear_flags(); current.soleTag = true; tag_handle(current);
										} else throw "unexpected tag end";
									} else if(ch == ">") {
										clear_flags();
										tag_handle(current);
									} else if(ch != " ") {
										current_attribute.has_value = true;
										current_attribute.value += ch;
									} else {
										intagattrib = false;
										intagattrib_key = false;
										intagattrib_val = false;
										intagattrib_string = false;
										current_attribute = null;
									}
								}
							} else {
								while(pattern.charAt(x) == " " && x < pattern.length) x+=1;
								if(x == pattern.length) throw "unexpected tag end";
								ch = pattern.charAt(x);
								if( ch == "/") {
									while(x+1 < pattern.length && pattern.charCodeAt(x+1) == " ") x+= 1;
									if(x + 1 < pattern.length && pattern.charAt(x+1) == ">" ) {
										clear_flags(); current.soleTag = true; tag_handle(current);
									} else {
										throw "unexpected tag end";
									}
								} else if(ch == ">") {
									clear_flags(); tag_handle(current);
								} else {
									intagattrib = true;
									intagattrib_key = true;
									intagattrib_val = false;
									var attrib = {};
									attrib.name = ch;
									attrib.value = "";
									attrib.has_value = false;
									current.attributes.push(attrib);
									current_attribute = attrib;
								}
							}
						} else {
							if( ch == " ") continue;
							else if(ch == "/") { // sole tag
								while(x+1 < pattern.length && pattern.charCodeAt(x+1) == " ") x+= 1;
								if(x + 1 < pattern.length && pattern.charAt(x+1) == ">" ) {
									clear_flags(); current.soleTag = true; tag_handle(current);
								} else {
									throw "unexpected tag end";
								}
							} else if(ch == ">") {
								clear_flags(); tag_handle(current);
							} else { // attrib init
								intagname = false;
								intagattrib = true;
								intagattrib_key = true;
								intagattrib_val = false;
								var attrib = {};
								attrib.has_value = false;
								attrib.name = ch;
								attrib.value = "";
								current.attributes.push(attrib);
								current_attribute = attrib;
							}
						} 
					}
				}
			}
			
			for(var x = 0; x < later_attribs.length;x++) {
				console.log(later_attribs[x].tagName);
				var info = { type : "later_attribute", key : later_attribs[x].tagAttribName };
				if( later_attribs[x].tagAttribHasValue ) {
					info.value = later_attribs[x].tagAttribValue;
				}
				console.log(ret);
				var r = ask(info,ret);
				console.log( later_attribs[x], r.key, r.value );
				if(r.key==null && r.value==null) {
					
				} else {
					if("svg" in r && r.svg) {
						if(later_attribs[x].direct) {
							document.getElementById( later_attribs[x].nc_id ).setAttributeNS( 'http://www.w3.org/1999/xlink',r.key, r.value );
						} else {
							ret.el[later_attribs[x].nc_id].setAttributeNS( 'http://www.w3.org/1999/xlink',r.key,r.value );
						}
					} else {
						if(later_attribs[x].direct) {
							document.getElementById( later_attribs[x].nc_id ).setAttribute( r.key, r.value );
						} else {
							ret.el[later_attribs[x].nc_id].setAttribute( r.key,r.value );
						}
					}
				}
			}
			// parsed ids
			return ret;
		},
		elementSchema : function(schema) { // obsolete?
			throw "obsolete use elementNewPacket";
			
			var lang = UI.Body.htmlcss_collapser;
			lang.setTarget(this);
			
			var ctx = {};
			lang.parser.run({
				context : ctx,
				query : schema,
				mode : "build",
				print : false
			});
			
			return ctx.result;
		},
		elementAddStyleClass : function(name,style) {
			
			
			var re = /^([a-zA-Z_\-]+([a-zA-Z_\-0-9]*))/.exec(style);
			if(re!=null) style = re[1];
			else return this;
			
			var str_classes = this.elementGetAttribute("class");
			var arr_classes = str_classes.split(" ");
			if(arr_classes.length==1 && arr_classes[0]=="") arr_classes.shift();
			for(var x = 0; x < arr_classes.length;x++) {
				if(style == arr_classes[x]) {
					return this;
				}
			}
			arr_classes.push(style);
			this.elementSetAttribute(name,"class",arr_classes.join(" "));
			return this;
		},
		elementRemoveStyleClass : function(name,style) {
			
			var re = /^([a-zA-Z_\-]+([a-zA-Z_\-0-9]*))/.exec(style);
			if(re!=null) style = re[1];
			else return this;
			
			var str_classes = this.elementGetAttribute(name,"class");
			var arr_classes = str_classes.split(" ");
			if(arr_classes.length==1 && arr_classes[0]=="") arr_classes.shift();
			
			var mark = [];
			for(var x = 0; x < arr_classes.length;x++) {
				if(style == arr_classes[x]) {
					mark.push(x);
				}
			}
			for(var x = mark.length-1;x>=0;x--)
				arr_classes.splice(mark[x],1);
			this.elementSetAttribute(name,"class",arr_classes.join(" "));
			return this;
			
		},
		elementSetAttribute : function(name,attrib,value) {
			var target = this.varGet(name);
			if(target!=null) {
				//console.log("ok");
				if(target.tag=="complex_element") {
					if("nodeSingleTag" in target.complex) {
						//console.log("ok??");
						target.complex.nodeSingleTag().setAttribute(attrib,value);
					} else {
						//console.log(name,"attribute",attrib,value," not set.");
					}
				} else {
					target.el.setAttribute(attrib,value);
				}
			}
			return this;
		},
		elementGetAttribute : function(name,attrib,value) {

			var target = this.varGet(name);
			if(target!=null) {
				if(target.tag == "complex_element") {
					if("nodeSingleTag" in target.complex) {
						return target.complex.nodeSingleTag().getAttribute(attrib);
					} else {
						console.log(name,"attribute",attrib,value," does not exists.");
						return "";
					}
				} else {
					return target.el.getAttribute(attrib);	
				}
			}
			return "";
		},
		elementAddEvent : function(name,event,callback) {
			var target = this.varGet(name);
			if(target!=null) {
				if( target.tag != "complex_element" ) {
					target.el.addEventListener(event,callback);
					return true;
				} else {
					if("WithEvents" in target.complex.internal) {
						target.complex.on(event,callback);
						return true;
					}
					return false;
				}
			}
			return false;
		},
		elementRemoveEvent : function(name,event,callback) {
			var target = this.varGet(name);
			if(target!=null) {
				if(target.tag != "complex_element") {
					target.el.removeEventListener(event,callback);
					return true;
				} else {
					if("WithEvents" in target.complex.internal) {
						target.complex.off(event,callback);
						return true;
					}
					return false;
				}
			}
		},
		elementGet : function(name) {
			var ret = this.varGet(name);
			if(ret==null) return null;
			
			if(ret.tag=="complex_element") {
				return ret.complex;
			} else {
				return ret.el;
			}
		},
		elementIsComplex : function(name) {
			var ret = this.varGet(name);
			if(ret!=null) {
				if(ret.tag == "complex_element") {
					return true;
				}
			}
			return false;
		},
		elementControl : function(name,control) {
			var ret = this.varGet(name);
			if(ret!=null) {
				console.log("4");
				var c = Class.create(control,{});
				c.name = name;
				c.parent = this;
				c.element = ret;
				c.init();
				return c;
			} else {
				return null;
			}
		},
		elementMovie : function() {
			return this.internal.WithDOMElements.movie;
		},
		elementRender : function(time) {
			
			
			var movie = this.internal.WithDOMElements.movie;
			
			if(movie.state==0) {
				
				movie.state = 1;

				this.emit("render");
				
				movie.start = time;
				
			} else if ( movie.state == 2 ) {
				// not running
				movie.state = 2;
				
			} else if(movie.state==3) {
				
				movie.frame = 0;
				movie.state = 1;
				
				this.emit("render");
				movie.start = time;
				
			} else {
			
				
				if(movie.fps > 0) {
				
					//console.log(time);
					var packet = 1000/movie.fps;
					if(time > movie.start + packet) {
						
						var frames_ahead = parseInt( movie.fps * (time-movie.start) / 1000 );
						
						if(frames_ahead > movie.lastframe) {
							this.emit("render");
						}
						
						if(  frames_ahead >= movie.endframe) {
							
							if(movie.mode==1) {// play once
								movie.state = 2;
								movie.frame = movie.endframe-1;
								movie.start = time;
							} else {
								
								movie.frame = frames_ahead % movie.endframe;
								if(frames_ahead / movie.endframe > 10) {
									movie.start += packet*movie.endframe;
								}
								movie.lastframe = 0;
							}
						} else {
							movie.lastframe = movie.frame;
							
							movie.frame = frames_ahead;
							
						}
						
					}
					
				}
			}
			
			for(var x = 0; x < this.itemAmount();x++) {
				var item = this.itemGetAt(x);
				if( item.tag == "complex_element" ) {
					
					if("elementRender" in item.complex) {
						item.complex.elementRender(time);
					} else {
						//console.log(item.tag,item.name);
					}
				} else if( "contents" in  item ) {
					item.contents.elementRender(time);
				} else {
					// single tag
				}
			}
			
			
		},
		elementGetContents : function(name) {
			var ret = this.varGet(name);
			if(ret!=null) {
				if(ret.tag=="complex_element") {
					return ret;
				} else {
					if("contents" in ret)
						return ret.contents;
					throw "this element do not has contents.";
				}
			} else {
				throw name + " do not exists";
			}
		},
		elementRemove : function(name) {
			var itemA = this.varGet(name);
			if(itemA!=null) {
			console.log(name,itemA);
				console.log("element remove called ",name,itemA.id);
				console.log(itemA,name);
				this.itemRemoveComplex(function(x,itemB) {
					//console.log(itemA,itemB);
					return (itemB.id == itemA.id);
				});
			}
		},
		elementRename : function(oldname,newname) {
			var val = this.varGet(oldname);
			if(val!=null) {
				this.elementRemove(oldname);
				this.varSet(newname,val);
				this.itemPush(val);
			}
		},
		elementsClear : function() {
			var items = this.itemClear();
			this.varClear();
			delete items;
		},
		elementRemoveB : function(name) {
			var ret = this.varGet(name);
			if(ret==null) return null;
			// find ret in items
			var i = this.itemFindFirstIndex(ret);
			if(i!=-1) {
				this.removeAt(i);
				this.varUnset(name);
			}
		},
		elementLock : function() {
			this.on("itemInputFilter",this.internal.WithDOMElements.default_itemInputFilter_lock);
		},
		elementX : function(p,full_target) {
			function getArray(target) {
				var path = target[1].split(".");
				var cur = target[0];
				for(var x = 0; path.length>1 && x < path.length-1;x++) {
					if("complex" in cur && "tag" in cur && cur.tag == "complex_element") {
						cur = cur.complex.elementGetContents( path[x] );
					} else {
						cur = cur.elementGetContents( path[x] );
					}
				}
				if(path.length > 1) target = cur.complex.elementGet( path[ path.length-1 ] );
				else {
					target = target[0];
				}
				return target;
			}
			var name_arr = full_target.split(".");
			if(name_arr.length == 1) {
				return p.el[name_arr[0]];
			} else if(name_arr.length == 2) {
				return p.el[ name_arr[0] ].elementGet( name_arr[1] )
			} else if( name_arr.length  >= 3) {
				var el = p.el[ name_arr[0] ];
				name_arr.shift();
				return getArray( [ el, name_arr.join(".") ]);
			}
		},
		
		elementUnlock : function() {
			this.off("itemInputFilter",this.internal.WithDOMElements.default_itemInputFilter_lock);
		},
		nl : function() {
			this.elementNew("br");
		}
	}
});