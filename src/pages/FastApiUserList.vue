<template>
  <v-container>
    <h2>FastAPI CRUD操作デモ</h2>

    <!-- 新規ユーザー追加 -->
    <v-text-field v-model="newName" label="新しいユーザー名を入力" />
    <v-btn color="primary" class="ma-2" @click="addUser">ユーザー追加</v-btn>

    <!-- エラー表示 -->
    <v-alert v-if="error" type="error">{{ error }}</v-alert>

    <!-- ユーザー一覧 -->
    <v-list two-line>
      <v-list-item v-for="user in users" :key="user.id">
        <!-- 編集モード時 -->
        <template v-if="editingId === user.id">
          <v-text-field v-model="editName" label="名前を編集" />
        </template>
        <template v-else>
          <!-- Vuetify 3 では v-list-item-title/subtitle を直接書ける -->
          <v-list-item-title>{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle>ID: {{ user.id }}</v-list-item-subtitle>
        </template>

        <!-- アクションボタン -->
        <template #append>
          <v-btn icon @click="startEdit(user)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn icon @click="deleteUser(user.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>

          <v-btn icon v-if="editingId === user.id" @click="updateUser(user.id)">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { dialogService } from "@/services/dialogService"; // ✅ ダイアログ共通サービス

// APIエンドポイント（環境に応じて変更可）
const BASE_URL = "http://127.0.0.1:8000/api/users";

// 各種リアクティブ状態
const users = ref<{ id: number; name: string }[]>([]);
const newName = ref("");
const editingId = ref<number | null>(null);
const editName = ref("");
const error = ref("");

// ユーザー一覧取得
const fetchUsers = async () => {
  try {
    const res = await axios.get(BASE_URL);
    users.value = res.data;
    error.value = "";
  } catch (err) {
    error.value = "ユーザー一覧の取得に失敗しました";
    console.error(err);
  }
};

// ユーザー追加
const addUser = async () => {
  if (!newName.value) return;
  try {
    await axios.post(BASE_URL, { name: newName.value });
    newName.value = "";
    await fetchUsers();
  } catch (err) {
    error.value = "ユーザー追加に失敗しました";
    console.error(err);
  }
};

// 編集開始
const startEdit = (user: { id: number; name: string }) => {
  editingId.value = user.id;
  editName.value = user.name;
};

// ユーザー更新
const updateUser = async (id: number) => {
  try {
    await axios.put(`${BASE_URL}/${id}`, { name: editName.value });
    editingId.value = null;
    await fetchUsers();
  } catch (err) {
    error.value = "更新に失敗しました";
    console.error(err);
  }
};

// ユーザー削除（確認ダイアログあり）
const deleteUser = async (id: number) => {
  const ok = await dialogService.confirm({
    title: "削除確認",
    message: "このユーザーを本当に削除しますか？",
  });
  if (!ok) return;

  try {
    await axios.delete(`${BASE_URL}/${id}`);
    await fetchUsers();
  } catch (err) {
    error.value = "削除に失敗しました";
    console.error(err);
  }
};

// 初期表示処理
onMounted(() => {
  fetchUsers();
});
</script>
