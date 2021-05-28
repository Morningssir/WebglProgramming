import { SphereVector3 } from "./Tool3d.js";

const DEG2RAD = Math.PI / 180;

export class Polygon {
  constructor(props) {
    const { radius, image } = props;
    this.radius = radius;
    this.imageData = this.getImageData(image);
    this.rows = 200;
    this.worldDotSize = 0.095;
    this.dotDensity = 2;
    this.init();

    return this.children;
  }

  init() {
    const light = new THREE.Light();
    let matrixs = [];
    for (let lat = -90; lat <= 90; lat += 180 / this.rows) {
      const radius = Math.cos(Math.abs(lat) * DEG2RAD) * this.radius;
      const circumference = 2 * radius * Math.PI;
      const dotsForLat = circumference * this.dotDensity;
      for (let x = 0; x < dotsForLat; x++) {
        const long = -180 + (x / dotsForLat) * 360;
        if (!this.visibilityForCoordinate(long, lat)) continue;
        const vec3 = new SphereVector3(long, lat, this.radius);
        light.position.set(vec3.x, vec3.y, vec3.z);
        light.lookAt(new SphereVector3(long, lat, this.radius + 5));
        light.updateMatrix();
        matrixs.push(light.matrix.clone());
      }
    }

    const geometry = new THREE.CircleBufferGeometry(this.worldDotSize, 5);
    const material = new THREE.MeshStandardMaterial({
      color: 3818644,
      metalness: 0,
      roughness: 0.9,
      side: THREE.DoubleSide,
      alphaTest: 0.02,
    });
    material.onBeforeCompile = function (shader) {
      shader.fragmentShader = shader.fragmentShader.replace(
        "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
        "gl_FragColor = vec4( outgoingLight, diffuseColor.a );\nif (gl_FragCoord.z > 0.51) {\ngl_FragColor.a = 1.0 + ( 0.51 - gl_FragCoord.z * 0.53 ) * 13.0;\n}\n      "
      );
    };
    const polygon = new THREE.InstancedMesh(geometry, material, matrixs.length);
    for (let i = 0; i < matrixs.length; i++) polygon.setMatrixAt(i, matrixs[i]);
    polygon.renderOrder = 3;
    this.children = polygon;
  }

  visibilityForCoordinate(long, lat) {
    const width = this.imageData.width;
    const height = this.imageData.height;
    const x = parseInt(((long + 180) / 360) * width + 0.5);
    const y = height - parseInt(((lat + 90) / 180) * height - 0.5);
    const index = parseInt(4 * width * (y - 1) + 4 * x) + 3;
    return this.imageData.data[index] > 90;
  }

  getImageData(image) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = image.width;
    ctx.canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    return ctx.getImageData(0, 0, image.width, image.height);
  }
}
