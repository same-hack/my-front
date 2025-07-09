<template>
  <v-container fluid class="pa-0">
    <!-- ✅ タイトル行 -->
    <v-row
      no-gutters
      style="height: 64px"
      class="align-center px-4 bg-grey-lighten-3"
    >
      <v-col cols="12">
        <h2 class="text-h6 font-weight-bold">サンプルステップページ</h2>
      </v-col>
    </v-row>

    <!-- ✅ ステッパー本体 -->
    <v-row no-gutters style="height: calc(100vh - 64px)">
      <v-col cols="12" class="fill-height">
        <v-stepper v-model="step" vertical class="fill-height">
          <!-- ヘッダー -->
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1" @click="goStep(1)">
              Step 1
            </v-stepper-step>
            <v-stepper-step :complete="step > 2" step="2" @click="goStep(2)">
              Step 2
            </v-stepper-step>
            <v-stepper-step step="3" @click="goStep(3)">Step 3</v-stepper-step>
          </v-stepper-header>

          <!-- 各ステップの内容 -->
          <v-stepper-items class="fill-height overflow-auto">
            <v-stepper-content step="1" class="fill-height">
              <router-view v-slot="{ Component }">
                <component
                  :is="Component"
                  class="step-content"
                  @next="goStep(2)"
                />
              </router-view>
            </v-stepper-content>

            <v-stepper-content step="2" class="fill-height">
              <router-view v-slot="{ Component }">
                <component
                  :is="Component"
                  class="step-content"
                  @next="goStep(3)"
                  @back="goStep(1)"
                />
              </router-view>
            </v-stepper-content>

            <v-stepper-content step="3" class="fill-height">
              <router-view v-slot="{ Component }">
                <component
                  :is="Component"
                  class="step-content"
                  @back="goStep(2)"
                />
              </router-view>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";

const route = useRoute();
const router = useRouter();
const step = ref(1);

// ステップ遷移とURL更新
const goStep = (num: number) => {
  step.value = num;
  router.push({ name: `StepperStep${num}` });
};

// URL直アクセス対応（例：/sample/stepper/step2）
watch(
  () => route.name,
  (name) => {
    if (name === "StepperStep1") step.value = 1;
    else if (name === "StepperStep2") step.value = 2;
    else if (name === "StepperStep3") step.value = 3;
  },
  { immediate: true }
);
</script>

<style scoped>
.fill-height {
  height: 100%;
}
.step-content {
  height: 100%;
  overflow-y: auto;
}
</style>
