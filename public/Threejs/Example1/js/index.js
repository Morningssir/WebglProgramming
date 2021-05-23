const {
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  Scene,
  OrthographicCamera,
  WebGLRenderer,
} = THREE;

let currentTime = Date.now();

window.onload = function () {
  const scene = new Scene();

  const geometry = new SphereGeometry(60, 40, 40);
  const material = new MeshPhongMaterial({
    color: 0x0000ff,
    specular: 0x4488ee,
    shininess: 12,
  });
  const mesh = new Mesh(geometry, material);
  mesh.position.z = -8;
  scene.add(mesh);

  var point = new THREE.PointLight(0xffffff);
  point.position.set(400, 200, 300);
  scene.add(point);
  var point2 = new THREE.PointLight(0xffffff);
  point2.position.set(-400, -200, -300);
  scene.add(point2);
  var ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);

  const width = window.innerWidth;
  const height = window.innerHeight;
  const k = width / height;
  const s = 200;
  const camera = new OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
  camera.position.set(200, 100, 200);
  camera.lookAt(scene.position);

  var axisHelper = new THREE.AxisHelper(250);
  scene.add(axisHelper);

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
  document.body.appendChild(renderer.domElement);

  function render() {
    const now = Date.now();
    const delta = now - currentTime;
    currentTime = now;
    mesh.rotateY(0.001 * delta);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();
  const controls = new THREE.Orbit();
};
