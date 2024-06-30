<template>
  <div
    class="login w-full h-full relative bg-[url(https://janu-picgo.oss-cn-chengdu.aliyuncs.com/images/11.png)] bg-cover"
  >
    <div
      class="container w-2/5 min-w-[200px] max-w-[400px] h-full absolute right-0 bg-login-bg flex justify-center items-center"
    >
      <transition name="slide-fade" mode="out-in">
        <LoginForm v-if="showForm === 'loginForm'"></LoginForm>
        <RegisterForm v-else-if="showForm === 'registerForm'"></RegisterForm>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup name="Login">
import LoginForm from "./components/LoginForm.vue"
import RegisterForm from "./components/RegisterForm.vue"
import emitter from "@/utils/emitter"

// 当前展示的 form
const showForm = ref<string>("loginForm")

emitter.on("formName", (formName) => (showForm.value = formName))
</script>

<style lang="scss" scoped>
.container {
  animation: leave-in 1s;
}

@keyframes leave-in {
  0% {
    right: -100%;
  }
  100% {
    right: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.4s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(40px);
  opacity: 0;
}
</style>
