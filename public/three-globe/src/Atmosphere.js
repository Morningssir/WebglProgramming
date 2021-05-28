import { vertexShader, fragmentShader } from "../shader/atmosphere.js";

export class Atmosphere {
  constructor(props) {
    const { radius } = props;
    this.radius = radius;

    this.init();

    return this.children;
  }

  init() {
    const geometry = new THREE.SphereBufferGeometry(this.radius, 50, 50);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        c: {
          type: "f",
          value: 0.7,
        },
        p: {
          type: "f",
          value: 15,
        },
        glowColor: {
          type: "c",
          value: new THREE.Color(0x1c2462),
        },
        viewVector: {
          type: "v3",
          value: new THREE.Vector3(0, 0, 220),
        },
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      blending: 2,
      transparent: true,
    });

    const atmosphere = new THREE.Mesh(geometry, material);

    this.children = atmosphere;
  }
}
