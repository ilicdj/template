varying vec2 vUv;
uniform float progress;
void main() {
  gl_FragColor = vec4(1.0, vUv, 1.0);
}