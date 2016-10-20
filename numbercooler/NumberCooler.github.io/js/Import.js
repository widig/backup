
function localServer(opt) {
	if(!(this instanceof localServer)) {
		// static
	} else {
		// instance
		localServer.register(opt,this);
	}
}
localServer.register = function(opt,instance) {
	/*
		name
		port
		path
		callback
	*/
	if(!("name" in instance)) {
		instance.name = opt.name;
	}
	if(!("port" in instance)) {
		instance.port = opt.port;
	}
	if(!("paths" in instance)) {
		instance.paths = {
			get : {},
			post : {},
			put : {}
		};
	}
	if("method" in opt && "path" in opt && "callback" in opt) {
		instance.paths[ opt.method ][ opt.path ] = opt.callback;
	}
	// internet is not that fast. its just counting mocks. (future words)
	// hello from the other side.
	// where is my money?
	// event 3? dont know.
	
}
localServer.find = function(url) {

}

function ImportInstanceHeader() {
	this.url = "";
	this.method = "get";
	this.data = {};
	this.json = false;
	this.headers = [];
};
ImportInstanceHeader.prototype.formatArguments = function() {
	var arr = [], str;
	for(var name in this.data) {
		arr.push(name + '=' + encodeURIComponent(this.data[name]));
	}
	str = arr.join('&');
	if(str != '') {
		return this.method == "get" ? 
			(this.url.indexOf('?') < 0 ? '?' + str : '&' + str) : 
			str;
	}
	return '';
}
function Import(opt) {
	if(!( this instanceof Import )) return new Import(opt);
	this.host = {};
	this.doneCallback = null;
	this.failCallback = null;
	this.xhr = null;
	this.info = new ImportInstanceHeader;
	if(Object.prototype.toString.apply(opt)=="[object String]") {
		this.info.url = opt;
	}
	if(Object.prototype.toString.apply(opt)=="[object Object]") {
		if("url" in opt) this.info.url = opt.url;
		if("method" in opt) this.info.method = opt.method;
		if("data" in opt) this.info.data = opt.data;
		if("json" in opt) this.info.json = opt.json;
	}
}
Import.prototype.done = function(callback) { this.doneCallback = callback; return this; };
Import.prototype.fail = function(callback) { this.failCallback = callback; return this; };
Import.prototype.always = function(callback) { this.alwaysCallback = callback; return this; };
Import.prototype.setHeaders = function(headers) {
	this.info.headers = headers;
	for(var name in this.info.headers) { this.xhr && this.xhr.setRequestHeader(name, this.info.headers[name]); }
	return this;
};
Import.prototype.send = function() {
	if(this.info.url.indexOf("localServer://")==0) {// mock server (GET)
		// find local servers
		
		// set callbacks for the request instance
		
		// set parameters of request
		
		// get localstorage data associated to url and send to worker, wait for response
		
		
	} else {
		var self = this;
		if(window.ActiveXObject) { 
			this.xhr = new ActiveXObject('Microsoft.XMLHTTP'); 
		} else if(window.XMLHttpRequest) { 
			this.xhr = new XMLHttpRequest();
		}
		if(!this.xhr) throw "xhr can't initiate.";
		this.xhr.onreadystatechange = function() {
			if(self.xhr.readyState == 4 && self.xhr.status == 200) {
				var result = self.xhr.responseText;
				if(self.info.json === true && typeof JSON != 'undefined') {
					result = JSON.parse(result);
				}
				self.doneCallback && self.doneCallback.apply(self.host, [result, self.info]);
			} else if(self.xhr.readyState == 4) {
				self.failCallback && self.failCallback.apply(self.host, [self.info]);
			}
			self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.info]);
		}
		if(this.info.method == 'get') {
			this.xhr.open("GET", this.info.url + this.info.formatArguments(), true);
		} else if(this.info.method=="post"){
			this.xhr.open("POST", this.info.url, true);
			this.setHeaders({
				'X-Requested-With': 'XMLHttpRequest',
				'Content-type': 'application/x-www-form-urlencoded'
			});
		} else {
			this.xhr.open("GET", this.info.url + this.info.formatArguments(), true);
		}
		if(this.info.headers && typeof this.info.headers == 'object') {
			for(var name in this.info.headers) this.xhr && this.xhr.setRequestHeader(name, this.info.headers[name]);
		}
		if(this.info.method=="post") {
			self.xhr.send(this.info.formatArguments());
		} else {
			self.xhr.send();
		}
		return this;
	}
};
function ImportList(import_arr) {
	if(!( this instanceof ImportList )) return new ImportList(import_arr);
	this.fetch = import_arr;
	this.complete = false;
	this.data = [];
}
ImportList.prototype.done = function(callback) { this.doneCallback = callback; return this; };
ImportList.prototype.fail = function(callback) { this.failCallback = callback; return this; };
ImportList.prototype.always = function(callback) { this.alwaysCallback = callback; return this; };
ImportList.prototype.send = function() {
	
	//console.log("@@@@@@@@ IMPORT LIST SEND");
	var self = this;
	var _done = function(x,a,b) {
		//console.log("@@@@@@@@ IMPORT LIST RECEIVE");
		self.data[x].result = a;
		self.data[x].info = b;
		self.data[x].state |= 1;
		
		var check = false;
		var allok = true;
		var results = [];
		var infos = [];
		for(var _x = 0; _x < self.data.length; _x++) {
			//console.log("        x:",_x,self.data.length,self.data[_x].state);
			if( (self.data[_x].state & 0x1) == 0) {
				//console.log("break");
				check = true;
				break;
			} else {
				if( (self.data[_x].state & 0x2) != 0 ) {
					allok = false;
					results.push("");
					infos.push( self.data[_x].info );
				} else {
					results.push( self.data[_x].result );
					infos.push( self.data[_x].info );
				}
			}
			
		}
		
		if(!check) {
			if(allok) {
				self.doneCallback&&self.doneCallback.apply({},[results,infos]);
			} else {
				self.failCallback&&self.failCallback.apply({},[infos]);
			}
			self.alwaysCallback&&self.alwaysCallback.apply({},[infos]);
		}
		
	}
	var _fail = function(x,a) {
		//console.log("XHR FAIL:",a.url);
		self.data[x].info = a;
		self.data[x].state |= 2;
		
	}
	var _always = function(x,a) {
		
		self.data[x].info = a;
		self.data[x].state |= 4;
		//console.log("@@@@@@@@ IMPORT LIST ALWAYS",self.data[x].state);
		
			
	}
	
	var create_item = function(x,import_arr) {
		return { 
			state : 0,
			result : "",
			info : null,
			target : Import(import_arr[x])
				.done(function(a,b) {
					_done(x,a,b)
				})
				.fail(function(a,b) {
					_fail(x,a)
				})
				.always(function(a,b) {
					_always(x,a)
				})
		};
	}
	
	for(var x = 0; x < this.fetch.length;x++) {
		var item = create_item(x,this.fetch);
		if("headers" in this.fetch[x]) item.target.setHeaders(this.fetch[x].headers);
		this.data.push(item);
	}
	for(var x = 0; x < this.fetch.length;x++) {
		this.data[x].target.send();
	}
}
function Export(opt) {
	if(!( this instanceof Export )) return new Export(opt);
	this.host = {};
	this.doneCallback = null;
	this.failCallback = null;
	this.xhr = null;
	this.info = new ImportInstanceHeader;
	if(Object.prototype.toString.apply(opt)=="[object String]") {
		this.info.url = opt;
	}
	if(Object.prototype.toString.apply(opt)=="[object Object]") {
		if("url" in opt) this.info.url = opt.url;
		if("method" in opt) this.info.method = opt.method;
		if("data" in opt) this.info.data = opt.data;
		if("json" in opt) this.info.json = opt.json;
	}
}
Export.prototype.done = function(callback) { this.doneCallback = callback; return this; };
Export.prototype.fail = function(callback) { this.failCallback = callback; return this; };
Export.prototype.always = function(callback) { this.alwaysCallback = callback; return this; };
Export.prototype.setHeaders = function(headers) {
	this.info.headers = headers;
	for(var name in this.info.headers) { this.xhr && this.xhr.setRequestHeader(name, this.info.headers[name]); }
	return this;
};
Export.prototype.send = function() {
	if(this.info.url.indexOf("localServer://") == 0) { // mock server (PUT)
		// find local servers
		
		// set callbacks for the request instance
		
		// set parameters of request
		
		// get localstorage data associated to url and send to worker, wait for response
		
		return this;
	} else { 
		var self = this;
		if(window.ActiveXObject) { 
			this.xhr = new ActiveXObject('Microsoft.XMLHTTP'); 
		} else if(window.XMLHttpRequest) { 
			this.xhr = new XMLHttpRequest();
		}
		if(!this.xhr) throw "xhr can't initiate.";
		this.xhr.onreadystatechange = function() {
			if(self.xhr.readyState == 4 && self.xhr.status == 200) {
				var result = self.xhr.responseText;
				if(self.info.json === true && typeof JSON != 'undefined') {
					result = JSON.parse(result);
				}
				self.doneCallback && self.doneCallback.apply(self.host, [result, self.info]);
			} else if(self.xhr.readyState == 4) {
				self.failCallback && self.failCallback.apply(self.host, [self.info]);
			}
			self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.info]);
		}
		if(this.info.method == 'put') {
			this.xhr.open("PUT", this.info.url + this.info.formatArguments(), true);
		} else if(this.info.method=="post"){
			this.xhr.open("POST", this.info.url, true);
			this.setHeaders({
				'X-Requested-With': 'XMLHttpRequest',
				'Content-type': 'application/x-www-form-urlencoded'
			});
		} else {
			this.xhr.open("PUT", this.info.url + this.info.formatArguments(), true);
		}
		if(this.info.headers && typeof this.info.headers == 'object') {
			for(var name in this.info.headers) this.xhr && this.xhr.setRequestHeader(name, this.info.headers[name]);
		}
		if(this.info.method=="post") {
			self.xhr.send(this.info.formatArguments());
		} else {
			self.xhr.send();
		}
		return this;
	}
}