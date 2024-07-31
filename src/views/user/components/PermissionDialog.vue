<template>
  <el-dialog :model-value="permissionDialogData.isShow" :close-on-click-modal="false">
    <template #header>
      <Title :title="computedTitle(permissionDialogData.type)" />
    </template>
    <el-descriptions v-if="permissionDialogData.type === 'detail' && permDetail" v-cLoading="loadingStore.isLoading && permissionDialogData.isShow" :column="1" border>
      <el-descriptions-item label="权限id:" label-class-name="w-[10rem]">{{ permDetail?.id }}</el-descriptions-item>
      <el-descriptions-item label="权限名:">{{ permDetail?.name }}</el-descriptions-item>
      <el-descriptions-item label="枚举值:">{{ permDetail?.enumVal }}</el-descriptions-item>
      <el-descriptions-item label="创建者:">{{ permDetail?.createBy }}</el-descriptions-item>
      <el-descriptions-item label="描述:">{{ permDetail?.desc ? permDetail?.desc : '-' }}</el-descriptions-item>
      <el-descriptions-item label="已分配角色:">
        <el-space>
          <el-tag v-for="item in permDetail.roles" :key="item.id">{{ item.name }}</el-tag>
        </el-space>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间:">{{ formatDate(permDetail!.createTime) }}</el-descriptions-item>
      <el-descriptions-item label="更新时间:">{{ formatDate(permDetail!.updateTime) }}</el-descriptions-item>
    </el-descriptions>
    <el-form v-else ref="permFormRef" :model="permForm" label-width="auto" v-cLoading="loadingStore.isLoading && permissionDialogData.isShow" :rules="permFormRules">
      <el-form-item label="权限名:" prop="name">
        <el-input v-model="permForm.name" clearable placeholder="请输入权限名"></el-input>
      </el-form-item>
      <el-form-item label="权限目录:" prop="isMenu">
        <el-radio-group v-model="permForm.isMenu" @change="handleChangeIsMenu">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="父级目录:" prop="parentId">
        <el-select v-model="permForm.parentId" clearable :disabled="Boolean(permForm.isMenu)" :placeholder="permForm.isMenu ? '权限目录没有父级目录' : '请选择权限目录'">
          <el-option v-for="item in permMenu" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="枚举值" prop="enumVal">
        <template #label>
          <el-tooltip content="唯一且不可变">
            <span class="flex items-center"
              >枚举值<el-icon><i-ep-infoFilled /></el-icon>:</span
            >
          </el-tooltip>
        </template>
        <el-input v-model="permForm.enumVal" clearable placeholder="请输入唯一枚举值"> </el-input>
      </el-form-item>
      <el-form-item label="描述:" prop="desc">
        <el-input type="textarea" clearable placeholder="请输入描述" v-model="permForm.desc" maxlength="100" show-word-limit :autosize="{ minRows: 4 }"></el-input>
      </el-form-item>
      <el-form-item label="分配角色:" prop="roleIds">
        <el-checkbox-group v-model="permForm.roleIds">
          <el-checkbox v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" :disabled="Boolean(item.isTopRole)" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-space v-if="permissionDialogData.type === 'detail'">
        <el-button @click="handleClose(permFormRef)">关闭</el-button>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </el-space>
      <el-space v-else>
        <el-button @click="handleClose(permFormRef)">取消</el-button>
        <el-button type="primary" @click="handleConfirm(permFormRef)">确认</el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="Perm-Dialog">
import { ModelRef } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { useStore } from '@/store/index'
import { getAllRoles } from '@/http/api/role'
import { noticeSuccess } from '@/utils/Notification/index'
import { createNewPerm, getPermById, getPermMenu, updatePermById } from '@/http/api/permission'
import { formatDate } from '@/utils/formatDate'

const permissionDialogData = defineModel<PermDialogProps>('permissionDialogData') as ModelRef<PermDialogProps>

const emits = defineEmits(['updateData'])

const { loadingStore } = useStore()

// 根据不同的 type 计算不同的 title
const computedTitle = computed(() => (type: string) => {
  if (type == 'create') return '新建权限'
  if (type == 'edit') return '编辑权限'
  return '权限详情'
})

const permForm = ref<PermFormProps>({
  name: '',
  enumVal: '',
  parentId: '',
  desc: '',
  isMenu: 1,
  roleIds: [],
})

const permFormRules = ref<FormRules<PermFormProps>>({
  name: [
    { required: true, message: '权限名不能为空', trigger: ['change', 'blur'] },
    {
      min: 4,
      max: 6,
      message: '权限名为4 - 6 位',
      trigger: ['change', 'blur'],
    },
  ],
  isMenu: [
    {
      validator: (_: any, __: string, callback: any) => {
        permFormRef.value?.validateField('parentId', () => {})
        callback()
      },
      trigger: ['change', 'blur'],
    },
  ],
  parentId: [
    {
      validator: (_: any, value: string, callback: any) => {
        if (!Boolean(permForm.value.isMenu) && !value) {
          callback(new Error('非目录项必须有父级目录'))
        }
        callback()
      },
      trigger: ['change', 'blur'],
    },
  ],
  enumVal: [
    {
      required: true,
      message: '权限枚举值不能为空',
      trigger: ['change', 'blur'],
    },
  ],
  roleIds: [
    {
      validator: (_: any, value: string, callback: any) => {
        if (!value.length) callback(new Error('请至少选择一个角色'))
        callback()
      },
      trigger: ['change', 'blur'],
    },
  ],
})

const permFormRef = ref<FormInstance>()

const permDetail = ref<PermDataProps>()

const roleList = ref<RoleProps[]>([])

const permMenu = ref<PermDataProps[]>([])

const handleEdit = () => {
  permissionDialogData.value.type = 'edit'
  permissionDialogData.value.id = permDetail!.value!.id
  getTargetPermById(permDetail!.value!.id)
}
const handleClose = (formEl: FormInstance | undefined) => {
  if (permissionDialogData.value.type !== 'detail') {
    if (!formEl) return
    formEl.resetFields()
  }
  permissionDialogData.value.id = ''
  permissionDialogData.value.isShow = false
}

const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) createOrUpdatePerm()
  })
}

const handleChangeIsMenu = (value: 0 | 1) => {
  if (value) {
    permForm.value.parentId = ''
  }
}

const getAllRoleList = async () => {
  const { data } = await getAllRoles()
  roleList.value = data
  // 将预设角色默认选中
  data.forEach((role) => {
    if (role.isTopRole && !permForm.value.roleIds.includes(role.id)) permForm.value.roleIds.push(role.id)
  })
}

const getTargetPermById = async (id: string) => {
  const { data } = await getPermById(id)

  permDetail.value = data
  const { name, roleIds, enumVal, desc, isMenu, parentId } = data
  permForm.value = { name, roleIds, enumVal, desc, isMenu, parentId }
}

const createOrUpdatePerm = async () => {
  const { id } = permissionDialogData.value
  if (id) {
    await updatePermById(id, { ...permForm.value })
    noticeSuccess('更新权限成功')
    handleClose(permFormRef.value)
  } else {
    await createNewPerm({ ...permForm.value })
    noticeSuccess('新建权限成功')
  }
  handleClose(permFormRef.value)
  emits('updateData')
}

const getPermMenuList = async () => {
  const { data } = await getPermMenu()
  permMenu.value = data
}

watch(
  () => [permissionDialogData.value.isShow, permissionDialogData.value.id, permissionDialogData.value.type],
  ([newShow, newId, newType]) => {
    if (newShow) {
      loadingStore.setIsLoading(true)
      if (newType !== 'detail') {
        getAllRoleList()
        getPermMenuList()
      }
      if (newId) getTargetPermById(newId as string)
      loadingStore.setIsLoading(false)
    }
  }
)
</script>

<style lang="scss" scoped></style>
