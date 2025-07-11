<template>
  <v-container class="fill-height pa-4">
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-row dense>
          <!-- v-col：12分割中の6カラム。md以上の画面幅で左右2列に -->
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column align-center justify-center pa-4"
            style="height: 30vh"
          >
            <!-- アップロードボックス本体 -->
            <div
              class="w-100 h-100 d-flex flex-column align-center justify-center rounded border-dashed"
              @dragover.prevent
              @dragenter.prevent="draggingAvi = true"
              @dragleave.prevent="draggingAvi = false"
              @drop.prevent="onDrop($event, 'avi')"
              @click="triggerFile('avi')"
            >
              <!-- 隠しファイル選択ボックス -->
              <input
                type="file"
                ref="aviInput"
                style="display: none"
                accept=".avi"
                @change="onChange($event, 'avi')"
              />

              <!-- ファイル未選択時の表示 -->
              <template v-if="!aviFile">
                <!-- アイコンサイズは40px -->
                <v-icon size="40">mdi-cloud-upload</v-icon>

                <!-- ファイルアップロード案内 -->
                <p class="text-subtitle-2 mt-2">AVIファイルのアップロード</p>
                <p class="text-caption">Size limit: xxx GB</p>
              </template>

              <!-- ファイル選択後の表示 -->
              <template v-else>
                <!-- 選択ファイル名表示 -->
                <div class="text-body-2">{{ aviFile.name }}</div>

                <!-- プログレスバー表示（モデル値で進捗制御） -->
                <v-progress-linear
                  :model-value="aviProgress"
                  height="6"
                  color="primary"
                  class="mt-2 w-100"
                />
              </template>
            </div>
          </v-col>

          <!-- v-col：12分割中の6カラム。md以上の画面幅で左右2列に -->
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column align-center justify-center pa-4"
            style="height: 30vh"
          >
            <!-- アップロードボックス本体 -->
            <div
              class="w-100 h-100 d-flex flex-column align-center justify-center rounded border-dashed"
              @dragover.prevent
              @dragenter.prevent="draggingSyn = true"
              @dragleave.prevent="draggingSyn = false"
              @drop.prevent="onDrop($event, 'syn')"
              @click="triggerFile('syn')"
            >
              <!-- ファイル選択のための非表示input -->
              <input
                type="file"
                ref="synInput"
                style="display: none"
                accept=".syn"
                @change="onChange($event, 'syn')"
              />

              <!-- ファイル未選択時の表示 -->
              <template v-if="!synFile">
                <!-- アップロードアイコン -->
                <v-icon size="40">mdi-cloud-upload</v-icon>

                <!-- アップロード説明テキスト -->
                <p class="text-subtitle-2 mt-2">SYNファイルのアップロード</p>
                <p class="text-caption">Size limit: xxx KB</p>
              </template>

              <!-- ファイル選択済みの表示 -->
              <template v-else>
                <!-- ファイル名 -->
                <div class="text-body-2">{{ synFile.name }}</div>

                <!-- プログレスバー -->
                <v-progress-linear
                  :model-value="synProgress"
                  height="6"
                  color="primary"
                  class="mt-2 w-100"
                />
              </template>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

// ファイル状態管理
const aviFile = ref<File | null>(null);
const synFile = ref<File | null>(null);
const aviInput = ref<HTMLInputElement | null>(null);
const synInput = ref<HTMLInputElement | null>(null);
const draggingAvi = ref(false);
const draggingSyn = ref(false);
const aviProgress = ref(0);
const synProgress = ref(0);

// ファイル選択・ドラッグ処理
const triggerFile = (type: "avi" | "syn") => {
  if (type === "avi") aviInput.value?.click();
  else synInput.value?.click();
};

const onChange = (e: Event, type: "avi" | "syn") => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (type === "avi") aviFile.value = file;
  else synFile.value = file;
};

const onDrop = (e: DragEvent, type: "avi" | "syn") => {
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  if (type === "avi") {
    draggingAvi.value = false;
    aviFile.value = file;
  } else {
    draggingSyn.value = false;
    synFile.value = file;
  }
};

// ファイルアップロード（必要に応じて外部から呼び出す）
const uploadFile = async (file: File, progressRef: typeof aviProgress) => {
  const CHUNK_SIZE = 10 * 1024 * 1024;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const { data } = await axios.post("/api/upload/start", {
    fileName: file.name,
  });
  const uploadId = data.uploadId;
  const parts = [];

  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const { data: presign } = await axios.post("/api/upload/presign", {
      uploadId,
      chunkIndex: i,
      fileName: file.name,
    });
    const putResp = await axios.put(presign.url, chunk);
    parts.push({ ETag: putResp.headers.etag, PartNumber: presign.partNumber });
    progressRef.value = Math.floor(((i + 1) / totalChunks) * 100);
  }

  await axios.post("/api/upload/complete", {
    uploadId,
    fileName: file.name,
    parts,
  });
};
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #ccc;
  padding: 40px 20px;
  border-radius: 12px;
  text-align: center;
  background-color: #f8f8f8;
  cursor: pointer;
}
.drop-zone--hover {
  border-color: #1976d2;
  background-color: #e3f2fd;
}
.file-name {
  font-weight: bold;
}
</style>
