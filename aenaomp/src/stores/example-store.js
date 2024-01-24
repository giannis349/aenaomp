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
      const apiKey = "5e108139"; // Replace with your actual API key
      const movieTitles = [
        " Indiana Jones and the Last Crusade",
        "Indiana Jones and the Dial of Destiny",
        "Inception",
        "The Dark Knight",
        "Interstellar",
        "Indiana Jone",
      ]; // Replace with the movie title you want to search for

      for (let index = 0; index < movieTitles.length; index++) {
        const movieTitle = movieTitles[index];
        const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(
          movieTitle
        )}`;

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            console.log("movie data", data);
            if (data.Response === "True") {
              this.allmovies.push(data);
            }
          })
          .catch((error) => {
            console.error("Error fetching movie data:", error);
          });
      }
    },
  },
});
