<template>
  <v-card flat>
    <v-card-text>ステップ1：適当な内容</v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="$emit('next')">次へ</v-btn>
    </v-card-actions>
  </v-card>
</template>
