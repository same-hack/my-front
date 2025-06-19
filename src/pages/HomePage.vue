<!-- src/pages/HomePage.vue -->
<template>
  <!-- 🧭 アプリバー（ヘッダ） -->
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>ホーム</v-toolbar-title>

    <!-- 🔓 右端のログアウトボタン -->
    <v-spacer />
    <BtnLogout />
  </v-app-bar>

  <!-- 📦 メインコンテンツ -->
  <v-container class="mt-6">
    <h1>ホーム</h1>

    <!-- 各ページへの遷移ボタン -->
    <v-btn color="primary" class="ma-2" :to="`/a/123`">Page A (ID:123)</v-btn>
    <v-btn color="success" class="ma-2" to="/b">Page B</v-btn>
    <v-btn color="info" class="ma-2" to="/c">Page C</v-btn>

    <!-- JSONPlaceholder ユーザ一覧 -->
    <v-btn color="secondary" class="ma-2" to="/users">User List</v-btn>

    <!-- FastAPI 連携ユーザ一覧 -->
    <v-btn color="indigo" class="ma-2" to="/fastapi-users">
      FastAPI User List
    </v-btn>

    <!-- ✅ FastAPI 連携 my_table 一覧ページ -->
    <v-btn color="teal darken-2" class="ma-2" to="/my-table">
      My Table List
    </v-btn>

    <v-btn color="deep-purple accent-4" class="ma-2" to="/upload">
      📁 ファイルアップロード
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import BtnLogout from "@/components/BtnLogout.vue";
</script>
