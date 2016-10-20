

var nodejs = false;
if (typeof module !== 'undefined' && module.exports) {
	require("../Class.js");
	BigInteger = require("../jsbn.js");
	nodejs = true;
}

Class.define("XMath.V3",{ 
	from : ["WithEvents"]
	, ctor : function(type,a,b,c) {
		var names = {
									// index 
			"ArrayBuffer" : 0, 		// 0
			"DataView" : 1, 		// 1
			"Uint8Array" : 1, 		// 2
			"Uint16Array" : 2, 		// 3
			"Uint32Array" : 4, 		// 4
			"Int8Array" : 1, 		// 5
			"Int16Array" : 2, 		// 6
			"Int32Array" : 4, 		// 7
			"Float32Array" : 4, 	// 8
			"Float64Array" : 8, 	// 9
			//"BigInteger" : 0 		// 10 -> variable length
		};
		if(BigInteger) {
			names["BigInteger"] = 0;
		}
		this.type = type;
		a = a || 0;
		b = b || 0;
		c = c || 0;
		if(type=="BigInteger" && BigInteger) {
			this.data = [ new BigInteger(""+a,10),new BigInteger(""+b,10),new BigInteger(""+c,10) ];
		} else {
			
			if(nodejs) {
				if( type == "Float32Array") {
					this.data = new Float32Array(3*names[type]);
				} else if(type == "DataView") {
					this.data = new DataView(3*names[type]);
				}
				
				this.data[0] = a;
				this.data[1] = b;
				this.data[2] = c;
			
			} else {
				this.data = new window[type](
					new ArrayBuffer(3*names[type])
				);
				
				this.data[0] = a;
				this.data[1] = b;
				this.data[2] = c;
			
			}
			
		}
		this.emit("load",[this]);
		
		
		Object.defineProperty(this,"x",{ get : function() { return this.data[0]; }, set : function(val) { this.data[0] = val; } });
		Object.defineProperty(this,"y",{ get : function() { return this.data[1]; }, set : function(val) { this.data[1] = val; } });
		Object.defineProperty(this,"z",{ get : function() { return this.data[2]; }, set : function(val) { this.data[2] = val; } });
		
		
		if(type=="BigInteger") {
			
			throw "temporary not implemented";
			
			function bn_sqrt(bn) {
				var xk = new BigInteger("1",10);
				var last = xk;
				while(true) {
					xk = xk.add( bn.divide(xk) ).divide( new BigInteger("2",10) );
					if( xk.compareTo( last ) == 0) {
						break;
					}
					last = xk;
				}
				return xk;
			}
			this.scaleUp = function(n) {
				var str = ["1"];
				var x = 0;
				for(var x = 0; x < n;x++) str.push("0");
				var scale = new BigInteger(str.join(""),10);
				this.smul( scale );
				return scale;
			}
			this.scaleDown = function(n) {
				var str = ["1"];
				var x = 0;
				for(var x = 0; x < n;x++) str.push("0");
				var scale = new BigInteger(str.join(""),10);
				this.sdiv( scale );
				return scale;
			}
			
			this.sadd = function(s) {
				var m0 = this.data;
				m0[0] = m0[0].add(s);
				m0[1] = m0[1].add(s);
				m0[2] = m0[2].add(s);
				return this;
			}
			this.ssub = function(s) {
				var m0 = this.data;
				m0[0] = m0[0].subtract(s);
				m0[1] = m0[1].subtract(s);
				m0[2] = m0[2].subtract(s);
				return this;
			}
			
			this.smul = function(s) {
				var m0 = this.data;
				m0[0] = m0[0].multiply(s);
				m0[1] = m0[1].multiply(s);
				m0[2] = m0[2].multiply(s);
				return this;
			}
			
			this.sdiv = function(s) {
				var m0 = this.data;
				m0[0] = m0[0].divide(s);
				m0[1] = m0[1].divide(s);
				m0[2] = m0[2].divide(s);
				return this;
			}
			
			this.vadd = function(v) {
				var m0 = this.data;
				m0[0] = m0[0].add( v.data[0] );
				m0[1] = m0[0].add( v.data[1] );
				m0[2] = m0[0].add( v.data[2] );
				return this;
			}
			this.vsub = function(v) {
				var m0 =this.data;
				m0[0] = m0[0].subtract( v.data[0] )
				m0[1] = m0[1].subtract( v.data[1] );
				m0[2] = m0[2].subtract( v.data[2] );
				return this;
			}
			
			this.dot = function(v1) {
				var v0 = this.data;
				v1 = v1.data;
				return v0[0].multiply( v1[0] ).add( v0[1].multiply( v1[1] ) ).add( v0[2].multiply( v1[2] ) );
			}
			
			this.cross = function(v1) {
				var v0 = this.data;
				v1 = v1.data;
				var a = v0[1].multiply( v1[2] ).subtract( v0[2].multiply( v1[1] ) );
				var b = v0[0].negate().multiply( v1[2] ).add( v0[2].multiply( v1[0] ) );
				var c = v0[0].multiply( v1[1] ).subtract( v0[1].multiply( v1[0] ) );
				v0[0] = a, v0[1] = b, v0[2] = c;
				return this;
			}
			
			
			this.track = function(v1, sa, sb) {
				var v0 = this.data;
				v1 = v1.data;
				var a = sa.multiply( v0[0] ).add( sb.multiply( v1[0] ) ),
					b = sa.multiply( v0[1] ).add( sb.multiply( v1[1] ) ),
					c = sa.multiply( v0[2] ).add( sb.multiply( v1[2] ) );
				v0[0] = a, v0[1] = b, v0[2] = c;
				return this;
			}
			
			
			this.slerp = function(v1,s) {
				var v0 = this.data;
				v1 = v1.data;
				var a = v0[0].add( s.multiply(v1[0]) ),
					b = v0[1].add( s.multiply(v1[1]) ),
					c = v0[2].add( s.multiply(v1[2]) );
				v0[0] = a, v0[1] = b, v0[2] = c;
				return this;
			}
			
			this.mod = function() {
				var v = this.data;
				return bn_sqrt( v[0].multiply( v[0] ).add( v[1].multiply( v[1]) ).add( v[2].multiply( v[2] ) ) );
			}
			
			this.toArray  = function() {
				var v = this.data;
				return [ v[0], v[1], v[2] ];
			}
			
			this.vmul = function(m) {
				var v = this.data;
				var m = m.data;
				var x = v[0];
				var y = v[1];
				var z = v[2];
				// w is always 1 on Hamilton vector3 to quaternion
				v[0] = m[12].add( x.multiply(m[0]) ).add( y.multiply(m[4]) ).add( z.multiply( m[8] ) );
				v[1] = m[13].add( x.multiply(m[1]) ).add( y.multiply(m[5]) ).add( z.multiply( m[9] ) );
				v[2] = m[14].add( x.multiply(m[2]) ).add( y.multiply(m[6]) ).add( z.multiply( m[11] ) );
				var w = m[15].add( x.multiply(m[3]) ).add( y.multiply(m[7]) ).add( z.multiply(m[11]) );
				// (global scale)*1 + x*scale1 + y*scale2 + z*scale3
				if (w != 1 && w != 0) {
					v[0] = v[0].divide( w );
					v[1] = v[1].divide( w );
					v[2] = v[2].divide( w );
				}
				return this;
			}
			
			this.clone = function() {
				return Class.create("XMath.V3", { "XMath.V3" : [ this.type, this.data[0].toString(10), this.data[1].toString(10), this.data[2].toString(10) ] } );
			}
			
			this.toString = function(n) {
				n = n || 10;
				var str = [];
				var v = this.data;
				return "[" + v[0].toString(n) + "," + v[1].toString(n) + "," + v[2].toString(n) + "]";
			}
			this.valueOf = function() {
				var n = 10;
				var str = [];
				var v = this.data;
				return "[" + v[0].toString(n) + "," + v[1].toString(n) + "," + v[2].toString(n) + "]";
			}
			
		} else {
			this.shadeMode = false;
			this.name = "";
			
			this.setShaderMode = function(name) {
				this.shadeMode = true;
				this.name = name;
			}
			this.unsetShaderMode = function() {
				this.shadeMode = false;
				this.name = "[unbinded]";
			}
			
			this.vset = function(v) {
				if(this.shaderMode) this.emit("shader", [ "vset", [this.name,v.name] ]);
				var m0 = this.data;
				m0[0] = v.data[0];
				m0[1] = v.data[1];
				m0[2] = v.data[2];
				return this;
			}
			
			this.sset = function(a,b,c) {
				if(this.shaderMode) this.emit("shader", [ "sset", [this.name,a,b,c] ]);
				var m0 = this.data;
				m0[0] = a;
				m0[1] = b;
				m0[2] = c;
				return this;
			}
			this.sadd = function(s,t) {
				
				var m0 = this.data;
				if(t) {
					if(this.shaderMode) this.emit("shader", [ "sadd0", [this.name,t.name,s] ]);
					t.data[0] = m0[0] + s;
					t.data[1] = m0[1] + s;
					t.data[2] = m0[2] + s;
					return t;
				} else {
					if(this.shaderMode) this.emit("shader", [ "sadd1", [this.name,s] ]);
					m0[0] += s;
					m0[1] += s;
					m0[2] += s;
					return this;
				}
			}
			this.ssub = function(s,t) {
				var m0 = this.data;
				if(t) {
					if(this.shaderMode) this.emit("shader", [ "ssub0", [this.name,t.name,s] ]);
					t.data[0] = m0[0] - s;
					t.data[1] = m0[1] - s;
					t.data[2] = m0[2] - s;
					return t;
				} else {
					if(this.shaderMode) this.emit("shader", [ "ssub1", [this.name,s] ]);
					m0[0] -= s;
					m0[1] -= s;
					m0[2] -= s;
					return this;
				}
			}
			this.smul = function(s,t) {
				var m0 = this.data;
				if(t) {
					if(this.shaderMode) this.emit("shader", [ "smul0", [this.name,t.name,s] ]);
					t.data[0] = m0[0] * s;
					t.data[1] = m0[1] * s;
					t.data[2] = m0[2] * s;
					return t;
				} else {
					if(this.shaderMode) this.emit("shader", [ "smul1", [this.name,s] ]);
					m0[0] *= s;
					m0[1] *= s;
					m0[2] *= s;
					return this;
				}
			}
			this.sdiv = function(s,t) {
				var m0 = this.data;
				if(t) {
					if(this.shaderMode) this.emit("shader", [ "sdiv0", [this.name,t.name,s] ]);
					t.data[0] = m0[0] / s;
					t.data[1] = m0[1] / s;
					t.data[2] = m0[2] / s;
					return t;
				} else {
					if(this.shaderMode) this.emit("shader", [ "sdiv1", [this.name,s] ]);
					m0[0] /= s;
					m0[1] /= s;
					m0[2] /= s;
					return this;
				}
			}
			
			this.vadd = function(v,t) {
				var m0 =this.data;
				if(t) {
					if(this.shaderMode) this.emit("shader", [ "vadd0", [this.name,v.name,t.name] ]);
					t.data[0] = m0[0] + v.data[0];
					t.data[1] = m0[1] + v.data[1];
					t.data[2] = m0[2] + v.data[2];
					return t;
				} else {
					if(this.shaderMode) this.emit("shader", [ "vadd1", [this.name,v.name] ]);
					m0[0] += v.data[0];
					m0[1] += v.data[1];
					m0[2] += v.data[2];
					return this;
				}
			}
			this.vsub = function(v,t) {
				var m0 =this.data;
				if(t) {
					if(this.shaderMode) this.emit("shader", [ "vsub0", [this.name,v.name,t.name] ]);
					t.data[0] = m0[0] - v.data[0];
					t.data[1] = m0[1] - v.data[1];
					t.data[2] = m0[2] - v.data[2];
					return t;
				} else {
					if(this.shaderMode) this.emit("shader", [ "vsub1", [this.name,v.name] ]);
					m0[0] -= v.data[0];
					m0[1] -= v.data[1];
					m0[2] -= v.data[2];
					return this;
				}
			}
			this.normalize = function(t) {
				var r = this.mod();
				var m0 = this.data;
				if(t) {
					if(this.shaderMode) this.emit("shader", [ "normalize0", [this.name,t.name] ]);
					t.data[0] = m0[0]/r;
					t.data[1] = m0[1]/r;
					t.data[2] = m0[2]/r;
					return t;
				} else {
					if(this.shaderMode) this.emit("shader", [ "normalize1", [this.name] ]);
					m0[0] = m0[0]/r;
					m0[1] = m0[1]/r;
					m0[2] = m0[2]/r;
					return this;
				}
			}
			this.dot = function(v1) {
				if(this.shaderMode) this.emit("shader", [ "dot", [this.name,v1.name] ]);
				var v0 = this.data;
				v1 = v1.data;
				return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
			}
			this.cross = function(v1,t) {
				if(this.shaderMode) this.emit("shader", [ "cross", [this.name,v1.name,t.name] ]);
				var v0 = this.data;
				v1 = v1.data;
				var a = v0[1] * v1[2] - v0[2] * v1[1];
				var b = - v0[0] * v1[2] + v0[2] * v1[0];
				var c = v0[0] * v1[1] - v0[1] * v1[0];
				
				if( t ) {
					t.data[0] = a;
					t.data[1] = b;
					t.data[2] = c;
					return t;
				} else {
					v0[0] = a, v0[1] = b, v0[2] = c;
					return this;
				}
			}
			
			this.track = function(v1, sa, sb,t) {
				
				var v0 = this.data;
				v1 = v1.data;
				var a = (sa * v0[0]) + (sb * v1[0]),
					b = (sa * v0[1]) + (sb * v1[1]),
					c = (sa * v0[2]) + (sb * v1[2]);
					
				if( t ) {
					if(this.shaderMode) this.emit("shader", [ "track0", [this.name,v1.name,sa,sb,t.name] ]);
					t.data[0] = a;
					t.data[1] = b;
					t.data[2] = c;
					return t;
				} else {
					if(this.shaderMode) this.emit("shader", [ "trackl", [this.name,v1.name,sa,sb] ]);
					v0[0] = a, v0[1] = b, v0[2] = c;
					return this;
				}
			}
			
			this.slerp = function(v1,s,t) {
				
				var v0 = this.data;
				v1 = v1.data;
				var a = (v0[0]) + (s * v1[0]),
					b = (v0[1]) + (s * v1[1]),
					c = (v0[2]) + (s * v1[2]);
				if(t) {
					if(this.shaderMode) this.emit("shader", [ "slerp0", [this.name,v1.name,s,t.name] ]);
					t.data[0] = a;
					t.data[1] = b;
					t.data[2] = c;
					return t;
				} else {
					if(this.shaderMode) this.emit("shader", [ "slerp1", [this.name,v1.name,s] ]);
					v0[0] = a, v0[1] = b, v0[2] = c;
					return this;
				}
			}
			
			this.mod = function(t) {
				if(this.shaderMode) this.emit("shader", [ "mod", [this.name,t.name] ]);
				var v = this.data;
				return Math.sqrt( v[0]*v[0] + v[1]*v[1]+v[2]*v[2] );
			}
			
			
			this.toArray  = function() {
				var v = this.data;
				return [ v[0], v[1], v[2] ];
			}
			this.toString = function() {
				var str = [];
				var v = this.data;
				return "[" + parseFloat(v[0]).toPrecision(3) + "," + parseFloat(v[1]).toPrecision(3) + "," + parseFloat(v[2]).toPrecision(3) + "]";
			}
			this.vmul = function(m,t) { // v*M
				
			
				// vector.vmul( rotation_matrix )
				
				var v = this.data;
				var m = m.data;
				var x = v[0];
				var y = v[1];
				var z = v[2];
				// w is always 1 on Hamilton vector3 to quaternion
				
				var a = m[12] + x * m[0] + y * m[4] + z * m[8];
				var b = m[13] + x * m[1] + y * m[5] + z * m[9];
				var c = m[14] + x * m[2] + y * m[6] + z * m[10];
				var w = m[15] + x * m[3] + y * m[7] + z * m[11]; // (global scale)*1 + x*scale1 + y*scale2 + z*scale3
				
				console.log("W:::",w);
				if(t) {
					if(this.shaderMode) this.emit("shader", [ "vmul0", [this.name,m.name,t.name] ]);
					
					t.data[0] = a;
					t.data[1] = b;
					t.data[2] = c;
					if(w != 1 && w != 0) {
						t.data[0] /= w;
						t.data[1] /= w;
						t.data[2] /= w;
					}
					return t;
				} else {
					if(this.shaderMode) this.emit("shader", [ "vmul1", [this.name,m.name] ]);
					v[0] = a;
					v[1] = b;
					v[2] = c;
					if (w != 1 && w != 0) {
						v[0] /= w;
						v[1] /= w;
						v[2] /= w;
					}
					return this;
				}
			}
			this.clone = function(t) {
				var v = Class.create("XMath.V3", { "XMath.V3" : [ this.type, this.data[0], this.data[1], this.data[2] ] } );
				if(this.shaderMode) this.emit("shader", [ "clone", [this.name,t.name] ]);
				return v;
			}
			this.vmulT = function(m,t) { // M4*v , transpose
				var v = this.data;
				var m = m.data;
				var x = v[0];
				var y = v[1];
				var z = v[2];
				var a = m[0] * x + m[1] * y + m[2] * z;
				var b = m[4] * x + m[5] * y + m[6] * z;
 				var c = m[8] * x + m[9] * y + m[10] * z;
				
				if(t) {
					if(this.shaderMode) this.emit("shader", [ "vmulT0", [this.name,m.name,t.name] ]);
					t.data[0] = a;
					t.data[0] = b;
					t.data[0] = c;
					return t;
				} else {
					if(this.shaderMode) this.emit("shader", [ "vmulT1", [this.name,m.name] ]);
					v[0] = a;
					v[1] = b;
					v[2] = c;
					return this;	
				}
				
			}
		}
		
		
		
	}
	, proto : {
		
	}
});
//console.log( XMath.V3(0,1,2).toString() );
Class.define("XMath.V3Array",{ 
	from : ["WithEvents","WithArray"],
	ctor : function(format,options) {
		var _arr = [];
		var _format = format;
		this.on("itemInputFilter",function(index,_old,_new) {
			if("mean" in options) {
				
			}
		});
		this.New = function(a,b,c) {
			var pt = Class.create("XMath.V3",{"XMath.V3":[_format,a,b,c]});
			this.itemPush(pt);
			return pt;
		}
		var _ops = {
			gt : function(pt,t,s) { return pt[t] > s; },
			lt : function(pt,t,s) { return pt[t] < s; },
			ge : function(pt,t,s) { return pt[t] >= s; },
			le : function(pt,t,s) { return pt[t] <= s; },
			eq : function(pt,t,s) { return pt[t] == s; }
		};
		this.Find = function(algorithm,options) {
			
			var _true = [3,15,255,65535,4294967295,18446744073709551615];
			var _false = 0;
			logic_n = function(op,arr) {
					var i = 0;
					var sel = 0;
					for(var x = arr.length-1; x >=0; x--) {
						sel = 0;
						for(var y = 0; y < _true.length;y++)
							if(arr[x] == _true[y]) { sel = y; break; }
						if(sel!=-1) {
							i |= (1 << ((arr.length-1)-x));
						}
					}
					return (op%((1<<(i+1))>>>0)) > ((( 1<<i)>>>0)-1) ?
						_true[sel] : _false;
			}
			/*
				algorithm is an object, op decode is awesome, is logicn
				available keys:
					xgt,xge,xlt,xle,xeq,
					ygt,yge,ylt,yle,yeq,
					zgt,zge,zlt,zle,zeq
			*/
			var arr = this.internal.WithArray.data;
			var ret = XMath.V3Array( this.options );
			var stack = [];
			for(var x = 0; x < arr.length;x++) {
				var check = false;
				for(var op in algorithm) {
					if( !isNaN(parseInt(op)) ) {
						stack.push( [ op, algorithm[op].b ] );
					} else { // x
						var op = stack.pop();
						check = !_ops[ op.substring(1,3) ]( arr[x], op.charAt(0), algorithm[op] );
						
						if( op[0]>=0 && op[0] < 16 ) {
							if( 15 != logic_n( op[0], [ op[1], check ? 15 : 0 ]) ) {
								break;
							}
						} else {
							// 3 or more arguments
							
							// to be done
							
							
						}
					}
				}
				if(!check) {
					ret.itemPush( arr[x] );
				}
			}
			throw "not ready";
			
		}
		
	}, proto : {
		
	}
});
Class.define("XMath.V4",{ 
	from : ["WithEvents"],
	ctor : function(type,a,b,c,d) {
		
		var names = {
									// index 
			"ArrayBuffer" : 0, 		// 0
			"DataView" : 1, 		// 1
			"Uint8Array" : 1, 		// 2
			"Uint16Array" : 2, 		// 3
			"Uint32Array" : 4, 		// 4
			"Int8Array" : 1, 		// 5
			"Int16Array" : 2, 		// 6
			"Int32Array" : 4, 		// 7
			"Float32Array" : 4, 	// 8
			"Float64Array" : 8, 	// 9
			//"BigInteger" : 0 		// 10 -> variable length
		};
		if(BigInteger) {
			names["BigInteger"] = 0;
		}
		this.type = type;
		a = a || 0;
		b = b || 0;
		c = c || 0;
		d = d || 1; // alpha = 1
		if(type=="BigInteger" && BigInteger) {
			this.data = [ new BigInteger(""+a,10),new BigInteger(""+b,10),new BigInteger(""+c,10),new BigInteger(""+c,10) ];
		} else {
			this.data = new window[type](
				new ArrayBuffer(4*names[type])
			);
			this.data[0] = a;
			this.data[1] = b;
			this.data[2] = c;
			this.data[3] = d;
		}
		this.emit("load",[this]);
		
		
		Object.defineProperty(this,"a",{ get : function() { return this.data[0]; }, set : function(val) { this.data[0] = val; } });
		Object.defineProperty(this,"b",{ get : function() { return this.data[1]; }, set : function(val) { this.data[1] = val; } });
		Object.defineProperty(this,"c",{ get : function() { return this.data[2]; }, set : function(val) { this.data[2] = val; } });
		Object.defineProperty(this,"d",{ get : function() { return this.data[3]; }, set : function(val) { this.data[2] = val; } });
		
		Object.defineProperty(this,"cr",{ get : function() { return this.data[0]; }, set : function(val) { this.data[0] = val; } });
		Object.defineProperty(this,"cg",{ get : function() { return this.data[1]; }, set : function(val) { this.data[1] = val; } });
		Object.defineProperty(this,"cb",{ get : function() { return this.data[2]; }, set : function(val) { this.data[2] = val; } });
		Object.defineProperty(this,"ca",{ get : function() { return this.data[3]; }, set : function(val) { this.data[3] = val; } });
		
		if(type=="BigInteger") {
			function bn_sqrt(bn) {
				var xk = new BigInteger("1",10);
				var last = xk;
				while(true) {
					xk = xk.add( bn.divide(xk) ).divide( new BigInteger("2",10) );
					if( xk.compareTo( last ) == 0) {
						break;
					}
					last = xk;
				}
				return xk;
			}
			
			
			
			this.sadd = function(s) {
				var m0 = this.data;
				m0[0] = m0[0].add(s);
				m0[1] = m0[1].add(s);
				m0[2] = m0[2].add(s);
				m0[3] = m0[3].add(s);
				return this;
			}
			this.ssub = function(s) {
				var m0 = this.data;
				m0[0] = m0[0].subtract(s);
				m0[1] = m0[1].subtract(s);
				m0[2] = m0[2].subtract(s);
				m0[3] = m0[3].subtract(s);
				return this;
			}
			
			this.smul = function(s) {
				var m0 = this.data;
				m0[0] = m0[0].multiply(s);
				m0[1] = m0[1].multiply(s);
				m0[2] = m0[2].multiply(s);
				m0[3] = m0[3].multiply(s);
				return this;
			}
			
			this.sdiv = function(s) {
				var m0 = this.data;
				m0[0] = m0[0].divide(s);
				m0[1] = m0[1].divide(s);
				m0[2] = m0[2].divide(s);
				m0[3] = m0[3].divide(s);
				return this;
			}
			
			this.vadd = function(v) {
				var m0 = this.data;
				m0[0] = m0[0].add( v.data[0] );
				m0[1] = m0[2].add( v.data[1] );
				m0[2] = m0[2].add( v.data[2] );
				m0[3] = m0[3].add( v.data[3] );
				return this;
			}
			this.vsub = function(v) {
				var m0 =this.data;
				m0[0] = m0[0].subtract( v.data[0] )
				m0[1] = m0[1].subtract( v.data[1] );
				m0[2] = m0[2].subtract( v.data[2] );
				m0[3] = m0[3].subtract( v.data[3] );
				return this;
			}
			
			this.dot = function(v1) {
				var v0 = this.data;
				v1 = v1.data;
				return v0[0].multiply( v1[0] )
					.add( v0[1].multiply( v1[1] ) )
					.add( v0[2].multiply( v1[2] ) )
					.add( v0[3].multiply( v1[3] ) );
			}
			
			this.cross = function(v1) {
				var v0 = this.data;
				v1 = v1.data;
				var a = v0[1]
					.multiply( v1[2] )
					.subtract( v0[2].multiply( v1[1] ) );
				var b = v0[0].negate().multiply( v1[2] )
					.add( v0[2].multiply( v1[0] ) );
				var c = v0[0].multiply( v1[1] )
					.subtract( v0[1].multiply( v1[0] ) );
				v0[0] = a, v0[1] = b, v0[2] = c;
				return this;
			}
			this.track = function(v1, sa, sb) {
				var v0 = this.data;
				v1 = v1.data;
				var a = sa.multiply( v0[0] )
					.add( sb.multiply( v1[0] ) ),
					b = sa.multiply( v0[1] )
					.add( sb.multiply( v1[1] ) ),
					c = sa.multiply( v0[2] )
					.add( sb.multiply( v1[2] ) );
					d = sa.multiply( v0[3] )
					.add( sb.multiply( v0[3] ) );
				v0[0] = a, v0[1] = b, v0[2] = c, v0[3] = d;
				return this;
			}
			
			this.slerp = function(v1,s) {
				var v0 = this.data;
				v1 = v1.data;
				var a = v0[0].add( s.multiply(v1[0]) ),
					b = v0[1].add( s.multiply(v1[1]) ),
					c = v0[2].add( s.multiply(v1[2]) ),
					d = v0[3].add( s.multiply(v1[3]) );
				v0[0] = a, v0[1] = b, v0[2] = c, v0[3] = d;
				return this;
			}
			
			this.mod = function() {
				var v = this.data;
				return bn_sqrt( v[0].multiply( v[0] ).add( v[1].multiply( v[1]) ).add( v[2].multiply( v[2] ) ) );
			}
			
			this.toArray  = function() {
				var v = this.data;
				return [ v[0], v[1], v[2], v[3] ];
			}
			this.vmul = function(m) {
				var v = this.data;
				var m = m.data;
				
				var x = v[0];
				var y = v[1];
				var z = v[2];
				var _ = v[3];
				
				// w is always 1 on Hamilton vector3 to quaternion
				
				// vector comes before in a horizontal way, vec*M
				v[0] = _.multiply(m[12]).add( x.multiply(m[0]) ).add( y.multiply(m[4]) ).add( z.multiply( m[8] ) );
				v[1] = _.multiply(m[13]).add( x.multiply(m[1]) ).add( y.multiply(m[5]) ).add( z.multiply( m[9] ) );
				v[2] = _.multiply(m[14]).add( x.multiply(m[2]) ).add( y.multiply(m[6]) ).add( z.multiply( m[11] ) );
				var w = _.multiply(m[15]).add( x.multiply(m[3]) ).add( y.multiply(m[7]) ).add( z.multiply(m[11]) );
				// (global scale)*1 + x*scale1 + y*scale2 + z*scale3
				if (w != 1 && w != 0) {
					v[0] = v[0].divide( w );
					v[1] = v[1].divide( w );
					v[2] = v[2].divide( w );
					v[3] = v[3].divide( w );
				}
				return this;
			}
			this.clone = function() {
				
				return Class.create("XMath.V4", { "XMath.V4" : [ this.type, this.data[0].toString(10), this.data[1].toString(10), this.data[2].toString(10), this.data[3].toString(10) ] } );
			}
			this.toString = function(n) {
				n = n || 10;
				var str = [];
				var v = this.data;
				return "[" + v[0].toString(n) + "," + v[1].toString(n) + "," + v[2].toString(n) + "]";
			}
			this.valueOf = function() {
				var n = 10;
				var str = [];
				var v = this.data;
				return "[" + v[0].toString(n) + "," + v[1].toString(n) + "," + v[2].toString(n) + "]";
			}
		} else {
			
			this.sadd = function(s) {
				var m0 = this.data;
				m0[0] += s;
				m0[1] += s;
				m0[2] += s;
				m0[3] += s;
				return this;
			}
			this.ssub = function(s) {
				var m0 = this.data;
				m0[0] -= s;
				m0[1] -= s;
				m0[2] -= s;
				m0[3] -= s;
				return this;
			}
			this.smul = function(s) {
				var m0 = this.data;
				m0[0] *= s;
				m0[1] *= s;
				m0[2] *= s;
				m0[3] *= s;
				return this;
			}
			this.sdiv = function(s) {
				var m0 = this.data;
				m0[0] /= s;
				m0[1] /= s;
				m0[2] /= s;
				m0[3] /= s;
				return this;
			}
			
			this.vadd = function(v) {
				var m0 =this.data;
				m0[0] += v.data[0];
				m0[1] += v.data[1];
				m0[2] += v.data[2];
				m0[3] += v.data[3];
				return this;
			}
			this.vsub = function(v) {
				var m0 =this.data;
				m0[0] -= v.data[0];
				m0[1] -= v.data[1];
				m0[2] -= v.data[2];
				m0[3] -= v.data[3];
				return this;
			}
			
			this.normalize = function() {
				var r = this.mod();
				var m0 = this.data;
				m0[0] = m0[0]/r;
				m0[1] = m0[1]/r;
				m0[2] = m0[2]/r;
				m0[3] = m0[3]/r;
				return m0;
			}
			
			this.dot = function(v1) {
				var v0 = this.data;
				v1 = v1.data;
				return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
			}
			
			this.cross = function(v1) {
				var v0 = this.data;
				v1 = v1.data;
				var a = v0[1] * v1[2] - v0[2] * v1[1];
				var b = - v0[0] * v1[2] + v0[2] * v1[0];
				var c = v0[0] * v1[1] - v0[1] * v1[0];
				v0[0] = a, v0[1] = b, v0[2] = c;
				return this;
			}
			
			this.track = function(v1, sa, sb) {
				var v0 = this.data;
				v1 = v1.data;
				var a = (sa * v0[0]) + (sb * v1[0]),
					b = (sa * v0[1]) + (sb * v1[1]),
					c = (sa * v0[2]) + (sb * v1[2]),
					d = (sa * v0[3]) + (sb * v1[3]);;
				v0[0] = a, v0[1] = b, v0[2] = c, v0[3] = d;
				return this;
			}
			
			this.slerp = function(v1,s) {
				var v0 = this.data;
				v1 = v1.data;
				var a = (v0[0]) + (s * v1[0]),
					b = (v0[1]) + (s * v1[1]),
					c = (v0[2]) + (s * v1[2]),
					d = (v0[3]) + (s * v1[3]);
				v0[0] = a, v0[1] = b, v0[2] = c, v0[2] = c;
				return this;
			}
			
			this.mod = function() {
				var v = this.data;
				return Math.sqrt( v[0]*v[0] + v[1]*v[1]+v[2]*v[2] );
			}
			
			
			this.toArray  = function() {
				var v = this.data;
				return [ v[0], v[1], v[2], v[3] ];
			}
			this.toString = function() {
				var str = [];
				var v = this.data;
				return "[" + parseFloat(v[0]).toPrecision(3) + "," + parseFloat(v[1]).toPrecision(3) + "," + parseFloat(v[2]).toPrecision(3) + "," + parseFloat(v[3]).toPrecision(3) + "]";
			}
			this.vmul = function(m) {
				var v = this.data;
				var m = m.data;
				var x = v[0];
				var y = v[1];
				var z = v[2];
				var _ = v[3];
				// w is always 1 on Hamilton vector3 to quaternion
				
				v[0] = _ * m[12] + x * m[0] + y * m[4] + z * m[8];
				v[1] = _ * m[13] + x * m[1] + y * m[5] + z * m[9];
				v[2] = _ * m[14] + x * m[2] + y * m[6] + z * m[11];
				var w = _ * m[15] + x * m[3] + y * m[7] + z * m[11]; // (global scale)*1 + x*scale1 + y*scale2 + z*scale3
				if (w != 1 && w != 0) {
					v[0] /= w;
					v[1] /= w;
					v[2] /= w;
					v[3] /= w;
				}
				return this;
			}
			this.clone = function() {
				return Class.create("XMath.V4", { "XMath.V4" : [ this.type, this.data[0], this.data[1], this.data[2] ] } );
			}
			
			
		}
		
	}, proto : {
		
	}
});


if (typeof module !== 'undefined' && module.exports) {
	module.exports = function(a,b,c) {
		return Class.create("XMath.V3", { "XMath.V3" : [a,b,c] });
	}
}