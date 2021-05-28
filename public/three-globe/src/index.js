import { Stage } from "./Stage.js";

window.onload = () => {
  loadImageData()
    .then((image) => {
      const stage = new Stage({ image });
      window.stage = stage;
    })
    .catch((error) => {
      console.error(error);
    });
};

async function loadImageData() {
  const textureLoader = new THREE.TextureLoader();
  try {
    return new Promise((resolve) => {
      textureLoader.load("assets/images/map.png", (imageData) => {
        resolve(imageData.image);
      });
    });
  } catch (error) {
    throw new Error(error);
  }
}
