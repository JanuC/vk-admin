<template>
  <p class="text-2xl font-bold bg-red-900">Hello Tailwind!</p>
  <p>{{ test }}</p>
  <el-input v-model="test" style="width: 240px" placeholder="Please input">
    <template #suffix>
      <i-ep-search />
    </template>
  </el-input>
  <i-ep-search />
</template>

<script lang="ts" setup>
const test = ref(123)
</script>

<style lang="scss" scoped></style>
