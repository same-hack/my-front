<template>
  <v-container>
    <h1>ユーザ一覧</h1>

    <!-- Storeのusersを使って一覧を表示 -->
    <v-list two-line>
      <v-list-item
        v-for="user in users"
        :key="user.id"
        :to="`/users/${user.id}`"
        link
      >
        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon>mdi-chevron-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";

// ユーザストアを初期化※これで初めてstoreが生成される
const userStore = useUserStore();

// Storeのstate.usersをcomputedでラップ※selectと同様
const users = computed(() => userStore.users);

// コンポーネントの初期表示時にデータ取得
onMounted(async () => {
  try {
    // ユーザ一覧を取得
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );

    // 取得したユーザデータを Store にセット
    // このデータは template 側では直接参照せず、Store経由で表示
    userStore.setUsers(response.data);
  } catch (error) {
    // エラーハンドリング
    console.error("ユーザ一覧の取得に失敗しました", error);
  }
});
</script>
