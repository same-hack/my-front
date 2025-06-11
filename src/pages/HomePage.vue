<!-- src/pages/HomePage.vue -->
<template>
  <v-container>
    <h1>ホーム</h1>

    <!-- 各ページへの遷移ボタン -->
    <v-btn color="primary" class="ma-2" :to="`/a/123`">Page A (ID:123)</v-btn>
    <v-btn color="success" class="ma-2" to="/b">Page B</v-btn>
    <v-btn color="info" class="ma-2" to="/c">Page C</v-btn>

    <!-- JSONPlaceholder ユーザ一覧 -->
    <v-btn color="secondary" class="ma-2" to="/users">User List</v-btn>

    <!-- FastAPI 連携ユーザ一覧 -->
    <v-btn color="indigo" class="ma-2" to="/fastapi-users"
      >FastAPI User List</v-btn
    >
  </v-container>
</template>

<script setup lang="ts">
// ロジックなし。ボタンでルート遷移するだけ。
</script>
