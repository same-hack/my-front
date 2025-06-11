// src/router/index.ts

import { createRouter, createWebHistory } from "vue-router";

// 各ページコンポーネントをインポート
import HomePage from "@/pages/HomePage.vue";
import PageA from "@/pages/PageA.vue";
import PageB from "@/pages/PageB.vue";
import PageC from "@/pages/PageC.vue";
import UserList from "@/pages/UserList.vue";
import UserDetail from "@/pages/UserDetail.vue";

// ルート定義（これまでの構成をすべて統合）
const routes = [
  // ホーム画面
  { path: "/", name: "Home", component: HomePage },

  // パラメータ付きのページ
  { path: "/a/:id", name: "PageA", component: PageA },

  // その他静的ページ
  { path: "/b", name: "PageB", component: PageB },
  { path: "/c", name: "PageC", component: PageC },

  // ユーザ一覧・詳細ページ
  { path: "/users", name: "UserList", component: UserList },
  {
    path: "/users/:id",
    name: "UserDetail",
    component: UserDetail,
    props: true,
  },
];

// Vue Routerの作成
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
