<template>
  <div
    class="not-found w-full h-full flex flex-col items-center justify-center"
  >
    <img class="block" src="@/assets/404.svg" alt="404" />
    <p class="my-10 font-bold text-2xl">抱歉...您访问的网页不存在！</p>
    <p class="text-gray-500 text-sm">
      {{ countDowm }}秒后跳转或者
      <el-link type="primary" @click="router.back">立即跳转~</el-link>
    </p>
  </div>
</template>

<script lang="ts" setup name="NotFound">
const countDowm = ref<number>(3)

const router = useRouter()

const timer = setInterval(() => {
  countDowm.value--
}, 1000)

watch(countDowm, (newVal) => {
  if (newVal <= 0) {
    router.back()
  }
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style lang="scss" scoped></style>
