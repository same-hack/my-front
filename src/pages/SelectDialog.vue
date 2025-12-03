<template>
  <v-dialog v-model="isOpen" max-width="900px">
    <v-card class="pa-4" height="500px">
      <h2 class="mb-4">3階層ダイアログ</h2>

      <!-- 固定タイトル行 -->
      <div class="d-flex text-center font-weight-bold border-bottom">
        <div style="width: 33%; padding: 4px 0">左</div>
        <div style="width: 33%; padding: 4px 0">中央</div>
        <div style="width: 33%; padding: 4px 0">右</div>
      </div>

      <!-- ペイン本体 -->
      <div class="d-flex" style="height: 350px; min-height: 0">
        <!-- 左エリア -->
        <div
          class="pa-2 border"
          style="width: 33%; overflow-y: auto; min-height: 0"
        >
          <v-list>
            <v-list-item
              v-for="item in leftItems"
              :key="item.id"
              :active="selectedLeft?.id === item.id"
              @click="selectLeft(item)"
            >
              <span>{{ item.name }}</span>
            </v-list-item>
          </v-list>
        </div>

        <!-- 中央エリア -->
        <div
          class="pa-2 border"
          style="width: 33%; overflow-y: auto; min-height: 0"
        >
          <v-list>
            <template v-if="leftType === 0 || leftType === 2">
              <v-list-item v-for="item in centerItems" :key="item.id">
                <label
                  class="d-flex justify-space-between align-center"
                  style="width: 100%; cursor: pointer"
                >
                  <span>{{ item.name }}</span>
                  <input
                    type="checkbox"
                    :value="item"
                    v-model="selectedCenterMulti"
                  />
                </label>
              </v-list-item>
            </template>

            <template v-else>
              <v-list-item
                v-for="item in centerItems"
                :key="item.id"
                :active="selectedCenter?.id === item.id"
                @click="selectCenter(item)"
              >
                <span>{{ item.name }}</span>
              </v-list-item>
            </template>
          </v-list>
        </div>

        <!-- 右エリア -->
        <div
          class="pa-2 border"
          style="width: 33%; overflow-y: auto; min-height: 0"
        >
          <v-list v-if="leftType === 1 || leftType === 2">
            <v-list-item v-for="item in rightItems" :key="item.id">
              <label
                class="d-flex justify-space-between align-center"
                style="width: 100%; cursor: pointer"
              >
                <span>{{ item.name }}</span>
                <input
                  type="checkbox"
                  :value="item"
                  v-model="selectedRightMulti"
                />
              </label>
            </v-list-item>
          </v-list>
          <div v-else class="text-grey">右項目はありません</div>
        </div>
      </div>

      <!-- ボタン -->
      <div class="d-flex justify-end mt-4">
        <v-btn variant="tonal" class="mr-2" @click="cancel">キャンセル</v-btn>
        <v-btn color="primary" @click="confirm">追加</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
const emit = defineEmits(["selected"]);

const isOpen = ref(false);
const resolver = ref(null);

function open() {
  reset();
  loadLeft();
  isOpen.value = true;
  return new Promise((resolve) => {
    resolver.value = resolve;
  });
}
defineExpose({ open });

// 選択状態
const selectedLeft = ref(null);
const selectedCenter = ref(null);
const selectedCenterMulti = ref([]);
const selectedRightMulti = ref([]);
const leftType = ref(null);

// データ
const leftItems = ref([]);
const centerItems = ref([]);
const rightItems = ref([]);

// データ読み込み
function loadLeft() {
  leftItems.value = [
    { id: 1, name: "左-1", type_layer: 0 },
    { id: 2, name: "左-2", type_layer: 1 },
    { id: 3, name: "左-3", type_layer: 2 },
  ];
}

function loadCenter(leftId) {
  centerItems.value = [
    { id: leftId * 100 + 1, name: `中央-${leftId}-1` },
    { id: leftId * 100 + 2, name: `中央-${leftId}-2` },
    { id: leftId * 100 + 3, name: `中央-${leftId}-3` },
  ];
}

async function loadRightForCenters(centerIds) {
  const results = [];
  for (const cid of centerIds) {
    results.push({ id: cid * 10 + 1, name: `右-${cid}-1` });
    results.push({ id: cid * 10 + 2, name: `右-${cid}-2` });
  }
  const uniq = [];
  const seen = new Set();
  for (const it of results) {
    if (!seen.has(it.id)) {
      uniq.push(it);
      seen.add(it.id);
    }
  }
  rightItems.value = uniq;
  selectedRightMulti.value = [];
}

// 左選択
function selectLeft(item) {
  selectedLeft.value = item;
  leftType.value = item.type_layer;
  selectedCenter.value = null;
  selectedCenterMulti.value = [];
  selectedRightMulti.value = [];
  centerItems.value = [];
  rightItems.value = [];
  loadCenter(item.id);
}

// 中央選択（単一選択タイプ）
function selectCenter(item) {
  selectedCenter.value = item;
  if (leftType.value === 1) loadRightForCenters([item.id]);
}

// 中央チェックボックス変更時
watch(
  selectedCenterMulti,
  (newVal) => {
    if (leftType.value === 2) {
      const ids = newVal.map((i) => i.id);
      if (ids.length) loadRightForCenters(ids);
      else {
        rightItems.value = [];
        selectedRightMulti.value = [];
      }
    }
  },
  { deep: true }
);

// 初期化
function reset() {
  selectedLeft.value = null;
  selectedCenter.value = null;
  selectedCenterMulti.value = [];
  selectedRightMulti.value = [];
  leftType.value = null;
  leftItems.value = [];
  centerItems.value = [];
  rightItems.value = [];
}

// キャンセル
function cancel() {
  isOpen.value = false;
  resolver.value?.(null);
}

// 確定
function confirm() {
  isOpen.value = false;
  const result = {
    left: selectedLeft.value,
    center:
      leftType.value === 0 || leftType.value === 2
        ? selectedCenterMulti.value
        : selectedCenter.value,
    right: selectedRightMulti.value,
  };
  emit("selected", result);
  resolver.value?.(result);
}
</script>
