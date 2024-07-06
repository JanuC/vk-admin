<template>
  <div class="user-manamgement w-full h-full flex flex-col">
    <el-card shadow="never" class="mb-[0.4rem] !border-none">
      <el-space>
        <el-button type="primary" @click="handleCreate">新建用户</el-button>
        <el-button type="danger" :disabled="!selectedRows.length"
          >禁用选中</el-button
        >
        <span class="font-medium">筛选:</span>
        <el-form
          inline
          class="h-[3.2rem]"
          :model="queryFrom"
          ref="queryFormRef"
        >
          <el-form-item label="用户名:" prop="username">
            <el-input
              placeholder="请输入用户名"
              v-model="queryFrom.username"
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
      body-class=" flex-1"
    >
      <template #default>
        <el-table
          height="100%"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="昵称" prop="nickName"></el-table-column>
          <el-table-column label="角色数"></el-table-column>
          <el-table-column label="路由数"></el-table-column>
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
            <template #default>
              <el-button link type="success" @click="handleEdit"
                >编辑</el-button
              >
              <el-button link @click="handleDetail">详情</el-button>
              <el-button link type="warning">禁用</el-button>
              <el-button link type="danger">删除</el-button>
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
            v-model:current-page="queryFrom.current"
            v-model:page-size="queryFrom.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            hide-on-single-page
            :total="total"
          />
        </div>
      </template>
    </el-card>
  </div>
  <UserDialog v-model:userDialogData="userDialogData" />
</template>

<script lang="ts" setup>
import { getUserList, getUserListCount } from '@/http/api/user'
import { formatDate } from '../../utils/formatDate/index'
import { FormInstance } from 'element-plus'
import UserDialog from './components/UserDialog.vue'

const queryFrom = ref<QueryFormProps>({
  username: '',
  current: 1,
  pageSize: 10,
})

const tableData = ref<UserProps[]>([])

const total = ref<number>(0)

const queryFormRef = ref<FormInstance>()

// 获取数据
const getList = async () => {
  const { data } = await getUserList({ ...queryFrom.value })
  tableData.value = data
}

// 获取符合条件的数据长度
const getListCount = async () => {
  const { data } = await getUserListCount({ ...queryFrom.value })
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

const userDialogData = reactive<UserDialogProps>({
  isShow: false,
  type: 'edit',
})

// 新建用户按钮
const handleCreate = () => {
  userDialogData.isShow = true
  userDialogData.type = 'create'
}

// 编辑用户按钮
const handleEdit = () => {
  userDialogData.isShow = true
  userDialogData.type = 'edit'
}

// 用户详情按钮
const handleDetail = () => {
  userDialogData.isShow = true
  userDialogData.type = 'detail'
}

onMounted(() => {
  getTableData()
})
</script>

<style lang="scss" scoped></style>
