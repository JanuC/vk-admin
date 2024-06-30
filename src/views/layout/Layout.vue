<template>
  <!-- <p class="text-2xl font-bold bg-red-900">Hello Tailwind!</p>
  <p>{{ test }}</p>
  <el-input v-model="test" style="width: 240px" placeholder="Please input">
    <template #suffix>
      <i-ep-search />
    </template>
  </el-input>
  <i-ep-search /> -->
  <RouterView />
  <el-button @click="handleLogout">退出</el-button>
  <el-button @click="handleGetUser">获取全部用户</el-button>
</template>

<script lang="ts" setup name="Layout">
import router from '@/router'
import { logout } from '../../http/api/auth'
import { ElNotification } from 'element-plus'
import { getAllUser } from '../../http/api/user'
import { useStore } from '@/store'

const { user } = useStore()

const { username } = user.userInfo

const handleLogout = async () => {
  const { code } = await logout({ username })
  if (code === 200) {
    ElNotification({
      title: 'Success',
      message: '退出登录成功',
      type: 'success',
    })
    localStorage.removeItem('accessToken')
    router.push('/login')
  }
}

const handleGetUser = async () => {
  const res = await getAllUser()
  console.log(res)
}
</script>

<style lang="scss" scoped></style>
