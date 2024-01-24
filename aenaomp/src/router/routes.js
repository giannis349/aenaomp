const routes = [
  {
    path: "/",
    component: () => import("layouts/FlatLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/movies",
    component: () => import("layouts/FlatLayout.vue"),
    children: [{ path: "", component: () => import("pages/MovePage.vue") }],
  },
  {
    path: "/chossenmovie",
    component: () => import("layouts/FlatLayout.vue"),
    children: [
      { path: ":id", component: () => import("pages/ChosenMovie.vue") },
    ],
  },
  {
    path: "/babylon",
    component: () => import("layouts/FlatLayout.vue"),
    children: [{ path: "", component: () => import("pages/BabylonPage.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
