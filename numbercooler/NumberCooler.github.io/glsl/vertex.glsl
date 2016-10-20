
// remember to set var.attrib
uniform mat4 Matrix0;

uniform float CamRange;
uniform vec3 CamAt;
uniform vec3 CamPointer;
uniform vec3 CamRotation;
uniform vec3 ObjRotation;
uniform vec3 ObjTranslation;

attribute vec3 RawPt;
attribute vec3 NormalPt;
attribute vec4 SolidColor;

varying vec4 vColor;
varying vec4 vPos;

void main(void) {

	vec3 _CamRotation = vec3(NormalPt.x,0.0,0.0);
	float _CamAngle = dot(-normalize(CamPointer - CamAt),normalize( NormalPt ));
	if( _CamAngle > 0.0 ) {
	
		// make analisys with camera at (0,0,-1) looking to(-1,0,-1)
		// create visible cube red
		// make analisys with camera at (0,0,-1) looking to(1,0,-1)
		// crete visible cube yellow
		// make analisys with camera at (0,0,-1) looking to(0,0,-2)
		// create visible cube green
		// make analisys with camera at (0,0,-1) looking to(0,1,-1)
		// create visible cube pink
		// make analisys with camera at (0,0,-1) looking to(0,-1,-1)
		// create visible cube white
		// analisys with camera at (0,0,-1) looking to (0,0,0)
		// create visible cube blue
		// enable objects only if inside boxview
		//float depth = RawPt[2];
		
		
		//rotate object before translation to get object rotation
		float depth = RawPt[2]-CamPointer[2]+ObjTranslation[2];
		
		vPos = vec4(
			(RawPt[0]+ObjTranslation[0]-CamPointer[0])/(1.0+depth),
			(RawPt[1]+ObjTranslation[1]-CamPointer[1])/(1.0+depth),
			0.0,1.0
		);
		
		//clamp((RawPt[0]+ObjTranslation[0]-CamPointer[0])/(1.0+depth),-1.0,1.0),
		//clamp( (RawPt[1]+ObjTranslation[1]-CamPointer[1])/(1.0+depth),-1.0,1.0),
		
		gl_Position = Matrix0*vPos;
		vColor=SolidColor;
		
		//vColor=vec4(0,0,1.0,1.0);	
		
	} else {
		gl_Position = vec4(0.0,0.0,0.0,1.0);
		vColor=SolidColor;
	}
}
