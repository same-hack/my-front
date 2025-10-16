<template>
  <v-container fluid class="page-container d-flex flex-column">
    <v-row class="title-row mb-2">
      <v-col cols="12">
        <h1>検索ページ</h1>
      </v-col>
    </v-row>

    <v-row class="search-row mb-2">
      <v-col cols="12" md="6">
        <div class="search-container">
          <v-text-field
            v-model="query"
            variant="underlined"
            density="comfortable"
            placeholder="検索キーワードを入力"
            append-inner-icon="mdi-magnify"
            @click:append-inner="onSearch"
            @input="onInput"
            hide-details="auto"
            class="white-text-field"
          ></v-text-field>

          <v-list v-if="suggestions.length" class="suggest-list" elevation="4">
            <v-list-item
              v-for="(item, i) in suggestions"
              :key="i"
              @click="selectSuggestion(item)"
              class="suggest-item"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
    </v-row>

    <v-row class="result-row" v-if="selectedItem">
      <v-col cols="12">
        <v-container fluid>
          <v-row class="result-header mb-1">
            <v-col cols="5">タイトル</v-col>
            <v-col cols="2">作成者</v-col>
            <v-col cols="3">管理者</v-col>
            <v-col cols="2">日付</v-col>
          </v-row>

          <v-row class="result-data mb-1">
            <v-col cols="5" class="data-title">{{ selectedItem.title }}</v-col>
            <v-col cols="2">{{ selectedItem.author }}</v-col>
            <v-col cols="3">{{ selectedItem.admin }}</v-col>
            <v-col cols="2">{{ selectedItem.date }}</v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-btn class="close-btn" color="red darken-1" dark @click="onClose">
      CLOSE
    </v-btn>
  </v-container>
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

const onInput = () => {
  const q = query.value.trim();
  suggestions.value =
    q === "" ? [] : items.filter((item) => item.title.includes(q));
};

const onSearch = () => {
  console.log("検索実行:", query.value);
};

const selectSuggestion = (item) => {
  selectedItem.value = item;
  query.value = item.title;
  suggestions.value = [];
};

const onClose = () => {
  selectedItem.value = null;
  query.value = "";
  suggestions.value = [];
};
</script>

<style scoped>
.page-container {
  height: 100vh;
  position: relative;
  padding: 20px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.title-row {
  flex: 0 0 auto;
  margin-bottom: 4px;
}

.search-row {
  flex: 0 0 auto;
  margin-bottom: 4px;
}

.search-container {
  position: relative;
  max-width: 600px;
}

/* 文字・下線を常に白にする */
.white-text-field .v-input__control {
  color: white;
}
.white-text-field .v-field__outline::before,
.white-text-field .v-field__underline {
  border-color: white !important;
}
.white-text-field input {
  color: white !important;
}

/* サジェストリスト */
.suggest-list {
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  z-index: 10;
  cursor: pointer;
  color: black;
  background-color: white;
}

.suggest-item {
  cursor: pointer;
}

.result-row {
  flex: 1 1 auto;
  overflow: auto;
}

.result-header {
  font-size: 0.8rem;
  color: #777;
  margin-top: 0;
  margin-bottom: 2px;
}

.data-title {
  font-size: 1.3rem;
  font-weight: 500;
}

.result-data {
  margin-top: 0;
  margin-bottom: 4px;
}

.close-btn {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
</style>
