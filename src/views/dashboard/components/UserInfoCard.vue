<template>
  <el-card class="w-full h-full" body-class="card-body">
    <el-collapse v-model="activeItem">
      <el-collapse-item title="Consistency" name="1">
        <template #title>
          <h2 class="font-medium text-base">用户基础信息</h2>
        </template>
        <div class="w-full h-full flex justify-between">
          <el-card class="w-full !shadow-none !border-none">
            <div class="flex flex-wrap justify-between">
              <p class="w-[22%]">
                用户名: <span class="ml-4">{{ user.userInfo.username }}</span>
              </p>
              <p class="w-[22%]">
                状态: <el-tag class="ml-4" :type="userInfo.isEnable ? 'success' : 'danger'">{{ userInfo.isEnable ? '已启用' : '已禁用' }}</el-tag>
              </p>
              <p class="w-[22%]">
                角色数: <span class="ml-4 text-success">{{ userInfo.roles?.length }}</span>
              </p>
              <p class="w-[22%]">
                路由数: <span class="ml-4 text-success">{{ userInfo.routes?.length }}</span>
              </p>
              <p class="w-[22%]">
                权限数: <span class="ml-4 text-success">{{ userInfo.permissions?.length }}</span>
              </p>
              <p class="w-[22%]">
                日志数: <span class="ml-4 text-success">{{ userInfo.permissions?.length }}</span>
              </p>
              <p class="w-[22%]">
                创建方式: <span :class="['ml-4', userInfo.isRegister ? 'text-success' : 'text-danger'].join(' ')">{{ userInfo.isRegister ? '自主注册' : '后台创建' }}</span>
              </p>
              <p class="w-[22%]">
                创建时间: <span class="ml-4">{{ formatDate(userInfo.createTime) }}</span>
              </p>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
  <!-- <el-card class="w-full h-full" body-class="w-full h-full flex flex-col">
    <h2 class="mb-[1rem] font-medium">用户部分信息</h2>
    <div class="w-full h-full flex justify-between">
      <el-card class="w-[30%] !shadow-none !border-none">1</el-card>
      <el-card class="w-[30%] !shadow-none !border-none">2</el-card>
      <el-card class="w-[30%] !shadow-none !border-none">3</el-card>
    </div>
  </el-card> -->
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { formatDate } from '@/utils/formatDate'

const { user } = useStore()

const { userInfo } = user

console.log(userInfo)

const activeItem = ref<string>('1')
</script>

<style lang="scss" scoped>
:deep(.card-body) {
  // background: red;
  padding-top: 0;
  padding-bottom: 0;
  .el-collapse {
    border: 0;
    .el-collapse-item__header {
      border: 0;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
      .el-card__body {
        padding-top: 0;
      }
    }
  }
}
</style>
