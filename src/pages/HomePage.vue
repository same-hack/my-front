<template>
  <v-container>
    <h1>ホーム</h1>

    <!-- 各ページへの遷移ボタン -->
    <v-btn color="primary" class="ma-2" :to="`/a/123`">Page A (ID:123)</v-btn>
    <v-btn color="success" class="ma-2" to="/b">Page B</v-btn>
    <v-btn color="info" class="ma-2" to="/c">Page C</v-btn>

    <!-- ユーザ一覧ページへのリンク -->
    <v-btn color="secondary" class="ma-2" to="/users">User List</v-btn>
  </v-container>
</template>

<script setup lang="ts">
// 特にロジックなし。Vuetify + router-link で遷移ボタンだけ作成。
</script>
