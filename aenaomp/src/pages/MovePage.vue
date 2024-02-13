<template>
  <q-page
    class="flex flex-center"
    v-if="allmovies && allmovies.length > 0"
    style="
      background-repeat: no-repeat;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    "
    :style="'background-image: url(' + returnurl() + ')'"
  >
    <div
      class="row full-width"
      style="margin-top: 50px; min-height: 50vh"
      v-if="!isplaying && selected_movie"
    >
      <div class="col-6 text-white">
        <div class="q-ml-md q-mb-xl">{{ selected_movie.title }}</div>
        <div class="q-ml-md">{{ selected_movie.overview }}</div>
        <div class="row full-width items-center q-ml-md">
          <q-btn
            class="br8 q-ma-lg"
            outline
            color="white"
            :icon="isinlist(selected_movie) ? 'close' : 'add'"
            :label="
              isinlist(selected_movie) ? 'Remove from list' : 'Add to list'
            "
            @click="
              isinlist(selected_movie)
                ? removefromlist(selected_movie)
                : addtolist(selected_movie)
            "
            no-caps
          />
          <q-btn
            outline
            icon="info"
            color="white"
            label="Info"
            style="height: 15px"
            class="br8"
            no-caps
            @click="$router.push('/chossenmovie/' + selected_movie.id)"
          ></q-btn>
        </div>
      </div>
      <!-- <div
        class="col-6 feather-edge"
        style="
          height: 260px;
          background-repeat: no-repeat;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        "
        :style="'background-image: url(' + returnurl() + ')'"
      ></div> -->
    </div>
    <div
      class="text-white row full-width justify-start q-pl-xl q-pb-lg q-pt-lg"
      style="font-size: large; font-weight: 600"
      v-if="mylist.length > 0"
    >
      My list
    </div>
    <div class="row full-width" v-if="mylist && selected_movie">
      <q-img
        class="q-ml-lg pointer"
        v-for="movie in mylist"
        :key="movie.id"
        :src="'https://image.tmdb.org/t/p/w780' + movie.poster_path"
        spinner-color="primary"
        spinner-size="82px"
        style="width: 250px; height: 350px; border-radius: 12px"
        @click="playmovie(movie)"
        @mouseover="select_movie(movie)"
        :style="
          selected_movie && selected_movie.title === movie.title
            ? 'box-shadow: 0px 0px 30px white'
            : 'box-sandow: 0px 0px 0px white'
        "
      />
    </div>
    <div
      class="text-white row full-width justify-start q-pl-xl q-pb-lg"
      style="font-size: large; font-weight: 600"
    >
      All movies
    </div>
    <div class="q-pa-md row full-width flex flex-center">
      <q-scroll-area style="height: 330px; width: 100%;">
        <div class="row no-wrap items-center q-mt-md">
          <q-img
            class="q-ma-lg pointer"
            v-for="movie in allmovies"
            :key="movie.id"
            :src="'https://image.tmdb.org/t/p/w780' + movie.poster_path"
            spinner-color="primary"
            spinner-size="82px"
            style="width: 200px; height: 260px; border-radius: 12px"
            @mouseover="select_movie(movie)"
            :style="
              selected_movie && selected_movie.title === movie.title
                ? 'box-shadow: 0px 0px 30px white'
                : 'box-sandow: 0px 0px 0px white'
            "
          />
        </div>
      </q-scroll-area>
    </div>
    <div class="row full-width">
      <q-img
        class="q-ma-lg pointer"
        v-for="movie in allmovies"
        :key="movie.id"
        :src="'https://image.tmdb.org/t/p/w780' + movie.poster_path"
        spinner-color="primary"
        spinner-size="82px"
        style="width: 250px; height: 350px; border-radius: 12px"
        @mouseover="select_movie(movie)"
        :style="
          selected_movie && selected_movie.title === movie.title
            ? 'box-shadow: 0px 0px 30px white'
            : 'box-sandow: 0px 0px 0px white'
        "
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "/src/stores/example-store";
import axios from "axios";

const store = useStore();
onMounted(() => {
  store.getMoveInfo();
});
const isplaying = ref(false);
const mylist = ref([]);
const allmovies = computed(() => {
  return store.allmovies;
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
const returnurl = () => {
  if (selected_movie.value) {
    return "https://image.tmdb.org/t/p/w780" + selected_movie.value.backdrop_path

  } else {
    return "https://www.wisc-online.com/assetrepository/getfile?id=954&getType=view&width=0&height=0";
  }
};
</script>
