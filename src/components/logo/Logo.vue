<template>
  <div class="logo flex items-center w-full">
    <div
      class="logo-img w-[6.4rem] h-full rounded-[50%] overflow-hidden flex justify-around items-center"
    >
      <div class="img-box w-[4rem] h-[4rem] overflow-hidden rounded-[50%]">
        <img
          src="https://janu-picgo.oss-cn-chengdu.aliyuncs.com/images/IMG_0159.JPG"
          alt=""
        />
      </div>
    </div>
    <span class="flex-1 text-[2rem] font-bold" v-if="isLogoTextHidden"
      >Vk-Admin</span
    >
  </div>
</template>

<script lang="ts" setup name="Logi">
import emitter from '@/utils/emitter/emitter'

// 控制 Logo 文字的显示
const isLogoTextHidden = ref(true)

// 根据 Menu 组件中的收缩状态动态更新文字的显示
emitter.on('isMenuCollapse', (flag: boolean) => {
  if (flag) {
    isLogoTextHidden.value = !flag
  } else {
    setTimeout(() => {
      isLogoTextHidden.value = !flag
    }, 300)
  }
})
</script>

<style lang="scss" scoped></style>
