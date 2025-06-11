import { createApp, h } from "vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import AlertDialog from "@/components/AlertDialog.vue"; // アラート用ダイアログコンポーネントをインポート
import vuetify from "@/plugins/vuetify"; // Vuetifyプラグインをインポート

class DialogService {
  /**
   * 確認ダイアログを表示するメソッド
   * ユーザーが「OK」または「キャンセル」を選択できる
   * @param options タイトルとメッセージのオブジェクト
   * @returns Promise<boolean> ユーザーがOKならtrue、キャンセルならfalseを返す
   */
  confirm(options: { title: string; message: string }): Promise<boolean> {
    return new Promise((resolve) => {
      // DOMに動的にダイアログ用のコンテナを作成
      const container = document.createElement("div");
      document.body.appendChild(container);

      // Vueアプリケーションを新規作成
      const app = createApp({
        render() {
          // ConfirmDialog コンポーネントを描画
          return h(ConfirmDialog, {
            modelValue: true, // ダイアログ表示の制御
            // v-modelの双方向バインディングイベント
            "onUpdate:modelValue": (val: boolean) => {
              if (!val) {
                // ダイアログが閉じられたらアンマウント＆DOMから削除
                app.unmount();
                document.body.removeChild(container);
                // キャンセル扱いでfalseを返す
                resolve(false);
              }
            },
            title: options.title,
            message: options.message,
            onConfirm: () => {
              // OKボタンが押されたらアンマウント＆DOM削除
              app.unmount();
              document.body.removeChild(container);
              // OK扱いでtrueを返す
              resolve(true);
            },
          });
        },
      });

      // Vuetifyプラグインを適用
      app.use(vuetify);
      // 作成したコンテナにマウント
      app.mount(container);
    });
  }

  /**
   * アラートダイアログを表示するメソッド
   * OKボタンだけのシンプルな通知ダイアログ
   * @param options タイトルとメッセージのオブジェクト
   * @returns Promise<void> ダイアログが閉じられるまで待つ
   */
  alert(options: { title: string; message: string }): Promise<void> {
    return new Promise((resolve) => {
      // DOMに動的にダイアログ用のコンテナを作成
      const container = document.createElement("div");
      document.body.appendChild(container);

      // Vueアプリを作成。ここではdataとmethodsも使う形で定義
      const app = createApp({
        data() {
          return {
            modelValue: true, // ダイアログ表示制御
          };
        },
        methods: {
          // ダイアログを閉じるためのメソッド（必要に応じて使用可能）
          close() {
            this.modelValue = false;
          },
        },
        render() {
          // AlertDialog コンポーネントを描画
          return h(AlertDialog, {
            modelValue: this.modelValue,
            // v-model双方向バインディングイベント
            "onUpdate:modelValue": (val: boolean) => {
              this.modelValue = val;
              if (!val) {
                // ダイアログが閉じられたらアンマウント＆DOM削除
                app.unmount();
                document.body.removeChild(container);
                // Promiseを解決して呼び出し元へ制御を戻す
                resolve();
              }
            },
            title: options.title,
            message: options.message,
          });
        },
      });

      // Vuetifyプラグインを適用
      app.use(vuetify);
      // DOMにマウント
      app.mount(container);
    });
  }
}

// DialogServiceのインスタンスをexportし、どこからでも呼べるようにする
export const dialogService = new DialogService();
