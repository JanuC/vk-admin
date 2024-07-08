<template>
  <div class="register w-4/5">
    <h1 class="flex justify-center text-2xl text-white mb-4">注册</h1>
    <el-form
      label-width="auto"
      :model="ruleForm"
      :rules="rules"
      ref="registerForm"
    >
      <el-form-item prop="username" label="用户名">
        <el-input
          v-model="ruleForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input
          show-password
          v-model="ruleForm.password"
          placeholder="密码"
          type="password"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          show-password
          v-model="ruleForm.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="captcha" label="验证码">
        <el-input
          placeholder="请输入验证码"
          v-model="ruleForm.captcha"
          class="captcha"
        >
          <template #suffix>
            <img
              :src="captcha"
              @click="resetCaptcha"
              alt=""
              srcset=""
              class="w-full h-full cursor-pointer"
            />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="w-full flex justify-end">
          <el-button
            type="primary"
            class="w-4/5"
            @click="onSubmit(registerForm)"
            >注册</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <el-link type="primary" class="!font-normal" @click="changeShowFrom"
      ><i-ep-back class="mr-2"></i-ep-back>去登录</el-link
    >
  </div>
</template>

<script lang="ts" setup name="registerForm">
import { FormRules, FormInstance, ElNotification } from 'element-plus'
import emitter from '@/utils/emitter/emitter'
import { register } from '@/http/api/auth'
import { noticeSuccess } from '../../../utils/Notification/index'

interface FormProps {
  username: string
  password: string
  confirmPassword: string
  captcha: string
}

const registerForm = ref<FormInstance>()

// 表单数据
const ruleForm = reactive<FormProps>({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: '',
})

const rules = reactive<FormRules<FormProps>>({
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: ['blur', 'change'],
    },
    {
      pattern: /^[A-Za-z0-9-_]+$/,
      message: '用户名只能为英文、数字或者下划线',
      trigger: ['blur', 'change'],
    },
    {
      min: 4,
      max: 10,
      message: '用户名长度必须为4-10位',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: ['blur', 'change'],
    },
    {
      validator: (_: any, value: string, callback: any) => {
        if (value.length < 6 || value.length > 16) {
          callback(new Error('密码长度必须为6-16之间'))
        } else if (ruleForm.confirmPassword !== '') {
          registerForm.value?.validateField('confirmPassword', () => {})
        }
        callback()
      },
      trigger: ['blur', 'change'],
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: 'blur',
    },
    {
      validator: (_: any, value: string, callback: any) => {
        if (value !== ruleForm.password) {
          callback(new Error('两次输出的密码不一致'))
        }
        callback()
      },
      trigger: 'change',
    },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: ['blur', 'change'] },
    { max: 4, min: 4, message: '验证码为4位', trigger: ['blur', 'change'] },
  ],
})

// 切换到登录表单
const changeShowFrom = () => emitter.emit('formName', 'loginForm')

// 验证码
const captcha = ref<string>(import.meta.env.VITE_BASE_URL + '/captcha')
// 重置验证码
const resetCaptcha = () => (captcha.value += '?' + Math.random())

// 提交表单
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((vaild) => {
    if (vaild) handleRegister()
  })
}

// 注册功能
const handleRegister = async () => {
  const { username, password, captcha } = ruleForm
  const { code } = await register({ username, password, captcha })
  if (code === 200) {
    noticeSuccess('注册成功')
    // 切换到登录表单
    changeShowFrom()
  }
}

onMounted(() => {
  resetCaptcha()
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
