export const SphereVector3 = function (long, lat, radius, vector) {
  const vec3 = vector || new THREE.Vector3();
  const alpha = ((90 - lat) * Math.PI) / 180;
  const beta = ((180 + long) * Math.PI) / 180;
  vec3.set(
    -radius * Math.sin(alpha) * Math.cos(beta),
    radius * Math.cos(alpha),
    radius * Math.sin(alpha) * Math.sin(beta)
  );
  return vec3;
};

export const RotateMatrix = function (object, rotation, matrix) {
  const m = matrix || new THREE.Matrix4();
  m.identity();
  m.makeRotationY(rotation);
  m.multiply(object.matrix);
  object.matrix.copy(m);
  object.rotation.setFromRotationMatrix(object.matrix);
};
