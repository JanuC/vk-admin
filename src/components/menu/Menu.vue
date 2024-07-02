<template>
  <div class="menu h-full flex flex-col border-t-[0.1rem]">
    <div class="menu-container flex-1 overflow-auto">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="true"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><i-ep-location /></el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group>
            <template #title><span>Group One</span></template>
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title><span>item four</span></template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><i-ep-menu /></el-icon>
          <template #title>Navigator Two</template>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <i-ep-document />
          <template #title>Navigator Three</template>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><i-ep-setting /></el-icon>
          <template #title>Navigator Four</template>
        </el-menu-item>
      </el-menu>
    </div>
    <div
      class="border-t-[0.1rem] flex justify-center items-center h-[4rem] text-3xl"
    >
      <i-ep-expand
        v-if="isCollapse"
        class="cursor-pointer hover:text-primary"
        @click="setMenuCollapse(false)"
      />
      <i-ep-fold
        v-else
        class="cursor-pointer hover:text-primary"
        @click="setMenuCollapse(true)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup name="Menu">
import emitter from '@/utils/emitter/emitter'

const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const setMenuCollapse = (flag: boolean) => {
  isCollapse.value = flag
  emitter.emit('isMenuCollapse', flag)
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
