/*

	NumberCooler
	
		options:
		
			1)
			request credentials at:
			https://www.facebook.com/NumberCooler-127742840944252/
			anonymous not allowed.
			
			2)
			anonymous:
			copy and paste on your localhost and deal with the code by yourself.
			it's on github, if you don't know this, you are wasting time with this source.
			
			
			
		index:
			jsbn
			/js/jsbn.js
			Interpreter
			/js/Interpreter.js
			Languages.LOGICUNIT
			/js/Languages.LOGICUNIT.js
			
*/
var nodejs = false;
if (typeof module !== 'undefined' && module.exports)
	nodejs = true;


// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}

if(nodejs) {
	BigInteger.prototype.am = am1;
	dbits = 26;
} else {
	if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
	  BigInteger.prototype.am = am2;
	  dbits = 30;
	} else if(j_lm && (navigator.appName != "Netscape")) {
	  BigInteger.prototype.am = am1;
	  dbits = 26;
	}
	else { // Mozilla/Netscape seems to prefer am3
	  BigInteger.prototype.am = am3;
	  dbits = 28;
	}
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+this.DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return (this.s<0)?-r:r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);


// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Extended JavaScript BN functions, required for RSA private ops.

// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix

// (public)
function bnClone() { var r = nbi(); this.copyTo(r); return r; }

// (public) return value as integer
function bnIntValue() {
  if(this.s < 0) {
    if(this.t == 1) return this[0]-this.DV;
    else if(this.t == 0) return -1;
  }
  else if(this.t == 1) return this[0];
  else if(this.t == 0) return 0;
  // assumes 16 < DB < 32
  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
}

// (public) return value as byte
function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

// (public) return value as short (assumes DB>=16)
function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if(this.s < 0) return -1;
  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
  else return 1;
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if(b == null) b = 10;
  if(this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b,cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = "";
  this.divRemTo(d,y,z);
  while(y.signum() > 0) {
    r = (a+z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d,y,z);
  }
  return z.intValue().toString(b) + r;
}

// (protected) convert from radix string
function bnpFromRadix(s,b) {
  this.fromInt(0);
  if(b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
  for(var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b*w+x;
    if(++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w,0);
      j = 0;
      w = 0;
    }
  }
  if(j > 0) {
    this.dMultiply(Math.pow(b,j));
    this.dAddOffset(w,0);
  }
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) alternate constructor
function bnpFromNumber(a,b,c) {
  if("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if(a < 2) this.fromInt(1);
    else {
      this.fromNumber(a,c);
      if(!this.testBit(a-1))	// force MSB set
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
      if(this.isEven()) this.dAddOffset(1,0); // force odd
      while(!this.isProbablePrime(b)) {
        this.dAddOffset(2,0);
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
      }
    }
  }
  else {
    // new BigInteger(int,RNG)
    var x = new Array(), t = a&7;
    x.length = (a>>3)+1;
    b.nextBytes(x);
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
    this.fromString(x,256);
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB-(i*this.DB)%8, d, k = 0;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
      r[k++] = d|(this.s<<(this.DB-p));
    while(i >= 0) {
      if(p < 8) {
        d = (this[i]&((1<<p)-1))<<(8-p);
        d |= this[--i]>>(p+=this.DB-8);
      }
      else {
        d = (this[i]>>(p-=8))&0xff;
        if(p <= 0) { p += this.DB; --i; }
      }
      if((d&0x80) != 0) d |= -256;
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
      if(k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
}

function bnEquals(a) { return(this.compareTo(a)==0); }
function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a,op,r) {
  var i, f, m = Math.min(a.t,this.t);
  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
  if(a.t < this.t) {
    f = a.s&this.DM;
    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
    r.t = this.t;
  }
  else {
    f = this.s&this.DM;
    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
    r.t = a.t;
  }
  r.s = op(this.s,a.s);
  r.clamp();
}

// (public) this & a
function op_and(x,y) { return x&y; }
function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

// (public) this | a
function op_or(x,y) { return x|y; }
function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

// (public) this ^ a
function op_xor(x,y) { return x^y; }
function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

// (public) this & ~a
function op_andnot(x,y) { return x&~y; }
function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

// (public) ~this
function bnNot() {
  var r = nbi();
  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}

// (public) this << n
function bnShiftLeft(n) {
  var r = nbi();
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
  return r;
}

// (public) this >> n
function bnShiftRight(n) {
  var r = nbi();
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
  return r;
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if(x == 0) return -1;
  var r = 0;
  if((x&0xffff) == 0) { x >>= 16; r += 16; }
  if((x&0xff) == 0) { x >>= 8; r += 8; }
  if((x&0xf) == 0) { x >>= 4; r += 4; }
  if((x&3) == 0) { x >>= 2; r += 2; }
  if((x&1) == 0) ++r;
  return r;
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for(var i = 0; i < this.t; ++i)
    if(this[i] != 0) return i*this.DB+lbit(this[i]);
  if(this.s < 0) return this.t*this.DB;
  return -1;
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0;
  while(x != 0) { x &= x-1; ++r; }
  return r;
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0, x = this.s&this.DM;
  for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
  return r;
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n/this.DB);
  if(j >= this.t) return(this.s!=0);
  return((this[j]&(1<<(n%this.DB)))!=0);
}

// (protected) this op (1<<n)
function bnpChangeBit(n,op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r,op,r);
  return r;
}

// (public) this | (1<<n)
function bnSetBit(n) { return this.changeBit(n,op_or); }

// (public) this & ~(1<<n)
function bnClearBit(n) { return this.changeBit(n,op_andnot); }

// (public) this ^ (1<<n)
function bnFlipBit(n) { return this.changeBit(n,op_xor); }

// (protected) r = this + a
function bnpAddTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]+a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c += a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c += a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c<0)?-1:0;
  if(c > 0) r[i++] = c;
  else if(c < -1) r[i++] = this.DV+c;
  r.t = i;
  r.clamp();
}

// (public) this + a
function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

// (public) this - a
function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

// (public) this * a
function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

// (public) this^2
function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

// (public) this / a
function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

// (public) this % a
function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a,q,r);
  return new Array(q,r);
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0,n-1,this,0,0,this.t);
  ++this.t;
  this.clamp();
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n,w) {
  if(n == 0) return;
  while(this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while(this[w] >= this.DV) {
    this[w] -= this.DV;
    if(++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
}

// A "null" reducer
function NullExp() {}
function nNop(x) { return x; }
function nMulTo(x,y,r) { x.multiplyTo(y,r); }
function nSqrTo(x,r) { x.squareTo(r); }

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

// (public) this^e
function bnPow(e) { return this.exp(e,new NullExp()); }

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a,n,r) {
  var i = Math.min(this.t+a.t,n);
  r.s = 0; // assumes a,this >= 0
  r.t = i;
  while(i > 0) r[--i] = 0;
  var j;
  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
  r.clamp();
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a,n,r) {
  --n;
  var i = r.t = this.t+a.t-n;
  r.s = 0; // assumes a,this >= 0
  while(--i >= 0) r[i] = 0;
  for(i = Math.max(n-this.t,0); i < a.t; ++i)
    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
  r.clamp();
  r.drShiftTo(1,r);
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}

function barrettConvert(x) {
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
  else if(x.compareTo(this.m) < 0) return x;
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
}

function barrettRevert(x) { return x; }

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  x.drShiftTo(this.m.t-1,this.r2);
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
  x.subTo(this.r2,x);
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = x^2 mod m; x != r
function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = x*y mod m; x,y != r
function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e,m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if(i <= 0) return r;
  else if(i < 18) k = 1;
  else if(i < 48) k = 3;
  else if(i < 144) k = 4;
  else if(i < 768) k = 5;
  else k = 6;
  if(i < 8)
    z = new Classic(m);
  else if(m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);

  // precomputation
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
  g[1] = z.convert(this);
  if(k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1],g2);
    while(n <= km) {
      g[n] = nbi();
      z.mulTo(g2,g[n-2],g[n]);
      n += 2;
    }
  }

  var j = e.t-1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e[j])-1;
  while(j >= 0) {
    if(i >= k1) w = (e[j]>>(i-k1))&km;
    else {
      w = (e[j]&((1<<(i+1))-1))<<(k1-i);
      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
    }

    n = k;
    while((w&1) == 0) { w >>= 1; --n; }
    if((i -= n) < 0) { i += this.DB; --j; }
    if(is1) {	// ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2,g[w],r);
    }

    while(j >= 0 && (e[j]&(1<<i)) == 0) {
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
      if(--i < 0) { i = this.DB-1; --j; }
    }
  }
  return z.revert(r);
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s<0)?this.negate():this.clone();
  var y = (a.s<0)?a.negate():a.clone();
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if(g < 0) return x;
  if(i < g) g = i;
  if(g > 0) {
    x.rShiftTo(g,x);
    y.rShiftTo(g,y);
  }
  while(x.signum() > 0) {
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
    if(x.compareTo(y) >= 0) {
      x.subTo(y,x);
      x.rShiftTo(1,x);
    }
    else {
      y.subTo(x,y);
      y.rShiftTo(1,y);
    }
  }
  if(g > 0) y.lShiftTo(g,y);
  return y;
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if(n <= 0) return 0;
  var d = this.DV%n, r = (this.s<0)?n-1:0;
  if(this.t > 0)
    if(d == 0) r = this[0]%n;
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
  return r;
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven();
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while(u.signum() != 0) {
    while(u.isEven()) {
      u.rShiftTo(1,u);
      if(ac) {
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
        a.rShiftTo(1,a);
      }
      else if(!b.isEven()) b.subTo(m,b);
      b.rShiftTo(1,b);
    }
    while(v.isEven()) {
      v.rShiftTo(1,v);
      if(ac) {
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
        c.rShiftTo(1,c);
      }
      else if(!d.isEven()) d.subTo(m,d);
      d.rShiftTo(1,d);
    }
    if(u.compareTo(v) >= 0) {
      u.subTo(v,u);
      if(ac) a.subTo(c,a);
      b.subTo(d,b);
    }
    else {
      v.subTo(u,v);
      if(ac) c.subTo(a,c);
      d.subTo(b,d);
    }
  }
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if(d.compareTo(m) >= 0) return d.subtract(m);
  if(d.signum() < 0) d.addTo(m,d); else return d;
  if(d.signum() < 0) return d.add(m); else return d;
}

var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
var lplim = (1<<26)/lowprimes[lowprimes.length-1];

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs();
  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
    for(i = 0; i < lowprimes.length; ++i)
      if(x[0] == lowprimes[i]) return true;
    return false;
  }
  if(x.isEven()) return false;
  i = 1;
  while(i < lowprimes.length) {
    var m = lowprimes[i], j = i+1;
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while(i < j) if(m%lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if(k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t+1)>>1;
  if(t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for(var i = 0; i < t; ++i) {
    //Pick bases at random, instead of starting at 2
    a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
    var y = a.modPow(r,this);
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while(j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2,this);
        if(y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if(y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}

// protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

// public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

// JSBN-specific extension
BigInteger.prototype.square = bnSquare;

// BigInteger interfaces not implemented in jsbn:

// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)

if (typeof module !== 'undefined' && module.exports) {
	module.exports = BigInteger;
}Languages = {};

// require Interpreter.js

Interpreter = (function() {

	
	function PreParser(micro_format) { // return micro format, with graph reduction
		/*
			"alpha" : [ // compile to mapping
				x [ 
					y [1,"a",0] 
				]
			]
		*/
		for(var key in micro_format) {
			var el = micro_format[key];
			
			if(key.indexOf("[charset]")!=-1) { // this will remove order of evaluation to a single evaluation if possible
				var charset = {};
				var sel = [];
				var seli = 0;
				for(var x = 0; x < el.length;x++) {
					for(var y = 0; y < el[x].length;y++) {
						var item = el[x][y];
						if(item[0]==1 && item[1].length==1 && item[2]==0 && el[x].length==1) {
							//console.log("\t",x,y,"\"" + item[1] + "\"");
							charset[ item[1] ] = true;
							sel.push(x);
						}
					}
				}
				if(sel.length>0)  {
					while(sel.length>0) {
						el.splice( sel.pop(), 1 );
					}
					el.push( [ [ 3, charset, 0 ] ] );
					//console.log(JSON.stringify(el));
					var nkey = key.replace("[charset]","");
					micro_format[nkey] = micro_format[key];
					delete micro_format[key];
				}
			}
		}
		//console.log();
		//console.log(JSON.stringify(micro_format));
		return micro_format;
		
	}
	function Parser(doc,micro_format,global_context) { // filter
		// 0 rule
		// 1 string
		
		function postParser(target) {
			//console.log("IN:",target[0][0],target[0][1]);
			var p = [target,0,""];
			var item = p[0];
			var rule = micro_format[ item[0][0] ][ item[0][1] ];
			var has_parent = false;
			//console.log("BEFORE",item[0][0]);
			var val = [];
			
			for(var x = rule.length; x>= 1; x--) {
				if( rule[x-1][0] == 0) { // rule
					var m = postParser(item[x]);
					p[2] = m.string + p[2];
					val.unshift(m);
				} else if(rule[x-1][0] == 1) { // string
					p[2] = item[x] + p[2];
					val.unshift({
						type : 1,
						string : item[x]
					});
				} else if(rule[x-1][0] == 3) { // charset
					p[2] = item[x] + p[2];
					val.unshift({
						type : 3,
						string : item[x]
					});
				} else if(rule[x-1][0] == 4) { // anychar
					p[2] = item[x] + p[2];
					val.unshift({
						type : 4,
						string : item[x]
					});
				} else if(rule[x-1][0] == 5) { // empty
					val.unshift({
						type : 5,
						string : ""
					});
				}
				item.pop();
			}
			//console.log("OUT:",target[0][0],target[0][1],p[2]);
			target[0] = {
				ruleName : target[0][0],
				ruleIndex : target[0][1],
				type : 0,
				string : p[2],
				value : val
			};
			//console.log("AFTER",item[0][0],p[2]);
			return target[0];
		}
		function inParser(target,range) {
			var str = "";
			var rule = micro_format[ target[0][0] ][ target[0][1] ];
			for(var x = range-1; x>= 0; x--) {
				try {
					if( rule[x][0] == 0) { // rule
						var m = inParser(target[1+x], micro_format[ target[1+x][0][0] ][ target[1+x][0][1] ].length);
						str = m.string + str;
					} else if(rule[x][0] == 1) { // string
						str = target[1+x] + str;
					} else if(rule[x][0] == 2) { // string
						str = target[1+x] + str;
					} else if(rule[x][0] == 3) { // charset
						str = target[1+x] + str;
					} else if(rule[x][0] == 4) { // anychar
						str = target[1+x] + str;
					} else if(rule[x][0] == 5) { // empty
						
					}
				} catch(e) {
					//console.log(x,rule,e);
				}
			}
			return {
				ruleName : target[0][0],
				ruleIndex : target[0][1],
				string : str
			};
		}
		var debug = false;
		if("debug" in global_context)
			debug = !!global_context.debug;
		
		var result = false;
		var format = micro_format;
		
		var data_args = [["main",0]];
		for(var x = 0; x < micro_format[ "main" ][ 0 ][ 0 ].length;x++)
			data_args.push([]);
		var stack = [ [ ["main",0], 0, 0, 0 /*start at*/, 0 /*count*/, data_args /*data*/, 0 /*mode*/] ];
		var x = 0;
		var cur = null;
		var cache = {};
		
		for(;x < doc.length;) {
			var state = 0;
			if(debug) console.log("ch:",doc.charAt(x));
			while(stack.length>0) {
				cur = stack[stack.length-1];
				//console.log(cur[0]);
				if(debug) console.log(JSON.stringify(stack));
				var substate = 0;
				var item = micro_format[ cur[0][0] ][ cur[1] ][ cur[2] ];
				
				cur[5][0][1] = cur[1];
				cur[0][1] = cur[1];
				
				if(item[0]==7) { // this rule to get into
					if(item[2]==0) {
						var data1 = inParser( cur[5], cur[2] );
						var nr = item[1](data1.string);
						// if(debug) 
							// console.log("Q:","["+data1.string+"]","A:",nr);
						item[0] = 8;
						item[1] = [ nr, item[1] ];
					}
				}
				
				// console.log("KEY:",cur[0]);
				// if("javascript" in global_context && global_context.javascript)
				
				while( item[0] == 0 || item[0] == 8) { // rule -> auto get in
					if(item[0]==0) {
						
						var data_args = [ [item[1],0] ];
						for(var y = 0; y < micro_format[ cur[0][0] ][ cur[1] ].length;y++) data_args.push([]);
						stack.push( [ [item[1],0], 0, 0, x, 0, data_args, item[2] ] );
						//if(debug) console.log("push ",item[1]);
						//if(debug) console.log(cur[0],cur[1],cur[2],format[cur[0]]);
						cur = stack[ stack.length-1 ];
						cur[5][0][1] = cur[1];
						cur[0][1] = cur[1];
						try {
							item = micro_format[ cur[0][0] ][ cur[1] ][ cur[2] ];
						} catch(e) {
							console.log("!! rule not found:",cur[0][0],cur[1],cur[2]);
							throw e;
						}
						substate = 0; // try subrule
						
					}
					if(item[0]==8) { // currently losing track of what rule was choosed.
						item[0] = 7;
						//console.log("??",item[1][0]);
						var data_args = [ [item[1][0],0] ];
						for(var y = 0; y < micro_format[ cur[0][0] ][ cur[1] ].length;y++) data_args.push([]);
						stack.push( [ [item[1][0],0], 0, 0, x, 0, data_args, item[2]] );
						cur = stack[ stack.length-1];
						cur[5][0][1] = cur[1];
						cur[0][1] = cur[1];
						
						item[1] = item[1][1];
						
						item = micro_format[ cur[0][0] ][ cur[1] ][ cur[2] ];
						substate = 0;
					}
				}
				
				if(item[0]==1) { // string
					var r1 = doc.indexOf( item[1], x ) == x; 
					if( item[2] == 0 ) { // true
						if( r1 ) {
							//console.log(cur,item[1]);
							cur[ 5 ][ 1 + cur[2] ] = item[1];
							substate = 1;
							x += item[1].length;
						} else {
							if(debug) console.log("not found",item[1],x);
							substate = 2;
						}
					} else if(item[2]== 1) { // false
						if( r1 ) {
							
							cur[1] = micro_format[cur[0][0]].length; // fail rule going end of subrules
							
							// console.log("BIG FAIL");
							substate = 2; // fail, then go to next subrule
						} else {
							substate = 2;
						}
					}
				} else if(item[0]==2) {
					console.log("[[LANG]]");
					if( (x + "_" + cur[0][0]) in cache ) {
						if(item[2]==0) {
							cur[ 5 ][ 1 + cur[2] ] = cache[(x + "_" + cur[0][0])];
							substate = 1;
							x += cur[ 5 ][ 1 + cur[2] ].length;
						} else {
							substate = 2;
						}
					} else {
						if( item[2] == 0) {
							global_context.javascript = true;
							global_context.filter = item[3].filter;
							//console.log("!!!",item[3]);
							var r = Parser(doc.substring(x),PreParser(item[1]),global_context);
							delete global_context.filter;
							delete global_context.javascript;
							if(r[1]) {
								var dt = doc.substring(x,x+r[0]);
								cache[ x + "_" + cur[0][0] ] = dt;
								cur[ 5 ][ 1 + cur[2] ] = dt;
								substate = 1;
								console.log("PARSED >>"+dt+"<<");
								x += dt.length;
							} else {
								substate = 2;
							}
						}
					}
					console.log("[[/LANG]]");
				} else if(item[0]==3) { // charset
					if(item[2] == 0) {
						var ch = doc.substring(x,x+1)
						if( ch in item[1] ) {
							cur[5][0][1] = cur[1];
							cur[ 5 ][ 1 + cur[2] ] = ch;
							substate = 1;
							x += 1;
						} else {
							substate = 2;
						}
					} else if(item[2]==1) {
						var ch = doc.substring(x,x+1)
						if( ch in item[1] ) {
							cur[1] = format[cur[0][0]].length;
							substate = 2;
						} else {
							substate = 2;
						}
					}
				} else if(item[0]==4) { // any
					if(item[2]==0) {
						if(x+1 < doc.length) {
							cur[ 5 ][ 1 + cur[2] ] = doc.substring(x,x+1);
							substate = 1;
							x += 1;
						} else {
							substate = 2;
						}
					} else if(item[2]==1) {
						if(x+1 < doc.length) {
							cur[1] = micro_format[cur[0][0]].length;
							substate = 2;
						} else {
							substate = 2;
						}
					}
				} else if(item[0]==5) { // empty
					if(item[2]==0) {
						cur[ 5 ][ 1 + cur[2] ] = "";
						substate = 1;
					} else if(item[2]==1) { // disable this subrule by enqueue a [5,"",1], enable by shifting [ 5,"",1 ]
						cur[1] = micro_format[cur[0][0]].length;
						substate = 2;
					}
				} 
				
				if(substate==1) { // rule
					
					if(debug) console.log("!! FOUND",x,item[1],item[1].length,doc.length);
					if(x == doc.length) {
						// fail
						if(debug) console.log("FOUND END");
					}
					while(true) {
						//console.log("B");
						if( ( cur[2] + 1 ) <  micro_format[ cur[0][0] ][ cur[1] ].length ) {
							cur[2] += 1; // next item on subrule
							if(debug) console.log("NEXT SUBRULE",JSON.stringify(cur));
							break;
						} else {
							//console.log("Z");
							if(debug) console.log("END SUBRULE",JSON.stringify(cur));
							var first = false;
							if( cur[4] == 0)
								first = true;
							cur[4] += 1;
							// final, then ok
							if(stack.length>0) {
								// before popping, copy all data to upper stack
								
								stack.pop();
								if(stack.length>0) {
									var parent = stack[ stack.length-1 ];
									parent[ 5 ][ 1 + parent[2] ] = cur[5];
								
									cur = stack[stack.length-1];
									item = micro_format[ cur[0][0] ][ cur[1] ][ cur[2] ];
									
									if(cur[6]==1) { // an ok rule that need to fail
										cur[1] = micro_format[cur[0][0]].length;
										//console.log("BIG FAIL");
										substate = 2; // fail, then go to next subrule
										break;
									}
								} else {
									if(cur[6]==1) { // an ok rule that need to fail
										//console.log("BIG FAIL");
									}
								}
							} else {
								//console.log("BREAK");
								break;
							}
							
						}
					}
					if(debug) console.log(JSON.stringify(stack));		
					if(debug) console.log("new x:",x);
				}
				
				
				if(substate==2) {
					// fail
					var substate2 = 1;
					// try next subrule
					//x = cur[3];
					while(true) {
						if( ( cur[1] + 1 ) <  micro_format[ cur[0][0] ].length ) {
							cur[1] += 1;
							cur[2] = 0;
							substate2 = 0;
							if(debug) console.log("NEXT SUBRULE");
							break;
						} else {
							if(stack.length>0) {
								stack.pop();
							}
							if(stack.length>0) {
								cur = stack[stack.length-1];
								item = micro_format[cur[0][0]][cur[1]][cur[2]];
							} else {
								break;
							}
						}
					}
					
					// next subrule not found
					if(substate2==1) {
						state = 1; // stack is empty
						if(debug) console.log("STACK IS EMPTY:",stack.length==0);
						break;
					}
					
					x = cur[3]; // backtrack
					
					if(debug) console.log("BACKTRACK");
					if(debug) console.log("X:",x);
				}
				
				
			}
			if(debug) console.log("STATE:",state);
			if(state==1) {
				if(debug) console.log("FAIL");
				break;
			}
			if(stack.length==0) {
				if(state==2 || state==0) {
					if(debug) console.log("OK",cur[4]);
					result = true;
					break;
				} else {
					if(debug) console.log("FAIL");
					break;
				}
				
			}
			if(debug) console.log("NEXT",x,doc.length);
		}
		if(result) {
			
			var r = postParser(cur[5]);
			//console.log(JSON.stringify(r));
			
			function walk(target,context) {
				//console.log(JSON.stringify(target));
				var stack = [[target,0]];
				if("boot" in context)
					context.boot(context);
				var handlers = {};
				// mount filters
				for( var f in context.filter) {
					var parts = f.split(".");
					context.filter[f].name = parts;
					//console.log("F:",f,parts);
					if( !(parts[ parts.length-1] in handlers))
						handlers[ parts[ parts.length-1] ] = [];
					handlers[ parts[ parts.length-1] ].push( context.filter[f] );
				}
				
				while(stack.length>0) {
					var p = stack.pop();
					if(p[0].type==0) {
						var name = [p[0].ruleName];
						for(var z = stack.length-1; z >=0;z--) {
							name.push( stack[z][0].ruleName );
						}
						//name = p[0].ruleName;
						name = name.join(".");
						//console.log(name,p[0].string);
						if(p[1]==0) {
							
							if(p[0].ruleName in handlers) {
								//console.log(p[0].ruleName);
								var check = false;
								for(var z = 0; z < handlers[p[0].ruleName].length;z++) {
									var filter = handlers[p[0].ruleName][z];
									check = false;
									for(var y = 0; y < filter.name.length;y++) {
										//console.log( "     ",filter.name[ filter.name.length-1-y ], p[0].ruleName, stack[ stack.length-1-y][0].ruleName,filter.name.length,y );
										if( y== 0 && filter.name[ filter.name.length-1-y ] != p[0].ruleName ) {
											//console.log("A");
											check = true;
											break;
										} else if( y>0 && filter.name[ filter.name.length-1-y] != stack[ stack.length-y][0].ruleName) {
											//console.log("B");
											check = true;
											break;
										}
									}
									if(!check) {
										if("before" in filter) {
											var lctx = filter.before;
											if("select" in lctx) {
												var args = [];
												for(var y = 0; y < lctx.select.length;y++) {
													if( lctx.select[y] < p[0].value.length ) {
														args.push( p[0].value[ lctx.select[y] ].string );
													} else {
														args.push("");
													}
												}
												//console.log("calling handler",p[0].ruleName);
												lctx.handler(global_context, p[0].ruleIndex, args);
											} else {
												var args = [];
												for(var y = 0; y < p[0].value.length;y++)  {
													if( y < p[0].value.length) {
														args.push(p[0].value[ y ].string );
													} else {
														args.push("");
													}
												}
												//console.log("calling handler");
												lctx.handler(global_context,p[0].ruleIndex,args);
											}
										}
									}
								}
								
							}
						}
						if(p[1] < p[0].value.length) {
							stack.push( [ p[0], p[1] + 1] );
							stack.push( [ p[0].value[ p[1] ], 0 ] );
							
							//console.log(p[0].ruleName, p[0].value[ p[1] ].ruleName);
							
						} else {
							//console.log("END");
							if(p[0].ruleName in handlers) {
								//console.log(p[0].ruleName);
								var check = false;
								for(var z = 0; z < handlers[p[0].ruleName].length;z++) {
									var filter = handlers[p[0].ruleName][z];
									check = false;
									for(var y = 0; y < filter.name.length;y++) {
										//console.log( "     ",filter.name[ filter.name.length-1-y ], p[0].ruleName, stack[ stack.length-1-y][0].ruleName,filter.name.length,y );
										if( y== 0 && filter.name[ filter.name.length-1-y ] != p[0].ruleName ) {
											//console.log("A");
											check = true;
											break;
										} else if( y>0 && filter.name[ filter.name.length-1-y] != stack[ stack.length-y][0].ruleName) {
											//console.log("B");
											check = true;
											break;
										}
									}
									if(!check) {
										if("after" in filter) {
											var lctx = filter.after;
											if("select" in lctx) {
												var args = [];
												for(var y = 0; y < lctx.select.length;y++) {
													if( lctx.select[y] < p[0].value.length) {
														args.push( p[0].value[ lctx.select[y] ].string );
													} else {
														args.push("");
													}
												}
												lctx.handler(global_context,p[0].ruleIndex, args);
											} else {
												var args = [];
												for(var y = 0; y < p[0].value.length;y++) {
													if( y < p[0].value.length) {
														args.push(p[0].value[ y ].string );
													} else {
														args.push("");
													}
												}
												lctx.handler(global_context,p[0].ruleIndex, args);
											}
											
											
										}
									}
								}
								
							}
						}
					}
				}
				
				if("shutdown" in context)
					context.shutdown(context);
					
			}
			
			
			
			walk(r,global_context);
			
			return [x,result,global_context];
		}
		return [x,result];
	}

	return {
		pre : PreParser,
		parser : Parser
	};
	
})();


/*

	seal names just like keywords. like window and document.
	the only action that is allowed is to nullify in current context
	so static remains static
	
	words will be sold. all. nobody will have more ideas. just like dns.
	what law will control that?
	
	
	
	
	
*/

Languages.LOGICUNIT = (function() {
	
	function LOGICUNIT() {
		this.lang = {};
	}
	LOGICUNIT.prototype.reset = function() {
		// language
		// convert html to framework page
		var lang = this.lang;
		lang.syntax = {
			"binary-digit" : [
				[ [1,"0",0] ], [ [1,"1",0] ]
			],
			"octal-digit" : [
				[ [1,"0",0] ], [ [1,"1",0] ], [ [1,"2",0] ], [ [1,"3",0] ],
				[ [1,"4",0] ], [ [1,"5",0] ], [ [1,"6",0] ], [ [1,"7",0] ]
			],
			"decimal-digit" : [
				[ [1,"0",0] ], [ [1,"1",0] ], [ [1,"2",0] ], [ [1,"3",0] ], [ [1,"4",0] ],
				[ [1,"5",0] ], [ [1,"6",0] ], [ [1,"7",0] ], [ [1,"8",0] ], [ [1,"9",0] ]
			],
			"hex-digit" : [
				[ [1,"0",0] ], [ [1,"1",0] ], [ [1,"2",0] ], [ [1,"3",0] ],
				[ [1,"4",0] ], [ [1,"5",0] ], [ [1,"6",0] ], [ [1,"7",0] ],
				[ [1,"8",0] ], [ [1,"9",0] ], [ [1,"A",0] ], [ [1,"B",0] ],
				[ [1,"C",0] ], [ [1,"D",0] ], [ [1,"E",0] ], [ [1,"F",0] ]
			],
			"alpha-upper-char" : [
				[ [1,"A",0] ],[ [1,"B",0] ],[ [1,"C",0] ],[ [1,"D",0] ],[ [1,"E",0] ],
				[ [1,"F",0] ],[ [1,"G",0] ],[ [1,"H",0] ],[ [1,"I",0] ],[ [1,"J",0] ],
				[ [1,"K",0] ],[ [1,"L",0] ],[ [1,"M",0] ],[ [1,"N",0] ],[ [1,"O",0] ],
				[ [1,"P",0] ],[ [1,"Q",0] ],[ [1,"R",0] ],[ [1,"S",0] ],[ [1,"T",0] ],
				[ [1,"U",0] ],[ [1,"V",0] ],[ [1,"W",0] ],[ [1,"X",0] ],[ [1,"Y",0] ],
				[ [1,"Z",0] ]
			],
			"alpha-lower-char" : [
				[ [1,"a",0] ],[ [1,"b",0] ],[ [1,"c",0] ],[ [1,"d",0] ],[ [1,"e",0] ],
				[ [1,"f",0] ],[ [1,"g",0] ],[ [1,"h",0] ],[ [1,"i",0] ],[ [1,"j",0] ],
				[ [1,"k",0] ],[ [1,"l",0] ],[ [1,"m",0] ],[ [1,"n",0] ],[ [1,"o",0] ],
				[ [1,"p",0] ],[ [1,"q",0] ],[ [1,"r",0] ],[ [1,"s",0] ],[ [1,"t",0] ],
				[ [1,"u",0] ],[ [1,"v",0] ],[ [1,"w",0] ],[ [1,"x",0] ],[ [1,"y",0] ],
				[ [1,"z",0] ]
			],
			"full-range-char" : [
				[ [0,"alpha-lower-char",0] ],
				[ [0,"alpha-upper-char",0] ],
				[ [0,"decimal-digit",0] ],
				[ [1,"\n",0] ],
				[ [1,"\r",0] ],
				[ [1,"\t",0] ],
				[ [1," ",0] ], [ [1,"~",0] ], [ [1,"`",0] ], [ [1,"!",0] ], [ [1,"@",0] ],
				[ [1,"#",0] ], [ [1,"$",0] ], [ [1,"%",0] ], [ [1,"^",0] ], [ [1,"&",0] ],
				[ [1,"*",0] ], [ [1,"(",0] ], [ [1,")",0] ], [ [1,"-",0] ], [ [1,"_",0] ],
				[ [1,"+",0] ], [ [1,"=",0] ], [ [1,"[",0] ], [ [1,"]",0] ], [ [1,"{",0] ],
				[ [1,"}",0] ], [ [1,"|",0] ], [ [1,"\\",0] ], [ [1,":",0] ], [ [1,";",0] ],
				[ [1,"\"",0] ], [ [1,"'",0] ], [ [1,"<",0] ], [ [1,",",0] ], [ [1,">",0] ],
				[ [1,".",0] ], [ [1,"/",0] ], [ [1,"?",0] ]
			],
			"string-double-quote-char" : [
				[ [0,"alpha-lower-char",0] ],
				[ [0,"alpha-upper-char",0] ],
				[ [0,"decimal-digit",0] ],
				[ [1," ",0] ], [ [1,"~",0] ], [ [1,"`",0] ], [ [1,"!",0] ], [ [1,"@",0] ],
				[ [1,"#",0] ], [ [1,"$",0] ], [ [1,"%",0] ], [ [1,"^",0] ], [ [1,"&",0] ],
				[ [1,"*",0] ], [ [1,"(",0] ], [ [1,")",0] ], [ [1,"-",0] ], [ [1,"_",0] ],
				[ [1,"+",0] ], [ [1,"=",0] ], [ [1,"[",0] ], [ [1,"]",0] ], [ [1,"{",0] ],
				[ [1,"}",0] ], [ [1,"|",0] ], [ [1,":",0] ], [ [1,";",0] ],
				[ [1,"'",0] ], [ [1,"<",0] ], [ [1,",",0] ], [ [1,">",0] ], [ [1,".",0] ], 
				[ [1,"/",0] ], [ [1,"?",0] ]
			],
			"string-single-quote-char" : [
				[ [0,"alpha-lower-char",0] ],
				[ [0,"alpha-upper-char",0] ],
				[ [0,"decimal-digit",0] ],
				[ [1," ",0] ], [ [1,"~",0] ], [ [1,"`",0] ], [ [1,"!",0] ], [ [1,"@",0] ],
				[ [1,"#",0] ], [ [1,"$",0] ], [ [1,"%",0] ], [ [1,"^",0] ], [ [1,"&",0] ],
				[ [1,"*",0] ], [ [1,"(",0] ], [ [1,")",0] ], [ [1,"-",0] ], [ [1,"_",0] ],
				[ [1,"+",0] ], [ [1,"=",0] ], [ [1,"[",0] ], [ [1,"]",0] ], [ [1,"{",0] ],
				[ [1,"}",0] ], [ [1,"|",0] ], [ [1,":",0] ], [ [1,";",0] ], 
				[ [1,"\"",0] ], [ [1,"<",0] ], [ [1,",",0] ], [ [1,">",0] ], [ [1,".",0] ], 
				[ [1,"/",0] ], [ [1,"?",0] ]
			],
			"string-multiline-single-quote-char" : [
				[ [0,"alpha-lower-char",0] ],
				[ [0,"alpha-upper-char",0] ],
				[ [0,"decimal-digit",0] ],
				[ [1,"\r",0] ],[ [1,"\n",0] ],[ [1,"\t",0] ],
				[ [1," ",0] ], [ [1,"~",0] ], [ [1,"`",0] ], [ [1,"!",0] ], [ [1,"@",0] ],
				[ [1,"#",0] ], [ [1,"$",0] ], [ [1,"%",0] ], [ [1,"^",0] ], [ [1,"&",0] ],
				[ [1,"*",0] ], [ [1,"(",0] ], [ [1,")",0] ], [ [1,"-",0] ], [ [1,"_",0] ],
				[ [1,"+",0] ], [ [1,"=",0] ], [ [1,"[",0] ], [ [1,"]",0] ], [ [1,"{",0] ],
				[ [1,"}",0] ], [ [1,"|",0] ], [ [1,":",0] ], [ [1,";",0] ], 
				[ [1,"\"",0] ], [ [1,"<",0] ], [ [1,",",0] ], [ [1,">",0] ], [ [1,".",0] ], 
				[ [1,"/",0] ], [ [1,"?",0] ]
			],
			"unicode-escape" : [
				[ [1,"&#",0], [0,"decimal-integer",0], [1,";",0] ],
				[ [1,"&x",0], [0,"hex-integer",0], [1,";",0] ]
			],
			"binary-digit-array" : [
				[ [0,"binary-digit",0], [0, "binary-digit-array",0] ],
				[ [0,"binary-digit",0] ]
			],
			"octal-digit-array" : [
				[ [0,"octal-digit",0], [0, "octal-digit-array",0] ],
				[ [0,"octal-digit",0] ]
			],
			"decimal-digit-array" : [
				[ [0,"decimal-digit",0], [0, "decimal-digit-array",0] ],
				[ [0,"decimal-digit",0] ]
			],
			"hex-digit-array" : [
				[ [0,"hex-digit",0], [0, "hex-digit-array",0] ],
				[ [0,"hex-digit",0] ]
			],
			"binary-integer" : [
				[ [1,"0b",0], [0,"binary-digit-array",0] ]
			],
			"octal-integer" : [
				[ [1,"0o",0], [0,"octal-digit-array",0] ]
			],
			"decimal-integer" : [
				[ [0,"decimal-digit-array",0] ]
			],
			"hex-integer" : [
				[ [1,"0x",0], [0,"hex-digit-array",0] ]
			],
			"number-integer" : [
				[ [0,"binary-integer",0] ],
				[ [0,"octal-integer",0] ],
				[ [0,"hex-integer",0] ],
				[ [0,"decimal-integer",0] ]
			],
			"number-integer-opt" : [
				[ [0,"number-integer",0] ],
				[ [5,"",0] ]
			],
			"boolean-value" : [
				[ [1,"true",0] ],
				[ [1,"false",0] ]
			],
			"boolean-value-opt" : [
				[ [0,"boolean-value",0] ],
				[ [5,"",0] ]
			],
			
			"string-double-quote-replace" : [
				[ [1,"@(",0], [0,"value-expression-operation",0], [1,")",0] ]
			],
			"string-double-quote-item" : [
				[ [0,"string-double-quote-replace",0] ],
				[ [0,"string-double-quote-char",0] ],
				[ [1,"\\",0], [1,"\"",0] ],
				[ [1,"\\",0], [0,"string-double-quote-char",0] ]
			],
			"string-double-quote-char-array" : [
				[ [0,"string-double-quote-item",0], [0,"string-double-quote-char-array",0] ],
				[ [0,"string-double-quote-item",0] ]
			],
			"string-double-quote-char-array-opt" : [
				[ [0,"string-double-quote-char-array",0] ],
				[ [5,"",0] ]
			],
			"string-double-quote" : [
				[ [1,"\"",0], [0,"string-double-quote-char-array-opt",0], [1,"\"",0] ],
			],
			"string-single-quote-item" : [
				[ [0,"string-single-quote-char",0] ],
				[ [1,"\\",0], [1,"'",0] ],
				[ [1,"\\",0], [0,"string-single-quote-char",0] ]
			],
			"string-single-quote-char-array" : [
				[ [0,"string-single-quote-item",0], [0,"string-single-quote-char-array",0] ],
				[ [0,"string-single-quote-item",0] ]
			],
			"string-single-quote-char-array-opt" : [
				[ [0,"string-single-quote-char-array",0] ],
				[ [5,"",0] ]
			],
			"string-single-quote" : [
				[ [1,"'",0], [0,"string-single-quote-char-array-opt",0], [1,"'",0] ],
			],
			"string-multiline-double-quote" : [
				[ [1,"@\"",0], [1,"\"@",0] ]
			],
			"string-multiline-single-quote-item" : [
				[ [1,"'@",1] ],
				[ [0,"string-multiline-single-quote-char",0] ],
				[ [1,"\\",0], [1,"'",0] ],
				[ [1,"\\",0], [0,"string-multiline-single-quote-char",0] ]
			],
			"string-multiline-single-quote-char-array" : [
				[ [0,"string-multiline-single-quote-item",0], [0,"string-multiline-single-quote-char-array",0] ],
				[ [0,"string-multiline-single-quote-item",0] ]
			],
			"string-multiline-single-quote-char-array-opt" : [
				[ [0,"string-multiline-single-quote-char-array",0] ],
				[ [5,"",0] ]
			],
			"string-multiline-single-quote" : [
				[ [1,"@'",0], [0,"string-multiline-single-quote-char-array-opt",0], [1,"'@",0] ]
			],
			"string-value" : [ // double quote evals vars, single quote are static
				[ [0,"string-double-quote",0] ],
				[ [0,"string-single-quote",0] ],
				[ [0,"string-multiline-double-quote",0] ],
				[ [0,"string-multiline-single-quote",0] ]
			],
			"space-chars" : [
				[ [1," ",0] ],
				[ [1,"\t",0] ],
				[ [1,"\r",0] ],
				[ [1,"\n",0] ]
			],
			"space-opt" : [
				[ [0,"space-chars",0], [0,"space-opt",0] ],
				[ [0,"space-chars",0] ],
				[ [5,"",0] ]
			],
			"space" : [
				[ [0,"space-chars",0], [0,"space",0] ],
				[ [0,"space-chars",0] ]
			],
			"name-char" : [
				[ [1,"a",0] ],[ [1,"b",0] ],[ [1,"c",0] ],[ [1,"d",0] ],[ [1,"e",0] ],
				[ [1,"f",0] ],[ [1,"g",0] ],[ [1,"h",0] ],[ [1,"i",0] ],[ [1,"j",0] ],
				[ [1,"k",0] ],[ [1,"l",0] ],[ [1,"m",0] ],[ [1,"n",0] ],[ [1,"o",0] ],
				[ [1,"p",0] ],[ [1,"q",0] ],[ [1,"r",0] ],[ [1,"s",0] ],[ [1,"t",0] ],
				[ [1,"u",0] ],[ [1,"v",0] ],[ [1,"w",0] ],[ [1,"x",0] ],[ [1,"y",0] ],
				[ [1,"z",0] ],
				[ [1,"A",0] ],[ [1,"B",0] ],[ [1,"C",0] ],[ [1,"D",0] ],[ [1,"E",0] ],
				[ [1,"F",0] ],[ [1,"G",0] ],[ [1,"H",0] ],[ [1,"I",0] ],[ [1,"J",0] ],
				[ [1,"K",0] ],[ [1,"L",0] ],[ [1,"M",0] ],[ [1,"N",0] ],[ [1,"O",0] ],
				[ [1,"P",0] ],[ [1,"Q",0] ],[ [1,"R",0] ],[ [1,"S",0] ],[ [1,"T",0] ],
				[ [1,"U",0] ],[ [1,"V",0] ],[ [1,"W",0] ],[ [1,"X",0] ],[ [1,"Y",0] ],
				[ [1,"Z",0] ],
				[ [1,"0",0] ],[ [1,"1",0] ],[ [1,"2",0] ],[ [1,"3",0] ],[ [1,"4",0] ],
				[ [1,"5",0] ],[ [1,"6",0] ],[ [1,"7",0] ],[ [1,"8",0] ],[ [1,"9",0] ],
				[ [1,"_",0] ],[ [1,"$",0] ]
			],
			"name-first-char" : [
				[ [1,"a",0] ],[ [1,"b",0] ],[ [1,"c",0] ],[ [1,"d",0] ],[ [1,"e",0] ],
				[ [1,"f",0] ],[ [1,"g",0] ],[ [1,"h",0] ],[ [1,"i",0] ],[ [1,"j",0] ],
				[ [1,"k",0] ],[ [1,"l",0] ],[ [1,"m",0] ],[ [1,"n",0] ],[ [1,"o",0] ],
				[ [1,"p",0] ],[ [1,"q",0] ],[ [1,"r",0] ],[ [1,"s",0] ],[ [1,"t",0] ],
				[ [1,"u",0] ],[ [1,"v",0] ],[ [1,"w",0] ],[ [1,"x",0] ],[ [1,"y",0] ],
				[ [1,"z",0] ],
				[ [1,"A",0] ],[ [1,"B",0] ],[ [1,"C",0] ],[ [1,"D",0] ],[ [1,"E",0] ],
				[ [1,"F",0] ],[ [1,"G",0] ],[ [1,"H",0] ],[ [1,"I",0] ],[ [1,"J",0] ],
				[ [1,"K",0] ],[ [1,"L",0] ],[ [1,"M",0] ],[ [1,"N",0] ],[ [1,"O",0] ],
				[ [1,"P",0] ],[ [1,"Q",0] ],[ [1,"R",0] ],[ [1,"S",0] ],[ [1,"T",0] ],
				[ [1,"U",0] ],[ [1,"V",0] ],[ [1,"W",0] ],[ [1,"X",0] ],[ [1,"Y",0] ],
				[ [1,"Z",0] ],
				[ [1,"_",0] ],[ [1,"$",0] ]
			],
			"name-char-array" : [
				[ [0,"name-char",0], [0,"name-char-array",0] ],
				[ [0,"name-char",0] ]
			],
			"name" : [
				[ [0,"name-first-char",0], [0,"name-char-array",0] ],
				[ [0,"name-first-char",0] ]
			],
			"name-opt" : [
				[ [0,"name",0] ],
				[ [5,"",0] ]
			],
			"function-definition-attribute2" : [ // not opt
				[ 
					  [1,"@[",0]
					, [0,"function-definition-attribute2-part1",0]
					, [1,"]",0] 
				]
			],
			"function-definition-attribute2-part1" : [
				[ 
					  [0,"space-opt",0]
					, [0,"value-expression",0]
					, [0,"space-opt",0]
					, [0,"function-definition-attribute2-part2",0] 
				]
			],
			"function-definition-attribute2-part2" : [
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"number-integer",0]
					, [0,"space-opt",0]
					, [0,"function-definition-attribute-part3",0] 
				]
			],
			"function-definition-attribute-part3" : [
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"boolean-value",0]
					, [0,"space-opt",0] 
				]
			],
			"function-definition-attribute" : [ // always opt
				[ 
					  [1,"@[",0]
					, [0,"function-definition-attribute-part1",0]
					, [1,"]",0] 
				]
			],
			"function-definition-attribute-part1" : [
				[ 
					  [0,"space-opt",0]
					, [0,"value-expression-opt",0]
					, [0,"space-opt",0]
					, [0,"function-definition-attribute-part2",0] 
				],
				[ 
					  [0,"space-opt",0]
					, [0,"value-expression-opt",0]
					, [0,"space-opt",0] 
				],
				[ 
					  [0,"space-opt",0]
					, [0,"function-definition-attribute-part2",0] 
				],
				[ [5,"",0] ]
			],
			"function-definition-attribute-part2" : [
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"number-integer-opt",0]
					, [0,"space-opt",0]
					, [0,"function-definition-attribute-part3",0] 
				],
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"number-integer-opt",0]
					, [0,"space-opt",0] 
				],
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"function-definition-attribute-part3",0] 
				],
				[ [5,"",0] ]
			],
			"function-definition-attribute-part3" : [
				[ 
					  [1,",",0]
					, [0,"space-opt",0]
					, [0,"boolean-value-opt",0]
					, [0,"space-opt",0] 
				],
				[ 
					  [1,",",0]
					, [0,"space-opt",0] 
				],
				[ [5,"",0] ]
			],
			"function-arguments" : [
				[ 
					 [1,"(",0]
					,[0,"function-arguments-list-opt",0]
					,[1,")",0] 
				],
				[ 
					[0,"name",0]
				]
			],
			"function-arguments-list-opt" : [
				[ [0,"function-arguments-list",0] ],
				[ [0,"space-opt",0] ],
				[ [5,"",0] ]
			],
			"function-arguments-list" : [ // not final
				[ 
					  [0,"space-opt",0]
					, [0,"name",0]
					, [0,"space-opt",0]
					, [1,",",0]
					, [0,"function-arguments-list",0] 
				],
				[ 
					[0,"space-opt",0]
					, [0,"name",0]
					, [0,"space-opt",0] 
				]
			],
			"function-body" : [
				  [ [0,"statement",0] ]
				, [ [0,"block",0] ]
			],
			"block" : [
				[ 
					  [1,"{",0]
					, [0,"space-opt",0]
					, [0,"statement-list-opt",0]
					, [0,"space-opt",0]
					, [1,"}",0] 
				]
			],
			"function-expression" : [
				[
					  [0,"space-opt",0]
					, [0,"function-definition-attribute",0]
					, [0,"space-opt",0]
				],
				[
					  [0,"space-opt",0]
					, [0,"function-arguments",0]
					, [0,"space-opt",0]
					, [1,"=>",0]
					, [0,"space-opt",0]
					, [0,"function-body",0]
					, [0,"space-opt",0]
				]
			],
			"named-operator" : [
				[ [ 0, "function-definition-attribute2",0 ] ],
			],
			"binary-operator" : [
				
				[ [1,"++",0] ], // scalar rotate to right cw
				[ [1,"+",0] ], // scalar
				[ [1,"--",0] ], // scalar rotate to left ccw
				[ [1,"-",0] ], // scalar
				[ [1,"**",0] ], // scalar exp
				[ [1,"*",0] ], // scalar and vector
				[ [1,"/",0] ], // scalar
				[ [1,"%",0] ], // scalar
				[ [1,">>",0] ], // bitwise
				[ [1,"<<",0] ], // bitwise
				[ [1,"||",0] ], // macrologic
				[ [1,"&&",0] ], // macrologic
				[ [1,"^^",0] ], // macro logic version
				[ [1,"^",0] ], // bitwise version (not)
				[ [1,"|",0] ], // bitwise
				[ [1,"&",0] ], // bitwise
				[ [1,"<->",0] ], // macro logic version
				[ [1,"<>",0] ], // <-> bitwise version
				[ [1,"->",0] ], // transfer (depends on context)
				[ [1,"<-",0] ], // transfer (depends on context)
				[ [1,">=",0] ], // macro logic
				[ [1,"<=",0] ], // macro logic
				[ [1,">",0] ], // macro logic
				[ [1,"<",0] ], // macro logic
				[ [1,"==",0] ], // macro logic
				[ [1,"!=",0] ], // macro logic
				[ [1,"..",0] ], // static from type
				[ [1,"b0",0] ], // bitwise
				[ [1,"b1",0] ], // bitwise
				[ [1,"b2",0] ], // bitwise
				[ [1,"b3",0] ], // bitwise
				[ [1,"b4",0] ], // bitwise
				[ [1,"b5",0] ], // bitwise
				[ [1,"b6",0] ], // bitwise
				[ [1,"b7",0] ], // bitwise
				[ [1,"b8",0] ], // bitwise
				[ [1,"b9",0] ], // bitwise
				[ [1,"bA",0] ], // bitwise
				[ [1,"bB",0] ], // bitwise
				[ [1,"bC",0] ], // bitwise
				[ [1,"bD",0] ], // bitwise
				[ [1,"bE",0] ], // bitwise
				[ [1,"bF",0] ], // bitwise
				[ [1,"and",0] ], // bitwise
				[ [1,"or",0] ], // bitwise
				[ [1,"xor",0] ], // bitwise
				[ [1,"xnor",0] ], // bitwise
				[ [1,"first",0] ], // bitwise 2
				[ [1,"second",0] ], // bitwise 4   
				[ [0,"named-operator",0] ]
			],
			"full-identifier" : [
				[ [0,"name",0] ]
			],
			"call-arguments-list" : [
				[ [0,"value-expression-operation",0] , [0,"space-opt",0],[1,",",0],[0,"space-opt",0],[0,"call-arguments-list",0] ],
				[ [0,"value-expression-operation",0] ]
			],
			"call-arguments-opt" : [
				[ [0,"call-arguments-list",0] ],
				[ [5,"",0] ]
			],
			"call-expression" : [
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"call-arguments-opt",0], [0,"space-opt",0], [1,")",0] ]
			],
			"indexed-expression" : [
				[ [0,"space-opt",0], [1,"[",0], [0,"space-opt",0], [0,"value-expression",0], [0,"space-opt",0], [1,"]",0] ]
			],
			"member-expression" : [
				[ [0,"space-opt",0], [1,".",0], [0,"space-opt",0], [0,"full-identifier",0], [0,"space-opt",0] ]
			],
			"ref-connection" : [
				[ [0,"call-expression",0], [0,"ref-connection",0] ],
				[ [0,"call-expression",0] ],
				[ [0,"indexed-expression",0], [0,"ref-connection",0] ],
				[ [0,"indexed-expression",0] ],
				[ [0,"member-expression",0], [0,"ref-connection",0] ],
				[ [0,"member-expression",0] ]
			],
			"ref-expression" : [ // call, indexed, member
				[ [0,"function-expression",0], [0,"call-expression",0], [0,"ref-connection",0] ],
				[ [0,"function-expression",0], [0,"call-expression",0] ],
				[ [0,"full-identifier",0], [0,"ref-connection",0] ],
				[ [0,"full-identifier",0] ]
			],
			"value" : [
				[ [0,"number-integer",0] ],
				[ [0,"boolean-value",0] ],
				[ [0,"string-value",0] ],
				[ [1,"null",0] ],
				[ [1,"undefined",0] ],
				[ [1,"NaN",0] ],
				[ [0,"ref-expression",0] ]
			],
			"value-expression" : [
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-operation",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"value",0] ]
			],
			"value-expression-opt" : [
				[ [0,"value",0] ],
				[ [5,"",0] ]
			],
			"value-expression-unit" : [
				[ [0,"value-expression",0], [0,"space-opt",0], [0,"binary-operator",0], [0,"space-opt",0], [0,"value-expression-unit",0] ],
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-operation",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"value-expression",0] ]
			],
			"value-expression-conditional" : [
				[ 
					  [0,"value-expression-unit",0]
					, [0,"space-opt",0]
					, [1,"?",0]
					, [0,"space-opt",0]
					, [0,"value-expression-unit",0]
					, [0,"space-opt",0]
					, [1,":",0]
					, [0,"space-opt",0]
					, [0,"value-expression-unit", 0]
					, [0,"space-opt",0] 
				]
			],
			"value-expression-operation" : [
			
			
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"name-definition-item",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-operation",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-conditional",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-unit",0], [0,"space-opt",0], [1,")", 0], [0,"space-opt",0] ],
				[ [0,"value-expression-conditional",0] ],
				[ [0,"value-expression-unit",0] ]
			],
			"value-attributes-opt" : [
				[ [0,"space-opt",0], [1,"const",0], [0,"space",0] ],
				[ [5,"",0] ]
			],
			"value-attributes-space-opt" : [
				[ [0,"space",0], [1,"const",0], [0,"space",0] ],
				[ [5,"",0] ]
			],
			"expression" : [
				[ [0,"function-expression",0] ],
				[ [1,"=",0], [0,"space-opt",0], [0,"function-expression",0], [0,"space-opt",0] ],
				[ [1,"=",0], [0,"value-attributes-opt",0], [0,"space-opt",0], [0,"value-expression-operation",0], [0,"space-opt",0] ]
			],
			"statement-list-opt" : [
				[ [0,"statement-list",0] ],
				[ [5,"",0] ]
			],
			"statement-list" : [
				[ [0,"statement",0], [0,"statement-list",0] ],
				[ [0,"statement",0] ]
			],
			"empty-statement" : [
				[ [1,";",0] ]
			],
			"name-definition-item" : [ // name may be a returned string value
				[
					  [0,"space-opt",0]
					, [0,"name",0]
					, [0,"space-opt",0]
					, [0,"value-attributes-space-opt",0]
					, [0,"function-definition-attribute",0]
					, [0,"space-opt",0]
				],
				[
					  [0,"space-opt",0]
					, [0,"name",0]
					, [0,"space-opt",0]
					, [0,"value-attributes-space-opt",0]
					, [0,"function-arguments",0]
					, [0,"space-opt",0]
					, [0,"block",0]
					, [0,"space-opt",0]
				],
				[
					  [0,"space-opt",0]
					, [0,"name",0]
					, [0,"space-opt",0]
					, [0,"expression",0]
					, [0,"space-opt",0]
				]
			],
			"name-definition-list" : [
				[ [0, "name-definition-item",0], [0,"space-opt",0], [1,",",0], [0,"space-opt",0], [0,"name-definition-list",0] ],
				[ [0, "name-definition-item",0] ]
			],
			"name-definition" : [
				[
					  [1,"def",0],[0,"space",0],[0,"name-definition-list",0]
				]
			],
			"set-statement" : [
				[
					[0,"name-definition-list",0]
				]
			],
			"discard-value-statement" : [
				[ [0,"space-opt",0],[0,"value-expression-operation",0],[0,"space-opt",0] ]
			],
			"if-statement" : [
				[ [0,"space-opt",0], [1,"if",0], [0,"space",0], [0,"value-expression-operation",0], [0,"function-body",0], [0,"space-opt",0], [0,"else-statement-opt",0], [0,"space-opt",0] ],
				[ [0,"space-opt",0], [1,"if",0], [0,"space-opt",0], [1,"(",0], [0,"space-opt",0], [0,"value-expression-operation",0], [0,"space-opt",0], [1,")",0], [0,"function-body",0], [0,"space-opt",0], [0,"else-statement-opt",0], [0,"space-opt",0] ],
			],
			"else-statement-opt" : [
				[ [1,"else",0], [0,"space",0], [0,"statement"] ],
				[ [1,"else",0], [0,"space-opt",0], [0,"block"] ],
				[ [5,"",0] ]
			],
			"return-statement" : [
				[ [0,"space-opt",0], [1,"return",0], [0,"space",0], [0,"value-expression-operation",0] ]
			],
			"label-statement" : [
				[ [0,"space-opt",0], [0,"name",0], [0,"space-opt",0], [1,":",0] ]
			],
			"statement" : [
				  [ [0,"label-statement",0] ]
				, [ [0,"return-statement",0] ]
				, [ [0,"if-statement",0] ]  
				, [ [0,"set-statement",0] ]
				, [ [0,"name-definition",0] ]
				//, [ [0,"function-definition",0] ]
				, [ [0,"empty-statement",0] ]
				, [ [0,"discard-value-statement",0] ]
			],
			"main" : [
				[ 
					  [0,"space-opt",0]
					, [0,"statement-list",0]
					, [0,"space-opt",0] 
				],
				[ [5,"",0] ]
			]
		};
		function logicn_arr(op,arr) {
			var i = 0;
			var max = ( 1 << ( 1 << arr.length) ) - 1;
			var c = false;
			for( var x = arr.length-1 ; x>=0 ; x-- ) {
				if( arr[x] == max ) {
					i |= ( 1 << ((arr.length-1)-x) );
				} else if( arr[x] == 0 ) {
					// do nothing
				} else {
					// next
					c = true;
				}
			}
			if(!c) return ( op % ( ( 1 << (i+1) ) >>> 0 ) ) > ( ( ( 1 << i ) >>> 0 ) - 1 ) ? max : 0;
			return null;
		}
		
		
		var bn = new BigInteger("0000010",10);
		console.log(bn.toString(10));
		
		lang.boot = function(ctx) {
			ctx.stack = [];
			
		};
		lang.update = {
			"statement" : function(syntax) {
				
			}
		};
		lang.events = {
			"statement-list" : {
				before : {
					select :[0,2,4],
					handler : function(ctx,i,str) {
						/*
						if(str[1]!="") {
							console.log("@3",str);	
							var a = parseInt(""+str[0],10),
								b = parseInt(""+str[1],10),
								c = parseInt(""+str[2],10);
							
							console.log(a,b,c,logicn_arr(b,[a,c]));
							
						} else {
							console.log("@1",str);
							var a = parseInt(str[0]);
							console.log(a);
							
						}
						*/
					}
				}
			},
			"expression" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("expression",i,str);
					}
				}
			},
			"statement" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("statement",i,str);
					}
				}
			},
			"function-definition" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("function-definition",i,str);
					}
				}
			},
			"if-statement" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("if",i,str);
					}
				}
			},
			"set-statement" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("set",i,str);
					}
				}
			},
			"name-definition" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("name",i,str);
					}
				}
			},
			"function-body" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("function-body",i,str);
					}
				}
			},
			"else-statement-opt" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("else",i,str);
					}
				}
			},
			"name-definition-item" : {
				before : {
					handler : function(ctx,i,str) {
						console.log("name definition item",i,str);
					}
				}
			}
			
		};
		lang.shutdown = function(ctx) {
			
		};
	}
	LOGICUNIT.prototype.run = function(doc,context) {
		var local_context = context || {};
		local_context.core = {};
		local_context.core.boot = this.lang.boot;
		local_context.core.shutdown = this.lang.shutdown;
		local_context.core.filter = this.lang.events;
		var r = Interpreter.parser(doc,Interpreter.pre( this.lang.syntax ),local_context);
		if(r[1]) {
			console.log("@ PARSER COMPLETED >>"+doc.substring(0,r[0])+"<<");
			//console.log(JSON.stringify( r[2].list ) );
		} else {
			console.log("@ PARSER FAIL");
		}
	}
	LOGICUNIT.prototype.tests = function() {
		var tests = [
			"def a(){}",
			"def a@[8,2,true]",
			"def a{}",
			"def a=const 10",
			"def a=10",
			"def a=0x10",
			"def a=true",
			"def a=null",
			"def a=undefined",
			"def a=NaN",
			"def a=10++20,b:32<->c",
			"def a=true?false:true",
			"def a=@[8,2,true]",
			"def a=(x)=>{}",
			"def a=fun1(a+1,b+2,c+3)+4",
			"def a=\"ok\"+\"?\"",
			"def a='ok'", // def a='ok\r\n' // fail, it must, but how to capture?
			"def a=@'ok\r\nfail\r\n'@",
			"def a=\"@((teste1+teste2(a,b,c)+10)>10?true:false) is the result\"",
			"def a=10,b=20",
			"a=10",
			"a=(x,y)=>{y=x+1}",
			"a.b(100)",
			"if a>10+(b>5?10:5) ok()else{fail()fail()return 10;}"
		];
		
		
		for(var x = 0; x < tests.length;x++) {
			var doc = tests[x];
			var r = Interpreter.parser(doc,Interpreter.pre( lang.syntax ),context);
			if(r[1]) {
				console.log("@ PARSER COMPLETED >>"+doc.substring(0,r[0])+"<<");
				//console.log(JSON.stringify( r[2].list ) );
			} else {
				console.log("@ PARSER FAIL");
			}
		}
	}
	
	
	
	return LOGICUNIT;
	
})(this);


var font = (function() {
	var r = {};
	//
	var t = r.translate = {};
	var s = 512;
	
	r["bin1"] = [0,126,195,129,165,129,189,153,195,126,0,0];
	r["bin2"] = [0,126,255,255,219,255,195,231,255,126,0,0];
	r["bin3"] = [0,0,34,119,127,127,127,62,28,8,0,0];
	r["bin4"] = [0,8,28,62,127,127,62,28,8,0,0,0];
	r["bin5"] = [0,24,60,60,255,231,231,24,24,126,0,0];
	r["bin6"] = [0,24,60,126,255,255,126,24,24,126,0,0];
	
	var sfc = function() { return String.fromCharCode(arguments[0]); }
	
	t[1] = sfc(1); // empty smile
	t[2] = sfc(2); // full smile
	t[3] = sfc(3); // heart
	t[4] = sfc(4); // diamond
	t[5] = sfc(5); // club
	t[6] = sfc(6); // spade
	
	r["bin7"] = [0,0,0,0,60,126,126,60,0,0,0,0];
	r["bin9"] = [0,0,60,126,102,66,66,102,126,60,0,0];
	r["bin10"] = [255,255,195,129,153,189,189,153,129,195,255,255];
	r["bin11"] = [0,124,112,92,78,31,51,51,51,30,0,0];
	r["bin12"] = [0,60,102,102,102,60,24,126,24,24,0,0];
	r["bin15"] = [0,0,24,219,126,231,231,126,219,24,0,0];
	r["bin16"] = [0,1,3,7,31,127,31,7,3,1,0,0];
	r["bin17"] = [0,64,96,112,124,127,124,112,96,64,0,0];
	r["bin18"] = [0,24,60,126,24,24,24,126,60,24,0,0];
	r["bin19"] = [0,102,102,102,102,102,102,0,102,102,0,0];
	r["bin20"] = [0,254,219,219,219,222,216,216,216,216,0,0];
	r["bin21"] = [0,126,198,12,60,102,102,60,48,99,126,0];
	r["bin22"] = [0,0,0,0,0,0,0,255,255,255,0,0];
	r["bin23"] = [0,24,60,126,24,24,24,126,60,24,126,0];
	r["bin24"] = [0,24,60,126,24,24,24,24,24,24,0,0];
	r["bin25"] = [0,24,24,24,24,24,24,126,60,24,0,0];
	r["bin26"] = [0,0,0,24,48,127,48,24,0,0,0,0];
	r["bin27"] = [0,0,0,12,6,127,6,12,0,0,0,0];
	r["bin28"] = [0,0,0,3,3,3,255,0,0,0,0,0];
	r["bin29"] = [0,0,0,36,102,255,102,36,0,0,0,0];
	r["bin30"] = [0,0,8,8,28,28,62,62,127,127,0,0];
	r["bin31"] = [0,0,127,127,62,30,28,28,8,8,0,0];
	
	t[7] = sfc(7); t[9] = sfc(9); t[10] = sfc(10);
	t[11] = sfc(11); t[12] = sfc(12); t[15] = sfc(15);
	t[16] = sfc(16); t[17] = sfc(17); t[18] = sfc(18);
	t[19] = sfc(19); t[20] = sfc(20); t[21] = sfc(21);
	t[22] = sfc(22); t[23] = sfc(23); t[24] = sfc(24);
	t[25] = sfc(25); t[26] = sfc(26); t[27] = sfc(27);
	t[28] = sfc(28); t[29] = sfc(29); t[30] = sfc(30);
	t[31] = sfc(31);
	
	r[32] = r[" "] = [0,0,0,0,0,0,0,0,0,0,0,0];
	t[32] = " ";
	

	r[48] = r["0"] = [0,124,198,230,246,214,222,206,198,124,0,0];
	r[49] = r["1"] = [0,16,24,30,24,24,24,24,24,126,0,0];
	r[50] = r["2"] = [0,60,102,102,96,48,24,12,102,126,0,0];
	r[51] = r["3"] = [0,60,102,96,96,56,96,96,102,60,0,0];
	r[52] = r["4"] = [0,96,112,120,108,102,254,96,96,240,0,0];
	r[53] = r["5"] = [0,126,6,6,6,62,96,96,102,60,0,0];
	r[54] = r["6"] = [0,56,12,4,6,62,102,102,102,60,0,0];
	r[55] = r["7"] = [0,254,198,198,192,96,48,24,24,24,0,0];
	r[56] = r["8"] = [0,60,102,102,110,60,118,102,102,60,0,0];
	r[57] = r["9"] = [0,60,102,102,102,124,48,48,24,28,0,0];
	
	t[48] = "0"; t[49] = "1"; t[50] = "2"; t[51] = "3"; t[52] = "4";
	t[53] = "5"; t[54] = "6"; t[55] = "7"; t[56] = "8"; t[57] = "9";
	
	r[65+s] = r["A"] = [0,24,60,102,102,102,126,102,102,102,0,0];
	r[66+s] = r["B"] = [0,126,204,204,204,124,204,204,204,126,0,0];
	r[67+s] = r["C"] = [0,120,204,198,6,6,6,198,204,120,0,0];
	r[68+s] = r["D"] = [0,62,108,204,204,204,204,204,108,62,0,0];
	r[69+s] = r["E"] = [0,254,140,12,76,124,76,12,140,254,0,0];
	r[70+s] = r["F"] = [0,254,140,12,76,124,76,12,12,30,0,0];
	r[71+s] = r["G"] = [0,120,204,198,6,6,230,198,204,248,0,0];
	r[72+s] = r["H"] = [0,102,102,102,102,126,102,102,102,102,0,0];
	r[73+s] = r["I"] = [0,60,24,24,24,24,24,24,24,60,0,0];
	r[74+s] = r["J"] = [0,240,96,96,96,96,102,102,102,60,0,0];
	r[75+s] = r["K"] = [0,206,204,108,108,60,108,108,204,206,0,0];
	r[76+s] = r["L"] = [0,30,12,12,12,12,140,204,204,254,0,0];
	r[77+s] = r["M"] = [0,198,238,254,254,214,198,198,198,198,0,0];
	r[78+s] = r["N"] = [0,198,198,206,222,254,246,230,198,198,0,0];
	r[79+s] = r["O"] = [0,56,108,198,198,198,198,198,108,56,0,0];
	r[80+s] = r["P"] = [0,126,204,204,204,124,12,12,12,30,0,0];
	r[81+s] = r["Q"] = [0,56,108,198,198,198,230,246,124,96,240,0];
	r[82+s] = r["R"] = [0,126,204,204,204,124,108,204,204,206,0,0];
	r[83+s] = r["S"] = [0,60,102,102,6,28,48,102,102,60,0,0];
	r[84+s] = r["T"] = [0,126,90,24,24,24,24,24,24,60,0,0];
	r[85+s] = r["U"] = [0,102,102,102,102,102,102,102,102,60,0,0];
	r[86+s] = r["V"] = [0,102,102,102,102,102,102,102,60,24,0,0];
	r[87+s] = r["W"] = [0,198,198,198,198,214,214,108,108,108,0,0];
	r[88+s] = r["X"] = [0,102,102,102,60,24,60,102,102,102,0,0];
	r[89+s] = r["Y"] = [0,102,102,102,102,60,24,24,24,60,0,0];
	r[90+s] = r["Z"] = [0,254,230,50,48,24,12,140,198,254,0,0];
	
	t[65+s] = "A"; t[66+s] = "B"; t[67+s] = "C"; t[68+s] = "D"; t[69+s] = "E";
	t[70+s] = "F"; t[71+s] = "G"; t[72+s] = "H"; t[73+s] = "I"; t[74+s] = "J";
	t[75+s] = "K"; t[76+s] = "L"; t[77+s] = "M"; t[78+s] = "N"; t[79+s] = "O";
	t[80+s] = "P"; t[81+s] = "Q"; t[82+s] = "R"; t[83+s] = "S"; t[84+s] = "T";
	t[85+s] = "U"; t[86+s] = "V"; t[87+s] = "W"; t[88+s] = "X"; t[89+s] = "Y";
	t[90+s] = "Z";
	
	r[65] = r["a"] = [0,0,0,0,60,96,124,102,102,220,0,0];
	r[66] = r["b"] = [0,14,12,12,124,204,204,204,204,118,0,0];
	r[67] = r["c"] = [0,0,0,0,60,102,6,6,102,60,0,0];
	r[68] = r["d"] = [0,112,96,96,124,102,102,102,102,220,0,0];
	r[69] = r["e"] = [0,0,0,0,60,102,126,6,102,60,0,0];
	r[70] = r["f"] = [0,56,108,12,12,62,12,12,12,30,0,0];
	r[71] = r["g"] = [0,0,0,0,220,102,102,102,124,96,102,60];
	r[72] = r["h"] = [0,14,12,12,108,220,204,204,204,206,0,0];
	r[73] = r["i"] = [0,24,24,0,30,24,24,24,24,126,0,0];
	r[74] = r["j"] = [0,96,96,0,120,96,96,96,96,102,102,60];
	r[75] = r["k"] = [0,14,12,12,204,108,60,108,204,206,0,0];
	r[76] = r["l"] = [0,30,24,24,24,24,24,24,24,126,0,0];
	r[77] = r["m"] = [0,0,0,0,126,214,214,214,214,198,0,0];
	r[78] = r["n"] = [0,0,0,0,62,102,102,102,102,102,0,0];
	r[79] = r["o"] = [0,0,0,0,60,102,102,102,102,60,0,0];
	r[80] = r["p"] = [0,0,0,0,118,204,204,204,204,124,12,30];
	r[81] = r["q"] = [0,0,0,0,220,102,102,102,102,124,96,240];
	r[82] = r["r"] = [0,0,0,0,110,236,220,12,12,30,0,0];
	r[83] = r["s"] = [0,0,0,0,60,102,12,48,102,60,0,0];
	r[84] = r["t"] = [0,0,8,12,126,12,12,12,108,56,0,0];
	r[85] = r["u"] = [0,0,0,0,102,102,102,102,102,220,0,0];
	r[86] = r["v"] = [0,0,0,0,102,102,102,102,60,24,0,0];
	r[87] = r["w"] = [0,0,0,0,198,198,214,214,108,108,0,0];
	r[88] = r["x"] = [0,0,0,0,198,108,56,56,108,198,0,0];
	r[89] = r["y"] = [0,0,0,0,102,102,102,60,48,24,15,0];
	r[90] = r["z"] = [0,0,0,0,126,98,48,12,70,126,0,0];
	
	t[65] = "a"; t[66] = "b"; t[67] = "c"; t[68] = "d"; t[69] = "e";
	t[70] = "f"; t[71] = "g"; t[72] = "h"; t[73] = "i"; t[74] = "j";
	t[75] = "k"; t[76] = "l"; t[77] = "m"; t[78] = "n"; t[79] = "o";
	t[80] = "p"; t[81] = "q"; t[82] = "r"; t[83] = "s"; t[84] = "t";
	t[85] = "u"; t[86] = "v"; t[87] = "w"; t[88] = "x"; t[89] = "y";
	t[90] = "z";
	
	r[96] = r["`"] = r["&#96;"] = r["&grave;"] = [0,6,6,12,0,0,0,0,0,0,0,0];
	
	r["&Aacute;"] = [96,48,0,24,60,102,102,126,102,102,0,0];
	r["Á"] = r["&Aacute;"];
	r["&Eacute;"] = [96,48,0,126,70,6,62,6,70,126,0,0];
	r["É"] = r["&Eacute;"];
	r["&Iacute;"] = [48,24,0,60,24,24,24,24,24,60,0,0];
	r["Í"] = r["&Iacute;"];
	r["&Oacute;"] = [48,24,0,60,102,102,102,102,102,60,0,0];
	r["Ó"] = r["&Oacute;"];
	r["&Uacute;"] = [48,24,0,102,102,102,102,102,102,60,0,0];
	r["Ú"] = r["&Uacute;"];
	
	r["&aacute;"] = [96,48,24,0,60,96,124,102,102,220,0,0];
	r["á"] = r["&aacute;"];
	r["&eacute;"] = [96,48,24,0,60,102,126,6,102,60,0,0];
	r["é"] = r["&eacute;"];
	r["&iacute;"] = [96,48,24,0,30,24,24,24,24,126,0,0];
	r["í"] = r["&iacute;"];
	r["&oacute;"] = [96,48,24,0,60,102,102,102,102,60,0,0];
	r["ó"] = r["&oacute;"];
	r["&uacute;"] = [96,48,24,0,102,102,102,102,102,220,0,0];
	r["ú"] = r["&uacute;"];
	r["&Agrave;"] = [12,24,0,24,60,102,102,126,102,102,0,0];
	r["À"] = r["&Agrave;"];
	r["&Egrave;"] = [12,24,0,126,70,6,62,6,70,126,0,0];
	r["È"] = r["&Egrave;"];
	r["&Igrave;"] = [12,24,0,60,24,24,24,24,24,60,0,0];
	r["Ì"] = r["&Igrave;"];
	r["&Ograve;"] = [12,24,0,60,102,102,102,102,102,60,0,0];
	r["Ò"] = r["&Ograve;"];
	r["&Ugrave;"] = [12,24,0,102,102,102,102,102,102,60,0,0];
	r["Ù"] = r["&ugrave;"];
	r["&agrave;"] = [6,12,24,0,60,96,124,102,102,220,0,0];
	r["à"] = r["&agrave;"];
	r["&egrave;"] = [6,12,24,0,60,102,126,6,102,60,0,0];
	r["è"] = r["&egrave;"];
	r["&igrave;"] = [6,12,24,0,30,24,24,24,24,126,0,0];
	r["ì"] = r["&igrave;"];
	r["&ograve;"] = [6,12,24,0,60,102,102,102,102,60,0,0];
	r["ò"] = r["&ograve;"];
	r["&ugrave;"] = [6,12,24,0,102,102,102,102,102,220,0,0];
	r["ù"] = r["&ugrave;"];
	r["&atilde;"] = [0,220,118,0,60,96,124,102,102,220,0,0];
	r["ã"] = r["&atilde;"];
	r["&otilde;"] = [0,220,118,0,60,102,102,102,102,60,0,0];
	r["õ"] = r["&otilde;"];
	r["&ccedil;"] = [0,0,0,0,60,102,6,6,102,60,24,12];
	r["ç"] = r["&ccedil;"];
	r["&Ccedil;"] = [0,120,204,198,6,6,6,198,204,120,48,24];
	r["Ç"] = r["&Ccedil;"];
	r["&Auml;"] = [0,102,0,24,60,102,102,126,102,102,0,0];
	r["Ä"] = r["&Auml;"];
	r["&Euml;"] = [0,102,0,126,70,6,62,6,70,126,0,0];
	r["Ë"] = r["&Euml;"];
	r["&Iuml;"] = [0,102,0,60,24,24,24,24,24,60,0,0];
	r["Ï"] = r["&Iuml;"];
	r["&Ouml;"] = [0,102,0,60,102,102,102,102,102,60,0,0];
	r["Ö"] = r["&Ouml;"];
	r["&Uuml;"] = [0,102,0,102,102,102,102,102,102,60,0,0];
	r["Ü"] = r["&Uuml;"];
	r["&auml;"] = [0,102,102,0,60,96,124,102,102,220,0,0];
	r["ä"] = r["&auml;"];
	r["&euml;"] = [0,102,102,0,60,102,126,6,102,60,0,0];
	r["ë"] = r["&euml;"];
	r["&iuml;"] = [0,102,102,0,30,24,24,24,24,126,0,0];
	r["ï"] = r["&iuml;"];
	r["&ouml;"] = [0,102,102,0,60,102,102,102,102,60,0,0];
	r["ö"] = r["&ouml;"];
	r["&uuml;"] = [0,102,102,0,102,102,102,102,102,220,0,0]
	r["ü"] = r["&uuml;"];
	r["&Acirc;"] = [24,36,0,24,60,102,102,126,102,102,0,0];
	r["Â"] = r["&Acirc;"];
	r["&Ecirc;"] = [24,36,0,126,70,6,62,6,70,126,0,0];
	r["Ê"] = r["&Ecirc;"];
	r["&Icirc;"] = [24,36,0,60,24,24,24,24,24,60,0,0];
	r["Î"] = r["&Icirc;"];
	r["&Ocirc;"] = [24,36,0,60,102,102,102,102,102,60,0,0];
	r["Ô"] = r["&Ocirc;"];
	r["&Ucirc;"] = [24,36,0,102,102,102,102,102,102,60,0,0];
	r["Û"] = r["&Ucirc;"];
	r["&acirc;"] = [24,36,66,0,60,96,124,102,102,220,0,0];
	r["â"] = r["&acirc;"];
	r["&ecirc;"] = [24,36,66,0,60,102,126,6,102,60,0,0];
	r["ê"] = r["&ecirc;"];
	r["&icirc;"] = [24,36,66,0,30,24,24,24,24,126,0,0];
	r["î"] = r["&icirc;"];
	r["&ocirc;"] = [24,36,66,0,60,102,102,102,102,60,0,0];
	r["ô"] = r["&ocirc;"];
	r["&ucirc;"] = [24,36,66,0,102,102,102,102,102,220,0,0];
	r["û"] = r["&ocirc;"];
	r["&ntilde;"] = [0,220,118,0,62,102,102,102,102,102,0,0];
	r["ñ"] = r["&ntilde;"];
	r["&Ntilde;"] = [220,118,0,198,206,222,246,230,198,198,0,0];
	r["Ñ"] = r["&Ntilde;"];
	r["&uml;"] = [0,102,102,0,0,0,0,0,0,0,0,0];
	//r["\""] = r["&uml;"];
	
	r[186] = r[";"] = [0,0,0,28,28,0,0,28,28,24,12,0];
	r[187] = r["="] = [0,0,0,0,126,0,126,0,0,0,0,0];
	r[188] = r[","] = [0,0,0,0,0,0,0,0,28,28,6,0];
	r[189] = r["-"] = [0,0,0,0,0,126,0,0,0,0,0,0];
	r[190] = r["."] = [0,0,0,0,0,0,0,0,28,28,0,0];
	r[191] = r["/"] = [0,0,0,64,96,48,24,12,6,2,0,0];
	r[219] = r["["] = [0,30,6,6,6,6,6,6,6,30,0,0];
	r[220] = r["\\"] = [0,0,0,2,6,12,24,48,96,64,0,0];
	r[221] = r["]"] = [0,120,96,96,96,96,96,96,96,120,0,0];
	r[222] = r["'"] = [0,24,24,24,0,0,0,0,0,0,0,0];
	r[48+s] = r[")"] = [0,6,12,24,48,48,48,24,12,6,0,0];
	r[49+s] = r["!"] = [0,24,60,60,60,24,24,0,24,24,0,0];
	r[50+s] = r["@"] = [0,124,198,198,246,246,246,6,6,124,0,0];
	r[51+s] = r["#"] = [0,108,108,254,108,108,108,254,108,108,0,0];
	r[52+s] = r["$"] = [24,24,124,6,6,60,96,96,62,24,24,0];
	r[53+s] = r["%"] = [0,0,0,70,102,48,24,12,102,98,0,0];
	r[54+s] = r["^"] = [16,56,108,198,0,0,0,0,0,0,0,0];
	r[55+s] = r["&"] = [0,28,54,54,28,190,246,102,118,220,0,0];
	r[56+s] = r["*"] = [0,0,0,102,60,255,60,102,0,0,0,0];
	r[57+s] = r["("] = [0,96,48,24,12,12,12,24,48,96,0,0];
	
	
	r[186+s] = r[":"] = [0,0,0,28,28,0,0,28,28,0,0,0];
	r[187+s] = r["+"] = [0,0,0,24,24,126,24,24,0,0,0,0];
	r[188+s] = r["<"] = [0,96,48,24,12,6,12,24,48,96,0,0];
	r[189+s] = r["_"] = [0,0,0,0,0,0,0,0,0,0,255,0];
	r[190+s] = r[">"] = [0,6,12,24,48,96,48,24,12,6,0,0];
	r[191+s] = r["?"] = [0,0,60,102,96,48,24,24,0,24,24,0];
	r[192+s] = r["~"] = [206,91,115,0,0,0,0,0,0,0,0,0];
	r[219+s] = r["{"] = [0,112,24,24,12,6,12,24,24,112,0,0];
	r[220+s] = r["|"] = [0,24,24,24,24,0,24,24,24,24,0,0];
	r[221+s] = r["}"] = [0,14,24,24,48,96,48,24,24,14,0,0];
	r[222+s] = r["\""] = [0,204,204,204,0,0,0,0,0,0,0,0];
	
	t[186] = ";"; t[187] = "="; t[188] = ","; t[189] = "-"; t[190] = ".";
	t[191] = "/"; t[219] = "["; t[220] = "\\"; t[221] = "]"; t[222] = "'";
	t[48+s] = ")"; t[49+s] = "!"; t[50+s] = "@"; t[51+s] = "#";  t[52+s] = "$";
	t[53+s] = "%"; t[54+s] = "^"; t[55+s] = "&"; t[56+s] = "*"; t[57+s] = "(";
	t[186+s] = ":"; t[187+s] = "+"; t[188+s] = "<"; t[189+s] = "_"; t[190+s] = ">";
	t[191+s] = "?"; t[192+s] = "~"; t[219+s] = "{"; t[220+s] = "|"; t[221+s] = "}";
	t[222+s] = "\"";
	
	r["carat"] = [0,0,0,0,0,0,0,0,0,255,255,0];
	r["carat_v"] = [1,1,1,1,1,1,1,1,1,1,1,1];
	
	r["w179"] = [
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		8
	]
	
	r[32] = r["blank"] = [0,0,0,0,0,0,0,0,0,0,0,0]; // space
	r.meta = {};
	r.meta.width = 8;
	r.meta.height = 12;
	
	
	
	return r;
})();
	
	

function Color() {}
Color.RGB = function() {}
Color.RGB.slerp_environment = function(progress,grad_arr, proportion_array) {
	if(grad_arr.length != (proportion_array.length+1)) {
		throw "error: second argument(grad_arr) is color separators, third argument(proportion_array) is period between transition, must have size N+1 and N.";
	}
	var start_color_array = [];
	var end_color_array = [];
	var f = function() {
		grad_arr.unshift( grad_arr[0] );
		for(var x = 1; x < grad_arr.length;x++) {
			start_color_array.push(grad_arr[x-1]);
			end_color_array.push(grad_arr[x]);
		}
		
	
		//console.log("A");
		this.x = 0;
		this.normalized = [0];
		this.last = 0;
		
		var arr_sum = [];
		var sum = 0;
		
		for(var x = 0; x < proportion_array.length;x++) {
			sum += proportion_array[x]
			this.normalized.push(sum);
		}
		for(var x = 0; x < this.normalized.length;x++) {
			this.normalized[x] = this.normalized[x]/sum;
		}
		this.buffer = [
			// start element
			[
				( ( parseInt( start_color_array[0][0]) & 0xFF ) ) ,
				( ( parseInt( start_color_array[0][1]) & 0xFF ) ) ,
				( ( parseInt( start_color_array[0][2]) & 0xFF ) )
			]
		];
		//console.log("@0",this.normalized);
		
	};
	f.prototype.get = function(last_progress, progress) {
		var sel = -1;
		for(var x = 1; x < this.normalized.length;x++) {
			if(progress < this.normalized[x] && progress >= this.normalized[x-1]) {
				sel = x;
				break;
			}
			if(x==this.normalized.length-1 && progress == this.normalized[x]) {
				sel = x;
				break;
			}
		}
		
		//console.log("@1",sel,progress,this.normalized,this.normalized[sel],this.normalized[sel-1]);
		if(sel == -1)
			return 0;
		
		var v = null;
		/*
		console.log(parseInt(  (progress-this.normalized[sel-1])*end_color_array[sel][0]/(this.normalized[sel]-this.normalized[sel-1])
					+ (this.normalized[sel]-progress)*start_color_array[sel-1][0]/(this.normalized[sel] - this.normalized[sel-1])
					
				) & 0xFF
			);
		*/
		var a = (progress-this.normalized[sel-1]);
		var b = (this.normalized[sel]-progress);
		var c  = (this.normalized[sel]-this.normalized[sel-1]);
		//console.log(" @2" ,sel,a,b,c);
		//console.log(" @3" ,end_color_array[sel],start_color_array[sel-1],end_color_array,start_color_array);
		a /= c;
		b /= c;
		//console.log(" @4" ,a,b);
		v = [ 
			parseInt( a*end_color_array[sel][0] + b*start_color_array[sel][0] ) & 0xFF
			, parseInt( a*end_color_array[sel][1] + b*start_color_array[sel][1] ) & 0xFF 
			, parseInt( a*end_color_array[sel][2] + b*start_color_array[sel][2] ) & 0xFF 
		];
		//console.log(" @5",v)
		//this.buffer.push(v);
		//this.buffer.shift(); //stop record; // throw old
		return v; //this.buffer[ this.buffer.length-1];
	};
	return new f();
}






var appWorker = {
	"textscroller" : {},
	"audiofilter" : {},
	"compiler" : {}
	
	// ideas to use worker
	// ...
}

var cpu = {
	SO : {
		type : {
			alpha : {
				app : {
				}
			},
		},
		loadedApps : [],
		loadedUsers : []
	},
	users : [],
	selectedSO : "alpha"
}

cpu.SO.type[cpu.selectedSO].app.textscroller = {
	data : null,
	command : function(args) {
		if( args.command == "clear" ) {
			var td = this.data;
			td.textscroller.k = 0;
			td.textscroller.str = td.textscroller.brand;
		}
	},
	fillRect : function(img,r,g,b,a,x,y,_w,_h) {
		var td = this.data;
		for(var top = y; top < y+_h;top++) {
			for(var left = x; left < x+_w;left++) {
				var pos = (( top*td.width + left ) << 2);
				img.data[ pos + 0 ] = r;
				img.data[ pos + 1 ] = g;
				img.data[ pos + 2 ] = b;
				img.data[ pos + 3 ] = a;
			}
		}
		return img;
	},
	drawRect : function(img,r,g,b,a,x,y,_w,_h) {
		var td = this.data;
		for(var top = y; top < y+_h;top++) {
			var pos = (( top*td.width + x ) << 2);
			img.data[ pos + 0 ] = r;
			img.data[ pos + 1 ] = g;
			img.data[ pos + 2 ] = b;
			img.data[ pos + 3 ] = a;
		}
		for(var top = y; top < y+_h;top++) {
			var pos = (( top*td.width + x+_w ) << 2);
			img.data[ pos + 0 ] = r;
			img.data[ pos + 1 ] = g;
			img.data[ pos + 2 ] = b;
			img.data[ pos + 3 ] = a;
		}
		for(var left = x; left < x+_w;left++) {
			var pos = (( y*td.width + left ) << 2);
			img.data[ pos + 0 ] = r;
			img.data[ pos + 1 ] = g;
			img.data[ pos + 2 ] = b;
			img.data[ pos + 3 ] = a;
		}
		for(var left = x; left < x+_w;left++) {
			var pos = (( (y+_h)*td.width + left ) << 2);
			img.data[ pos + 0 ] = r;
			img.data[ pos + 1 ] = g;
			img.data[ pos + 2 ] = b;
			img.data[ pos + 3 ] = a;
		}
	},
	init : function(args) {
		// args
		var td = this.data = {};
		td.reader = {
			offset : 0
		};
				
		td.paused = false;
		td.time = new Number(new Date())
		td.width = args.width;
		td.height = args.height;
		
		td.pages = [];
		td.raw_pages = args.text.split("::::NP");
		
		console.log(td.pages);
		td.watermark = "<!--http://numbercooler.github.io //-->";
		
		// text parser
		td.marks = [];
		var context = {};
		context.top = 0;
		context.left = 0;
		
		var page = td.raw_pages; // raw pages
		
		console.log("@@@@@@@@@@@@@@@PAGE:","##",td.raw_pages.length,"##");
		//console.log(td.pages[0].length);
		for(var x = 0; x < td.raw_pages.length;x++) {
			
			(function(x) {
				var page_form = {
					lines : null,
					length : 0,
					hash : []
				};
				
				console.log("page index:",td.pages.length);
				console.log("page size:",page[x].length);
				
				// na contagem do tamanho do texto o texto já tem que estar em um formato puro de ascii art
				// pois nao pode haver linhas de tamanhos diferentes(principalmente com impares e pares em tamanho de coluna)
				
				/*
					parser each page
					
					console.log(Languages);
					var l = new Languages.LOGICUNIT();
					l.reset();
					
					context.state = "acquire_frame";
					
					l.run("def a="+td.pages[x] ,context);
					task : parser to get ascii video string to structured data
					px = px+offset
					// offset is already parsed data
				*/
				
				var lines = null;
				if(page[x].indexOf("\r\n")!=-1) lines = page[x].split("\r\n");
				else lines = page[x].split("\n");
				if(lines[lines.length-1]=="") lines.pop();
				lines.push( td.watermark );
				
				if(lines.length>0 && lines[0]=="") lines.shift();
				
				console.log(lines);
				
				page_form.lines = lines;
				
				td.pages.push( page_form );
				
				var sum = 0;
				
				for(var z = 0; z < lines.length;z++) {
					(function(z) {
						var str = lines[z];
						// parser is done here, replacing format line to formated line data
						var _ops = [];
						// replace array of string to array of objects
						page_form.lines[z] = { pure : str, ops : _ops,  length : str.length };
						for(var w = 0; w < str.length;w++) {
							(function(x,w) {
								var char_obj = {
									color : [
										// parseInt( Math.random()*255)
										//,parseInt( Math.random()*255)
										//,parseInt( Math.random()*255)
										0
										,255
										,255
									],
									rawChar : str.charAt(w),
									line : z,
									col : w
								};
								_ops.push( char_obj );
								page_form.hash.push(char_obj);
								sum += 1;	
							})(x,w);
						}
					})(z);
				}
				page_form.length = sum;
				console.log("-----------------------------------------");
			})(x);
		}
		
		console.log("total pages:",td.pages.length);
		console.log("calculating timings");
		td.grad1 = Color.RGB.slerp_environment(0,[[0x80,0x80,0x80],[0xFF,0xFF,0xFF],[0x80,0x80,0x80],[0xFF,0xFF,0xFF],[0x80,0x80,0x80]], [25,25,25,25]);
		td.grad2 = Color.RGB.slerp_environment(0,[[0x70,0x70,0x70],[0x0,0x0,0x0],[0x70,0x70,0x70]], [487,487]);
		td.last_play_timeline = 0;
		td.play_timeline = 0;
		//console.log("A");	
		
		// max 113 x 39 (for a while)
		td.k = 0;
		td.str_pos = 0;
		td.delay = 0;
		td.pageK = 0;
		td.pageIndex = 0;
		
		td.pageK = [0]; // pages.length +1
		td.delays = [];
		td.mocksum = [0];
		var framec = 0;
		var mocksum = 0;
		// calculate timings of video
		var delay = 100;
		var sum = 0;	
		for(var x = 0; x < td.pages.length;x++) {
			sum = 0;
			for(var y = 0; y < td.pages[x].lines.length;y++) { sum += td.pages[x].lines[y].length; }
			sum += delay;
			td.pageK.push(sum);
			if(x>0) td.mocksum.push(mocksum);
			mocksum += sum;
		}
		console.log("duration:",mocksum+1);
		td.pageK.push(sum);
		td.mocksum.push(mocksum);
		
		td.total = mocksum+1;
		console.log(td.mocksum,td.pageK);
		console.log("setTotalFrames");
		
		self.postMessage({app:"textscroller",method:"setTotalFrames",args:[td.total]});
		
	},
	render : function(args) {
		var td = this.data;
		if(td==null) {
			self.postMessage({app:"textscroller",method:"reset",args:["0_0xF"]});
			return;
		}
		//console.log("START",td);
		var check = true;
		while(check) {
			if( (td.k - td.mocksum[td.pageIndex]) > td.pageK[td.pageIndex+1]) {
				td.pageIndex = ( td.pageIndex + 1 ) % td.pages.length;
				if(td.pageIndex==0) td.k = 0;
				//console.log(td.k,td.pageIndex,td.pages[td.pageIndex],td.mocksum[td.pageIndex],td.pageK[ td.pageIndex+1]);
			}
			if( (td.k - td.mocksum[td.pageIndex]) <= td.pageK[td.pageIndex+1] ) {
				check = false;
				//console.log("PRINT");
				var c0 = td.grad1.get(td.last_play_timeline,td.play_timeline);
				var c1 = td.grad2.get(td.last_play_timeline,td.play_timeline);	
				td.last_play_timeline = td.play_timeline;
				var cycles = 2;
				var arg0 = cycles*2*Math.PI * td.k/td.total - Math.PI/2 - Math.PI,
					arg1 = cycles*2*Math.PI * td.k/td.total - Math.PI - Math.PI;
				while(arg0 > 2*Math.PI) arg0 -= 2*Math.PI;
				while(arg1 > 2*Math.PI) arg1 -= 2*Math.PI;
				while(arg0 < 0) arg0 += 2*Math.PI;
				while(arg1 < 0) arg1 += 2*Math.PI;
				var rot = -0.45;//(Math.sin(arg0 )/2); // same frequency same phase
				var rot2 = (Math.cos(arg1 )/2); // same frequency different phase
				var str = td.pages[td.pageIndex];
				var page = str;
				var k = (td.k-td.mocksum[td.pageIndex])%page.hash.length;
				
				var current_frame_at_page = td.k - td.mocksum[td.pageIndex];
				if(current_frame_at_page > page.hash.length) { 
					//console.log("delay","frame at page",td.k-td.mocksum[td.pageIndex]); // started delaying before it ends print
					k = page.hash.length; 
					px_max = page.hash.length-1;
				}
				
				var px_max = 0;
				
				var str = [], line = 0, ch = 0;
				var last = null;
				var max_line_length = 0;
				
				// calculate format
				for(var z = 0; z < k;z++) { // k increases by frame
					if( ch >= page.lines[line].ops.length ) {
						line += 1;
						ch = 0;
					}
					while(page.lines[line].ops.length==0) line += 1;
					last = page.lines[line].ops[ch];
					if(last.col > max_line_length) {
						max_line_length = last.col;
					}
					ch += 1;
				}
				var max_lines = line;
				var m = max_line_length;
				if(m<1) m = 1;
				var div_w = 8*(m+1);
				var div_h = 12*(max_lines+1);
				//var tile = parseInt(10+rot*100)>>>0;
				var pw = parseFloat(td.width)/parseFloat(div_w);
				var ph = parseFloat(td.height)/parseFloat(div_h);
				//(-1/2+rot)
				var tile_w = parseInt(pw), tile_h = parseInt(ph); // pixel size
				//if(tile_w<1) tile_w = 1;
				
				var imgData = { data : new Uint8ClampedArray(parseInt( td.width*td.height*4) ) };
				this.fillRect(imgData,0,0,0,255,0,0,td.width,td.height); // clear
				
				var cx = (parseFloat(td.width/2)-(parseFloat(div_w)*Math.abs(tile_w))/2.0),
					cy = (parseFloat(td.height/2)-(parseFloat(div_h)*Math.abs(tile_h))/2.0);
					
				var str = [], line = 0, ch = 0;
				for(var z = 0; z < k;z++) { // k increases by frame
					if( ch >= page.lines[line].ops.length ) {
						line += 1; ch = 0; str.push("\r\n");
					}
					while(page.lines[line].ops.length==0) line += 1;
					var charData = page.lines[line].ops[ch].rawChar;
					str.push( charData );
					if( charData != "\r" && charData != "\n" ) {
						for(var y = 0; y < 12;y++) {
							for(var x = 0; x < 8;x++) {
								if(  ( font[ page.lines[line].ops[ch].rawChar  ][ y ] & (1 << x)  )!=0 ) {
									this.fillRect(imgData,
										//c0[0],c0[1],c0[2],255,
										c0[0],page.lines[line].ops[ch].color[1],page.lines[line].ops[ch].color[2],255,
										parseInt(cx + ch*8*Math.abs(tile_w) +x*Math.abs(tile_w) ),
										parseInt(cy + line*12*Math.abs(tile_h) + y*Math.abs(tile_h)),
										Math.abs(tile_w)>>>0,
										Math.abs(tile_h)>>>0
									)
								}
							}
						}
					}
					ch += 1;
				}
				
				// this confirms steps
				// console.log("string:",str.join(""));
				
				td.play_timeline = (td.k%((td.total/cycles)>>>0))/((td.total/cycles)>>>0);
				var a = (new Number( (new Date()) ));
				/*
				console.log(
					td.k,
					"<< H[" + ((((a-dt)/4800000) >>> 0).toString(10)) + "]:M["+
					((((a-dt)/60000) >>> 0).toString(10)) + "]:S[" +
					((   (((a-dt)/1000)%60)    >>> 0).toString(10)) + "]|" + ((   ((a-dt)/1000)    >>> 0).toString(10))  + "|>> ",
					tile_w
					
				);
				*/
				td.k+=1;
				self.postMessage({app:"textscroller",method:"render",args:[imgData]});
			} 
		}
	}
}

			
self.addEventListener('message', function(e) {
	//self.postMessage({method:"message",args:["I'm ready."]});
	var json = e.data;
	if(json.app=="CPU") {
		if(json.method=="close") {
			self.close();		
		}
	} else {
		cpu.SO
			.type[ cpu.selectedSO ]
			.app[json.app][json.method].apply(
			cpu.SO
				.type[ cpu.selectedSO ]
				.app[json.app]
				, json.args
		);
	}
	//self.postMessage({method:"message",args:["I'm iddle."]});
}, false);