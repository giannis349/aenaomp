<!-- src/components/BabylonViewer.vue -->

<template>
  <canvas ref="canvas" style="width: 100%;"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as BABYLON from 'babylonjs';

const canvas = ref(null);

onMounted(() => {
  // Babylon.js initialization
  const engine = new BABYLON.Engine(canvas.value);

  // Scene creation
  const scene = new BABYLON.Scene(engine);

  // Camera setup (for VR you might need a specific camera)
  const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, -5), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  // VR experience helper
  const vrHelper = scene.createDefaultVRExperience();

  // Load 360 image
  const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture([
    'proxy?url=https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_r.jpg',
    'proxy?url=https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_l.jpg',
    'proxy?url=https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_u.jpg',
    'proxy?url=https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_d.jpg',
    'proxy?url=https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_f.jpg',
    'proxy?url=https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/mobile_b.jpg',
  ], scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;

  // Render loop
  engine.runRenderLoop(() => {
    scene.render();
  });
});
</script>

<style scoped>
/* Add any specific styling for your Babylon.js canvas */
</style>
