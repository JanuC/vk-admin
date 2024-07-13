<template>
  <div class="route-management w-full h-full flex flex-col">
    <el-card shadow="never" class="mb-[0.4rem] !border-none">
      <el-space>
        <el-button type="primary" @click="handleCreate">新建路由</el-button>
        <el-button type="danger">禁用选中</el-button>
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
          :data="tableData"
          row-key="id"
          :key="tableKey"
          :expand-row-keys="expandRowsId"
          @expand-change="handleExpandRow"
        >
          <el-table-column label="路由名" prop="title"></el-table-column>
          <el-table-column label="访问路径" prop="path"></el-table-column>
          <el-table-column label="组件路径" prop="component"></el-table-column>
          <el-table-column label="图表" prop="icon"></el-table-column>
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column label="操作"></el-table-column>
          <template #empty>
            <NoData />
          </template>
        </el-table>
      </template>
    </el-card>
  </div>
  <RouteDialog
    v-model:routeDialogData="routeDialogData"
    @updateData="getData"
  />
</template>

<script lang="ts" setup>
import Sortable from 'sortablejs'
import { flattenArray, unflattenArray } from '@/utils/flattenArray/index'
import { noticeError } from '@/utils/Notification/index'
import { getAllRoutes } from '@/http/api/route'

let tableData = ref<RouteDataProps[]>([])

const queryForm = ref<QueryRouteProps>({
  current: 1,
  pageSize: 10,
  title: '',
})

const total = ref<number>(0)

const routeDialogData = ref<RouteDialogProps>({
  type: 'create',
  id: '',
  isShow: false,
})

const handleCreate = () => {
  routeDialogData.value.isShow = true
}

// 切换分页大小
const handleSizeChange = () => {}

// 切换分页
const handleCurrentChange = () => {}

// 当前展开行的 id
const expandRowsId = ref<string[]>([])

// table key 值
const tableKey = ref<number>(0)

// 展开或者关闭行
const handleExpandRow = (row: RouteDataProps, expanded: boolean) => {
  if (expanded) {
    expandRowsId.value.push(row.id)
  } else {
    const idx = expandRowsId.value.findIndex((item) => item === row.id)
    expandRowsId.value.splice(idx, 1)
  }
}

// 初始化 sortable
const initSortable = () => {
  // 获取元素
  const el = document.querySelector('.el-table__body-wrapper tbody') as any

  const sortable = new Sortable(el, {
    // ms, number 单位：ms，定义排序动画的时间
    animation: 150,
    // 设置拖拽样式类名
    dragClass: 'drop-dragClass',
    // 设置拖拽停靠样式类名
    ghostClass: 'drop-ghostClass',
    // 设置选中样式类名
    chosenClass: 'drop-chosenClass',
    fallbackOnBody: true,

    // 关键代码
    onEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) {
      let table = Object.assign([], toRaw(tableData.value))
      const newTable = flattenArray(table) as RouteDataProps[]
      // 将数组扁平化
      const sourceObj = newTable[oldIndex]
      const targetObj = newTable[newIndex]
      // 判断是否为同一级
      if (
        (!sourceObj.parentId && !targetObj.parentId) ||
        sourceObj.parentId === targetObj.parentId
      ) {
        const currRow = newTable.splice(oldIndex, 1)[0]
        newTable.splice(newIndex, 0, currRow)
        let endTable = unflattenArray(newTable) as RouteDataProps[]
        tableData.value = endTable
      } else {
        noticeError('只能在同级之间进行拖拽排序')
        tableData.value = table
      }
      tableKey.value++
      nextTick(() => {
        // 重新初始化 sortablejs
        initSortable()
      })
    },
  })
}

// 获取所有路由
const getAllRouteList = async () => {
  const { data } = await getAllRoutes()
  console.log('d', data)

  tableData.value = data
}

const getData = () => {
  getAllRouteList()
}

onMounted(() => {
  // initSortable()
  getData()
})
</script>

<style lang="scss" scoped></style>
