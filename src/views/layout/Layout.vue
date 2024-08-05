<template>
  <div class="w-full h-full">
    <el-container class="w-full h-full">
      <el-aside width="auto" class="bg-slate-500 flex flex-col border-r-[0.01rem]">
        <Logo class="h-[6rem]" />
        <Menu class="flex-1 min-h-0 overscroll-y-auto" />
      </el-aside>
      <el-container>
        <el-header class="h-[6rem] border-b-[0.01rem]">
          <Header />
        </el-header>
        <el-main>
          <router-view v-slot="{ Component }">
            <keep-alive :include="['NewBlog']">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
        <el-footer class="!h-[4rem] border-t-[0.01rem] flex justify-between items-center">
          <p class="flex-1">通知：</p>
          <el-link class="text-xs font-medium" href="https://github.com/JanuC/vk-admin" target="_blank">Design By Janu</el-link>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup name="Layout"></script>

<style lang="scss" scoped></style>
