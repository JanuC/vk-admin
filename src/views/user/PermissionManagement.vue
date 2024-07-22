<template>
  <div class="permission w-full h-full flex flex-col">
    <el-card shadow="never" class="mb-[0.4rem] !border-none">
      <el-space class="w-full flex justify-between">
        <el-space>
          <el-button type="primary" @click="handleCreate">新建权限</el-button>
          <el-button type="warning" @click="handleSort" v-if="!isSort"
            >修改排序</el-button
          >
          <template v-else>
            <el-button type="success" @click="handleConfirmSort"
              >更新</el-button
            >
            <el-button @click="handleCancel">取消</el-button>
          </template>
        </el-space>
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
          :key="tableKey"
          :data="tableData"
          :expand-row-keys="expandRowsId"
          @expand-change="handleExpandRow"
          :class="isSort ? 'select-none' : ''"
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
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row.id)"
                >编辑</el-button
              >
              <el-button link @click="handleDetail(row.id)">详情</el-button>
              <el-tooltip
                content="具有子权限的目录不可删除"
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
                title="删除后该权限将不可恢复, 确定删除吗?"
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
    <PermissionDialog
      v-model:permissionDialogData="permissionDialogData"
      @updateData="getNewData"
      ref="permDailog"
    />
  </div>
</template>

<script lang="ts" setup name="Perm">
import {
  delPermById,
  getPermListByFilter,
  updatePermOrder,
} from '@/http/api/permission'
import { useStore } from '@/store'
import { FormInstance } from 'element-plus'
import { formatDate } from '../../utils/formatDate/index'
import { messageInfo } from '@/utils/message'
import { noticeError, noticeSuccess } from '@/utils/Notification'
import { flattenArray, unflattenArray } from '@/utils/flattenArray'
import Sortable from 'sortablejs'

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

const getData = async () => {
  const { data } = await getPermListByFilter({ ...queryForm.value })
  tableData.value = data
}

const handleEdit = (id: string) => {
  permissionDialogData.value.id = id
  permissionDialogData.value.type = 'edit'
  permissionDialogData.value.isShow = true
}

const handleDetail = (id: string) => {
  permissionDialogData.value.id = id
  permissionDialogData.value.type = 'detail'
  permissionDialogData.value.isShow = true
}

const handleDelete = async (id: string) => {
  await delPermById(id)
  noticeSuccess('删除权限成功')
  getData()
}

// 排序
const isSort = ref<boolean>(false)

// table key 值
const tableKey = ref<number>(0)

// 当前展开行的 id
const expandRowsId = ref<string[]>([])

// 展开或者关闭行
const handleExpandRow = (row: RouteDataProps, expanded: boolean) => {
  if (expanded) {
    expandRowsId.value.push(row.id)
  } else {
    const idx = expandRowsId.value.findIndex((item) => item === row.id)
    expandRowsId.value.splice(idx, 1)
  }
}

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

  await updatePermOrder(orderData)
  noticeSuccess('更新排序成功')
  getData()
}

const handleCancel = () => {
  isSort.value = false
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
      const newTable = flattenArray(table) as PermDataProps[]

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
        // let len = newTable.length

        newTable.forEach((route, idx) => {
          route.order = idx
        })

        let endTable = unflattenArray(newTable) as PermDataProps[]

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

const permDailog = ref<HTMLElement>()

const getNewData = () => {
  console.log(permDailog.value)

  if (!permissionDialogData.value.isShow) {
    getData()
  }
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped></style>
