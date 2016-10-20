
precision highp float;

varying vec4 vColor;
varying vec4 vPos;
varying highp vec2 vTextureCoord;	

uniform int tex_options;
uniform sampler2D uSampler;

void main(void) {
	
	float distance = 1.0;//5.0*sqrt( vPos[0]*vPos[0]+vPos[1]*vPos[1]+vPos[2]*vPos[2] );
	// the it goes from center vPos[0]*vPos[0]+vPos[1]*vPos[1]+vPos[2]*vPos[2]
	int a = tex_options;
	
	if(a==0) {
		gl_FragColor = vec4(vColor[0]/distance,vColor[1]/distance,vColor[2]/distance,vColor[3]);
	} else if(a==1) {
		gl_FragColor = texture2D(uSampler, vec2(vTextureCoord[0], vTextureCoord[1]));
	}
	
	
}