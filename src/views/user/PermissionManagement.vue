<template>
  <div class="permission w-full h-full flex flex-col">
    <el-card shadow="never" class="mb-[0.4rem] !border-none">
      <el-space class="w-full flex justify-between">
        <el-button type="primary" @click="handleCreate">新建权限</el-button>
        <!-- <span class="font-medium">筛选:</span> -->
        <el-form
          inline
          class="h-[3.2rem]"
          :model="queryForm"
          ref="queryFormRef"
        >
          <el-form-item label="权限名:" prop="name">
            <el-input
              placeholder="请输入权限名"
              v-model="queryForm.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="枚举值:" prop="enumVal">
            <el-input
              placeholder="请输入枚举值"
              v-model="queryForm.enumVal"
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
      body-class=" flex-1 min-h-0"
    >
      <template #default>
        <el-table
          height="100%"
          row-key="id"
          :data="tableData"
          v-cLoading="loadingStore.isLoading && !permissionDialogData.isShow"
        >
          <el-table-column label="权限名" prop="name"></el-table-column>
          <el-table-column label="枚举值">
            <template #header>
              <el-tooltip content="唯一且不可更改">
                <span class="inline-flex items-center"
                  >枚举值 <el-icon><i-ep-infoFilled /></el-icon
                ></span>
              </el-tooltip>
            </template>
            <template #default="{ row }">{{ row.enumVal }}</template>
          </el-table-column>
          <el-table-column label="描述" prop="desc">
            <template #default="{ row }">{{
              row.desc ? row.desc : '-'
            }}</template>
          </el-table-column>
          <el-table-column label="创建者" prop="createBy"></el-table-column>
          <el-table-column label="创建时间">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作"></el-table-column>
          <template #empty>
            <NoData />
          </template>
        </el-table>
      </template>
    </el-card>
    <PermissionDialog
      v-model:permissionDialogData="permissionDialogData"
      @updateData="getData"
    />
  </div>
</template>

<script lang="ts" setup name="Perm">
import { getPermListByFilter } from '@/http/api/permission'
import { useStore } from '@/store'
import { FormInstance } from 'element-plus'
import { formatDate } from '../../utils/formatDate/index'

const { loadingStore } = useStore()

const tableData = ref<PermDataProps[]>([])

const permissionDialogData = ref<PermDialogProps>({
  isShow: false,
  id: '',
  type: 'create',
})

const queryForm = ref<QueryPermFormProps>({
  name: '',
  enumVal: '',
  type: '',
})

const queryFormRef = ref<FormInstance>()

// 新建
const handleCreate = () => {
  permissionDialogData.value.isShow = true
  permissionDialogData.value.type = 'create'
}

// 筛选
const handleFilter = () => {
  getData()
}

// 重置
const handleResetFilter = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getData()
}

// 获取 table 数据
// const getTableData = async () => {
//   const { data } = await getPermListByFilter({ ...queryForm.value })
//   tableData.value = data
// }

const getData = async () => {
  const { data } = await getPermListByFilter({ ...queryForm.value })
  console.log(data)

  tableData.value = data
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped></style>
