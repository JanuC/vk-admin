<template>
  <div class="user-operation-logs w-full h-full flex flex-col">
    <el-card shadow="never" class="mb-[0.4rem] !border-none flex justify-end">
      <el-space class="w-full flex justify-between">
        <el-form inline class="h-[3.2rem]" :model="queryForm" ref="queryFormRef">
          <el-form-item prop="filterVal">
            <el-input placeholder="用户名/操作模块/操作类型" v-model="queryForm.filterVal" clearable style="width: 20rem"></el-input>
          </el-form-item>
          <el-form-item label="请求方式:" prop="method">
            <el-select v-model="queryForm.method" placeholder="请选择请求方式" clearable style="width: 15rem">
              <el-option label="Get" value="GET"></el-option>
              <el-option label="Post" value="POST"></el-option>
              <el-option label="Patch" value="PATCH"></el-option>
              <el-option label="Put" value="PUT"></el-option>
              <el-option label="Delete" value="DELETE"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作结果:" prop="status">
            <el-select v-model="queryForm.status" placeholder="请选择操作结果" clearable style="width: 15rem">
              <el-option label="操作成功" :value="1"></el-option>
              <el-option label="操作失败" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间:" prop="date">
            <el-date-picker
              v-model="queryForm.date"
              type="datetimerange"
              :default-time="defaultTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button @click="handleResetFilter(queryFormRef)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-space>
    </el-card>
    <el-card shadow="never" class="flex-1 !border-none flex flex-col" body-class=" flex-1  min-h-0">
      <template #default>
        <el-table height="100%" :data="tableData" v-cLoading="loadingStore.isLoading && !userOperationLogDetailData.isShow">
          <!-- <el-table-column type="selection" width="55" :selectable="(row: UserProps) => Boolean(!row.isDefault)" /> -->
          <el-table-column label="序号" type="index" width="55" align="center" />
          <el-table-column label="操作模块" prop="moduleName"></el-table-column>
          <el-table-column label="操作类型" prop="action"></el-table-column>
          <el-table-column label="请求方式" prop="method"></el-table-column>
          <el-table-column
            label="请求地址"
            prop="url"
            :show-overflow-tooltip="{
              'popper-class': 'w-[30rem] max-h-[20rem] ',
            }"
          ></el-table-column>
          <el-table-column label="操作者" prop="operator"> </el-table-column>
          <el-table-column
            label="操作信息"
            prop="message"
            :show-overflow-tooltip="{
              'popper-class': 'w-[30rem] max-h-[20rem] ',
            }"
          >
          </el-table-column>
          <el-table-column label="操作时间">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作状态" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status == 1 ? 'success' : 'danger'">{{ row.status == 1 ? '成功' : '失败' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template #default="{ row }">
              <el-button link @click="handleDetail(row.id)">详情</el-button>
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
            :page-sizes="[20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @current-change="getTableData"
            @size-change="getTableData"
          />
        </div>
      </template>
    </el-card>
  </div>
  <UserOperationLogDetail v-model:userOperationLogDetailData="userOperationLogDetailData" />
</template>

<script lang="ts" setup name="UserOperationLogs">
import { getOperationLogsListByFilter } from '@/http/api/system'
import { useStore } from '@/store'
import { formatDate } from '@/utils/formatDate'
import { FormInstance } from 'element-plus'

const { loadingStore } = useStore()

const tableData = ref<OperationLogsProps[]>([])

const total = ref<number>(0)

const defaultTime: [Date, Date] = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]

const queryForm = ref<QueryOperationLogsProps>({
  filterVal: '',
  method: null,
  date: [],
  status: null,
  current: 1,
  pageSize: 20,
})

const queryFormRef = ref<FormInstance>()

const userOperationLogDetailData = ref<DetailDialogProps>({
  isShow: false,
  id: '',
})

const handleFilter = () => {
  getTableData()
}

const handleResetFilter = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getTableData()
}

const getTableData = async () => {
  loadingStore.setIsLoading(true)
  const { filterVal, method, date, current, pageSize, status } = queryForm.value
  const [startTime, endTime] = date ? date : []
  const { data } = await getOperationLogsListByFilter({
    filterVal,
    method,
    current,
    pageSize,
    status,
    startTime,
    endTime,
  })
  const { records, total: totalCount } = data
  total.value = totalCount
  tableData.value = records
  loadingStore.setIsLoading(false)
}

const handleDetail = (id: string) => {
  userOperationLogDetailData.value.isShow = true
  userOperationLogDetailData.value.id = id
}

onMounted(() => {
  getTableData()
})
</script>

<style lang="scss" scoped></style>
