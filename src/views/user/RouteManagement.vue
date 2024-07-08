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
        <el-table height="100%" :data="tableData" row-key="id">
          <el-table-column label="路由名" prop="title"></el-table-column>
          <el-table-column label="访问路径" prop="path"></el-table-column>
          <el-table-column label="组件路径" prop="component"></el-table-column>
          <el-table-column label="图表" prop="icon"></el-table-column>
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import Sortable from 'sortablejs'

const tableData = ref<RouteDataProps[]>([
  {
    id: '1',
    path: '/test1',
    title: '测试1',
    component: '/1',
    icon: '',
    createTime: new Date(),
    updateTime: new Date(),
    children: [],
  },
  {
    id: '2',
    path: '/test2',
    title: '测试2',
    component: '/2',
    icon: '',
    createTime: new Date(),
    updateTime: new Date(),
    children: [
      {
        id: '5',
        path: '/test2.1',
        title: '测试2.1',
        component: '/2.1',
        icon: '',
        createTime: new Date(),
        updateTime: new Date(),
      },
      {
        id: '6',
        path: '/test2.2',
        title: '测试2.2',
        component: '/2.2',
        icon: '',
        createTime: new Date(),
        updateTime: new Date(),
      },
      {
        id: '7',
        path: '/test2.3',
        title: '测试2.3',
        component: '/2.3',
        icon: '',
        createTime: new Date(),
        updateTime: new Date(),
      },
    ],
  },
  {
    id: '3',
    path: '/test3',
    title: '测试3',
    component: '/3',
    icon: '',
    createTime: new Date(),
    updateTime: new Date(),
    children: [],
  },
  {
    id: '4',
    path: '/test4',
    title: '测试4',
    component: '/4',
    icon: '',
    createTime: new Date(),
    updateTime: new Date(),
    children: [],
  },
])

const queryForm = ref<QueryRouteProps>({
  current: 1,
  pageSize: 10,
  title: '',
})

const total = ref<number>(0)

const handleCreate = () => {}

// 切换分页大小
const handleSizeChange = () => {}

// 切换分页
const handleCurrentChange = () => {}

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

    // onAdd(evt: any) {
    //   // 拖拽时候添加有新的节点的时候发生该事件
    //   console.log('onAdd.foo:', [evt.item, evt.from])
    // },
    // onUpdate(evt: any) {
    //   // 拖拽更新节点位置发生该事件
    //   console.log('onUpdate.foo:', [evt.item, evt.from])
    // },
    // onRemove(evt: any) {
    //   // 删除拖拽节点的时候促发该事件
    //   console.log('onRemove.foo:', [evt.item, evt.from])
    // },
    // onStart(evt: any) {
    //   // 开始拖拽出发该函数
    //   console.log('onStart.foo:', [evt.item, evt.from])
    // },
    // onSort(evt: any) {
    //   // 发生排序发生该事件
    //   console.log('onUpdate.foo:', [evt.item, evt.from])
    // },

    // 关键代码
    onEnd(evt: any) {
      // 结束拖拽
      console.log(evt)

      console.log(
        '结束表格拖拽',
        `拖动前索引${evt.oldIndex}---拖动后索引${evt.newIndex}`
      )
      // const item = tableData.value.splice(evt.oldIndex, 1)[0]
      // tableData.value.splice(evt.newIndex, 0, item)

      // console.log(tableData.value)

      // getList(evt)
      // console.log('table', tableData.value)
    },
  })
}

onMounted(() => {
  initSortable()
})
</script>

<style lang="scss" scoped></style>
