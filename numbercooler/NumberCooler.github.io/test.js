function mount_logo() {
		
		
		var s_scale = 1.3;
		var width = s_scale*280;
		var height = s_scale*100;
		var base_logo = this.Container().elementNew("base_logo","div");
		
		base_logo.style.position = "absolute";
		base_logo.style.left = (window.innerWidth / 2 - 622) + "px";
		base_logo.style.top = "10px";
		base_logo.style.width = parseInt(width) + "px";
		base_logo.style.height = parseInt(1.2*height) + "px";
		base_logo.style.backgroundColor = "#eee";
		base_logo.style.border = "solid 1px #888";
		base_logo.style.opacity = 0.4;
		
		var logo = this.Container().elementNew("logo","canvas");
		logo.style.position = "absolute";
		logo.style.left = (window.innerWidth / 2 - 652) + "px";
		
		
		logo.style.top = "0px";
		logo.style.width = width + "px";
		logo.style.height = height + "px";
		logo.setAttribute("width",width);
		logo.setAttribute("height",height);
		logo.style["image-rendering"] = "-webkit-optimize-contrast";
		var logo_ctx = logo.getContext("2d");
		
		var cx = width/2;
		var cy = height/2;
		
		var V3 = function(a,b,c) {
			if(Type.isArray(a)) {
				return Class.create("XMath.V3",{ "XMath.V3" : [8,a[0],a[1],a[2]] });
			} else {
				if(a==undefined) {
					return Class.create("XMath.V3",{ "XMath.V3" : [8,0,0,0] });
				} else {
					return Class.create("XMath.V3",{ "XMath.V3" : [8,a,b,c] });
				}
			}
		};
		var M4 = function(a,b,c) {
			return Class.create("XMath.M4",{ "XMath.M4" : [8] });
		};
		var meshes = [];
		var m_offsetx = -300;
		var m_offsety = 300;
		var m_scale = s_scale*0.12;
		
		var mesh_g = (function() {
			var border = 25;
			
			var v = [
				/*
				// g border left and down
				[ V3([100,-border,1]), V3([100,0,1]), V3([400-border,0,1]), V3([400-border,-border,1]), "#eeeeee"  ],
				[ V3([0,-border,1]), V3([0,0,1]), V3([100,0,1]), V3([100,-border,1]), "#eeeeee"  ], 
				
				[ V3([0,0,1]), V3([-border,0,1]), V3([-border,-border,1]), V3([0,-border,1]), "#eeeeee"  ], 
				[ V3([0,0,1]), V3([0,100,1]), V3([-border,100,1]), V3([-border,0,1]), "#eeeeee"  ], 
				[ V3([0,100,1]), V3([0,400,1]), V3([-border,400,1]), V3([-border,100,1]), "#eeeeee"  ], 
				[ V3([0,400,1]), V3([0,500,1]), V3([-border,500,1]), V3([-border,400,1]), "#eeeeee"  ], 
				[ V3([0,500,1]), V3([0,500+border,1]), V3([-border,500+border,1]), V3([-border,500,1]), "#eeeeee"  ], 
				
				[ V3([100,500,1]), V3([100,500+border,1]), V3([0,500+border,1]), V3([0,500,1]), "#eeeeee"  ], 
				[ V3([400,500,1]), V3([400,500+border,1]), V3([100,500+border,1]), V3([100,500,1]), "#eeeeee"  ], 
				[ V3([500,500,1]), V3([500,500+border,1]), V3([400,500+border,1]), V3([400,500,1]), "#eeeeee"  ], 
				
				[ V3([500+border,500,1]), V3([500+border,500+border,1]), V3([500,500+border,1]), V3([500,500,1]), "#eeeeee"  ], 
				[ V3([500+border,400,1]), V3([500+border,500,1]), V3([500,500,1]), V3([500,400,1]), "#eeeeee"  ], 
				[ V3([500+border,400-border,1]), V3([500+border,400,1]), V3([500,400,1]), V3([500,400-border,1]), "#eeeeee"  ], 
				
				//[ V3([500,400-border,1]), V3([500,400,1]), V3([400,400,1]), V3([400,400-border,1]), "#eeeeee"  ], 
				[ V3([500,400-border,1]), V3([500,400,1]), V3([100+border,400,1]), V3([100+border,400-border,1]), "#eeeeee"  ], 
				
				[ V3([100+border,400-border,1]), V3([100+border,400,1]), V3([100,400,1]), V3([100,400-border,1]), "#eeeeee"  ], 
				
				[ V3([100+border,100+border,1]), V3([100+border,400-border,1]), V3([100,400-border,1]), V3([100,100+border,1]), "#eeeeee"  ], 
				
				[ V3([100+border,100,1]), V3([100+border,100+border,1]), V3([100,100+border,1]), V3([100,100,1]), "#eeeeee"  ], 
				[ V3([400,100,1]), V3([400,100+border,1]), V3([100+border,100+border,1]), V3([100+border,100,1]), "#eeeeee"  ], 
				
				//[ V3([400,100,1]), V3([400,100+border,1]), V3([400-border,100+border,1]), V3([400-border,100,1]), "#eeeeee"  ], 
				
				[ V3([400,100+border,1]), V3([400,200-border,1]), V3([400-border,200-border,1]), V3([400-border,100+border,1]), "#eeeeee"  ], 
				
				//[ V3([400,200-border,1]), V3([400,200,1]), V3([400-border,200,1]), V3([400-border,200-border,1]), "#eeeeee"  ], 
				
				[ V3([400,200-border,1]), V3([400	,200,1]), V3([200,200,1]), V3([200,200-border,1]), "#eeeeee"  ], 
				
				*/
				
				//
				
				//[ V3([-border,0,1]), V3([-border,0,100]), V3([-border,-border,100]), V3([-border,-border,1]), "#dddddd"  ], 
				//[ V3([-border,-border,1]), V3([-border,-border,100]), V3([0,-border,100]), V3([0,-border,1]), "#dddddd"  ], 
				
				//[ V3([0,-border,1]), V3([0,-border,100]), V3([100,-border,100]), V3([100,-border,1]), "#dddddd"  ], 
				//[ V3([100,-border,1]), V3([100,-border,100]), V3([400-border,-border,100]), V3([400-border,-border,1]), "#dddddd"  ], 
				
				//[ V3([-border,100,1]), V3([-border,100,100]), V3([-border,0,100]), V3([-border,0,1]), "#dddddd"  ], 
				//[ V3([-border,400,1]), V3([-border,400,100]), V3([-border,100,100]), V3([-border,100,1]), "#dddddd"  ], 
				
				//[ V3([-border,500,1]), V3([-border,500,100]), V3([-border,400,100]), V3([-border,400,1]), "#dddddd"  ], 
				//[ V3([-border,500+border,1]), V3([-border,500+border,100]), V3([-border,500,100]), V3([-border,500,1]), "#dddddd"  ], 
				
				//[ V3([-border,500+border,100]), V3([-border,500+border,1]), V3([0,500+border,1]), V3([0,500+border,100]), "#dddddd"  ], 
				//[ V3([0,500+border,100]), V3([0,500+border,1]), V3([100,500+border,1]), V3([100,500+border,100]), "#dddddd"  ], 
				//[ V3([100,500+border,100]), V3([100,500+border,1]), V3([400,500+border,1]), V3([400,500+border,100]), "#dddddd"  ], 
				
				//[ V3([400,500+border,100]), V3([400,500+border,1]), V3([500,500+border,1]), V3([500,500+border,100]), "#dddddd"  ], 
				//[ V3([500,500+border,100]), V3([500,500+border,1]), V3([500+border,500+border,1]), V3([500+border,500+border,100]), "#dddddd"  ], 
				
				// [ V3([500+border,500,1]), V3([500+border,500,100]), V3([500+border,500+border,100]), V3([500+border,500+border,1]), "#dddddd"  ], 
				// [ V3([500+border,400,1]), V3([500+border,400,100]), V3([500+border,500,100]), V3([500+border,500,1]), "#dddddd"  ], 
				
				//[ V3([500+border,400-border,1]), V3([500+border,400-border,100]), V3([500+border,400,100]), V3([500+border,400,1]), "#dddddd"  ], 
				
				
				
				
				
				
				[ V3([0,0,1]), V3([0,100,1]), V3([100,100,1]), V3([100,0,1])  ], 
				[ V3([0,100,1]),V3([0,400,1]), V3([100,400,1]), V3([100,100,1]) ],
				[ V3([0,400,1]),V3([0,500,1]), V3([100,500,1]), V3([100,400,1]) ],
				[ V3([100,0,1]),V3([100,100,1]), V3([400,100,1]), V3([400,0,1]) ],
				[ V3([400,0,1]),V3([400,100,1]), V3([500,100,1]), V3([500,0,1]) ],
				[ V3([400,100,1]),V3([400,300,1]), V3([500,300,1]),V3([500,100,1]) ],
				[ V3([400,200,1]), V3([400,300,1]), V3([200,300,1]),V3([200,200,1]) ],
				[ V3([100,400,1]), V3([500,400,1]), V3([500,500,1]),V3([100,500,1]) ],
				
				
				[ V3([0,0,1]), V3([0,100,1]), V3([0,100,100]), V3([0,0,100]), "#0000cc" ],
				[ V3([0,100,1]), V3([0,400,1]), V3([0,400,100]), V3([0,100,100]), "#0000cc" ],
				[ V3([0,400,1]), V3([0,500,1]), V3([0,500,100]), V3([0,400,100]), "#0000cc" ],
				[ V3([100,100,1]), V3([100,400,1]), V3([100,400,100]), V3([100,100,100]), "#0000cc" ],
				[ V3([0,500,1]), V3([100,500,1]), V3([100,500,100]), V3([0,500,100]), "#0000cc" ],
				[ V3([100,500,1]), V3([500,500,1]), V3([500,500,100]), V3([100,500,100]), "#0000cc" ],
				[ V3([500,500,1]), V3([500,400,1]), V3([500,400,100]), V3([500,500,100]), "#0000cc" ],
				[ V3([100,400,1]), V3([500,400,1]), V3([500,400,100]), V3([100,400,100]), "#0000cc" ],
				[ V3([100,100,1]), V3([400,100,1]), V3([400,100,100]), V3([100,100,100]), "#0000cc" ],
				[ V3([400,100,1]), V3([400,200,1]), V3([400,200,100]), V3([400,100,100]), "#0000cc" ],
				[ V3([200,200,1]), V3([400,200,1]), V3([400,200,100]), V3([200,200,100]), "#0000cc" ],
				[ V3([200,200,1]), V3([200,300,1]), V3([200,300,100]), V3([200,200,100]), "#0000cc" ],
				[ V3([200,300,1]), V3([400,300,1]), V3([400,300,100]), V3([200,300,100]), "#0000cc" ],
				[ V3([400,300,1]), V3([500,300,1]), V3([500,300,100]), V3([400,300,100]), "#0000cc" ],
				[ V3([500,300,1]), V3([500,100,1]), V3([500,100,100]), V3([500,300,100]), "#0000cc" ],
				[ V3([500,100,1]), V3([500,0,1]), V3([500,0,100]), V3([500,100,100]), "#0000cc" ],
				[ V3([500,0,1]), V3([400,0,1]), V3([400,0,100]), V3([500,0,100]), "#0000cc" ],
				[ V3([100,0,1]), V3([400,0,1]), V3([400,0,100]), V3([100,0,100]), "#0000cc" ],
				[ V3([0,0,1]), V3([100,0,1]), V3([100,0,100]), V3([0,0,100]), "#0000cc" ],
				
				[ V3([0,0,100]), V3([0,100,100]), V3([100,100,100]), V3([100,0,100])  ], 
				[ V3([0,100,100]),V3([0,400,100]), V3([100,400,100]), V3([100,100,100]) ],
				[ V3([0,400,100]),V3([0,500,100]), V3([100,500,100]), V3([100,400,100]) ],
				[ V3([100,0,100]),V3([100,100,100]), V3([400,100,100]), V3([400,0,100]) ],
				[ V3([400,0,100]),V3([400,100,100]), V3([500,100,100]), V3([500,0,100]) ],
				[ V3([400,100,100]),V3([400,300,100]), V3([500,300,100]), V3([500,100,100]) ],
				[ V3([400,200,100]), V3([400,300,100]), V3([200,300,100]),V3([200,200,100]) ],
				[ V3([100,400,100]), V3([500,400,100]), V3([500,500,100]),V3([100,500,100]) ]
				
			];
			var o = [ [V3([0,0,1]), V3([0,100,1])] ];
			var Ts = [];
			for(var x = 0; x < 6;x++) { 
				var m = M4(); 
				m.I(); 
				Ts.push( m ); 
			}
			
			Ts[1].rotate(-45,0,0,1);
			Ts[0].translate(m_offsetx-200,m_offsety-300,-50);
			
			for(var x = 0; x < v.length;x++) {
				for(var y = 0; y < 4;y++) {
					v[x][y] = Ts[0].vmul(v[x][y]);
					v[x][y] = Ts[1].vmul(v[x][y]);
				}
			}
			
			var vb = [];
			for(var x = 0; x < v.length;x++) vb.push( [ V3(), V3(), V3(), V3() ] );
			var r = {};
			r.v = v;
			r.vb = vb;
			r.o = o;
			return r;

		})();
		meshes.push(mesh_g);
		
		
		var mesh_e = (function() {

			var v = [
				[ V3([0,0,1]), V3([0,100,1]), V3([100,100,1]), V3([100,0,1]) ],
				[ V3([0,100,1]), V3([100,100,1]), V3([100,400,1]),V3([0,400,1]) ],
				[ V3([0,400,1]), V3([100,400,1]), V3([100,500,1]),V3([0,500,1]) ],
				[ V3([100,0,1]), V3([500,0,1]), V3([500,100,1]),V3([100,100,1]) ],
				[ V3([100,400,1]), V3([500,400,1]), V3([500,500,1]),V3([100,500,1]) ],
				[ V3([100,325,1]), V3([100,225,1]), V3([150,175,1]),V3([150,275,1]) ],
				[ V3([150,275,1]), V3([150,175,1]), V3([200,225,1]),V3([200,325,1]) ],
				[ V3([200,325,1]), V3([200,225,1]), V3([250,175,1]),V3([250,275,1]) ],			
				[ V3([250,275,1]), V3([250,175,1]), V3([300,225,1]),V3([300,325,1]) ],
				[ V3([300,325,1]), V3([300,225,1]), V3([350,175,1]),V3([350,275,1]) ],
				[ V3([350,275,1]), V3([350,175,1]), V3([400,225,1]),V3([400,325,1]) ],
				[ V3([0,0,100]), V3([0,100,100]), V3([100,100,100]), V3([100,0,100]) ],
				[ V3([0,100,100]), V3([100,100,100]), V3([100,400,100]),V3([0,400,100]) ],
				[ V3([0,400,100]), V3([100,400,100]), V3([100,500,100]),V3([0,500,100]) ],
				[ V3([100,0,100]), V3([500,0,100]), V3([500,100,100]),V3([100,100,100]) ],
				[ V3([100,400,100]), V3([500,400,100]), V3([500,500,100]),V3([100,500,100]) ],
				[ V3([100,325,100]), V3([100,225,100]), V3([150,175,100]),V3([150,275,100]) ],
				[ V3([150,275,100]), V3([150,175,100]), V3([200,225,100]),V3([200,325,100]) ],
				[ V3([200,325,100]), V3([200,225,100]), V3([250,175,100]),V3([250,275,100]) ],			
				[ V3([250,275,100]), V3([250,175,100]), V3([300,225,100]),V3([300,325,100]) ],
				[ V3([300,325,100]), V3([300,225,100]), V3([350,175,100]),V3([350,275,100]) ],
				[ V3([350,275,100]), V3([350,175,100]), V3([400,225,100]),V3([400,325,100]) ],
				[ V3([0,0,1]), V3([0,100,1]), V3([0,100,100]), V3([0,0,100]), "#0000cc" ],
				[ V3([0,0,1]), V3([100,0,1]), V3([100,0,100]), V3([0,0,100]), "#0000cc" ],
				[ V3([0,100,1]), V3([0,400,1]), V3([0,400,100]), V3([0,100,100]), "#0000cc" ],
				[ V3([0,400,1]), V3([0,500,1]), V3([0,500,100]), V3([0,400,100]), "#0000cc" ],
				[ V3([0,500,1]), V3([100,500,1]), V3([100,500,100]), V3([0,500,100]), "#0000cc" ],
				[ V3([100,100,1]), V3([100,400,1]), V3([100,400,100]), V3([100,100,100]), "#0000cc" ],
				[ V3([100,500,1]), V3([500,500,1]), V3([500,500,100]), V3([100,500,100]), "#0000cc" ],
				[ V3([500,500,1]), V3([500,400,1]), V3([500,400,100]), V3([500,500,100]), "#0000cc" ],
				[ V3([100,400,1]), V3([500,400,1]), V3([500,400,100]), V3([100,400,100]), "#0000cc" ],
				[ V3([100,100,1]), V3([500,100,1]), V3([500,100,100]), V3([100,100,100]), "#0000cc" ],
				[ V3([500,100,1]), V3([500,0,1]), V3([500,0,100]), V3([500,100,100]), "#0000cc" ],
				[ V3([100,0,1]), V3([500,0,1]), V3([500,0,100]), V3([100,0,100]), "#0000cc" ],
				[ V3([100,325,1]), V3([150,275,1]), V3([150,275,100]), V3([100,325,100]), "#0000cc" ],
				[ V3([100,225,1]), V3([150,175,1]), V3([150,175,100]), V3([100,225,100]), "#0000cc" ],
				[ V3([150,275,1]), V3([200,325,1]), V3([200,325,100]), V3([150,275,100]), "#0000cc" ],
				[ V3([150,175,1]), V3([200,225,1]), V3([200,225,100]), V3([150,175,1]), "#0000cc" ],
				[ V3([200,325,1]), V3([250,275,1]), V3([250,275,100]), V3([200,325,100]), "#0000cc" ],			
				[ V3([200,225,1]), V3([250,175,1]), V3([250,175,100]), V3([200,225,100]), "#0000cc" ],
				[ V3([250,275,1]), V3([300,325,1]), V3([300,325,100]), V3([250,275,100]), "#0000cc" ],
				[ V3([250,175,1]), V3([300,225,1]), V3([300,225,100]), V3([250,175,100]), "#0000cc" ],
				[ V3([300,325,1]), V3([350,275,1]), V3([350,275,100]), V3([300,325,100]), "#0000cc" ],
				[ V3([300,225,1]), V3([350,175,1]), V3([350,175,100]), V3([300,225,100]), "#0000cc" ],
				[ V3([350,275,1]), V3([400,325,1]), V3([400,325,100]), V3([350,275,100]), "#0000cc" ],
				[ V3([350,175,1]), V3([400,225,1]), V3([400,225,100]), V3([350,175,100]), "#0000cc" ],
				[ V3([400,325,1]), V3([400,225,1]), V3([400,225,100]), V3([400,325,100]), "#0000cc"]
			];
			var o = [];
			var vb = [];
			for(var x = 0; x < v.length;x++) vb.push( [ V3(), V3(), V3(), V3() ] );
			var Ts = [];
			for(var x = 0; x < 6;x++) { var m = M4(); m.I(); Ts.push( m ); }
			
			Ts[1].rotate(-45,0,0,1);
			Ts[0].translate(m_offsetx-250+450,m_offsety-300-400,-50);
			for(var x = 0; x < v.length;x++) {
				for(var y = 0; y < 4;y++) {
					v[x][y] = Ts[0].vmul(v[x][y]);
					v[x][y] = Ts[1].vmul(v[x][y]);
				}
			}
			var r = {};
			r.v = v;
			r.vb = vb;
			r.o = o;
			
			return r;
		
		})();
		meshes.push(mesh_e);

		
		
		var mesh_o = (function() {

			var v = [
				[ V3([0,0,1]), V3([0,100,1]), V3([100,100,1]), V3([100,0,1]) ],
				[ V3([0,100,1]), V3([100,100,1]), V3([100,400,1]),V3([0,400,1]) ],
				[ V3([0,400,1]), V3([100,400,1]), V3([100,500,1]),V3([0,500,1]) ],
				[ V3([100,0,1]), V3([400,0,1]), V3([400,100,1]),V3([100,100,1]) ],
				[ V3([400,100,1]), V3([400,0,1]), V3([500,0,1]),V3([500,100,1]) ],
				[ V3([400,100,1]), V3([500,100,1]), V3([500,400,1]),V3([400,400,1]) ],
				[ V3([400,400,1]), V3([500,400,1]), V3([500,500,1]),V3([400,500,1]) ],
				[ V3([400,400,1]), V3([400,500,1]), V3([100,500,1]),V3([100,400,1]) ],
				[ V3([0,0,100]), V3([0,100,100]), V3([100,100,100]), V3([100,0,100]) ],
				[ V3([0,100,100]), V3([100,100,100]), V3([100,400,100]),V3([0,400,100]) ],
				[ V3([0,400,100]), V3([100,400,100]), V3([100,500,100]),V3([0,500,100]) ],
				[ V3([100,0,100]), V3([400,0,100]), V3([400,100,100]),V3([100,100,100]) ],
				[ V3([400,100,100]), V3([400,0,100]), V3([500,0,100]),V3([500,100,100]) ],
				[ V3([400,100,100]), V3([500,100,100]), V3([500,400,100]),V3([400,400,100]) ],
				[ V3([400,400,100]), V3([500,400,100]), V3([500,500,100]),V3([400,500,100]) ],
				[ V3([400,400,100]), V3([400,500,100]), V3([100,500,100]),V3([100,400,100]) ],
				[ V3([0,0,1]), V3([0,100,1]), V3([0,100,100]), V3([0,0,100]), "#0000cc" ],
				[ V3([0,0,1]), V3([100,0,1]), V3([100,0,100]), V3([0,0,100]), "#0000cc" ],
				[ V3([0,100,1]), V3([0,400,1]), V3([0,400,100]), V3([0,100,100]), "#0000cc" ],
				[ V3([0,400,1]), V3([0,500,1]), V3([0,500,100]), V3([0,400,100]), "#0000cc" ],
				[ V3([0,500,1]), V3([100,500,1]), V3([100,500,100]), V3([0,500,100]), "#0000cc" ],
				[ V3([100,100,1]), V3([100,400,1]), V3([100,400,100]), V3([100,100,100]), "#0000cc" ],
				[ V3([500,100,1]), V3([500,0,1]), V3([500,0,100]), V3([500,100,100]), "#0000cc" ],
				[ V3([500,0,1]), V3([400,0,1]), V3([400,0,100]), V3([500,0,100]), "#0000cc" ],
				[ V3([100,0,1]), V3([400,0,1]), V3([400,0,100]), V3([100,0,100]), "#0000cc" ],
				[ V3([100,100,1]), V3([400,100,1]), V3([400,100,100]), V3([100,100,100]), "#0000cc" ],
				[ V3([100,500,1]), V3([400,500,1]), V3([400,500,100]), V3([100,500,100]), "#0000cc" ],
				[ V3([100,400,1]), V3([400,400,1]), V3([400,400,100]), V3([100,400,100]), "#0000cc" ],
				[ V3([400,500,1]), V3([500,500,1]), V3([500,500,100]), V3([400,500,100]), "#0000cc" ],
				[ V3([500,500,1]), V3([500,400,1]), V3([500,400,100]), V3([500,500,100]), "#0000cc" ],
				[ V3([400,400,1]), V3([400,100,1]), V3([400,100,100]), V3([400,400,100]), "#0000cc" ],
				[ V3([500,400,1]), V3([500,100,1]), V3([500,100,100]), V3([500,400,100]), "#0000cc" ]
			];
			
			var o = [];
			
			var vb = [];
			
			for(var x = 0; x < v.length;x++)
				vb.push( [ V3(), V3(), V3(), V3() ] );
			
			var Ts = [
				M4(),
				M4(),
				M4(),
				M4(),
				M4(),
				M4()
			];
			
			Ts[0].I();
			
			
			Ts[1].I();
			Ts[1].rotate(-45,0,0,1);
			
			Ts[0].I();
			Ts[0].translate(m_offsetx-250+450+400,m_offsety-300-400-400,-50);
			
			//Ts[1].identity();
			//Ts[1].rotate(-45,0,0,1);
			for(var x = 0; x < v.length;x++) {
				for(var y = 0; y < 4;y++) {
					v[x][y] = Ts[0].vmul(v[x][y]);
					v[x][y] = Ts[1].vmul(v[x][y]);
				}
			}
			
			var r = {};
			r.v = v;
			r.vb = vb;
			r.o = o;
			return r;
		})();
		meshes.push(mesh_o);
		// --------------------------------------------------------------------------------
		// MATRIX CONSTANTS
		// --------------------------------------------------------------------------------
		
		var m_rotate_x_add = M4();
		
		m_rotate_x_add.I();
		m_rotate_x_add.rotate(1,1,0,0);
		var m_rotate_x_sub = M4();
		m_rotate_x_sub.I();
		m_rotate_x_sub.rotate(-1,1,0,0);
		var m_rotate_y_add = M4();
		m_rotate_y_add.I();
		m_rotate_y_add.rotate(1,0,1,0);
		var m_rotate_y_sub = M4();
		m_rotate_y_sub.I();
		m_rotate_y_sub.rotate(-1,0,1,0);
		var m_rotate_z_add = M4();
		m_rotate_z_add.I();
		m_rotate_z_add.rotate(1,0,0,1);
		var m_rotate_z_sub = M4();
		m_rotate_z_sub.I();
		m_rotate_z_sub.rotate(-1,0,0,1);
		
		var m_translate_x_add = M4();
		m_translate_x_add.I();
		m_translate_x_add.translate(1,0,0);
		var m_translate_x_sub = M4();
		m_translate_x_sub.I();
		m_translate_x_sub.translate(-1,0,0);
		var m_translate_y_add = M4();
		m_translate_y_add.I();
		m_translate_y_add.translate(0,1,0);
		var m_translate_y_sub = M4();
		m_translate_y_sub.I();
		m_translate_y_sub.translate(0,-1,0);
		var m_translate_z_add = M4();
		m_translate_z_add.I();
		m_translate_z_add.translate(0,0,1);
		var m_translate_z_sub = M4();
		m_translate_z_sub.I();
		m_translate_z_sub.translate(0,0,-1);
		
		
		var m_scale_x_add = M4();
		m_scale_x_add.I();
		m_scale_x_add.scale(1.01,1,1);
		var m_scale_x_sub = M4();
		m_scale_x_sub.I();
		m_scale_x_sub.scale(0.99009900990,1,1);
		var m_scale_y_add = M4();
		m_scale_y_add.I();
		m_scale_y_add.scale(1,1.01,1);
		var m_scale_y_sub = M4();
		m_scale_y_sub.I();
		m_scale_y_sub.scale(1,0.99009900990,1);
		var m_scale_z_add = M4();
		m_scale_z_add.I();
		m_scale_z_add.scale(1,1,1.01);
		var m_scale_z_sub = M4();
		m_scale_z_sub.I();
		m_scale_z_sub.scale(1,1,0.99009900990);
		
		
		var camera = {};
		camera.lookat = M4();
		camera.lookat.I();
		camera.lookat.lookat(
			0,0,1.0, // eye
			0,0,0, // look
			0,1.0,0 // up
		);
		camera.projection = M4();
		camera.projection.I();
		camera.projection.perspective(120,9/16,0.1,10000);
		
		var m2 = M4();
		m2.I();
		m2.scale(m_scale);
		
		for(var k = 0; k < meshes.length;k++) {
			var v = meshes[k].v;
			for(var x = 0; x < v.length;x++) {
				for(var y = 0; y < 4;y++) {
					var q = v[x];
					v[x][y] = m2.vmul(q[y]);
					
				}
			}
		}
		
		// --------------------------------------------------------------------------------
		// RENDER SETUP
		// --------------------------------------------------------------------------------
		
		var rendering = false;
		var loop = null;
		
		var color_pallete = [];
		for(var x = 0; x < 128;x++) {
			color_pallete.push( Color.RGB.toHex(0,0,64+x) );
		}
		
		var world_transform = [];
		
		world_transform.push(camera.lookat);
		world_transform.push(camera.projection);
		var target_transform = [];

		var pos = 0;
		var speed = 0;
		var accel = 0;
		
		polyline = function() {
			var a = arguments;
			var len = a.length;
			var g = this;
			if(len>=3) {
				// 0 - pts array
				// 1 - args { }
				var t0 = Type(a[0]).name;
				var t1 = Type(a[1]).name;
				if(t0=="array" && ((a[0].length%2)==0) && a[0].length > 0 && t1=="object") {
					if(a[1].fg!=undefined) g.strokeStyle = a[1].fg;
					if(a[1].bg!=undefined) g.fillStyle = a[1].bg;
					if(a[1].border!=undefined) g.lineWidth = a[1].border;
					g.lineCap = "square";
					g.beginPath();
					g.moveTo(a[0][0],a[0][1]);
					for(var x = 0; x < a[0].length-1;x+=2) g.lineTo(a[0][x],a[0][x+1]);
					if(a[2]!=undefined && a[2]==true) g.fill();
					if(a[3]==undefined || a[3]==true) g.stroke();
					g.closePath();
				}
			}
			return this;
		}
		
		//var fn = "setTimeout";
		var fn = "setInterval";
		loop = window[fn](function() {
			
			logo_ctx.clearRect ( 0 , 0 , width , height )
			
			var mrx = M4();
			mrx.I();
			mrx.rotate(20*Math.PI/100,1,0,0);
			pos += Math.PI/100;
			//mrx.translate(-1,0,0);
			world_transform.push(mrx);
			//world_transform.push(control.lookat);
			var m = M4();
			m.I();
			for(var k = 0; k < world_transform.length;k++) m = m.mmul(world_transform[world_transform.length-1-k]);
			
			// TRANSFORM
			var arr = [];
			for(var k = 0; k < meshes.length;k++) {
				var vb = meshes[k].vb;
				var v = meshes[k].v;
				for(var x = 0; x < v.length;x++) {
					var offset = arr.length;
					var z = [];
					for(var y = 0; y < 4;y++) { // QL
						var q = v[x];
						vb[x][y] = m.vmul(q[y]);
						z.push(vb[x][y]);
					}
					for(var y = 4; y < v[x].length;y++) {
						z.push(v[x][y]);
					}
					arr.push(z);
				}
			}
			// Z-ORDER
			var zorder = [];
			var zsum = [];
			for(var x = 0; x < arr.length;x++) {
				var sum = 0;
				for(var y = 0; y < 4;y++) { // QL
					var q = arr[x];
					sum += q[y].data[2];
				}
				zsum.push(sum/4);
				zorder.push(x);
			}
			// 		sort
			var max = -1000000000;
			for(var x = 0; x < zorder.length;x++) {
				var min = zsum[x];
				if(max < zsum[x]) max = zsum[x];
				
				for(var y = x+1;y<zorder.length;y++) {
					if(min > zsum[y]) {
						min = zsum[y];
						var tmp = zsum[x];
						zsum[x] = zsum[y];
						zsum[y] = tmp;
						tmp = zorder[x];
						zorder[x] = zorder[y];
						zorder[y] = tmp;
					}
				}
			}
			// draw QL
			
			for(var x = 0; x < zorder.length;x++) {
				var q = arr[ zorder[x] ];
				var points = [];
				for(var y = 0; y < 4;y++) {
					
					points.push(
						(q[y].data[0])+cx,
						(-q[y].data[1])+cy
					);
				}
				points.push((arr[ zorder[x] ][0].data[0])+cx,(-arr[ zorder[x] ][0].data[1])+cy);
				
				if(arr[zorder[x]].length>4) {
				
					polyline.apply(logo_ctx, [points,{fg:"#00ff00",bg:arr[zorder[x]][4],border:2},true,false]);
				} else {
					polyline.apply( logo_ctx, [points,{fg:"#00ff00",bg:"#0000ff",border:2},true,false] );
				}
			}
			
			
		},10);
		console.log("CANVAS LOGO 3D");
		
		
		return [base_logo,logo];
		
	}
