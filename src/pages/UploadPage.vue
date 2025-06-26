<!-- src/pages/UploadPage.vue -->
<template>
  <v-container class="my-container" fluid>
    <!-- ダミーのステップインジケーター -->
    <div class="text-center mb-6">
      <span class="step" :class="{ active: true }">Step 1</span>
      <span class="step" :class="{ active: true }">Step 2</span>
      <span class="step">Step 3</span>
    </div>

    <h2 class="text-h5 mb-6">たいとる</h2>

    <v-row>
      <!-- 動画ファイル -->
      <v-col cols="12" md="6">
        <div
          class="drop-zone"
          :class="{ 'drop-zone--hover': draggingAvi }"
          @dragover.prevent
          @dragenter.prevent="draggingAvi = true"
          @dragleave.prevent="draggingAvi = false"
          @drop.prevent="onDrop($event, 'avi')"
          @click="triggerFile('avi')"
        >
          <input
            type="file"
            ref="aviInput"
            style="display: none"
            accept=".avi"
            @change="onChange($event, 'avi')"
          />
          <template v-if="!aviFile">
            <v-icon size="40">mdi-cloud-upload</v-icon>
            <p>ファイルのアップロード</p>
            <p class="text-caption">Size limit: xxx GB</p>
          </template>
          <template v-else>
            <div class="file-name">{{ aviFile.name }}</div>
          </template>
        </div>
      </v-col>

      <!-- GPSファイル -->
      <v-col cols="12" md="6">
        <div
          class="drop-zone"
          :class="{ 'drop-zone--hover': draggingSyn }"
          @dragover.prevent
          @dragenter.prevent="draggingSyn = true"
          @dragleave.prevent="draggingSyn = false"
          @drop.prevent="onDrop($event, 'syn')"
          @click="triggerFile('syn')"
        >
          <input
            type="file"
            ref="synInput"
            style="display: none"
            accept=".syn"
            @change="onChange($event, 'syn')"
          />
          <template v-if="!synFile">
            <v-icon size="40">mdi-cloud-upload</v-icon>
            <p>ファイルのアップロード</p>
            <p class="text-caption">Size limit: xxx KB</p>
          </template>
          <template v-else>
            <div class="file-name">{{ synFile.name }}</div>
          </template>
        </div>
      </v-col>
    </v-row>

    <v-row justify="end" class="mt-6">
      <v-btn
        color="primary"
        :disabled="!aviFile || !synFile"
        @click="uploadBoth"
      >
        NEXT
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { dialogService } from "@/services/dialogService";

const aviFile = ref<File | null>(null);
const synFile = ref<File | null>(null);
const aviInput = ref<HTMLInputElement | null>(null);
const synInput = ref<HTMLInputElement | null>(null);

const draggingAvi = ref(false);
const draggingSyn = ref(false);

// 拡張子チェック
const isValidExtension = (file: File, expected: "avi" | "syn") => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return expected === "avi" ? ext === "avi" : ext === "syn";
};

// ファイル選択ダイアログを開く
const triggerFile = (type: "avi" | "syn") => {
  if (type === "avi") {
    aviInput.value?.click();
  } else {
    synInput.value?.click();
  }
};

// ファイル選択後の処理
const onChange = (e: Event, type: "avi" | "syn") => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (!isValidExtension(file, type)) {
    dialogService.alert({
      title: "無効なファイル形式",
      message: `${type.toUpperCase()}ファイルを選択してください`,
    });
    return;
  }
  if (type === "avi") {
    aviFile.value = file;
  } else {
    synFile.value = file;
  }
};

// ドラッグ＆ドロップによるファイル読み込み
const onDrop = (e: DragEvent, type: "avi" | "syn") => {
  const file = e.dataTransfer?.files?.[0];
  if (type === "avi") draggingAvi.value = false;
  else draggingSyn.value = false;
  if (!file) return;
  if (!isValidExtension(file, type)) {
    dialogService.alert({
      title: "無効なファイル形式",
      message: `${type.toUpperCase()}ファイルをドロップしてください`,
    });
    return;
  }
  if (type === "avi") {
    aviFile.value = file;
  } else {
    synFile.value = file;
  }
};

// チャンクサイズ定義
const CHUNK_SIZE = 10 * 1024 * 1024;

// ファイルをチャンク分割してアップロード
const uploadFile = async (file: File) => {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  // アップロード開始リクエスト
  const startResp = await axios.post("/api/upload/start", {
    fileName: file.name,
  });
  const uploadId = startResp.data.uploadId;
  const parts: { ETag: string; PartNumber: number }[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunk = file.slice(start, end);

    // プリサインURL取得
    const urlResp = await axios.post("/api/upload/presign", {
      uploadId,
      chunkIndex: i,
      fileName: file.name,
    });
    const { url, partNumber } = urlResp.data;

    // 実際のPUTリクエスト
    const putResp = await axios.put(url, chunk, {
      headers: { "Content-Type": "application/octet-stream" },
    });
    parts.push({ ETag: putResp.headers.etag, PartNumber: partNumber });
  }

  // アップロード完了通知
  await axios.post("/api/upload/complete", {
    uploadId,
    fileName: file.name,
    parts,
  });
};

// AVI と SYN の両方を連続してアップロード
const uploadBoth = async () => {
  try {
    if (!aviFile.value || !synFile.value) return;
    await uploadFile(aviFile.value);
    await uploadFile(synFile.value);
    await dialogService.alert({
      title: "完了",
      message: "2ファイルがアップロードされました",
    });
    // リセット
    aviFile.value = null;
    synFile.value = null;
  } catch (err) {
    console.error(err);
    await dialogService.alert({
      title: "エラー",
      message: "アップロードに失敗しました",
    });
  }
};
</script>

<style scoped>
.my-container {
  /* 親の main-wrapper 内でフル高さを取得 */
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  /* 追加：上下左右の余白を確保 */
  padding: 2rem;
  box-sizing: border-box;

  background-color: #fff;
}

.drop-zone {
  border: 2px dashed #888;
  padding: 40px;
  text-align: center;
  border-radius: 12px;
  background-color: #d3d2d2;
  cursor: pointer;
  min-height: 200px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.drop-zone--hover {
  border-color: #4caf50;
  background-color: #cdeccc;
}

.file-name {
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}

.step {
  display: inline-block;
  margin: 0 10px;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: #555;
  color: white;
}
.step.active {
  background-color: #4caf50;
}
</style>
