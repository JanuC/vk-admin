<template>
  <el-dialog
    width="80rem"
    :model-value="routeDialogData.isShow"
    :close-on-click-modal="false"
    @close="handleClose(routeFormRef)"
  >
    <template #header>
      <Title :title="computedTitle(routeDialogData.type)" />
    </template>
    <el-form ref="routeFormRef" :model="routeForm" label-width="auto">
      <el-row justify="space-around">
        <el-col :span="10">
          <el-form-item>
            <template #label>
              <el-tooltip content="路由名称，对应title值">
                <div class="flex items-center cursor-pointer">
                  路由名称<i-ep-infoFilled />:
                </div>
              </el-tooltip>
            </template>
            <el-input
              placeholder="请输入路由名"
              v-model="routeForm.title"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <template #label>
              <el-tooltip content="访问该路由的地址，唯一">
                <div class="flex items-center cursor-pointer">
                  访问路径<i-ep-infoFilled />:
                </div>
              </el-tooltip>
            </template>
            <el-input
              placeholder="请输入访问路径"
              v-model="routeForm.path"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-around">
        <el-col :span="10">
          <el-form-item>
            <template #label>
              <el-tooltip>
                <template #content>
                  <div class="w-[20rem]">
                    是否为顶级路由，本系统中顶级路由必需图标，且组件路径值为空，默认重定向至其第一个可访问子路由
                  </div>
                </template>
                <div class="flex items-center cursor-pointer">
                  顶级路由<i-ep-infoFilled />:
                </div>
              </el-tooltip>
            </template>
            <el-radio-group v-model="routeForm.isTopRoute">
              <el-radio :value="1">是</el-radio>
              <el-radio :value="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="路由图标:">
            <template #label>
              <el-tooltip>
                <template #content>
                  <div class="w-[20rem]">
                    路由图标，本系统中顶级路由才需配置图标，其余路由一律为空
                  </div>
                </template>
                <div class="flex items-center cursor-pointer">
                  路由图标<i-ep-infoFilled />:
                </div>
              </el-tooltip>
            </template>
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-around">
        <el-col :span="10">
          <el-form-item>
            <template #label>
              <el-tooltip>
                <template #content>
                  <div class="w-[20rem]">
                    组件路径，本系统中顶级路由该值为空，默认重定向到顶级路由第一个子路由
                  </div>
                </template>
                <div class="flex items-center cursor-pointer">
                  组件路径<i-ep-infoFilled />:
                </div>
              </el-tooltip>
            </template>
            <el-input
              placeholder="请输入组件路径"
              v-model="routeForm.component"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <template #label>
              <el-tooltip>
                <template #content>
                  <div class="w-[20rem]">
                    本系统中，次级路由必须有且只有一个父级路由
                  </div>
                </template>
                <div class="flex items-center cursor-pointer">
                  父级路由<i-ep-infoFilled />:
                </div>
              </el-tooltip>
            </template>
            <el-select></el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-around">
        <el-col :span="22">
          <el-form-item label="分配角色:">
            <template #label>
              <el-tooltip>
                <template #content>
                  <div class="w-[20rem]">为该路由分配允许访问的角色</div>
                </template>
                <div class="flex items-center cursor-pointer">
                  分配角色<i-ep-infoFilled />:
                </div>
              </el-tooltip>
            </template>
            <el-checkbox-group v-model="routeForm.roleIds">
              <el-checkbox
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="Boolean(item.isTopRole)"
              />
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-space v-if="routeDialogData.type === 'detail'">
        <el-button @click="handleClose(routeFormRef)">关闭</el-button>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </el-space>
      <el-space v-else>
        <el-button @click="handleClose(routeFormRef)">取消</el-button>
        <el-button type="primary" @click="handleConfirm(routeFormRef)"
          >确认</el-button
        >
      </el-space>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="RouteDialog">
import { ModelRef } from 'vue'
import { FormInstance } from 'element-plus'
import { getAllRoles } from '../../../http/api/role'
import _ from 'lodash'
const routeDialogData = defineModel<RouteDialogProps>(
  'routeDialogData'
) as ModelRef<RouteDialogProps>

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
  isTopRoute: 0,
})

const routeFormRef = ref<FormInstance>()

const handleEdit = () => {}

const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  routeDialogData.value.isShow = false
  routeDialogData.value.id = ''
}

const handleConfirm = (formEl: FormInstance | undefined) => {}

const roleList = ref<RoleProps[]>([])

const getAllRoleList = async () => {
  const { data } = await getAllRoles()
  roleList.value = data
  // 将预设角色默认选中
  data.forEach((role) => {
    if (role.isTopRole) routeForm.value.roleIds.push(role.id)
  })
}

const getData = () => {
  getAllRoleList()
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped></style>
