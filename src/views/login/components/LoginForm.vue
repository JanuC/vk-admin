<template>
  <div class="login w-4/5">
    <h1 class="flex justify-center text-2xl text-white mb-4">登录</h1>
    <el-form label-width="auto" ref="loginFormRef" :model="ruleForm" :rules="rules">
      <el-form-item prop="username" label="用户名">
        <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input show-password v-model="ruleForm.password" placeholder="密码" type="password" autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item prop="captcha" label="验证码">
        <el-input placeholder="请输入验证码" v-model="ruleForm.captcha" class="captcha">
          <template #suffix>
            <img :src="captcha" @click="resetCaptcha" alt="" srcset="" class="w-[100px] h-full cursor-pointer" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="w-full flex justify-end">
          <el-button type="primary" class="w-4/5" @click="onSubmit(loginFormRef)">登录</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-link type="primary" class="!font-normal float-end" @click="changeShowFrom">去注册<i-ep-right class="ml-2"></i-ep-right></el-link>
  </div>
</template>

<script lang="ts" setup name="LoginForm">
import { FormInstance, FormRules } from 'element-plus'
import emitter from '@/utils/emitter/emitter'
import { login } from '@/http/api/auth'
import router from '@/router'
import { useStore } from '@/store/index'
import { noticeSuccess } from '../../../utils/Notification/index'
import { encryptString } from '../../../utils/md5/index'

interface FormProps {
  username: string
  password: string
  captcha: string
}

const { user } = useStore()

const loginFormRef = ref<FormInstance>()

// 表单数据
const ruleForm = reactive<FormProps>({
  username: '',
  password: '',
  captcha: '',
})

const rules = reactive<FormRules<FormProps>>({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
    {
      min: 4,
      max: 10,
      message: '用户名为 4 - 10 位',
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
    { max: 4, min: 4, message: '验证码为4位', trigger: 'change' },
  ],
})

// 切换到注册表单
const changeShowFrom = () => emitter.emit('formName', 'registerForm')

// 验证码
const captcha = ref<string>(import.meta.env.VITE_BASE_URL + '/captcha')
// 重置验证码
const resetCaptcha = () => (captcha.value += '?' + Math.random())

// 提交表单
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((vaild) => {
    if (vaild) handleLogin()
  })
}

const handleLogin = async () => {
  const { code, data } = await login({
    ...ruleForm,
    password: encryptString(ruleForm.password),
  })
  if (code === 200) {
    const { accessToken, userInfo } = data
    // localStorage.setItem('accessToken', accessToken)
    userInfo.permissions = getPermsFromRoles(userInfo.roles)

    user.setUserInfo(userInfo)
    user.setToken(accessToken)
    noticeSuccess(`欢迎回来, ${userInfo.nickName}`)
    router.push('/dashboard')
  }
  resetCaptcha()
}

// 键盘按下时间
const keydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') onSubmit(loginFormRef.value)
}

// 从用户信息中筛选出用户权限
const getPermsFromRoles = (roles: RoleProps[]): string[] => {
  const permissions: string[] = []
  for (let role of roles) {
    permissions.push(...role.permissions!.map((perm) => perm.enumVal!))
  }
  return Array.from(new Set(permissions))
}

onMounted(() => {
  resetCaptcha()
  window.addEventListener('keydown', keydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', keydown, false)
})
</script>

<style lang="scss" scoped>
.el-form :deep(.el-form-item__label) {
  color: #fff !important;
}
.captcha:deep(.el-input__wrapper) {
  padding-right: 1px;
}
</style>
