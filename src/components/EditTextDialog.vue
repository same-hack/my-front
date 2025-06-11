<template>
  <!-- internalOpen で開閉を管理 -->
  <v-dialog v-model="internalOpen" max-width="400">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="inputText" :label="label" autofocus />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cancel">キャンセル</v-btn>
        <v-btn text @click="confirm">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from "vue";

// 親から渡すのは初期値のみ
const props = defineProps<{
  title: string;
  label: string;
  defaultValue: string;
}>();

// onConfirm, onCancel イベントだけを出す
const emit = defineEmits<{
  (e: "confirm", val: string): void;
  (e: "cancel"): void;
}>();

// ダイアログ開閉はコンポーネント内で管理
const internalOpen = ref(true);

// 入力フィールドの値
const inputText = ref("");

// 初期値をセット
onMounted(() => {
  inputText.value = props.defaultValue;
});

// OKボタン
const confirm = () => {
  emit("confirm", inputText.value);
  internalOpen.value = false;
};

// キャンセル
const cancel = () => {
  emit("cancel");
  internalOpen.value = false;
};
</script>
