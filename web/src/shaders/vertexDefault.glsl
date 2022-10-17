// equirectangular 
// cubemap
varying vec2 V_UV;

void main(){
	V_UV = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
}
