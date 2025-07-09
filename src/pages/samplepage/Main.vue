<template>
  <div class="layout-content">
    <div class="_title">
      <h2 class="text-h5">たいとる</h2>
    </div>

    <div class="stepper-main">
      <v-stepper v-model="step" alt-labels style="height: 100%">
        <v-stepper-header>
          <v-stepper-item :complete="step > 1" :value="1" title="Step 1" />
          <v-stepper-item :complete="step > 2" :value="2" title="Step 2" />
          <v-stepper-item :complete="step > 3" :value="3" title="Step 3" />
        </v-stepper-header>

        <v-stepper-window style="height: calc(100% - 48px); overflow-y: auto">
          <v-stepper-window-item :value="1">
            <Step1 @next="goToStep(2)" />
          </v-stepper-window-item>

          <v-stepper-window-item :value="2">
            <Step2 @prev="goToStep(1)" @next="goToStep(3)" />
          </v-stepper-window-item>

          <v-stepper-window-item :value="3">
            <Step3 @prev="goToStep(2)" />
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>
    </div>

    <div class="stepper-footer">
      <v-btn
        variant="outlined"
        color="secondary"
        :disabled="step === 1"
        @click="goToStep(step - 1)"
      >
        戻る
      </v-btn>
      <v-spacer />
      <v-btn color="primary" :disabled="step === 3" @click="goToStep(step + 1)">
        次へ
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Step1 from "./Step1.vue";
import Step2 from "./Step2.vue";
import Step3 from "./Step3.vue";

const step = ref(1);
const route = useRoute();
const router = useRouter();

// ✅ URL→step 同期
const stepMap: Record<string, number> = {
  step1: 1,
  step2: 2,
  step3: 3,
};

// ✅ 初期表示時：URLに応じて step を設定
const currentStepFromRoute = stepMap[route.path.split("/").pop() || "step1"];
if (currentStepFromRoute) step.value = currentStepFromRoute;

// ✅ step→URL 同期
const goToStep = (targetStep: number) => {
  step.value = targetStep;
  router.push(`/sample/stepper/step${targetStep}`);
};
</script>

<style scoped>
.layout-content {
  padding: 24px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
._title {
  height: 7vh;
}
.stepper-main {
  height: 88vh;
  overflow: hidden;
}
.stepper-footer {
  height: 5vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}
</style>
