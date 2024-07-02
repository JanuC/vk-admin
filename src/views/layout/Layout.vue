import { type } from '../../auto-import';
<template>
  <div class="w-full h-full">
    <el-container class="w-full h-full">
      <el-aside width="auto" class="bg-slate-500 flex flex-col">
        <Logo class="h-[6rem]" />
        <Menu class="flex-1 min-h-0 overscroll-y-auto" />
      </el-aside>
      <el-container>
        <el-header class="bg-yellow-300 h-[6rem]">
          <el-button type="primary">按钮</el-button>
        </el-header>
        <el-main class="bg-gray-700">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup name="Layout"></script>

<style lang="scss" scoped></style>
