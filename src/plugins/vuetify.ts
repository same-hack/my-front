// src/plugins/vuetify.ts
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          background: "#202123", // ChatGPT の画面背景に近い濃いグレー
          surface: "#343541", // モーダルやカードの背景
          primary: "#10A37F", // ChatGPT 緑
          secondary: "#2F3136", // サイドバーやヘッダーのやや暗いグレー
          nav: "#2F3136", // ← LeftMenu 用に同じ secondary を使う
          info: "#58B9A9",
          success: "#3AA655",
          warning: "#F9A825",
          error: "#E03E3E",
        },
      },
      light: {
        dark: false,
        colors: {
          background: "#FFFFFF",
          surface: "#F2F2F2",
          primary: "#10A37F",
          secondary: "#CCCCCC",
          info: "#58B9A9",
          success: "#3AA655",
          warning: "#F9A825",
          error: "#E03E3E",
        },
      },
    },
  },
});
