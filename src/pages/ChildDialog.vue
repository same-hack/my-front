<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card class="pa-4">
      <h3 class="mb-4">編集</h3>

      <!-- 左：color input / 右：name input -->
      <v-row align="center">
        <v-col cols="4">
          <input type="color" v-model="localColor" class="color-input" />
        </v-col>

        <v-col cols="8">
          <v-text-field v-model="localName" hide-details placeholder="Name" />
        </v-col>
      </v-row>

      <v-row class="mt-6" justify="end">
        <v-btn variant="text" @click="close">キャンセル</v-btn>
        <v-btn color="primary" @click="submit">OK</v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  name: String,
  color: String,
});

const emit = defineEmits(["update"]);

const isOpen = ref(false);

const localName = ref("");
const localColor = ref("");

let originalName = "";
let originalColor = "";

// props → 内部値、元の値を記録
watch(
  () => [props.name, props.color],
  () => {
    localName.value = props.name;
    localColor.value = props.color;

    originalName = props.name;
    originalColor = props.color;
  },
  { immediate: true }
);

function open() {
  isOpen.value = true;

  // open 時にも original を確実に反映
  originalName = props.name;
  originalColor = props.color;
}

function close() {
  isOpen.value = false;
}

defineExpose({ open, close });

function submit() {
  // 変更なし → キャンセル扱い
  if (localName.value === originalName && localColor.value === originalColor) {
    close();
    return;
  }

  // 変更あり → emit
  emit("update", {
    name: localName.value,
    color: localColor.value,
  });

  close();
}
</script>

<style scoped>
.color-input {
  width: 100%;
  height: 40px;
  padding: 0;
  outline: none;
  border: none; /* ← borderなし */
  background: none;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
