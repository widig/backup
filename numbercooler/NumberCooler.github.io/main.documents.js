					
Router.addPage({name:"documents",template:"base",locked:true},function(args,template) {

	console.log("editor boot");
	var self = this;
	base_container.apply(this);
	
	var kernel = Class.create("Kernel");
	
	/*
	
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	this.nodeDispose = function() {
		console.log("page unload");
		origin_lt.style.backgroundColor = "";
		window.localStorage.setItem("history.editor.filepath","");
		window.localStorage.setItem("history.editor.filecrc","");
		window.localStorage.setItem("history.editor.filecrcflow","");
		window.localStorage.setItem("history.editor.value","");
		
	}
	UI.Window.on("unload",function() {
		console.log("window unload");
		window.localStorage.setItem("history.editor.filepath","");
		window.localStorage.setItem("history.editor.filecrc","");
		window.localStorage.setItem("history.editor.filecrcflow","");
		window.localStorage.setItem("history.editor.value","");
	});
	// template altera template
	//var container = template.Container().elementGetContents("item"); 
	//container.elementsClear();
	//template.Container().elementGetContents("origin").elementsClear();
	//var container = template.Container().elementGetContents("origin");
	
	
	var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
		h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
		
		
	
	
	//console.log(" >>>",origin_lt);
	origin_lt.style.backgroundColor = "#000";
	origin_lt.style.width = w + "px";
	origin_lt.style.height = h + "px";
	
	origin_lt_container.elementsClear();
	
	
	var logo = origin_lt_container.elementNew("logo","div");
	logo.innerHTML = "&nbsp;NumberCooler&nbsp;";
	logo.style.position = "absolute";
	
	
	logo.style.left = (w-350) + "px";
	logo.style.top = (h -90) + "px";
	
	logo.style.height = "50px";
	logo.style.border = "solid 10px #fff";
	logo.style.fontFamily = "Verdana";
	logo.style.fontSize = "40px";
	logo.style.color = "#fff";
	logo.style.zIndex = 20;
	logo.style.cursor = "default";
	logo.addEventListener("click",function() {
		History.go("#home");
	});
	
	var codemirror_div = origin_lt_container.elementNew("codemirror_textarea","div");
	codemirror_div.style.position = "absolute";
	codemirror_div.style.left = "0px";
	codemirror_div.style.top = "0px";
	codemirror_div.style.width = "10px";
	codemirror_div.style.height = "10px";
	codemirror_div.style.border = "solid 1px #000";
	
	console.log("editor cm");
	// Define an extended mixed-mode that understands vbscript and
	// leaves mustache/handlebars embedded templates in html mode
	var mixedMode = {
		name: "htmlmixed",
		scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
				   mode: null}]
	};
	var cm = CodeMirror(codemirror_div, {
		value: "<!doctype html>\r\n<html>\r\n\t<head>\r\n\t\t<" + "script>\r\n\t\t\tfunction main(){\r\n\t\t\t\tconsole.log(\"Hello World!\");\r\n\t\t\t\treturn 1;\r\n\t\t\t}\r\n\t\t</" + "script>\r\n\t</head>\r\n</html>",
		lineNumbers: true,
		mode: mixedMode,
		extraKeys: {
			"F11": function(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			},
			"Ctrl-S" : function(cm) {
				console.log("in save");
				var filepath = window.localStorage.getItem("history.editor.filepath");
				if(filepath!=null&&filepath!="") {
					var data = cm.getValue("\r\n");
					console.log("data to write:");
					
					kernel.editorWrite(data);
					console.log("saved");
				}
			}
		}
	});
	kernel.editorSet(cm);
	console.log("editor set");
	cm.setSize(w - 350-3-20,h-1);
	
	
	// may use clipboard
	var str = window.localStorage.getItem("history.editor.value");
	if(str!="" && str != null) {
		cm.setValue(str);
		UI.Body.consoleHide();
	}
	window.localStorage.setItem("history.editor.value","");
	
	cm.focus();
	
	
	//cm.commands.save = function() { alert("SAVE"); };
	
	
	
	
	UI.Window.on("resize",function() {
		console.log("window resize");
		var w = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
		h = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
		
		cm.setSize(w - 350-3-20,h-1);
		
	
		logo.style.left = (w-350) + "px";
		logo.style.top = (h -90) + "px";
		
		origin_lt.style.width = w + "px";
		origin_lt.style.height = h + "px";
	
	});
});