uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uTime;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main(){
    float mixedStrengthColor=(vElevation+uColorOffset)*uColorMultiplier;
    vec3 color=mix(uDepthColor,uSurfaceColor,mixedStrengthColor);
    gl_FragColor=vec4(color,1.);
    
}