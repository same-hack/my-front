<!-- src/pages/LoginPage.vue -->
<template>
  <v-container>
    <h1>ログインページ</h1>

    <!-- ユーザー名とパスワードの入力欄 -->
    <v-text-field label="ユーザー名" v-model="username" />
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

// ✅ 入力欄とメッセージ用の状態
const username = ref("");
const password = ref("");
const errorMessage = ref("");

const router = useRouter();
const authStore = useAuthStore();

// ✅ ログイン処理
const login = async () => {
  try {
    // 🔐 APIに認証リクエストを送信
    const response = await axios.post("/api/auth/login", {
      username: username.value,
      password: password.value,
    });

    // ✅ ログイン成功 → ストアに保存
    authStore.login({
      username: response.data.username,
      isAdmin: response.data.is_admin,
    });

    // ✅ 保存されていたリダイレクト先に遷移（なければ /）
    router.push(authStore.redirectPath || "/");
  } catch (error: any) {
    // ❌ ログイン失敗時のエラーメッセージ
    errorMessage.value =
      error.response?.data?.detail || "ログインに失敗しました";
  }
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
