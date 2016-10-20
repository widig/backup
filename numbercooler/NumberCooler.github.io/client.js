// current draft
		
		
Class.define("CPU",{
	ctor : function(auth) {
	
		this.internal.CPU.installed = [];
		this.internal.CPU.installedByName = {};
		this.internal.CPU.installedById = {};
		
		this.internal.CPU.installed_log = {}; // removed from services, but still running some instance of worker
		
		this.internal.CPU.running = [];
		this.internal.CPU.runningByName = {};
		this.internal.CPU.runningById = {};
		
		this.internal.CPU.running_log = {}; // custom service data, changed at runtime, must track changes
		
		this.internal.CPU.id_count = 0;
		this.internal.CPU.iid_count = 0;
		this.internal.CPU.crc = 0xAAAAAAAA;
		
	},
	proto : {
		installService : function(auth,name,str) {
			var i = this.internal.CPU;
			var buffer = new Uint8Array(str.length);
			for(var x = 0; x < str.length;x++) {
				var ch = str.charCodeAt(x);
				buffer[x] = ch;
			}
			var blob = new Blob([buffer],{type:"application/js"});
			var url = URL.createObjectURL(blob);
			this.internal.CPU.iid_count++;
			this.internal.CPU.crc = this.internal.CPU.crc ^ this.internal.CPU.iid_count;
			var instance = { // service instance
				name : name,
				code : str,
				url : url,
				check : this.internal.CPU.crc
			};
			i.installed[name] = instance;
		},
		uninstallService : function(auth,name) {
		},
		upgradeService : function(auth,name,str) { // upgrade
		},
		downgradeService : function(auth,name,crc) {
		},
		startWorker : function(auth,name) {
			// return worker
			var instance = { // worker instance
				id : this.internal.CPU.id_count,
				worker : new Worker( this.internal.installed[name] )
			};
			this.internal.CPU.id_count++;
			this.internal.CPU.runningByName[name] = [instance];
			this.internal.CPU.runningById[instance.id] = [instance];
			return instance;
		},
		fireWorker : function(auth,id) {
		},
		replaceWorker : function(auth,id,str) {
		},
		getWorkerCode : function(auth) {
			
		},
		listServices : function() {
			var i = this.internal.CPU;
			var r = [];
			for(var name in i.installed) {
				r.push(name);
			}
			return r;
		},
		listWorkers : function(name) {
			var i = this.internal.CPU;
			var r = {};
			for(var name in i.runningByName) {
				// r[name]
			}
		}
	}
});




(function() {
	var __kernel_singleton = null;
	var __kernel_hash = null;
	
	var __kernel_sha3 = {};
	
	
	/*
	 * js-sha3 v0.5.1
	 * https://github.com/emn178/js-sha3
	 *
	 * Copyright 2015, emn178@gmail.com
	 *
	 * Licensed under the MIT license:
	 * http://www.opensource.org/licenses/MIT
	 */
	;(function(root, undefined) {
	  'use strict';

	  var NODE_JS = typeof(module) != 'undefined';
	  if(NODE_JS) {
		root = global;
	  }
	  var HEX_CHARS = '0123456789abcdef'.split('');
	  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
	  var KECCAK_PADDING = [1, 256, 65536, 16777216];
	  var PADDING = [6, 1536, 393216, 100663296];
	  var SHIFT = [0, 8, 16, 24];
	  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
				0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0, 
				2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771, 
				2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
				2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
	  var BITS = [224, 256, 384, 512];
	  var SHAKE_BITS = [128, 256];
	  var OUTPUT_TYPES = ['hex', 'buffer', 'array'];

	  var createOutputMethod = function(bits, padding, outputType) {
		return function(message) {
		  return new Keccak(bits, padding, bits).update(message)[outputType]();
		}
	  };

	  var createShakeOutputMethod = function(bits, padding, outputType) {
		return function(message, outputBits) {
		  return new Keccak(bits, padding, outputBits).update(message)[outputType]();
		}
	  };

	  var createMethod = function(bits, padding) {
		var method = createOutputMethod(bits, padding, 'hex');
		method.create = function() {
		  return new Keccak(bits, padding, bits);
		};
		method.update = function(message) {
		  return method.create().update(message);
		};
		for(var i = 0;i < OUTPUT_TYPES.length;++i) {
		  var type = OUTPUT_TYPES[i];
		  method[type] = createOutputMethod(bits, padding, type);
		}
		return method;
	  };

	  var createShakeMethod = function(bits, padding) {
		var method = createShakeOutputMethod(bits, padding, 'hex');
		method.create = function(outputBits) {
		  return new Keccak(bits, padding, outputBits);
		};
		method.update = function(message, outputBits) {
		  return method.create(outputBits).update(message);
		};
		for(var i = 0;i < OUTPUT_TYPES.length;++i) {
		  var type = OUTPUT_TYPES[i];
		  method[type] = createShakeOutputMethod(bits, padding, type);
		}
		return method;
	  };

	  var algorithms = [
		{name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod},
		{name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod},
		{name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod}
	  ];

	  var methods = {};

	  for(var i = 0;i < algorithms.length;++i) {
		var algorithm = algorithms[i];
		var bits  = algorithm.bits;
		var createMethod = algorithm.createMethod;
		for(var j = 0;j < bits.length;++j) {
		  var method = algorithm.createMethod(bits[j], algorithm.padding);
		  methods[algorithm.name +'_' + bits[j]] = method;
		}
	  }

	  function Keccak(bits, padding, outputBits) {
		this.blocks = [];
		this.s = [];
		this.padding = padding;
		this.outputBits = outputBits;
		this.reset = true;
		this.block = 0;
		this.start = 0;
		this.blockCount = (1600 - (bits << 1)) >> 5;
		this.byteCount = this.blockCount << 2;
		this.outputBlocks = outputBits >> 5;
		this.extraBytes = (outputBits & 31) >> 3;

		for(var i = 0;i < 50;++i) {
		  this.s[i] = 0;
		}
	  };

	  Keccak.prototype.update = function(message) {
		var notString = typeof(message) != 'string';
		if(notString && message.constructor == root.ArrayBuffer) {
		  message = new Uint8Array(message);
		}
		var length = message.length, blocks = this.blocks, byteCount = this.byteCount, 
			blockCount = this.blockCount, index = 0, s = this.s, i, code;
		
		while(index < length) {
		  if(this.reset) {
			this.reset = false;
			blocks[0] = this.block;
			for(i = 1;i < blockCount + 1;++i) {
			  blocks[i] = 0;
			}
		  }
		  if(notString) {
			for (i = this.start;index < length && i < byteCount; ++index) {
			  blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
			}
		  } else {
			for (i = this.start;index < length && i < byteCount; ++index) {
			  code = message.charCodeAt(index);
			  if (code < 0x80) {
				blocks[i >> 2] |= code << SHIFT[i++ & 3];
			  } else if (code < 0x800) {
				blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
				blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
			  } else if (code < 0xd800 || code >= 0xe000) {
				blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
				blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
				blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
			  } else {
				code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
				blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
				blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
				blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
				blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
			  }
			}
		  }
		  this.lastByteIndex = i;
		  if(i >= byteCount) {
			this.start = i - byteCount;
			this.block = blocks[blockCount];
			for(i = 0;i < blockCount;++i) {
			  s[i] ^= blocks[i];
			}
			f(s);
			this.reset = true;
		  } else {
			this.start = i;
		  }
		}
		return this;
	  };

	  Keccak.prototype.finalize = function() {
		var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
		blocks[i >> 2] |= this.padding[i & 3];
		if(this.lastByteIndex == this.byteCount) {
		  blocks[0] = blocks[blockCount];
		  for(i = 1;i < blockCount + 1;++i) {
			blocks[i] = 0;
		  }
		}
		blocks[blockCount - 1] |= 0x80000000;
		for(i = 0;i < blockCount;++i) {
		  s[i] ^= blocks[i];
		}
		f(s);
	  };

	  Keccak.prototype.toString = Keccak.prototype.hex = function() {
		this.finalize();

		var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, 
			extraBytes = this.extraBytes, i = 0, j = 0;
		var hex = '', block;
		while(j < outputBlocks) {
		  for(i = 0;i < blockCount && j < outputBlocks;++i, ++j) {
			block = s[i];
			hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
				   HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
				   HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
				   HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
		  }
		  if(j % blockCount == 0) {
			f(s);
		  }
		}
		if(extraBytes) {
		  block = s[i];
		  if(extraBytes > 0) {
			hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
		  }
		  if(extraBytes > 1) {
			hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
		  }
		  if(extraBytes > 2) {
			hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
		  }
		}
		return hex;
	  };

	  Keccak.prototype.buffer = function() {
		this.finalize();

		var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, 
			extraBytes = this.extraBytes, i = 0, j = 0;
		var bytes = this.outputBits >> 3;
		var buffer;
		if(extraBytes) {
		  buffer = new ArrayBuffer((outputBlocks + 1) << 2);
		} else {
		  buffer = new ArrayBuffer(bytes);
		}
		var array = new Uint32Array(buffer);
		while(j < outputBlocks) {
		  for(i = 0;i < blockCount && j < outputBlocks;++i, ++j) {
			array[j] = s[i];
		  }
		  if(j % blockCount == 0) {
			f(s);
		  }
		}
		if(extraBytes) {
		  array[i] = s[i];
		  buffer = buffer.slice(0, bytes);
		}
		return buffer;
	  };

	  Keccak.prototype.digest = Keccak.prototype.array = function() {
		this.finalize();

		var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, 
			extraBytes = this.extraBytes, i = 0, j = 0;
		var array = [], offset, block;
		while(j < outputBlocks) {
		  for(i = 0;i < blockCount && j < outputBlocks;++i, ++j) {
			offset = j << 2;
			block = s[i];
			array[offset] = block & 0xFF;
			array[offset + 1] = (block >> 8) & 0xFF;
			array[offset + 2] = (block >> 16) & 0xFF;
			array[offset + 3] = (block >> 24) & 0xFF;
		  }
		  if(j % blockCount == 0) {
			f(s);
		  }
		}
		if(extraBytes) {
		  offset = j << 2;
		  block = s[i];
		  if(extraBytes > 0) {
			array[offset] = block & 0xFF;
		  }
		  if(extraBytes > 1) {
			array[offset + 1] = (block >> 8) & 0xFF;
		  }
		  if(extraBytes > 2) {
			array[offset + 2] = (block >> 16) & 0xFF;
		  }
		}
		return array;
	  };

	  var f = function(s) {
		var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, 
			b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, 
			b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, 
			b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
		for(n = 0; n < 48; n += 2) {
		  c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
		  c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
		  c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
		  c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
		  c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
		  c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
		  c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
		  c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
		  c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
		  c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

		  h = c8 ^ ((c2 << 1) | (c3 >>> 31));
		  l = c9 ^ ((c3 << 1) | (c2 >>> 31));
		  s[0] ^= h;
		  s[1] ^= l;
		  s[10] ^= h;
		  s[11] ^= l;
		  s[20] ^= h;
		  s[21] ^= l;
		  s[30] ^= h;
		  s[31] ^= l;
		  s[40] ^= h;
		  s[41] ^= l;
		  h = c0 ^ ((c4 << 1) | (c5 >>> 31));
		  l = c1 ^ ((c5 << 1) | (c4 >>> 31));
		  s[2] ^= h;
		  s[3] ^= l;
		  s[12] ^= h;
		  s[13] ^= l;
		  s[22] ^= h;
		  s[23] ^= l;
		  s[32] ^= h;
		  s[33] ^= l;
		  s[42] ^= h;
		  s[43] ^= l;
		  h = c2 ^ ((c6 << 1) | (c7 >>> 31));
		  l = c3 ^ ((c7 << 1) | (c6 >>> 31));
		  s[4] ^= h;
		  s[5] ^= l;
		  s[14] ^= h;
		  s[15] ^= l;
		  s[24] ^= h;
		  s[25] ^= l;
		  s[34] ^= h;
		  s[35] ^= l;
		  s[44] ^= h;
		  s[45] ^= l;
		  h = c4 ^ ((c8 << 1) | (c9 >>> 31));
		  l = c5 ^ ((c9 << 1) | (c8 >>> 31));
		  s[6] ^= h;
		  s[7] ^= l;
		  s[16] ^= h;
		  s[17] ^= l;
		  s[26] ^= h;
		  s[27] ^= l;
		  s[36] ^= h;
		  s[37] ^= l;
		  s[46] ^= h;
		  s[47] ^= l;
		  h = c6 ^ ((c0 << 1) | (c1 >>> 31));
		  l = c7 ^ ((c1 << 1) | (c0 >>> 31));
		  s[8] ^= h;
		  s[9] ^= l;
		  s[18] ^= h;
		  s[19] ^= l;
		  s[28] ^= h;
		  s[29] ^= l;
		  s[38] ^= h;
		  s[39] ^= l;
		  s[48] ^= h;
		  s[49] ^= l;

		  b0 = s[0];
		  b1 = s[1];
		  b32 = (s[11] << 4) | (s[10] >>> 28);
		  b33 = (s[10] << 4) | (s[11] >>> 28);
		  b14 = (s[20] << 3) | (s[21] >>> 29);
		  b15 = (s[21] << 3) | (s[20] >>> 29);
		  b46 = (s[31] << 9) | (s[30] >>> 23);
		  b47 = (s[30] << 9) | (s[31] >>> 23);
		  b28 = (s[40] << 18) | (s[41] >>> 14);
		  b29 = (s[41] << 18) | (s[40] >>> 14);
		  b20 = (s[2] << 1) | (s[3] >>> 31);
		  b21 = (s[3] << 1) | (s[2] >>> 31);
		  b2 = (s[13] << 12) | (s[12] >>> 20);
		  b3 = (s[12] << 12) | (s[13] >>> 20);
		  b34 = (s[22] << 10) | (s[23] >>> 22);
		  b35 = (s[23] << 10) | (s[22] >>> 22);
		  b16 = (s[33] << 13) | (s[32] >>> 19);
		  b17 = (s[32] << 13) | (s[33] >>> 19);
		  b48 = (s[42] << 2) | (s[43] >>> 30);
		  b49 = (s[43] << 2) | (s[42] >>> 30);
		  b40 = (s[5] << 30) | (s[4] >>> 2);
		  b41 = (s[4] << 30) | (s[5] >>> 2);
		  b22 = (s[14] << 6) | (s[15] >>> 26);
		  b23 = (s[15] << 6) | (s[14] >>> 26);
		  b4 = (s[25] << 11) | (s[24] >>> 21);
		  b5 = (s[24] << 11) | (s[25] >>> 21);
		  b36 = (s[34] << 15) | (s[35] >>> 17);
		  b37 = (s[35] << 15) | (s[34] >>> 17);
		  b18 = (s[45] << 29) | (s[44] >>> 3);
		  b19 = (s[44] << 29) | (s[45] >>> 3);
		  b10 = (s[6] << 28) | (s[7] >>> 4);
		  b11 = (s[7] << 28) | (s[6] >>> 4);
		  b42 = (s[17] << 23) | (s[16] >>> 9);
		  b43 = (s[16] << 23) | (s[17] >>> 9);
		  b24 = (s[26] << 25) | (s[27] >>> 7);
		  b25 = (s[27] << 25) | (s[26] >>> 7);
		  b6 = (s[36] << 21) | (s[37] >>> 11);
		  b7 = (s[37] << 21) | (s[36] >>> 11);
		  b38 = (s[47] << 24) | (s[46] >>> 8);
		  b39 = (s[46] << 24) | (s[47] >>> 8);
		  b30 = (s[8] << 27) | (s[9] >>> 5);
		  b31 = (s[9] << 27) | (s[8] >>> 5);
		  b12 = (s[18] << 20) | (s[19] >>> 12);
		  b13 = (s[19] << 20) | (s[18] >>> 12);
		  b44 = (s[29] << 7) | (s[28] >>> 25);
		  b45 = (s[28] << 7) | (s[29] >>> 25);
		  b26 = (s[38] << 8) | (s[39] >>> 24);
		  b27 = (s[39] << 8) | (s[38] >>> 24);
		  b8 = (s[48] << 14) | (s[49] >>> 18);
		  b9 = (s[49] << 14) | (s[48] >>> 18);

		  s[0] = b0 ^ (~b2 & b4);
		  s[1] = b1 ^ (~b3 & b5);
		  s[10] = b10 ^ (~b12 & b14);
		  s[11] = b11 ^ (~b13 & b15);
		  s[20] = b20 ^ (~b22 & b24);
		  s[21] = b21 ^ (~b23 & b25);
		  s[30] = b30 ^ (~b32 & b34);
		  s[31] = b31 ^ (~b33 & b35);
		  s[40] = b40 ^ (~b42 & b44);
		  s[41] = b41 ^ (~b43 & b45);
		  s[2] = b2 ^ (~b4 & b6);
		  s[3] = b3 ^ (~b5 & b7);
		  s[12] = b12 ^ (~b14 & b16);
		  s[13] = b13 ^ (~b15 & b17);
		  s[22] = b22 ^ (~b24 & b26);
		  s[23] = b23 ^ (~b25 & b27);
		  s[32] = b32 ^ (~b34 & b36);
		  s[33] = b33 ^ (~b35 & b37);
		  s[42] = b42 ^ (~b44 & b46);
		  s[43] = b43 ^ (~b45 & b47);
		  s[4] = b4 ^ (~b6 & b8);
		  s[5] = b5 ^ (~b7 & b9);
		  s[14] = b14 ^ (~b16 & b18);
		  s[15] = b15 ^ (~b17 & b19);
		  s[24] = b24 ^ (~b26 & b28);
		  s[25] = b25 ^ (~b27 & b29);
		  s[34] = b34 ^ (~b36 & b38);
		  s[35] = b35 ^ (~b37 & b39);
		  s[44] = b44 ^ (~b46 & b48);
		  s[45] = b45 ^ (~b47 & b49);
		  s[6] = b6 ^ (~b8 & b0);
		  s[7] = b7 ^ (~b9 & b1);
		  s[16] = b16 ^ (~b18 & b10);
		  s[17] = b17 ^ (~b19 & b11);
		  s[26] = b26 ^ (~b28 & b20);
		  s[27] = b27 ^ (~b29 & b21);
		  s[36] = b36 ^ (~b38 & b30);
		  s[37] = b37 ^ (~b39 & b31);
		  s[46] = b46 ^ (~b48 & b40);
		  s[47] = b47 ^ (~b49 & b41);
		  s[8] = b8 ^ (~b0 & b2);
		  s[9] = b9 ^ (~b1 & b3);
		  s[18] = b18 ^ (~b10 & b12);
		  s[19] = b19 ^ (~b11 & b13);
		  s[28] = b28 ^ (~b20 & b22);
		  s[29] = b29 ^ (~b21 & b23);
		  s[38] = b38 ^ (~b30 & b32);
		  s[39] = b39 ^ (~b31 & b33);
		  s[48] = b48 ^ (~b40 & b42);
		  s[49] = b49 ^ (~b41 & b43);

		  s[0] ^= RC[n];
		  s[1] ^= RC[n + 1];
		}
	  }

	  if(!root.JS_SHA3_TEST && NODE_JS) {
		module.exports = methods;
	  } else if(root) {
		for(var key in methods) {
		  root[key] = methods[key];
		}
	  }
	}(__kernel_sha3));
	
	var __kernel_local_fs;
	__kernel_local_fs = { // mock
		name : "",
		type : "folder",
		folders : {},
		files : {}
	};
	var __kernel_local_cwd = [""];
	var __kernel_local;
	__kernel_local = {
		auth : false,
		hold : [],
		control : {
			editor : null
		},
		fs : {
			sha3_512_start : function() {
				__kernel_hash = __kernel_sha3.sha3_512.create();
				return { result : true };
			}
			, sha3_512_iter : function(data) {
				var msg = [];
				for(var i = 0;i < data.length;++i)
					msg.push(data.charCodeAt(i));
				__kernel_hash.update(msg);
				return { result : true, data : __kernel_hash.hex() };
			}
			, ls : function() {
				console.log("in ls");
				var cur = [];
				for(var x = 0; x < __kernel_local_cwd.length;x++)
					cur.push(__kernel_local_cwd[x]);
				var cur_logic = __kernel_local_fs;
				for(var x = 1; x < cur.length;x++) {
					if( cur[x] in cur_logic.folders ) {
						cur_logic = cur_logic.folders[cur[x]]
					} else if( cur[x] in cur_logic.files ) {
						if( x == cur.length-1) {
							// ok
							cur_logic = cur_logic.files[ cur[x] ];
						} else {
							return { result : false, message : "cant change dir to file." };
						}
					} else {
						console.log("bug:",x,cur[x]);
						return { result : false, message : "path not found." };
					}
				}
				var r = [];
				if(cur_logic.type=="folder") {
					for(var f in cur_logic.files )
						r.push(f);
					for( var f in cur_logic.folders )
						r.push(f);
				}
				return { result : true, value : r };
			}
			, open : function(file) {
				this.touch(file);
				return this.cat(file);
			}
			, cat : function(file) {
				
				var parts = file.split("/");
				var cur = [];
				for(var x = 0; x < __kernel_local_cwd.length;x++)
					cur.push(__kernel_local_cwd[x]);
				while(parts.length>0) {
					var p = parts.shift();
					if(p=="") {
						var cur_logic = __kernel_local_fs;
					} else if(p==".") {
						// do nothing
					} else if(p=="..") {
						if(cur.length>1) cur.pop();
						else return { result : false };
					} else {
						var cur_logic = __kernel_local_fs;
						for(var x = 1; x < cur.length;x++) {
							console.log(cur[x]);
							if( cur[x] in cur_logic.folders ) {
								cur_logic = cur_logic.folders[cur[x]]
							} else if( cur[x] in cur_logic.files ) {
								if(x==cur.length-1) 
									break;
								console.log(cur);
								return { result : false, message : "cant change dir to file.1" }; // already tested folders
							} else {
								return { result : false, message : "path not found." };
							}
						}
						// cur_logic is in current folder
						// now get remaining parts
						if( p in cur_logic.folders ) {
							cur.push( p );
						} else if( p in cur_logic.files) {
							cur.push( p );
						}
					}
				}
				
				var cur_logic = __kernel_local_fs;
				for(var x = 1; x < cur.length;x++) {
					if( cur[x] in cur_logic.folders ) {
						cur_logic = cur_logic.folders[cur[x]]
					} else if( cur[x] in cur_logic.files ) {
						if( x == cur.length-1) {
							// ok
							cur_logic = cur_logic.files[ cur[x] ];
						} else {
							return { result : false, message : "cant change dir to file." };
						}
					} else {
						return { result : false, message : "path not found." };
					}
				}
				
				var data = "";
				if(cur_logic.type=="file") {
					data = cur_logic.content;
				} else {
					return { result : false, message : "cant read folder." };
				}
				return { result : true, output : data };
			}
			, cwd : function() {
				var r = [];
				for(var x = 0; x < __kernel_local_cwd.length;x++)
					r.push(__kernel_local_cwd[x]);
				r.push("");
				return { result: true, path: r.join("/") };
			}
			, touch : function(name) {
				var parts = name.split("#");
				name = parts[0];
				parts.shift();
				var namep = name.split("/");
				if(namep.length>0) {
					if(namep[0]=="") { // absolute
						var cur_logic = __kernel_local_fs;
						var cur = [""];
						for(var x = 1; x < namep.length;x++) {
							if( namep[x] == ".") {
								// stay at same path
							} else if(namep[x] == ".." ) {
								if(cur.length>1) cur.pop();
								else return { result : false, message : "path not found."};
								
								// reloc cur_logic
								cur_logic = __kernel_local_fs;
								for(var y = 1;y < cur.length;y++) {
									cur_logic = cur_logic.folders[ cur[x] ];
								}
								if(x==namep.length-1) {
									// may update date dir
								}
							} else if( namep[x] in cur_logic.folders ) {
								cur_logic = cur_logic.folders[ namep[x] ];
								cur.push( namep[x] );
								
								if(x==namep.length-1) {
									// may update date dir
								}
							} else if( namep[x] in cur_logic.files ) {
								if(x == namep.length-1) {
									if(parts.length>0) {
										// append
										cur_logic.files[ namep[x] ].content += parts.join(" ");
									} else {
										// may update date file
										
									}
								} else {
									return { result : false, message : "cant change dir to file." };
								}
							} else {
								if(x == namep.length-1) {
									if(parts.length>0) {
										// create file
										cur_logic.files[ namep[x] ] = {
											name : namep[x],
											type : "file",
											content : parts.join(" ")
										};
									} else {
										// create empty file
										cur_logic.files[ namep[x] ] = {
											name : namep[x],
											type : "file",
											content : ""
										};
									}
								} else {
									// create folder
									cur_logic.folders[ namep[x] ] = {
										name : namep[x],
										type : "folder",
										folders : {},
										files : {}
									};
									cur_logic = cur_logic[ namep[x] ];
									cur.push(namep[x]);
								}
							}
						}
					} else { // relative
						// go to current
						var cur_logic = __kernel_local_fs;
						var cur = [""];
						for(var x = 1; x < __kernel_local_cwd.length;x++) {
							if( __kernel_local_cwd[x] in cur_logic.folders ) {
								cur_logic = cur_logic.folders[__kernel_local_cwd[x]]
								cur.push( __kernel_local_cwd[x] );
							} else if( cur[x] in cur_logic.files ) {
								return { result : false, message : "cant change dir to file." }; // already tested folders
							} else {
								return { result : false, message : "path not found." };
							}
						}
						while(namep.length>0) {
							var p = namep.shift();
							if(p==".") {
								// do nothing
							} else if(p=="..") {
								if(cur.length>1) cur.pop();
								else return { result : false, message : "path not found." };
								cur_logic = __kernel_local_fs;
								for(var x = 1; x < cur.length;x++) {
									cur_logic = cur_logic.folders[ cur[x] ];
								}
								if(namep.length==0) {
									// may update date dir
								}
							} else {
								if(p in cur_logic.folders) {
									cur_logic = cur_logic.folders[p]
									cur.push(p);
									
									if( namep.length == 0 ) {
										// may update date dir
									}
									
								} else if(p in cur_logic.files) {
									if(namep.length==0) {
										cur_logic = cur_logic.files[p];
										if(parts.length>0) {
											// append
											cur_logic.content += parts.join(" ");
										} else {
											// may update date file
										}
									} else {
										return { result : false, message : "cant change dir to file." };
									}
								} else {
									if(namep.length>0) {
										// create folder
										cur_logic.folders[ p ] = {
											name : p,
											type : "folder",
											folders : {},
											files : {}
										};
										cur.push( p );
										
									} else {
										
										if(parts.length>0) {
											// create file
											cur_logic.files[ p ] = {
												name : p,
												type : "file",
												content : parts.join(" ")
											};
										} else {
											// create empty file
											cur_logic.files[ p ] = {
												name : p,
												type : "file",
												content : ""
											};
										}
										
									}
								}
							}
						}
					}
				} else { // "" file
					// go to current
					var cur_logic = __kernel_local_fs;
					var cur = [""];
					for(var x = 1; x < __kernel_local_cwd.length;x++) {
						if( __kernel_local_cwd[x] in cur_logic.folders ) {
							cur_logic = cur_logic.folders[__kernel_local_cwd[x]]
							cur.push( __kernel_local_cwd[x] );
						} else if( cur[x] in cur_logic.files ) {
							return { result : false, message : "cant change dir to file." }; // already tested folders
						} else {
							return { result : false, message : "path not found." };
						}
					}
					if( "" in cur_logic.files) {
						if(parts.length>0) {
							// append
							cur_logic.files[""].content += parts.join(" ");
						} else {
							// my update date
						}
					} else {
						if(parts.length>0) {
							// create file
							cur_logic.files[""] = {
								name : "",
								type : "file",
								content : parts.join(" ")
							};
						} else {
							// create empty file
							cur_logic.files[""] = {
								name : "",
								type : "file",
								content : ""
							};
						}
					}
				}
				return { result : true };
			}
			, rm : function(name) {
				var cur = [];
				for(var x = 0; x < __kernel_local_cwd.length;x++)
					cur.push(__kernel_local_cwd[x]);
				var cur_logic = __kernel_local_fs;
				for(var x = 1; x < cur.length;x++) {
					if( cur[x] in cur_logic.folders ) {
						cur_logic = cur_logic.folders[cur[x]]
					} else if( cur[x] in cur_logic.files ) {
						return { result : false, message : "cant change dir to file." };
					} else {
						console.log("bug:",x,cur[x]);
						return { result : false, message : "path not found." };
					}
				}
				if(name == "*") {
					for(var x in cur_logic.folders)
						delete cur_logic.folders[x];
					for(var x in cur_logic.files)
						delete cur_logic.files[x];
				} else {
					if(name in cur_logic.folders)
						delete cur_logic.folders[name];
					if(name in cur_logic.files)
						delete cur_logic.files[name];
				}
				return { result : true };
			}
			, mkdir : function(name) {
				var cur = [];
				for(var x = 0; x < __kernel_local_cwd.length;x++)
					cur.push(__kernel_local_cwd[x]);
				var cur_logic = __kernel_local_fs;
				for(var x = 1; x < cur.length;x++) {
					if( cur[x] in cur_logic.folders ) {
						cur_logic = cur_logic.folders[cur[x]]
					} else if( cur[x] in cur_logic.files ) {
						return { result : false, message : "cant change dir to file." };
					} else {
						console.log("bug:",x,cur[x]);
						return { result : false, message : "path not found." };
					}
				}
				if(!(name in cur_logic.folders)) {
					console.log("folder created.");
					
					cur_logic.folders[name] = {
						name : name,
						type : "folder",
						folders : {},
						files : {}
					}
				}
				return { result : true };
			}
			, cd : function(args) {
				var parts = args.split("/");
				console.log("in cd:",args)
				var cur = [];
				for(var x = 0; x < __kernel_local_cwd.length;x++)
					cur.push(__kernel_local_cwd[x]);
				while(parts.length>0) {
					var p = parts.shift();
					if(p=="") {
						var cur_logic = __kernel_local_fs;
					} else if(p==".") {
						// do nothing
					} else if(p=="..") {
						if(cur.length>1) cur.pop();
						else return { result : false };
					} else {
						var cur_logic = __kernel_local_fs;
						for(var x = 1; x < cur.length;x++) {
							if( cur[x] in cur_logic.folders ) {
								cur_logic = cur_logic.folders[cur[x]]
							} else if( cur[x] in cur_logic.files ) {
								return { result : false, message : "cant change dir to file." }; // already tested folders
							} else {
								return { result : false, message : "path not found." };
							}
						}
						// cur_logic is in current folder
						// now get remaining parts
						if( p in cur_logic.folders ) {
							cur.push( p );
						} else if( p in cur_logic.files) {
							return { result : false, message : "cant change dir to file." }; // already tested folders
						}
					}
				}
				var max = __kernel_local_cwd.length;
				for(var x = 0; x < max;x++) __kernel_local_cwd.pop();
				for(var x = 0; x < cur.length;x++) __kernel_local_cwd.push( cur[x] );
				return { result : true, path : __kernel_local_cwd.join("/") };
			}
			, go : function(args) {
				History.go("#"+args);
				return { result : true };
			}
			, download : function(args) { // current folder
				
				// pack system on a zip
				var sys_obj = {
					name : "NumberCoolerFS",
					packets : 1,
					offset : 0,
					date : new Number(new Date()),
					comments : "",
					version : [1,0],
					format : {
						name : "raw"
					},
					fs : __kernel_local_fs
				};
				var seed = args.split(" ");
				var hash = "";
				// args are the signature
				
				sys_obj.hash = hash;
				
				var str = JSON.stringify( sys_obj );
				
				var arr = [];
				for(var x = 0; x < str.length;x++) {
					arr[x] = str.charAt(x);
				}
				Download.go(new Blob(arr,{type:"text/plain"}), "system.json");
				return {result : true };
			}
			, upload : function(args) {
				// load system from a zip pack
				return { result : true };
			}
			, edit : function(args) {
				return { result : false };
			}
			, write : function(filepath,value) {
				// must find path
				console.log("write filepath:",filepath);
				var parts = filepath.split("/");
				console.log("in write:",filepath,value,parts);
				var cur_logic = __kernel_local_fs;
				// absolute
				for(var x = 1; x < parts.length;x++) {
					if( (x < parts.length-1) && ( parts[x] in cur_logic.folders) ) {
						cur_logic = cur_logic.folders[parts[x]];
					} else if( (x < parts.length-1) && (parts[x] in cur_logic.files) ) {
						return { result : false, message : "cant change dir to file." }; // already tested folders
					} else if( (x == parts.length-1) && parts[x] in cur_logic.files) {
						cur_logic = cur_logic.files[parts[x]];
					} else {
						return { result : false, message : "path not found." };
					}
				}
				console.log(cur_logic);
				cur_logic.content = value;
				return { result : true };
			}
		}
		, uploaded : function(data) {
			// load system from a zip pack
			console.log("uploaded returned",data);
			var files = data;
			for (var i = 0, f; f = files[i]; i++) {
				var reader = new FileReader();
				reader.onload = (function(theFile) {
					
					return function(e) {
						// e.target.name
						// e.target.result
						var p = JSON.parse(e.target.result);
						// check if format is compatible
						
						
						__kernel_local_fs = p.fs;
						
					};
				})(f);
				reader.readAsText(f);
				return;
			}
		}
	};
	var __kernel_local_i = {
		crc : function(value,crcflow) {
			var k = 0;
			var ncrc = "";
			for(var x = 0; x < value.length;) {
				var part = "";
				if(x + crcflow[k] < value.length) {
					part = value.substring(x,x+crcflow[k]);
				} else {
					part = value.substring(x,value.length);
				}
				if( x%2 == 1) {
					ncrc = __kernel_local.fs.sha3_512_iter(part).data;
				} else {
					ncrc = __kernel_local.fs.sha3_512_iter(ncrc).data;
				}
				x += crcflow[k];	
				k = (k + 1) % crcflow.length;
			}
			return ncrc;
		},
		crcflow  : function(seeda,seedb,seedc) {
			var crcflow = [];
			for(var x = 0; x < seeda;x++) Math.random();
			var m = parseInt( Math.random()*seedb+20 );
			for(var x = 0; x < m;x++) {
				crcflow.push( parseInt(Math.random()*seedc) );
			}
			return crcflow;
		}
	};
	
	var __kernel_remote;
	__kernel_remote = {
		auth : false,
		fs : null
	};
	Class.define("Kernel",{
		ctor : function() {
			this.instance = null;
			if(__kernel_singleton!=null) {
				this.instance = __kernel_singleton;
			} else {
				this.instance = this;
			}
			// enforce behaviour
			
			// sha3
			this.instance.SHA3 = {};
			
			var self = this;
			
			this.instance.uploadCallback = null;
			
			if(!("mode" in this.instance)) {
				this.instance.mode = "local";
			}
			
			
			//if(this.instance==null) throw "lost kernel singleton, system must restart.";
			
			Object.defineProperty(this,"loggedLocal",{
				get : function() {
					return function() {
						return __kernel_local.auth;
					}
				}
			});
			
			Object.defineProperty(this,"loggedRemote",{
				get : function() {
					return function() {
						return __kernel_remote.auth;
					}
				}
			});
			
		},
		proto : {
			editorSet : function(editor) {
				if(__kernel_local.auth) {
					__kernel_local.control.editor = editor;
				}
			},
			editorWrite : function(value) {
				if(__kernel_local.auth) {
					
					// check if file exists
					var filepath = window.localStorage.getItem("history.editor.filepath");
					var crc = window.localStorage.getItem("history.editor.filecrc");
					var crcflow = JSON.parse( window.localStorage.getItem("history.editor.filecrcflow") );
					var oldvalue = window.localStorage.getItem("history.editor.value");
					
					
					//window.localStorage.getItem("history.editor.filecrc");
					// check crc
					var data = __kernel_local.fs.cat(filepath);
					__kernel_local.fs.sha3_512_start();
					
					var ncrc = __kernel_local_i.crc( data.output, crcflow );
					if(ncrc == crc) {
						
						var crcflow = __kernel_local_i.crcflow(100,20,16);
						window.localStorage.setItem("history.editor.filecrcflow",JSON.stringify(crcflow));
						__kernel_local.fs.sha3_512_start();
						
						ncrc = __kernel_local_i.crc( value, crcflow );
						// set new crc
						window.localStorage.setItem("history.editor.filecrc",ncrc);
						
						crcflow = __kernel_local_i.crcflow(93,17,15);
						ncrc = __kernel_local_i.crc( value, crcflow );
						ncrc = __kernel_local_i.crc( value, crcflow );
						
						// backup
						var date = new Number(new Date());
						if( filepath.lastIndexOf(".")!=-1 ) {
							var p = filepath.lastIndexOf(".");
							var bfilepath = filepath.substring( 0, p ) 
								+ "." 
								+ (""+date) 
								+ "." + filepath.substring( p, filepath.length );
					
							__kernel_local.fs.touch(bfilepath);
							__kernel_local.fs.write(bfilepath,value);
						} else {
							
							__kernel_local.fs.mkdir(filepath + ".backup");
							
							__kernel_local.fs.write(filepath + "."  + (""+date) + ".backup",oldvalue);
							
							console.log("data to write on backup:",value);
						}
						
						// file
						__kernel_local.fs.write(filepath,value);
						console.log("data to write on file:",value);
						
						window.localStorage.setItem("history.editor.value",value);
						
					}
					
					
				}
			},
			login : function(credentials,done,fail) {
				var self = this;
				if(this.instance.mode=="remote") {
					var users = credentials.split(" ");
					
					var args = StringTools.toHex(JSON.stringify({ method : "auth", user : str, pass: str }));
					Import({url:"/action",data : { data : args }, json: true })
						.done(done)
						.fail(fail)
						.send();
				} else if(this.instance.mode=="local") {
					// credentials file, hash of your rgistered password
					Import({url:"/script/1_0xF.txt"}) 
						.done(function(data){
							var users = data.split("//");
							var pair2 = credentials.split(" ");
							var sel = -1;
							var hold = [];
							for(var x = 0; x < users.length;x++) {
								var pair1 = users[x].split(",");
								if(pair1.length==pair2.length) {
									var hash = __kernel_local.fs.sha3_512_start();
									var check = false;
									for(var y = 0; y < pair2.length;y++) {
										if( __kernel_local.fs.sha3_512_iter(pair2[y]).data != pair1[y] ) {
											hold.push( pair1[y] );
											check = true;
											break;
										}
									}
									if(!check) {
										sel = x;
									}
								}
							}
							if(sel!=-1) {
								console.log("loogged");
								__kernel_local.auth = true;
								done({result : true, message : "logged." });
							} else {
								fail({result : false, message : "access denied." });
							}
						})
						.fail(function() {
							fail({result: false, message : "import problem."});
						})
						.send();
				}
			},
			logout : function(options,done,fail) {
				if(this.instance.mode=="local") {
					if(__kernel_local.auth) {
						__kernel_local.auth = false;
						done({result:true});
					} else {
						done({result:false});
					}
				} else {
					throw "not implemented";
				}
			},
			reauth : function() {
				console.log("critical keyboard.");
				
			},
			isAuthenticated : function() {
				return this.instance[ this.instance.mode ].auth;
			},
			setMode : function(m) {
				if(m=="local" || m == "remote") {
					this.instance.mode = m;
				}
			},
			getMode : function() {
				return this.instance.mode;
			},
			setUploadCallback : function(callback) {
				this.instance.uploadCallback = callback;
			},
			
			run : function(str,done,fail) {
				//console.log("kernel.run",this.instance.mode);
				if(this.instance.mode=="local") {
					console.log("kernel.local.run");
					if( __kernel_local.auth ) {
						var parts = str.split(" ");
						
						if(parts[0]!="write" && parts[0] in __kernel_local.fs) {
							var cmd = parts.shift();
							var r = __kernel_local.fs[cmd]( parts.join(" ") );
							if(cmd=="upload") {
								console.log("upload callback begin");
								this.instance.uploadCallback&&this.instance.uploadCallback(function(r) {
									if(r.result) {
										__kernel_local.uploaded(r.data);
									}
								});
							} else if(cmd=="open") {
								if(r.result) {
									var hash = History.getHash();
									var filepath = "/" + __kernel_local_cwd.join("/") + parts.join(" ");
									//alert("editing:["+filepath+"]");
									window.localStorage.setItem("history.editor.filepath",filepath);
									
									var crcflow = __kernel_local_i.crcflow(100,20,16);
									window.localStorage.setItem("history.editor.filecrcflow",JSON.stringify(crcflow));
									
									__kernel_local.fs.sha3_512_start();
									var ncrc = __kernel_local_i.crc( r.output , crcflow );
									
									window.localStorage.setItem("history.editor.filecrc",ncrc);
									
									crcflow = __kernel_local_i.crcflow(93,17,15);
									ncrc = __kernel_local_i.crc( r.output , crcflow );
									ncrc = __kernel_local_i.crc( r.output , crcflow );
									
									window.localStorage.setItem("history.editor.value",r.output);
									
									
									
									if(hash!="editor") {
									
										UI.Body.consoleHide();
										__kernel_local.fs.go("editor");
										
										
										try {
											// set color parser by file extension
											
											
											
											__kernel_local.control.editor.setValue(r.output);
										} catch(e) {
											// when history get loaded href changes then 
											// this things bellow will execute sync and load is async
											// editor won't be ready just after history.go,
											// or at least won't be the same cause dom will relloc
										
											console.log(""); // this happens at first try cause it's async, and double loaded.
										}
										
									} else { // so setEditor must be called before
										// set color parser by file extension
										
										
										__kernel_local.control.editor.setValue(r.output);
										UI.Body.consoleHide();
									}
									
								}
							}
							done(r);
						} else {
							fail({ result : false, message : "command not found."});
						}
					} else {
						fail({ result : false, message : "not logged."});
					}
				} else if(this.instance.mode=="remote") {
					if(__kernel_remote.auth) {
						console.log("kernel.remote.run");
						var args = StringTools.toHex(JSON.stringify({ method : "command", data : str }));
						Import( { url: "/action", data : { data: args }, json:true } )
							.done( done )
							.fail( fail )
							.send();
					} else {
						fail({ result : false, message : "not logged."});
					}
				}
			}
		}
	});
	__kernel_singleton = Class.create("Kernel");
})();

Class.define("Packer",{
	ctor : function() {
	
	
	},
	proto : {
		generateBytes : function(str) {
			var buffer = new Uint8Array(worker_code.length);
			for(var x = 0; x < worker_code.length;x++) {
				var ch = worker_code.charCodeAt(x);
				buffer[x] = ch;
			}
			return buffer;
		},
		generateBlob : function(str,type) {
			return new Blob([ this.generateBytes(str) ], { type : type });
		},
		generateUrl : function(str,type) {
			return URL.createObjectURL(new Blob([ this.generateBytes(str) ], { type : type }));
		},
		generateWorker : function(str) {
			var url = this.generateUrl(str,"application/js");
			return new Worker(url);
		}
		/*
			var worker_code = "self.addEventListener('message', function(e) { console.log(e.data); self.postMessage(\"sent from worker.\"); });";
			var buffer = new Uint8Array(worker_code.length);
			for(var x = 0; x < worker_code.length;x++) {
				var ch = worker_code.charCodeAt(x);
				buffer[x] = ch;
			}
			var blob = new Blob([buffer],{type:"application/js"});
			var url = URL.createObjectURL(blob);
			
			var file = url;
			var w2 = new Worker(file);
			w2.addEventListener("message",function(e){
				console.log(e.data);
			});
			w2.postMessage("sent from client.")
		},
		*/
		
	}
})




Class.define("UI");
UI = {}; // UI.init and UI.load are the main


DOMElementCount = Class.create("XMath.UnitCounter");

TabIndexCount = Class.create("XMath.UnitCounter");


var ____HtmlTags2 = [
	"a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont",
	"bdi","bdo","big","blockquote","body","br","button","canvas","center","cite","code","col",
	"colgroup","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed",
	"fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3",
	"h4","h5","h6","head","header","hr","html","i","iframe","img","input","ins","kbd","keygen","label",
	"legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noframes","noscript",
	"object","ol","opgroup","option","output","p","param","pre","progress","q","rp","rt","ruby",
	"s","samp","script","section","select","small","source","span","strike","strong","style","sub",
	"summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","u","ul",
	"var","video","wbr",
	
	"svg","path"
];
var ____SvgTags2 = [
	"svg",
	"a",
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animate",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"circle",
	"clipPath",
	"color-profile",
	"cursor",
	"defs",
	"desc",
	"ellipse",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"filter",
	"font",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignObject",
	"feMorphology",
	"g",
	"glyph",
	"glyphRef",
	"hkern",
	"image",
	"line",
	"linearGradient",
	"marker",
	"mask",
	"metadata",
	"missing-glyph",
	"mpath",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialGradient",
	"rect",
	"script",
	"set",
	"stop",
	"style",
	"switch",
	"symbol",
	"text",
	"textPath",
	"title",
	"tref",
	"tspan",
	"use",
	"view",
	"vkern"
]
____HtmlTags2.reverse();
Object.defineProperty(this, "____HtmlTags",{
	value : ____HtmlTags2,
	writable : false,
	configurable : false,
	enumerable : false
});
____SvgTags2.reverse();
Object.defineProperty(this,"____SvgTags",{
	value : ____SvgTags2,
	writable : false,
	configurable : false,
	enumerable : false
});
//console.log("???? NOT WINDOW THIS-->",this);


Class.define("UI.Page",{ from  : ["WithEvents"] ,
	ctor : function(args) {

	
		var internal = this.internal["UI.Page"].data = {};
		
		if(args != undefined && args != null && Object.prototype.toString.apply(args) == "[object Object]") {
			if("input" in args) {
				internal.args = args.input;
			} else {
				internal.args = [];
			}
		}
		//console.log("UI.Page ctor args:",args);
		
		
		this.wde = Class.create("WithDOMElements");
		
		this.on("UI.Page.args",function(args) {
			//console.log("PAGE ARGS RECEIVER",this);
			var stack = [this.wde];
			while(stack.length>0) {
				var target = stack.pop();
				//target.emit("UI.Page.args",[args]);
				for(var x = 0; x < target.itemAmount();x++) {
					var item = target.itemGetAt(x);
					if( target.elementIsComplex( item.name ) ) {
						if("UI.Page" in item.complex.internal) {
							item.complex.emit("UI.Page.args",[args]);
							stack.push(item.complex.wde);
							//console.log("UI.Page.args !!",item);
						} else if("WithDOMElements" in item.complex.internal) {
							item.complex.emit("UI.Page.args",[args]);
							stack.push(item.complex);
						} else {
							if("WithEvents" in item.complex.internal) {
								item.complex.emit("UI.Page.args",[args]);
							}
						}
					} else if("contents" in item){
						stack.push(item.contents);
					}
				}
			}
			return 1;
		});
		
		this.on("nodeBuild",function() {
			var div = this.container = this.wde.elementNew("container","div");
			div.style.position = "relative";
			div.style.width = "100%";
			div.style.height = "100%";
			return true;
		});
		
	}
	, proto : {
		widgetArguments : function() {
			return this.internal["UI.Page"].data.args;
		},
		widgetStart : function() {
			this.emit("widgetStart");
		},
		widgetStop : function() {
			this.emit("widgetStop");
		},
		widgetPause : function() {
			this.emit("widgetPause");
		},
		widgetResume : function() {
			this.emit("widgetResume");
		},
		widgetReset : function() {
			this.emit("widgetReset");
		},
		widgetShutdown : function() {
			this.emit("widgetShutdown");
		},
		elementRender : function(time) {
			//console.log("render page",time);
			this.reDial();
			this.wde.elementRender(time);
		},
		nodeBuild : function(target) {
			//console.log("UI.Page.nodeBuild");
			
			this.wde.elementDefineParent(target);
			this.emit("nodeBuild");
			return true;
		},
		exportContainerToPage : function(page) {
			
		},
		importContainerFromPage : function(page) {
		
		},
		Container : function() {
			return this.wde.elementGetContents("container");
		},
		nodeDispose : function() {
			this.emit("nodeDispose");
			var items = this.wde.itemClear();
			this.wde.varClear();
			delete items;
			return true;
		}
	}
});

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




Class.define("WithDOMElements",{
	from : ["WithDOMNode"]
	, ctor : 
		function() {
	
		this.internal.WithDOMElements.data = {};
		this.internal.WithDOMElements.parent = null;
		this.internal.WithDOMElements.localId = 0;
		
		var movie = this.internal.WithDOMElements.movie = {};
		movie.state = 0; // 0 not buffered, 1 play, 2 pause, 3 reset
		movie.mode = 0; // 0 infinite loop, 1 play once
		movie.fps = 0; // 0 static
		movie.frame = 0;
		movie.endframe = 1;
		movie.start = window.performance.now();
		movie.lasframe = 0;
		
		this.internal.WithDOMElements.default_itemInputFilter_lock = function(index,oldvalue,newvalue) {
			return false;
		};
		
		this.internal.WithDOMElements.default_itemInputFilter = function(index,oldvalue,newvalue) {
			
			
			//	{ 
			//		tag : "div",
			//		id : "",
			//		parent : object,
			//	}
			//	
			//	console.log("input filter");
			
			if(newvalue.tag=="complex_element") {
				
				// verify if newvalue.complex behaves
				
				var id = "_" + DOMElementCount.getInc();
				newvalue.id = id;
				
				// set parent of complex
				
				//console.log(newvalue.complex);
				if( !newvalue.complex.nodeBuild(newvalue.parent) ) {
					var keys = [];
					for(var x in newvalue.complex_extended) {
						if(x.indexOf("Deep")!=0 && x!="self")
							keys.push(x);
					}
					throw "error on build " + newvalue.name + " of type [" + keys.join("|") + "]";
				}
				
				// complex load event
				if( "WithEvents" in newvalue.complex.internal ) {
					newvalue.complex.emit("load",[newvalue.complex.internal[newvalue.complex.internal.type].data]);
				}
				
				
				
			} else {
				//console.log(">>",newvalue.tag);
				var el = null;
				
				var tags = window.____SvgTags;
				
				var is_svg = false;
				if(newvalue.tag.indexOf("svg:")==0) {
					var tsplit = newvalue.tag.split(":");
					newvalue.tag = tsplit[1];
					
					for(var x = 0; x < tags.length;x++) {
						//console.log(tags[x]);
						if(tags[x] == newvalue.tag) {
							is_svg = true;
						}
					}
				}
				
				
				//console.log(newvalue.tag,is_svg);
				
				if(is_svg) {
					el = document.createElementNS("http://www.w3.org/2000/svg",newvalue.tag);
					el.setAttributeNS('http://www.w3.org/2000/svg','xlink','http://www.w3.org/1999/xlink');
				} else {
					el = document.createElement(newvalue.tag);
				}
				
				var id = "_" + DOMElementCount.getInc();
				
				newvalue.id = id;
				el.setAttribute("id",id);
				newvalue.parent.appendChild(el);
				newvalue.el = el;
				
				
				// if is not svg and is in svg then add textnode
				
				if("args" in newvalue && "pure" in newvalue.args && newvalue.args.pure===true) {
					
				} else {
					tags = window.____HtmlTags;
					var check = false;
					for(var x = 0; x < tags.length;x++) {
						if(tags[x] == newvalue.tag) {
							check = true;
						}
					}
					if(check || is_svg) {
						newvalue.contents = Class.create("WithDOMElements");	
						newvalue.contents.elementDefineParent( newvalue.el );
					}
				}
			}
			
			return true;
		};
		this.on("itemInputFilter",this.internal.WithDOMElements.default_itemInputFilter);
		this.internal.WithDOMElements.default_itemOutputFilter = function(index,value){
			
			//console.log("REMOVING FILTER");
			
			
			if("contents" in value) {
				
				value.contents.nodeDispose();
				
			}
			if(value.tag=="complex_element") {
				console.log("UNLOAD?");
				value.complex.emit("unload");
				value.complex.nodeDispose();
				
			} else {
				try {
					value.parent.removeChild( value.el );
					//value.el = null;
					//value.parent = null;
					this.varUnset( value.name );
				} catch(e) {
					console.log(value.name,e);
					console.log("!!",value.parent,value.el);
					var b = [];
					for(var x = 0; x < value.parent.childNodes.length;x++) {
						b.push( x, value.parent.childNodes[x] );
					}
					console.log( b.join(","));
				}
			}
			
			
			return true;
		};
		this.on("itemOutputFilter",this.internal.WithDOMElements.default_itemOutputFilter);
		
		
		this.on("varRename",function(oldkey,newkey) {
			this.varGet(newkey).name = newkey;
		});
		
		
	}
	, proto : {
	
		elementNew : function(name,path,args) {
			
			this.internal.WithDOMElements.localId += 1;
			
			if(this.internal.WithDOMNode.parent==null) {
				throw "WithDOMElements.elementNew has no parent defined. Use WithDOMNode.elementDefineParent before.";
			}
			var tag = "";
			var type = "";
			var complex = null;
			var complex_extended = null;
			var value = null;
			if(arguments.length==1) {
				// path = name
				
				var tags = window.____HtmlTags;
				
				var is_svg = false;
				if(name.indexOf("svg:")==0) {
					var tsplit = name.split(":");
					// name = tsplit[1];
					for(var x = 0; x < tags.length;x++) {
						if(tags[x] == tsplit[1]) {
							is_svg = true;
						}
					}
				}
				
				var tags = window.____HtmlTags;
				var check = false;
				for(var x = 0; x < tags.length;x++) {
					if(tags[x] == name) { check = true; break; }
				}
				if(is_svg) check = true;
				
				if(check) {
					tag = name;
					
				} else {
					tag = "complex_element";
					
					var _class_args = {};
					
					
					_class_args[name] = args;
					
					
					complex = Class.create(name,_class_args);
					type = name;
					
				}
				
				name = "elem_" + this.internal.WithDOMElements.localId;
				
				value = {
					name : name,
					tag : tag,
					el : null,
					type : type,
					complex : complex,
					parent : this.internal.WithDOMNode.parent
				};
				
				// this.varSet(name,value); // no name, so can't refer to this object directly
				
				
				this.itemPush(value);
				
				if(args!=undefined && args!=null) {
					if("text" in args) {
						value.complex.text = args.text;
					}
					if("change" in args) {
						value.complex.on("domChange",args.click);
					}
					if("click" in args) {
						value.complex.on("domClick",args.click);
					}
				} else {
					args = {};
				}
				
				value.args = args;
				
			} else if(arguments.length >= 2) {
				
				var tags = window.____SvgTags;
				var is_svg = false;
				var check = false;
				
				if(path.indexOf("svg:")==0) {
					var tsplit = path.split(":");
					for(var x = 0; x < tags.length;x++) {
						if(tags[x] == tsplit[1]) {
							is_svg = true;
						}
					}
				}
				
				
				tags = window.____HtmlTags;
				
				
				
				
				for(var x = 0; x < tags.length;x++) {
					if(tags[x] == path) { check = true; break; }
				}
				
				if(is_svg) check = true;
				
				if(!check) {
					tag = "complex_element";
					
					var _class_args = {};
					
					//console.log(">>>??",args, path);
					
					if(args==undefined || args==null) args = {};
					
					//var partial_name = path.split(".").pop();
					_class_args[ path ] = [args];
					
					
					var _a = {};
					//console.log(" CLASS CREATION ",path);
					complex = Class.create(path,_class_args);
					//console.log(" CLASS CREATION END ",path);
					type = path;
				} else {
					tag = path;
				}
				
				value = {
					name : name,
					tag : tag,
					el : null,
					type : type,
					
					complex : complex,
					parent : this.internal.WithDOMNode.parent
				};
				this.varSet(name,value);
				this.itemPush(value);
				
				if(args!=undefined && args!=null) {
					if("text" in args) {
						value.complex.text = args.text;
					}
					if("change" in args) {
						value.complex.on("domChange",args.click);
					}
					if("click" in args) {
						value.complex.on("domClick",args.click);
					}
				} else {
					args = {};
				}
				value.args = args;
			}
				
			if(value.tag=="complex_element") return value.complex;
			return value.el;
		},
		elementNewPacket : function( pattern, basename, options ) {
			pattern = pattern.split("\r").join("").split("\n").join("").split("\t").join(" ");
			
			basename = basename || "";
			var ret = {
				el : {},
				$ : {},
				conv : {}
			};
			var intag = false;
			var intagname = false;
			var intagattrib = false;
			var intagattrib_key = false;
			var intagattrib_val = false;
			var intagattrib_string = false;
			var stack = [];
			var pointer = [{
				container : this
			}];
			var attributes_to_delete = [];
			var ret_pointer = ret;
			var current = {};
			var current_attribute = null;
			var count = 0;
			
			var later_attribs = [];
			
			function ask(stream_clue,partial) {
				if("ask" in options) {
					//console.log("asking");
					var extra_args = [stream_clue, partial];
					return options.ask.apply(options.ask_owner,options.ask_args.concat(extra_args));
				}
			}
			
			function tag_handle(tag) {
				if(tag.endTag) {
					if(stack[stack.length-1].tagName == tag.tagName) {
						//console.log("MATCH!");
						stack.pop();
						pointer.pop();
						//console.log("endtag", tag.tagName);
					} else {
						while(stack.length>0) {
							stack.pop();
							pointer.pop();
							if( stack.length >0 && stack[stack.length-1].tagName == tag.tagName ) {
								//console.log("MATCH!")
								//console.log("endtag", tag.tagName);
								return;
							}
						}
						throw "odd tag " + tag.tagName;
					}
				} else {
					if(tag.soleTag) {
						function create_ask_obj(x) {
							return { type : "attribute", key : tag.attributes[x].name, value : tag.attributes[x].value};
						}
						
						var id = [basename + ""];
						var check = false;
						var value = "";
						var has_src = false;
						var src = "";
						for(var x = 0; x < tag.attributes.length;x++) {
							if(tag.attributes[x].name=="id") {
								check = true;
								if( tag.attributes[x].value == "") throw "tag with identification must have a name";
								
								id.push( tag.attributes[x].value );
							} else if(tag.attributes[x].name=="src") {
								
								has_src = true;
								src = tag.attributes[x].value;
								
							}
							if(tag.tagName == "text" && tag.attributes[x].name=="value") {
								value = tag.attributes[x].value;
							}
						}
						var tmp = attributes_to_delete.length;
						while(tmp>0) { tmp-=1; attributes_to_delete.pop(); }
						if(!check) { id.push( "_" + count ); }
						id = id.join("");
						if(tag.tagName == "text") {
							if(has_src) {
								// load file from localStorage
								
								var data = localStorage.getItem(src);
								pointer[pointer.length-1].element.appendChild( document.createTextNode(""+data) );
							} else {
								pointer[pointer.length-1].element.appendChild( document.createTextNode(""+value) );	
							}
							
							// ;
							// append to top container
						} else {
							//console.log("SOLE",id);
							var el = pointer[pointer.length-1].container.elementNew( id, tag.tagName );
							
							var convert_id = id;
							var direct = false;
							if(!check) {
								convert_id = el.getAttribute("id");
								direct = true;
							}
							
							//id
							var toremove = [];
							
							
							var elc = pointer[pointer.length-1].container.elementGetContents( id );
							
							if(check) {
								ret.el[id] = el;
								ret.$[id] = elc;
								ret.conv[id] = el.getAttribute("id");
							}
							var skip = false;
							for(var x = 0; x < tag.attributes.length;x++) {
								skip = false;
								var ask_obj = { 
									type : "attribute", 
									key : tag.attributes[x].name, 
									value : tag.attributes[x].value, 
									id : convert_id, 
									element : el
								};
								if(options) {
									if( "attributes" in options ) {
										//console.log(tag.attributes[x].name,options.attributes,"ask" in options);
									}
								}
								if(options && "attributes" in options && options.attributes.indexOf( tag.attributes[x].name ) != -1) {
									//console.log("[here1 ***]");
									if(options && "ask" in options) {
										//console.log("[here2]");
										//console.log("[here3]");
										//console.log(ask_obj);
										var r = ask(ask_obj,ret);
										//console.log("#attrib."+tag.attributes[x].name+":",r);
										if(r==100) { // do not set element
											var info = { 
												nc_id : convert_id,
												el : el,
												direct : direct,
												tagName : tag.tagName,
												tagAttribName : tag.attributes[x].name,
												tagAttribHasValue : tag.attributes[x].has_value,
											};
											if(info.tagAttribHasValue) info.tagAttribValue = tag.attributes[x].value;
											later_attribs.push(info);
											
										}
										//console.log("[here4]");
										skip = true;
										//console.log("[here6 SE]",x);
									}
								}
								//console.log("SOLE TAG",tag.tagName);
								var t = tag.attributes[x];
								if((!skip) && (t.name != "id")) {
									if(t.value.charAt(0) == "\"" && t.value.charAt( t.value.length-1 ) == "\"") {
										t.value = t.value.substring( 1, t.value.length-1 );
									}
									//console.log("set attrib:",t.name,t.value);
									el.setAttribute( t.name, t.value );
									
								}
								
							}
							if(!check) {
								count += 1;
							}
						}
						
						
					} else {
						
							
						stack.push(tag);
						
						var id = basename + "";
						var check = false;
						for(var x = 0; x < tag.attributes.length;x++) {
							if(tag.attributes[x].name=="id") {
								check = true;
								if( tag.attributes[x].value == "") throw "tag with identification must have a name";
								id += tag.attributes[x].value;
								break;
							}
						}
						if(!check) {
							id += "_" + count;
						}
						//console.log("PAIR",id,tag.tagName);
						var el = pointer[pointer.length-1].container.elementNew( id, tag.tagName );
						var convert_id = id;
						var direct = false;
						if(!check) {
							convert_id = el.getAttribute("id");
							direct = true;
						}
							
						var elc = pointer[pointer.length-1].container.elementGetContents( id );
						
						pointer.push({
							element : el,
							container : elc
						});
						
						if(check) {
							ret.el[id] = el;
							ret.$[id] = elc;
							ret.conv[id] = el.getAttribute("id");
						}
						
						var skip = false;	
						for(var x = 0; x < tag.attributes.length;x++) {
							skip = false;
								var ask_obj = { 
									type : "attribute", 
									key : tag.attributes[x].name, 
									value : tag.attributes[x].value, 
									id : convert_id, 
									element : el
								};
								if(options) {
									if( "attributes" in options ) {
										//console.log(tag.attributes[x].name,options.attributes,"ask" in options);
									}
								}
								if(options && "attributes" in options && options.attributes.indexOf( tag.attributes[x].name ) != -1) {
									//console.log("[here1 ***]");
									if(options && "ask" in options) {
										//console.log("[here2]");
										//console.log("[here3]");
										console.log(ask_obj);
										var r = ask(ask_obj,ret);
										console.log("#attrib."+tag.attributes[x].name+":",r);
										//console.log("[here4]");
										if(r==100) { // later attribs
											var info = { 
												nc_id : convert_id,
												el : el,
												direct : direct,
												tagName : tag.tagName,
												tagAttribName : tag.attributes[x].name,
												tagAttribHasValue : tag.attributes[x].has_value,
											};
											if(info.tagAttribHasValue) info.tagAttribValue = tag.attributes[x].value;
											later_attribs.push(info);
											
										}
										skip = true;
										console.log("[here6 SE]",x);
										
										
									}
								}
							var t = tag.attributes[x];
							if((!skip) && t.name != "id") {
								if(t.value.charAt(0) == "\"" && t.value.charAt( t.value.length-1 ) == "\"") {
									t.value = t.value.substring( 1, t.value.length-1 );
								}
								
								
								//console.log(t.name,t.value);
								el.setAttribute( t.name, t.value );
							}
						}
						
						if(!check) {
							count += 1;
						}
						
					}
				}
			}
			function clear_flags() {
				intag = false;
				intagname = false;
				intagattrib = false;
				intagattrib_key = false;
				intagattrib_val = false;
				intagattrib_string = false;
			}
			if( Object.prototype.toString.apply(pattern) == "[object String]" ) {
				for(var x = 0; x < pattern.length;x++) {
					var ch = pattern.charAt(x);
					/*
					console.log(x,ch,pattern.substring(x),
						"intag",intag,
						"intagname",intagname,
						"intagattrib",intagattrib,
						"intagattrib_key",intagattrib_key,
						"intagattrib_val",intagattrib_val,
						"intagattrib_string",intagattrib_string
					);
					*/
					if(!intag) {
						if( ch == "<" ) {
							if(pattern.indexOf("<!",x)==x) {
							} else if(pattern.indexOf("<!-",x)==x) {
							} else if(pattern.indexOf("<!--",x)==x) {
								var end = pattern.indexOf("-->");
								if(end!=-1) x = end;
								else x = pattern.length;
								continue;
							} else if(pattern.indexOf("<![CDATA[",x)==x) {
								throw "CDATA not implemented.";
							} else {
								// find comments
								intag = true;
								intagname = true;
								intagattrib = false;
								while(x+1 < pattern.length && pattern.charAt(x+1) == " ") x += 1;
								if( x + 1 < pattern.length && pattern.charAt(x+1) == "/" ) {
									//console.log("mark end tag",pattern.substring(x));
									x += 1;
									current = { tagName : "", endTag : true, soleTag : false, attributes : [] };
								} else {
									//console.log("mark tag start",pattern.substring(x));
									current = { tagName : "", endTag : false, soleTag : false, attributes : [] };
								}
							}
						} else {
							// text value
						}
					} else {
						if(intagname) {
							if(ch == "/") {
								while(x+1 < pattern.length && pattern.charCodeAt(x+1) == " ") x+= 1;
								if(x + 1 < pattern.length && pattern.charAt(x+1) == ">" ) {
									clear_flags(); current.soleTag = true; tag_handle(current);
								} else {
									console.log(x,pattern.substring(x));
									throw "unexpected tag end";
								}
							} else if( ch == ">") {
								clear_flags(); tag_handle(current);
							} else if( ch == " ") {
								intagname = false;
								intagattrib = false;
							} else {
								current.tagName += ch;
							}
						} else if(intagattrib) {
							if(intagattrib_key) {
								if(ch == " ") {
									intagattrib = false;
									current_attribute = null;
								} else if(ch == ">") {
									clear_flags(); tag_handle(current);
								} else if(ch == "/") {
									while(x+1 < pattern.length && pattern.charCodeAt(x+1) == " ") x+= 1;
									if(x + 1 < pattern.length && pattern.charAt(x+1) == ">" ) {
										clear_flags(); current.soleTag = true; tag_handle(current);
									} else throw "unexpected tag end";
								} else if( ch == "=" ) {
									intagattrib_key = false;
									intagattrib_val = true;
								} else {
									current_attribute.name += ch;
								}
								
							} else if(intagattrib_val) {
								if( intagattrib_string ) {
									if(ch == "\"") {
										current_attribute = null;
										intagattrib = false;
										intagattrib_key = false;
										intagattrib_val = false;
										intagattrib_string = false;
									} else {
										current_attribute.has_value = true;
										current_attribute.value += ch;
									}
								} else {
									if( current_attribute.value == "" && ch == "\"" ) {
										intagattrib_string = true;
									} else if(ch == "/") {
										while(x+1 < pattern.length && pattern.charCodeAt(x+1) == " ") x+= 1;
										if(x + 1 < pattern.length && pattern.charAt(x+1) == ">" ) {
											clear_flags(); current.soleTag = true; tag_handle(current);
										} else throw "unexpected tag end";
									} else if(ch == ">") {
										clear_flags();
										tag_handle(current);
									} else if(ch != " ") {
										current_attribute.has_value = true;
										current_attribute.value += ch;
									} else {
										intagattrib = false;
										intagattrib_key = false;
										intagattrib_val = false;
										intagattrib_string = false;
										current_attribute = null;
									}
								}
							} else {
								while(pattern.charAt(x) == " " && x < pattern.length) x+=1;
								if(x == pattern.length) throw "unexpected tag end";
								ch = pattern.charAt(x);
								if( ch == "/") {
									while(x+1 < pattern.length && pattern.charCodeAt(x+1) == " ") x+= 1;
									if(x + 1 < pattern.length && pattern.charAt(x+1) == ">" ) {
										clear_flags(); current.soleTag = true; tag_handle(current);
									} else {
										throw "unexpected tag end";
									}
								} else if(ch == ">") {
									clear_flags(); tag_handle(current);
								} else {
									intagattrib = true;
									intagattrib_key = true;
									intagattrib_val = false;
									var attrib = {};
									attrib.name = ch;
									attrib.value = "";
									attrib.has_value = false;
									current.attributes.push(attrib);
									current_attribute = attrib;
								}
							}
						} else {
							if( ch == " ") continue;
							else if(ch == "/") { // sole tag
								while(x+1 < pattern.length && pattern.charCodeAt(x+1) == " ") x+= 1;
								if(x + 1 < pattern.length && pattern.charAt(x+1) == ">" ) {
									clear_flags(); current.soleTag = true; tag_handle(current);
								} else {
									throw "unexpected tag end";
								}
							} else if(ch == ">") {
								clear_flags(); tag_handle(current);
							} else { // attrib init
								intagname = false;
								intagattrib = true;
								intagattrib_key = true;
								intagattrib_val = false;
								var attrib = {};
								attrib.has_value = false;
								attrib.name = ch;
								attrib.value = "";
								current.attributes.push(attrib);
								current_attribute = attrib;
							}
						} 
					}
				}
			}
			console.log("LATER ATTRIBS:",later_attribs.length);
			for(var x = 0; x < later_attribs.length;x++) {
				console.log(later_attribs[x].tagName);
				var info = { type : "later_attribute", key : later_attribs[x].tagAttribName };
				if( later_attribs[x].tagAttribHasValue ) {
					info.value = later_attribs[x].tagAttribValue;
				}
				console.log(ret);
				var r = ask(info,ret);
				console.log( later_attribs[x], r.key, r.value );
				if(r.key==null && r.value==null) {
					
				} else {
					if("svg" in r && r.svg) {
						if(later_attribs[x].direct) {
							document.getElementById( later_attribs[x].nc_id ).setAttributeNS( 'http://www.w3.org/1999/xlink',r.key, r.value );
						} else {
							ret.el[later_attribs[x].nc_id].setAttributeNS( 'http://www.w3.org/1999/xlink',r.key,r.value );
						}
					} else {
						if(later_attribs[x].direct) {
							document.getElementById( later_attribs[x].nc_id ).setAttribute( r.key, r.value );
						} else {
							ret.el[later_attribs[x].nc_id].setAttribute( r.key,r.value );
						}
					}
				}
			}
			// parsed ids
			return ret;
		},
		elementSchema : function(schema) { // obsolete?
			throw "obsolete use elementNewPacket";
			
			var lang = UI.Body.htmlcss_collapser;
			lang.setTarget(this);
			
			var ctx = {};
			lang.parser.run({
				context : ctx,
				query : schema,
				mode : "build",
				print : false
			});
			
			return ctx.result;
		},
		elementAddStyleClass : function(name,style) {
			
			
			var re = /^([a-zA-Z_\-]+([a-zA-Z_\-0-9]*))/.exec(style);
			if(re!=null) style = re[1];
			else return this;
			
			var str_classes = this.elementGetAttribute("class");
			var arr_classes = str_classes.split(" ");
			if(arr_classes.length==1 && arr_classes[0]=="") arr_classes.shift();
			for(var x = 0; x < arr_classes.length;x++) {
				if(style == arr_classes[x]) {
					return this;
				}
			}
			arr_classes.push(style);
			this.elementSetAttribute(name,"class",arr_classes.join(" "));
			return this;
		},
		elementRemoveStyleClass : function(name,style) {
			
			var re = /^([a-zA-Z_\-]+([a-zA-Z_\-0-9]*))/.exec(style);
			if(re!=null) style = re[1];
			else return this;
			
			var str_classes = this.elementGetAttribute(name,"class");
			var arr_classes = str_classes.split(" ");
			if(arr_classes.length==1 && arr_classes[0]=="") arr_classes.shift();
			
			var mark = [];
			for(var x = 0; x < arr_classes.length;x++) {
				if(style == arr_classes[x]) {
					mark.push(x);
				}
			}
			for(var x = mark.length-1;x>=0;x--)
				arr_classes.splice(mark[x],1);
			this.elementSetAttribute(name,"class",arr_classes.join(" "));
			return this;
			
		},
		elementSetAttribute : function(name,attrib,value) {
			var target = this.varGet(name);
			if(target!=null) {
				//console.log("ok");
				if(target.tag=="complex_element") {
					if("nodeSingleTag" in target.complex) {
						//console.log("ok??");
						target.complex.nodeSingleTag().setAttribute(attrib,value);
					} else {
						//console.log(name,"attribute",attrib,value," not set.");
					}
				} else {
					target.el.setAttribute(attrib,value);
				}
			}
			return this;
		},
		elementGetAttribute : function(name,attrib,value) {

			var target = this.varGet(name);
			if(target!=null) {
				if(target.tag == "complex_element") {
					if("nodeSingleTag" in target.complex) {
						return target.complex.nodeSingleTag().getAttribute(attrib);
					} else {
						console.log(name,"attribute",attrib,value," does not exists.");
						return "";
					}
				} else {
					return target.el.getAttribute(attrib);	
				}
			}
			return "";
		},
		elementAddEvent : function(name,event,callback) {
			var target = this.varGet(name);
			if(target!=null) {
				if( target.tag != "complex_element" ) {
					target.el.addEventListener(event,callback);
					return true;
				} else {
					if("WithEvents" in target.complex.internal) {
						target.complex.on(event,callback);
						return true;
					}
					return false;
				}
			}
			return false;
		},
		elementRemoveEvent : function(name,event,callback) {
			var target = this.varGet(name);
			if(target!=null) {
				if(target.tag != "complex_element") {
					target.el.removeEventListener(event,callback);
					return true;
				} else {
					if("WithEvents" in target.complex.internal) {
						target.complex.off(event,callback);
						return true;
					}
					return false;
				}
			}
		},
		elementGet : function(name) {
			var ret = this.varGet(name);
			if(ret==null) return null;
			
			if(ret.tag=="complex_element") {
				return ret.complex;
			} else {
				return ret.el;
			}
		},
		elementIsComplex : function(name) {
			var ret = this.varGet(name);
			if(ret!=null) {
				if(ret.tag == "complex_element") {
					return true;
				}
			}
			return false;
		},
		elementControl : function(name,control) {
			var ret = this.varGet(name);
			if(ret!=null) {
				var c = Class.create(control,{});
				c.name = name;
				c.parent = this;
				c.element = ret;
				c.init();
				return c;
			} else {
				return null;
			}
		},
		elementMovie : function() {
			return this.internal.WithDOMElements.movie;
		},
		elementRender : function(time) {
			
			
			var movie = this.internal.WithDOMElements.movie;
			
			if(movie.state==0) {
				
				movie.state = 1;

				this.emit("render");
				
				movie.start = time;
				
			} else if ( movie.state == 2 ) {
				// not running
				movie.state = 2;
				
			} else if(movie.state==3) {
				
				movie.frame = 0;
				movie.state = 1;
				
				this.emit("render");
				movie.start = time;
				
			} else {
			
				
				if(movie.fps > 0) {
				
					//console.log(time);
					var packet = 1000/movie.fps;
					if(time > movie.start + packet) {
						
						var frames_ahead = parseInt( movie.fps * (time-movie.start) / 1000 );
						
						if(frames_ahead > movie.lastframe) {
							this.emit("render");
						}
						
						if(  frames_ahead >= movie.endframe) {
							
							if(movie.mode==1) {// play once
								movie.state = 2;
								movie.frame = movie.endframe-1;
								movie.start = time;
							} else {
								
								movie.frame = frames_ahead % movie.endframe;
								if(frames_ahead / movie.endframe > 10) {
									movie.start += packet*movie.endframe;
								}
								movie.lastframe = 0;
							}
						} else {
							movie.lastframe = movie.frame;
							
							movie.frame = frames_ahead;
							
						}
						
					}
					
				}
			}
			
			for(var x = 0; x < this.itemAmount();x++) {
				var item = this.itemGetAt(x);
				if( item.tag == "complex_element" ) {
					
					if("elementRender" in item.complex) {
						item.complex.elementRender(time);
					} else {
						//console.log(item.tag,item.name);
					}
				} else if( "contents" in  item ) {
					item.contents.elementRender(time);
				} else {
					// single tag
				}
			}
			
			
		},
		elementGetContents : function(name) {
			var ret = this.varGet(name);
			if(ret!=null) {
				if(ret.tag=="complex_element") {
					return ret;
				} else {
					if("contents" in ret)
						return ret.contents;
					throw "this element do not has contents.";
				}
			} else {
				throw name + " do not exists";
			}
		},
		elementRemove : function(name) {
			var itemA = this.varGet(name);
			//console.log("element remove called ",name,itemA.id);
			//console.log(itemA,name);
			this.itemRemoveComplex(function(x,itemB) {
				//console.log(itemA,itemB);
				return (itemB.id == itemA.id);
			});
		},
		elementRename : function(oldname,newname) {
			var val = this.varGet(oldname);
			this.elementRemove(oldname);
			this.varSet(newname,val);
			this.itemPush(val);
		},
		elementsClear : function() {
			var items = this.itemClear();
			this.varClear();
			delete items;
		},
		elementRemoveB : function(name) {
			var ret = this.varGet(name);
			if(ret==null) return null;
			// find ret in items
			var i = this.itemFindFirstIndex(ret);
			if(i!=-1) {
				this.removeAt(i);
				this.varUnset(name);
			}
		},
		elementLock : function() {
			this.on("itemInputFilter",this.internal.WithDOMElements.default_itemInputFilter_lock);
		},
		elementX : function(p,full_target) {
			function getArray(target) {
				var path = target[1].split(".");
				var cur = target[0];
				for(var x = 0; path.length>1 && x < path.length-1;x++) {
					if("complex" in cur && "tag" in cur && cur.tag == "complex_element") {
						cur = cur.complex.elementGetContents( path[x] );
					} else {
						cur = cur.elementGetContents( path[x] );
					}
				}
				if(path.length > 1) target = cur.complex.elementGet( path[ path.length-1 ] );
				else {
					target = target[0];
				}
				return target;
			}
			var name_arr = full_target.split(".");
			if(name_arr.length == 1) {
				return p.el[name_arr[0]];
			} else if(name_arr.length == 2) {
				return p.el[ name_arr[0] ].elementGet( name_arr[1] )
			} else if( name_arr.length  >= 3) {
				var el = p.el[ name_arr[0] ];
				name_arr.shift();
				return getArray( [ el, name_arr.join(".") ]);
			}
		},
		
		elementUnlock : function() {
			this.off("itemInputFilter",this.internal.WithDOMElements.default_itemInputFilter_lock);
		},
		nl : function() {
			this.elementNew("br");
		}
	}
});

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


Class.define("UI.Document", { 
	from : ["WithEvents"]
	, ctor : function() {
		var self = this.internal["UI.Document"];
		self.data = document;
		this.on("on", function(event,callback) {
			//console.log("set visibility change event");
			self.data.addEventListener(event,callback);
			return true;
		});
		this.on("off",function(event,callback) {
			self.data.removeEventListener(event,callback);
			return true;
		});
	}
	, proto : {
		get : function() {
			var self = this.internal["UI.Document"];
			return self.data;
		}
	}
});


function _Struct_UIWindow() {}
_Struct_UIWindow.prototype.data = window;
_Struct_UIWindow.prototype.loaded = false;
_Struct_UIWindow.prototype.keyboard = {};

Class.define("UI.Window", { 
	from : ["WithEvents"]
	, struct: _Struct_UIWindow
	, ctor : function() {
		
		
		var self = this.internal["UI.Window"];
		
		self.keyboard.enabled = true;
		self.keyboard.shift = false;
		self.keyboard.capslock = false;
		self.keyboard.alt = false;
		self.keyboard.ctrl = false;
		
		
		this.on("on", function(event,callback) {
			if(event=="load") {
				if(self.loaded) {
					callback();
				} else {
					self.data.addEventListener(event,callback);
				}
			} else {
				self.data.addEventListener(event,callback);
			}
			return true;
		});
		this.on("off",function(event,callback) {
			self.data.removeEventListener(event,callback);
			return true;
		});
		
		Object.defineProperty(this,"keyboard",{
			get : function() {
				return this.internal["UI.Window"].keyboard;
			}
		});
		
	}
	,proto : {
		get : function() {
			
		},
		getStringSize : function(str,style) {
			var s = document.createElement("span");
			//s.style.position = "relative";
			s.style.visibility = "hidden";
			
			BrowserTools.setStyle(s,style);
			s.style.padding = "0px";
			s.style.margin = "0px";
			s.innerHTML = str;
			UI.Body.get().appendChild(s);
			
			var w = s.offsetWidth;
			var h = s.offsetHeight;
			
			UI.Body.get().removeChild(s);
			//getStringSize
			
			return [w,h];
		},
		getBounds : function() {
			var window_width = window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
			window_height = window.innerHeight|| document.documentElement.clientHeight|| body.clientHeight;
			return [ window_width, window_height ];
		}
	}
});

Class.define("UI.Body",{ from : ["WithDOMElements"] , ctor :
	function(){
	
		this.debug = true;
		
		this.elementDefineParent(document.body);
		var windowBody = this;
		
		if("ContextManager" in window) {
			var body_addEventListener_map = ContextManager.createMap(null,document.body,"addEventListener",function(map,result,ir){
				
				return result;
			});
			body_addEventListener_map.addPattern(function() {
				console.log("body.addEventListener",JSON.stringify( Array.prototype.slice.call(arguments) ));	
				return {
					cancel : false,
					hastracks : true,
					tracks : [1],
					require : ["default"]
				}
			});
			
			var body_removeEventListener_map = ContextManager.createMap(null,document.body,"removeEventListener",function(map,result,ir) {
				return result;
			});
			body_removeEventListener_map.addPattern(function() {
				console.log("body.removeEventListener",JSON.stringify( Array.prototype.slice.call(arguments) ));	
				var check = false;
				var sel_value = null;
				for( var x = 0; x < body_addEventListener_map.applied.length;x++) {
					if( 
						body_addEventListener_map.applied[x][0][0] == arguments[0] &&
						body_addEventListener_map.applied[x][1][0] == arguments[1] &&
						body_addEventListener_map.applied[x][2][0] == arguments[2]
					) {
						sel_value = body_addEventListener_map.applied[x][1][1];
						check = true;
						break;
					}
				}
				var r = {
					cancel : !check,
					hastracks : false
				};
				if( check ) {
					r.replace = true;
					r.replaceCursor = [1];
					r.replaceValue = [sel_value];
				}
				return r;
			});
		}
		
		var i = this.internal["UI.Body"];
		i.console = {
			_state : false,
			uploading : false,
			uploading_return : false,
			uploading_last : null,
			input_buffer : [],
			output_buffer : [],
			lineCount : 0,
			lines : [],
			historyCursor : -1,
			history : [],
			input : function(opt) {
				this.state = true;
				while(this.input_buffer.length>0)
					this.input_buffer.pop();
				if("display" in opt) {
					this.prompt = opt.display;
				}
				this.callback = opt.callback;
			},
			historyUp : function() {
				if( this.historyCursor > -1 ) {
					this.historyCursor -= 1;
					if(this.historyCursor >= 0 && this.historyCursor < this.history.length ) {
						var data = [];
						var sel = this.history[ this.history.length - 1 - this.historyCursor ];
						for(var x = 0; x < sel.length;x++)
							data.push(sel.charAt(x));
						this.input_buffer = data;
					}
					
					if(this.historyCursor == -1)
						this.input_buffer = [];
				}
				this.refresh();
			},
			historyDown : function() {
				if( this.historyCursor >= -1 ) {
				
					if(this.historyCursor + 1 < this.history.length)
						this.historyCursor += 1;
					if(this.historyCursor >= 0 && this.historyCursor < this.history.length) {
						var data = [];
						var sel = this.history[ this.history.length - 1- this.historyCursor ];
						for(var x = 0; x < sel.length;x++)
							data.push(sel.charAt(x));
						this.input_buffer = data;
					} else {
						this.input_buffer = [];
					}
					
				}
				this.refresh();
				
				
			},
			save : function() {
				
			},
			restore : function() {
			
			},
			execute : function() {
				var data = this.input_buffer.join("");
				if(data!="") {
					while(this.input_buffer.length>0) {
						this.input_buffer.pop();
					}
					var self = this;
					// send to local handler (coproc)
					// send to server?
					var k = Class.create("Kernel");
					k.setUploadCallback(function(pass_data) {
						windowBody.updialog.style.display = "";
						self.uploading = true;
						console.log("upload callback in");
						if( self.uploading_last == null ) {
							self.uploading_last = function(evt) {
								pass_data({result:true,data : evt.target.files });
								windowBody.updialog.style.display = "none";
							}
							windowBody.updialog.addEventListener('change', self.uploading_last);
						} else {
							windowBody.updialog.removeEventListener('change', self.uploading_last);
							self.uploading_last = function(evt) {
								pass_data({result:true,data : evt.target.files });
								windowBody.updialog.style.display = "none";
							}
							windowBody.updialog.addEventListener('change', self.uploading_last);
						}
					});
					
					
					
					var parts = data.split(" ");
					
					if(parts[0]=="login") {
						parts.shift();
						k.login(parts.join(" ")
							,function(r) {
								self.output_buffer.push(JSON.stringify(r));
								
								self.refresh();
							}
							,function(r) {
								self.output_buffer.push(JSON.stringify(r));
								console.log("FAIL:",JSON.stringify(r));
								self.refresh();
							}
						);
					} else if(parts[0]=="logout") {
						parts.shift();
						k.logout(parts.join(" ")
							,function(r) {
								self.output_buffer.push(JSON.stringify(r));
								self.refresh();
							}
							,function(r) {
								self.output_buffer.push(JSON.stringify(r));
								console.log("FAIL:",JSON.stringify(r));
								self.refresh();
							}
						);
					} else if(data=="set local") {
						k.setMode("local");
						this.prompt = "local:/>";
						self.output_buffer.push(JSON.stringify({result:true}));
						self.output_buffer.push(data);
						self.history.push(data);
						self.historyCursor = -1;
						self.refresh();
					} else if(data=="set remote") {
						k.setMode("remote");
						this.prompt = "remote:/>";
						self.output_buffer.push(JSON.stringify({result:true}));
						self.output_buffer.push(data);
						self.history.push(data);
						self.historyCursor = -1;
						self.refresh();
					} else {
						
						k.run( data
							, function(r) {
								// r.output
								// r.path
								if(data.indexOf("cd")==0 && "path" in r) {
									console.log("at "+k.getMode()+ "[" + r.path +"]");
									if(k.getMode()=="local") {
										self.prompt = "local:"  + r.path + "/>";
									} else if(k.getMode()=="remote") {
										
									}
								}
								if("output" in r) {
									self.output_buffer.push("EOF>>");
									var parts = r.output.split("\r\n");
									var c = 0;
									for(var x = parts.length-1;x>=0;x--) {
										var parts2 = parts[x].split("\n");
										for(var y = parts2.length-1;y>=0;y--) {
											if(c==0 && parts2[y]=="") {
											
											} else {
												self.output_buffer.push(parts2[y]);
											}
											c++;
										}
									}
									self.output_buffer.push("<<");
									self.output_buffer.push(JSON.stringify(r));
									
								} else if("value" in r) {
									self.output_buffer.push(JSON.stringify(r.value));
									self.output_buffer.push(JSON.stringify(r));
								} else {
									self.output_buffer.push(JSON.stringify(r));
								}
								self.output_buffer.push(data);
								self.history.push(data);
								self.historyCursor = -1;
								self.refresh();	
							}
							, function(r) {
								self.output_buffer.push(JSON.stringify(r));
								self.output_buffer.push(data);
								console.log("FAIL:",JSON.stringify(r));
								self.refresh();
							} 
						);
						
					}
					
				}
				
			},
			output : function(val) {
				this.output_buffer.unshift(val);
				this.refresh();
			},
			pause : function() {
				// if it is a blocking command
				
			},
			resume : function() {
				// resume input from blocking command
				
			},
			clear : function() {
				while( this.output_buffer.length > 0 ) {
					this.output_buffer.pop();
				}
			},
			cursorStart : function() {
				var c = this;
				this.cursorStop();
				this.cursorId = setInterval(function() {
					if(c.cursor) {
						self.console_cursor.style.backgroundColor = "black";
						c.cursor = false;
					} else {
						self.console_cursor.style.backgroundColor = "lime";
						c.cursor = true;
					}
				
				},500);
			},
			cursorStop : function() {
				clearInterval(this.cursorId);
			},
			cursorId : 0,
			cursor : false,
			prompt : "local:/>",
			callback : function(data){ console.log(data); },
			refresh : function(time) {
				
				
				self.console_text.nodeValue = this.prompt + this.input_buffer.join("");
				
				if(this.output_buffer.length>this.lineCount) {
					// add lines
					for(var x = this.lineCount; x < this.output_buffer.length;x++) {
						var line = document.createTextNode("");
						var nl = document.createElement("br");
						this.lines.push( [ line, nl ] );
						self.console_history.appendChild(line);
						self.console_history.appendChild(nl);
					}
					
				} else if(this.output_buffer.length < this.lineCount) {
					// remove lines
					
					for(var x = this.lineCount; x > this.output_buffer.length;x--) {
						var p = this.lines[ x-1];
						self.console_history.removeChild( p[1] );
						self.console_history.removeChild( p[0] );
					}
				}
				for(var x = 0; x <  this.output_buffer.length;x++) {
					var p = this.lines[this.output_buffer.length-1-x];
					p[0].nodeValue = this.output_buffer[x];
				}
				//self.console_history.innerHTML = this.output_buffer.join("<br/>");
			}
		};
		Object.defineProperty(i.console,"state",{
			get : function() {
				return i.console._state;
			},
			set : function(val) {
				if(true && !i.console._state) {
					i.console.cursorStart();
				} else if(false && i.console._state) {
					i.console.cursorStop();
				}
				i.console._state = val;
				i.console.refresh();
			}
		});
		
		Object.defineProperty(this,"console",{
			get : function() { return i.console; }
		});
		
		i.__selectstart_event = function(e) { e.preventDefault(); return false; };
		
		
		
		
		
		this.on( "on", function(event,callback) {
			document.body.addEventListener(event,callback);
			return true;
		});
		this.on("off",function(event,callback) {
			document.body.removeEventListener(event,callback);
			return true;
		});
		
		
		
		
		
		this.data = this.elementNew("container","div");
		//console.log(this.data);
		
		
		this.data.style.position = "absolute";
		this.data.style.left = "0px";
		this.data.style.top = "0px";
		this.data.style.overflow = "";
		this.data.style.zIndex = 1;
		this.data.style.width = window.innerWidth + "px";
		this.data.style.height = window.innerHeight + "px";	
		
		
		this.filter = this.elementNew("filter","div");
		this.filter.style.position = "fixed";
		this.filter.style.overflow = "hidden";
		this.filter.style.left = "0px";
		this.filter.style.top = "0px";
		this.filter.style.width = window.innerWidth + "px";
		this.filter.style.height = window.innerHeight + "px";
		this.filter.style.backgroundColor = "#000";
		this.filter.style.opacity = 0.5;
		this.filter.style.zIndex = 2;
		this.filter.style.display = "none";
		
		
		// in front goes dialogs
		this.front = this.elementNew("front","div");
		this.front.style.position = "fixed";
		this.front.style.overflow = "hidden";
		this.front.style.left = "0px";
		this.front.style.top = "0px";
		this.front.style.width = window.innerWidth + "px";
		this.front.style.height = window.innerHeight + "px";
		this.front.style.zIndex = 3;
		this.front.style.display = "none";
		
		// console is above all but may be disabled
		this.console_div = this.elementNew("console","div");
		this.console_div.style.position = "fixed";
		this.console_div.style.overflow = "hidden";
		this.console_div.style.left = "0px";
		this.console_div.style.top = "0px";
		this.console_div.style.width = window.innerWidth + "px";
		this.console_div.style.height = window.innerHeight + "px";
		this.console_div.style.backgroundColor = "#000";
		this.console_div.style.fontFamily = "Courier New";
		this.console_div.style.fontSize = "18px";
		this.console_div.style.fontWeight = "bold";
		this.console_div.style.color = "#fff";
		this.console_div.style.opacity = 0.9;
		this.console_div.style.zIndex = 4;
		this.console_div.style.display = "none";
		
		// this.elementGetContents("console")
		this.console_text = document.createTextNode("");
		this.console_div.appendChild(this.console_text);
		
		
		this.console_cursor  = this.elementGetContents("console").elementNew("cursor","span");
		this.console_cursor.style.position = "relative";
		this.console_cursor.style.width = "10px";
		this.console_cursor.style.height = "10px";
		this.console_cursor.style.backgroundColor = "lime";
		this.console_cursor.innerHTML = "&nbsp";
		
		this.console_history = this.elementGetContents("console").elementNew("history","div"); // result_value
		
		this.updialog = this.elementGetContents("console").elementNew("upload_dialog","div");
		this.updialog.style.position = "absolute";
		this.updialog.style.right = "10px";
		this.updialog.style.top = "10px";
		this.updialog.style.width = "250px";
		this.updialog.style.height = "40px";
		this.updialog.style.backgroundColor = "#fff";
		this.updialog.style.border = "solid 1px #000";
		this.updialog.style.color = "#000";
		this.updialog.style.display = "none";
		
		this.updialog_inputfile = this.elementGetContents("console").elementGetContents("upload_dialog").elementNew("input_file","input");
		this.updialog_inputfile.setAttribute("type","file");
		this.updialog_inputfile.backgroundColor = "#00f";
		this.updialog_inputfile.position = "absolute";
		this.updialog_inputfile.left = "10px";
		this.updialog_inputfile.top = "10px";
		this.updialog_inputfile.width = "100px";
		this.updialog_inputfile.height = "20px";
		
		
		this.container = this.elementGetContents("container");
		TabIndexCount.reset(1);
		var self = this;
		UI.Window.on("paste",function(e) {
			console.log("PASTE");
			if(!self.internal["UI.Body"].console.state) return;
			
			var cmd = self.internal["UI.Body"].console;
			var input_buffer = cmd.input_buffer;
			
			var paste = e.clipboardData.getData("text");
			var data = [];
			for(var x = 0; x < paste.length;x++) {
				input_buffer.push(paste.charAt(x));
			}
			cmd.refresh();
		});
		
		UI.Window.on("keydown",function(e) {
			if(self.internal["UI.Body"].console.state) e.preventDefault();
			
			// manage shortcuts
			
			//console.log(e.keyCode);
			
			if(!UI.Window.keyboard.enabled) return;
			
			if(!self.consoleState()) {
				// handle turn on console
				if(e.keyCode == 119) {
					if( self.consoleState() )
						self.consoleHide();
					else
						self.consoleShow();
					e.preventDefault(); 
					e.returnValue = false;
				}
				return false;
			}
			
			
			
			
			//console.log(e);
			
			// us keyboard
			if(e.keyCode==16) {
				UI.Window.keyboard.shift = true;
				
				
			} else {
				var shift = UI.Window.keyboard.shift;
				
				var cmd = self.internal["UI.Body"].console;
				var input_buffer = cmd.input_buffer;
				var output_buffer = cmd.output_buffer;
				var history = cmd.history;
				if(e.keyCode==8) { // backspace 
					if(input_buffer.length>0) {
						input_buffer.pop();
					}
					
				} else if(e.keyCode==KeyCode.TAB) { // tab
					
				} else if(e.keyCode==10) {
				
				} else if(e.keyCode==KeyCode.ENTER) {
					setTimeout(function() {
						cmd.execute();
					},0);
					
					
				} else if(e.keyCode==KeyCode.CONTROL) { // control
					UI.Window.keyboard.ctrl = true;
				} else if(e.keyCode==KeyCode.ALT) { // alt
					UI.Window.keyboard.alt = true;
					
				} else if(e.keyCode==20) { // caps lock
					
				} else if(e.keyCode==KeyCode.ESCAPE) { // escape
					while(input_buffer.length>0) input_buffer.pop();
					cmd.historyCursor = -1;
					
				} else if(e.keyCode==KeyCode.SPACE) {
					if(input_buffer[ input_buffer.length-1 ] != " ")
						input_buffer.push(" ");
				} else if(e.keyCode==KeyCode.PAGEUP) { // page up
					
				} else if(e.keyCode==KeyCode.PAGEDOWN) { // page down
					
				} else if(e.keyCode==KeyCode.END) { // end
					
				} else if(e.keyCode==KeyCode.HOME) { // home
					
				} else if(e.keyCode==KeyCode.LEFT) { // left
				
					
				} else if(e.keyCode==KeyCode.UP) { // up
					
					cmd.historyUp();
					
				} else if(e.keyCode==KeyCode.RIGHT) { // right
					
					
				} else if(e.keyCode==KeyCode.DOWN) { // down
					cmd.historyDown();
					
				} else if(e.keyCode==KeyCode.INSERT) { // insert
					
				} else if(e.keyCode==KeyCode.DELETE) { // delete
					
				} else if(e.keyCode >= 48 && e.keyCode <= 57) { // numbers
					if(shift) {
						if(e.keyCode==48) {
							input_buffer.push(")");
						} else if(e.keyCode==49) {
							input_buffer.push("!");
						} else if(e.keyCode==50) {
							input_buffer.push("@");
						} else if(e.keyCode==51) {
							input_buffer.push("#");
						} else if(e.keyCode==52) {
							input_buffer.push("$");
						} else if(e.keyCode==53) {
							input_buffer.push("%");
						} else if(e.keyCode==54) {
							input_buffer.push("^");
						} else if(e.keyCode==55) {
							input_buffer.push("&");
						} else if(e.keyCode==56) {
							input_buffer.push("*");
						} else if(e.keyCode==57) {
							input_buffer.push("(");
						}
					} else {
						input_buffer.push(String.fromCharCode(e.keyCode));
					}
				} else if(e.keyCode >= 65 && e.keyCode <= 90) { // letters
					if(e.keyCode == 67 && UI.Window.keyboard.ctrl) { // cancel or copy, depending on state
						self.emit("ctrl-c");
						
						//65 a b 67c  de 70 fghijklmno
						// 80 pqrstuv
						//
					} else if(e.keyCode == 86 && UI.Window.keyboard.ctrl) {
						
						
					} else if(shift) {
						input_buffer.push(String.fromCharCode(e.keyCode));
					} else {
						input_buffer.push(String.fromCharCode(e.keyCode+32));
					}
				} else if(e.keyCode >= 96 && e.keyCode <= 105) { // keypad 0-9
					input_buffer.push(String.fromCharCode(e.keyCode-48));
					
				} else if(e.keyCode == 106) {
					input_buffer.push("*");
					
				} else if(e.keyCode == 107) {
					input_buffer.push("+");
					
				} else if(e.keyCode == 109) {
					input_buffer.push("-");
					
				} else if(e.keyCode == 110) {
					input_buffer.push(".");
					
				} else if(e.keyCode == 111) {
					input_buffer.push("/");
					
				} else if(e.keyCode >= 112 && e.keyCode <= 123) { // Fn
					
					if(e.keyCode == KeyCode.F11) {
						function toggleFullScreen() {
							if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
								(!document.mozFullScreen && !document.webkitIsFullScreen)) {
									if (document.documentElement.requestFullScreen) {  
										document.documentElement.requestFullScreen();  
									} else if (document.documentElement.mozRequestFullScreen) {  
										document.documentElement.mozRequestFullScreen();  
									} else if (document.documentElement.webkitRequestFullScreen) {  
										document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
									}  
							} else {  
								if (document.cancelFullScreen) {  
									document.cancelFullScreen();  
								} else if (document.mozCancelFullScreen) {  
									document.mozCancelFullScreen();  
								} else if (document.webkitCancelFullScreen) {  
									document.webkitCancelFullScreen();  
								}  
							}  
						}
						toggleFullScreen();
						
					}
					if(e.keyCode == KeyCode.F8) {
						
						if( self.consoleState() )
							self.consoleHide();
						else
							self.consoleShow();
						
					}
					
					//e.preventDefault(); 
					//return false;
						
				} else if(e.keyCode==186) {
					if(shift) {
						input_buffer.push(":");
					} else {
						input_buffer.push(";");
					}
				} else if(e.keyCode==187) {
					if(shift) {
						input_buffer.push("+");
					} else {
						input_buffer.push("=");
					}
				} else if(e.keyCode==188) {
					if(shift) {
						input_buffer.push("<");
					} else {
						input_buffer.push(",");
					}
				} else if(e.keyCode==189) {
					if(shift) {
						input_buffer.push("_");
					} else {
						input_buffer.push("-");
					}
				} else if(e.keyCode==190) {
					if(shift) {
						input_buffer.push(">");
					} else {
						input_buffer.push(".");
					}
				} else if(e.keyCode==191) {
					if(shift) {
						input_buffer.push("?");
					} else {
						input_buffer.push("/");
					}
				} else if(e.keyCode==192) {
					if(shift) {
						input_buffer.push("~");
					} else {
						input_buffer.push("`");
					}
				} else if(e.keyCode==219) {
					if(shift) {
						input_buffer.push("{");
					} else {
						input_buffer.push("[");
					}
				} else if(e.keyCode==220) {
					if(shift) {
						input_buffer.push("|");
					} else {
						input_buffer.push("\\");
					}
				} else if(e.keyCode==221) {
					if(shift) {
						input_buffer.push("}");
					} else {
						input_buffer.push("]");
					}
				} else if(e.keyCode==222) {
					if(shift) {
						input_buffer.push("\"");
					} else {
						input_buffer.push("'");
					}
				} else {
					input_buffer.push("[keycode:" + e.keyCode + "]");
				}
				cmd.refresh();
			}
			e.returnValue = false;
			return false;
		});
		
		UI.Window.on("keyup",function(e) {
			if(!UI.Window.keyboard.enabled) return;
			if(self.internal["UI.Body"].console.state) e.preventDefault();
			
			if(e.keyCode==16) {
				UI.Window.keyboard.shift = false;
			} else if(e.keyCode==17) { // ctrl
				UI.Window.keyboard.ctrl = false;
			} else if(e.keyCode==18) { // alt
				UI.Window.keyboard.alt = false;
			}
			if(self.internal["UI.Body"].console.state) {
				return false;
			}
		});
		UI.Window.on("keypress",function(e) {
			if(self.internal["UI.Body"].console.state) e.preventDefault();
			
			
			if(self.internal["UI.Body"].console.state) {
				return false;
			}
		});
		
		
		var _styles = Class.create("UI.Style");
		
		Object.defineProperty(this,"style",{
			get : function() {
				return _styles;
			}
		});
		
		//var _lang_htmlcss_collapser = Class.create("Lang.HTMLCSS_Collapser",{});
		
		//Object.defineProperty(this,"htmlcss_collapser",{ get : function() { return _lang_htmlcss_collapser; } });
		
		
	}
	, proto : {
		get : function() {
			return this.internal.WithDOMNode.parent;
		},
		Container : function() {
			return this.elementGet("container");
		},
		nodeBuild : function(target) {
			return true;
		},
		nodeDispose : function() {
			TabIndexCount.reset(1);
			this.container.nodeDispose(); // remove all only inside div:container, which is permanent
			return true;
		},
		mode : function(type) {
			// page, app
			if(type=="page") {
				this.data.style.overflow = "";
			} else if(type=="app") {
				this.data.style.overflow = "hidden";
			}
			
		},
		consoleShow : function() {
			var step = 0;
			for(var x= 0; x < 10;x++) {
				Math.sin(x*(Math.PI/180)/10);
			}
			
			var b = UI.Window.getBounds();
			var start = -b[1];
			var stepHeight = -start / 10;
			
			this.console_div.style.top = start + "px";	
			this.console_div.style.display = "";
			var self = this;
			var loop = setInterval(function() {
				self.console_div.style.top = parseInt( (start + stepHeight * step ) ) + "px";	
				console.log( parseInt( (start + stepHeight * step ) ) );
				step += 1;
				if(step == 11) {
					clearInterval(loop);
				}
			},10);
			
			this.internal["UI.Body"].console.state = true;
			UI.Window.keyboard.enabled = true;
			
			// resume command line program
			
			
		},
		consoleLog : function() {
			var args = Array.prototype.slice.apply(arguments);
			var i = this.internal["UI.Body"];
			var c = i.console;
			var str = [];
			for(var x = 0; x < args.length;x++) {
				str.push( "" + args[x] );
			}
			if(true) { // debug
				console.log(str.join(" "));
			}
			c.output_buffer.push(str.join(" "));
			c.refresh();
		},
		consoleHide : function() {
			this.console_div.style.display = "none";
			this.internal["UI.Body"].console.state = false;
			// UI.Window.keyboard.enabled = false;
			// pause command line program
			
		},
		consoleSwitch : function() {
			if( this.internal["UI.Body"].console.state ) {
				this.consoleHide();
			} else {
				this.consoleShow();
			}
		},
		consoleState : function() {
			return this.internal["UI.Body"].console.state;
		},
		consoleHandler : function(handler) {
			this.internal["UI.Body"].console.callback = handler;
		},
		block : function() {
			this.filter.style.display = "";
		},
		unblock : function() {
			this.filter.style.display = "none";
		},
		reset : function() {
			TabIndexCount.reset(1);
		},
		RenderLoop : function() {
			var time = window.performance.now();
			
			// check data ready
			
			
			// render
			UI.Body.elementRender(time);
			
			// the caller are in UI.load, UI.init -> so it's self calling if initialized
			
			
			if(UI.Body.debug) {
				//console.log("debug");
				setTimeout(UI.Body.RenderLoop,0);
			} else {
				requestAnimationFrame(UI.Body.RenderLoop);
			}
			
		},
		canSelect : function(value) {
			if(value===true) {
				this.off("selectstart",this.internal["UI.Body"].__selectstart_event);
			} else if(value===false) {
				this.on("selectstart",this.internal["UI.Body"].__selectstart_event);
			}
		},
		setSize : function(w,h) {
			this.data.style.width = w + "px";
			this.data.style.height = h + "px";
			
			this.filter.style.width = w + "px";
			this.filter.style.height = h + "px";
			
			this.console_div.style.width = w + "px";
			this.console_div.style.height = h + "px";
			
			this.emit("domResize",[w,h]);
		}
	}
});

Class.define("History",{ 
	
	// behaves not WithEvents, custom on, off and emit
	// that have an extra argument 'state' besides event and callback
	
	ctor : function() {
	
		this.ready = false;
		
		
			
		this.construct();
	
	
	}
	, proto : {
		construct : function() {
			var self = this;
		
			if ( this.ready ) { return; } // singleton
			
			this.ready = true;
			this.last_state = "";
			this.state = "";
			this.last_args = [];
			this.args = [];
		
		
			this.handlers = { 
				load : { generic: [], specific: {} },
				unload : { generic : [], specific : {} }
			};
			this.extractHash = function ( url ) { return url .replace(/^[^#]*#/, '') .replace(/^#+|#+$/, '') ; };
			this.getArgs = function() { return self.args; };
			this.getState =  function ( ) { return self.state; };
			this.setState = function ( state, args ) { 
				self.last_args = self.args;
				self.last_state = self.state;
				//state = self.extractHash(state);
				self.args = args;
				self.state = state; 
				return self.state; 
			};
			this.getHash = function ( ) { return self.extractHash(window.location.hash || location.hash); };
			this.setHash = function ( hash ) {
				hash = self.extractHash(hash);
				if ( typeof window.location.hash !== 'undefined' ) {
					if ( window.location.hash !== hash ) { window.location.hash = hash; }
				} else if ( location.hash !== hash ) {
					location.hash = hash;
				}
				return hash;
			};
			this.parse_state = function(query) {
				var data = query.split(":");
				return data.shift();
			};
			this.parse_args = function(query) {
				var data = query.split(":");
				data.shift();
				return data;
			};
			this.go = function ( to, opt ) {
				//console.log("history",to,opt);
				if(opt==undefined || opt==null || Object.prototype.toString.apply(opt) != "[object Object]") opt = {};
				
				var to_base = self.parse_state( self.extractHash(to) );
				var to_args = self.parse_args( self.extractHash(to) );
				
				var	hash_base = self.parse_state( self.getHash() );
				var force = false;
				
				if("force" in opt && opt.force === true) {
					force = true;
					console.log("force true");
				}
				
				if( self.extractHash(to) != this.getHash() ) {
					//console.log("target hash:",self.extractHash(to)," current hash:",this.getHash());
					//console.log("history A",opt);	
					
					self.emit("unload",this.getHash());
					
					self.setHash(to);
					
				} else if ( to_base !== hash_base ) { 
					//console.log("history B",opt);	
					
					//var state = self.getState();
					
					self.setHash(to);
					self.setState(to_base, to_args );
					
				} else if(true || force) {
					//console.log("history C",to_base,opt);	
					
					if(self.last_state != to_base || force) {
						//console.log("history: unload ", self.last_state);
						self.emit("unload",self.last_state, self.last_args);
					} else if(self.parse_state( self.getHash() ) != to_base ) {
						//console.log("history: unload ", self.getState());
						self.emit("unload",self.getState(),self.getArgs() );
					}
					//console.log("history C2",to_base);	
					
					self.emit("load",to_base,to_args); 
					
					self.setState(to_base, to_args );
					
					self.last_state = to_base;
					self.last_args = to_args;
					
					("callback"  in opt)&&opt.callback();
					
				}
				
				return true;
			};
			this.where = function() {
				return self.last_state;
			};
			this.hashchange = function ( e ) { 
				// this makes things load twice
				
				self.go( self.getHash() ); 
				return true;
			};
			this.on = function ( event, state, handler ) {
				//console.log("installing",event,state);
				
				var target = null;
				if(event=="load") { target = this.handlers.load; } 
				else if(event=="unload") { target = this.handlers.unload; } 
				else { throw "window.History event '"+event+"' unknown."; }
				if ( 
					handler != undefined && handler != null &&
					Object.prototype.toString.apply(handler) == "[object Function]"
				) {
					if ( typeof target.specific[state] === 'undefined' ) { target.specific[state] = []; }
					target.specific[state].push(handler);
				} else if( Object.prototype.toString.apply(state) == "[object Function]" ) {
					target.generic.push(state);
				} else { throw "window.History on called with bad arguments." }
				return true;
			};
			this.off = function(event, state,callback) {
				var target = null;
				if(event=="load") { target = this.handlers.load; } 
				else if(event=="unload") { target = this.handlers.unload; } 
				else { throw "window.History event '"+event+"' unknown."; }
				if ( 
					callback != undefined && callback != null &&
					Object.prototype.toString.apply(callback) == "[object Function]"
				) {
					if(state in target.specific) {
						for(var x = target.specific[state].length-1; x >= 0;x--) {
							if(target.specific[state][x]==callback) {
								target.specific[state].splice(x,1);
								return true;
							}
						}
					}
				} else if( Object.prototype.toString.apply(state) == "[object Function]" ) {
					for(var x = 0; x < target.generic.length;x++) {
						if(target.generic[x] == callback) { 
							target.generic.splice(x,1); 
							return true; 
						}
					}
				} else { throw "window.History off called with bad arguments." }
				return false;
			};
			
			this.emit = function ( event, state, args ) {
				var i, n, handler, list;
				var target = null;
				
				if(state==undefined||state==null) {
					state = self.getState();
					//console.log("state:",state);
					args = self.getArgs();
				}
				
				if(event=="load") { 
				
					target = self.handlers.load; 
					
					list = target.generic;
					for ( i = 0, n = list.length; i < n; ++i ) { 
						
						list[i](state);
					}
					//console.log("history.emit A",target.specific,state);
					
					if ( state in target.specific ) {
						
						list = target.specific[state];
						for ( i = 0, n = list.length; i < n; ++i ) { 
							list[i](state,args); 
						}
					}
					//console.log("LOADED??");
					
				}
				else if(event=="unload") { 
				
					target = self.handlers.unload; 
					
					if ( state in target.specific ) {
						list = target.specific[state];
						for ( i = 0, n = list.length; i < n; ++i ) { list[i](state,args); }
					}
					list = target.generic;
					
					for ( i = 0, n = list.length; i < n; ++i ) { 
						list[i](state); 
					}
				
				} 
				else { throw "window.History event '"+event+"' unknown."; }
				
				return true;
			};
		},
		init : function() {
			var hash = this.getHash();
			this.setState( this.parse_state( hash ), this.parse_args ( hash ) );
			window.addEventListener("hashchange", this.hashchange);
			this.emit("load");
		}
	}
});
History = Class.create("History");

UI.boot_callback = null;
UI.boot = function(callback) {
	UI.boot_callback = callback;
	//callback();
};
UI.init = function(callback) {
	
	var self = this;
	
	self.Body = null;
	
	this.Window = Class.create("UI.Window");
	
	
	this.Window.on("load",function() {
		self.Document = Class.create("UI.Document");	
		
		//console.log("focus");
		window.focus();
		
		if(UI.boot_callback!=null) UI.boot_callback();
		
		self.Body = Class.create("UI.Body");
		
		self.Body.nodeBuild();
		
		
		self.Window.internal["UI.Window"].loaded = true;
		
		
		
		
		
		self.Body.RenderLoop();
		
		callback.apply(self);
		
		
	});
	
	this.Window.on("resize",function() {
		if(self.Body==null) {
			// not loaded yet
			
		} else {
			self.Body.setSize(window.innerWidth,window.innerHeight);
		}
	});
	
	
};







function RoutePageInstance() {
	this.name = "";
	this.page = null;
	this.template = null;
	this.locked = false;
	this.args = [];
	this.renderId = -1;
	this.dynamic = false;
};
function RouteTemplateInstance() {
	this.name = "";
	this.page = null;
	this.args = [];
	this.loaded = false;
	this.load = null;
	this.unload = null;
	this.renderId = -1;
};

Class.define("Router",{ 
	from  :[ "WithAlias" ] 
	, ctor : function() {


		this.messages = [];
		
		this.current_page = null;
		this.current_template = null;
		
		this.internal.Router.template= {};
		
		
	}
	, proto : {
		addTemplate : function(opt,load,unload) {
			var name = "";
			if( Type.isObject(opt) ) {
				name = opt.name;
			} else if( Type.isString(opt) ) {
				name = opt;
			}
			
			var value = this.internal.Router.template[ name ] = new RouteTemplateInstance();
			value.name = name;
			value.load = load || null;
			value.unload = unload || null;
			
			
		},
		addRedirect : function(oldname,newname) {
			History.on("load",oldname,function(state,args){
				History.go("#"+newname+":" + args.join(":"));
			});
		},
		addPage : function(opt,load,unload) {
			//console.log("page",opt);
			
			var router = this;
			
			var has_template = true;
			var name = "";
			if( Type.isObject(opt) ) {
				if( !("template" in opt) ) {
					has_template = false;
					//console.log("has no template for",opt.name)
				} else {
					// console.log("has template for",opt.name);
				}
				if("name" in opt) {
					name = opt.name;
				} else {
					throw "Router.page, no name defined.";
				}
				
				//console.log("..",opt.template);
				
			} else if(Type.isString(opt)) {
				has_template = false;
				name = opt;
				opt = {};
				
				
			}
			
			if(has_template) {
				
				var value = this.varGet(name);
				if(value == null) {
					value = new RoutePageInstance();
					value.name = name;
					value.dynamic = "dynamic" in opt && opt.dynamic;
					value.locked = "locked" in opt && opt.locked;
					if(value.dynamic) value.source = opt.source;
				} else {
					throw "Router.page name '" + name + "' already defined.";
				}
				
				
				
				if( !(opt.template in this.internal.Router.template) ) {
					console.log( JSON.stringify( this.internal.Router.template ) );
					// template not defined
					console.log("template ["+opt.template+ "] not found.");
					throw "Router.page, template '" + opt.template + "' not defined.";
					
				}
				
				var self = this.internal.Router;
				
				History.on("load",name,function(state,args){
					
					if( !self.template[ opt.template ].loaded ) {
						//console.log( "disposing teplate1")
						// if current template is different from last template
						if(self.template[ opt.template ] != self.current_template && self.current_template != null) {
							//console.log( "disposing teplate2")
							// unload last template
							self.current_template.page.nodeDispose();
							self.current_template.loaded = false;
							self.current_template = null;
						}
						//console.log(args);
						self.template[ opt.template ].page = UI.Body.container.elementNew("page","UI.Page",{input:args});
						if( self.template[ opt.template ].load != null ) {
							//console.log( "disposing teplate3")
							//console.log("loading template ", self.template[ opt.template ].name);
							self.template[ opt.template ].load.apply( self.template[ opt.template ].page , [args,null,router])
						}
						self.template[ opt.template ].loaded = true;
					}
					
					value.template = self.template[ opt.template ].page;
					self.current_page = value;
					self.current_template = self.template[ opt.template ];
					
					
					if(value.page==null) {
						
						value.page = value.template.Container().elementNew("page", "UI.Page",{ input : args });
						
						//console.log("loading :>>?",value.name);
						
						if(args==undefined || args==null) args = "";
						load.apply(value.page,[args,value.template,router]);
						
						
						
						value.renderId = requestAnimationFrame(UI.Body.RenderLoop);
						
					} else {
					
						value.page.emit("UI.Page.args",[args]);
					}
					
					value.template.emit("reload");
					
					
					value.args = args;
					
					
				});
				History.on("unload",name,function(state,args){
					console.log("unload",name);
					
					var value = self.current_page;
					
					
					//if(value.renderId != -1) cancelAnimationFrame(value.renderId);
					if(value.page!=null) value.page.nodeDispose();
					
					while(value.args.length>0) value.args.pop();
					
					//value.renderId = -1;
					
					value.page = null;
					
				});
				this.varSet(name,value);
			
			} else {
				
				var value = this.varGet(name);
				if(value==null) {
					value = new RoutePageInstance();
					value.name = name;
					value.locked = "locked" in opt && opt.locked;
					value.dynamic = "dynamic" in opt && opt.dynamic;
					if(value.dynamic) value.source = opt.source;
				} else {
					throw "Router.page name '" + name + "' already defined.";
				}
				var self = this.internal.Router;
				console.log("installing history on load " + name);
				History.on("load",name,function(state,args) {
					console.log("HISTORY LOAD:",state,args);
					if(self.current_template!=null && self.current_template.loaded) {
						self.current_template.page.nodeDispose();
						self.current_template.loaded = false;
					}
					
					if(value.page == null) {
						value.page = UI.Body.container.elementNew("page", "UI.Page",{ input : args });
						if(args==undefined || args==null) args = "";
						load.apply(value.page,[args]);
						value.renderId = requestAnimationFrame(UI.Body.RenderLoop);
					} else {
						value.page.emit("UI.Page.args",[args,null,router]);
					}
					value.args = args;
					self.current_page = value;
					
				});
				History.on("unload",name,function(state,args) {
					var value = self.current_page;
					
					if(value.renderId != -1) cancelAnimationFrame(value.renderId);
					if(value.page!=null) value.page.nodeDispose();
					while(value.args.length>0) value.args.pop();
					
					value.renderId = -1;
					value.page = null;
					
				});
				
				this.varSet(name,value);
				
				
			}
		},
		forceAddPage : function(opt,load,unload) {
			try {
				this.addPage(opt,load,unload);
			} catch(e) {
				this.removePage(opt);
				this.addPage(opt,load,unload);
			}
		},
		removePage : function(opt) {
			
		}
	}
});


Router = Class.create("Router");


var display = (function() {
	function Display() {
		var _text = "";
		Object.defineProperty(this,"text",{
			get : function() { return _text; },
			set : function(v) {
				return _text = v;
			}
		});
	}
	return new Display();
});