const width = 800,
  height = 600;
const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
  alpha: true,
  preserveDrawingBuffer: !1,
});
renderer.setPixelRatio(1);
renderer.setSize(width, height);
renderer.setClearColor(265505, 1);
document.getElementById("globeViz").appendChild(renderer.domElement);

const radius = 25;

const scene = new THREE.Scene();

const parentContainer = new THREE.Group();
parentContainer.name = "parentContainer";
const hl = new THREE.Euler(0.3, 4.6, 0.05);
let r = hl;
const s = new Date().getTimezoneOffset() || 0;
r.y = hl.y + Math.PI * (s / 720);
console.log(r);
parentContainer.rotation.copy(r);
scene.add(parentContainer);

const geometry = new THREE.SphereBufferGeometry(radius, 50, 50);

const material = new THREE.MeshStandardMaterial({
  color: 1513012,
  metalness: 0,
  roughness: 0.9,
});

material.onBeforeCompile = (t) => {
  t.uniforms.shadowDist = {
    value: 1.5 * radius,
  };
  t.uniforms.highlightDist = {
    value: 5,
  };
  t.uniforms.shadowPoint = {
    value: new THREE.Vector3(0.7 * radius, 0.3 * -radius, radius),
  };
  t.uniforms.highlightPoint = {
    value: new THREE.Vector3(1.5 * -radius, 1.5 * -radius, 0),
  };
  t.uniforms.frontPoint = {
    value: new THREE.Vector3(0, 0, radius),
  };
  t.uniforms.highlightColor = {
    value: new THREE.Color(5339494),
  };
  t.uniforms.frontHighlightColor = {
    value: new THREE.Color(2569853),
  };
  t.vertexShader = `
  #define GLSLIFY 1
  #define STANDARD
  varying vec3 vViewPosition;
  #ifndef FLAT_SHADED
      varying vec3 vNormal;
      #ifdef USE_TANGENT
          varying vec3 vTangent;
          varying vec3 vBitangent;
      #endif
  #endif
  #include <common>
  #include <uv_pars_vertex>
  #include <uv2_pars_vertex>
  #include <displacementmap_pars_vertex>
  #include <color_pars_vertex>
  #include <fog_pars_vertex>
  #include <morphtarget_pars_vertex>
  #include <skinning_pars_vertex>
  #include <shadowmap_pars_vertex>
  #include <logdepthbuf_pars_vertex>
  #include <clipping_planes_pars_vertex>
  varying vec3 vWorldPosition;
  void main() {
      #include <uv_vertex>
      #include <uv2_vertex>
      #include <color_vertex>
      #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
  #ifndef FLAT_SHADED
      vNormal = normalize( transformedNormal );
      #ifdef USE_TANGENT
          vTangent = normalize( transformedTangent );
          vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
      #endif
  #endif
      #include <begin_vertex>
      #include <morphtarget_vertex>
      #include <skinning_vertex>
      #include <displacementmap_vertex>
      #include <project_vertex>
      #include <logdepthbuf_vertex>
      #include <clipping_planes_vertex>
      vViewPosition = - mvPosition.xyz;
      // # include <worldpos_vertex>
      vec4 worldPosition = vec4( transformed, 1.0 );
      #ifdef USE_INSTANCING
          worldPosition = instanceMatrix * worldPosition;
      #endif
      worldPosition = modelMatrix * worldPosition;
      vWorldPosition = worldPosition.xyz;
      #include <shadowmap_vertex>
      #include <fog_vertex>
  }`;
  t.fragmentShader = `
  #define GLSLIFY 1
  #define STANDARD
  #ifdef PHYSICAL
      #define REFLECTIVITY
      #define CLEARCOAT
      #define TRANSPARENCY
  #endif
  uniform vec3 diffuse;
  uniform vec3 emissive;
  uniform float roughness;
  uniform float metalness;
  uniform float opacity;
  #ifdef TRANSPARENCY
      uniform float transparency;
  #endif
  #ifdef REFLECTIVITY
      uniform float reflectivity;
  #endif
  #ifdef CLEARCOAT
      uniform float clearcoat;
      uniform float clearcoatRoughness;
  #endif
  #ifdef USE_SHEEN
      uniform vec3 sheen;
  #endif
  varying vec3 vViewPosition;
  #ifndef FLAT_SHADED
      varying vec3 vNormal;
      #ifdef USE_TANGENT
          varying vec3 vTangent;
          varying vec3 vBitangent;
      #endif
  #endif
  #include <common>
  #include <packing>
  #include <dithering_pars_fragment>
  #include <color_pars_fragment>
  #include <uv_pars_fragment>
  #include <uv2_pars_fragment>
  #include <map_pars_fragment>
  #include <alphamap_pars_fragment>
  #include <aomap_pars_fragment>
  #include <lightmap_pars_fragment>
  #include <emissivemap_pars_fragment>
  #include <bsdfs>
  #include <cube_uv_reflection_fragment>
  #include <envmap_common_pars_fragment>
  #include <envmap_physical_pars_fragment>
  #include <fog_pars_fragment>
  #include <lights_pars_begin>
  #include <lights_physical_pars_fragment>
  #include <shadowmap_pars_fragment>
  #include <bumpmap_pars_fragment>
  #include <normalmap_pars_fragment>
  #include <clearcoat_pars_fragment>
  #include <roughnessmap_pars_fragment>
  #include <metalnessmap_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  #include <clipping_planes_pars_fragment>
  uniform float shadowDist;
  uniform float highlightDist;
  uniform vec3 shadowPoint;
  uniform vec3 highlightPoint;
  uniform vec3 frontPoint;
  uniform vec3 highlightColor;
  uniform vec3 frontHighlightColor;
  varying vec3 vWorldPosition;
  void main() {
      #include <clipping_planes_fragment>
      vec4 diffuseColor = vec4( diffuse, opacity );
      ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
      vec3 totalEmissiveRadiance = emissive;
      #include <logdepthbuf_fragment>
      #ifdef USE_MAP
          vec4 texelColor = texture2D( map, vUv );
          texelColor = mapTexelToLinear( texelColor );
          #ifndef IS_FILL
              diffuseColor *= texelColor;
          #endif
      #endif
      #include <color_fragment>
      #include <alphamap_fragment>
      #include <alphatest_fragment>
      #include <roughnessmap_fragment>
      #include <metalnessmap_fragment>
      #include <normal_fragment_begin>
      #include <normal_fragment_maps>
      #include <clearcoat_normal_fragment_begin>
      #include <clearcoat_normal_fragment_maps>
      #include <emissivemap_fragment>
      #include <lights_physical_fragment>
      #include <lights_fragment_begin>
      #include <lights_fragment_maps>
      #include <lights_fragment_end>
      #include <aomap_fragment>
      vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
      #ifdef TRANSPARENCY
          diffuseColor.a *= saturate( 1. - transparency + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) );
      #endif
      float dist;
      float distZ;
      // highlights
      #ifdef USE_HIGHLIGHT
          dist = distance(vWorldPosition, highlightPoint);
          distZ = distance(vWorldPosition.z, 0.0);
          outgoingLight = mix(highlightColor, outgoingLight, smoothstep(0.0, highlightDist, dist) * smoothstep(0.0, 3.0, pow(distZ, 0.5)));
          outgoingLight = mix(outgoingLight * 2.0, outgoingLight, smoothstep(0.0, 12.0, distZ));
      #endif
      // front hightlight
      #ifdef USE_FRONT_HIGHLIGHT
          dist = distance(vWorldPosition * vec3(0.875, 0.5, 1.0), frontPoint);
          outgoingLight = mix(frontHighlightColor * 1.6, outgoingLight, smoothstep(0.0, 15.0, dist));
      #endif
      // shadows
      dist = distance(vWorldPosition, shadowPoint);
      outgoingLight = mix(outgoingLight * 0.01, outgoingLight, smoothstep(0.0, shadowDist, dist));
      // shadow debug
      // outgoingLight = mix(vec3(1.0, 0.0, 0.0), outgoingLight, smoothstep(0.0, shadowDist, dist));
      #ifdef IS_FILL
          outgoingLight = mix(outgoingLight, outgoingLight * 0.5, 1.0 - texelColor.g * 1.5);
      #endif
      gl_FragColor = vec4( outgoingLight, diffuseColor.a );
      #include <tonemapping_fragment>
      #include <encodings_fragment>
      #include <fog_fragment>
      #include <premultiplied_alpha_fragment>
      #include <dithering_fragment>
  }`;
  // material.defines = {
  //   USE_HIGHLIGHT: 1,
  //   USE_HIGHLIGHT_ALT: 1,
  //   USE_FRONT_HIGHLIGHT: 1,
  //   DITHERING: 1,
  // };
};

const globe = new THREE.Mesh(geometry, material);
// globe.renderOrder = 1;
// const globe = new ThreeGlobe()
//   .globeImageUrl("images/earth-night.jpg")
//   .bumpImageUrl("images/earth-topology.jpg")
//   .showAtmosphere(true);
parentContainer.add(globe);

const i = new THREE.AmbientLight(16777215, 0.8);
scene.add(i);
const light0 = new THREE.SpotLight(2197759, 12, 120, 0.3, 0, 1.1);
const light1 = new THREE.DirectionalLight(11124735, 3);
const light3 = new THREE.SpotLight(16018366, 5, 75, 0.5, 0, 1.25);
light0.target = parentContainer;
light1.target = parentContainer;
light3.target = parentContainer;
scene.add(light0, light1, light3);

// scene.add(new THREE.AmbientLight(0xbbbbbb));
// scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

const camera = new THREE.PerspectiveCamera(20, width / height, 170, 2000);
camera.position.set(0, 0, 220);
scene.add(camera);

renderer.render(scene, camera);

// const tbControls = new THREE.TrackballControls(camera, renderer.domElement);
// tbControls.minDistance = 101;
// tbControls.rotateSpeed = 5;
// tbControls.zoomSpeed = 0.8;

// (function animate() {
//   tbControls.update();
//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// })();
