

var nodejs = false;
if (typeof module !== 'undefined' && module.exports) {
	require("../Class.js");
	nodejs = true;
}

Class.define("XMath.M4",{
	ctor : function(type) {

		var names = {
			"ArrayBuffer" : 0, // 0
			"DataView" : 0, // 1
			"Uint8Array" : 1, // 2
			"Uint16Array" : 2, // 3
			"Uint32Array" : 4, // 4
			"Int8Array" : 1, // 5
			"Int16Array" : 2, // 6
			"Int32Array" : 4, // 7
			"Float32Array" : 4, // 8
			"Float64Array" : 8 // 9
		};
		
		this.type = type;
		
		if(nodejs) {
			if(type == "Float32Array") {
				this.data = new Float32Array(new ArrayBuffer(16*names[type]));
				
			} else {
				throw "not implemented";
			}
		} else {
			this.data = new window[type](
				new ArrayBuffer(16*names[type])
			);
		}
		this.zero();

		this.shadeMode = false;
		this.name = "";
	}
	, proto : {
		setShaderMode : function(name) {
			this.shadeMode = true;
			this.name = name;
		},
		unsetShaderMode : function() {
			this.shadeMode = false;
			this.name = "[unbinded]";
		},
		clone : function(t) {
			if(this.shaderMode) this.emit("shader", [ "m4.clone", [this.name,t.name] ]);
			var c = Class.create("XMath.M4",{"XMath.M4": [this.type] });
			c.data[0] = this.data[0]; c.data[1] = this.data[1]; c.data[2] = this.data[2]; c.data[3] = this.data[3];
			c.data[4] = this.data[4]; c.data[5] = this.data[5]; c.data[6] = this.data[6]; c.data[7] = this.data[7];
			c.data[8] = this.data[8]; c.data[9] = this.data[9]; c.data[10] = this.data[10]; c.data[11] = this.data[11];
			c.data[12] = this.data[12]; c.data[13] = this.data[13]; c.data[14] = this.data[14]; c.data[15] = this.data[15];
			return c;
		},
		zero : function() {
			if(this.shaderMode) this.emit("shader", [ "m4.zero", [this.name] ]);
			this.data[0] = 0; this.data[1] = 0; this.data[2] = 0; this.data[3] = 0;
			this.data[4] = 0; this.data[5] = 0; this.data[6] = 0; this.data[7] = 0;
			this.data[8] = 0; this.data[9] = 0; this.data[10] = 0; this.data[11] = 0;
			this.data[12] = 0; this.data[13] = 0; this.data[14] = 0; this.data[15] = 0;
		},
		one : function() {
			if(this.shaderMode) this.emit("shader", [ "m4.one", [this.name] ]);
			this.data[0] = 1; this.data[1] = 1; this.data[2] = 1; this.data[3] = 1;
			this.data[4] = 1; this.data[5] = 1; this.data[6] = 1; this.data[7] = 1;
			this.data[8] = 1; this.data[9] = 1; this.data[10] = 1; this.data[11] = 1;
			this.data[12] = 1; this.data[13] = 1; this.data[14] = 1; this.data[15] = 1;
		},
		I : function() {
			if(this.shaderMode) this.emit("shader", [ "m4.identity", [this.name] ]);
			
			this.data[0] = 1; this.data[1] = 0; this.data[2] = 0; this.data[3] = 0;
			this.data[4] = 0; this.data[5] = 1; this.data[6] = 0; this.data[7] = 0;
			this.data[8] = 0; this.data[9] = 0; this.data[10] = 1; this.data[11] = 0;
			this.data[12] = 0; this.data[13] = 0; this.data[14] = 0; this.data[15] = 1;
		},
		madd : function(m) {
			if(this.shaderMode) this.emit("shader", [ "m4.madd", [this.name,m.name] ]);
			var m0 = this.data;
			var m1 = m.data;
			
			m0[0] += m1[0]; m0[1] += m1[1]; m0[2] += m1[2]; m0[3] += m1[3];
			m0[4] += m1[4]; m0[5] += m1[5]; m0[6] += m1[6]; m0[7] += m1[7];
			m0[8] += m1[8]; m0[9] += m1[9]; m0[10] += m1[10]; m0[11] += m1[11];
			m0[12] += m1[12]; m0[13] += m1[13]; m0[14] += m1[14]; m0[15] += m1[15];
			
			return this;
		},
		msub : function(m) {
			if(this.shaderMode) this.emit("shader", [ "m4.msub", [this.name,m.name] ]);
			var m0 = this.data;
			var m1 = m.data;
			
			m0[0] -= m1[0]; m0[1] -= m1[1]; m0[2] -= m1[2]; m0[3] -= m1[3];
			m0[4] -= m1[4]; m0[5] -= m1[5]; m0[6] -= m1[6]; m0[7] -= m1[7];
			m0[8] -= m1[8]; m0[9] -= m1[9]; m0[10] -= m1[10]; m0[11] -= m1[11];
			m0[12] -= m1[12]; m0[13] -= m1[13]; m0[14] -= m1[14]; m0[15] -= m1[15];
			
			return this;
		},
		mmul : function(m) {
			if(this.shaderMode) this.emit("shader", [ "m4.mmul", [this.name,m.name] ]);
			var m0 = this.data;
			var m1 = m.data;

			var x0 = m0[0]*m1[0] + m0[1]*m1[4] + m0[2]*m1[8] + m0[3]*m1[12],
				x1 = m0[0]*m1[1] + m0[1]*m1[5] + m0[2]*m1[9] + m0[3]*m1[13],
				x2 = m0[0]*m1[2] + m0[1]*m1[6] + m0[2]*m1[10] + m0[3]*m1[14],
				x3 = m0[0]*m1[3] + m0[1]*m1[7] + m0[2]*m1[11] + m0[3]*m1[15],
				x4 = m0[4]*m1[0] + m0[5]*m1[4] + m0[6]*m1[8] + m0[7]*m1[12],
				x5 = m0[4]*m1[1] + m0[5]*m1[5] + m0[6]*m1[9] + m0[7]*m1[13],
				x6 = m0[4]*m1[2] + m0[5]*m1[6] + m0[6]*m1[10] + m0[7]*m1[14],
				x7 = m0[4]*m1[3] + m0[5]*m1[7] + m0[6]*m1[11] + m0[7]*m1[15],
				x8 = m0[8]*m1[0] + m0[9]*m1[4] + m0[10]*m1[8] + m0[11]*m1[12],
				x9 = m0[8]*m1[1] + m0[9]*m1[5] + m0[10]*m1[9] + m0[11]*m1[13],
				x10 = m0[8]*m1[2] + m0[9]*m1[6] + m0[10]*m1[10] + m0[11]*m1[14],
				x11 = m0[8]*m1[3] + m0[9]*m1[7] + m0[10]*m1[11] + m0[11]*m1[15],
				x12 = m0[12]*m1[0] + m0[13]*m1[4] + m0[14]*m1[8] + m0[15]*m1[12],
				x13 = m0[12]*m1[1] + m0[13]*m1[5] + m0[14]*m1[9] + m0[15]*m1[13],
				x14 = m0[12]*m1[2] + m0[13]*m1[6] + m0[14]*m1[10] + m0[15]*m1[14],
				x15 = m0[12]*m1[3] + m0[13]*m1[7] + m0[14]*m1[11] + m0[15]*m1[15];
			
			m0[0] = x0; m0[1] = x1; m0[2] = x2; m0[3] = x3;
			m0[4] = x4; m0[5] = x5; m0[6] = x6; m0[7] = x7;
			m0[8] = x8; m0[9] = x9; m0[10] = x10; m0[11] = x11;
			m0[12] = x12; m0[13] = x13; m0[14] = x14; m0[15] = x15;
			
			return this;
			
		},
		vmul : function(v) {
			if(this.shaderMode) this.emit("shader", [ "m4.vmul", [this.name,v.name] ]);
			var r = Class.create("XMath.V3",{ "XMath.V3" : [this.type,0,0,0] });
			var w = v.data;
			var m = this.data;
			var x = w[0], y = w[1], z = w[2];
			
			r.data[0] = m[0] * x + m[1] * y + m[2] * z + m[3];
			r.data[1] = m[4] * x + m[5] * y + m[6] * z + m[7];
			r.data[2] = m[8] * x + m[9] * y + m[10] * z + m[11];
			
			var w = m[12] * x + m[13] * y + m[14] * z + m[15];
			//console.log(w);
			w = 1;
			if(w != 0) {
				r.data[0] /= w;
				r.data[1] /= w;
				r.data[2] /= w;
			}
			
			return r;
			
		},
		transpose : function() {
			if(this.shaderMode) this.emit("shader", [ "m4.transpose", [this.name] ]);
			
			var m0 = this.data;
			var a = m0[1]; m0[1] = m0[4]; m0[4] = a;
			a = m0[2]; m0[2] = m0[8]; m0[8] = a;
			a = m0[3]; m0[3] = m0[12]; m0[12] = a;
			a = m0[6]; m0[6] = m0[9]; m0[9] = a;
			a = m0[7]; m0[7] = m0[13]; m0[13] = a;
			a = m0[11]; m0[11] = m0[14]; m0[14] = a;
		},
		invert : function() {
			if(this.shaderMode) this.emit("shader", [ "m4.inverse", [this.name] ]);
			
			
			var m = this.data;
			
			var A0 = m[10]*m[15] - m[11]*m[14];
			var A1 = m[9]*m[15] - m[11]*m[13];
			var A2 = m[8]*m[15] - m[11]*m[12];
			var A3 = m[9]*m[14] - m[10]*m[13];
			var A4 = m[8]*m[14] - m[10]*m[12];
			var A5 = m[8]*m[13] - m[9]*m[12];
			
			var B0 = m[2]*m[7] - m[3]*m[6];
			var B1 = m[1]*m[7] - m[3]*m[5];
			var B2 = m[1]*m[6] - m[2]*m[5];
			var B3 = m[0]*m[7] - m[3]*m[4];
			var B4 = m[0]*m[6] - m[2]*m[4];
			var B5 = m[0]*m[5] - m[1]*m[4];
			
			var C1 = m[4]*A0 - m[6]*A2 + m[7]*A4;
			var C2 = m[4]*A1 - m[5]*A2 + m[7]*A5;
			var C3 = m[4]*A3 - m[5]*A4 + m[6]*A5;
			var C4 = m[5]*A0 - m[6]*A1 + m[7]*A3;
			
			var det =  m[0]*C4 - m[1]*C1 + m[2]*C2 - m[3]*C3;
			
			// cofatora transposta
			var m2 = this.clone();
			
			m2[0] = C4; 
			m2[1] = - ( m[1]*A0 - m[2]*A1 + m[3]*A3 ); 
			m2[2] = m[13]*B0 - m[14]*B1 + m[15]*B2; 
			m2[3] = - ( m[9]*B0 - m[10]*B1 + m[11]*B2 );
			m2[4] = - ( C1 ); 
			m2[5] = m[0]*A0 - m[2]*A2 + m[3]*A4; 
			m2[6] = - ( m[12]*B0 - m[14]*B3 + m[15]*B4 ); 
			m2[7] = m[8]*B0 - m[10]*B3 + m[11]*B4;
			m2[8] = C2;
			m2[9] = - ( m[0]*A1 - m[1]*A2 + m[3]*A5 ); 
			m2[10] = m[12]*B1 - m[13]*B3 + m[15]*B5; 
			m2[11] = - ( m[8]*B1 - m[9]*B3 + m[11]*B5 );
			m2[12] = - ( C3 ); 
			m2[13] = m[0]*A3 - m[1]*A4 + m[2]*A5; 
			m2[14] = - ( m[12]*B2 - m[13]*B4 + m[14]*B5 ); 
			m2[15] = m[8]*B2 - m[9]*B4 + m[10]*B5;
			
			for(var x = 0; x < 16;x++) m2[x] = m2[x] / det;
			
			return m2;
		},
		RZF : function(a) { // round zero float
			
			a = a == undefined ? 1e-7 : a > 0 ? a : -a;
			for(var x = 0; x < 16;x++) 
				if( this.data[x] > -a && this.data[x] < a ) this.data[x] = 0;
		},
		translate : function(x,y,z) {
			if(this.shaderMode) this.emit("shader", [ "m4.translate", [this.name,x,y,z] ]);
			
			if (Type.isArray(x)) {
				var t = x; x = t[0], y = t[1], z = t[2];
			} else {
				x = x == undefined ? 0 : x;
				y = y == undefined ? 0 : y;
				z = z == undefined ? 0 : z;
			}
			
			var m = Class.create("XMath.M4",{"XMath.M4":[this.type]});
			m.data[0] = 1, m.data[5] = 1, m.data[10] = 1, m.data[15] = 1;
			m.data[3] = x, m.data[7] = y, m.data[11] = z;
			this.mmul(m);
			
		},
		scale : function(x,y,z) {
			if(this.shaderMode) this.emit("shader", [ "m4.scale", [this.name,x,y,z] ]);
			if (Type.isArray(x)) {
				var t = x;
				x = t[0], 
				y = t[1], 
				z = t[2];
			} else {
				if (x == undefined) x = 1;
				if (z == undefined) {
					if (y == undefined) { y = x; z = x; }
					else z = 1;
				} else if (y == undefined) y = x;
			}
			var m = Class.create("XMath.M4",{ "XMath.M4" : [this.type] });
			m.data[0] = x;
			m.data[5] = y;
			m.data[10] = z;
			m.data[15] = 1;
			this.mmul(m);
		},
		rotate : function(angle,x,y,z,copy) { // prefer webgl
			if(this.shaderMode) this.emit("shader", [ "m4.rotate", [this.name,angle,x,y,z] ]);
			// Forms are (angle, x,y,z), (angle,vector), (angleX, angleY, angleZ), (angle)
			if (Type.isArray(x)) {
				var t = x; x = t[0], y = t[1],z = t[2];
			} else {
				if (arguments.length == 1) {
					x = 0, y = 0, z = 1;
				} else if (arguments.length == 3) {
					this.rotate(angle, 1,0,0);
					this.rotate(x, 0,1,0);
					this.rotate(y, 0,0,1);
					return this;
				}
			}
			//angle = angle / 180 * Math.PI;
			console.log("ROTATE A");
			angle /= 2; // *** reduce precision to round mantissa, and do faster math group rotation w/ same angle
			var sinA = Math.sin(angle), 
				cosA = Math.cos(angle), 
				sinA2 = sinA * sinA, sin2A = 2*sinA*cosA, 
				cos2A = 1 - 2*sinA2, _2sinA2 = 2*sinA2;
				
			var len = Math.sqrt(x * x + y * y + z * z);
			
			if (len == 0) {
				x = 0, y = 0, z = 1;
			} else if (len != 1) { 
				x /= len, y /= len, z /= len; 
			}
			
			var m = copy || this;
			var d = m.data;
			if (x == 1 && y == 0 && z == 0) { // x rotation
				d[0] = 1, d[5] = cos2A, d[6] = sin2A, d[9]= -sin2A, d[10] = cos2A, d[15] = 1;
			} else if (x == 0 && y == 1 && z == 0) { // y rotation
				d[0] = cos2A, d[2] = -sin2A, d[5] = 1, d[8] = sin2A, d[10] = cos2A, d[15] = 1;
			} else if (x == 0 && y == 0 && z == 1) { // z rotation
				d[0] = cos2A, d[1] = sin2A, d[4] = -sin2A, d[5] = cos2A, d[10] = 1, d[15] = 1;
			} else { // axis rotation
				var x2 = x*x, y2 = y*y, z2 = z*z;
				d[0] = 1-(y2+z2)*_2sinA2, d[1] = x*y*_2sinA2+z*sin2A, d[2] = x*z*_2sinA2-y*sin2A;
				d[4] = y*x*_2sinA2-z*sin2A, d[5] = 1-(z2+x2)*_2sinA2, d[6] = y*z*_2sinA2+x*sin2A;
				d[8] = z*x*_2sinA2+y*sin2A, d[9] = z*y*_2sinA2-x*sin2A, d[10] = 1-(x2+y2)*_2sinA2;
				d[15] = 1;
			}
			console.log("ROTATE B");
			return m;
		},
		ortho : function(L, R, B, T, N, F) { // prefer webgl
			if(this.shaderMode) this.emit("shader", [ "m4.ortho", [this.name,L,R,B,T,N,F] ]);
			var tx = (L + R) / (L - R);
			var ty = (T + B) / (T - B);
			var tz = (F + N) / (F - N);
			var m4 = new _M4();
			var m = m4.data;
			m[0] = 2 / (L - R), m[1] = 0, m[2] = 0, m[3] = 0;
			m[4] = 0, m[5] = 0, m[6] = 2 / (T - B), m[7] = 0;
			m[8] = 0, m[9] = 0, m[10] = -2 / (F - N), m[11] = 0;
			m[12] = tx, m[13] = ty, m[14] = tz, m[15] = 1;
			this.mmul(m4);
		},
		frustum : function(L, R, B, T, N, F) { // prefer webgl
			if(this.shaderMode) this.emit("shader", [ "m4.frustum", [this.name,L,R,B,T,N,F] ]);
			var m4 = Class.create("XMath.M4",{"XMath.M4":[this.type]});
			var A = (R + L) / (R - L);
			var B = (T + B) / (T - B);
			var C = -(F + N) / (F - N);
			var D = -(2 * F * N) / (F - N);
			var m = m4.data;
			m[0] = (2 * N) / (R - L);
			m[1] = 0;
			m[2] = 0;
			m[3] = 0;
			
			m[4] = 0;
			m[5] = 2 * N / (T - B);
			m[6] = 0;
			m[7] = 0;
			
			m[8] = A;
			m[9] = B;
			m[10] = C;
			m[11] = -1;
			
			m[12] = 0;
			m[13] = 0;
			m[14] = D;
			m[15] = 0;
			
			this.mmul(m4);
		},
		perspective : function(fovy, aspect, zNear, zFar) { // prefer webgl
			if(this.shaderMode) this.emit("shader", [ "m4.perspective", [this.name,fovy,aspect,zNear,zFar] ]);
			var t = Math.tan(fovy * Math.PI / 360) * zNear;
			var b = -t;
			var l = aspect * b;
			var r = aspect * t;
			this.frustum(l, r, b, t, zNear, zFar);
		},
		lookat : function(eyex, eyey, eyez, centerx, centery, centerz, upx, upy, upz) { // absolute positions, prefer webgl
			if(this.shaderMode) this.emit("shader", [ "m4.lookat", [this.name,eyex,eyey,eyez,centerx,centery,centerz,upx.upy,upz] ]);
			if (Type.isArray(eyez)) {
				var t = eyez;
				upx = t[0], upy = t[1], upz = t[2];
				t = eyey;
				centerx = t[0], centery = t[1], centerz = t[2];
				t = eyex;
				eyex = t[0], eyey = t[1], eyez = t[2];
			}
			var m4 = Class.create("XMath.M4",{"XMath.M4":[this.type]});
			var zx = eyex - centerx, zy = eyey - centery, zz = eyez - centerz;
			var mag = Math.sqrt(zx * zx + zy * zy + zz * zz);
			if (mag) { ( zx /= mag, zy /= mag, zz /= mag ); }
			// Y vector
			var yx = upx, yy = upy, yz = upz;
			// X vector = Y cross Z
			xx =  yy * zz - yz * zy;
			xy = -yx * zz + yz * zx;
			xz =  yx * zy - yy * zx;
			// Recompute Y = Z cross X
			yx = zy * xz - zz * xy;
			yy = -zx * xz + zz * xx;
			yx = zx * xy - zy * xx;
			// cross product gives area of parallelogram, which is < 1.0 for
			// non-perpendicular unit-length vectors; so normalize x, y here
			mag = Math.sqrt(xx * xx + xy * xy + xz * xz);
			if (mag) { ( xx /= mag, xy /= mag, xz /= mag ); }
			mag = Math.sqrt(yx * yx + yy * yy + yz * yz);
			if (mag) { ( yx /= mag, yy /= mag, yz /= mag ); }
			var m = m4.data;
			m[0] = xx, m[1] = xy, m[2] = xz, m[3] = 0;
			m[4] = yx, m[5] = yy, m[6] = yz, m[7] = 0;
			m[8] = zx, m[9] = zy, m[10] = zz, m[11] = 0;
			m[12] = 0, m[13] = 0, m[14] = 0, m[15] = 1;
			m4.translate(-eyex, -eyey, -eyez);
			this.mmul(m4);
		},
		det4x4 : function(t) {
			if(this.shaderMode) this.emit("shader", [ "m4.det", [this.name,t.name] ]);
			var m = this.data;
			var A0 = m[10]*m[15] - m[11]*m[14];
			var A1 = m[9]*m[15] - m[11]*m[13];
			var A2 = m[8]*m[15] - m[11]*m[12];
			var A3 = m[9]*m[14] - m[10]*m[13];
			var A4 = m[8]*m[14] - m[10]*m[12];
			var A5 = m[8]*m[13] - m[9]*m[12];
			return
				m[0] * ( m[5]*( A0 ) - m[6]*( A1 ) + m[7] * ( A3 ) )
				- m[1] * ( m[4]*( A0 ) - m[6]*( A2 ) + m[7] * ( A4 ) )
				+ m[2] * ( m[4]*( A1 ) - m[5]*( A2 ) + m[7] * ( A5 ) )
				- m[3] * ( m[4]*( A3 ) - m[5]*( A4 ) + m[6] * ( A5 ) );
		},
		det3x3 : function(t) {
			if(this.shaderMode) this.emit("shader", [ "m4.det3", [this.name,t.name] ]);
			var m = this.data;
			return m[0]*m[5]*m[10] + m[1]*m[6]*m[8] + m[2]*m[4]*m[9] - m[2]*m[5]*m[8] - m[1]*m[4]*m[10] - m[0]*m[6]*m[9];
		},
		det2x2 : function(t) {
			if(this.shaderMode) this.emit("shader", [ "m4.det2", [this.name,t.name] ]);
			var m = this.data;
			return m[0]*m[5] - m[1]*m[4];
		},
		toString : function() {
			var str = [];
			var x = 0, y = 0;
			for(var y = 0; y < 4;y++) {
				for(var x = 0; x < 4;x++) {
					var p = y*4+x;
					var k = "";
					if(y>0 && x==0) k = "\n";
					str.push(k+parseFloat(this.data[p]).toPrecision(3));
				}
			}
			return "[" + str.join(",") + "]";
		},
		uniform : function(ctx,loc,transpose) {
			var data = new Float32Array(16);
			for(var x = 0; x < 16;x++) data[x] = this.data[x];
			ctx.uniformMatrix4fv(loc, transpose, data);
		},
		toArray : function() {
			var str = [];
			for(var x = 0; x < 16;x++) str.push(this.data[x]);
			return str;
		},
		toTypedArray : function() {
			var c = this.clone();
			return c.data;
		},
		valueOf : function() {
			return this.det4x4();
		}
	}
});

if (typeof module !== 'undefined' && module.exports) {
	module.exports = function() {
		return Class.create("XMath.M4");
	}
}

