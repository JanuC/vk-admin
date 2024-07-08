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
          :model="queryForm"
          ref="queryFormRef"
        >
          <el-form-item label="用户名:" prop="username">
            <el-input
              placeholder="请输入用户名"
              v-model="queryForm.username"
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
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="(row: UserProps) => Boolean(!row.isDefault)"
          />
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="昵称" prop="nickName"></el-table-column>
          <el-table-column label="角色数" align="center">
            <template #default="{ row }">
              <el-text type="primary">{{ row.roles.length }}</el-text>
            </template>
          </el-table-column>
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
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row.id)"
                >编辑</el-button
              >
              <el-button link @click="handleDetail(row.id)">详情</el-button>
              <el-tooltip
                content="预设用户不能禁用"
                v-if="Boolean(row.isDefault)"
              >
                <el-button
                  link
                  type="warning"
                  :disabled="Boolean(row.isDefault)"
                  >禁用</el-button
                >
              </el-tooltip>
              <template v-else>
                <el-popconfirm
                  v-if="Boolean(row.isEnable)"
                  title="禁用后该用户将不能登录, 确定禁用吗?"
                  width="20rem"
                  @confirm="handleChang(row.id, 0)"
                  @cancel="messageInfo('已取消操作')"
                >
                  <template #reference>
                    <el-button type="danger" link>禁用</el-button>
                  </template>
                </el-popconfirm>
                <el-popconfirm
                  v-else="!row.isEnable"
                  title="启用后该用户将恢复正常, 确定禁启用吗?"
                  width="20rem"
                  @confirm="handleChang(row.id, 1)"
                  @cancel="messageInfo('已取消操作')"
                >
                  <template #reference>
                    <el-button type="success" link>启用</el-button>
                  </template>
                </el-popconfirm>
              </template>
              <el-tooltip
                content="预设用户不能删除"
                v-if="Boolean(row.isDefault)"
              >
                <el-button link type="danger" :disabled="Boolean(row.isDefault)"
                  >删除</el-button
                >
              </el-tooltip>
              <el-popconfirm
                v-else
                title="删除用户后将不可找回, 确定删除吗?"
                width="20rem"
                @confirm="handleDelete(row.id)"
                @cancel="messageInfo('已取消操作')"
              >
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
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
  <UserDialog
    v-model:userDialogData="userDialogData"
    @getNewData="getTableData"
  />
</template>

<script lang="ts" setup>
import { getUserList, getUserListCount } from '@/http/api/user'
import { formatDate } from '../../utils/formatDate/index'
import { FormInstance } from 'element-plus'
// import UserDialog from './components/UserDialog.vue'
import { deleteUserById, changeUserStatus } from '../../http/api/user'
import { noticeSuccess } from '../../utils/Notification/index'
import { messageInfo } from '@/utils/message'

const queryForm = ref<QueryFormProps>({
  username: '',
  current: 1,
  pageSize: 10,
})

const tableData = ref<UserProps[]>([])

const total = ref<number>(0)

const queryFormRef = ref<FormInstance>()

// 获取数据
const getList = async () => {
  const { data } = await getUserList({ ...queryForm.value })
  console.log(data)
  tableData.value = data
}

// 获取符合条件的数据长度
const getListCount = async () => {
  const { data } = await getUserListCount({ ...queryForm.value })

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
  id: '',
})

// 新建用户按钮
const handleCreate = () => {
  userDialogData.isShow = true
  userDialogData.type = 'create'
}

// 编辑用户按钮
const handleEdit = (id: string) => {
  userDialogData.isShow = true
  userDialogData.type = 'edit'
  userDialogData.id = id
}

// 用户详情按钮
const handleDetail = (id: string) => {
  userDialogData.isShow = true
  userDialogData.type = 'detail'

  userDialogData.id = id
}

// 删除用户
const handleDelete = async (id: string) => {
  await deleteUserById(id)
  noticeSuccess('删除用户成功')
  getTableData()
}

// 禁用用户
const handleChang = async (id: string, isEnable: 0 | 1) => {
  await changeUserStatus(id, { isEnable })
  const typeText = isEnable ? '启用' : '禁用'
  noticeSuccess(`${typeText}用户成功`)
  getTableData()
}

onMounted(() => {
  getTableData()
})
</script>

<style lang="scss" scoped></style>
