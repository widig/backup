

Class.define("WithDOMNode", {
	from : ["WithArray","WithAlias"]
	,ctor : function() {
		this.internal.WithDOMNode.parent = null;
	},
	proto : {
		nodeBuild : function(target) {
			//console.log("NODE BUILD??");
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
					throw "WithDOMNode.elementSetParent parent already defined";
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