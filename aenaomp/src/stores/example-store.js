import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    counter: 0,
    allmovies: [],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
    getMoveInfo() {
      // const apiKey = "5e108139"; // omdbapi
      const apiKey ="5532a45bd4955c4a01ce76e1a6ddc59e" // tmdbapi
      const movieTitles = [
        "Indiana Jones and the Last Crusade",
        "Indiana Jones and the Dial of Destiny",
        "Inception",
        "The Dark Knight",
        "Interstellar",
      ]; // Replace with the movie title you want to search for

      for (let index = 0; index < movieTitles.length; index++) {
        const movieTitle = movieTitles[index];
        const apiUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=' + movieTitle + '&include_adult=false&language=en-US&page=1';

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            console.log("movie data", data.results);
            for (let index = 0; index < data.results.length; index++) {
              const result = data.results[index];
              if (result.original_title.toLowerCase() === movieTitle.toLowerCase()) {
                this.allmovies.push(result);
                return
              }

            }
          })
          .catch((error) => {
            console.error("Error fetching movie data:", error);
          });
      }
    },
  },
});
