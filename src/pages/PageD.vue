<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-select
          v-model="selected"
          :items="items"
          item-title="name"
          multiple
          chips
          return-object
          label="ユーザーを選択"
          :loading="loading"
          :disabled="loading"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <v-card class="pa-3">
      <div><strong>選択されたユーザー:</strong></div>
      <pre>{{ selected }}</pre>
    </v-card>
  </v-container>
</template>

<script setup>
/*
  仕様:
  - admin は別エンドポイントから axios で取得
  - users は別エンドポイントから axios で取得
  - admin を先頭に表示する（users に admin と同じデータが含まれていても重複 OK）
  - map 処理は行わない（response.data をそのまま使う）
  - v-model にはオブジェクトを返す (return-object)
*/

import { ref, onMounted } from "vue";
import axios from "axios";

const items = ref([]); // v-select に渡す配列（admin を先頭に配置）
const selected = ref([]); // v-model
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  error.value = null;

  try {
    // ここでは JSONPlaceholder を例として使用
    // admin を /users/1 など別エンドポイントから取得
    // users を /users から取得
    const adminRequest = axios.get(
      "https://jsonplaceholder.typicode.com/users/1"
    );
    const usersRequest = axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );

    // 並列で取得
    const [resAdmin, resUsers] = await Promise.all([
      adminRequest,
      usersRequest,
    ]);

    const adminData = resAdmin.data; // map 処理しない：そのまま使う
    const usersData = resUsers.data; // そのまま使う

    // items は admin を先頭に、その後に users（重複を許容）
    items.value = [adminData, ...usersData];

    // 初期選択に admin を含める
    selected.value = [adminData];
  } catch (e) {
    console.error("データ取得エラー", e);
    error.value = e;
  } finally {
    loading.value = false;
  }
});
</script>
