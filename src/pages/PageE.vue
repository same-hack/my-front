<template>
  <v-btn @click="open = true">ダイアログを開く</v-btn>

  <select-dialog v-model="open" @selected="onSelected" />
</template>

<script setup>
import { ref } from "vue";
import SelectDialog from "./SelectDialog.vue";

const open = ref(false);

function onSelected(value) {
  console.log("★ 受け取った選択結果:", value);
}
</script>
