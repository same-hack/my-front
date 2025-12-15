<template>
  <v-app>
    <v-main>
      <v-container>
        <h3>共同作業者</h3>

        <v-select
          v-model="rid_users"
          :items="all_users"
          item-title="display_name"
          item-value="rid"
          multiple
          chips
          label="共同作業者"
          width="500"
        >
          <!-- chips=true の場合は chip スロット -->
          <template #chip="{ item }">
            <v-chip>
              {{ getUserName(item.value) }}
            </v-chip>
          </template>
        </v-select>

        <v-divider class="my-6" />

        <h4>POSTされる値（rid）</h4>
        <pre>{{ rid_users }}</pre>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";

/* -----------------------------
 * 型
 * ----------------------------- */
type User = {
  rid: number;
  display_name: string;
};

/* -----------------------------
 * ログイン中ユーザ
 * ----------------------------- */
const loginUserRid = 1;

/* -----------------------------
 * 全ユーザ（※ログイン中ユーザは除外済み）
 * ----------------------------- */
const all_users: User[] = [
  { rid: 2, display_name: "Bob" },
  { rid: 3, display_name: "Carol" },
  { rid: 4, display_name: "Dave" },
];

/* -----------------------------
 * 選択状態（rid のみ）
 * ----------------------------- */
const rid_users = ref<number[]>([
  loginUserRid, // 初期選択
]);

/* -----------------------------
 * rid → 表示名
 * ----------------------------- */
const all_users_with_login: User[] = [
  { rid: 1, display_name: "Alice" },
  ...all_users,
];

function getUserName(rid: number): string {
  return (
    all_users_with_login.find((u) => u.rid === rid)?.display_name ?? String(rid)
  );
}
</script>
