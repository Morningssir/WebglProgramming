window.onload = function() {
  const canvas = document.getElementById("webglcanvas");
  const gl = this.initWebGL(canvas);
};

function initWebGL(canvas) {
  let gl = null;
  let msg = "Your browser does not support WebGL.";

  try {
    gl = canvas.getContext("webgl");
    console.log("Success creating WebGL Context!");
  } catch (e) {
    msg = "Error creating WebGL Context: " + e.toString();
  }

  if (!gl) {
    alert(msg);
    throw new Error(msg);
  }
  return gl;
}

// 创建矩形边界的视口
function initViewport(gl, canvas) {
  gl.viewport(0, 0, canvas.width, canvas.height);
}
