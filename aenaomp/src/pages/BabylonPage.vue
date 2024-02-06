<!-- src/components/BabylonViewer.vue -->

<template>
  <canvas ref="canvas" style="width: 100%;"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as BABYLON from 'babylonjs';

const canvas = ref(null);

onMounted(() => {
  const engine = new BABYLON.Engine(canvas.value);
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, -5), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  const vrHelper = scene.createDefaultVRExperience();

  const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    'https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/', scene,  ["webgl_r.jpg", "webgl_u.jpg", "webgl_f.jpg", "webgl_l.jpg", "webgl_d.jpg", "webgl_b.jpg"]);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;

  engine.runRenderLoop(() => {
    scene.render();
  });
});
</script>

<style scoped>
/* Add any specific styling for your Babylon.js canvas */
</style>

