<template>
  <el-upload ref="uploadRef" action="#" :http-request="uploadAction" :show-file-list="props.showFileList" :before-upload="beforeUpload" :on-success="uploadSuccess" :on-error="uploadError">
    <el-button type="primary" :disabled="isUploading" link @click="handleClick">上传图片</el-button>
  </el-upload>
</template>

<script lang="ts" setup>
import { uploadImage } from '@/http/api/file'
import { fileSizeToString } from '@/utils/file'
import { messageError } from '@/utils/message'
import { noticeError, noticeSuccess } from '@/utils/Notification'
import { UploadInstance, UploadRawFile } from 'element-plus'

const props = defineProps({
  maxSize: {
    type: Number,
    default: 1024 * 1024 * 5,
  },
  showFileList: {
    type: Boolean,
    default: false,
  },
})

const emites = defineEmits(['getImageUrl'])

const uploadRef = ref<UploadInstance>()

const isUploading = ref<boolean>(false)

const handleClick = () => {
  uploadRef.value?.submit()
}

const beforeUpload = (rawFile: UploadRawFile) => {
  const { type, size } = rawFile

  const [fileType] = type.split('/')

  if (fileType !== 'image') {
    messageError('请选择图片文件')
    return false
  }

  if (size > props.maxSize) {
    messageError(`文件大小不可超过${fileSizeToString(props.maxSize)}`)
    return false
  }

  isUploading.value = true
}

const uploadAction = async (options: any) => {
  const { file } = options
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await uploadImage(formData)

  emites('getImageUrl', data.url)
}

const uploadSuccess = () => {
  isUploading.value = false
  noticeSuccess('上传图片成功')
}

const uploadError = () => {
  isUploading.value = false
  noticeError('上传图片失败')
}
</script>

<style lang="scss" scoped></style>
