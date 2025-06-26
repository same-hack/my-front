<!-- src/App.vue -->
<template>
  <v-app>
    <!-- 左メニュー -->
    <LeftMenu />

    <!-- シンプルラッパーで余白を確実に確保 -->
    <div class="main-wrapper">
      <router-view />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import LeftMenu from "@/components/LeftMenu.vue";
</script>

<style>
/* --------------------------------------------------
   LeftMenu の幅 40px を常に確保するラッパー
   -------------------------------------------------- */
.main-wrapper {
  margin-left: 40px; /* ← ここできっちりオフセット */
  width: calc(100vw - 40px);
  height: 100vh; /* ビューポート全高 */
  overflow: hidden; /* スクロールなし */
  display: flex;
  flex-direction: column; /* 縦に積む */
}

/* もし v-container などが余計なパディングを持っていたらリセット */
.main-wrapper .v-container {
  padding: 0;
  margin: 0;
}
</style>
