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
    <div
      class="absolute-bottom-right"
      style="
        top: 50%;
        width: 50px;
        height: 100px;
        background-color: green;
        z-index: 9999999999;
      "
      @click="setpos()"
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
// const bjsscene = ref(null);
let bjsscene = null;
// let xrHelper = null;
let xrCamera = null;
let animCameraPosition = null;
let animCameraTarget = null;
let camera = null;
let canvas = document.getElementById("renderCanvas");
onMounted(() => {
  start();
});
const start = async function () {
  const engine = new BABYLON.Engine(
    document.getElementById("renderCanvas"),
    true
  );
  bjsscene = new BABYLON.Scene(engine);

  camera = new BABYLON.DeviceOrientationCamera(
    "camera",
    new BABYLON.Vector3(0, 0, 0),
    bjsscene
  );
  camera.position = new BABYLON.Vector3(0, 1.6, 0);
  camera.attachControl(canvas, true);
  bjsscene.activeCamera = camera;
  const vrHelper = bjsscene.createDefaultVRExperience();

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
  // let a = Math.PI / 1.435;
  skybox.rotation.y = 80.1;

  bjsscene.onPointerPick = (event, pickInfo) => {
    if (pickInfo.hit && pickInfo.pickedMesh.ispoi) {
      checkpoi(pickInfo.pickedMesh);
    }
  };
  const fps = engine.getFps();
  console.log("Current frame rate:", fps.toFixed(2), "FPS");
  engine.runRenderLoop(() => {
    bjsscene.render();
  });
};

const addpoi = async (data) => {
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
  let y = data.position.position.y;
  const aframePosition = {
    x: data.position.position.z,
    y: y,
    z: data.position.position.x,
  };
  const babylonPosition = new BABYLON.Vector3(
    -aframePosition.x,
    aframePosition.y,
    -aframePosition.z
  );

  poi.position = babylonPosition;
  poi.ispoi = true;
  poi.poiid = data.id;
  poi.poiposition = data.position.position;
  poi.material = material;
  poi.actionManager = new BABYLON.ActionManager(bjsscene);
  poi.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
  poi.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      function (ev) {
        bjsscene.hoverCursor = "pointer";
      }
    )
  );

  //bg

  const bgmaterial = new BABYLON.StandardMaterial("", bjsscene);
  bgmaterial.opacityTexture = new BABYLON.Texture(
    "/icons/bg.png",
    bjsscene
  );
  bgmaterial.emissiveColor = new BABYLON.Color3(0.11, 0.11, 0.11);

  const bg = BABYLON.MeshBuilder.CreatePlane(
    "bg",
    { width: data.title.length / 10, height: 0.2, },
    bjsscene
  );
  bg.material = bgmaterial
  bg.position.y = babylonPosition.y + 0.3;
  bg.position.x = babylonPosition.x;
  bg.position.z = babylonPosition.z + 0.01;
  bg.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;

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
    for (let index = 0; index < currentscene.value.pois.length; index++) {
      const poi = currentscene.value.pois[index];
      addpoi(poi);
    }
  }
}, 1000);

const next_scene = () => {
  const ind = item2.value[0].data.panos.findIndex(
    (x) => x.id === currentscene.value.id
  );
  if (ind > -1) {
    scene_id.value = item2.value[0].data.panos[ind + 1].id;
    start();
    for (let index = 0; index < currentscene.value.pois.length; index++) {
      const poi = currentscene.value.pois[index];
      addpoi(poi);
    }
  }
};
let newCamera = null;
const checkpoi = function (poi) {
  if (poi && poi._position) {
    var duration = 100;
    var fps = 50;
    var newTargetPosition = new BABYLON.Vector3(
      poi._position.x,
      poi._position.y,
      poi._position.z
    );
    BABYLON.Animation.CreateAndStartAnimation(
      "transition",
      bjsscene.activeCamera,
      "target",
      fps,
      duration,
      bjsscene.activeCamera.getTarget(),
      newTargetPosition,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  } else {
    console.error("poi or poi._position is undefined");
  }
};
let testpoi = {
    "type": "select",
    "data": {
        "poi": {
            "position": {
                "_id": 2,
                "position": {
                    "x": -2.5760052617035254,
                    "y": 1.603972759939657,
                    "z": -2.8947040867787477
                },
                "indicator": {
                    "width": 0.5,
                    "height": 0.5,
                    "frameDuration": 0.03,
                    "hovered": false
                },
                "audio": {
                    "enabled": false,
                    "src": null
                },
                "tooltip": {
                    "title": "Add a tooltip",
                    "enabled": true,
                    "permanent": true,
                    "color": "#ffffff",
                    "width": 4,
                    "position": {
                        "x": 0,
                        "y": 0.3,
                        "z": 0.5
                    }
                },
                "pit": 0
            },
            "created_at": "2023-07-07T08:59:47.000Z",
            "indicator": {
                "id": 1,
                "title": "default",
                "data": {
                    "name": "poi_white.svg",
                    "rows": 30,
                    "columns": 1,
                    "frameDuration": 0.03,
                    "loop": true,
                    "width": 0.5,
                    "height": 0.5
                },
                "animated": false,
                "locale": "en",
                "created_at": "2023-06-20T12:38:48.000Z",
                "updated_at": "2023-06-20T12:38:48.000Z",
                "localizations": []
            },
            "whos": "robotlab",
            "panorama": 30,
            "updated_at": "2023-07-07T13:39:58.000Z",
            "title": "Great Pyramid of Giza",
            "locale": "en",
            "video": null,
            "id": 24,
            "image": "4/1688663898506Pyramid-(1).jpg",
            "description": "The other large pyramid here was built for the Pharaoh Khufu, the father of Khafre. Khufu’s pyramid is the earliest of the three pyramids, and also the largest, at almost 150 meters (480 feet) in height. This pyramid is also known as the Great Pyramid of Egypt, and is the only one of the Seven Wonders of the Ancient World which remains."
        },
        "scene": 30
    }
}
function setpos() {
  let poi = testpoi.data.poi.position
  var duration = 100;
    var fps = 50;
    var newTargetPosition = new BABYLON.Vector3(
      -poi.position.x,
      poi.position.y,
      -poi.position.z
    );
    BABYLON.Animation.CreateAndStartAnimation(
      "transition",
      bjsscene.activeCamera,
      "target",
      fps,
      duration,
      bjsscene.activeCamera.getTarget(),
      newTargetPosition,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
}
</script>

<style scoped>
/* Add any specific styling for your Babylon.js canvas */
</style>
