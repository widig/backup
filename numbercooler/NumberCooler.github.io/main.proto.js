Router.addPage({name:"proto",template:"base"},function(args, template, router) {


	console.log("HERE");
	
	
	
	UI.Body.Container().style.overflow = "hidden";
	
	var parent = template.Container().elementGetContents("origin_lt");
	var parent_el = template.Container().elementGet("origin_lt");
	parent.elementsClear();
	
	parent_el.style.position = "absolute";
	parent_el.style.left = "0px";
	parent_el.style.top = "0px";
	var sz = UI.Window.getBounds();
	parent_el.style.width = sz[0] + "px";
	parent_el.style.height = sz[1] + "px";
	parent_el.style.overflow = "hidden";
	

	var editor = {
		location : {
			position : [0,0,0],
			name : "index2"
		},
		keyboard : {
			ctrl : false,
			shift : false,
			alt : false
		},
		layers : [
		{
			elements_file : null,
			elements : null,
			control_file : null,
			control : null
		},
		{
			elements_file : null,
			elements : null,
			control_file : null,
			control : null
		},
		{
			elements_file : null,
			elements : null,
			control_file : null,
			control : null
		}
		],
		mode : {
			stack : ["default"]
		}
	};
	var p = parent.elementNewPacket("<div id=\"layers\"><div id=\"layer0\"></div><div id=\"layer1\"></div><div id=\"layer2\"></div></div><input id=\"DocumentName\" type=\"text\"/><textarea id=\"control\" spellcheck=\"false\"></textarea>");
	var sz = UI.Window.getBounds();
	BrowserTools.setStyle(p.el.DocumentName,{
		position : "absolute",
		left : (sz[0]/2- 320)+ "px", top : (sz[1]/2-240-40)+"px",
		width : "640px", height : "30px",
		events : {
			keydown : function(e) {
				if(e.keyCode == KeyCode.ENTER) {
					var file_data = localStorage.getItem(p.el.DocumentName.value);
					if(file_data == null || file_data == "") {
						localStorage.setItem(p.el.DocumentName.value,"");
						p.el.control.value = "";
						localStorage.setItem("index2.last",p.el.DocumentName.value);
					} else {
						p.el.control.value = file_data;
						localStorage.setItem("index2.last",p.el.DocumentName.value);
					}
				}
			}
		}
	},"index2");
	BrowserTools.setStyle(p.el.layers,{
		position : "absolute",
		left : "0px", top :"0px", width : sz[0] + "px", height : sz[0] + "px"
	});
	BrowserTools.setStyle(p.el.layer0,{
		position : "absolute",
		left : "0px", top :"0px", width : sz[0] + "px", height : sz[0] + "px"
	});
	BrowserTools.setStyle(p.el.layer1,{
		position : "absolute",
		left : "0px", top :"0px", width : sz[0] + "px", height : sz[0] + "px",
		display : "none"
	});
	BrowserTools.setStyle(p.el.layer2,{
		position : "absolute",
		left : "0px", top :"0px", width : sz[0] + "px", height : sz[0] + "px",
		display : "none"
	});
	BrowserTools.setStyle( p.el.control, {
		position : "absolute",
		left : (sz[0]/2- 320)+ "px", top : (sz[1]/2-240)+"px",
		width : "640px", height : "480px",
		whiteSpace: "pre", tabSize : 4,
		resize : "none",
		events : {
			keydown : function(e) {
				if(editor.mode.stack.length==1 && editor.mode.stack[0] == "default") {
					if(e.keyCode == KeyCode.SHIFT) editor.keyboard.shift = true;
					if(e.keyCode == KeyCode.CTRL) editor.keyboard.ctrl = true;
					if(e.keyCode == KeyCode.ALT) editor.keyboard.alt = true;
					if(editor.keyboard.ctrl) {
						if(editor.keyboard.shift) {
							if( e.keyCode == KeyCode.D1 ) {
								p.$.layer0.elementsClear();
								console.log( localStorage.getItem(editor.layers[0].elements_file) );
								editor.layers[0].elements = p.$.layer0.elementNewPacket( localStorage.getItem(editor.layers[0].elements_file) );
								editor.layers[0].control_file = p.el.DocumentName.value;
								editor.layers[0].control = {};
								var f = new Function("packet",p.el.control.value);
								f.apply( this, [ editor.layers[0].elements, editor.layers[0].control ] );
								e.stopPropagation();
								e.preventDefault();
								return false;
							} else if( e.keyCode == KeyCode.D1 ) {
								p.$.layer1.elementsClear();
								editor.layers[1].elements = p.$.layer1.elementNewPacket( localStorage.getItem(editor.layers[1].elements_file) );
								editor.layers[1].control_file = p.el.DocumentName.value;
								editor.layers[1].control = {};
								var f = new Function("packet",p.el.control.value);
								f.apply( this, [ editor.layers[1].elements, editor.layers[1].control ] );
								e.stopPropagation();
								e.preventDefault();
								return false;
							} else if( e.keyCode == KeyCode.D1 ) {
								p.$.layer2.elementsClear();
								editor.layers[2].elements = p.$.layer1.elementNewPacket( localStorage.getItem(editor.layers[2].elements_file) );
								editor.layers[2].control_file = p.el.DocumentName.value;
								editor.layers[2].control = {};
								var f = new Function("packet",p.el.control.value);
								f.apply( this, [ editor.layers[2].elements, editor.layers[2].control ] );
								e.stopPropagation();
								e.preventDefault();
								return false;
							}
						} else if(editor.keyboard.alt) {
							
						} else {
							if(e.keyCode == KeyCode.S) {
								localStorage.setItem( p.el.DocumentName.value, p.el.control.value );
								e.stopPropagation();
								e.preventDefault();
								localStorage.setItem("index2.last",p.el.DocumentName.value);
								return false;
							} else if(e.keyCode == KeyCode.D1) { // element to layer1
								localStorage.setItem( p.el.DocumentName.value, p.el.control.value );
								editor.layers[0].elements = p.$.layer0.elementNewPacket(p.el.control.value);
								editor.layers[0].elements_file = p.el.DocumentName.value;
								console.log("loaded " + p.el.DocumentName.value + ":" + p.el.control.value);
								e.stopPropagation();
								e.preventDefault();
								return false;
							} else if(e.keyCode == KeyCode.D2) { // element to layer1
								editor.layers[1].elements = p.$.layer1.elementNewPacket(p.el.control.value);
								editor.layers[1].elements_file = p.el.DocumentName.value;
								e.stopPropagation();
								e.preventDefault();
								return false;
							} else if(e.keyCode == KeyCode.D3) { // element to layer1
								editor.layers[2].elements = p.$.layer2.elementNewPacket(p.el.control.value);
								editor.layers[2].elements_file= p.el.DocumentName.value;
								e.stopPropagation();
								e.preventDefault();
								return false;
							}
							
						}
					} else if(editor.keyboard.shift) {
						if(editor.keyboard.alt) {
							
						} else {
							
						}
					} else if(editor.keyboard.alt) {
						
					} else {
						if(e.keyCode == KeyCode.TAB) {
							e.preventDefault();
							var s = p.el.control.selectionStart;
							p.el.control.value =  p.el.control.value.substring(0,p.el.control.selectionStart) + 
								"\t" + p.el.control.value.substring(p.el.control.selectionEnd);
							p.el.control.selectionEnd = s+1; 
							return false;
						}
						if( (e.keyCode >= KeyCode.A && e.keyCode <= KeyCode.Z) || (e.keyCode == KeyCode.ENTER)|| (e.keyCode == KeyCode.SPACE)|| (e.keyCode == KeyCode.BACKSPACE) || (e.keyCode == KeyCode.DELETE) || (e.keyCode == KeyCode.HOME)|| (e.keyCode == KeyCode.END)|| (e.keyCode == KeyCode.LEFT) || (e.keyCode == KeyCode.RIGHT)|| (e.keyCode == KeyCode.UP)|| (e.keyCode == KeyCode.DOWN)) {
							return false;
						}
					}
				}
				
				e.stopPropagation();
				e.preventDefault();
				return true;
				
			},
			keyup : function(e) {
				if(e.keyCode == KeyCode.SHIFT) editor.keyboard.shift = false;
				if(e.keyCode == KeyCode.CTRL) editor.keyboard.ctrl = false;
				if(e.keyCode == KeyCode.ALT) editor.keyboard.alt = false;
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		}
	});
	var file = localStorage.getItem("index2.last");
	if(file==null || file == "") file = " index2";
	p.el.DocumentName.value = file;
	p.el.control.value = localStorage.getItem(file);
	
	console.log("END");
});