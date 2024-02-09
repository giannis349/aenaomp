<!-- src/components/BabylonViewer.vue -->

<template>
  <q-layout view="Lhh lpR fff" class="nowhite disable-select">
    <canvas id="renderCanvas" style="width: 100%; height: 99vh"> </canvas>
    <div
      class="absolute-bottom-left"
      style="
        top: 50%;
        width: 50px;
        height: 100px;
        background-color: red;
        z-index: 9999999999;
      "
      @click="next_scene()"
    ></div>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "src/stores/example-store";
import { useRouter, useRoute } from "vue-router";
import * as BABYLON from "babylonjs";

const Store = useStore();
const Route = useRoute();
const Router = useRouter();
// const scene = ref(null);
let bjsscene = null;
// let xrHelper = null;
let xrCamera = null;
const camera = ref(null);
onMounted(() => {
  start();
});
const start = async function () {
  let canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(
    document.getElementById("renderCanvas"),
    true
  );
  bjsscene = new BABYLON.Scene(engine);

  camera.value = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 0, 0),
    bjsscene
  );
  camera.value.setTarget(BABYLON.Vector3.Zero());
  camera.value.angularSensibility = 10;
  camera.value.moveSensibility = 10;
  camera.value.attachControl(canvas, true);
  camera.value.upperRadiusLimit = camera.value.radius;
  camera.value.lowerRadiusLimit = camera.value.radius;
  const vrHelper = bjsscene.createDefaultVRExperience();
  const xrHelper = await bjsscene.createDefaultXRExperienceAsync();
  xrCamera = xrHelper.baseExperience.camera;
  const skybox = BABYLON.MeshBuilder.CreateBox(
    "skyBox",
    { size: 10000.0 },
    bjsscene
  );
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", bjsscene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "https://cdn2.schoovr.com/tiles/" +
      currentscene.value.data.name.split(".")[0] +
      "/" +
      currentscene.value.data.name.split(".")[0] +
      ".tiles/",
    bjsscene,
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
  xrHelper.baseExperience.camera.fov = 0.8;
  skybox.position = xrHelper.baseExperience.camera.position;
  // let a = Math.PI / 1.435;
  skybox.rotation.y = 80.1;

  engine.runRenderLoop(() => {
    bjsscene.render();
  });
};

const addpoi = async (data) => {
  console.log("poi position: ", data.title, data.position.position);
  if (!bjsscene) {
    console.error("Scene is not initialized!");
    return;
  }

  // indicator
  const material = new BABYLON.StandardMaterial("", bjsscene);
  material.diffuseTexture = new BABYLON.Texture(
    "https://cdn2.schoovr.com/indicators/poi_white.svg",
    bjsscene
  );
  material.emissiveColor = new BABYLON.Color3(1, 1, 1);
  material.diffuseTexture.hasAlpha = true;
  const poi = BABYLON.MeshBuilder.CreatePlane(
    "plane",
    { size: 0.35 },
    bjsscene
  );
  let y = 0
  if (data.position.position.y > 3.7) {
    y = data.position.position.y
  } else {
    y = data.position.position.y * 0.1
  }
  console.log("dpp: ", data.position.position)
  const aframePosition = {
    x: data.position.position.z,
    y: y ,
    z: data.position.position.x,
  };
  const babylonPosition = new BABYLON.Vector3(
    -aframePosition.x,
    aframePosition.y,
    -aframePosition.z
  );

  poi.position = babylonPosition;
  poi.material = material;
  poi.actionManager = new BABYLON.ActionManager(bjsscene);
  poi.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
  console.log("plane: ", poi.position);
  poi.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      function (ev) {
        bjsscene.hoverCursor = "pointer";
      }
    )
  );
  bjsscene.onPointerPick = (event, pickInfo) => {
    if (pickInfo.hit && pickInfo.pickedMesh === poi) {
      console.log("poi clicked!", poi);
    }
  };

  // Text

  let poiTitle = data.title;
  const dynamicTexture = new BABYLON.DynamicTexture(
    "dynamicTexture",
    { width: poiTitle.length * 50, height: 136 },
    bjsscene
  );
  const textMaterial = new BABYLON.StandardMaterial("textMaterial", bjsscene);

  textMaterial.diffuseTexture = dynamicTexture;
  const context = dynamicTexture.getContext();
  let font = "bold 74px arial";

  dynamicTexture.drawText(poiTitle, null, null, font, "white", "", true, true);

  textMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
  textMaterial.diffuseTexture.hasAlpha = true;
  const textplane = BABYLON.MeshBuilder.CreatePlane(
    "textPlane",
    { width: poiTitle.length / 10, height: 0.2 },
    bjsscene
  );
  textplane.material = textMaterial;
  textplane.position.y = babylonPosition.y + 0.3;
  textplane.position.x = babylonPosition.x;
  textplane.position.z = babylonPosition.z;
  textplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
  console.log("rot: ", camera.value.rotation);
};

const item2 = computed(() => {
  return Store.experiences;
});
const scene_id = ref(Store.experiences[0].data.panos[0].id);

const currentscene = computed(() => {
  return Store.experiences[0].data.panos.filter(
    (x) => x.id === scene_id.value
  )[0];
});
setTimeout(() => {
  if (item2.value) {
    console.log("item2.value: ", item2.value);
    for (let index = 0; index < currentscene.value.pois.length; index++) {
      const poi = currentscene.value.pois[index];
      console.log("poi", poi);
      addpoi(poi);
    }
  }
}, 1000);

const next_scene = () => {
  console.log("next_scene: ", item2.value[0].data.panos);
  const ind = item2.value[0].data.panos.findIndex(
    (x) => x.id === currentscene.value.id
  );
  if (ind > -1) {
    console.log("next_scene if: ", item2.value[0].data.panos[ind + 1].id);
    scene_id.value = item2.value[0].data.panos[ind + 1].id;
    start();
    for (let index = 0; index < currentscene.value.pois.length; index++) {
      const poi = currentscene.value.pois[index];
      console.log("poi", poi);
      addpoi(poi);
    }
  }
};
</script>

<style scoped>
/* Add any specific styling for your Babylon.js canvas */
</style>
