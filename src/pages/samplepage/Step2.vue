<script setup lang="ts">
import { ref, computed } from "vue";
import { useUploadStore } from "@/stores/uploadStore";

const store = useUploadStore();

const draggingAvi = ref(false);
const draggingSyn = ref(false);

const aviInput = ref<HTMLInputElement | null>(null);
const synInput = ref<HTMLInputElement | null>(null);

// 書き換え禁止フラグ（storeのuploadCompletedをそのまま利用）
const isDisabled = computed(() => store.uploadCompleted);

// ファイル選択トリガー
const triggerFile = (type: "avi" | "syn") => {
  if (isDisabled.value) return; // 書き換え禁止なら無視
  if (type === "avi") aviInput.value?.click();
  else synInput.value?.click();
};

// 拡張子チェック
const isValid = (file: File, ext: string) =>
  file.name.toLowerCase().endsWith(`.${ext}`);

// ファイル変更時
const onChange = (e: Event, type: "avi" | "syn") => {
  if (isDisabled.value) return; // 書き換え禁止なら無視
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !isValid(file, type)) return;
  store.setFile(type, file);
};

// ドロップ時
const onDrop = (e: DragEvent, type: "avi" | "syn") => {
  if (isDisabled.value) return; // 書き換え禁止なら無視
  const file = e.dataTransfer?.files?.[0];
  if (!file || !isValid(file, type)) return;
  if (type === "avi") draggingAvi.value = false;
  else draggingSyn.value = false;
  store.setFile(type, file);
};

const handleUpload = async () => {
  if (isDisabled.value) return; // 念のため
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
          :class="{ 'opacity-50': isDisabled }"
          :style="{
            minHeight: '200px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }"
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
          :class="{ 'opacity-50': isDisabled }"
          :style="{
            minHeight: '200px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }"
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
        :disabled="!store.aviFile || !store.synFile || isDisabled"
      >
        アップロード
      </v-btn>
    </div>
  </v-container>
</template>
