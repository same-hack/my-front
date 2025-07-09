// src/router/index.ts

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
import InfoPage from "@/pages/InfoPage.vue";
import LoginPage from "@/pages/LoginPage.vue";

// ✅ SamplePage ステップページ（遅延インポート）
const SampleStep1 = () => import("@/pages/SamplePage/Step1.vue");
const SampleStep2 = () => import("@/pages/SamplePage/Step2.vue");
const SampleStep3 = () => import("@/pages/SamplePage/Step3.vue");
const SampleStepper = () => import("@/pages/SamplePage/Main.vue");

const routes = [
  // ──────── 認証不要ルート ────────
  { path: "/login", name: "Login", component: LoginPage },

  // ──────── 認証必須ルート ────────
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/a/:id",
    name: "PageA",
    component: PageA,
  },
  {
    path: "/b",
    name: "PageB",
    component: PageB,
    // meta: { requiresAuth: true },
  },
  {
    path: "/c",
    name: "PageC",
    component: PageC,
    // meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "UserList",
    component: UserList,
  },
  {
    path: "/users/:id",
    name: "UserDetail",
    component: UserDetail,
    props: true,
  },
  {
    path: "/fastapi-users",
    name: "FastApiUserList",
    component: FastApiUserList,
  },
  {
    path: "/my-table",
    name: "MyTableList",
    component: MyTableList,
  },
  {
    path: "/upload",
    name: "UploadPage",
    component: UploadPage,
  },
  {
    path: "/info",
    name: "InfoPage",
    component: InfoPage,
  },

  // ✅ SamplePage ステップ個別ルーティング
  {
    path: "/sample/step1",
    name: "SampleStep1",
    component: SampleStep1,
    // meta: { requiresAuth: true },
  },
  {
    path: "/sample/step2",
    name: "SampleStep2",
    component: SampleStep2,
    // meta: { requiresAuth: true },
  },
  {
    path: "/sample/step3",
    name: "SampleStep3",
    component: SampleStep3,
    // meta: { requiresAuth: true },
  },

  // ✅ v-stepper版ルーティング（子ルートでステップURL切り替え対応）
  {
    path: "/sample/stepper",
    component: SampleStepper,
    // meta: { requiresAuth: true },
    children: [
      { path: "step1", name: "StepperStep1", component: SampleStep1 },
      { path: "step2", name: "StepperStep2", component: SampleStep2 },
      { path: "step3", name: "StepperStep3", component: SampleStep3 },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const auth = useAuthStore();

//   // 1) 認証不要ページはそのまま
//   if (!to.meta.requiresAuth) {
//     return next();
//   }

//   // 2) 未ログインなら Login へリダイレクト
//   if (!auth.isLoggedIn) {
//     if (!auth.redirectPath || auth.redirectPath === "/") {
//       auth.redirectPath = to.fullPath;
//     }
//     return next({ name: "Login" });
//   }

//   // 3) ログイン済み → そのまま進む
//   return next();
// });

export default router;
