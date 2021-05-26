window.onload = function () {
  const scene = new THREE.Scene();

  // let mesh;

  // 几何体
  var geometry = new THREE.PlaneGeometry(204, 102, 4, 4);

  const textureLoader = new THREE.TextureLoader();

  textureLoader.load("./images/Earth.jpg", function (texture) {
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    const uvs = new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]);

    console.log(geometry.attributes.uv);
    console.log(new THREE.BufferAttribute(uvs, 2));
    geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2);

    render();
  });

  // 光源对象
  const ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
  const directionalLight = new THREE.DirectionalLight(0xfffffff);
  directionalLight.position.set(-1, 0, 0);
  // directionalLight.target = mesh;
  scene.add(directionalLight);
  // spotLight.castShadow = true;
  // spotLight.shadow.camera.near = 1;
  // spotLight.shadow.camera.far = 1000;
  // spotLight.shadow.camera.fov = 20;

  // 相机对象
  const width = window.innerWidth;
  const height = window.innerHeight;
  const k = width / height;
  const s = 200;
  const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
  camera.position.set(200, 100, 200);
  camera.lookAt(scene.position);

  // 辅助对象
  const axisHelper = new THREE.AxesHelper(250);
  scene.add(axisHelper);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0xb9d3ff, 1);
  // renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  function render() {
    // requestAnimationFrame(render);
    renderer.render(scene, camera); //执行渲染操作
  }
  render();
  var controls = new THREE.OrbitControls(camera, renderer.domElement); //创建控件对象
  controls.addEventListener("change", render); //监听鼠标、键盘事件
};
