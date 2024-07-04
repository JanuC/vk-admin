<template>
  <MdEditor class="!w-full !h-full" v-model="text" />
</template>

<script lang="ts" setup>
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const text = ref('')
</script>

<style lang="scss" scoped></style>
