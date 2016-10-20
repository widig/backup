/*
	Author: Flavio S. H. Kodama
	Title: Number Cooler Texture Generator 2016
	License: All Rights Reserved.
 */
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
cpu.blocked = true;

cpu.SO.type[cpu.selectedSO].app.nctg = {
	
	draw : function(args) {
		//console.log("WORKER DRAWING");
		var td = this.data = {};
		var name = args.name;
		var value = new Uint8ClampedArray(args.size*args.size*4);
		if(name == "webgl texture fail to load") {
			
		} else if(name == "stripes") {
			//console.log("WORKER DRAWING STRIPES");
			
			// reversed y
			
			
			var type = 2;
			if(type==1) {
				for(var y = 0; y < 64;y++) {
					for(var x = 0; x < 64;x++) {
						var pos = 4*(y*64+x);
						
						
						if( y % 16 < 8 ) {
							if( x % 16 < 8) {
								value[pos+0] = 4*y;
								value[pos+1] = 255;
								value[pos+2] = 0;
								value[pos+3] = 0;
							} else {
								value[pos+0] = 4*y;
								value[pos+1] = 0;
								value[pos+2] = 255;
								value[pos+3] = 255;
							}
						} else {
							value[pos+0] = 4*y;
							value[pos+1] = 0;
							value[pos+2] = 0;
							value[pos+3] = 255;
						}
					}
				}
			} else {
				var sz = args.size;
				var hsz = sz/2;
				console.log("WORKER TEXTURE ",hsz,sz);
				for(var y = 0; y < sz;y++) {
					for(var x = 0; x < sz;x++) {
						var pos = 4*(y*sz+x);
						var val = parseInt(Math.sqrt(( (x-hsz-1)*(x-hsz-1) + (y-hsz-1)*(y-hsz-1) )));
						
						if(val < 256){
							value[pos+0] = 255-val;
							value[pos+1] = 255-val;
							value[pos+2] = 255-val;
							value[pos+3] = 255;
						} else {
							value[pos+0] = 0;
							value[pos+1] = 0;
							value[pos+2] = 0;
							value[pos+3] = 255;
						}
					}
				}
			}
			self.postMessage({app:"nctg",method:"done",args:[ { name : name, value :  value,  size : args.size } ]});	
		}
		
	}
}
	
	
self.addEventListener('message', function(e) {
	
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
	
	//self.postMessage({app:"textscroller",method:"render",args:[imgData]});
	//self.postMessage({method:"message",args:["I'm iddle."]});
	
}, false);