import { defineStore } from "pinia";
import axios from "axios";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    counter: 0,
    allmovies: [
      //       {
      //         Actors
      // :
      // "Harrison Ford, Sean Connery, Alison Doody",
      // Awards
      // :
      // "Won 1 Oscar. 9 wins & 24 nominations total",
      // BoxOffice
      // :
      // "$197,171,806",
      // Country
      // :
      // "United States",
      // DVD
      // :
      // "28 Jan 2014",
      // Director
      // :
      // "Steven Spielberg",
      // Genre
      // :
      // "Action, Adventure",
      // Language
      // :
      // "English, German, Greek, Latin, Italian",
      // Metascore
      // :
      // "65",
      // Plot
      // :
      // "In 1938, after his father goes missing while pursuing the Holy Grail, Indiana Jones finds himself up against the Nazis again to stop them from obtaining its powers.",
      // Poster
      // :
      // "https://m.media-amazon.com/images/M/MV5BY2Q0ODg4ZmItNDZiYi00ZWY5LTg2NzctNmYwZjA5OThmNzE1XkEyXkFqcGdeQXVyMjM4MzQ4OTQ@._V1_SX300.jpg",
      // Production
      // :
      // "N/A",
      // Rated
      // :
      // "PG-13",
      // Ratings
      // :
      // (3) [
      //   {Source: 'Internet Movie Database', Value: '8.2/10'},
      // {Source: 'Rotten Tomatoes', Value: '84%'},
      // {Source: 'Metacritic', Value: '65/100'}
      // ],
      // Released
      // :
      // "24 May 1989",
      // Response
      // :
      // "True",
      // Runtime
      // :
      // "127 min",
      // Title
      // :
      // "Indiana Jones and the Last Crusade",
      // Type
      // :
      // "movie",
      // Website
      // :
      // "N/A",
      // Writer
      // :
      // "Jeffrey Boam, George Lucas, Menno Meyjes",
      // Year
      // :
      // "1989",
      // imdbID
      // :
      // "tt0097576",
      // imdbRating
      // :
      // "8.2",
      // imdbVotes
      // :
      // "801,550",
      //       }
    ],
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
        const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&plot=full&t=${encodeURIComponent(
          movieTitle
        )}`;

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            console.log("movie data", data);
            if (data.Response === "True") {
              this.allmovies.push(data);
              const imdbID = data.imdbID;

              const posterUrl = `https://www.imdb.com/title/${imdbID}/mediaindex`;
              const thumbnailUrl = `https://www.imdb.com/title/${imdbID}/mediaviewer/rm4272024321`;

              console.log("Poster URL:", posterUrl);
              console.log("Thumbnail URL:", thumbnailUrl);
            }
          })
          .catch((error) => {
            console.error("Error fetching movie data:", error);
          });
      }
    },
  },
});
