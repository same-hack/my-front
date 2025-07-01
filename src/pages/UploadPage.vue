<template>
  <div class="layout-content">
    <!-- タイトル -->
    <div class="_title">
      <h2 class="text-h5">たいとる</h2>
    </div>

    <!-- ステップ -->
    <div class="_step stepper-wrapper text-center">
      <v-chip :color="step >= 1 ? 'success' : ''" variant="outlined"
        >Step 1</v-chip
      >
      <v-chip :color="step >= 2 ? 'success' : ''" variant="outlined"
        >Step 2</v-chip
      >
      <v-chip :color="step >= 3 ? 'success' : ''" variant="outlined"
        >Step 3</v-chip
      >
    </div>

    <!-- メインアップロードUI -->
    <div class="_main">
      <v-container fluid>
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
                <v-progress-linear
                  v-if="aviProgress > 0"
                  :model-value="aviProgress"
                  height="6"
                  color="primary"
                  class="mt-2"
                />
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
                <v-progress-linear
                  v-if="synProgress > 0"
                  :model-value="synProgress"
                  height="6"
                  color="primary"
                  class="mt-2"
                />
              </template>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- フッター -->
    <div class="_footer nav-footer">
      <v-btn color="secondary" variant="outlined" @click="goBack">戻る</v-btn>
      <v-btn
        color="primary"
        :disabled="!aviFile || !synFile"
        @click="uploadBoth"
      >
        NEXT
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { dialogService } from "@/services/dialogService";

const step = 2;

const aviFile = ref<File | null>(null);
const synFile = ref<File | null>(null);
const aviInput = ref<HTMLInputElement | null>(null);
const synInput = ref<HTMLInputElement | null>(null);

const draggingAvi = ref(false);
const draggingSyn = ref(false);

const aviProgress = ref(0);
const synProgress = ref(0);

const goBack = () => {
  history.back();
};

const isValidExtension = (file: File, expected: "avi" | "syn") => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return expected === "avi" ? ext === "avi" : ext === "syn";
};

const triggerFile = (type: "avi" | "syn") => {
  if (type === "avi") aviInput.value?.click();
  else synInput.value?.click();
};

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
  if (type === "avi") aviFile.value = file;
  else synFile.value = file;
};

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
  if (type === "avi") aviFile.value = file;
  else synFile.value = file;
};

const CHUNK_SIZE = 10 * 1024 * 1024;

const uploadFile = async (file: File, progressRef: typeof aviProgress) => {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const startResp = await axios.post("/api/upload/start", {
    fileName: file.name,
  });
  const uploadId = startResp.data.uploadId;
  const parts: { ETag: string; PartNumber: number }[] = [];

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
    parts.push({ ETag: putResp.headers.etag, PartNumber: partNumber });

    progressRef.value = Math.floor(((i + 1) / totalChunks) * 100);
  }

  await axios.post("/api/upload/complete", {
    uploadId,
    fileName: file.name,
    parts,
  });
};

const uploadBoth = async () => {
  try {
    if (!aviFile.value || !synFile.value) return;
    aviProgress.value = 0;
    synProgress.value = 0;
    await uploadFile(aviFile.value, aviProgress);
    await uploadFile(synFile.value, synProgress);
    await dialogService.alert({
      title: "完了",
      message: "2ファイルがアップロードされました",
    });
    aviFile.value = null;
    synFile.value = null;
    aviProgress.value = 0;
    synProgress.value = 0;
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
  min-height: 100%;
  padding: 2rem;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.stepper-wrapper {
  display: flex;
  justify-content: center;
  gap: 1rem;
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

/* ✅ フッターの左右固定ボタン配置（左メニュー40px分の余白を確保） */
.nav-footer {
  position: fixed;
  bottom: 24px;
  left: 40px; /* 左メニューの幅分だけずらす */
  width: calc(100% - 40px); /* 横幅も左メニュー分だけ狭める */
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  z-index: 100;
  pointer-events: none; /* ボタン以外のエリアはクリックできないように */
}
.nav-footer > .v-btn {
  pointer-events: auto;
}
</style>
