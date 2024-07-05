<template>
  <el-dropdown>
    <div class="flex !items-center">
      <el-space>
        <el-avatar
          shape="square"
          fit="cover"
          src="https://janu-picgo.oss-cn-chengdu.aliyuncs.com/images/IMG_0159.JPG"
        ></el-avatar>
        <span>Janu</span>
      </el-space>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>用户详情</el-dropdown-item>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
// :deep(.el-tooltip__trigger:focus-visible) {
//   outline: unset;
// }
</style>
