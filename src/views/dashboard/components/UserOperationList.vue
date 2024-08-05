<template>
  <el-card class="w-full h-full" body-class="w-full h-full flex flex-col">
    <h2 class="mb-[2rem] font-medium">用户操作日志</h2>
    <el-timeline class="flex-1 min-h-0 px-[3rem] overflow-y-scroll" v-infinite-scroll="loadMoreData">
      <el-timeline-item
        :timestamp="formatDay(item.createTime)"
        :type="item.status == 1 ? 'success' : 'danger'"
        :icon="item.status == 1 ? Check : Close"
        placement="top"
        v-for="item in userOperationList"
        :key="item.id"
      >
        <el-card>
          <h4>{{ item.message }}</h4>
          <div class="flex justify-end"><el-button link type="primary" @click="handleDetail(item.id)">详情</el-button></div>
        </el-card>
      </el-timeline-item>
      <p v-if="userOperationList.length === total" class="text-center text-sm text-gray-400">没有更多了~</p>
    </el-timeline>
  </el-card>
  <UserOperationLogDetail v-model:userOperationLogDetailData="userOperationLogDetailData" />
</template>

<script lang="ts" setup>
import { getOperationLogListByUsername } from '@/http/api/system'
import { useStore } from '@/store'
import { formatDay } from '@/utils/formatDate'
import { Check, Close } from '@element-plus/icons-vue'

const userOperationList = ref<OperationLogsProps[]>([])

const { user } = useStore()

const { username } = user.userInfo

const queryForm = ref<Pick<QueryOperationLogsProps, 'current' | 'pageSize'>>({
  current: 0,
  pageSize: 20,
})

const total = ref<number>(-1)

const loadMoreData = async () => {
  if (userOperationList.value.length == total.value) return
  queryForm.value.current++
  const { data } = await getOperationLogListByUsername({
    ...queryForm.value,
    username,
  })

  const { records, total: totalCount } = data

  total.value = totalCount
  console.log('data', data)
  userOperationList.value = userOperationList.value.concat(records)
}

const userOperationLogDetailData = ref<DetailDialogProps>({
  isShow: false,
  id: '',
})
const handleDetail = (id: string) => {
  userOperationLogDetailData.value.id = id
  userOperationLogDetailData.value.isShow = true
}
</script>

<style lang="scss" scoped></style>
