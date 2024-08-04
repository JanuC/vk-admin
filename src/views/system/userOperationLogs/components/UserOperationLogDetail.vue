<template>
  <el-dialog width="75%" align-center :model-value="userOperationLogDetailData.isShow" :close-on-click-modal="false" @close="userOperationLogDetailData.isShow = false">
    <template #header>
      <Title title="操作日志详情" />
    </template>
    <div class="w-full max-h-[80vh] flex flex-col overflow-y-scroll overflow-x-hidden">
      <div class="w-full flex justify-between my-[0.8rem]">
        <div class="flex-1 max-w-[45%]">
          <span class="inline-block w-[8rem] font-medium">操作模块:</span>
          <span>{{ operationdetail?.moduleName }}</span>
        </div>
        <div class="flex-1 max-w-[45%] ml-[10rem]">
          <span class="inline-block w-[8rem] font-medium">操作类型:</span>
          <span>{{ operationdetail?.action }}</span>
        </div>
      </div>
      <div class="w-full flex justify-between my-[0.8rem]">
        <div class="flex-1 max-w-[45%] flex">
          <div class="inline-block w-[8rem] font-medium">操作信息:</div>
          <div class="flex-1">{{ operationdetail?.message }}</div>
        </div>
        <div class="flex-1 max-w-[45%] ml-[10rem]">
          <span class="inline-block w-[8rem] font-medium">操作人:</span>
          <span>{{ operationdetail?.operator }}</span>
        </div>
      </div>
      <div class="w-full flex justify-between my-[0.8rem]">
        <div class="flex-1 max-w-[45%]">
          <span class="inline-block w-[8rem] font-medium">请求方式:</span>
          <span>{{ operationdetail?.method }}</span>
        </div>
        <div class="flex-1 max-w-[45%] ml-[10rem]">
          <span class="inline-block w-[8rem] font-medium">请求地址:</span>
          <span>{{ operationdetail?.url }}</span>
        </div>
      </div>
      <div class="flex-1 min-h-0 flex justify-between my-[0.8rem]">
        <div class="flex-1 max-w-[45%] flex">
          <span class="inline-block w-[8rem] font-medium">params:</span>
          <div class="flex-1 min-w-0 min-h-0">
            <MdPreview :modelValue="computedCode(operationdetail?.params)" :autoFoldThreshold="1" class="flex-1" />
          </div>
        </div>
        <div class="flex-1 max-w-[45%] flex">
          <span class="inline-block w-[8rem] font-medium">body:</span>
          <div class="flex-1 min-w-0 min-h-0">
            <MdPreview :modelValue="computedCode(operationdetail?.body)" :autoFoldThreshold="1" class="flex-1" />
          </div>
        </div>
      </div>
      <div class="flex-1 min-h-0 flex justify-between my-[0.8rem]">
        <div class="flex-1 max-w-[45%] flex">
          <span class="inline-block w-[8rem] font-medium">操作前数据:</span>
          <div class="flex-1 min-w-0 min-h-0">
            <MdPreview :modelValue="computedCode(operationdetail?.beforeOperationData)" :autoFoldThreshold="1" class="flex-1" />
          </div>
        </div>
        <div class="flex-1 max-w-[45%] flex">
          <span class="inline-block w-[8rem] font-medium">操作后数据:</span>
          <div class="flex-1 min-w-0 min-h-0">
            <MdPreview :modelValue="computedCode(operationdetail?.afterOperationData)" :autoFoldThreshold="1" class="flex-1" />
          </div>
        </div>
      </div>
      <div class="w-full flex justify-between my-[0.8rem]">
        <div class="flex-1 max-w-[45%] flex">
          <span class="inline-block w-[8rem]">操作状态:</span>
          <span>
            <el-tag :type="operationdetail?.status == 1 ? 'success' : 'danger'">{{ operationdetail?.status == 1 ? '成功' : '失败' }}</el-tag>
          </span>
        </div>
        <div class="flex-1 max-w-[45%] ml-[10rem] flex" v-if="operationdetail?.errMessage">
          <div class="inline-block w-[8rem] font-medium">错误信息:</div>
          <div class="flex-1 text-red-400">{{ operationdetail?.errMessage }}</div>
        </div>
      </div>
      <div class="max-w-[45%]">
        <span class="inline-block w-[8rem] font-medium">操作时间:</span>
        <span>{{ formatDate(operationdetail?.createTime!) }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup name="UserOperationLogDetail">
import { getOperationLogById } from '@/http/api/system'
import { ModelRef } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { formatDate } from '@/utils/formatDate'

const userOperationLogDetailData = defineModel('userOperationLogDetailData') as ModelRef<DetailDialogProps>

const operationdetail = ref<OperationLogsProps>()

const computedCode = computed(() => (str?: string) => {
  return '```json\n' + str + '\n```'
})

const getUserLoggerDetail = async (id: string) => {
  const { data } = await getOperationLogById(id)

  operationdetail.value = data
}

watch(
  () => userOperationLogDetailData,
  (newVal) => {
    const { isShow, id } = newVal.value
    if (isShow && id) getUserLoggerDetail(id)
  },
  {
    deep: true,
  }
)
</script>

<style lang="scss" scoped>
.md-editor {
  height: 100%;
  background-color: transparent;
}
:deep(.md-editor-preview-wrapper) {
  padding: 0;
  height: 100%;
  .md-editor-preview {
    height: 100%;
  }
}
:deep(.md-editor-code) {
  margin: 0;
  height: 100%;
  pre {
    // max-height: 300px;
    height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    .md-editor-code-block {
      padding-bottom: 2rem;
    }
  }
}
</style>
