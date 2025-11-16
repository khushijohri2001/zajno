varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uHover;

void main(){
    float block = 25.0;
    vec2 blockUv = floor(vUv * block)/block;
    float distance = length(blockUv - uMouse);
    float effect = smoothstep(0.2, 0.0, distance);
    vec2 distortion = vec2(0.05) * effect;


    vec4 color = texture2D(uTexture, vUv + distortion * uHover);
    gl_FragColor = color;
}