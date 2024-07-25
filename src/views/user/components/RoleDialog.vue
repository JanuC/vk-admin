<template>
  <el-dialog :model-value="roleDialogData.isShow" :close-on-click-modal="false" @close="handleClose(roleFormRef)">
    <template #header>
      <Title :title="computedTitle(roleDialogData.type)" />
    </template>
    <el-form :model="roleForm" label-width="auto" :rules="roleFormRules" ref="roleFormRef" v-cLoading="loadingStore.isLoading">
      <el-row justify="space-between">
        <el-col :span="10">
          <el-form-item label="角色名:" prop="name">
            <el-input v-model="roleForm.name" placeholder="请输入角色名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="enumVal">
            <template #label>
              <el-tooltip content="枚举值, 唯一且创建之后不可修改">
                <div class="flex items-center">枚举值<i-ep-infoFilled />:</div>
              </el-tooltip>
            </template>
            <el-input v-model="roleForm.enumVal" placeholder="请输入枚举值" :disabled="roleDialogData.type !== 'create'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="10">
          <el-form-item label="分配权限:">
            <tree :data="allPerms" :props="{ children: 'children', label: 'name' }" show-checkbox default-expand-all></tree>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="分配路由:"></el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-space v-if="roleDialogData.type === 'detail'">
        <el-button @click="handleClose(roleFormRef)">关闭</el-button>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </el-space>
      <el-space v-else>
        <el-button @click="handleClose(roleFormRef)">取消</el-button>
        <el-button type="primary" @click="handleConfirm(roleFormRef)">确认</el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="Role-Dialog">
import { ModelRef } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { createNewRole, getRoleById, updateRole } from '@/http/api/role'
import { noticeSuccess } from '@/utils/Notification/index'
import { useStore } from '@/store/index'
import { getAllPermList } from '@/http/api/permission'
const roleDialogData = defineModel<RoleDialogProps>('roleDialogData') as ModelRef<RoleDialogProps>

const { loadingStore } = useStore()

const emits = defineEmits(['updateData'])

const roleFormRef = ref<FormInstance>()

const roleForm = ref<RoleDialogFormProps>({
  name: '',
  // isDefault: 0,
  enumVal: '',
})

const roleFormRules = reactive<FormRules<RoleProps>>({
  name: [{ required: true, message: '角色名不能为空', trigger: ['change', 'blur'] }],
  enumVal: [{ required: true, message: '枚举值不能为空', trigger: ['change', 'blur'] }],
})

// 根据不同的 type 计算不同的 title
const computedTitle = computed(() => (type: string) => {
  if (type == 'create') return '新建角色'
  if (type == 'edit') return '编辑角色'
  return '角色详情'
})

// 关闭 dialog
const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  roleDialogData.value.isShow = false
  roleDialogData.value.id = ''
}

// 编辑按钮
const handleEdit = () => {
  roleDialogData.value.type = 'edit'
}

// 确认按钮
const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) createOrUpdateRole()
  })
}

const createOrUpdateRole = async () => {
  const { id } = roleDialogData.value
  const { name, enumVal } = roleForm.value
  if (id) {
    // 编辑操作
    await updateRole(id, { name, enumVal })
    noticeSuccess('更新角色成功')
    emits('updateData')
  } else {
    // 新建操作
    await createNewRole({ name, enumVal })
    noticeSuccess('新建角色成功')
    // 通知父组件更新数据
    emits('updateData')
  }
  handleClose(roleFormRef.value)
}

const allPerms = ref<PermDataProps[]>([])
const getAllPerms = async () => {
  const { data } = await getAllPermList()
  console.log(data)
  allPerms.value = data
}

watch(
  () => roleDialogData.value.isShow,
  (newVal) => {
    if (newVal) {
      getAllPerms()
    }
  }
)

watch(
  () => roleDialogData.value.id,
  (newId) => {
    if (newId) getTargetRole(newId)
  }
)

// 获取目标角色
const getTargetRole = async (id: string) => {
  const { data } = await getRoleById(id)
  roleForm.value = data
}
</script>

<style lang="scss" scoped></style>
