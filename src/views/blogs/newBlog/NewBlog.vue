<template>
  <div class="new-blog w-full h-full">
    <el-form :model="newBlogForm" ref="newBlogFormRef" :rules="newBlogFormRules" label-width="auto" class="h-full flex flex-col" v-cLoading="loadingStore.isLoading && !isShowTabDialog">
      <el-row justify="space-between">
        <el-col :span="11">
          <el-row>
            <el-col :span="24">
              <el-form-item label="标题:" prop="title">
                <el-input v-model="newBlogForm.title" placeholder="请输入博客标题" clearable show-word-limit maxlength="60"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row justify="space-between">
            <el-col :span="10">
              <el-form-item label="标签:" class="w-full !flex" prop="tags">
                <el-select v-model="newBlogForm.tags" multiple collapse-tags filterable value-key="id" :multiple-limit="3" placeholder="请选择博客标签">
                  <el-option v-for="item in tagsData" :key="item.id" :label="item.label" :value="item" />
                  <template #tag>
                    <el-tag v-for="item in newBlogForm.tags" :key="item.id" :color="item.bgColor" closable :style="'color:' + item.textColor" @close="delTagBySelected(item.id)">{{
                      item.label
                    }}</el-tag>
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4"><el-button type="primary" @click="() => (isShowTabDialog = true)">管理</el-button></el-col>
            <el-col :span="8">
              <el-form-item label="状态:" prop="status">
                <el-radio-group v-model="newBlogForm.status">
                  <el-radio :value="1">正文</el-radio>
                  <el-radio :value="0">草稿</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="11">
          <el-form-item label="描述:" prop="desc">
            <el-input v-model="newBlogForm.desc" type="textarea" show-word-limit maxlength="200" :rows="3" clearable :autosize="{ minRows: 3, maxRows: 3 }" placeholder="请输入博客描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="h-full flex-1 min-h-0">
        <el-form-item label="正文:" class="w-full h-full" prop="content">
          <Editor v-model:content="newBlogForm.content" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="操作:" class="h-full flex items-center">
          <el-button :type="route.query.id ? 'success' : 'primary'" @click="handleSave(newBlogFormRef)">
            {{ route.query.id ? '更新' : '保存' }}
          </el-button>
          <el-popconfirm title="重置后将丢失所有内容, 确定重置吗?" width="20rem" @confirm="handleReset(newBlogFormRef)" @cancel="messageInfo('已取消操作')">
            <template #reference>
              <el-button type="warning">重置</el-button>
            </template>
          </el-popconfirm>
        </el-form-item>
      </el-row>
    </el-form>
    <BlogTagDialog v-model:isBlogTabDialogShow="isShowTabDialog" @getNewData="getBlogTagList" />
  </div>
</template>

<script lang="ts" setup>
import { createNewBlog, getBlogById, updateBlogById } from '@/http/api/blog'
import { getBlogTags } from '@/http/api/blogTag'
import { useStore } from '@/store'
import { messageInfo } from '@/utils/message'
import { noticeSuccess } from '@/utils/Notification'
import { FormInstance, FormRules } from 'element-plus'

const { loadingStore } = useStore()

const route = useRoute()

const router = useRouter()

// 博客表单
const newBlogForm = ref<newBlogProps>({
  title: '',
  tags: [],
  desc: '',
  status: 1,
  content: '',
})

const newBlogFormRef = ref<FormInstance>()

const newBlogFormRules = ref<FormRules<newBlogProps>>({
  title: [
    { required: true, message: '请输入博客标题', trigger: ['change', 'blur'] },
    { min: 4, max: 60, message: '博客标题为4 - 60 个字符', trigger: ['change', 'blur'] },
  ],
  desc: {
    max: 200,
    message: '博客描述最多200个字符',
    trigger: ['change', 'blur'],
  },
  tags: {
    required: true,
    validator: (_: any, value: TagProps[], callback: (errMsg?: Error) => void) => {
      console.log(value)
      if (!value.length) callback(new Error('至少选择一个标签'))
      callback()
    },
    trigger: ['change', 'blur'],
  },
  content: [
    {
      required: true,
      message: '请输入博客正文',
      trigger: ['change', 'blur'],
    },
  ],
})

// 标签分类数据
const tagsData = ref<TagProps[]>([])

// 控制 dialog 显示/隐藏
const isShowTabDialog = ref<boolean>(false)

/**
 * 从已选中的 tag 中删除点击的 tag
 * @param id {string} 所点击的 tag 的 id
 */
const delTagBySelected = (id: string) => {
  let idx = newBlogForm.value.tags.findIndex((item) => item.id === id)
  newBlogForm.value.tags.splice(idx, 1)
  newBlogFormRef.value?.validateField('tags')
}

/**
 * 获取所有标签
 */
const getBlogTagList = async () => {
  const { data } = await getBlogTags('')
  tagsData.value = data
}

const handleSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) createOrUpdateBlog()
  })
}

const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  router.replace('/blogs/new')
}

const createOrUpdateBlog = async () => {
  if (route.query.id) {
    await updateBlogById(route.query.id as string, { ...newBlogForm.value })
    noticeSuccess('更新博客成功')
  } else {
    await createNewBlog({ ...newBlogForm.value })
    noticeSuccess('新建博客成功')
  }

  handleReset(newBlogFormRef.value)
}

const getTargetBlog = async (id: string) => {
  const { data } = await getBlogById(id)

  const { title, tags, status, content, desc } = data

  newBlogForm.value = { title, tags, status, content: content!, desc }
}

const getData = () => {
  loadingStore.setIsLoading(true)
  getBlogTagList()
  const { query } = route

  if (query && query.id) {
    console.log(123)
    getTargetBlog(query.id as string)
  }

  loadingStore.setIsLoading(false)
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped></style>
