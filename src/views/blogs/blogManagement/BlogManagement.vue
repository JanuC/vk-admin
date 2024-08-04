<template>
  <div class="blog-management w-full h-full flex flex-col">
    <el-card shadow="never" class="mb-[0.4rem] !border-none">
      <el-space class="w-full flex justify-between">
        <el-space>
          <el-button type="primary" @click="handleCreate" v-permission="['BLOG_CREATE']">新建博客</el-button>
        </el-space>
        <el-form inline class="h-[3.2rem]" :model="queryForm" ref="queryFormRef">
          <el-form-item label="博客名:" prop="title">
            <el-input placeholder="请输入博客名" v-model="queryForm.title"></el-input>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <!-- <el-input placeholder="请输入博客名" v-model="queryForm.status"></el-input> -->
            <el-select placeholder="请选择博客状态" v-model="queryForm.status" clearable style="width: 15rem">
              <el-option label="已发布" :value="1"></el-option>
              <el-option label="草稿" :value="0"></el-option>
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
    <el-card shadow="never" class="flex-1 !border-none flex flex-col" body-class=" flex-1 min-h-0">
      <template #default>
        <el-table height="100%" style="width: 100%" row-key="id" :data="tableData" v-cLoading="loadingStore.isLoading && !blogPreviewDialogData.isShow">
          <el-table-column label="序号" type="index" :index="coumutedIndex" width="55" align="center" fixed />
          <el-table-column label="博客名" prop="title" width="400" fixed></el-table-column>
          <el-table-column label="标签" width="300">
            <template #default="{ row }">
              <el-space>
                <el-tag v-for="item in row.tags" :key="item.id" :color="item.bgColor" :style="'color:' + item.textColor">{{ item.label }}</el-tag>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column
            label="描述"
            prop="desc"
            width="200"
            :show-overflow-tooltip="{
              'popper-class': 'w-[30rem] max-h-[20rem] ',
            }"
          >
            <template #default="{ row }">{{ row.desc ? row.desc : '-' }}</template>
          </el-table-column>
          <el-table-column label="浏览量" prop="viewCount" width="120" align="center"></el-table-column>
          <el-table-column label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status ? 'success' : 'warning'">{{ row.status ? '已发布' : '草稿' }}</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column label="权重" prop="order" width="140" align="center"></el-table-column> -->
          <el-table-column label="创建者" prop="createBy" width="180" align="center">
            <template #default="{ row }">
              {{ row.createBy.username }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="200">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="200">
            <template #default="{ row }">
              {{ formatDate(row.updateTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" min-width="220">
            <template #default="{ row }">
              <el-button link type="primary" v-permission="['BLOG_EDIT']" @click="handleEdit(row.id)">编辑</el-button>
              <el-button link @click="handlePreview(row.id)">预览</el-button>
              <el-button link type="success" @click="handleDownload(row.ossFileName, row.title)" v-permission="['BLOG_DOWNLOAD']">下载</el-button>
              <el-popconfirm title="删除博客后将不可恢复, 确定删除吗?" width="20rem" @confirm="handleDelete(row.id)" @cancel="messageInfo('已取消操作')">
                <template #reference>
                  <el-button link type="danger" v-permission="['BLOG_DELETE']">删除</el-button>
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
            @current-change="getBlogList"
            @size-change="getBlogList"
          />
        </div>
      </template>
    </el-card>
  </div>
  <BlogPreviewDialog v-model:blogPreviewDialogData="blogPreviewDialogData" />
</template>

<script lang="ts" setup>
import { deleteBlogById, downloadBlog, getBlogListByFilter } from '@/http/api/blog'
import { useStore } from '@/store'
import { formatDate } from '@/utils/formatDate'
import { messageInfo } from '@/utils/message'
import { noticeSuccess } from '@/utils/Notification'
import { FormInstance } from 'element-plus'

const { loadingStore } = useStore()

const router = useRouter()

const queryForm = ref<QueryBlogFormProps>({
  title: '',
  current: 1,
  pageSize: 10,
  status: null,
  date: [],
})

const tableData = ref<BlogProps[]>()

const total = ref<number>(0)

const queryFormRef = ref<FormInstance>()

const defaultTime: [Date, Date] = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]

const blogPreviewDialogData = ref<BlogPreviewDialogProps>({
  isShow: false,
  id: '',
})

const handleCreate = () => {
  router.push('/blogs/new')
}

const coumutedIndex = (index: number) => {
  const { pageSize, current } = queryForm.value

  return (current - 1) * pageSize + index + 1
}

const handleFilter = () => {
  getBlogList()
}

const handleResetFilter = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getBlogList()
}

const getBlogList = async () => {
  loadingStore.setIsLoading(true)
  const { title, status, date, current, pageSize } = queryForm.value

  const [startTime, endTime] = date ? date : []

  const { data } = await getBlogListByFilter({ title, status, startTime, endTime, current, pageSize })

  const { records, total: totalCount } = data

  tableData.value = records
  total.value = totalCount
  loadingStore.setIsLoading(false)
}

const handleEdit = (id: string) => {
  router.push({
    path: '/blogs/new',
    query: { id },
  })
}

const handlePreview = (id: string) => {
  blogPreviewDialogData.value.isShow = true
  blogPreviewDialogData.value.id = id
}

const handleDownload = async (fileName: string, title: string) => {
  const data = await downloadBlog({ fileName, title })

  const blob = new Blob([data])
  const link = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  link.href = url
  link.setAttribute('download', `${title}.md`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleDelete = async (id: string) => {
  await deleteBlogById(id)

  noticeSuccess('删除博客成功')

  getBlogList()
}

onMounted(() => {
  getBlogList()
})
</script>

<style lang="scss" scoped></style>
