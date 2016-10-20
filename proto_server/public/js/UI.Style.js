

Class.define("UI.Style", { 
	from : ["WithEvents"]
	, ctor:function() {
		// myStyle.insertRule("#blanc { color: white }", 0);
		// myStyles.deleteRule(0);
		this.internal["UI.Style"].dict = {};
		
		this.el = document.createElement("style");
		this.el.appendChild(document.createTextNode(""));
		document.head.appendChild(this.el);
		this.sheet = this.el.sheet;
	}
	, proto: {
		printList : function() {
			// gather all stylesheets into an array
			//console.log("STYLES:");
			var ss = document.styleSheets;
			// loop through the stylesheets
			for (var i = 0; i < ss.length; ++i) {
				// loop through all the rules
				for (var j = 0; j < ss[i].cssRules.length; ++j) {
					//console.log( ss[i].cssRules[j].cssText);
				}
			}
		},
		create : function(name,rule) {
			//console.log(this.sheet);
			if(rule==undefined || rule == null) {
				if(Type.isArray(name)) {
					rule = name;
					for(var x = 0; x < rule.length;x++) {
						this.sheet.insertRule(rule[x],0);
						for(var key in this.internal["UI.Style"].dict ) {
							this.internal["UI.Style"].dict[key] += 1;
						}
					}
				} else {
					rule = name;
					var rule2 = this.sheet.insertRule(rule,0);
					for(var key in this.internal["UI.Style"].dict ) {
						this.internal["UI.Style"].dict[key] += 1;
					}
				}
			} else {
				var rule2 = this.sheet.insertRule(rule,0);
				for(var key in this.internal["UI.Style"].dict ) {
					this.internal["UI.Style"].dict[key] += 1;
				}
				this.internal["UI.Style"].dict[ name ] = 0;
				//this.internal["UI.Style"].dict[ name ] = 0;
			}
			
		},
		get : function(name) {
		
		},
		set : function(name) {
		
		},
		remove : function(name) {
			var sel = -1;
			for(var k in this.internal["UI.Style"].dict) {
				if(name == k) {
					sel = this.internal["UI.Style"].dict[k];
					break;
				}
			}
			if(sel != -1) {
				for(var k in this.internal["UI.Style"].dict) {	
					if( this.internal["UI.Style"].dict[k] >= sel) {
						this.internal["UI.Style"].dict[k] -= 1;
					}
				}
			}
			//console.log(sel,this.internal["UI.Style"].dict[ name ]);
			this.sheet.deleteRule( this.internal["UI.Style"].dict[ name ]+1 );
			
		},
		find_keyframe : function(rule) {
			// gather all stylesheets into an array
			var ss = document.styleSheets;
			// loop through the stylesheets
			for (var i = 0; i < ss.length; ++i) {
				// loop through all the rules
				for (var j = 0; j < ss[i].cssRules.length; ++j) {
					// find the -webkit-keyframe rule whose name matches our passed over parameter and return that rule
					if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule)
						return ss[i].cssRules[j];
				}
			}
			// rule not found
			return null;
		}
	}
});