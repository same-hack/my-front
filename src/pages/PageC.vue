<template>
  <div class="d-flex flex-column align-center" style="gap: 16px">
    <!-- ステータス切り替え -->
    <v-checkbox v-model="isDone" label="完了にする" color="orange" />

    <!-- リング表示 -->
    <div class="position-relative" style="width: 140px; height: 140px">
      <!-- LOADING -->
      <v-progress-circular
        v-if="!isDone"
        indeterminate
        :size="140"
        :width="15"
        color="red"
      ></v-progress-circular>
      <!-- DONE -->
      <v-progress-circular
        v-else
        :model-value="100"
        :size="140"
        :width="15"
        color="orange"
      ></v-progress-circular>

      <!-- 中央文字 -->
      <div
        class="position-absolute top-0 left-0 w-100 h-100 d-flex align-center justify-center"
        style="font-size: 12px; font-weight: bold"
      >
        {{ isDone ? "completed" : "processing..." }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isDone = ref(false);
</script>
