<template>
  <v-app>
    <v-main>
      <!-- Vuetifyのボタン（v-btn）にクリックイベントを追加 -->
      <v-container class="pa-4">
        <v-btn color="primary" @click="handleClick"> ボタンをクリック！ </v-btn>

        <!-- クリックした結果を表示 -->
        <p class="mt-4">{{ message }}</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Vue 3 の <script setup>構文で記述（TypeScript使用）

// message は表示用の文字列（リアクティブ変数）
import { ref } from "vue";
const message = ref("まだクリックされていません");

// ボタンがクリックされた時の処理
const handleClick = () => {
  message.value = "クリックされました！";
};
</script>

<style scoped>
/* 必要であればボタンやテキストのスタイルをここで調整 */
</style>
