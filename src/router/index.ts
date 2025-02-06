import { createRouter, createWebHistory } from "vue-router";
export const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/index.vue" as any),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("../views/settings/index.vue" as any),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/about/index.vue" as any),
  },
  {
    name: "translator",
    path: "/translator",
    component: () => import("../views/translator/index.vue" as any),
  },
  {
    name: "song-player",
    path: "/song-player",
    component: () => import("../views/song/player/index.vue" as any),
  },
  {
    name: "question",
    path: "/quiz",
    component: () => import("../views/question/index.vue" as any),
    children: [
      {
        path: "",
        component: () => import("../views/question/home.vue" as any),
      },
      {
        path: "answer",
        component: () => import("../views/question/answer.vue" as any),
      },
      {
        path: "result",
        component: () => import("../views/question/result.vue" as any),
      },
    ],
  },
  {
    name: "achievement",
    path: "/achievement",
    component: () => import("../views/achievement/index.vue" as any),
  },
  {
    name: "gacha-view",
    path: "/gacha/view",
    component: () => import("../views/gacha/view/index.vue" as any),
  },
  {
    name: "gacha-simulator",
    path: "/gacha/simulator",
    component: () => import("../views/gacha/simulator/index.vue" as any),
  },
  {
    name: "dictionary",
    path: "/dictionary",
    component: () => import("../views/dictionary/index.vue" as any),
  },
];

const router = createRouter({
  //@ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
