<template>
  <div>
    <el-dialog
      :model-value="userDialogData.isShow"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <template #header>
        <Title :title="computedTitle(userDialogData.type)" />
      </template>
      <template #footer>
        <el-space v-if="userDialogData.type === 'detail'">
          <el-button @click="closeDialog">关闭</el-button>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
        </el-space>
        <el-space v-else>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary">确认</el-button>
        </el-space>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="NewUser">
import { ModelRef } from 'vue'

const userDialogData = defineModel<UserDialogProps>(
  'userDialogData'
) as ModelRef<UserDialogProps>

const computedTitle = computed(() => (type: string) => {
  if (type == 'create') return '新建用户'
  if (type == 'edit') return '编辑用户'
  return '用户详情'
})

// 编辑按钮
const handleEdit = () => {
  userDialogData.value.type = 'edit'
}

// 关闭 dialog
const closeDialog = () => {
  userDialogData.value.isShow = false
}
</script>

<style lang="scss" scoped></style>
