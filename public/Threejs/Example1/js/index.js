const { SphereGeometry, Mesh, Scene, OrthographicCamera, WebGLRenderer } =
  THREE;

let currentTime = Date.now();

window.onload = function () {
  const scene = new Scene();

  // 几何体
  const geometry = new THREE.BufferGeometry();

  const vertices = new Float32Array([
    0, 0, 0, 40, 0, 0, 0, 40, 0, 0, 0, 0, 40, 0, 0, 0, 0, 40,
  ]);
  geometry.attributes.position = new THREE.BufferAttribute(vertices, 3);

  const colors = new Float32Array([
    1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1,
  ]);
  geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

  const normals = new Float32Array([
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  ]);
  geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

  // 材料
  // const material = new THREE.MeshPhongMaterial({
  //   color: 0x0000ff,
  //   side: THREE.DoubleSide,
  // });
  const material = new THREE.PointsMaterial({ color: 0x0000ff, size: 10 });

  // 网格
  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);

  // 光源对象
  var point = new THREE.PointLight(0xffffff);
  point.position.set(400, 200, 300);
  scene.add(point);
  var point2 = new THREE.PointLight(0xffffff);
  point2.position.set(-400, -200, -300);
  scene.add(point2);
  var ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);

  // 相机对象
  const width = window.innerWidth;
  const height = window.innerHeight;
  const k = width / height;
  const s = 200;
  const camera = new OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
  camera.position.set(200, 100, 200);
  camera.lookAt(scene.position);

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0xb9d3ff, 1);
  document.body.appendChild(renderer.domElement);

  function render() {
    // const now = Date.now();
    // const delta = now - currentTime;
    // currentTime = now;
    // mesh.rotateY(0.001 * delta);
    // requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();
};
