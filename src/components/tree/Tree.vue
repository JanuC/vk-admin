<template>
  <el-tree class="w-full" :data="data" :props="props" node-key="id">
    <template #empty>
      <no-data></no-data>
    </template>
  </el-tree>
</template>

<script lang="ts" setup name="Tree">
// const defineProps = {
//   children: 'children',
//   label: 'name',
// }

defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  props: {
    type: Object,
    default: () => ({
      children: 'children',
      label: 'label',
    }),
  },
})
</script>

<style lang="scss" scoped></style>
