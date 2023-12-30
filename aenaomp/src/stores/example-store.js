import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0,
    allmovies: [
      {
        id: 1,
        title: 'Indiana Jones and the Dial of Destiny',
        description: 'Experience the return of legendary hero, Indiana Jones, in the fifth installment of this beloved swashbuckling series of films. Finding himself in a new era, approaching retirement, Indy wrestles with fitting into a world that seems to have outgrown him. But as the tentacles of an all-too-familiar evil return in the form of an old rival, Indy must don his hat and pick up his whip once more to make sure an ancient and powerful artifact doesn\'t fall into the wrong hands.',
        poster: 'https://pbs.twimg.com/media/FxbxEb9aEAAqpOS?format=jpg&name=large'
      },
      {
        id: 2,
        title: ' Indiana Jones and the Last Crusade',
        description: 'An art collector appeals to Indiana Jones to embark on a search for the Holy Grail. He learns that another archaeologist has disappeared while searching for the precious goblet, and the missing man is his own father, Dr. Henry Jones. The artifact is much harder to find than they expected, and its powers are too much for those impure of heart',
        poster: 'https://i.ebayimg.com/images/g/aE8AAOSwrx1juLT-/s-l1600.jpg'
      },
    ]
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});
