import { createRouter, createWebHistory } from "vue-router";

// 各ページコンポーネントをインポート
import HomePage from "@/pages/HomePage.vue";
import PageA from "@/pages/PageA.vue";
import PageB from "@/pages/PageB.vue";
import PageC from "@/pages/PageC.vue";
import UserList from "@/pages/UserList.vue";
import UserDetail from "@/pages/UserDetail.vue";
import FastApiUserList from "@/pages/FastApiUserList.vue"; // ← FastAPI連携ページ
import MyTableList from "@/pages/MyTableList.vue"; // ← my_table 一覧ページ
import UploadPage from "@/pages/UploadPage.vue"; // ✅ アップロードページ（追加）
import LoginPage from "@/pages/LoginPage.vue";

// ルート定義（すべて統合済み）
const routes = [
  // ホーム画面
  { path: "/", name: "Home", component: HomePage },

  // パラメータ付きのページ（例: /a/1）
  { path: "/a/:id", name: "PageA", component: PageA },

  // 静的ページ
  { path: "/b", name: "PageB", component: PageB },
  { path: "/c", name: "PageC", component: PageC },

  // ユーザ一覧・詳細（jsonplaceholder用）
  { path: "/users", name: "UserList", component: UserList },
  {
    path: "/users/:id",
    name: "UserDetail",
    component: UserDetail,
    props: true,
  },

  // FastAPIと連携するユーザ一覧ページ
  {
    path: "/fastapi-users",
    name: "FastApiUserList",
    component: FastApiUserList,
  },

  // FastAPIと連携する my_table 一覧ページ
  {
    path: "/my-table",
    name: "MyTableList",
    component: MyTableList,
  },

  // ✅ ファイルアップロードページ（新規追加）
  {
    path: "/upload",
    name: "UploadPage",
    component: UploadPage,
  },

  { path: "/login", name: "Login", component: LoginPage },
];

// Vue Routerの作成
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
