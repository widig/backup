Browser = (function() {
	function CustomInfo() {};
	var _ua = navigator.userAgent.toLowerCase(), _v = navigator.vendor, _p = navigator.platform, vs = "version";
	var db = [
		{ s: _ua, 		ss: "chrome", 	i: "chrome" },
		{ s: _ua, 		ss: "omniweb", 	i: "omniweb", 	vs: "omniweb" },
		{ s: _v, 		ss: "apple", 	i: "safari", 	vs: "version" },
		{ prop: window.opera, 			i: "opera", 	vs: "version" },
		{ s: _v, 		ss: "icab", 	i: "iCab" },
		{ s: _v, 		ss: "kde", 	i: "konqueror" },
		{ s: _ua, 		ss: "firefox", 	i: "firefox" },
		{ s: _v, 		ss: "camino", 	i: "camino" },
		{ s: _ua, 		ss: "netscape", i: "netscape" },
		{ s: _ua, 		ss: "msie", 	i: "explorer", 	vs: "msie" },
		{ s: _ua, 		ss: "gecko", 	i: "mozilla", 	vs: "rv" },
		{ s: _ua, 		ss: "mozilla", 	i: "netscape", 	vs: "mozilla" }
	];
	var dos = [
		{ s: _ua, 		ss: "ipod", 	i: "osx" },
		{ s: _ua, 		ss: "iphone", 	i: "osx" },
		{ s: _ua, 		ss: "ipad", 	i: "osx" },
		{ s: _p, 		ss: "win", 	i: "windows" },
		{ s: _p, 		ss: "mac", 	i: "osx" },
		{ s: _p, 		ss: "linux", 	i: "linux" },
		{ s: _ua, 		ss: "android", 	i: "linux" },
		{ s: _ua, 		ss: "froyo", 	i: "linux" },
		{ s: _ua, 		ss: "ginger", 	i: "linux" },
		{ s: _ua, 		ss: "icecream", 	i: "linux" }
	];
	var ddv = [
		{ s: _ua, 		ss: "(playbook", 	i: "blackberry" },
		{ s: _ua, 		ss: "(bb10", 	i: "blackberry" },
		{ s: _ua, 		ss: "nexus", 	i: "nexus" },
		{ s: _ua, 		ss: "sprint", 	i: "htc" },
		{ s: _ua, 		ss: "symbianOS", 	i: "nokia" },
		{ s: _ua, 		ss: "sony", 	i: "sony" },
		{ s: _ua, 		ss: "lg", 	i: "lg" },
		{ s: _ua, 		ss: "samsung", 	i: "samsung" },
		{ s: _ua, 		ss: "ipod", 	i: "apple" },
		{ s: _ua, 		ss: "ipad", 	i: "apple" },
	];
	var r = new CustomInfo;
	r.s1 = function(arr) {
		for (var i = 0; i < arr.length; i++) {
			var ds = arr[i].s, dp = arr[i].prop;
			r.vss = arr[i].vs || arr[i].i;
			if (ds) { if (ds.indexOf(arr[i].ss) != -1) return arr[i].i; }
			else if (dp) return arr[i].i;
		}
	}
	r.s2 = function(arg) {
		var index = arg.indexOf(r.vss); if (index == -1) return; 
		return parseFloat(arg.substring(index + r.vss.length + 1));
	};
	r.init = function () {
		r.name = r.s1(db) || "An unknown browser";
		r[vs] = r.s2(_ua) || r.s2(navigator.appVersion) || "an unknown version";
		r.OS = r.s1(dos) || "an unknown OS";
		r.device = r.s1(ddv) || "unkown device";
		r.touchEnabled = (function () { return !!('ontouchstart' in window); })();
		r.webkit = /webkit\//i.test(_ua);
		r.gecko = /gecko\//i.test(_ua);
		r.trident = /trident\//i.test(_ua);
		r.presto = /presto\//i.test(_ua);
		r.chrome = (r.name=="Chrome");
		r.firefox = (r.name=="Firefox");
		r.ie = (r.name == "Explorer");
		r.ie9 = r.ie && (r[vs] == 9); r.ie8 = r.ie && (r[vs] == 8); r.ie7 = r.ie && (r[vs] == 7); r.ie6 = r.ie && (r[vs] == 6);
		r.ff = (r.name == "Firefox");
		r.safari = (r.name == "Safari");
		r.opera = (r.name == "Opera");
		r.lang = (window.navigator.userLanguage || window.navigator.language);
		r.variavel = true;
		console.log("language:",r.lang);
	}
	r.init();
	
	delete r.s1;
	delete r.s2;
	delete r.init;
	return r;
})();