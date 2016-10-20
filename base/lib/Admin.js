var REQUIRE = require;
var app = {
	commands : {
		load : function(name,path) {
			if( name in this.libs && path == this.info[name].path ) {
				return this.libs[name];
			} else {
				if(name in this.libs) {
					throw "lib override";
				}
				
				this.libs[ name ] = REQUIRE(path);
				this.info[ name ] = {
					path : path,
					data : new Date()
				};
				return this.libs[name];
			}
		},
		get : function(name) {
			if( name in this.libs) {
				return this.libs[name];
			}
			return null;
		},
		isLoaded : function(name) {
			return (name in this.libs);
		},
		loadedList : function() {
			var arr = [];
			for(var name in this.libs) {
				arr.push(name);
			}
			return arr;
		},
		history : function() {
			return this.history;
		}
	},
	libs : {},
	info : {},
	history : []
};

function Admin(options) {
		var topArgs = [];
		for(var x = 0; x < arguments.length;x++) {
			topArgs.push(arguments[x]);
		}
		app.history.push( topArgs );
		for(var key in options) {
			if(key == "cmd") {
				if( options.cmd in app.commands) {
					var args = [];
					for(var x = 1; x < arguments.length;x++) {
						args.push(arguments[x]);
					}
					return app.commands[ options.cmd ].apply(app,args);
				}
			}
		}
		return null;
}

module.exports = Admin;