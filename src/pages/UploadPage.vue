<template>
  <div class="layout-content">
    <!-- タイトル -->
    <div class="_title">
      <h2 class="text-h5">たいとる</h2>
    </div>

    <!-- ステップ UI -->
    <v-stepper v-model="step" alt-labels>
      <v-stepper-header>
        <v-stepper-item :complete="step > 1" :value="1" title="Step 1" />
        <v-stepper-item :complete="step > 2" :value="2" title="Step 2" />
        <v-stepper-item :complete="step > 3" :value="3" title="Step 3" />
      </v-stepper-header>

      <v-stepper-window>
        <!-- Step 1 -->
        <v-stepper-window-item :value="1">
          <v-card flat>
            <v-card-text>ステップ1の説明などをここに記載</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="step = 2">次へ</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>

        <!-- Step 2：アップロード -->
        <v-stepper-window-item :value="2">
          <v-container fluid>
            <v-row>
              <!-- AVI -->
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
                    <p>AVIファイルのアップロード</p>
                    <p class="text-caption">最大サイズ: xxx GB</p>
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

              <!-- SYN -->
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
                    <p>SYNファイルのアップロード</p>
                    <p class="text-caption">最大サイズ: xxx KB</p>
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

          <div class="_footer nav-footer">
            <v-btn variant="outlined" color="secondary" @click="step = 1"
              >戻る</v-btn
            >
            <v-btn
              color="primary"
              :disabled="!aviFile || !synFile"
              @click="handleUploadAndNext"
            >
              NEXT
            </v-btn>
          </div>
        </v-stepper-window-item>

        <!-- Step 3 -->
        <v-stepper-window-item :value="3">
          <v-card flat>
            <v-card-text>アップロード完了！次の処理をここに記述</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn variant="outlined" @click="step = 2">戻る</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { dialogService } from "@/services/dialogService";

const step = ref(1);

const aviFile = ref<File | null>(null);
const synFile = ref<File | null>(null);
const aviInput = ref<HTMLInputElement | null>(null);
const synInput = ref<HTMLInputElement | null>(null);

const draggingAvi = ref(false);
const draggingSyn = ref(false);

const aviProgress = ref(0);
const synProgress = ref(0);

const triggerFile = (type: "avi" | "syn") => {
  if (type === "avi") aviInput.value?.click();
  else synInput.value?.click();
};

const isValidExtension = (file: File, expected: "avi" | "syn") => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return expected === "avi" ? ext === "avi" : ext === "syn";
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

const handleUploadAndNext = async () => {
  await uploadBoth();
  step.value = 3;
};
</script>

<style scoped>
.layout-content {
  padding: 24px;
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
.nav-footer {
  padding: 24px 0;
  display: flex;
  justify-content: space-between;
}
</style>
