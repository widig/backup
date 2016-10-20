/*
	TODO:
	
		// make analisys with camera at (0,0,-1) looking to(-1,0,-1)
		// create visible cube red
		// make analisys with camera at (0,0,-1) looking to(1,0,-1)
		// crete visible cube yellow
		// make analisys with camera at (0,0,-1) looking to(0,0,-2)
		// create visible cube green
		// make analisys with camera at (0,0,-1) looking to(0,1,-1)
		// create visible cube pink
		// make analisys with camera at (0,0,-1) looking to(0,-1,-1)
		// create visible cube white\
		// analisys with camera at (0,0,-1) looking to (0,0,0)
		// create visible cube blue
		
		// enable objects only if inside boxview
*/



uniform mat4 	Matrix0;

uniform vec3 	ObjScale;
uniform mat4 	ObjRotation;
uniform vec3 	ObjTranslation;


uniform vec3 	CamScale;
uniform mat4 	CamRotationM4; // must pass mat4
uniform vec3 	CamRotationV3;
uniform vec3 	CamAt;
uniform vec3 	CamPointer;


// sent last point and next point of triangle

attribute vec3 	n_pt; // normal of the face at point
attribute vec3 	pt;
varying vec4 	vPos;

attribute vec4 	color;
varying vec4 	vColor;

attribute vec2 	tex_pt;
varying vec2 	vTextureCoord;



void main(void) {
	vColor = color;
	vTextureCoord = tex_pt;
	
	float pi = 3.14159265358979323;
	
	// geometry
	
	vec4 n_pt2 = vec4(
		n_pt[0],
		n_pt[1],
		n_pt[2],
		1.0
	);
	n_pt2 = ObjRotation * n_pt2;
	vec3 n_pt3 = vec3( n_pt2[0],n_pt2[1],n_pt2[2] );
	
	float _CamAngle = dot(normalize(CamAt-CamPointer),normalize( CamPointer - n_pt3 ));
	
	// must calculate field of view to cut out
	
	int a = 0;
	//if( _CamAngle <= cos(pi/2.0-pi/180.0)  ) {
		
		
		
	// object scale
	vec4 fpt = vec4( 
		pt[0] * ObjScale[0], 
		pt[1] * ObjScale[1], 
		pt[2] * ObjScale[2], 
		1.0 
	);
	
	// object rotation
	fpt = ObjRotation * fpt;
	
	
	// object translation
	fpt[0] = fpt[0] + ObjTranslation[0];
	fpt[1] = fpt[1] + ObjTranslation[1];
	fpt[2] = fpt[2] + ObjTranslation[2];
	
	
	
	
	vec3 fpt0 = vec3(fpt[0],fpt[1],fpt[2]);
	
	
	
	// camera scaling
	
	fpt[0] = fpt[0] * CamScale[0];
	fpt[1] = fpt[1] * CamScale[1];
	fpt[2] = fpt[2] * CamScale[2];
	
	
	vec3 fpt1 = vec3(fpt[0],fpt[1],fpt[2]);
	
	
	// camera translation
	fpt[0] = fpt[0] - CamPointer[0];
	fpt[1] = fpt[1] - CamPointer[1];
	fpt[2] = fpt[2] - CamPointer[2];
	
	
	vec3 fpt2 = vec3(fpt[0],fpt[1],fpt[2]);
	
	// fpt2 after camera translation
	
	
	// camera rotation
	fpt = CamRotationM4*fpt;
	
	// fpt after camera rotation
	
	float threshould = cos(pi/2.0-89.0*pi/180.0);
	float depth = 1.0 + fpt[2];
	if(_CamAngle <= threshould) {
		if( fpt[2] >= 0.0 ) { // default case
			gl_Position = vec4( fpt[0]/depth, fpt[1]/depth, 0.0,1.0 );
		} else if( fpt[2] < 0.0 ) { // culling and shape projection
			float depth = 1.0 + fpt[2];
			if( fpt2[2] < 0.0) { // partial shape case, behind camera
				// maybe oblique goes here
				// this makes -90deg , +90deg camera good
				
				if(fpt2[0] < 0.0) {
					gl_Position = vec4(fpt2[0],fpt2[1],-1.0,0.0); 
				} else {
					gl_Position = vec4(fpt2[0],fpt2[1],-1.0,0.0); 
				}
				
				// usa projecao da camera
			} else if( fpt2[2] > 0.0) { // fpt2 rotaciona com a camera? -> partial shape case in front of camera
				// this makes 180 deg good
				gl_Position = vec4(fpt[0],fpt[1],0.0,1.0); // in
			}
		}
	} else {
		gl_Position = vec4(fpt2[0],fpt2[1],0.0,0.0);
	}
	
}