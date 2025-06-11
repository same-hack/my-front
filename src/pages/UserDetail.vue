<template>
  <v-container>
    <h1>ユーザ詳細</h1>

    <!-- 読み込み中表示 -->
    <v-alert v-if="loading" type="info">読み込み中...</v-alert>

    <!-- エラーがある場合 -->
    <v-alert v-else-if="error" type="error">エラー: {{ error }}</v-alert>

    <!-- データが正常に取得できた場合 -->
    <v-card v-else outlined>
      <v-card-title>{{ user.name }}</v-card-title>
      <v-card-subtitle>{{ user.email }}</v-card-subtitle>
      <v-card-text>
        <p>ユーザ名: {{ user.username }}</p>
        <p>電話番号: {{ user.phone }}</p>
        <p>Webサイト: {{ user.website }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

// User 型をインポート（型チェックに使用）
import type { User } from "@/stores/userStore";

// 現在のURL情報を取得（/users/:id の id を取得するため）
const route = useRoute();

// パラメータから ID を取得（例: /users/3 → id = "3"）
const id = route.params.id as string;

// データと状態管理用の変数
const user = ref<User | null>(null); // ユーザ情報
const loading = ref(true); // 読み込み中フラグ
const error = ref(""); // エラーメッセージ

// コンポーネントが表示されたタイミングでAPIリクエストを行う
onMounted(async () => {
  try {
    loading.value = true;

    // JSONPlaceholderのユーザ詳細APIを呼び出す
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );

    // 結果を user に格納
    user.value = response.data;
  } catch (err: any) {
    // エラーが発生した場合はエラーメッセージを表示
    error.value = err.message || "データの取得に失敗しました";
  } finally {
    // 読み込み完了
    loading.value = false;
  }
});
</script>
