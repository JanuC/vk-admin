<template>
  <div class="user-manamgement w-full h-full flex flex-col">
    <el-card shadow="never" class="mb-[0.4rem] !border-none">
      <el-space>
        <el-button type="primary" @click="handleCreate">新建角色</el-button>
        <el-button type="danger" :disabled="!selectedRows.length"
          >禁用选中</el-button
        >
        <span class="font-medium">筛选:</span>
        <el-form
          inline
          class="h-[3.2rem]"
          :model="queryForm"
          ref="queryFormRef"
        >
          <el-form-item label="角色名:" prop="name">
            <el-input
              placeholder="请输入角色名"
              v-model="queryForm.name"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button @click="handleResetFilter(queryFormRef)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-space>
    </el-card>
    <el-card
      shadow="never"
      class="flex-1 !border-none flex flex-col"
      body-class=" flex-1  min-h-0"
    >
      <template #default>
        <el-table
          height="100%"
          :data="tableData"
          @selection-change="handleSelectionChange"
          v-cLoading="loadingStore.isLoading && !roleDialogData.isShow"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="(row: RoleProps) => Boolean(!row.isDefault)"
          />
          <!-- <el-table-column label="角色id" prop="id"></el-table-column> -->
          <el-table-column label="角色名" prop="name"></el-table-column>
          <el-table-column label="预设角色" prop="isDefault" align="center">
            <template #default="{ row }">
              <el-text type="success" v-if="row.isDefault == 1">是</el-text>
              <el-text type="danger" v-else>否</el-text>
            </template>
          </el-table-column>
          <!-- <el-table-column label="角色数"></el-table-column>
          <el-table-column label="路由数"></el-table-column> -->
          <el-table-column label="创建时间">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="100"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row.id)"
                >编辑</el-button
              >
              <el-button link @click="handleDetail(row.id)">详情</el-button>
              <template v-if="row.isDefault">
                <el-tooltip content="预设角色不能禁用">
                  <el-button
                    link
                    type="warning"
                    :disabled="Boolean(row.isDefault)"
                    >禁用</el-button
                  >
                </el-tooltip>
                <el-tooltip content="预设角色不能删除">
                  <el-button
                    link
                    type="danger"
                    :disabled="Boolean(row.isDefault)"
                    >删除</el-button
                  >
                </el-tooltip>
              </template>
              <template v-else>
                <el-popconfirm
                  v-if="Boolean(row.isEnable)"
                  title="禁用后该角色将不可用, 确定禁用吗?"
                  width="20rem"
                  @confirm="handleChangeRoleStatus(row.id, 0)"
                  @cancel="messageInfo('已取消操作')"
                >
                  <template #reference>
                    <el-button type="warning" link>禁用</el-button>
                  </template>
                </el-popconfirm>
                <el-popconfirm
                  v-else
                  title="启用后该角色将恢复正常, 确定启用吗?"
                  width="20rem"
                  @confirm="handleChangeRoleStatus(row.id, 1)"
                  @cancel="messageInfo('已取消操作')"
                >
                  <template #reference>
                    <el-button link type="success">启用</el-button>
                  </template>
                </el-popconfirm>
                <el-popconfirm
                  title="删除后该角色将不可恢复, 确定删除吗?"
                  width="20rem"
                  @confirm="handlerDelRole(row.id)"
                  @cancel="messageInfo('已取消操作')"
                >
                  <template #reference>
                    <el-button
                      link
                      type="danger"
                      :disabled="Boolean(row.isDefault)"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </template>
            </template>
          </el-table-column>
          <template #empty>
            <NoData />
          </template>
        </el-table>
      </template>
      <template #footer>
        <div class="flex justify-around">
          <el-pagination
            class="text-center"
            v-model:current-page="queryForm.current"
            v-model:page-size="queryForm.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          />
        </div>
      </template>
    </el-card>
  </div>
  <RoleDialog
    v-model:roleDialogData="roleDialogData"
    @updateData="getTableData"
  />
</template>

<script lang="ts" setup>
import { getRoleList } from '@/http/api/role'
import { formatDate } from '../../utils/formatDate/index'
import { FormInstance } from 'element-plus'
import {
  getRoleListCount,
  changeRoleStatus,
  delRoleById,
} from '../../http/api/role'
import { noticeSuccess } from '../../utils/Notification/index'
import { messageInfo } from '@/utils/message'
import { useStore } from '../../store/index'

const { loadingStore } = useStore()

const queryForm = ref<QueryRoleProps>({
  name: '',
  current: 1,
  pageSize: 10,
})

const tableData = ref<RoleProps[]>([])

const total = ref<number>(0)

const queryFormRef = ref<FormInstance>()

// 获取数据
const getList = async () => {
  const { data } = await getRoleList({ ...queryForm.value })

  tableData.value = data
}

// 获取符合条件的数据长度
const getListCount = async () => {
  const { data } = await getRoleListCount({ ...queryForm.value })
  total.value = data
}

// 点击查询按钮
const handleFilter = () => {
  getTableData()
}

// 点击重置
const handleResetFilter = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getTableData()
}

const selectedRows = ref<UserProps[]>([])

// table 多选
const handleSelectionChange = (rows: UserProps[]) => {
  selectedRows.value = rows
}

// 获取 table 数据
const getTableData = () => {
  getList()
  getListCount()
}

const roleDialogData = reactive<RoleDialogProps>({
  isShow: false,
  type: 'edit',
  id: '',
})

// 新建用户按钮
const handleCreate = () => {
  roleDialogData.isShow = true
  roleDialogData.type = 'create'
}

// 编辑用户按钮
const handleEdit = (id: string) => {
  roleDialogData.isShow = true
  roleDialogData.type = 'edit'
  roleDialogData.id = id
}

// 用户详情按钮
const handleDetail = (id: string) => {
  roleDialogData.isShow = true
  roleDialogData.type = 'detail'
  roleDialogData.id = id
}

// 禁启用角色
const handleChangeRoleStatus = async (id: string, isEnable: number) => {
  await changeRoleStatus(id, { isEnable })
  const title = isEnable ? '启用' : '禁用'
  noticeSuccess(`${title}角色成功`)
  getTableData()
}

// 删除角色
const handlerDelRole = async (id: string) => {
  await delRoleById(id)
  noticeSuccess('删除角色成功')
  getTableData()
}

onMounted(() => {
  getTableData()
})
</script>

<style lang="scss" scoped></style>
