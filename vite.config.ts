// Node.js の URL 関連機能をインポート
// パスの変換などで使用
import { fileURLToPath, URL } from "node:url";

// Vite の設定を型補完付きで記述できるようにする関数
import { defineConfig } from "vite";

// Vue 用の Vite プラグイン
// .vue ファイルを正しく扱えるようにする
import vue from "@vitejs/plugin-vue";

// Vite 設定をエクスポート（defineConfig でラップすると型補完などが有効になる）
export default defineConfig({
  // 使用するプラグイン（ここでは Vue プラグインのみ）
  plugins: [vue()],

  // モジュール解決のエイリアス設定
  resolve: {
    alias: {
      // 「@」を「/src」に置き換えることで、パスの記述を簡潔にできる
      // 例: "@/components/MyComponent.vue" → "src/components/MyComponent.vue"
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  // 開発サーバーの設定
  server: {
    proxy: {
      // /api で始まるリクエストは FastAPI（http://127.0.0.1:8000）に転送
      "/api": {
        target: "http://127.0.0.1:8000", // バックエンドAPIのURL
        changeOrigin: true, // CORS対策（必要に応じて）
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
