<template>
  <div class="new-blog w-full h-full">
    <el-form :model="blogForm" label-width="auto" class="h-full flex flex-col">
      <el-row justify="space-between">
        <el-col :span="11">
          <el-row>
            <el-col :span="24">
              <el-form-item label="标题:">
                <el-input
                  v-model="blogForm.title"
                  placeholder="请输入博客标题"
                  clearable
                  show-word-limit
                  maxlength="60"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row justify="space-between">
            <el-col :span="10">
              <el-form-item label="标签:" class="w-full !flex">
                <el-select
                  v-model="blogForm.tags"
                  multiple
                  collapse-tags
                  value-key="id"
                  :multiple-limit="3"
                  placeholder="请选择博客标签"
                >
                  <el-option
                    v-for="item in tagsData"
                    :key="item.id"
                    :label="item.label"
                    :value="item"
                  />
                  <template #tag>
                    <el-tag
                      v-for="item in blogForm.tags"
                      :key="item.id"
                      :color="item.bgColor"
                      closable
                      :style="'color:' + item.textColor"
                      @close="delTagBySelected(item.id)"
                      >{{ item.label }}</el-tag
                    >
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4"
              ><el-button type="primary" @click="() => (isShowTabDialog = true)"
                >管理</el-button
              ></el-col
            >
            <el-col :span="8">
              <el-form-item label="状态:">
                <el-radio-group v-model="blogForm.status">
                  <el-radio :value="0">草稿</el-radio>
                  <el-radio :value="1">正文</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="11">
          <el-form-item label="描述:">
            <el-input
              v-model="blogForm.desc"
              type="textarea"
              show-word-limit
              maxlength="200"
              :rows="3"
              clearable
              :autosize="{ minRows: 3, maxRows: 3 }"
              placeholder="请输入博客描述"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="h-full flex-1">
        <el-form-item label="正文:" class="w-full">
          <Editor />
        </el-form-item>
      </el-row>
    </el-form>
    <el-dialog v-model="isShowTabDialog" align-center>
      <template #header>
        <el-space size="large">
          <span>标签管理</span>
          <el-button
            type="success"
            size="small"
            @click="isCreateTagDialogShow = true"
            >新建标签</el-button
          >

          <el-popconfirm
            title="删除后数据将不可找回, 确定删除吗?"
            width="20rem"
            @confirm="handleDelTag(false)"
            @cancel="cancelDelTag"
          >
            <template #reference>
              <el-button
                type="danger"
                size="small"
                :disabled="!selectTagsList.length"
                >删除选中</el-button
              >
            </template>
          </el-popconfirm>

          <span class="text-sm">筛选:</span>
          <el-input
            v-model="filterTagVal"
            size="small"
            placeholder="请输入标签名"
          />
          <el-button size="small" type="primary" @click="getBlogTagList"
            >查询</el-button
          >
        </el-space>
      </template>
      <el-table
        :data="tagsData"
        height="40rem"
        table-layout="auto"
        @selection-change="handleSelectTag"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="label" label="标签名" width="120">
          <template #default="{ row }">
            <el-input
              size="small"
              v-if="row.id === editTagId"
              v-model="row.label"
              show-word-limit
              maxlength="6"
            ></el-input>
            <span v-else>{{ row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="color"
          label="背景颜色"
          width="180"
          align="center"
        >
          <template #default="{ row }">
            <el-color-picker
              color-format="rgb"
              v-model="row.bgColor"
              :disabled="row.id !== editTagId"
              @active-change="(val: string) => row.bgColor = val"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="color"
          label="文字颜色"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-color-picker
              v-model="row.textColor"
              color-format="rgb"
              :disabled="row.id !== editTagId"
              @active-change="(val: string) => row.textColor = val"
            />
          </template>
        </el-table-column>
        <el-table-column label="标签效果" align="center" width="180">
          <template #default="{ row }">
            <el-tag :color="row.bgColor" :style="'color:' + row.textColor">{{
              row.label
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="所属文章数" align="center"></el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-col v-if="editTagId !== row.id">
              <el-button type="primary" link @click="handleEditTag(row)"
                >编辑</el-button
              >
              <el-popconfirm
                title="删除后数据将不可找回, 确定删除吗?"
                width="20rem"
                @confirm="handleDelTag(true, row.id)"
                @cancel="cancelDelTag"
              >
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
            </el-col>
            <el-col v-else>
              <el-button type="success" link @click="saveTag">保存</el-button>
              <el-button type="info" link @click="handleCacheEdit"
                >取消</el-button
              >
            </el-col>
          </template>
        </el-table-column>
        <template #empty>
          <NoData />
        </template>
      </el-table>
      <el-dialog v-model="isCreateTagDialogShow" align-center width="40rem">
        <template #header> 新建标签 </template>
        <el-form
          label-width="auto"
          class="w-[30rem] mx-auto"
          ref="newTagFormRef"
          :rules="newTagRules"
          :model="newTagForm"
        >
          <el-form-item label="效果预览:">
            <el-tag
              v-show="newTagForm.label"
              :color="newTagForm.bgColor"
              :style="'color:' + newTagForm.textColor"
              >{{ newTagForm.label }}</el-tag
            >
          </el-form-item>
          <el-form-item label="标签名:" prop="label">
            <el-input
              maxlength="6"
              size="small"
              placeholder="请输入新标签名"
              clearable
              show-word-limit
              v-model="newTagForm.label"
            ></el-input>
          </el-form-item>
          <el-form-item label="背景颜色:" prop="bgColor">
            <el-color-picker
              color-format="rgb"
              v-model="newTagForm.bgColor"
              @active-change="(val: string) => newTagForm.bgColor = val"
          /></el-form-item>
          <el-form-item label="文字颜色:" prop="textColor">
            <el-color-picker
              color-format="rgb"
              v-model="newTagForm.textColor"
              @active-change="(val: string) => newTagForm.textColor = val"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button
            type="warning"
            size="small"
            @click="resetNewTagForm(newTagFormRef)"
            >重置</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="submitNewTagForm(newTagFormRef)"
            >确定</el-button
          >
        </template>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  createNewBlogTag,
  delBlogTagByIds,
  getBlogTags,
  updateBlogTagById,
} from '@/http/api/blogTag'
import { noticeSuccess } from '@/utils/Notification'
import { messageInfo } from '@/utils/message'
import { FormInstance, FormRules } from 'element-plus'

interface BlogFormProps {
  title: string
  tags: TagProp[]
  desc: string
  status: 0 | 1
}

interface TagProp {
  id: string
  label: string
  bgColor: string
  textColor: string
  blogCount: number
  createTime: Date
  updateTime: Date
}

// 博客表单
const { blogForm } = reactive({
  blogForm: {
    title: '',
    tags: [],
    desc: '',
    status: 0,
  } as BlogFormProps,
})

// 标签分类数据
const tagsData = ref<TagProp[]>([])

// 控制 dialog 显示/隐藏
const isShowTabDialog = ref<boolean>(false)

// tag 筛选关键字
const filterTagVal = ref<string>('')

// 被编辑的 tag
const editTagId = ref<string>('')

/**
 * 从已选中的 tag 中删除点击的 tag
 * @param id {string} 所点击的 tag 的 id
 */
const delTagBySelected = (id: string) => {
  let idx = blogForm.tags.findIndex((item) => item.id === id)
  blogForm.tags.splice(idx, 1)
}

// table 数据计算属性
// const filterTableData = computed(() =>
//   tagsData.value.filter(
//     (item) =>
//       !filterTagVal.value ||
//       item.label
//         .toLocaleLowerCase()
//         .includes(filterTagVal.value.toLocaleLowerCase())
//   )
// )

// 保存编辑之前的 tag 的值
const beforeEditTagVal = reactive<
  Pick<TagProp, 'label' | 'textColor' | 'bgColor'>
>({
  label: '',
  bgColor: '',
  textColor: '',
})

/**
 * 点击编辑按钮
 * @param id 被编辑的 tag 的id
 * @param val 编辑之前的值
 */
const handleEditTag = (
  oldTag: Pick<TagProp, 'label' | 'textColor' | 'bgColor' | 'id'>
) => {
  editTagId.value = oldTag.id
  // 记录保存前的 tag 值
  beforeEditTagVal.label = oldTag.label
  beforeEditTagVal.textColor = oldTag.textColor
  beforeEditTagVal.bgColor = oldTag.bgColor
}

/**
 * 删除选中的tag
 * @param single 是否为删除单个 true-是，false-否
 * @param id
 */
const handleDelTag = async (single: boolean, id?: string) => {
  let ids: string[] = []
  if (single) {
    // 删除单个
    ids.push(id!)
  } else {
    // 删除所有选中的
    selectTagsList.value.forEach((item) => ids.push(item.id))
  }
  const { code } = await delBlogTagByIds(ids)
  if (code === 200) {
    noticeSuccess('删除成功')
    getBlogTagList()
  }
}

// 取消删除
const cancelDelTag = () => {
  messageInfo('已取消操作')
}

/**
 * 取消编辑 tag
 */
const handleCacheEdit = () => {
  const targetTag = tagsData.value.find((tag) => tag.id === editTagId.value)
  if (targetTag) {
    // 将原来的值换给目标tag
    targetTag.label = beforeEditTagVal.label
    targetTag.textColor = beforeEditTagVal.textColor
    targetTag.bgColor = beforeEditTagVal.bgColor
  }
  editTagId.value = ''
}

/**
 * 保存更改
 */
const saveTag = async () => {
  console.log(tagsData)
  const targetTag = tagsData.value.find((tag) => tag.id === editTagId.value)
  const { code } = await updateBlogTagById(editTagId.value, { ...targetTag })

  if (code === 200) {
    noticeSuccess('更新成功')
    resetNewTagForm(newTagFormRef.value)
    editTagId.value = ''
    getBlogTagList()
  }
}

// 被选中的 tag
const selectTagsList = ref<TagProp[]>([])

/**
 * 当选中的 tag 变化时触发
 * @param tagsList { TagProp[] } 被选中的 tag 数组
 */
const handleSelectTag = (tagsList: TagProp[]) => {
  selectTagsList.value = tagsList
}

// 新建标签 dialog 显示/隐藏
const isCreateTagDialogShow = ref<boolean>(false)

// 新建标签的数据
const newTagForm = reactive<Pick<TagProp, 'label' | 'bgColor' | 'textColor'>>({
  label: '',
  bgColor: '',
  textColor: '',
})

// 新建表单校验规则
const newTagRules = reactive<
  FormRules<Pick<TagProp, 'label' | 'bgColor' | 'textColor'>>
>({
  label: [
    { required: true, message: '请输入新标签名', trigger: ['blur', 'change'] },
  ],
  bgColor: [
    {
      required: true,
      message: '请选择标签背景颜色',
      trigger: ['blur', 'change'],
    },
  ],
  textColor: [
    {
      required: true,
      message: '请输入标签文字颜色',
      trigger: ['blur', 'change'],
    },
  ],
})

// newTagForm表单元素
const newTagFormRef = ref<FormInstance>()

/**
 * 提交表单
 * @param formEl 表单元素
 */
const submitNewTagForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) sendRequestToCreateTag()
  })
}

/**
 * 重置表单
 * @param formEl 表单元素
 */
const resetNewTagForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

/**
 * 创建新标签
 */
const sendRequestToCreateTag = async () => {
  const { code } = await createNewBlogTag({ ...newTagForm })
  if (code === 200) {
    noticeSuccess('创建成功')
    resetNewTagForm(newTagFormRef.value)
    isCreateTagDialogShow.value = false
    getBlogTagList()
  }
}

/**
 * 获取所有标签
 */
const getBlogTagList = async () => {
  const { data } = await getBlogTags(filterTagVal.value)
  tagsData.value = data
}

// 当筛选条件为空时，发起请求
watch(
  filterTagVal,
  (filterVal) => {
    if (!filterVal) getBlogTagList()
  },
  {
    immediate: true,
  }
)

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
