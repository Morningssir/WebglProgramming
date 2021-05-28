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
    return new Promise((resolve, reject) => {
      textureLoader.load("assets/map.png", (imageData) => {
        // const canvas = document.createElement("canvas");
        // const context = canvas.getContext("2d");
        // context.drawImage(image, 0, 0, image.width, image.height);
        // const imageData = context.getImageData(0, 0, image.width, image.height);
        resolve(imageData.image);
      });
    });
  } catch (error) {
    throw new Error(error);
  }
}
