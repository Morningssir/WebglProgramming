export const SphereVector3 = function (long, lat, radius) {
  const vector = new THREE.Vector3();
  const alpha = ((90 - lat) * Math.PI) / 180;
  const beta = ((180 + long) * Math.PI) / 180;
  vector.set(
    -radius * Math.sin(alpha) * Math.cos(beta),
    radius * Math.cos(alpha),
    radius * Math.sin(alpha) * Math.sin(beta)
  );
  return vector;
};
