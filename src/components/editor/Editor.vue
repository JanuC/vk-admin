<template>
  <MdEditor class="!w-full !h-full" v-model="content" />
</template>

<script lang="ts" setup>
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const content = defineModel<string>('content')
</script>

<style lang="scss" scoped></style>
