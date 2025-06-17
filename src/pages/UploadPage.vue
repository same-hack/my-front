<!-- src/pages/UploadPage.vue -->
<template>
  <v-container>
    <h1>ファイルアップロード</h1>

    <!-- ファイル選択ボタン -->
    <v-btn @click="triggerFileInput" color="primary" class="mb-2">
      ファイルを選択
    </v-btn>

    <!-- 実際のファイル選択用 input（非表示） -->
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileChange"
    />

    <!-- 選択されたファイル名を表示（見た目が崩れないよう常に高さ確保） -->
    <p style="min-height: 24px">
      <span v-if="fileName">選択されたファイル: {{ fileName }}</span>
    </p>

    <!-- アップロードボタン（ファイルが選択されていないときは無効） -->
    <v-btn
      @click="submitFile"
      :disabled="!selectedFile"
      color="success"
      class="mt-4"
    >
      アップロード
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { dialogService } from "@/services/dialogService"; // ✅ ダイアログ共通サービス

// ファイルオブジェクトとファイル名を管理
const selectedFile = ref<File | null>(null);
const fileName = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// 📂 ファイル選択ダイアログを開く
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 📥 ファイル選択時に呼ばれる関数
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  selectedFile.value = file;
  fileName.value = file?.name || null;
};

// 🚀 ファイルアップロード処理
const submitFile = async () => {
  if (!selectedFile.value) return;

  const formData = new FormData();
  formData.append("file", selectedFile.value);

  try {
    await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    await dialogService.alert({
      title: "",
      message: "アップロード成功！",
    });
    selectedFile.value = null;
    fileName.value = null;
  } catch (error) {
    await dialogService.alert({
      title: "",
      message: "アップロードに失敗しました",
    });
    console.error(error);
  }
};
</script>
