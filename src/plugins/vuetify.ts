// 1. Vuetifyのスタイル（CSS）を読み込む（Vuetify 3に必須）
import "vuetify/styles";

// 2. Vuetify本体と、全てのコンポーネント／ディレクティブを読み込む
import { createVuetify } from "vuetify";
import * as components from "vuetify/components"; // 例: v-btn, v-card, v-dialog など
import * as directives from "vuetify/directives"; // 例: v-ripple, v-show など

// 3. Material Design Icons（MDI）を使うための設定
import { aliases, mdi } from "vuetify/iconsets/mdi"; // mdi = アイコンセット、aliases = アイコン名の省略形

// 4. MDIのCSSを読み込む（これがないと mdi-icon が表示されない）
import "@mdi/font/css/materialdesignicons.css";

// 5. createVuetifyでVuetifyインスタンスを生成し、アイコン設定を追加
export default createVuetify({
  components, // 全コンポーネントを使えるようにする
  directives, // 全ディレクティブを使えるようにする
  icons: {
    defaultSet: "mdi", // デフォルトのアイコンセットをmdi（Material Design Icons）に指定
    aliases, // エイリアス（例: mdi-close → close など）を有効化
    sets: {
      mdi, // mdiセットを登録
    },
  },
});
