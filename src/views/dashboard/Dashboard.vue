<template>
  <div class="dashboard w-full h-full flex">
    <div class="flex-1 mr-[2rem] flex flex-col">
      <div class="w-full mb-[2rem]">
        <UserInfoCard />
      </div>
      <el-card class="flex-1" body-class="w-full h-full  overflow-y-scroll">
        <!-- <p>用户访问情况、用户访问定位、日志发布情况、系统运行监测、系统用户情况、</p> -->
        <!-- 用户访问信息 -->
        <div class="w-full h-full">
          <UserAccessEchart />
        </div>
        <el-divider />
        <div class="w-full h-[40rem] flex">
          <div class="flex-1">
            <!-- 博客发布相关信息 -->
            <BlogDateCountEchart />
          </div>
          <div class="flex-1 ml-[2rem]">
            <!-- 用户访问信息 -->
            <UserAccessCountEchart />
          </div>
        </div>
        <el-divider />
        <!-- 服务器运行相关信息 -->
        <div class="w-full h-[40rem] flex">
          <div class="flex-1">
            <!-- 服务器内存使用量信息 -->
            <ServerMemUsedEchart />
          </div>
          <div class="flex-1 ml-[2rem]">
            <!-- CPU利用率 -->
            <ServerCpuUsageEchart />
          </div>
        </div>
        <div class="w-full h-[40rem] flex">
          <div class="flex-1">
            <!-- 公网带宽 -->
            <ServerPublicBandwidthEchart />
          </div>
          <div class="flex-1 ml-[2rem]">
            <!-- CPU利用率 -->
            <ServerInsideBandwidthEchart />
          </div>
        </div>
      </el-card>
    </div>
    <div class="w-[40rem]">
      <UserOperationList />
    </div>
  </div>
</template>

<script lang="ts" setup>
import UserAccessEchart from './components/echarts/UserAccessEchart.vue'
</script>

<style lang="scss" scoped></style>
