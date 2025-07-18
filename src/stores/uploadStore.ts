// src/stores/uploadStore.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import { uploadService } from "@/services/uploadService";
import { dialogService } from "@/services/dialogService"; // 任意のダイアログサービス

export const useUploadStore = defineStore("upload", () => {
  // ファイル状態
  const aviFile = ref<File | null>(null);
  const synFile = ref<File | null>(null);

  // ← ここにアップロード完了フラグを追加
  const uploadCompleted = ref(false);

  // 進捗率
  const aviProgress = ref(0);
  const synProgress = ref(0);

  // ファイル設定
  const setFile = (type: "avi" | "syn", file: File) => {
    // アップロード完了していたら上書き禁止
    if (uploadCompleted.value) return;
    if (type === "avi") aviFile.value = file;
    else synFile.value = file;
  };

  // 両方のファイルをアップロード
  const uploadBoth = async () => {
    if (!aviFile.value || !synFile.value) return;

    try {
      aviProgress.value = 0;
      synProgress.value = 0;

      await uploadService.uploadFile(
        aviFile.value,
        (p) => (aviProgress.value = p)
      );
      await uploadService.uploadFile(
        synFile.value,
        (p) => (synProgress.value = p)
      );

      await dialogService.alert({
        title: "完了",
        message: "2ファイルがアップロードされました",
      });

      // アップロード完了フラグを立てる
      uploadCompleted.value = true;
    } catch (e) {
      console.error(e);
      await dialogService.alert({
        title: "エラー",
        message: "アップロードに失敗しました",
      });
    }
  };

  return {
    aviFile,
    synFile,
    aviProgress,
    synProgress,
    uploadCompleted, // ← 返却も忘れずに
    setFile,
    uploadBoth,
  };
});
