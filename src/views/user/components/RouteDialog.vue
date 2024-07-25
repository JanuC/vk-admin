<template>
  <el-dialog width="80rem" :model-value="routeDialogData.isShow" :close-on-click-modal="false" @close="handleClose(routeFormRef)">
    <template #header>
      <Title :title="computedTitle(routeDialogData.type)" />
    </template>
    <el-descriptions v-if="routeDialogData.type === 'detail'" v-cLoading="loadingStore.isLoading" :column="2" border>
      <el-descriptions-item label="权限id:" label-class-name="w-[10rem]" :span="2">{{ routeDetail?.id }}</el-descriptions-item>
      <el-descriptions-item label="路由图标:" label-class-name="w-[10rem]">
        <template v-if="routeDetail?.icon">
          <el-icon>
            <component :is="ElIcons[routeDetail.icon as keyof typeof ElIcons]"></component>
          </el-icon>
        </template>
        <template v-else>-</template>
      </el-descriptions-item>
      <el-descriptions-item label="路由名:" label-class-name="w-[10rem]">{{ routeDetail?.title }}</el-descriptions-item>
      <el-descriptions-item label="访问路径:" label-class-name="w-[10rem]">{{ routeDetail?.path }}</el-descriptions-item>
      <el-descriptions-item label="组件路径:" label-class-name="w-[10rem]">{{ routeDetail?.component ? routeDetail?.component : '-' }}</el-descriptions-item>
      <el-descriptions-item label="顶级路由:" label-class-name="w-[10rem]">
        <el-tag :type="routeDetail?.isTopRoute ? 'success' : 'danger'">{{ routeDetail?.isTopRoute ? '是' : '否' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="父路由:" label-class-name="w-[10rem]">
        <template v-if="routeDetail?.parent">
          <el-button link type="primary" @click="handleChangeRouteId(routeDetail.parent.id)">{{ routeDetail.parent.title }}</el-button>
        </template>
        <template v-else>-</template>
      </el-descriptions-item>
      <el-descriptions-item label="子路由:" label-class-name="w-[10rem]" :span="2">
        <template v-if="routeDetail?.children?.length">
          <el-space>
            <el-button link type="primary" v-for="child in routeDetail.children" @click="handleChangeRouteId(child.id)">{{ child.title }}</el-button>
          </el-space>
        </template>
        <template v-else>-</template>
      </el-descriptions-item>
      <el-descriptions-item label="已分配角色:" label-class-name="w-[10rem]" :span="2">
        <el-space>
          <el-tag v-for="item in routeDetail?.roles" :key="item.id">{{ item.name }}</el-tag>
        </el-space>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间:" label-class-name="w-[10rem]" :span="2">{{ formatDate(routeDetail?.createTime!) }}</el-descriptions-item>
      <el-descriptions-item label="更新时间:" label-class-name="w-[10rem]" :span="2">{{ formatDate(routeDetail?.updateTime!) }}</el-descriptions-item>
    </el-descriptions>
    <el-form v-else ref="routeFormRef" :model="routeForm" label-width="auto" :rules="routeFormRules" v-cLoading="loadingStore.isLoading">
      <el-form-item prop="title">
        <template #label>
          <el-tooltip content="路由名称，对应title值">
            <div class="flex items-center cursor-pointer">路由名称<i-ep-infoFilled />:</div>
          </el-tooltip>
        </template>
        <el-input placeholder="请输入路由名" v-model="routeForm.title" clearable></el-input>
      </el-form-item>
      <el-form-item prop="isTopRoute">
        <template #label>
          <el-tooltip>
            <template #content>
              <div class="w-[20rem]">是否为顶级路由，本系统中顶级路由必需图标，且组件路径值为空，默认重定向至其第一个可访问子路由</div>
            </template>
            <div class="flex items-center cursor-pointer">顶级路由<i-ep-infoFilled />:</div>
          </el-tooltip>
        </template>
        <el-radio-group v-model="routeForm.isTopRoute">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="path">
        <template #label>
          <el-tooltip content="访问该路由的地址，唯一">
            <div class="flex items-center cursor-pointer">访问路径<i-ep-infoFilled />:</div>
          </el-tooltip>
        </template>
        <el-input placeholder="请输入访问路径" v-model="routeForm.path" clearable> </el-input>
      </el-form-item>
      <el-form-item prop="component">
        <template #label>
          <el-tooltip>
            <template #content>
              <div class="w-[20rem]">组件路径，如果该值为空，默认重定向到顶级路由第一个子路由</div>
            </template>
            <div class="flex items-center cursor-pointer">组件路径<i-ep-infoFilled />:</div>
          </el-tooltip>
        </template>
        <el-input placeholder="请输入组件路径" v-model="routeForm.component" clearable></el-input>
      </el-form-item>
      <el-form-item label="路由图标:" prop="icon">
        <template #label>
          <el-tooltip>
            <template #content>
              <div class="w-[20rem]">路由图标，本系统中顶级路由才需配置图标，其余路由一律为空</div>
            </template>
            <div class="flex items-center cursor-pointer">路由图标<i-ep-infoFilled />:</div>
          </el-tooltip>
        </template>
        <el-select :placeholder="Boolean(routeForm.isTopRoute) ? '请选择路由图标' : '非顶级路由无需图标'" v-model="routeForm.icon" filterable clearable :disabled="!Boolean(routeForm.isTopRoute)">
          <template #label>
            <div class="flex items-center">
              <el-icon>
                <component :is="Icons[routeForm.icon as keyof typeof Icons]"></component>
              </el-icon>
              <span class="ml-[1rem]">{{ routeForm.icon }}</span>
            </div>
          </template>
          <el-option v-for="(item, index) in Icons" :key="index" :value="item.name">
            <template #default>
              <div class="flex items-center">
                <el-icon>
                  <component :is="item"></component>
                </el-icon>
                <span class="ml-[1rem]">{{ item.name }}</span>
              </div>
            </template>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="parentId">
        <template #label>
          <el-tooltip>
            <template #content>
              <div class="w-[20rem]">本系统中，次级路由必须有且只有一个父级路由</div>
            </template>
            <div class="flex items-center cursor-pointer">父级路由<i-ep-infoFilled />:</div>
          </el-tooltip>
        </template>
        <el-select :placeholder="Boolean(routeForm.isTopRoute) ? '顶级路由无需父级路由' : '请选择父级路由'" v-model="routeForm.parentId" :disabled="Boolean(routeForm.isTopRoute)">
          <el-option v-for="item in parentRoute" :key="item.id" :value="item.id" :label="item.title" :disabled="routeDialogData.id === item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分配角色:" prop="roleIds">
        <template #label>
          <el-tooltip>
            <template #content>
              <div class="w-[20rem]">为该路由分配允许访问的角色</div>
            </template>
            <div class="flex items-center cursor-pointer">分配角色<i-ep-infoFilled />:</div>
          </el-tooltip>
        </template>
        <el-checkbox-group v-model="routeForm.roleIds">
          <el-checkbox v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" :disabled="Boolean(item.isTopRole)" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-space v-if="routeDialogData.type === 'detail'">
        <el-button @click="handleClose(routeFormRef)">关闭</el-button>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </el-space>
      <el-space v-else>
        <el-button @click="handleClose(routeFormRef)">取消</el-button>
        <el-button type="primary" @click="handleConfirm(routeFormRef)">确认</el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="RouteDialog">
import { ModelRef } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { getAllRoles } from '@/http/api/role'
import _ from 'lodash'
import * as Icons from '@element-plus/icons-vue'
import { noticeSuccess } from '@/utils/Notification'
import { getRouteById, updateRouteById } from '@/http/api/route'
import { createNewRoute, getRoutesIsParent } from '@/http/api/route'
import * as ElIcons from '@element-plus/icons-vue'
import { useStore } from '@/store/index'
import { formatDate } from '@/utils/formatDate'

const routeDialogData = defineModel<RouteDialogProps>('routeDialogData') as ModelRef<RouteDialogProps>

const emits = defineEmits(['updateData'])

const { loadingStore } = useStore()

// 根据不同的 type 计算不同的 title
const computedTitle = computed(() => (type: string) => {
  if (type == 'create') return '新建路由'
  if (type == 'edit') return '编辑路由'
  return '路由详情'
})

const routeForm = ref<RouteFormProps>({
  path: '',
  parentId: '',
  component: '',
  icon: '',
  roleIds: [],
  title: '',
  isTopRoute: 1,
})

const routeFormRef = ref<FormInstance>()

// 表单校验规则
const routeFormRules = reactive<FormRules<RouteFormProps>>({
  title: [
    {
      required: true,
      message: '路由名称不能为空',
      trigger: ['change', 'blur'],
    },
    {
      max: 6,
      min: 3,
      message: '路由名为 4 - 6 位',
      trigger: ['change', 'blur'],
    },
  ],
  path: [
    {
      required: true,
      message: '路由访问路径不能为空',
      trigger: ['change', 'blur'],
    },
  ],
  isTopRoute: [
    {
      required: true,
      message: '必须选择是否为顶级路由',
      trigger: ['change', 'blur'],
    },
    {
      validator: (_: any, __: string, callback: any) => {
        // if (value) {
        routeFormRef.value?.validateField('icon', () => {})
        routeFormRef.value?.validateField('component', () => {})
        routeFormRef.value?.validateField('parentId', () => {})
        // component
        // }
        callback()
      },
    },
  ],
  icon: {
    validator: (_: any, value: string, callback: any) => {
      const { isTopRoute } = routeForm.value
      if (Boolean(isTopRoute) && !value) {
        callback(new Error('顶级路由必须选择图标'))
      }
      if (!Boolean(isTopRoute) && value) {
        callback(new Error('非父级路由不需要图标'))
      }
      callback()
    },
    trigger: ['change', 'blur'],
  },
  // component: [
  //   {
  //     validator: (_: any, value: string, callback: any) => {
  //       const { isTopRoute } = routeForm.value
  //       // if (Boolean(isTopRoute) && value) {
  //       //   callback(new Error('父级路由无需组件路径'))
  //       // }
  //       // if (!Boolean(isTopRoute) && !value) {
  //       //   callback(new Error('子级路由必需组件路径'))
  //       // }
  //       callback()
  //     },
  //     trigger: ['change', 'blur'],
  //   },
  // ],
  parentId: [
    {
      validator: (_: any, value: string, callback: any) => {
        const { isTopRoute } = routeForm.value
        if (Boolean(isTopRoute) && value) {
          callback(new Error('顶级路由无需父级路由'))
        }
        if (!Boolean(isTopRoute) && !value) {
          callback(new Error('非顶级路由必需父级路由'))
        }
        callback()
      },
      trigger: ['change', 'blur'],
    },
  ],
  roleIds: [
    {
      validator: (_: any, value: string, callback: any) => {
        if (!value.length) {
          callback(new Error('至少需要为新路由分配一个角色'))
        }
        callback()
      },
      trigger: ['change', 'blur'],
    },
  ],
})

watch(
  () => routeForm.value.isTopRoute,
  (newVal) => {
    if (Boolean(newVal)) {
      // 当为顶级路由时，无需组件路径和父级路由
      routeForm.value.component = ''
      routeForm.value.parentId = ''
    } else {
      // 非顶级路由无需 icon
      routeForm.value.icon = ''
    }
  }
)

const roleList = ref<RoleProps[]>([])

// 获取所有角色
const getAllRoleList = async () => {
  const { data } = await getAllRoles()
  roleList.value = data
  // 将预设角色默认选中
  data.forEach((role) => {
    if (role.isTopRole && !routeForm.value.roleIds.includes(role.id)) routeForm.value.roleIds.push(role.id)
  })
}

// 获取所有父级路由
const parentRoute = ref<RouteDataProps[]>([])
const getParentRoutes = async () => {
  const { data } = await getRoutesIsParent()
  parentRoute.value = data
}

const handleEdit = () => {
  routeDialogData.value.type = 'edit'
  routeDialogData.value.id = routeDetail!.value!.id
  getTargetRoute(routeDetail!.value!.id)
}

// 点击关闭
const handleClose = (formEl: FormInstance | undefined) => {
  if (routeDialogData.value.type !== 'detail') {
    if (!formEl) return
    formEl.resetFields()
  }
  routeDialogData.value.id = ''
  routeDialogData.value.isShow = false
}

// 提交表单
const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) createOrUpdateRoute()
  })
}

watch(
  () => routeDialogData.value.id,
  (newId) => {
    if (newId) getTargetRoute(newId)
  }
)

// 获取目标路由
const routeDetail = ref<RouteDataProps>()
const getTargetRoute = async (id: string) => {
  const { data } = await getRouteById(id)

  routeDetail.value = data
  const { path, title, component, icon, parentId, isTopRoute, roleIds } = data
  routeForm.value = {
    path,
    title,
    component,
    icon,
    isTopRoute,
    parentId: parentId ? parentId : '',
    roleIds,
  }
}

//创建或者更新路由
const createOrUpdateRoute = async () => {
  const { id } = routeDialogData.value
  if (id) {
    await updateRouteById(id, { ...routeForm.value })
    noticeSuccess('更新路由成功')
  } else {
    await createNewRoute({
      ...routeForm.value,
    })
    noticeSuccess('新建路由成功')
  }
  handleClose(routeFormRef.value)
  emits('updateData')
}

const getData = () => {
  getAllRoleList()
  getParentRoutes()
}

// 切换当前选中的id
const handleChangeRouteId = (id: string) => {
  routeDialogData.value.id = id
}

watch(
  () => routeDialogData.value.isShow,
  (newVal) => {
    if (newVal) getData()
  }
)

// onMounted(() => {
//   getData()
// })
</script>

<style lang="scss" scoped></style>
