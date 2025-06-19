import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    username: "",
    isAdmin: false,
    accessToken: "", // トークン追加
    redirectPath: "/",
  }),
  actions: {
    login(payload: {
      username: string;
      isAdmin: boolean;
      accessToken: string;
    }) {
      // ログイン成功時に状態を更新しlocalStorageにも保存
      this.isLoggedIn = true;
      this.username = payload.username;
      this.isAdmin = payload.isAdmin;
      this.accessToken = payload.accessToken;

      localStorage.setItem("accessToken", payload.accessToken);
      localStorage.setItem("username", payload.username);
      localStorage.setItem("isAdmin", payload.isAdmin ? "true" : "false");
    },
    logout() {
      // ログアウト時に状態クリア＆localStorageも削除
      this.isLoggedIn = false;
      this.username = "";
      this.isAdmin = false;
      this.accessToken = "";
      this.redirectPath = "/";

      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      localStorage.removeItem("isAdmin");
    },
    // アプリ起動時にlocalStorageから状態を復元
    initializeFromLocalStorage() {
      const token = localStorage.getItem("accessToken");
      if (token) {
        this.accessToken = token;
        this.isLoggedIn = true;
        this.username = localStorage.getItem("username") || "";
        this.isAdmin = localStorage.getItem("isAdmin") === "true";
      }
    },
  },
});
