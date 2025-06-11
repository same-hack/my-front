<template>
  <v-dialog v-model="isOpen" max-width="400">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { ref, watch, defineEmits, defineProps } from "vue";

  const props = defineProps<{
    modelValue: boolean;
    title: string;
    message: string;
  }>();

  const emit = defineEmits(["update:modelValue"]);

  const isOpen = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (val) => {
      isOpen.value = val;
    }
  );

  watch(isOpen, (val) => {
    emit("update:modelValue", val);
  });

  const close = () => {
    isOpen.value = false;
  };
</script>
