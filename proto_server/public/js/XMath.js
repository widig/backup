
var nodejs = false;
if (typeof module !== 'undefined' && module.exports) {
	require("../Class.js");
	nodejs = true;
}


Class.define("XMath",{ 
	ctor : function(format) {
		this.internal.XMath.format = format;
	},
	proto : {
		V3 : function(a,b,c) {
			var self = this.internal.XMath;
			return Class.create("XMath.V3",{"XMath.V3":[self.format,a,b,c]});
		},
		V3Array : function(options) { // options are : mean, normalized, ...
			var arr = Class.create("XMath.V3Array", { "XMath.V3Array" : [ this.internal.XMath.format,options ] });
			/* 
				usage:
				arr.on("load",function(pt) { });
			*/
			return arr;
		},
		M4 : function() {
			var self = this.internal.XMath;
			return Class.create("XMath.M4",{ "XMath.M4": [self.format] });
		}
	}
});


XMath = Class.create("XMath",{ "XMath" : ["Float32Array"] });



if (nodejs) {
	
	global.XMath = XMath;
}


