// src/router/index.ts
// ✅ Vue Router 定義（全ページにログイン制限を追加）

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// 各ページコンポーネントをインポート
import HomePage from "@/pages/HomePage.vue";
import PageA from "@/pages/PageA.vue";
import PageB from "@/pages/PageB.vue";
import PageC from "@/pages/PageC.vue";
import UserList from "@/pages/UserList.vue";
import UserDetail from "@/pages/UserDetail.vue";
import FastApiUserList from "@/pages/FastApiUserList.vue";
import MyTableList from "@/pages/MyTableList.vue";
import UploadPage from "@/pages/UploadPage.vue";
import LoginPage from "@/pages/LoginPage.vue";

// ==========================
// ✅ ページ定義（ルート一覧）
// ==========================
const routes = [
  // ✅ 認証なしでアクセス可能なログインページ
  { path: "/login", name: "Login", component: LoginPage },

  // ✅ ここから下はすべて「認証が必要なページ」
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/a/:id",
    name: "PageA",
    component: PageA,
    meta: { requiresAuth: true },
  },
  { path: "/b", name: "PageB", component: PageB, meta: { requiresAuth: true } },
  { path: "/c", name: "PageC", component: PageC, meta: { requiresAuth: true } },
  {
    path: "/users",
    name: "UserList",
    component: UserList,
    meta: { requiresAuth: true },
  },
  {
    path: "/users/:id",
    name: "UserDetail",
    component: UserDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/fastapi-users",
    name: "FastApiUserList",
    component: FastApiUserList,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-table",
    name: "MyTableList",
    component: MyTableList,
    meta: { requiresAuth: true },
  },
  {
    path: "/upload",
    name: "UploadPage",
    component: UploadPage,
    meta: { requiresAuth: true },
  },
];

// ==========================
// ✅ Routerインスタンス作成
// ==========================
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ==========================
// ✅ 認証チェック（ナビゲーションガード）
// ==========================
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // 1. ログインページは誰でも通す
  if (!to.meta.requiresAuth) {
    return next();
  }

  // 2. 認証されていない場合 → login に飛ばす（このとき元のページを記録）
  if (!auth.isLoggedIn) {
    // ✅ 1回だけ保存する
    if (!auth.redirectPath || auth.redirectPath === "/") {
      auth.redirectPath = to.fullPath; // 👈 本当に行きたかったページを保存
    }
    return next({ name: "Login" });
  }

  // 3. 認証済 → 通す
  return next();
});

export default router;
