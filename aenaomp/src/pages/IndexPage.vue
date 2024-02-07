<template>
  <q-page class="flex flex-center">
    <div
      class="row full-width justify-center"
      style="margin-top: 50px; min-height: 50vh"
    >
      <div class="col-3 text-white">
        <div
          class="q-ml-md q-mb-xl text-white flex flex-center"
          style="
            background-color: rgb(79, 78, 78);
            font-size: x-large;
            height: 100px;
            border-radius: 18px;
            cursor: pointer;
          "
          @click="$router.push('/movies')"
        >
          Moves
        </div>
      </div>
      <div class="col-3">
        <div
          class="q-ml-md q-mb-xl text-white flex flex-center"
          style="
            background-color: rgb(79, 78, 78);
            font-size: x-large;
            height: 100px;
            border-radius: 18px;
            cursor: pointer;
          "
          @click="$router.push('/babylon')"
        >
          Test
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import router from 'src/router';
import { ref, computed, onMounted } from 'vue'
import { useStore } from '/src/stores/example-store'

const store = useStore();
onMounted(() => {
  store.getMoveInfo();
})
</script>
