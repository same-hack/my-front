<template>
  <v-app>
    <!-- メイン -->
    <v-main>
      <v-container class="mt-6">
        <h1 class="text-h5 mb-4">ホーム</h1>

        <v-btn color="primary" class="ma-2" :to="`/a/123`">Page A</v-btn>
        <v-btn color="success" class="ma-2" to="/b">Page B</v-btn>
        <v-btn color="info" class="ma-2" to="/c">Page C</v-btn>
        <v-btn color="info" class="ma-2" to="/d">Page D</v-btn>
        <v-btn color="info" class="ma-2" to="/e">Page E</v-btn>
        <v-btn color="secondary" class="ma-2" to="/users">User List</v-btn>
        <v-btn color="indigo" class="ma-2" to="/fastapi-users"
          >FastAPI User</v-btn
        >
        <v-btn color="teal darken-2" class="ma-2" to="/my-table"
          >My Table</v-btn
        >
        <v-btn color="deep-purple accent-4" class="ma-2" to="/upload"
          >📁 アップロード</v-btn
        >
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import BtnLogout from "@/components/BtnLogout.vue";
import LeftMenu from "@/components/LeftMenu.vue";
</script>
