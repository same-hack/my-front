<template>
  <div class="page-wrapper" style="height: 100vh; position: relative">
    <v-container fluid class="pa-4">
      <!-- タイトル -->
      <v-row class="mb-2 justify-start align-start">
        <v-col cols="12">
          <h1 class="text-white">検索ページ</h1>
        </v-col>
      </v-row>

      <!-- 検索欄 -->
      <v-row class="mb-2 justify-start align-start">
        <v-col cols="12" md="6">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :activator="activatorRef"
            offset-y
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="query"
                variant="underlined"
                density="comfortable"
                placeholder="検索キーワードを入力"
                append-inner-icon="mdi-magnify"
                @click:append-inner="onSearch"
                @input="onInput"
                v-bind="props"
                class="text-white"
              />
            </template>

            <v-list v-if="suggestions.length" elevation="4" class="bg-white">
              <v-list-item
                v-for="(item, i) in suggestions"
                :key="i"
                @click="selectSuggestion(item)"
              >
                <v-list-item-title class="text-body-1">{{
                  item.title
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>

      <!-- 検索結果 -->
      <v-row
        v-if="selectedItem"
        class="overflow-auto justify-start align-start"
      >
        <v-col cols="12">
          <v-container fluid class="pa-0">
            <v-row
              class="grey--text text--darken-1 text-caption mb-1 justify-start align-start"
            >
              <v-col cols="5">タイトル</v-col>
              <v-col cols="2">作成者</v-col>
              <v-col cols="3">管理者</v-col>
              <v-col cols="2">日付</v-col>
            </v-row>

            <v-row class="mb-1 justify-start align-start">
              <v-col cols="5" class="font-weight-medium text-subtitle-1">{{
                selectedItem.title
              }}</v-col>
              <v-col cols="2">{{ selectedItem.author }}</v-col>
              <v-col cols="3">{{ selectedItem.admin }}</v-col>
              <v-col cols="2">{{ selectedItem.date }}</v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>

    <!-- CLOSEボタン（ラッパー div に対して右下固定） -->
    <v-btn
      color="red darken-1"
      dark
      style="position: absolute; bottom: 16px; right: 16px"
      @click="onClose"
    >
      CLOSE
    </v-btn>
  </div>
</template>

<script setup>
import { ref } from "vue";

const items = [
  {
    title: "りんごプロジェクト",
    author: "田中",
    admin: "佐藤",
    date: "2025-10-16",
  },
  { title: "バナナ企画", author: "鈴木", admin: "高橋", date: "2025-09-30" },
  {
    title: "さくらんぼ研究",
    author: "佐々木",
    admin: "伊藤",
    date: "2025-08-20",
  },
  { title: "マンゴー計画", author: "中村", admin: "山本", date: "2025-07-15" },
  {
    title: "ぶどうプロジェクト",
    author: "小林",
    admin: "渡辺",
    date: "2025-06-10",
  },
];

const query = ref("");
const suggestions = ref([]);
const selectedItem = ref(null);
const menu = ref(false);
const activatorRef = ref(null);

const onInput = () => {
  const q = query.value.trim();
  suggestions.value =
    q === "" ? [] : items.filter((item) => item.title.includes(q));
  menu.value = suggestions.value.length > 0;
};

const onSearch = () => {
  console.log("検索実行:", query.value);
};

const selectSuggestion = (item) => {
  selectedItem.value = item;
  query.value = item.title;
  suggestions.value = [];
  menu.value = false;
};

const onClose = () => {
  selectedItem.value = null;
  query.value = "";
  suggestions.value = [];
  menu.value = false;
};
</script>
