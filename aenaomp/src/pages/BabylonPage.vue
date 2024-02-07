<!-- src/components/BabylonViewer.vue -->

<template>
  <canvas ref="canvas" style="width: 100%"></canvas>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "src/stores/example-store";
import { useRouter, useRoute } from "vue-router";
import * as BABYLON from "babylonjs";

const Store = useStore();
const Route = useRoute();
const Router = useRouter();
const canvas = ref(null);

onMounted(() => {
  start();
});
const start = () => {
  const engine = new BABYLON.Engine(canvas.value);
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 0, -5),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  const vrHelper = scene.createDefaultVRExperience();

  const skybox = BABYLON.MeshBuilder.CreateBox(
    "skyBox",
    { size: 1000.0 },
    scene
  );
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "https://cdn2.schoovr.com/tiles/1619551680275aichberger-01601531_mvaP18070702/1619551680275aichberger-01601531_mvaP18070702.tiles/",
    scene,
    [
      "webgl_r.jpg",
      "webgl_u.jpg",
      "webgl_f.jpg",
      "webgl_l.jpg",
      "webgl_d.jpg",
      "webgl_b.jpg",
    ]
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;

  engine.runRenderLoop(() => {
    scene.render();
  });
  addpoi(scene, canvas);
};

const addpoi = async function (scene, canvas) {
  const material = new BABYLON.StandardMaterial("", scene);
  material.diffuseTexture = new BABYLON.Texture(
    "https://cdn2.schoovr.com/indicators/poi_white.svg",
    scene
  );
  material.emissiveColor = new BABYLON.Color3(1, 1, 1);
  material.diffuseTexture.hasAlpha = true;
  const poi = BABYLON.MeshBuilder.CreatePlane("plane", { size: 0.35 }, scene);
  poi.material = material;
  poi.position.y = 0.5;
  poi.actionManager = new BABYLON.ActionManager(scene);
  console.log("plane: ", poi.position);
  poi.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
		scene.hoverCursor = "pointer";
	}));
  scene.onPointerPick = (event, pickInfo) => {
  if (pickInfo.hit && pickInfo.pickedMesh === poi) {
    console.log("poi clicked!", poi);
  }
}

  // Text

  let poiTitle = "Poi Title";
  const dynamicTexture = new BABYLON.DynamicTexture(
    "dynamicTexture",
    { width: poiTitle.length * 50, height: 136 },
    scene
  );
  const textMaterial = new BABYLON.StandardMaterial("textMaterial", scene);

  textMaterial.diffuseTexture = dynamicTexture;
  const context = dynamicTexture.getContext();
  let font = "bold 74px monospace";

  dynamicTexture.drawText(
    poiTitle,
    null,
    null,
    font,
    "white",
    "",
    true,
    true
  );

  textMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
  textMaterial.diffuseTexture.hasAlpha = true;
  const textplane = BABYLON.MeshBuilder.CreatePlane(
    "textPlane",
    { width: poiTitle.length / 10, height: 0.2 },
    scene
  );
  textplane.material = textMaterial;
  textplane.position.y = 0.85;
};

const addText = async function (scene) {
  let poiTitle = "Poi Title gfgfgs";
  const dynamicTexture = new BABYLON.DynamicTexture(
    "dynamicTexture",
    { width: poiTitle.length * 50, height: 136 },
    scene
  );
  const textMaterial = new BABYLON.StandardMaterial("textMaterial", scene);

  textMaterial.diffuseTexture = dynamicTexture;
  const context = dynamicTexture.getContext();
  let font = "bold 74px monospace";

  dynamicTexture.drawText(
    poiTitle,
    null,
    null,
    font,
    "white",
    "red",
    true,
    true
  );

  textMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
  textMaterial.diffuseTexture.hasAlpha = true;
  const plane = BABYLON.MeshBuilder.CreatePlane(
    "textPlane",
    { width: poiTitle.length / 10, height: 0.2 },
    scene
  );
  plane.material = textMaterial;
  plane.position.y = 0.9;
};
</script>

<style scoped>
/* Add any specific styling for your Babylon.js canvas */
</style>
