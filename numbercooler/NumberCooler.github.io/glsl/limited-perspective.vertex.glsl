
attribute 	vec4 	point;
varying 	vec4 	fragment_point;

attribute 	vec4 	color;
varying 	vec4 	fragment_color;

attribute 	vec2 	textureCoord;
varying 	vec2 	fragment_textureCoord;



uniform 	vec3 	ObjScale;
uniform 	mat4 	ObjRotation;		// mounted by look at
uniform 	vec3 	ObjTranslation;		// mounted by look at



// zaxis = normal(At - Eye)
// xaxis = normal(cross(Up, zaxis))
// yaxis = cross(zaxis, xaxis)



uniform 	vec2 	CamBoundsW; // L R
uniform 	vec2 	CamBoundsH; // B T
uniform 	vec2 	CamBoundsD; // N F

uniform 	vec3	CamScale;
uniform 	vec3 	CamPosition;
uniform 	mat4 	CamRotation;
uniform		vec3    CamTarget;
uniform		vec3	CamUp;



void main(void) {

	fragment_color = color;
	fragment_textureCoord = textureCoord;
	fragment_point = point;


	vec4 p = vec4(point[0],point[1],point[2],1.0);
	
	// object scale
	p[0] = ObjScale[0] * p[0];
	p[1] = ObjScale[1] * p[1];
	p[2] = ObjScale[2] * p[2];
	
	// object rotation
	
	p = ObjRotation * p;
	
	// object translation
	
	p = p + ObjTranslation;
	
	
	/*
	
	// camera setup raw
	
	this is equivalent to lookAt, but with another control
	
	// camera translation
	
	p = p - CamTranslation;
	
	// camera rotation
	
	p = CamRotation * p;
	
	// camera scale
	
	p = vec4( CamScale[0] * p[0], CamScale[1] * p[1], CamScale[2] * p[2], 1.0);
	*/
	
	
	
	// camera setup lookat
	
	vec3 zAxis = normalize( CamTarget - CamPosition );
	vec3 xAxis = normalize( cross(CamUp, zAxis) );
	vec3 yAxis = normalize( cross(zAxis, xAxis) );
	mat4 lookAt = mat4(
		xAxis[0], xAxis[1], xAxis[2], 0.0,
		yAxis[0], yAxis[1], yAxis[2], 0.0,
		zAxis[0], zAxis[1], zAxis[2], 0.0,
		CamPosition[0], CamPosition[1], CamPosition[2], 1.0
	);
	
	
	mat4 lookAtI = inverse(lookAt);
	p = lookAtI * p;
	
	
	
	/*
	// camera projection ortho
	
	mat4 ortho = mat4(
		2.0 / ( CamBoundsW[1] + CamBoundsW[0] ), 0.0, 0.0, 0.0,
		0.0, 0.0, 2.0 / ( CamBoundsH[1] -  CamBoundsH[0] ), 0.0,
		0.0, 0.0, -2.0, 0.0,
		( CamBoundsW[1] + CamBoundsW[0] ) / ( CamBoundsW[0] - CamBoundsW[1] ),
		( CamBoundsH[1] + CamBoundsH[0] ) / ( CamBoundsH[1] - CamBoundsW[0] ),
		( CamBoundsD[0] + CamBoundsD[1] ) / ( CamBoundsD[1] - CamBoundsD[0] ), 
		1.0
	);
	p = ortho * p;
	*/
	
	
	// camera projection limited-perspective
	
	mat4 perspective = mat4(
		2.0 * CamBoundsD[0] / ( CamBoundsW[1] - CamBoundsW[0] ),0.0,0.0,0.0,
		0.0, 2* CamBoundsD[0] / ( CamBoundsH[1] - CamBoundsH[0] ), 0.0, 0.0,
		( CamBoundsW[1] + CamBoundsW[0] ) / ( CamBoundsW[1] - CamBoundsW[0] ), ( CamBoundsH[1] + CamBoundsH[0] ) / ( CamBoundsH[1] - CamBoundsH[0] ), - ( CamBoundsD[1] + CamBoundsD[0] ) / ( CamBoundsD[1] - CamBoundsD[0] ), -1.0,
		0.0,0.0, -(2.0 * CamBoundsD[1] * CamBoundsD[0] ) / ( CamBoundsD[1] - CamBoundsD[0] ), 0.0
	);

	p = perspective * p;
	
	
	
	gl_Position = p;
	

}