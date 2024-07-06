<template>
  <el-space size="small" class="!cursor-pointer">
    <div class="left w-[0.4rem] h-[1.6rem] rounded"></div>
    <div class="right font-medium">{{ title }}</div>
  </el-space>
</template>

<script lang="ts" setup>
interface Props {
  title: string
}

const { title } = defineProps<Props>()
</script>

<style lang="scss" scoped>
.left {
  background-color: var(--el-color-primary);
}
</style>
