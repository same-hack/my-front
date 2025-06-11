import { createApp, h } from "vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import vuetify from "@/plugins/vuetify"; // Vuetifyを明示的にuse

class DialogService {
  confirm(options: { title: string; message: string }): Promise<boolean> {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      const app = createApp({
        render() {
          return h(ConfirmDialog, {
            modelValue: true,
            "onUpdate:modelValue": (val: boolean) => {
              if (!val) {
                app.unmount();
                document.body.removeChild(container);
                resolve(false);
              }
            },
            title: options.title,
            message: options.message,
            onConfirm: () => {
              app.unmount();
              document.body.removeChild(container);
              resolve(true);
            },
          });
        },
      });

      app.use(vuetify); // Vuetifyを適用
      app.mount(container);
    });
  }
}

export const dialogService = new DialogService();
