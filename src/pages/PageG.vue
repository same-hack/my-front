<template>
  <v-btn @click="openDialog">開く</v-btn>

  <ChildDialog
    ref="dialogRef"
    :name="item.name"
    :color="item.color"
    @update="onUpdate"
  />
</template>

<script setup>
import { ref } from "vue";
import ChildDialog from "./ChildDialog.vue";

const item = ref({
  name: "item1",
  color: "#ff0000",
});

const dialogRef = ref();

function openDialog() {
  dialogRef.value.open(); // ← defineExposeで公開したopen()
}

function onUpdate(val) {
  item.value = val;
}
</script>
