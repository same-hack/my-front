// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";

import vuetify from "./plugins/vuetify";
import router from "./router"; // ← ここが必要

const app = createApp(App);

app.use(vuetify);
app.use(router); // ← ここも必要

app.mount("#app");
