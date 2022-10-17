varying vec2 V_UV;
uniform sampler2D U_TEXTURE_IMAGE;
uniform sampler2D U_TEXTURE_VIDEO;
uniform float U_IS_IMAGE;

void main(){
	gl_FragColor = vec4(mix(texture2D(U_TEXTURE_VIDEO, V_UV).rgb, texture2D(U_TEXTURE_IMAGE, V_UV).rgb, U_IS_IMAGE), 1.0);
}
