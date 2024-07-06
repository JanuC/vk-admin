<template>
  <div class="menu h-full flex flex-col">
    <div class="menu-container flex-1 overflow-auto">
      <el-menu
        :default-active="route.path"
        class="el-menu-vertical-demo !border-0"
        :collapse="isCollapse"
        :collapse-transition="true"
        router
      >
        <MenuTree :menuList="routes[0].children" />
      </el-menu>
    </div>
    <div
      class="border-t-[0.01rem] flex justify-center items-center h-[4rem] text-3xl"
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
import routes from '../../router/routes'

const route = useRoute()

const isCollapse = ref(false)

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
