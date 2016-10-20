


if (typeof module !== 'undefined' && module.exports) {
	require("../Class.js");
}



Class.define("XMath.3Devils.Camera",{
	from : [ "WithArray", "WithEvents"] // array is lens array
	, ctor : function() {
		
		
		
		var i = this.internal["XMath.3Devils.Camera"].data = {};
		i.up = XMath.V3(0,1,0);
		i.lookAt = XMath.V3(0,0,0);
		i.position = XMath.V3(0,0,-1);
		
		Object.defineProperty(this,"upString",{
			get : function() {
				return i.up.toString();
			}
		});
		Object.defineProperty(this,"lookAtString",{
			get : function() {
				return i.lookAt.toString();
			}
		});
		Object.defineProperty(this,"positionString",{
			get : function() {
				return i.position.toString();
			}
		});
		
		
		
	},
	proto : {
		Slide : function(direction,amount,relative, update_lookat) {
			
			// may return the items that need to be update
			// so we can predict colisions that are originated
			// from this move
			
			
			// forward
			// backward
			// left
			// right
			// up
			// down
			
			
			var i = this.internal["XMath.3Devils.Camera"].data;
			
			var x = i.lookAt.x - i.position.x,
				y = i.lookAt.y - i.position.y,
				z = i.lookAt.z - i.position.z;
			var r = XMath.V3(x,y,z);
			var d = r.mod();
			
			if( direction == "forward" ) {
				if(relative) {
					r.normalize();
					r.smul(amount);
					i.position.vadd( r );
					if(update_lookat) {
						i.lookAt.x = i.position.x + x;
						i.lookAt.y = i.position.y + y;
						i.lookAt.z = i.position.z + z;	
					} else {
						i.lookAt.vadd( r );
					}				
				} else {
					i.position.z += amount;
					if(update_lookat) {
						i.lookAt.set( i.position );
						i.lookAt.z += d;
					} else {
						i.lookAt.z += amount;	
					}
				}
			} else if( direction == "backward" ) {
				if(relative) {
					r.normalize();
					r.smul(-amount);
					i.position.vadd(r);
					if(update_lookat) {
						i.lookAt.x = i.position.x - x;
						i.lookAt.y = i.position.y - y;
						i.lookAt.z = i.position.z - z;
					} else {
						i.lookAt.vadd(r);
					}				
				} else {
					i.position.z -= amount;
					if(update_lookat) {
						i.lookAt.set( i.position );
						i.lookAt.z -= d;
					} else {
						i.lookAt.z -= amount;
					}
				}
			} else if( direction == "left") {
				if(relative) {
					var left = r.cross(i.up);
					left.normalize();
					left.smul(amount);
					i.position.vadd( left );
					if(update_lookat) {
						// rotate 90deg lookat centered on position
						var m = XMath.M4();
						m.rotate(Math.PI/2,i.up);
						r.vmul(m);
						r.normalize();
						r.smul( amount );
						i.lookAt.x = i.position.x + r.x;
						i.lookAt.y = i.position.y + r.y;
						i.lookAt.z = i.position.z + r.z;
					} else {
						i.lookAt.vsub( left );
					}
				} else {
					i.position.x -= amount;
					if(update_lookat) {
						i.lookAt.set(i.position);
						i.lookAt.x -= d;
					} else {
						i.lookAt.x -= amount;	
					}
				}
			} else if( direction == "right") {
				if(relative) {
					var left = r.cross(i.up);
					left.normalize();
					left.smul(-amount);
					i.position.vadd( left );
					if(update_lookat) {
						// rotate 90deg lookat centered on position
						var m = XMath.M4();
						m.rotate(Math.PI/2,i.up);
						r.vmul(m);
						r.normalize();
						r.smul( -amount );
						i.lookAt.x = i.position.x + r.x;
						i.lookAt.y = i.position.y + r.y;
						i.lookAt.z = i.position.z + r.z;
					} else {
						i.lookAt.vsub( left );
					}				
				} else {
					i.position.x += amount;
					if(update_lookat) {
						i.lookAt.set(i.position);
						i.lookAt.x += d;
					} else {
						i.lookAt.x += amount;	
					}
				}
			} else if( direction == "up") {
				if(relative) {
					var r = i.up.clone();
					r.normalize();
					r.smul(amount);
					i.position.vadd(r);
					if(update_lookat) {
						var j = r.clone();
						var m = XMath.M4();
						m.rotate(Math.PI/2,i.up);
						j.vmul(m);
						j.normalize();
						m.rotate(Math.PI/2,j);
						r.vmul(m);
						r.normalize();
						r.smul( amount );
						i.lookAt.x = i.position.x + r.x;
						i.lookAt.y = i.position.y + r.y;
						i.lookAt.z = i.position.z + r.z;
						
						i.up.vmul( m );
					} else {
						i.lookAt.vadd(r);
					}
				} else {
					i.position.y += amount;
					if(update_lookat) {
						i.lookAt.set(i.position);
						i.lookAt.y += 1;
						
						i.up.x = 0;
						i.up.y = 0;
						i.up.z = -1;
					} else {
						i.lookAt.y += amount;	
					}
				}
			} else if( direction == "down") {
				if(relative) {
					var t = i.up.clone();
					t.normalize();
					t.smul(-amount);
					i.position.vadd(t);
					if(update_lookat) {
						var j = r.clone();
						var m = XMath.M4();
						m.rotate(Math.PI/2,i.up);
						j.vmul(m);
						j.normalize();
						m.rotate(Math.PI/2,j);
						r.vmul(m);
						r.normalize();
						r.smul( -amount );
						i.lookAt.x = i.position.x + r.x;
						i.lookAt.y = i.position.y + r.y;
						i.lookAt.z = i.position.z + r.z;
						
						m.rotate(-Math.PI/2,j);
						i.up.vmul( m );
					} else {
						i.lookAt.vadd(t);
					}
				} else {
					i.position.y -= amount;
					
					if(update_lookat) {
						i.position.set(i.position);
						i.lookAt.y -= 1;
						
						i.up.x = 0;
						i.up.y = 0;
						y.up.z = 1;
						
					} else {
						i.lookAt.y -= amount;	
					}
				}
			}
			return this;
		},
		Rotate : function(angle,axis, relative) {
			if(relative) {
				var _axis = XMath.V3(axis[0],axis[1],axis[2]);
				_axis.normalize();
				
				var up = i.up.clone();
				var r = XMath.V3(0,0,0);
				i.lookAt.vsub( i.position, r );
				r.normalize();
				var front = r.clone();
				var m = XMath.M4();
				m.rotate(Math.PI/2,up);
				var left = XMath.V3(0,0,0);
				front.vmul( m, left );
				
				left.smul( _axis.x );
				front.smul( _axis.z );
				up.smul( _axis.y );
				
				//m.rotate(angle,up);
				
				//???
				
				// update i.up
				// i.lookAt
				
				throw "not implemented, must do some tests around.";
			} else {
				var i = this.internal["XMath.3Devils.Camera"].data;
				var m4 = XMath.M4();
				m4.rotate(angle,axis);
				var x = i.lookAt.x - i.position.x,
					y = i.lookAt.y - i.position.y,
					z = i.lookAt.z - i.position.z;
				var r = XMath.V3(x,y,z);
				r.vmul( m4 );
				i.lookAt.vset(r);
				
				// update i.up
				
				return this;
			}
		}
	}
});

