<template>
  <v-btn @click="openDialog">ダイアログ開く</v-btn>
  <select-dialog ref="dialogRef" @selected="onSelected" />
</template>

<script setup>
import { ref } from "vue";
import SelectDialog from "./SelectDialog.vue";

const dialogRef = ref(null);

function openDialog() {
  // コンポーネントがマウントされるまで null なので optional chaining で安全に
  dialogRef.value?.open();
}

function onSelected(value) {
  console.log("選択結果:", value);
}
</script>
