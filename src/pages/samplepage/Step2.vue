<script setup lang="ts">
import { ref } from "vue";
import { useUploadStore } from "@/stores/uploadStore";

const store = useUploadStore();

const draggingAvi = ref(false);
const draggingSyn = ref(false);

const aviInput = ref<HTMLInputElement | null>(null);
const synInput = ref<HTMLInputElement | null>(null);

const triggerFile = (type: "avi" | "syn") => {
  if (type === "avi") aviInput.value?.click();
  else synInput.value?.click();
};

const isValid = (file: File, ext: string) =>
  file.name.toLowerCase().endsWith(`.${ext}`);

const onChange = (e: Event, type: "avi" | "syn") => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !isValid(file, type)) return;
  store.setFile(type, file);
};

const onDrop = (e: DragEvent, type: "avi" | "syn") => {
  const file = e.dataTransfer?.files?.[0];
  if (!file || !isValid(file, type)) return;
  if (type === "avi") draggingAvi.value = false;
  else draggingSyn.value = false;
  store.setFile(type, file);
};

const handleUpload = async () => {
  await store.uploadBoth();
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <!-- AVI -->
      <v-col cols="12" md="6">
        <div
          class="d-flex flex-column align-center justify-center pa-10 border-dashed rounded bg-grey-lighten-3"
          style="min-height: 200px; cursor: pointer"
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
          <template v-if="!store.aviFile">
            <v-icon size="40">mdi-cloud-upload</v-icon>
            <p>AVIファイルをアップロード</p>
          </template>
          <template v-else>
            <div class="text-subtitle-1">{{ store.aviFile.name }}</div>
            <v-progress-linear
              :model-value="store.aviProgress"
              height="6"
              class="mt-2"
            />
          </template>
        </div>
      </v-col>

      <!-- SYN -->
      <v-col cols="12" md="6">
        <div
          class="d-flex flex-column align-center justify-center pa-10 border-dashed rounded bg-grey-lighten-3"
          style="min-height: 200px; cursor: pointer"
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
          <template v-if="!store.synFile">
            <v-icon size="40">mdi-cloud-upload</v-icon>
            <p>SYNファイルをアップロード</p>
          </template>
          <template v-else>
            <div class="text-subtitle-1">{{ store.synFile.name }}</div>
            <v-progress-linear
              :model-value="store.synProgress"
              height="6"
              class="mt-2"
            />
          </template>
        </div>
      </v-col>
    </v-row>

    <!-- アップロードボタン -->
    <div class="d-flex justify-end mt-4">
      <v-btn
        color="primary"
        @click="handleUpload"
        :disabled="!store.aviFile || !store.synFile"
      >
        アップロード
      </v-btn>
    </div>
  </v-container>
</template>
