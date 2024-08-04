<template>
  <el-dialog :model-value="blogPreviewDialogData.isShow" width="70%" align-center :close-on-click-modal="false" @close="blogPreviewDialogData.isShow = false">
    <template #header>
      <Title title="博客详情" />
    </template>
    <el-skeleton v-if="loadingStore.isLoading" animated class="w-full">
      <template #template>
        <el-skeleton-item variant="h1" style="width: 40%" class="mb-[1rem]"></el-skeleton-item>
        <div class="flex justify-between mb-[1rem]">
          <el-skeleton-item variant="h3" style="width: 20%" class="mb-[1rem]"></el-skeleton-item>
          <el-skeleton-item variant="h3" style="width: 20%" class="mb-[1rem]"></el-skeleton-item>
          <el-skeleton-item variant="h3" style="width: 20%" class="mb-[1rem]"></el-skeleton-item>
          <el-skeleton-item variant="h3" style="width: 20%" class="mb-[1rem]"></el-skeleton-item>
        </div>
        <div class="flex justify-end mb-[1.3rem]">
          <el-skeleton-item variant="p" style="width: 94%"></el-skeleton-item>
        </div>
        <el-skeleton-item variant="p" class="mb-[1rem]"></el-skeleton-item>
        <el-skeleton-item variant="p" class="mb-[1rem]"></el-skeleton-item>
        <el-skeleton-item variant="p" class="mb-[1rem]"></el-skeleton-item>
        <el-skeleton-item variant="p" class="mb-[1rem]"></el-skeleton-item>
      </template>
    </el-skeleton>
    <div class="w-full min-h-[40vh] max-h-[80vh] flex flex-col" v-else>
      <h2 class="py-[1rem] font-bold text-xl px-[2rem] pb-[2rem]">{{ blogDetail?.title }}</h2>
      <div class="flex justify-between px-[2rem]">
        <el-space>
          <span>标签:</span>
          <el-tag v-for="item in blogDetail?.tags" :key="item.id" :color="item.bgColor" :style="'color:' + item.textColor">{{ item.label }}</el-tag>
        </el-space>
        <el-space>
          <span>状态</span>
          <el-tag :type="blogDetail?.status ? 'success' : 'warning'">{{ blogDetail?.status ? '已发布' : '草稿' }}</el-tag>
        </el-space>
        <p>浏览量: {{ blogDetail?.viewCount }}</p>
        <p>作者: {{ blogDetail?.createBy.username }}</p>
        <p>创建时间: {{ formatDate(blogDetail?.createTime!) }}</p>
      </div>
      <div class="mx-[2rem]">
        <el-divider class="!my-[2rem]" />
      </div>

      <div class="flex-1 overflow-y-auto flex px-[2rem]">
        <MdCatalog :editorId="id" :scrollElement="previewRef" />
        <!-- <div class="h-[20rem]"> -->
        <el-divider direction="vertical" class="!h-full" />
        <!-- </div> -->
        <MdPreview :editorId="id" :modelValue="blogDetail?.content" />
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup name="BlogPreview">
import { getBlogById } from '@/http/api/blog'
import { useStore } from '@/store'
import { formatDate } from '@/utils/formatDate'
import { ModelRef } from 'vue'
import { MdPreview, MdCatalog } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

const blogPreviewDialogData = defineModel('blogPreviewDialogData') as ModelRef<BlogPreviewDialogProps>

const { loadingStore } = useStore()

const blogDetail = ref<BlogProps>()

const previewRef = ref<HTMLElement>()

const id = 'preview-only'

watch(
  () => [blogPreviewDialogData.value.isShow, blogPreviewDialogData.value.id],
  async ([newIsShow, newId]) => {
    if (newIsShow) {
      loadingStore.setIsLoading(true)
      const { data } = await getBlogById(newId as string)
      blogDetail.value = data

      loadingStore.setIsLoading(false)
    }
  }
)
</script>

<style lang="scss" scoped></style>
