// src/router/index.ts
// ✅ 全ページに認証ガードをかける

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// ページコンポーネント
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

const routes = [
  // ──────── 認証不要ルート ────────
  { path: "/login", name: "Login", component: LoginPage },

  // ──────── 認証必須ルート ────────
  {
    path: "/",
    name: "Home",
    component: HomePage,
    // meta: { requiresAuth: true },
  },
  {
    path: "/a/:id",
    name: "PageA",
    component: PageA,
    // meta: { requiresAuth: true },
  },
  { path: "/b", name: "PageB", component: PageB, meta: { requiresAuth: true } },
  { path: "/c", name: "PageC", component: PageC, meta: { requiresAuth: true } },
  {
    path: "/users",
    name: "UserList",
    component: UserList,
    // meta: { requiresAuth: true },
  },
  {
    path: "/users/:id",
    name: "UserDetail",
    component: UserDetail,
    props: true,
    // meta: { requiresAuth: true },
  },
  {
    path: "/fastapi-users",
    name: "FastApiUserList",
    component: FastApiUserList,
    // meta: { requiresAuth: true },
  },
  {
    path: "/my-table",
    name: "MyTableList",
    component: MyTableList,
    // meta: { requiresAuth: true },
  },
  {
    path: "/upload",
    name: "UploadPage",
    component: UploadPage,
    // meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // 1) 認証不要ページはそのまま
  if (!to.meta.requiresAuth) {
    return next();
  }

  // 2) 未ログインなら Login へリダイレクト
  if (!auth.isLoggedIn) {
    // 最初にアクセスしようとしていたパスを記憶
    if (!auth.redirectPath || auth.redirectPath === "/") {
      auth.redirectPath = to.fullPath;
    }
    return next({ name: "Login" });
  }

  // 3) ログイン済み → そのまま進む
  return next();
});

export default router;
