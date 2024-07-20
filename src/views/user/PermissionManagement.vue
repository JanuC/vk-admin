<template>
  <div class="permission w-full h-full">权限</div>
</template>

<script lang="ts" setup>
const isLoading = ref<boolean>(true)
setTimeout(() => {
  isLoading.value = false
}, 1000)
</script>

<style lang="scss" scoped></style>
