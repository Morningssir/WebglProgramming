import { SphereVector3 } from "./Tool3d.js";
import {
  lineVertexShader,
  lineFragmentShader,
  particleVertexShader,
  particleFragmentShader,
} from "../shader/beam.js";

export class Beam {
  constructor(props) {
    this.props = props;
    this.group = new THREE.Group();
    this.init();
    return this.group;
  }

  init() {
    const {
      camera,
      maxSize = 100,
      radius = 25,
      dataSource,
      colors: { lineColor = 2197759, particleColor = 6137337 },
    } = this.props;

    const positions = [],
      colors = [],
      indexes = [];

    const helper = new THREE.Object3D();

    const cylinderGeometry = new THREE.CylinderBufferGeometry(
      0.06,
      0.06,
      1,
      6,
      1,
      false
    );
    cylinderGeometry.translate(0, 0.5, 0).rotateX(-Math.PI / 2);
    const cylinderMaterial = new THREE.MeshBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: 0.4,
      blending: 2,
    });
    // cylinderMaterial.onBeforeCompile = (shader) => {
    //   shader.uniforms.cameraPosition = {
    //     value: camera.position,
    //   };
    //   shader.uniforms.radius = {
    //     value: radius,
    //   };
    //   shader.uniforms.visibleIndex = {
    //     value: 60,
    //   };
    //   shader.uniforms.maxIndexDistance = {
    //     value: 60,
    //   };
    //   shader.uniforms.highlightIndex = {
    //     value: -9999,
    //   };
    //   shader.vertexShader = lineVertexShader;
    //   shader.fragmentShader = lineFragmentShader;
    // };
    const cylinderMesh = new THREE.InstancedMesh(
      cylinderGeometry,
      cylinderMaterial,
      maxSize
    );
    this.group.add(cylinderMesh);

    const pointGeometry = new THREE.BufferGeometry();
    const pointMaterial = new THREE.PointsMaterial({ size: 0.8 });
    const pointMesh = new THREE.Points(pointGeometry, pointMaterial);
    this.group.add(pointMesh);

    for (let i = 0; i < maxSize; i++) {
      const { longitude, latitude } = dataSource[i];

      SphereVector3(longitude, latitude, radius, helper.position);
      helper.lookAt(new THREE.Vector3());
      helper.updateMatrix();
      cylinderMesh.setMatrixAt(i, helper.matrix);

      SphereVector3(longitude, latitude, radius + 1 + 0.25, helper.position);
      positions.push(helper.position.x, helper.position.y, helper.position.z);
      colors.push(particleColor.r, particleColor.g, particleColor.b);
      indexes.push(i);
    }

    pointGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    pointGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    pointGeometry.setAttribute(
      "index",
      new THREE.Float32BufferAttribute(indexes, 1)
    );

    cylinderGeometry.setAttribute(
      "index",
      new THREE.InstancedBufferAttribute(new Float32Array(indexes), 1)
    );
  }
}
