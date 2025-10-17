<template>
  <!-- ページ全体を包む -->
  <div class="page-wrapper" style="height: 100vh; position: relative">
    <v-container fluid class="pa-4">
      <!-- タイトル -->
      <v-row class="mb-2 justify-start align-start">
        <v-col cols="12">
          <h1 class="text-white">検索ページ</h1>
        </v-col>
      </v-row>

      <!-- 検索入力欄 -->
      <v-row class="mb-2 justify-start align-start">
        <v-col cols="12" md="6">
          <!-- 入力に連動するサジェスト表示メニュー -->
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :activator="activatorRef"
            offset-y
          >
            <!-- テキストフィールドをアクティベータに -->
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

            <!-- サジェストリスト（API結果） -->
            <v-list v-if="suggestions.length" elevation="4" class="bg-white">
              <v-list-item
                v-for="(item, i) in suggestions"
                :key="i"
                @click="selectSuggestion(item)"
              >
                <v-list-item-title class="text-body-1">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>

      <!-- 選択結果表示 -->
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
              <v-col cols="5" class="font-weight-medium text-subtitle-1">
                {{ selectedItem.title }}
              </v-col>
              <v-col cols="2">{{ selectedItem.author }}</v-col>
              <v-col cols="3">{{ selectedItem.admin }}</v-col>
              <v-col cols="2">{{ selectedItem.date }}</v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>

    <!-- CLOSEボタン -->
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

/* 検索キーワード */
const query = ref("");
/* サジェスト候補（API結果を格納） */
const suggestions = ref([]);
/* 選択されたアイテム */
const selectedItem = ref(null);
/* メニュー開閉制御 */
const menu = ref(false);
/* アクティベータ参照 */
const activatorRef = ref(null);

/**
 * 入力時イベント
 * → 入力があるたびにAPIへリクエストを送信（デバウンス推奨）
 */
const onInput = async () => {
  const q = query.value.trim();
  if (q === "") {
    suggestions.value = [];
    menu.value = false;
    return;
  }

  try {
    // ★ 実際のAPIに置き換える想定 ★
    // ここでは例としてGETパラメータにqを渡している
    const response = await fetch(
      `https://example.com/api/items?q=${encodeURIComponent(q)}`
    );

    if (!response.ok) throw new Error("APIエラー");

    // APIが返すJSONデータを取得
    const data = await response.json();

    // dataをサジェスト候補としてセット（構造に合わせて調整）
    suggestions.value = data.items || [];

    // 候補があればメニューを開く
    menu.value = suggestions.value.length > 0;
  } catch (error) {
    console.error("サジェスト取得エラー:", error);
    suggestions.value = [];
    menu.value = false;
  }
};

/**
 * 検索アイコン押下時
 * → 将来的に本検索APIなどに接続予定
 */
const onSearch = () => {
  console.log("検索実行:", query.value);
};

/**
 * 候補クリック時
 */
const selectSuggestion = (item) => {
  selectedItem.value = item;
  query.value = item.title;
  suggestions.value = [];
  menu.value = false;
};

/**
 * CLOSEボタン押下時
 * → 状態を初期化
 */
const onClose = () => {
  selectedItem.value = null;
  query.value = "";
  suggestions.value = [];
  menu.value = false;
};
</script>
