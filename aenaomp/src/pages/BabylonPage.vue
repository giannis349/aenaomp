<!-- src/pages/Index.vue -->

<template>
  <div id="app">
    <canvas ref="renderCanvas"></canvas>
  </div>
</template>

<script setup>
import * as BABYLON from "babylonjs";
import "babylonjs-materials";
import "babylonjs-loaders";

const imageUrls = [
  "https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_r.jpg",
  "https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_l.jpg",
  "https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_u.jpg",
  "https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_d.jpg",
  "https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_f.jpg",
  "https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_b.jpg",
];

const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const createBabylonScene = async () => {
  const preloadedImages = await Promise.all(imageUrls.map(preloadImage));

  const canvas = ref("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  const skyboxMaterial = new BABYLON.StandardMaterial("mobile", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    preloadedImages,
    scene
  );

  const skybox = BABYLON.MeshBuilder.CreateBox(
    "mobile",
    { size: 1000.0 },
    scene
  );
  skybox.material = skyboxMaterial;

  engine.runRenderLoop(() => {
    if (scene) {
      scene.render();
    }
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
};

onMounted(() => {
  createBabylonScene();
});
</script>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
