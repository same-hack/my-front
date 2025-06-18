<!-- src/pages/LoginPage.vue -->
<template>
  <v-container>
    <h1>ログインページ</h1>

    <!-- ユーザー名入力 -->
    <v-text-field label="ユーザー名" v-model="username" />

    <!-- パスワード入力 -->
    <v-text-field label="パスワード" v-model="password" type="password" />

    <!-- ログインボタン -->
    <v-btn color="primary" @click="login">ログイン</v-btn>

    <!-- エラーがある場合に表示 -->
    <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  try {
    // ──── 実際の DB 認証エンドポイントを叩く ────
    // 🔐 APIに認証リクエストを送信
    const res = await axios.post("/api/auth/login", {
      username: username.value,
      password: password.value,
    });

    // ──── 認証成功 ────
    authStore.login({
      username: res.data.username,
      isAdmin: res.data.is_admin,
    });

    // ──── 元のパス or ルートにリダイレクト ────
    const dest = authStore.redirectPath || "/";
    authStore.redirectPath = "/";
    router.push(dest);
  } catch (err: any) {
    // ──── 認証失敗 ────
    errorMessage.value = err.response?.data?.detail || "ログインに失敗しました";
  }
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
