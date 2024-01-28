<template>
  <q-page class="flex flex-center" v-if="allmovies && allmovies.length > 0">
   <div class="row full-width" style="margin-top: 50px; min-height: 50vh;" v-if="!isplaying">
    <div class="col-6 text-white">
      <div class="q-ml-md q-mb-xl">{{ selected_movie.Title }}</div>
      <div class="q-ml-md">{{ selected_movie.Plot }}</div>
    </div>
    <div class="col-6">
      <q-img
        :src="selected_movie.Poster"
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
   <div class="row full-width" style="margin-top: 50px; min-height: 50vh;" v-if="isplaying">
    <div class="col-6 text-white">
      <div class="q-ml-md q-mb-xl">{{ selected_movie.Title }}</div>
      <div class="q-ml-md">{{ selected_movie.Plot }}</div>
      <div class="q-ml-md">
        <q-btn class="q-ma-lg" flat color="white" :icon="isinlist(selected_movie) ? 'close': 'add'" :label="isinlist(selected_movie) ? 'Remove from list': 'Add to list'" @click="isinlist(selected_movie) ? removefromlist(selected_movie) : addtolist(selected_movie)" no-caps/>
      </div>
    </div>
    <div class="col-6">
      <video controls src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" style="height: 250px; border-radius: 12px;"></video>
    </div>
   </div>
   <div class="text-white row full-width justify-start q-pl-xl q-pb-lg q-pt-lg" style="font-size: large; font-weight: 600;"  v-if="mylist.length > 0">My list</div>
   <div class="row full-width" v-if="mylist">
    <q-img
      class="q-ml-lg pointer"
      v-for="movie in mylist" :key="movie.imdbID"
      :src="movie.Poster"
      spinner-color="primary"
      spinner-size="82px"
      style="width: 250px; height: 350px; border-radius: 12px;"
      @click="playmovie(movie)"
      @mouseover="select_movie(movie)"
      :style="selected_movie.Title === movie.Title ? 'box-shadow: 0px 0px 30px white': 'box-sandow: 0px 0px 0px white'"
    />
   </div>
   <div class="text-white row full-width justify-start q-pl-xl q-pb-lg" style="font-size: large; font-weight: 600;">All movies</div>
   <div class="row full-width">
    <q-img
      class="q-ma-lg pointer"
      v-for="movie in allmovies" :key="movie.imdbID"
      :src="movie.Poster"
      spinner-color="primary"
      spinner-size="82px"
      style="width: 250px; height: 350px; border-radius: 12px;"
      @click="playmovie(movie)"
      @mouseover="select_movie(movie)"
      :style="selected_movie.Title === movie.Title ? 'box-shadow: 0px 0px 30px white': 'box-sandow: 0px 0px 0px white'"
    />
   </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCounterStore } from '/src/stores/example-store'
import axios from 'axios'

const store = useCounterStore();
onMounted(() => {
  store.getMoveInfo();
})
const isplaying = ref(false)
const mylist = ref([])
const allmovies = computed(() => {
  return store.allmovies
})
const selected_movie = ref(allmovies.value[0])
const playmovie = (m) => {
  isplaying.value = true
}
const select_movie = (m) => {
  selected_movie.value = m
  isplaying.value = false
}

const addtolist = (m) => {
  mylist.value.push(m)
}
const removefromlist = (m) => {
  let ind = mylist.value.findIndex(x => x.id === m.id)
  if (ind > -1) {
    mylist.value.splice(ind, 1)
  }
}

const isinlist = (m) => {
  let ind = mylist.value.findIndex(x => x.id === m.id)
  if (ind > -1) {
    return true
  } else {
    return false
  }
}

</script>
