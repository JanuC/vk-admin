<template>
  <el-dialog :model-value="roleDialogData.isShow" :close-on-click-modal="false" @close="handleClose(roleFormRef)">
    <template #header>
      <Title :title="computedTitle(roleDialogData.type)" />
    </template>
    <el-descriptions v-if="roleDialogData.type === 'detail'" v-cLoading="loadingStore.isLoading && roleDialogData.isShow" :column="2" border>
      <el-descriptions-item label="角色id:" label-class-name="w-[10rem]" :span="2">{{ roleDetail?.id }}</el-descriptions-item>
      <el-descriptions-item label="角色名:" label-class-name="w-[10rem]">{{ roleDetail?.name }}</el-descriptions-item>
      <el-descriptions-item label="枚举值:" label-class-name="w-[10rem]">{{ roleDetail?.enumVal }}</el-descriptions-item>
      <el-descriptions-item label="公共角色:" label-class-name="w-[10rem]">
        <el-tag :type="roleDetail?.isCommon ? 'success' : 'danger'">{{ roleDetail?.isCommon ? '是' : '否' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="预设角色:" label-class-name="w-[10rem]">
        <el-tag :type="roleDetail?.isDefault ? 'success' : 'danger'">{{ roleDetail?.isDefault ? '是' : '否' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="顶级角色:" label-class-name="w-[10rem]">
        <el-tag :type="roleDetail?.isTopRole ? 'success' : 'danger'">{{ roleDetail?.isTopRole ? '是' : '否' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="状态:" label-class-name="w-[10rem]">
        <el-tag :type="roleDetail?.isEnable ? 'success' : 'danger'">{{ roleDetail?.isEnable ? '启用' : '禁用' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="角色权限:" label-class-name="w-[10rem]  ">
        <template #default>
          <div class="w-full h-[15rem] overflow-y-auto">
            <tree :data="roleDetail?.permissions" :props="{ children: 'children', label: 'name' }"></tree>
          </div>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="角色路由:" label-class-name="w-[10rem]">
        <template #default>
          <div class="w-full h-[15rem] overflow-y-auto">
            <tree :data="roleDetail?.routes" :props="{ children: 'children', label: 'title' }"></tree>
          </div>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间:" label-class-name="w-[10rem]" :span="2">{{ formatDate(roleDetail?.createTime!) }}</el-descriptions-item>
      <el-descriptions-item label="更新时间:" label-class-name="w-[10rem]" :span="2">{{ formatDate(roleDetail?.updateTime!) }}</el-descriptions-item>
    </el-descriptions>
    <el-form v-else :model="roleForm" label-width="auto" :rules="roleFormRules" ref="roleFormRef" v-cLoading="loadingStore.isLoading && roleDialogData.isShow">
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
          <el-form-item label="分配权限:" prop="permIds">
            <tree
              :data="allPerms"
              :props="{ children: 'children', label: 'name' }"
              :key="new Date().getTime()"
              :show-checkbox="!roleDetail?.isTopRole"
              default-expand-all
              :default-checked-keys="roleForm.permIds"
              @check="handleCheckPerms"
            ></tree>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="分配路由:" prop="routeIds">
            <tree
              :data="allRoutes"
              :props="{ children: 'children', label: 'title' }"
              :key="new Date().getTime()"
              :show-checkbox="!roleDetail?.isTopRole"
              default-expand-all
              :default-checked-keys="roleForm.routeIds"
              @check="handleCheckRoutes"
            ></tree>
          </el-form-item>
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
import { getAllRouteList } from '@/http/api/route'
import { formatDate } from '@/utils/formatDate'

interface CheckedObjProps<T> {
  checkedNodes: T[]
  checkedKeys: string[]
  halfCheckedKeys: string[]
  halfCheckedNodes: T[]
}

const roleDialogData = defineModel<RoleDialogProps>('roleDialogData') as ModelRef<RoleDialogProps>

const { loadingStore } = useStore()

const emits = defineEmits(['updateData'])

const roleFormRef = ref<FormInstance>()

const roleForm = ref<RoleDialogFormProps>({
  name: '',
  // isDefault: 0,
  enumVal: '',
  permIds: [],
  routeIds: [],
})

const roleFormRules = reactive<FormRules<RoleDialogFormProps>>({
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
  if (roleDialogData.value.type !== 'detail') {
    if (!formEl) return

    formEl.resetFields()
  }
  roleDialogData.value.id = ''
  allRoutes.value = []
  roleDialogData.value.isShow = false
}

// 编辑按钮
const handleEdit = () => {
  roleDialogData.value.type = 'edit'
  roleDialogData.value.id = roleDetail!.value!.id
  getTargetRole(roleDetail.value!.id)
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

  if (id) {
    // 编辑操作

    await updateRole(id, { ...roleForm.value })
    noticeSuccess('更新角色成功')
    emits('updateData')
  } else {
    // 新建操作
    await createNewRole({ ...roleForm.value })
    noticeSuccess('新建角色成功')
    // 通知父组件更新数据
    emits('updateData')
  }
  handleClose(roleFormRef.value)
}

// 所有权限
const allPerms = ref<PermDataProps[]>([])
const getAllPerms = async () => {
  const { data } = await getAllPermList()
  allPerms.value = data
}

// 所有角色
const allRoutes = ref<RouteDataProps[]>([])
const getAllRoutes = async () => {
  const { data } = await getAllRouteList()
  allRoutes.value = data
}

// 获取选中的权限节点
const handleCheckPerms = (_: PermDataProps, checkedObject: CheckedObjProps<PermDataProps>) => {
  const { checkedKeys } = checkedObject
  // permMenuIds.value = halfCheckedKeys

  roleForm.value.permIds = checkedKeys
}

// 获取选中的路由节点
const handleCheckRoutes = (_: RouteDataProps, checkedObject: CheckedObjProps<RouteDataProps>) => {
  const { checkedKeys } = checkedObject
  // routeMenuIds.value = halfCheckedKeys
  roleForm.value.routeIds = checkedKeys
}

watch(
  () => [roleDialogData.value.isShow, roleDialogData.value.id, roleDialogData.value.type],
  ([newShow, newId, newType]) => {
    if (newShow) {
      loadingStore.setIsLoading(true)
      if (newType !== 'detail') {
        getAllRoutes()
        getAllPerms()
      }
      if (newId) getTargetRole(newId as string)
      loadingStore.setIsLoading(false)
    }
  }
)

// 是否为顶级角色，顶级角色不能配置权限和路由
// const isTopRole = ref<boolean>(false)

// 获取目标角色
const roleDetail = ref<RoleProps>()
const getTargetRole = async (id: string) => {
  const { data } = await getRoleById(id)
  roleDetail.value = data
  const { enumVal, name, permIds, routeIds } = data
  roleForm.value = { enumVal, name, permIds, routeIds }
}
</script>

<style lang="scss" scoped></style>
