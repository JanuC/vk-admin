<template>
  <el-dropdown>
    <div class="flex !items-center">
      <el-space>
        <el-avatar shape="square" fit="cover" src="https://janu-picgo.oss-cn-chengdu.aliyuncs.com/images/IMG_0159.JPG"></el-avatar>
        <span>{{ userInfo.nickName }}</span>
      </el-space>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>用户详情</el-dropdown-item>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item divided @click="handleLogout(userInfo.username)">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { useStore } from '../../../store/index'
import { logout } from '../../../http/api/auth'
import { noticeSuccess } from '../../../utils/Notification/index'

const { user, routeStore } = useStore()
const { userInfo } = user

const router = useRouter()

// 退出登录
const handleLogout = async (username: string) => {
  await logout({ username })
  noticeSuccess(`Good Bye~ ${username}`)
  localStorage.removeItem(`${username}_access_token`)
  user.setUserInfo({} as any)
  routeStore.setIsAddRoutes(false)
  router.push('/login')
}
</script>

<style lang="scss" scoped>
// :deep(.el-tooltip__trigger:focus-visible) {
//   outline: unset;
// }
</style>
