import { MouseEvent } from "../utils/MouseEvent.js";
import { Atmosphere } from "./Atmosphere.js";
import { Earth } from "./Earth.js";
import { Polygon } from "./Polygon.js";
import { Beam } from "./Beam.js";

export class Stage {
  constructor(props) {
    const { image } = props;
    this.autoUpdate = this.autoUpdate.bind(this);
    this.clock = new THREE.Clock();
    this.image = image;
    this.radius = 25;
    this.init();
    this.initScene();
    this.controls = new MouseEvent({
      domElement: this.renderer.domElement,
      object: this.container,
      objectContainer: this.rootContainer,
      rotateSpeed: 3,
      autoRotateSpeed: 0.1,
      maxRotationX: 0.5,
      easing: 0.1,
    });
  }

  init() {
    this.root = document.getElementById("globeViz");
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      alpha: true,
      preserveDrawingBuffer: false,
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x040d21, 1);
    this.root.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    this.camera = new THREE.PerspectiveCamera(20, width / height, 1, 1000);
    this.camera.position.set(0, 0, 220);
    this.scene.add(this.camera);

    this.rootContainer = new THREE.Group();
    const angle = new THREE.Euler(0.3, 4.6, 0.05);
    let rotation = angle;
    const timeZone = new Date().getTimezoneOffset() || 0;
    rotation.y = angle.y + Math.PI * (timeZone / 720);
    this.rootContainer.rotation.copy(rotation);
    this.scene.add(this.rootContainer);

    this.atmosphereContainer = new THREE.Group();
    this.scene.add(this.atmosphereContainer);

    this.container = new THREE.Group();
    this.rootContainer.add(this.container);

    this.autoResize();
    this.autoUpdate();
  }

  initScene() {
    this.directionalLight = new THREE.DirectionalLight(0xa9bfff, 3);
    this.farLight = new THREE.SpotLight(0x2188ff, 12, 120, 0.3, 0, 1.1);
    this.nearLight = new THREE.SpotLight(0xf46bbe, 5, 75, 0.5, 0, 1.25);
    this.directionalLight.target = this.rootContainer;
    this.farLight.target = this.rootContainer;
    this.nearLight.target = this.rootContainer;
    this.scene.add(this.directionalLight, this.farLight, this.nearLight);

    const earth = new Earth({ radius: this.radius });
    this.container.add(earth);

    const atmosphere = new Atmosphere({ radius: this.radius });
    atmosphere.scale.multiplyScalar(1.15);
    atmosphere.rotateX(0.03 * Math.PI);
    atmosphere.rotateY(0.03 * Math.PI);
    atmosphere.renderOrder = 3;
    this.atmosphereContainer.add(atmosphere);

    this.initPolygon();
    this.initObjects();
  }

  initPolygon() {
    const polygon = new Polygon({
      radius: this.radius,
      image: this.image,
    });
    this.container.add(polygon);
  }

  initObjects() {
    const dataSource = Mock.mock({
      "list|50": [
        {
          id: /\d{10}/,
          name: "@city",
          "longitude|-180-180.2": 1,
          "latitude|-90-90.2": 1,
        },
      ],
    });
    const Beams = new Beam({
      camera: this.camera,
      maxSize: dataSource.list.length,
      dataSource: dataSource.list,
      radius: this.radius,
      colors: { lineColor: 2197759, particleColor: 6137337 },
    });
    this.container.add(Beams);
  }

  autoResize() {
    const t = (850 / window.innerHeight) * 1;
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.autoPosition(t);
      this.autoLight(t);
    }, 150);
  }

  autoPosition(t) {
    this.rootContainer.scale.set(t, t, t);
    this.rootContainer.position.set(0, 0, 0);
    this.atmosphereContainer.scale.set(t, t, t);
    this.atmosphereContainer.position.set(0, 0, -13);
  }

  autoLight(t) {
    const globeX = this.rootContainer.position.x;
    const globeY = this.rootContainer.position.y;

    this.directionalLight.position
      .set(globeX - 50, globeY + 30, 10)
      .multiplyScalar(t);

    this.farLight.position
      .set(globeX - 2.5 * this.radius, 80, -40)
      .multiplyScalar(t);
    this.farLight.distance = 120 * t;

    this.nearLight.position
      .set(globeX + this.radius, this.radius, 2 * this.radius)
      .multiplyScalar(t);
    this.nearLight.distance = 75 * t;
  }

  autoUpdate() {
    const delta = this.clock.getDelta();

    if (this.controls && this.controls.update(delta)) {
      return this.render();
    }
    this.render();
    requestAnimationFrame(this.autoUpdate);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
