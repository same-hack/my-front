<!-- components/LogoutButton.vue -->
<template>
  <v-btn color="error" @click="handleLogout">ログアウト</v-btn>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  // 🧹 認証情報をクリア（PiniaとlocalStorage）
  authStore.logout();

  // 🚪 ログアウト後はログインページへリダイレクト
  router.push("/login");
};
</script>
