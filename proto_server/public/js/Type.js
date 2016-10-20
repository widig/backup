/*
	Type
*/

function TypeInstance() { 
	this.name="";this.raw="";this.primitive=false;
	this.object=false;this.dom=false;this.reference=false; 
}
Type = (function() {
	var ar = ["Boolean]","String]","Number]","Array]","Object]","RegExp]","Date]"
		,"Function]","Error]","Event]","MouseEvent]","KeyboardEvent]","global]"],
		f = Object.prototype.toString, s = "[object ";
	Type = function() {
		if(arguments.length==0) throw "must pass something";
		var ret = new TypeInstance(), a = arguments[0];
		if (a==undefined||a==null) { ret.name = "undefined"; ret.primitive = true; return ret; }
		var str = f.call(a);
		ret.raw = str;
		if (a != undefined && a != null && typeof(a) == typeof({}) && "tagName" in a) {
			var tag = a.tagName.toString().toLowerCase();
			ret.object = true; ret.dom = true; ret.name = "html_" + tag;
			return ret;
		} else for(var x = 0; x < ar.length;x++) {
			if(str == (s+ar[x])) {
				var n = ar[x].substring(0,ar[x].length-1);
				ret[n] = true; ret.name = n; ret.primitive = true;
				return ret;
			}
		}
		console.log("Unkown Type:"+str);
		return ret;
	};
	var t = Type, f0 = function(g) { return function(val) { return f.apply(val) == (s+g); } };
	t.isBoolean = f0(ar[0]); t.isString = f0(ar[1]);
	t.isNumber = f0(ar[2]); t.isArray = f0(ar[3]); 
	t.isObject = f0(ar[4]);t.isRegExp = f0(ar[5]);
	t.isDate = f0(ar[6]); t.isFunction = f0(ar[7]);
	t.isError = f0(ar[8]);
	return t;
	
	/*
	mit license
	Copyright (C) 2013 Feross Aboukhadijeh & Romain Beauxis.
	https://github.com/feross/ieee754
	*/
	ieee754 = {};
	ieee754.read = function (buffer, offset, isLE, mLen, nBytes) {
		var e, m
		var eLen = nBytes * 8 - mLen - 1
		var eMax = (1 << eLen) - 1
		var eBias = eMax >> 1
		var nBits = -7
		var i = isLE ? (nBytes - 1) : 0
		var d = isLE ? -1 : 1
		var s = buffer[offset + i]
		i += d
		e = s & ((1 << (-nBits)) - 1)
		s >>= (-nBits)
		nBits += eLen
		for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
		m = e & ((1 << (-nBits)) - 1)
		e >>= (-nBits)
		nBits += mLen
		for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
		if (e === 0) {
			e = 1 - eBias
		} else if (e === eMax) {
			return m ? NaN : ((s ? -1 : 1) * Infinity)
		} else {
			m = m + Math.pow(2, mLen)
			e = e - eBias
		}
		return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	ieee754.write = function (buffer, value, offset, isLE, mLen, nBytes) {
		var e, m, c
		var eLen = nBytes * 8 - mLen - 1
		var eMax = (1 << eLen) - 1
		var eBias = eMax >> 1
		var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
		var i = isLE ? 0 : (nBytes - 1)
		var d = isLE ? 1 : -1
		var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
		value = Math.abs(value)
		if (isNaN(value) || value === Infinity) {
			m = isNaN(value) ? 1 : 0
			e = eMax
		} else {
			e = Math.floor(Math.log(value) / Math.LN2)
			if (value * (c = Math.pow(2, -e)) < 1) {
				e--
				c *= 2
			}
			if (e + eBias >= 1) {
				value += rt / c
			} else {
				value += rt * Math.pow(2, 1 - eBias)
			}
			if (value * c >= 2) {
				e++
				c /= 2
			}
			if (e + eBias >= eMax) {
				m = 0
				e = eMax
			} else if (e + eBias >= 1) {
				m = (value * c - 1) * Math.pow(2, mLen)
				e = e + eBias
			} else {
				m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
				e = 0
			}
		}
		for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
		e = (e << mLen) | m
		eLen += mLen
		for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
		buffer[offset + i - d] |= s * 128
	}
	
	'use strict'

	var base64 = {};
	base64.toByteArray = toByteArray
	base64.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	function init () {
		var i
		var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
		var len = code.length
		for (i = 0; i < len; i++) {
			lookup[i] = code[i]
		}
		for (i = 0; i < len; ++i) {
			revLookup[code.charCodeAt(i)] = i
		}
		revLookup['-'.charCodeAt(0)] = 62
		revLookup['_'.charCodeAt(0)] = 63
	}
	init()

	function toByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr
		var len = b64.length
		if (len % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}
		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(len * 3 / 4 - placeHolders)
		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? len - 4 : len
		var L = 0
		for (i = 0, j = 0; i < l; i += 4, j += 3) { // read ascii
			tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
			arr[L++] = (tmp & 0xFF0000) >> 16
			arr[L++] = (tmp & 0xFF00) >> 8
			arr[L++] = tmp & 0xFF
		}
		if (placeHolders === 2) {
			tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
			arr[L++] = tmp & 0xFF
		} else if (placeHolders === 1) {
			tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
			arr[L++] = (tmp >> 8) & 0xFF
			arr[L++] = tmp & 0xFF
		}
		return arr
	}

	function tripletToBase64 (num) {
		return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
		var tmp
		var output = []
		for (var i = start; i < end; i += 3) {
			tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output.push(tripletToBase64(tmp))
		}
		return output.join('')
	}

	function fromByteArray (uint8) {
		var tmp
		var len = uint8.length
		var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
		var output = ''
		var parts = []
		var maxChunkLength = 16383 // must be multiple of 3
		// go through the array every three bytes, we'll deal with trailing stuff later
		for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) { // read binary
			parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
		}
		// pad the end with zeros, but make sure to not forget the extra bytes
		if (extraBytes === 1) {
			tmp = uint8[len - 1]
			output += lookup[tmp >> 2]
			output += lookup[(tmp << 4) & 0x3F]
			output += '=='
		} else if (extraBytes === 2) {
			tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
			output += lookup[tmp >> 10]
			output += lookup[(tmp >> 4) & 0x3F]
			output += lookup[(tmp << 2) & 0x3F]
			output += '='
		}
		parts.push(output)
		return parts.join('')
	}
	
})();