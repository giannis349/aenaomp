<template>
  <q-page
    class=""
    style="background-color: red; background-position: center; background-repeat: no-repeat; background-size: cover; position: relative;"
    :style="'background-image: url(https://image.tmdb.org/t/p/original' + selected_movie.backdrop_path + ');'"
    v-if="allmovies && allmovies.length > 0"
  >
    <div class="absolute-bottom-left row items-end full-width">
      <div class="col-3">
        <q-img
          :src="
            'https://image.tmdb.org/t/p/w780' + selected_movie.poster_path
          "
          height="250px"
          fit
          spinner-color="primary"
          spinner-size="82px"
          class="q-ma-lg"
          style="width: 250px; height: 350px; border-radius: 12px"
        />
      </div>
      <div class="col-9 row text-white chosseninfo items-start" style="height: 20vw;">
        <div class="q-ma-md" style="font-size: large; font-weight: 700;">{{ selected_movie.title }}</div>
        <div class="q-ma-md" style="font-size: small; font-weight: 300;">{{ selected_movie.release_date }}</div>
        <div class="q-ma-md" style="font-size: small; font-weight: 300;">{{ selected_movie.popularity }}</div>
        <div class="q-ma-md">{{ selected_movie.overview }}</div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCounterStore } from "/src/stores/example-store";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const store = useCounterStore();
const Route = useRoute();
onMounted(() => {
  store.getMoveInfo();
});
const isplaying = ref(false);
const mylist = ref([]);
const allmovies = computed(() => {
  return store.allmovies.filter((x) => x.id === Number(Route.params.id));
});
const selected_movie = ref(allmovies.value[0]);
const playmovie = (m) => {
  isplaying.value = true;
};
const select_movie = (m) => {
  selected_movie.value = m;
  isplaying.value = false;
};

const addtolist = (m) => {
  mylist.value.push(m);
};
const removefromlist = (m) => {
  let ind = mylist.value.findIndex((x) => x.id === m.id);
  if (ind > -1) {
    mylist.value.splice(ind, 1);
  }
};

const isinlist = (m) => {
  let ind = mylist.value.findIndex((x) => x.id === m.id);
  if (ind > -1) {
    return true;
  } else {
    return false;
  }
};
</script>
