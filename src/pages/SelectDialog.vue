<template>
  <v-dialog v-model="visible" max-width="900">
    <v-card class="pa-4" style="min-height: 420px; position: relative">
      <h3 class="mb-4">3階層選択</h3>

      <div class="three-columns">
        <!-- 左 -->
        <div>
          <h4>左</h4>
          <v-list>
            <v-list-item
              v-for="item in leftList"
              :key="item.id"
              @click="selectLeft(item)"
              :active="item.id === selectedLeft?.id"
            >
              {{ item.name }}
            </v-list-item>
          </v-list>
        </div>

        <!-- 中央 -->
        <div>
          <h4>中央</h4>
          <v-list>
            <v-list-item
              v-for="item in centerList"
              :key="item.id"
              @click="selectCenter(item)"
              :active="item.id === selectedCenter?.id"
            >
              {{ item.name }}
            </v-list-item>
          </v-list>
        </div>

        <!-- 右 -->
        <div>
          <h4>右</h4>
          <v-list>
            <v-list-item
              v-for="item in rightList"
              :key="item.id"
              @click="selectRight(item)"
              :active="item.id === selectedRight?.id"
            >
              {{ item.name }}
            </v-list-item>
          </v-list>
        </div>
      </div>

      <!-- 右下固定ボタン -->
      <div class="dialog-footer">
        <v-btn variant="text" @click="cancel">キャンセル</v-btn>
        <v-btn color="primary" @click="add">追加</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["selected"]);

const visible = ref(false);

/* ---------------- API ダミー ---------------- */
const apiLeft = () =>
  new Promise((r) =>
    setTimeout(
      () =>
        r([
          { id: 1, name: "左-1" },
          { id: 2, name: "左-2" },
          { id: 3, name: "左-3" },
        ]),
      200
    )
  );

const apiCenter = (leftId) =>
  new Promise((r) =>
    setTimeout(
      () =>
        r([
          { id: leftId * 10 + 1, name: `中央-${leftId}-1` },
          { id: leftId * 10 + 2, name: `中央-${leftId}-2` },
        ]),
      200
    )
  );

const apiRight = (centerId) =>
  new Promise((r) =>
    setTimeout(
      () =>
        r([
          { id: centerId * 10 + 1, name: `右-${centerId}-1` },
          { id: centerId * 10 + 2, name: `右-${centerId}-2` },
        ]),
      200
    )
  );

/* ---------------- データ ---------------- */
const leftList = ref([]);
const centerList = ref([]);
const rightList = ref([]);

const selectedLeft = ref(null);
const selectedCenter = ref(null);
const selectedRight = ref(null);

/* ---------------- 選択処理 ---------------- */
async function selectLeft(item) {
  selectedLeft.value = item;
  selectedCenter.value = null;
  selectedRight.value = null;

  centerList.value = [];
  rightList.value = [];

  centerList.value = await apiCenter(item.id);
}

async function selectCenter(item) {
  selectedCenter.value = item;
  selectedRight.value = null;
  rightList.value = [];

  rightList.value = await apiRight(item.id);
}

function selectRight(item) {
  selectedRight.value = item;
}

/* ---------------- ボタン ---------------- */
function cancel() {
  visible.value = false;
}

function add() {
  emit("selected", {
    left: selectedLeft.value,
    center: selectedCenter.value,
    right: selectedRight.value,
  });
  visible.value = false;
}

/* ---------------- defineExpose ---------------- */
async function open() {
  visible.value = true;

  // 左を初期ロード
  leftList.value = await apiLeft();

  // 選択状態クリア
  selectedLeft.value = null;
  selectedCenter.value = null;
  selectedRight.value = null;
  centerList.value = [];
  rightList.value = [];
}

function close() {
  visible.value = false;
}

defineExpose({
  open,
  close,
});
</script>

<style scoped>
.three-columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.dialog-footer {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 16px;
}
</style>
