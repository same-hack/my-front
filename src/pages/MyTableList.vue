<!-- src/pages/MyTableList.vue -->
<template>
  <v-container>
    <h2>my_table 一覧</h2>

    <!-- エラー表示 -->
    <v-alert v-if="error" type="error">{{ error }}</v-alert>

    <!-- 一覧表示 -->
    <v-table>
      <thead>
        <tr>
          <th>RID</th>
          <th>Type</th>
          <th>State</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.rid">
          <td>{{ row.rid }}</td>
          <td>{{ row.type }}</td>
          <td>{{ row.state }}</td>
          <td>{{ row.datetime_update }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import axios from "axios";

  const rows = ref<
    { rid: number; type: number; state: number; datetime_update: string }[]
  >([]);
  const error = ref("");

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/my_table"); // ✅ プロキシによりFastAPIへ転送
      rows.value = res.data;
    } catch (err) {
      console.error(err);
      error.value = "データの取得に失敗しました";
    }
  };

  onMounted(() => {
    fetchData();
  });
</script>
