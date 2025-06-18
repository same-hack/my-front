// src/stores/auth.ts
// ✅ ユーザーのログイン状態や情報を管理するストア
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  // 🌟 状態定義
  state: () => ({
    isLoggedIn: false, // ユーザーがログイン済みか
    username: "", // ログイン中のユーザー名
    isAdmin: false, // 管理者フラグ
    redirectPath: "/", // 🔁 ログイン後のリダイレクト先を一時保存（初期はルート）
  }),

  // 🌟 ログイン/ログアウトなどの操作を定義
  actions: {
    // ログイン時の情報更新
    login(userData: { username: string; isAdmin: boolean }) {
      this.isLoggedIn = true;
      this.username = userData.username;
      this.isAdmin = userData.isAdmin;
    },
    // ログアウト処理
    logout() {
      this.isLoggedIn = false;
      this.username = "";
      this.isAdmin = false;
      this.redirectPath = "/"; // ログアウト時にリセット
    },
  },
});
