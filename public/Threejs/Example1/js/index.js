const { SphereGeometry, Mesh, Scene, OrthographicCamera, WebGLRenderer } =
  THREE;

let currentTime = Date.now();

window.onload = function () {
  const scene = new Scene();

  // 几何体
  const geometry = new THREE.BoxGeometry(40, 100, 40);

  // 材料
  const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });

  // 网格
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.castShadow = true;

  // 投影面
  const planeGeometry = new THREE.PlaneGeometry(600, 400);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(planeMesh);
  planeMesh.receiveShadow = true;
  planeMesh.position.y = -50;
  planeMesh.rotateX(-Math.PI / 2);

  // 光源对象
  const ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);

  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // directionalLight.position.set(60, 100, 40);
  // scene.add(directionalLight);
  // directionalLight.castShadow = true;
  // directionalLight.shadow.camera.near = 0.5;
  // directionalLight.shadow.camera.far = 300;
  // directionalLight.shadow.camera.left = -50;
  // directionalLight.shadow.camera.right = 50;
  // directionalLight.shadow.camera.top = 200;
  // directionalLight.shadow.camera.bottom = -100;

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(50, 90, 50);
  spotLight.angle = Math.PI / 6;
  scene.add(spotLight);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 1000;
  spotLight.shadow.camera.fov = 20;

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
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  function render() {
    const now = Date.now();
    const delta = now - currentTime;
    currentTime = now;
    mesh.rotateY(0.001 * delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();
};
