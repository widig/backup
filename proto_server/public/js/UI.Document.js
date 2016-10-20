


Class.define("UI.Document", { 
	from : ["WithEvents"]
	, ctor : function() {
		var self = this.internal["UI.Document"];
		self.data = document;
		this.on("on", function(event,callback) {
			//console.log("set visibility change event");
			self.data.addEventListener(event,callback);
			return true;
		});
		this.on("off",function(event,callback) {
			self.data.removeEventListener(event,callback);
			return true;
		});
	}
	, proto : {
		get : function() {
			var self = this.internal["UI.Document"];
			return self.data;
		}
	}
});
