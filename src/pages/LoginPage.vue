<!-- src/pages/LoginPage.vue -->
<template>
  <v-container class="mt-10" max-width="400px">
    <h2 class="mb-4">ログイン</h2>

    <!-- ユーザー名 -->
    <v-text-field v-model="username" label="ユーザー名" required />

    <!-- パスワード -->
    <v-text-field
      v-model="password"
      label="パスワード"
      type="password"
      required
    />

    <!-- ログインボタン -->
    <v-btn color="primary" @click="login">ログイン</v-btn>

    <!-- エラーメッセージ -->
    <p v-if="errorMessage" class="text-red">{{ errorMessage }}</p>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const username = ref("");
const password = ref("");
const errorMessage = ref("");

// ログイン処理
const login = async () => {
  try {
    const response = await axios.post("/api/auth/login", {
      username: username.value,
      password: password.value,
    });

    alert(`ログイン成功！ようこそ ${response.data.username} さん`);
    errorMessage.value = "";
    // TODO: トークン保存や画面遷移など（将来対応）
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.detail || "ログインに失敗しました";
  }
};
</script>
