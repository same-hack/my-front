import { createRouter, createWebHistory } from "vue-router";

// 各ページをインポート（後で作ります）
import HomePage from "@/pages/HomePage.vue";
import PageA from "@/pages/PageA.vue";
import PageB from "@/pages/PageB.vue";
import PageC from "@/pages/PageC.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/a", name: "PageA", component: PageA },
  { path: "/b", name: "PageB", component: PageB },
  { path: "/c", name: "PageC", component: PageC },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
