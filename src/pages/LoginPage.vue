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
    // 🔐 APIに認証リクエストを送信（JWTトークンを取得）
    const res = await axios.post("/api/auth/login", {
      username: username.value,
      password: password.value,
    });

    // ✅ レスポンスから必要な情報を抽出
    const { access_token, username: resUsername, is_admin, rid } = res.data;

    // ✅ ストアにログイン情報とトークンを保存
    authStore.login({
      token: access_token, // JWTアクセストークン
      username: resUsername, // ユーザー名
      isAdmin: is_admin, // 管理者フラグ
      rid, // ユーザーIDなど
    });

    // 🚪 元の遷移先へリダイレクト（なければルートへ）
    const dest = authStore.redirectPath || "/";
    authStore.redirectPath = "/";
    router.push(dest);
  } catch (err: any) {
    // ❌ 認証失敗時はエラーメッセージを表示
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
