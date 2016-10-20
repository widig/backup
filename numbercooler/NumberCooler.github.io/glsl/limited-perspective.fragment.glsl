



precision highp float;

varying vec4 fragment_color;
varying vec4 fragment_point;
varying highp vec2 fragment_textureCoord;	

uniform int tex_options;
uniform sampler2D uSampler;

void main(void) {
	
	float distance = 1.0;//5.0*sqrt( fragment_point[0]*fragment_point[0]+fragment_point[1]*fragment_point[1]+fragment_point[2]*fragment_point[2] );
	// the it goes from center fragment_point[0]*fragment_point[0]+fragment_point[1]*fragment_point[1]+fragment_point[2]*fragment_point[2]
	int a = tex_options;
	if(a==0) {
		gl_FragColor = vec4(fragment_color[0]/distance,fragment_color[1]/distance,fragment_color[2]/distance,fragment_color[3]);
	} else if(a==1) {
		gl_FragColor = texture2D(uSampler, vec2(fragment_textureCoord[0], fragment_textureCoord[1]));
	}
	
}