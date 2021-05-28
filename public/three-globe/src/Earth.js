import { vertexShader, fragmentShader } from "../shader/globe.js";

export class Earth {
  constructor(props) {
    const { radius } = props;
    this.radius = radius;

    this.init();

    return this.children;
  }

  init() {
    const geometry = new THREE.SphereBufferGeometry(this.radius, 50, 50);

    const material = new THREE.MeshStandardMaterial({
      color: 0x171634,
      metalness: 0,
      roughness: 0.9,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.baseColor = {
        value: new THREE.Color(0x171634),
      };
      shader.uniforms.shadowDist = {
        value: 1.5 * this.radius,
      };
      shader.uniforms.highlightDist = {
        value: 5,
      };
      shader.uniforms.shadowPoint = {
        value: new THREE.Vector3(
          0.7 * this.radius,
          0.3 * -this.radius,
          this.radius
        ),
      };
      shader.uniforms.highlightPoint = {
        value: new THREE.Vector3(1.5 * -this.radius, 1.5 * -this.radius, 0),
      };
      shader.uniforms.frontPoint = {
        value: new THREE.Vector3(0, 0, this.radius),
      };
      shader.uniforms.highlightColor = {
        value: new THREE.Color(0x517966),
      };
      shader.uniforms.frontHighlightColor = {
        value: new THREE.Color(0x27367d),
      };
      // shader.vertexShader = vertexShader;
      // shader.fragmentShader = fragmentShader;
    };

    const globe = new THREE.Mesh(geometry, material);

    this.children = globe;
  }
}
