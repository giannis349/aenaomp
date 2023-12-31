<template>
  <q-page class="flex flex-center">
   <div class="row full-width" style="margin-top: 50px; min-height: 50vh;">
    <div class="col-6 text-white">
      <div class="q-ml-md q-mb-xl">{{ selected_movie.title }}</div>
      <div class="q-ml-md">{{ selected_movie.description }}</div>
    </div>
    <div class="col-6">
      <q-img
        :src="selected_movie.image"
        :ratio="16/9"
        height="250px"
        fit
        spinner-color="primary"
        spinner-size="82px"
        class="q-ml-xl"
        style="border-radius: 12px 0px 0px 12px;;"
      />
    </div>
   </div>
   <div class="text-white row full-width justify-start q-pl-xl q-pb-lg" style="font-size: large; font-weight: 600;">All movies</div>
   <div class="row full-width">
    <q-img
    class="q-ml-lg pointer"
    v-for="movie in allmovies" :key="movie.id"
      :src="movie.poster"
      spinner-color="primary"
      spinner-size="82px"
      style="width: 250px; height: 350px; border-radius: 12px;"
      @click="select_movie(movie)"
      @mouseover="select_movie(movie)"
      :style="selected_movie.title === movie.title ? 'box-shadow: 0px 0px 30px white': 'box-sandow: 0px 0px 0px white'"
    />
   </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCounterStore } from '/src/stores/example-store'
import axios from 'axios'
const store = useCounterStore();

const allmovies = computed(() => {
  return store.allmovies
})
const selected_movie = ref(allmovies.value[0])

const select_movie = (m) => {
  selected_movie.value = m
}
</script>
