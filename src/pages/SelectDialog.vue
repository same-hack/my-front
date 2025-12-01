<template>
  <v-dialog v-model="model" max-width="900" @update:modelValue="onDialogToggle">
    <v-card class="pa-4" style="min-height: 420px; position: relative">
      <h3 class="mb-4">3階層選択</h3>

      <!-- ================================
           3 カラムレイアウト（左・中央・右）
           ================================ -->
      <div class="three-columns">
        <!-- ===== 左カラム ===== -->
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

        <!-- ===== 中央カラム ===== -->
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

        <!-- ===== 右カラム ===== -->
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

      <!-- ================================
           フッタボタン（キャンセル / 追加）
           常に右下に固定
           ================================ -->
      <div class="dialog-footer">
        <v-btn variant="text" @click="cancel"> キャンセル </v-btn>

        <v-btn color="primary" @click="add"> 追加 </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
/* =========================================================================================
   SelectDialog.vue
   - 3階層の選択を行うダイアログ
   - 左 → 中央 → 右 と選択すると絞り込みが起こり、最終結果を返す
   - API はダミー（setTimeout）で模擬的に非同期を再現
   ========================================================================================= */

import { ref, watch } from "vue";

/* 親から受け取るプロパティ
   v-model="modelValue" によりダイアログの開閉状態を管理 */
const props = defineProps({
  modelValue: Boolean,
});

/* 親へ返すイベント
   - update:modelValue … v-model 連携
   - selected … 「追加」ボタン押下時に選択結果を返す
*/
const emit = defineEmits(["update:modelValue", "selected"]);

/* ダイアログの内部状態（v-model 互換）
   props.modelValue と同期させて使う */
const model = ref(props.modelValue);
watch(
  () => props.modelValue,
  (v) => (model.value = v)
);

/* ===============================================================================
   ■ ダミー API（非同期で配列を返す）
      実際にはバックエンドと通信する想定
   =============================================================================== */
function apiLeft() {
  // 左の一覧を返す（固定のダミーデータ）
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: 1, name: "左-1" },
          { id: 2, name: "左-2" },
          { id: 3, name: "左-3" },
        ]),
      200
    )
  );
}

function apiCenter(leftId) {
  // 左の選択肢に応じて中央を返す
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: leftId * 10 + 1, name: `中央-${leftId}-1` },
          { id: leftId * 10 + 2, name: `中央-${leftId}-2` },
        ]),
      200
    )
  );
}

function apiRight(centerId) {
  // 中央の選択肢に応じて右を返す
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: centerId * 10 + 1, name: `右-${centerId}-1` },
          { id: centerId * 10 + 2, name: `右-${centerId}-2` },
        ]),
      200
    )
  );
}

/* ------------------ ダイアログ内部データ ------------------ */
const leftList = ref([]); // 左カラムの一覧
const centerList = ref([]); // 中央カラム
const rightList = ref([]); // 右カラム

/* ------------------ 選択中アイテム ------------------ */
const selectedLeft = ref(null);
const selectedCenter = ref(null);
const selectedRight = ref(null);

/* ===============================================================================
   ■ 左カラムがクリックされたとき
      - 左選択を更新
      - 中央と右をリセット
      - 中央を API でロード
   =============================================================================== */
async function selectLeft(item) {
  selectedLeft.value = item;

  // 中央以下の選択状態をクリア
  selectedCenter.value = null;
  selectedRight.value = null;
  centerList.value = [];
  rightList.value = [];

  // 非同期で中央カラムを取得
  centerList.value = await apiCenter(item.id);
}

/* ===============================================================================
   ■ 中央カラムがクリックされたとき
      - 中央選択を更新
      - 右をリセット
      - 右を API でロード
   =============================================================================== */
async function selectCenter(item) {
  selectedCenter.value = item;

  selectedRight.value = null;
  rightList.value = [];

  rightList.value = await apiRight(item.id);
}

/* ===============================================================================
   ■ 右カラムがクリックされたとき
      - 右の選択のみ更新
      ※ 右は最終階層のため、他のリセットは不要
   =============================================================================== */
function selectRight(item) {
  selectedRight.value = item;
}

/* ===============================================================================
   ■ ダイアログの開閉を監視
      開いた瞬間に左カラムの初期データをロードする
   =============================================================================== */
watch(model, async (isOpen) => {
  emit("update:modelValue", isOpen);

  if (isOpen) {
    // ダイアログを開いた瞬間、左のカラムを初期ロード
    leftList.value = await apiLeft();
  }
});

/* ===============================================================================
   ■ キャンセルボタン
      - ダイアログを閉じるだけ
      - 選択結果は返さない
   =============================================================================== */
function cancel() {
  model.value = false;
}

/* ===============================================================================
   ■ 追加ボタン
      - 現在の選択状態（左・中央・右）をまとめて emit
      - ダイアログを閉じる
   =============================================================================== */
function add() {
  emit("selected", {
    left: selectedLeft.value,
    center: selectedCenter.value,
    right: selectedRight.value,
  });

  model.value = false;
}

/* v-dialog の内部挙動を補完 */
function onDialogToggle(val) {
  model.value = val;
}
</script>

<style scoped>
/* 3 カラム並び */
.three-columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

/* 右下固定ボタン */
.dialog-footer {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 16px;
}
</style>
