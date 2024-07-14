<template>
  <div class="route-management w-full h-full flex flex-col">
    <el-card shadow="never" class="mb-[0.4rem] !border-none">
      <el-space>
        <el-button type="primary" @click="handleCreate">新建路由</el-button>
        <el-button type="warning" @click="handleSort" v-if="!isSort"
          >修改排序</el-button
        >
        <template v-else>
          <el-button type="success" @click="handleConfirmSort">更新</el-button>
          <el-button @click="getData">取消</el-button>
        </template>
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
          default-expand-all
          :key="tableKey"
          :expand-row-keys="expandRowsId"
          @expand-change="handleExpandRow"
          :class="isSort ? 'select-none' : ''"
        >
          <el-table-column label="路由名" prop="title"></el-table-column>
          <el-table-column label="访问路径" prop="path"></el-table-column>
          <el-table-column label="组件路径" prop="component" width="300">
            <template #default="{ row }">
              {{ row.component ? row.component : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="图标" prop="icon" align="center">
            <template #default="{ row }">
              <el-icon>
                <component
                  :is="Icons[row.icon as keyof typeof Icons]"
                ></component>
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template #default="{ row }">
              <span>{{ formatDate(row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row.id)"
                >编辑</el-button
              >
              <el-button link>详情</el-button>
              <el-tooltip
                content="具有子路由的路由不可删除"
                v-if="row.children.length"
              >
                <el-button
                  link
                  type="danger"
                  :disabled="Boolean(row.children.length)"
                  >删除</el-button
                >
              </el-tooltip>
              <el-popconfirm
                v-else
                title="删除后路由后将不可恢复, 确定删除吗?"
                width="20rem"
                @confirm="handleDelete(row.id)"
                @cancel="messageInfo('已取消操作')"
              >
                <template #reference>
                  <el-button link type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
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
import { deleteRouteById, updateRouteOrder } from '../../http/api/route'
import { noticeSuccess } from '../../utils/Notification/index'
import { messageInfo } from '@/utils/message'
import * as Icons from '@element-plus/icons-vue'
import { formatDate } from '../../utils/formatDate/index'

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

// 新建路由
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

// 排序
const isSort = ref<boolean>(false)

let sortable: any = null
const handleSort = () => {
  isSort.value = true
  initSortable()
}
const handleConfirmSort = async () => {
  isSort.value = false
  initSortable()

  // 将树形结构展开
  const routeList = flattenArray(tableData.value)

  const orderData: OrderProps[] = routeList.map((route) => {
    return { id: route.id!, order: route.order }
  })

  await updateRouteOrder(orderData)
  noticeSuccess('更新排序成功')
  getData()
}
// 初始化 sortable
const initSortable = () => {
  if (!isSort.value) {
    sortable.destroy()
    return
  }
  // 获取元素
  const el = document.querySelector('.el-table__body-wrapper tbody') as any

  sortable = new Sortable(el, {
    // sort: isSort.value,
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
      // 将数组扁平化
      const newTable = flattenArray(table) as RouteDataProps[]

      const sourceObj = newTable[oldIndex]
      const targetObj = newTable[newIndex]
      // 判断是否为同一级
      if (
        (!sourceObj.parentId && !targetObj.parentId) ||
        sourceObj.parentId === targetObj.parentId
      ) {
        const currRow = newTable.splice(oldIndex, 1)[0]
        newTable.splice(newIndex, 0, currRow)

        // 更新 order 字段
        let len = newTable.length
        newTable.forEach((route, idx) => {
          route.order = len - idx
        })

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
  tableData.value = data
}

const getData = () => {
  getAllRouteList()
}

// 编辑
const handleEdit = (id: string) => {
  routeDialogData.value.id = id
  routeDialogData.value.isShow = true
  routeDialogData.value.type = 'edit'
}

// 删除
const handleDelete = async (id: string) => {
  await deleteRouteById(id)
  noticeSuccess('删除路由成功')
  getData()
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped></style>
