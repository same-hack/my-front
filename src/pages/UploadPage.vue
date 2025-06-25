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
      :disabled="!selectedFile || isUploading"
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
const isUploading = ref(false);

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

const submitFile = async () => {
  if (!selectedFile.value) return;
  isUploading.value = true;

  try {
    const file = selectedFile.value;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    // 1. アップロード開始
    const startResp = await axios.post("/api/upload/start", {
      fileName: file.name,
    });
    const uploadId = startResp.data.uploadId;

    // ETagリスト
    const parts: { ETag: string; PartNumber: number }[] = [];

    // 2. チャンクごとに署名付きURLを取得しPUT
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(file.size, start + CHUNK_SIZE);
      const chunk = file.slice(start, end);

      const urlResp = await axios.post("/api/upload/presign", {
        uploadId,
        chunkIndex: i,
        fileName: file.name,
      });
      const { url, partNumber } = urlResp.data;

      const putResp = await axios.put(url, chunk, {
        headers: { "Content-Type": "application/octet-stream" },
      });

      const etag = putResp.headers.etag as string;
      parts.push({ ETag: etag, PartNumber: partNumber });

      uploadProgress.value = Math.round(((i + 1) / totalChunks) * 100);
    }

    // 3. 完了API
    await axios.post("/api/upload/complete", {
      uploadId,
      fileName: file.name,
      parts,
    });

    await dialogService.alert({
      title: "アップロード完了",
      message: "ファイルがMinIOにアップロードされました",
    });

    selectedFile.value = null;
    fileName.value = null;
    uploadProgress.value = null;
  } catch (error) {
    console.error("アップロード失敗", error);
    await dialogService.alert({
      title: "アップロード失敗",
      message: "ファイルアップロード中にエラーが発生しました",
    });
  } finally {
    isUploading.value = false;
  }
};
</script>

<style scoped>
p {
  font-size: 16px;
}
</style>
