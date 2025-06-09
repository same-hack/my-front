// src/plugins/vuetify.ts
import "vuetify/styles"; // Vuetifyのスタイルを読み込み

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Vuetifyインスタンスを作成してエクスポート
export default createVuetify({
  components,
  directives,
});
