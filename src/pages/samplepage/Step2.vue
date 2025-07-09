<template>
  <v-container class="fill-height pa-4">
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-row dense>
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
              </template>
              <template v-else>
                <div class="file-name">{{ aviFile.name }}</div>
                <v-progress-linear
                  :model-value="aviProgress"
                  height="6"
                  color="primary"
                  class="mt-2"
                />
              </template>
            </div>
          </v-col>

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
              </template>
              <template v-else>
                <div class="file-name">{{ synFile.name }}</div>
                <v-progress-linear
                  :model-value="synProgress"
                  height="6"
                  color="primary"
                  class="mt-2"
                />
              </template>
            </div>
          </v-col>
        </v-row>

        <div class="d-flex justify-space-between mt-6">
          <v-btn variant="outlined" color="secondary" @click="$emit('back')"
            >戻る</v-btn
          >
          <v-btn
            :disabled="!aviFile || !synFile"
            color="primary"
            @click="uploadBoth"
            >NEXT</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

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

const uploadBoth = async () => {
  if (!aviFile.value || !synFile.value) return;
  await uploadFile(aviFile.value, aviProgress);
  await uploadFile(synFile.value, synProgress);
  aviProgress.value = 0;
  synProgress.value = 0;
  aviFile.value = null;
  synFile.value = null;
  emit("next");
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
