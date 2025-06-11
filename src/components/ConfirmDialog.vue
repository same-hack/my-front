<template>
  <!-- model-value で明示的にバインドし、update:modelValue でイベント発行 -->
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="handleDialogClose"
    max-width="400"
  >
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" @click="close">キャンセル</v-btn>
        <v-btn color="red" @click="confirm">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: Boolean,
  title: String,
  message: String,
});

const emit = defineEmits(["update:modelValue", "confirm"]);

// ダイアログを閉じる（親に通知）
const close = () => {
  emit("update:modelValue", false);
};

// OKを押したときの処理
const confirm = () => {
  emit("confirm");
  emit("update:modelValue", false);
};

// v-dialog 自体が emit する update:modelValue に対応
const handleDialogClose = (val: boolean) => {
  emit("update:modelValue", val);
};
</script>
