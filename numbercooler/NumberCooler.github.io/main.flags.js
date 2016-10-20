


Router.addPage({name:"flags",template:"base"},function(args, template, router) {
	console.log("FLAGS");
	/*
	var kernel = Class.create("Kernel");
	if( !kernel.instance.loggedLocal() ) {
		History.go("#home");
		return;
	}
	*/
	var origin_lt_container = template.Container().elementGetContents("origin_lt"); 
	var origin_lt = template.Container().elementGet("origin_lt");
	var window_width = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
	window_height = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
	
	origin_lt.style.width = window_width + "px";
	origin_lt.style.height = window_height + "px";
	origin_lt.style.overflowX = "hidden";
	
	origin_lt_container.elementsClear();
	
	
	var p = origin_lt_container.elementNewPacket("\
		<div id=\"page_container\">\
			<div id=\"newFlagContainer\">\
				<table id=\"newFlagTable\">\
					<tr>\
						<td id=\"col1\"><span id=\"keyLabel\"></span><input id=\"newKey\" type=\"text\"/></td>\
						<td id=\"col2\"><span id=\"valueLabel\"></span><input id=\"newValue\" type=\"text\"/></td>\
					</tr>\
					<tr>\
						<td colspan=\"2\"></td>\
					</tr>\
					<tr>\
						<td></td><td id=\"addButton\"></td>\
					</tr>\
				</table>\
			</div>\
			<div id=\"listFlagContainer\">\
				<table id=\"listFlagTable\">\
				</table>\
			</div>\
		</div>\
	");
	
	function setStyle(target,style) { for(var key in style) { target.style[key] = style[key]; } }
	//p.el.addButton
	
	
	setStyle( p.el.page_container,{
		position : "absolute",
		left : (window_width/2 - 250)+"px",
		top : "10px"
	});
	
	
	p.el.newFlagTable.setAttribute("width","500");
	p.el.col1.setAttribute("width","50%");
	p.el.col2.setAttribute("width","50%");
	p.el.listFlagTable.setAttribute("width","500");
	
	// user customizations
	var flags = localStorage.getItem("flags");
	if(flags!=null)
		flags = JSON.parse(flags);
	else
		flags = {};
	
	
	function refresh() {
		var lt = p.$.listFlagTable;
		lt.elementsClear();
		
		var trHead = lt.elementNew("tr","tr");
		var tdKeyLabel = lt.elementGetContents("tr").elementNew("tdKeyLabel","td");
		tdKeyLabel.setAttribute("width","50%");
		tdKeyLabel.innerHTML = "key";
		var tdValueLabel = lt.elementGetContents("tr").elementNew("tdValueLabel","td");
		tdValueLabel.innerHTML = "value";
		tdValueLabel.setAttribute("width","50%");
		var lineCount = 0;
		for(var key in flags) {
			var tr = lt.elementNew("line_"+lineCount,"tr");
			var keyTd = lt.elementGetContents("line_"+lineCount).elementNew("key_" + lineCount,"td");
			var valueTd = lt.elementGetContents("line_"+lineCount).elementNew("key_" + lineCount,"td");
			keyTd.innerHTML = key;
			valueTd.innerHTML = flags[key];
			lineCount += 1;
		}
	}
	function save() {
		localStorage.setItem("flags",JSON.stringify(flags));
	}
	
	p.el.addButton.innerHTML = "add flag";
	setStyle(p.el.addButton,{
		fontFamily : "monospace",
		textAlign : "center",
		cursor : "default"
	});
	
	p.el.addButton.addEventListener("mouseover",function() {
		setStyle( p.el.addButton,{
			backgroundColor : "#888",
			color : "#fff"
		});
	});
	
	p.el.addButton.addEventListener("mouseout",function() {
		setStyle( p.el.addButton,{
			backgroundColor : "#fff",
			color : "#000"
		});
	});
	
	p.el.addButton.addEventListener("click",function() {
		var key = p.el.newKey.value;
		var value = p.el.newValue.value;
		p.el.newKey.value = "";
		p.el.newValue.value = "";
		flags[key] = value;
		save();
		refresh();
	});
	
	p.el.keyLabel.innerHTML = "key:";
	p.el.valueLabel.innerHTML = "value:";
	
	refresh();
	
	
	
	
});