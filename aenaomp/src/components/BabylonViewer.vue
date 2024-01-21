<!-- src/components/BabylonViewer.vue -->

<template>
  <div ref="canvas"></div>
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
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('https://cdn2.schoovr.com/tiles/9644357/9644357.tiles', scene);
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
