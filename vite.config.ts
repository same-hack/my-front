// Node.jsのURL関連の機能をインポート
// これにより、パスの変換などが便利にできるようになります
import { fileURLToPath, URL } from "node:url";

// Viteの設定を定義するための関数をインポート
// defineConfig() を使うことで型補完などが効くようになります
import { defineConfig } from "vite";

// Vue用のViteプラグインをインポート
// これがあることで Vueファイル（.vue）が使えるようになります
import vue from "@vitejs/plugin-vue";

// Viteの設定ファイル（vite.config.ts）をエクスポート
// defineConfigで囲むことで、Viteが型情報などを正しく認識してくれます
export default defineConfig({
  // プラグインを設定
  // Vueを使うために、vueプラグインをここに追加します
  plugins: [vue()],

  // モジュールのパス解決設定
  resolve: {
    alias: {
      // 「@」という記号を「src」フォルダに置き換えられるようにする設定
      // 例: "@/components/Hello.vue" → "src/components/Hello.vue"
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
