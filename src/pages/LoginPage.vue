<template>
  <v-container
    fluid
    class="d-flex align-center justify-center"
    style="height: 100vh"
  >
    <v-card width="20rem" class="pa-6">
      <v-stack dense>
        <!-- ページタイトル -->
        <h1 class="text-h5 text-center mb-4">ログインページ</h1>

        <!-- ユーザー名入力 -->
        <v-text-field
          v-model="username"
          label="ユーザー名"
          outlined
          density="comfortable"
        />

        <!-- パスワード入力 -->
        <v-text-field
          v-model="password"
          label="パスワード"
          type="password"
          outlined
          density="comfortable"
        />

        <!-- ログインボタン -->
        <v-btn color="primary" block class="mt-4" @click="login">
          ログイン
        </v-btn>

        <!-- エラーがある場合に表示 -->
        <p v-if="errorMessage" class="error mt-2">
          {{ errorMessage }}
        </p>
      </v-stack>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// フォームモデル
const username = ref("");
const password = ref("");
const errorMessage = ref("");

// ルーターと認証ストア
const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  errorMessage.value = ""; // リセット
  try {
    const res = await axios.post("/api/auth/login", {
      username: username.value,
      password: password.value,
    });

    // レスポンスからトークン等を取得
    const { access_token, username: resUsername, is_admin, rid } = res.data;

    // ストアに保存
    authStore.login({
      token: access_token,
      username: resUsername,
      isAdmin: is_admin,
      rid,
    });

    // リダイレクト先へ
    const dest = authStore.redirectPath || "/";
    authStore.redirectPath = "/";
    await router.push(dest);
  } catch (err: any) {
    errorMessage.value =
      err.response?.data?.detail ||
      "ログインに失敗しました。ユーザー名・パスワードをご確認ください。";
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.875rem;
}
</style>
