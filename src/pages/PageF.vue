<template>
  <!-- <v-container fluid>
    <div style="max-height: 400px; overflow-y: auto">
      <v-row
        class="border-b bg-white"
        style="position: sticky; top: 0; z-index: 10"
      >
        <v-col cols="4" class="text-center font-weight-bold border-e">左</v-col>
        <v-col cols="4" class="text-center font-weight-bold border-e"
          >中央</v-col
        >
        <v-col cols="4" class="text-center font-weight-bold">右</v-col>
      </v-row>

      <v-row v-for="(row, i) in items" :key="i" class="border-b">
        <v-col cols="4" class="border-e">
          <div class="w-100 text-truncate">
            {{ row.left.name }}
          </div>
        </v-col>

        <v-col cols="4" class="border-e">
          <template v-if="Array.isArray(row.center)">
            <div
              v-for="c in row.center"
              :key="c.id"
              class="w-100 text-truncate"
            >
              {{ c.name }}
            </div>
          </template>
          <template v-else-if="row.center">
            <div class="w-100 text-truncate">{{ row.center.name }}</div>
          </template>
        </v-col>

        <v-col cols="4">
          <div v-for="r in row.right" :key="r.id" class="w-100 text-truncate">
            {{ r.name }}
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container> -->
</template>

<script setup>
// const items = [
//   {
//     left: { id: 1, name: "左-1 左-1 左-1 左-1", type_layer: 0 },
//     center: [
//       { id: 101, name: "中央-1-1 中央-1-1 中央-1-1" },
//       { id: 102, name: "中央-1-2 とても長い名前テストテストテスト" },
//     ],
//     right: [],
//   },
//   {
//     left: { id: 1, name: "左-1 長い名前テストテスト", type_layer: 0 },
//     center: [],
//     right: [],
//   },
//   {
//     left: { id: 2, name: "左-2", type_layer: 1 },
//     center: { id: 203, name: "中央-2-3 上書きテスト" },
//     right: [
//       { id: 2031, name: "右-203-1 長いテキストテキストテキスト" },
//       { id: 2032, name: "右-203-2" },
//     ],
//   },
// ];
// //
// //
// //
// //
// //
// const data = [
//   {
//     left: { id: 1, name: "左-1", type_layer: 0 },
//     center: [
//       { id: 101, name: "中央-1-1" },
//       { id: 102, name: "中央-1-2" },
//     ],
//     right: [],
//   },
//   { left: { id: 1, name: "左-1", type_layer: 0 }, center: [], right: [] },
//   {
//     left: { id: 2, name: "左-2", type_layer: 1 },
//     center: { id: 203, name: "中央-2-3" },
//     right: [
//       { id: 2031, name: "右-203-1" },
//       { id: 2032, name: "右-203-2" },
//     ],
//   },
// ];

// // 文字列整形関数
// function formatData(data) {
//   return data.map((item) => {
//     const leftName = item.left.name;

//     let centerNames: string[] = [];
//     if (Array.isArray(item.center)) {
//       centerNames = item.center.map((c) => c.name);
//     } else if (item.center) {
//       centerNames = [item.center.name];
//     }

//     let rightNames: string[] = [];
//     if (Array.isArray(item.right)) {
//       rightNames = item.right.map((r) => r.name);
//     }

//     const parts = [leftName];
//     if (centerNames.length) parts.push(`(${centerNames.join(" | ")})`);
//     if (rightNames.length) parts.push(`(${rightNames.join(" | ")})`);

//     return { class_code: parts.join(" ") }; // オブジェクトに変換
//   });
// }

// // 使用例
// const obj = {
//   classList: formatData(data),
// };

// console.log(obj);
</script>
