import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";
import "@/assets/scss/layout-grid.scss"; // ここで共通CSSを読み込み
import "@/assets/scss/global.scss"; // ここで共通CSSを読み込み

const app = createApp(App);

// Piniaの作成＆登録
const pinia = createPinia();
app.use(pinia);

// ストアを取得してlocalStorageから状態復元を呼ぶ
const authStore = useAuthStore();
authStore.initializeFromLocalStorage();

app.use(router);
app.use(vuetify);

app.mount("#app");
