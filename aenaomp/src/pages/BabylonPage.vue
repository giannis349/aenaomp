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

  camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 0, 0),
    bjsscene
  );
  // camera.position = new BABYLON.Vector3(0, 1.6, 0);
  Object.defineProperty(camera, '_setTarget', {
        set: function(v) { this.setTarget(v); }
    });
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
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
  let easingFunction = new BABYLON.CubicEase(0.0);
  easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
  animCameraTarget = new BABYLON.Animation(
    "animCameraTarget",
    "_setTarget",
    30,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  animCameraPosition = new BABYLON.Animation(
    "animCameraPosition",
    "position",
    30,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  animCameraTarget.setEasingFunction(easingFunction);
  animCameraPosition.setEasingFunction(easingFunction);
  bjsscene.onPointerDown = function (event, pickResult) {
    clicker(event, pickResult);
  };

  engine.runRenderLoop(() => {
    bjsscene.render();
  });
};

function clicker(evt, pickInfo) {
  console.log("pickInfo: ", pickInfo);
  if (pickInfo.pickedMesh) {
    let meshi = pickInfo.pickedMesh;

    //direction
    let forward = new BABYLON.Vector3(0, 0, 1);
    let direction = meshi.getDirection(forward);
    direction.normalize();

    //camera.getViewMatrix(true)
    let target = camera.getTarget();

    let pos = camera.position;

    let move = meshi.absolutePosition.add(
      direction.multiplyByFloats(10, 10, 10)
    );

    let positionKeys = [
      {
        frame: 0,
        value: pos,
      },
      //At the animation key 100, the value of scaling is "1"
      {
        frame: 100,
        value: move,
      },
    ];
    animCameraPosition.setKeys(positionKeys);

    let targetKeys = [
      {
        frame: 0,
        value: target,
      },
      {
        frame: 100,
        value: meshi._absolutePosition,
      },
    ];

    animCameraTarget.setKeys(targetKeys);

    camera.animations = [];

    camera.animations.push(animCameraPosition);
    camera.animations.push(animCameraTarget), camera.detachControl(canvas);

    bjsscene.beginDirectAnimation(
      camera,
      camera.animations,
      0,
      360,
      false,
      1,
      () => {
        camera.attachControl(canvas, true);
        camera.lockedTarget = null;
      }
    );
  }
}
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
  console.log("checkpoi: ", camera);
  // camera.detachControl(canvas, true)
  // camera.setTarget(new BABYLON.Vector3(poi._position.x, poi._position.y, poi._position.z))
  // camera.attachControl(canvas, true);
  return;
  let direction = poi._position;
  let pitchAngle = (Math.atan2(direction.y, direction.x) * 180.0) / Math.PI;
  newCamera = new BABYLON.FreeCamera(
    "newCamera",
    new BABYLON.Vector3(0, 1.6, 0),
    bjsscene
  );
  newCamera.rotation = new BABYLON.Vector3(0, 1.6, 0);
  bjsscene.activeCamera = newCamera;
  console.log("pitchAngle: ", pitchAngle);
  newCamera.attachControl(canvas, true);
  let targetRotationAngle = BABYLON.Tools.ToRadians(pitchAngle);
  let animationKeys = [];
  animationKeys.push({
    frame: 0,
    value: 1.6,
  });
  animationKeys.push({
    frame: 100,
    value: targetRotationAngle,
  });

  let rotationAnimation = new BABYLON.Animation(
    "rotationAnimation",
    "rotation.y",
    100,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  rotationAnimation.setKeys(animationKeys);
  newCamera.animations.push(rotationAnimation);
  bjsscene.beginAnimation(newCamera, 0, 100, false);
};
</script>

<style scoped>
/* Add any specific styling for your Babylon.js canvas */
</style>
