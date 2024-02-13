<template>
  <q-page
    class="row"
    style="
      background-color: #1d1d1d;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      position: relative;
    "
    :style="
      'background-image: url(https://image.tmdb.org/t/p/original' +
      selected_movie.backdrop_path +
      ');'
    "
    v-if="allmovies && allmovies.length > 0"
  >
    <div class="absolute-top-left">
      <q-btn
        outline
        color="white"
        icon="arrow_back_ios"
        label="Back"
        class="br8 q-ma-md"
        @click="$router.go(-1)"
        no-caps
      ></q-btn>
    </div>
    <div class="row full-width">
      <iframe
        class="col-auto br8"
        width="280"
        height="160"
        v-for="v in movievideos.filter((x) => x.type === 'Trailer')"
        :key="v"
        :src="'https://www.youtube.com/embed/' + v.key"
      >
      </iframe>
    </div>
    <div
      style="min-height: 250px"
      class="absolute-bottom-left row items-end full-width chosseninfo"
    >
      <div class="col-2 q-pl-xs flex flex-center">
        <q-img
          :src="'https://image.tmdb.org/t/p/w780' + selected_movie.poster_path"
          fit
          spinner-color="primary"
          spinner-size="82px"
          class="q-ma-lg"
          style="min-width: 150px; height: 220px; border-radius: 12px"
        />
      </div>
      <div class="col-10 row text-white items-start" style="height: 249px">
        <div class="col-12 q-ma-md" style="font-size: large; font-weight: 700">
          {{ selected_movie.title }}
          <div class="row full-width">
            <div
              class="col-auto q-pa-xs"
              style="font-weight: 200; font-size: small"
              v-for="g in selected_movie.genre_ids"
              :key="g"
            >
              {{ genders.filter((x) => x.id === g)[0].name }}
            </div>
          </div>
        </div>
        <div class="col-12 q-ml-md" style="font-size: small; font-weight: 500">
          {{
            "Release date: " +
            selected_movie.release_date.split("-")[2] +
            "/" +
            selected_movie.release_date.split("-")[1] +
            "/" +
            selected_movie.release_date.split("-")[0]
          }}
          <q-circular-progress
            show-value
            class="q-ml-md"
            :value="Math.round(selected_movie.vote_average * 10)"
            size="50px"
            color="dark"
            track-color="grey-3"
          >
            {{ Math.round(selected_movie.vote_average * 10) }}%
          </q-circular-progress>
        </div>
        <q-scroll-area
          class="col-12 q-ml-md"
          style="height: 100px; width: 70vw"
        >
          <div class="">
            {{ selected_movie.overview }}
          </div>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "/src/stores/example-store";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const store = useStore();
const Route = useRoute();
onMounted(() => {
  store.getMoveInfo();
});
const isplaying = ref(false);
const mylist = ref([]);
const allmovies = computed(() => {
  return store.allmovies.filter((x) => x.id === Number(Route.params.id));
});
const genders = computed(() => {
  return store.genders;
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
const movievideos = ref([]);
if (Route.params.id) {
  axios
    .get(
      "https://api.themoviedb.org/3/movie/" +
        Route.params.id +
        "/videos?api_key=5532a45bd4955c4a01ce76e1a6ddc59e&language=en-US"
    )
    .then((res) => {
      console.log("movievideos data", res.data.results);
      movievideos.value = res.data.results;
    })
    .catch((error) => {
      console.error("Error fetching movie data:", error);
    });
}
</script>
