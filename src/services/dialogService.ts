// src/services/dialogService.ts

import { createApp, h } from "vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue"; // Yes/No 確認用ダイアログ
import AlertDialog from "@/components/AlertDialog.vue"; // OK通知用ダイアログ
import EditTextDialog from "@/components/EditTextDialog.vue"; // テキスト編集用ダイアログ
import vuetify from "@/plugins/vuetify"; // Vuetifyプラグイン

// ダイアログを共通化して呼び出すサービスクラス
class DialogService {
  /**
   * Yes/No 確認ダイアログ
   */
  confirm(options: { title: string; message: string }): Promise<boolean> {
    return new Promise((resolve) => {
      // DOMにダイアログ専用コンテナを追加
      const container = document.createElement("div");
      document.body.appendChild(container);

      // Vueアプリとしてダイアログを動的にマウント
      const app = createApp({
        render() {
          return h(ConfirmDialog, {
            modelValue: true, // 最初から表示
            title: options.title,
            message: options.message,
            // 閉じたとき（キャンセル）
            "onUpdate:modelValue": (val: boolean) => {
              if (!val) {
                app.unmount();
                document.body.removeChild(container);
                resolve(false);
              }
            },
            // OKボタン押下時
            onConfirm: () => {
              app.unmount();
              document.body.removeChild(container);
              resolve(true);
            },
          });
        },
      });

      app.use(vuetify);
      app.mount(container);
    });
  }

  /**
   * OKボタンのみの通知ダイアログ
   */
  alert(options: { title: string; message: string }): Promise<void> {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      const app = createApp({
        data() {
          return { modelValue: true };
        },
        render() {
          return h(AlertDialog, {
            modelValue: this.modelValue,
            title: options.title,
            message: options.message,
            // 閉じたら Promise を解決
            "onUpdate:modelValue": (val: boolean) => {
              this.modelValue = val;
              if (!val) {
                app.unmount();
                document.body.removeChild(container);
                resolve();
              }
            },
          });
        },
      });

      app.use(vuetify);
      app.mount(container);
    });
  }

  /**
   * テキスト入力付きダイアログ（汎用）
   * OK時は入力文字列を、キャンセル時は null を返す
   */
  editText(options: {
    title: string;
    label: string;
    defaultValue: string;
  }): Promise<string | null> {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      const app = createApp({
        data() {
          return { open: true };
        },
        methods: {
          // OKボタン押下
          handleConfirm(value: string) {
            app.unmount();
            document.body.removeChild(container);
            resolve(value); // 入力文字列を返す
          },
          // キャンセル押下 or 閉じ
          handleCancel() {
            app.unmount();
            document.body.removeChild(container);
            resolve(null); // null を返す
          },
        },
        render() {
          return h(EditTextDialog, {
            modelValue: this.open, // 表示制御
            title: options.title,
            label: options.label,
            defaultValue: options.defaultValue,
            onConfirm: this.handleConfirm, // OKハンドラ
            onCancel: this.handleCancel, // キャンセルハンドラ
          });
        },
      });

      app.use(vuetify);
      app.mount(container);
    });
  }
}

// どこからでも dialogService.confirm / alert / editText を呼べる
export const dialogService = new DialogService();
