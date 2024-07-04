<template>
  <div class="new-blog">
    <el-form :model="blogForm" label-width="auto">
      <el-row justify="space-between">
        <el-col :span="11">
          <el-row>
            <el-col :span="24">
              <el-form-item label="标题:">
                <el-input
                  v-model="blogForm.title"
                  placeholder="请输入博客标题"
                  clearable
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
                  placeholder="请选择博客标签"
                >
                  <el-option
                    v-for="item in tagsData"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4"
              ><el-button type="primary">管理</el-button></el-col
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
              :rows="4"
              clearable
              :autosize="false"
              placeholder="请输入博客描述"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
interface BlogFormProps {
  title: string
  tags: string[]
  desc: string
  status: 0 | 1
}

interface TagProp {
  id: string
  label: string
  value: string
  color: string
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
const tagsData = reactive<TagProp[]>([
  {
    id: '1',
    label: 'HTML',
    value: 'html',
    color: '',
  },
  {
    id: '2',
    label: 'JS',
    value: 'JavaScript',
    color: '',
  },
  {
    id: '3',
    label: 'Linux',
    value: 'linux',
    color: '',
  },
])

const newTag = reactive<Pick<TagProp, 'label' | 'color'>>({
  label: '',
  color: '',
})
</script>

<style lang="scss" scoped></style>
