<template>
  <div class="w-full h-full">
    <el-container class="w-full h-full">
      <el-aside
        width="auto"
        class="bg-slate-500 flex flex-col border-r-[0.01rem]"
      >
        <Logo class="h-[6rem]" />
        <Menu class="flex-1 min-h-0 overscroll-y-auto" />
      </el-aside>
      <el-container>
        <el-header class="h-[6rem] border-b-[0.01rem]">
          <Header />
        </el-header>
        <el-main>
          <RouterView />
        </el-main>
        <el-footer class="!h-[4rem] border-t-[0.01rem] flex items-center"
          >Footer</el-footer
        >
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup name="Layout">
import { useStore } from '../../store/index'
const { user } = useStore()
// onMounted(() => {
//   window.addEventListener('load', () => {
//     // console.log(123)
//     user.setIsAddRoutes(false)
//   })
// })
</script>

<style lang="scss" scoped></style>
