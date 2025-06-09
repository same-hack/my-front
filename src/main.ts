// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";

// 先ほど作ったVuetifyの設定をインポート
import vuetify from "./plugins/vuetify";

const app = createApp(App);

// VuetifyをVueにプラグインとしてセットアップ
app.use(vuetify);

app.mount("#app");
