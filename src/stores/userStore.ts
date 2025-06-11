// src/stores/userStore.ts

// defineStore: Piniaのストアを定義する関数
import { defineStore } from "pinia";

// TypeScript用：ユーザ情報の型定義
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

// ストア定義（'user' はこのストアの一意なキー）
export const useUserStore = defineStore("user", {
  // 状態（state）を定義
  state: () => ({
    // ユーザ情報の配列（初期値は空）
    users: [] as User[],
  }),

  // 状態を更新する関数（副作用なし。状態の操作だけ）
  actions: {
    // 画面側から渡されたユーザ配列を保持する
    setUsers(users: User[]) {
      this.users = users;
    },
  },
});
