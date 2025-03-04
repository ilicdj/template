uniform float uProgress;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec4 uResolution;
varying vec2 vUv;
void main() {
  // Adjust UV based on resolution - OrthographicCamera
  // vec2 newUV = (vUv - vec2(0.5)) * uResolution.zw + vec2(0.5);

  // vec4 image = texture(uTexture, vUv);
  gl_FragColor = vec4(uProgress,vUv, 1.0);
}