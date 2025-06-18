// src/stores/auth.ts
// ✅ 認証情報を管理する Pinia ストア

import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false, // ログイン済みフラグ
    username: "", // 現在のユーザー名
    isAdmin: false, // 管理者フラグ
    redirectPath: "/", // 未ログイン時の遷移先を保持
  }),
  actions: {
    login(payload: { username: string; isAdmin: boolean }) {
      // 🔐 ログイン成功時に呼び出す
      this.isLoggedIn = true;
      this.username = payload.username;
      this.isAdmin = payload.isAdmin;
    },
    logout() {
      // 🔓 ログアウト時に呼び出す
      this.isLoggedIn = false;
      this.username = "";
      this.isAdmin = false;
      this.redirectPath = "/";
    },
  },
});
