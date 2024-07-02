import { createRouter, createWebHashHistory } from 'vue-router'
import { openProgress, closeProgress } from '@/utils/NProgress/NProgress'
import routes from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(() => {
  // 开启顶部进度条
  openProgress()
})

router.afterEach(() => {
  // 关闭顶部进度条
  closeProgress()
})

export default router as any
