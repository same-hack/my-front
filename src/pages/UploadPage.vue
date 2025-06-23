<!-- src/pages/UploadPage.vue -->
<template>
  <v-container>
    <h1>ファイルアップロード</h1>

    <v-btn @click="triggerFileInput" color="primary" class="mb-2">
      ファイルを選択
    </v-btn>

    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileChange"
    />

    <p style="min-height: 24px">
      <span v-if="fileName">選択されたファイル: {{ fileName }}</span>
    </p>

    <v-btn
      @click="submitFile"
      :disabled="!selectedFile"
      color="success"
      class="mt-4"
    >
      アップロード
    </v-btn>

    <div v-if="uploadProgress !== null" class="mt-4">
      <p>アップロード進捗: {{ uploadProgress }}%</p>
      <v-progress-linear :value="uploadProgress" height="8" color="green" />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { dialogService } from "@/services/dialogService";

const selectedFile = ref<File | null>(null);
const fileName = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const uploadProgress = ref<number | null>(null);

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  selectedFile.value = file;
  fileName.value = file?.name || null;
};

// 分割アップロード処理
const submitFile = async () => {
  if (!selectedFile.value) return;

  const file = selectedFile.value;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const uploadId = `${file.name}-${Date.now()}`;

  uploadProgress.value = 0;

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("fileName", file.name);
    formData.append("uploadId", uploadId);
    formData.append("chunkIndex", i.toString());
    formData.append("totalChunks", totalChunks.toString());

    try {
      await axios.post("/api/upload-chunk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 進捗表示を更新
      uploadProgress.value = Math.round(((i + 1) / totalChunks) * 100);
    } catch (error) {
      console.error(`チャンク${i}のアップロードに失敗`, error);
      await dialogService.alert({
        title: "アップロード失敗",
        message: `チャンク${i + 1}のアップロードに失敗しました`,
      });
      return;
    }
  }

  await dialogService.alert({
    title: "",
    message: "アップロード完了！",
  });

  // 初期化
  selectedFile.value = null;
  fileName.value = null;
  uploadProgress.value = null;
};
</script>

<style scoped>
p {
  font-size: 16px;
}
</style>
