<template>
  <v-dialog v-model="isOpen" max-width="900px">
    <v-card class="pa-4" height="500px">
      <h2 class="mb-4">3階層ダイアログ</h2>

      <div class="d-flex" style="height: 350px; min-height: 0">
        <!-- 左エリア -->
        <div class="scroll-area pa-2 border">
          <h3>左</h3>
          <v-list>
            <v-list-item
              v-for="item in leftItems"
              :key="item.id"
              :active="selectedLeft?.id === item.id"
              @click="selectLeft(item)"
            >
              {{ item.name }}
            </v-list-item>
          </v-list>
        </div>

        <!-- 中央エリア -->
        <div class="scroll-area pa-2 border">
          <h3>中央</h3>

          <!-- チェックボックスパターン -->
          <template v-if="leftType === 0 || leftType === 2">
            <v-checkbox
              v-for="item in centerItems"
              :key="item.id"
              :label="item.name"
              v-model="selectedCenterMulti"
              :value="item"
            />
          </template>

          <!-- 通常選択 -->
          <template v-else>
            <v-list>
              <v-list-item
                v-for="item in centerItems"
                :key="item.id"
                :active="selectedCenter?.id === item.id"
                @click="selectCenter(item)"
              >
                {{ item.name }}
              </v-list-item>
            </v-list>
          </template>
        </div>

        <!-- 右エリア -->
        <div class="scroll-area pa-2 border">
          <h3>右</h3>

          <!-- 左=1（layer0） → 右なし -->
          <template v-if="leftType === 0">
            <div class="text-grey">右項目はありません</div>
          </template>

          <!-- 右チェックボックス -->
          <template v-else-if="leftType === 1 || leftType === 2">
            <v-checkbox
              v-for="item in rightItems"
              :key="item.id"
              :label="item.name"
              v-model="selectedRightMulti"
              :value="item"
            />
          </template>
        </div>
      </div>

      <!-- ボタン（右下固定） -->
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

// state
const selectedLeft = ref(null);
const selectedCenter = ref(null);
const selectedCenterMulti = ref([]);
const selectedRightMulti = ref([]);

const leftType = ref(null);

const leftItems = ref([]);
const centerItems = ref([]);
const rightItems = ref([]);

// fake APIs
function loadLeft() {
  leftItems.value = [
    { id: 1, name: "左-1", type_layer: 0 }, // 中央チェック
    { id: 2, name: "左-2", type_layer: 1 }, // 中央単一→右チェック
    { id: 3, name: "左-3", type_layer: 2 }, // 中央チェック→右チェック
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
    const items = [
      { id: cid * 10 + 1, name: `右-${cid}-1` },
      { id: cid * 10 + 2, name: `右-${cid}-2` },
    ];
    results.push(...items);
  }

  // 重複削除
  const uniq = [];
  const seen = new Set();
  for (const it of results) {
    if (!seen.has(it.id)) {
      uniq.push(it);
      seen.add(it.id);
    }
  }

  await new Promise((r) => setTimeout(r, 100));
  rightItems.value = uniq;
}

// handlers
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

function selectCenter(item) {
  selectedCenter.value = item;

  if (leftType.value === 1) {
    loadRightForCenters([item.id]);
  }
}

watch(
  selectedCenterMulti,
  (newVal) => {
    if (leftType.value === 2) {
      const ids = newVal.map((i) => i.id);
      if (ids.length > 0) {
        loadRightForCenters(ids);
      } else {
        rightItems.value = [];
        selectedRightMulti.value = [];
      }
    }
  },
  { deep: true }
);

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

function cancel() {
  isOpen.value = false;
  resolver.value?.(null);
}

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

  emit("selected", result); // ← ★ 追加したのはここだけ ★
  resolver.value?.(result);
}
</script>

<style scoped>
.border {
  border: 1px solid #ccc;
}

.scroll-area {
  width: 33%;
  overflow-y: auto;
  min-height: 0;
}
</style>
