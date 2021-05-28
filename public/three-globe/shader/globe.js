export const vertexShader = `
uniform float shadowDist;
uniform float highlightDist;
uniform vec3 shadowPoint;
uniform vec3 highlightPoint;
uniform vec3 frontPoint;
uniform vec3 highlightColor;
uniform vec3 frontHighlightColor;
varying vec3 vWorldPosition;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
}
`;

export const fragmentShader = `
uniform vec3 baseColor;
uniform float shadowDist;
uniform float highlightDist;
uniform vec3 shadowPoint;
uniform vec3 highlightPoint;
uniform vec3 frontPoint;
uniform vec3 highlightColor;
uniform vec3 frontHighlightColor;
varying vec3 vWorldPosition;

void main() {
  float dist;
  float distZ;
  vec3 outgoingLight = baseColor;

  // highlights,四周高光
  #ifdef USE_HIGHLIGHT
    distZ = distance(vWorldPosition.z, 0.0);
    outgoingLight = mix(
      highlightColor,
      outgoingLight,
      smoothstep(0.0, highlightDist, pow(distZ, 0.5))
    );
  #endif

  // front hightlight 前置光源
  #ifdef USE_FRONT_HIGHLIGHT
    dist = distance(vWorldPosition * vec3(.875, 0.5, 1.), frontPoint);
    outgoingLight = mix(frontHighlightColor * 1.6, outgoingLight, smoothstep(0.0, 15.0, dist));
  #endif

  // shadows
  dist = distance(vWorldPosition, shadowPoint);
  outgoingLight = mix(outgoingLight * 0.01, outgoingLight, smoothstep(0.0, shadowDist, dist));

  gl_FragColor = vec4( outgoingLight, 1. );
}
`;
