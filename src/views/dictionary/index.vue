<!-- <template>
  <div class="w-full h-full flex">
    <div class="w-full h-full bg-red-50 flex" v-if="!isLoading">
      <MdCatalog :editorId="id" :scrollElement="scrollElement" />
      <MdPreview :editorId="id" :modelValue="blogDetail?.content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getBlogById } from '@/http/api/blog'
import { MdPreview, MdCatalog } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

const blogDetail = ref<BlogProps>()

const id = 'preview-only'

// const scrollElement = document.documentElement
const scrollElement = ref<HTMLElement | null>(null)

const isLoading = ref<boolean>(false)

onMounted(async () => {
  isLoading.value = true
  const { data } = await getBlogById('01f3357f-466a-46ca-83a0-e12d0b0a7d15')
  console.log('d', data)

  blogDetail.value = data
  isLoading.value = false
})

onMounted(() => {
  scrollElement.value = document.documentElement
})
</script>

<style lang="scss" scoped></style> -->

<template>
  <div class="w-full h-full flex">
    <div class="w-full h-full bg-red-50 flex" v-if="!isLoading">
      <MdCatalog :editorId="id" :scrollElement="previewRef!" />
      <MdPreview :editorId="id" :modelValue="blogDetail?.content" ref="previewRef" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getBlogById } from '@/http/api/blog'
import { MdPreview, MdCatalog } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

const blogDetail = ref<BlogProps>()

const id = 'preview-only'

const previewRef = ref<HTMLElement>()

let scrollElement = ref<HTMLElement | null>(null)

const isLoading = ref<boolean>(false)

onMounted(async () => {
  isLoading.value = true
  const { data } = await getBlogById('01f3357f-466a-46ca-83a0-e12d0b0a7d15')
  console.log('d', data)

  blogDetail.value = data
  isLoading.value = false
})

onMounted(() => {
  // scrollElement.value = document.querySelector('.container .el-scrollbar .el-scrollbar__wrap')
})
</script>

<style lang="scss" scoped></style>
