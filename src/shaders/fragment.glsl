uniform float uProgress;
uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;
void main() {
  vec4 image = texture(uTexture, vUv);
  gl_FragColor = vec4(uProgress,vUv, 1.0);
}