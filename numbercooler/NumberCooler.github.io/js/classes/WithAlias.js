Class.define("WithAlias",{
	from : ["WithEvents"]
	, ctor :function() { // map reduce requires event tracking, so this is alpha
		this.internal.WithAlias.data = {};
	}
	, proto : {
		varEach : function(map) {
			for(var key in this.internal.WithAlias.data) {
				this.internal.WithAlias.data[key] = map(key,this.internal.WithAlias.data[key]);
			}
		},
		varKeys : function(map) {
			for(var key in this.internal.WithAlias.data) {
				map(key);
			}
		},
		varValues : function(map) {
			for(var key in this.internal.WithAlias.data) {
				map(this.internal.WithAlias.data[key]);
			}
		},
		varSet : function(key,value) {
			this.internal.WithAlias.data[key] = value;
		},
		varExists : function(key) {
			if( key in this.internal.WithAlias.data ) return true;
			return false;
		},
		varGet : function(key) {
			if( key in this.internal.WithAlias.data ) {
				return this.internal.WithAlias.data[key];
			} else {
				return null;
			}
		},
		varRename : function(oldkey,newkey) {
			if( oldkey in this.internal.WithAlias.data ) {
				if( newkey in this.internal.WithAlias.data ) {
					return false;
				} else {
					this.internal.WithAlias.data[newkey] = this.internal.WithAlias.data[oldkey];
					this.varUnset(oldkey);
					this.emit("varRename",[oldkey,newkey]);
					return true;
				}
			} else {
				return false;
			}
		},
		varUnset : function(key) {
			if( key in this.internal.WithAlias.data) {
				this.internal.WithAlias.data[key] = null;
				delete this.internal.WithAlias.data[key];
			}
		},
		varClear : function() {
			var keys = [];
			for(var key in this.internal.WithAlias.data)
				keys.push(key);
			while(keys.length>0) {
				var key = keys.pop();
				this.internal.WithAlias.data[key] = null;
				delete this.internal.WithAlias.data[key];
			}
			
		}
	}
});