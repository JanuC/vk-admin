<template>
  <MdEditor class="!w-full !h-full" v-model="content" @onUploadImg="handleUploadImage" />
</template>

<script lang="ts" setup>
import { uploadImage } from '@/http/api/file'
import { noticeSuccess } from '@/utils/Notification'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const content = defineModel<string>('content')

const handleUploadImage = async (files: Array<File>, callback: (urls: string[] | { url: string; alt: string; title: string }[]) => void) => {
  const formData = new FormData()

  formData.append('file', files[0])

  const { data } = await uploadImage(formData)

  noticeSuccess('上传图片成功')

  callback([data.url])
}
</script>

<style lang="scss" scoped></style>
