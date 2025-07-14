<template>
  <v-container
    fluid
    class="d-flex align-center justify-center"
    style="height: 100vh"
  >
    <v-card width="20rem" class="pa-6">
      <v-stack dense>
        <v-text-field
          v-model="username"
          label="Username"
          outlined
          density="comfortable"
        />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          outlined
          density="comfortable"
        />
        <v-btn color="primary" block @click="onLogin"> ログイン </v-btn>
      </v-stack>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");

function onLogin() {
  // ログイン処理
  console.log("ログイン:", username.value, password.value);
}
</script>
