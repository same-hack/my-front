<template>
  <v-navigation-drawer
    app
    permanent
    width="40"
    color="nav"
    elevation="2"
    class="left-nav"
  >
    <!-- 上部メニュー -->
    <v-list nav dense class="pt-2">
      <v-list-item
        v-for="item in topMenuItems"
        :key="item.title"
        :to="item.to"
        link
        active-class="no-bg"
        class="nav-item"
      >
        <v-icon size="24" color="white">{{ item.icon }}</v-icon>
      </v-list-item>
    </v-list>

    <!-- スペーサー -->
    <div class="flex-spacer"></div>

    <!-- 設定アイコン（画面下部固定＋ポップアップ） -->
    <div class="bottom-list-container">
      <v-menu
        v-model="settingsMenu"
        offset-y
        bottom
        transition="scale-transition"
      >
        <template #activator="{ props }">
          <div v-bind="props" class="nav-item activator-wrapper">
            <v-icon size="24" color="white">mdi-cog</v-icon>
          </div>
        </template>

        <v-list dense>
          <v-list-item link @click="handleLogout">
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

// Pinia store
const authStore = useAuthStore();

// 上部メニューアイテム
const topMenuItems = [
  { title: "ホーム", icon: "mdi-home", to: "/" },
  { title: "アップロード", icon: "mdi-upload", to: "/upload" },
  { title: "ユーザー", icon: "mdi-account-group", to: "/users" },
  { title: "ヘルプ", icon: "mdi-help-circle", to: "/help" },
];

// 設定メニューの開閉状態
const settingsMenu = ref(false);

// ログアウト処理
function handleLogout() {
  authStore.logout();
  settingsMenu.value = false;
}
</script>

<style>
/* Drawer の内容を縦方向に flex 配置 */
.left-nav .v-navigation-drawer__content {
  display: flex !important;
  flex-direction: column !important;
  height: 100vh !important;
  padding: 0 !important;
}

/* スペーサー */
.flex-spacer {
  flex-grow: 1;
}

/* アイテム中央配置 */
.nav-item {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  min-height: 48px !important;
  width: 100% !important;
  padding: 0 !important;
}

/* Activator用ラッパー: 横中央 */
.activator-wrapper {
  margin: 0 auto;
}

/* 下部コンテナ余白 */
.bottom-list-container {
  padding-bottom: 16px;
}

/* アクティブ背景を削除 */
.v-list-item.no-bg {
  background-color: transparent !important;
}
.v-list-item.no-bg:hover {
  background-color: transparent !important;
}
</style>
