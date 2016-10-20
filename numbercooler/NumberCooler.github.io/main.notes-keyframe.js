var selection_start_backup = document.onselectstart;
Router.addPage({name:"notes-keyframe",template:"base"},function(args, template, router) {
	// notes2
	
	document.onselectstart = function() { return false; };
	
	var $ = BrowserTools.setStyle;
	var $$ = BrowserTools.arraySetStyle;
	var rollover = BrowserTools.inoutStyle;
	
	function curry(f,a,b) { var _a = a, _b = b; return function(target) { f.apply(target,[a,b]); }; }
	
	var origin_lt_container = template.Container().elementGetContents("origin_lt");
	var origin_lt = template.Container().elementGet("origin_lt");
	origin_lt_container.elementsClear();
	
	console.log("KEYFRAME");
	
	function reset() {
		var settings = localStorage.getItem("index.bind.document");
		if(!settings) {
			localStorage.setItem("index.bind.document",JSONTools.pretty_stringify({ // define boot
				screen : "boot"
			}));
			settings = localStorage.getItem("index.notes-keyframe.settings");
		}
		settings = JSON.parse(settings);
		if( settings.screen == "bind" ) {
			console.log("parsing bind");
			// { input : << textarea >> output : name  }
			console.log(settings);
			
			
		}
	}
	UI.Window.on("message",function(event) {
		$(origin_lt,{
			position : "absolute",
			width : 100,
			height : 100,
			backgroundColor : "#f00"
		});
		console.log("MESSAGE RECEIVED");
		console.log( event.origin , event.data);
		if(event.data == "reload") {
			reset();
		}
		// reset
		return true;
		// reply
		//event.source.postMessage("hi there yourself!  the secret response " + "is: rheeeeet!", event.origin);
	},false);

},function() {
	document.onselectstart = selection_start_backup;
});