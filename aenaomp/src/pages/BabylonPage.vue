<!-- src/components/BabylonViewer.vue -->

<template>
  <canvas id="renderCanvas" style="width: 100%"></canvas>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "src/stores/example-store";
import { useRouter, useRoute } from "vue-router";
import * as BABYLON from "babylonjs";

const Store = useStore();
const Route = useRoute();
const Router = useRouter();
const scene = ref(null);
const camera = ref(null);
onMounted(() => {
  start();
});
const start = () => {
  const engine = new BABYLON.Engine(
    document.getElementById("renderCanvas"),
    true
  );
  scene.value = new BABYLON.Scene(engine);
  camera.value = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 0, -1),
    scene.value
  );
  camera.value.setTarget(BABYLON.Vector3.Zero());
  const vrHelper = scene.value.createDefaultVRExperience();

  const skybox = BABYLON.MeshBuilder.CreateBox(
    "skyBox",
    { size: 10.0 },
    scene.value
  );
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene.value);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "https://cdn2.schoovr.com/tiles/" +
      currentscene.value.data.name.split(".")[0] +
      "/" +
      currentscene.value.data.name.split(".")[0] +
      ".tiles/",
    scene.value,
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
  // let a = Math.PI / 1.435;
  skybox.rotation.y = -Math.PI * 0.98;
  engine.runRenderLoop(() => {
    scene.value.render();
  });
};

const addpoi = async (data) => {
  console.log("poi position: ", data.title, data.position.position);
  if (!scene.value) {
    console.error("Scene is not initialized!");
    return;
  }

  // indicator
  const material = new BABYLON.StandardMaterial("", scene.value);
  material.diffuseTexture = new BABYLON.Texture(
    "https://cdn2.schoovr.com/indicators/poi_white.svg",
    scene.value
  );
  material.emissiveColor = new BABYLON.Color3(1, 1, 1);
  material.diffuseTexture.hasAlpha = true;
  const poi = BABYLON.MeshBuilder.CreatePlane(
    "plane",
    { size: 0.35 },
    scene.value
  );
  const aframePosition = {
    x: data.position.position.x,
    y: data.position.position.y / 10,
    z: data.position.position.z,
  };
  const babylonPosition = new BABYLON.Vector3(
    aframePosition.x,
    aframePosition.y,
    -aframePosition.z
  );

  poi.position = babylonPosition;
  poi.material = material;
  poi.actionManager = new BABYLON.ActionManager(scene.value);
  poi.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
  console.log("plane: ", poi.position);
  poi.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      function (ev) {
        scene.value.hoverCursor = "pointer";
      }
    )
  );
  scene.value.onPointerPick = (event, pickInfo) => {
    if (pickInfo.hit && pickInfo.pickedMesh === poi) {
      console.log("poi clicked!", poi);
    }
  };

  // Text

  let poiTitle = data.title;
  const dynamicTexture = new BABYLON.DynamicTexture(
    "dynamicTexture",
    { width: poiTitle.length * 50, height: 136 },
    scene.value
  );
  const textMaterial = new BABYLON.StandardMaterial(
    "textMaterial",
    scene.value
  );

  textMaterial.diffuseTexture = dynamicTexture;
  const context = dynamicTexture.getContext();
  let font = "bold 74px arial";

  dynamicTexture.drawText(poiTitle, null, null, font, "white", "", true, true);

  textMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
  textMaterial.diffuseTexture.hasAlpha = true;
  const textplane = BABYLON.MeshBuilder.CreatePlane(
    "textPlane",
    { width: poiTitle.length / 10, height: 0.2 },
    scene.value
  );
  textplane.material = textMaterial;
  textplane.position.y = babylonPosition.y + 0.3;
  textplane.position.x = babylonPosition.x;
  textplane.position.z = babylonPosition.z;
  // textplane.position = babylonPosition;
  textplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
  console.log("rot: ", camera.value.rotation);
};

const item2 = computed(() => {
  return Store.experiences.filter((x) => x.id === Number(Route.params.id));
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
</script>

<style scoped>
/* Add any specific styling for your Babylon.js canvas */
</style>
