<template>
  <v-container>
    <h1>Page A</h1>

    <!-- ローディング中 -->
    <v-alert v-if="loading" type="info">読み込み中...</v-alert>

    <!-- エラーがあれば表示 -->
    <v-alert v-else-if="error" type="error">エラー: {{ error }}</v-alert>

    <!-- データ表示 -->
    <v-alert v-else type="success">
      ID: {{ id }} のデータ → {{ data }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

// URLからパラメータ（例: /a/123）を取得
const route = useRoute();
const id = route.params.id;

// データ表示用の変数
const data = ref("");
const loading = ref(true);
const error = ref("");

// ページ表示時に1度だけAPI呼び出し
onMounted(async () => {
  try {
    console.log("id", id);
    // API呼び出し（例: JSONPlaceholderを使用）
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/10`
    );

    console.log("response", response);
    // 結果を保存
    data.value = response.data.title;
  } catch (e: any) {
    // エラー処理（メッセージ保存）
    error.value = e.message || "データ取得に失敗しました";
  } finally {
    // ローディング状態を解除
    loading.value = false;
  }
});
</script>

jsonplaceholderを使ってサンプルを作りたい データを取得しPiniaで保管
保管したデータをselectし、画面に表示
