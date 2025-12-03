<template>
  <v-btn @click="openDialog">ダイアログ開く</v-btn>

  <!-- selected イベントで値を受け取る -->
  <select-dialog ref="dialogRef" @selected="onSelected" />
</template>

<script setup>
import { ref } from "vue";
import SelectDialog from "./SelectDialog.vue";

const dialogRef = ref(null);

function openDialog() {
  dialogRef.value?.open();
}

function onSelected(value) {
  console.log("選択結果:", value);
  alert(JSON.stringify(value));
}
</script>
