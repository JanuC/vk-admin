import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'
import { openProgress, closeProgress } from '@/utils/NProgress/NProgress'
import routes from './routes'
import { useStore } from '../store/index'
import { formatUserRoutes } from '@/utils/routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  // console.log(to, from.path)

  // 开启顶部进度条
  openProgress()
  const { user } = useStore()

  const { routes: userRoutes } = user.userInfo

  console.log(userRoutes)

  if (to.path === '/login') {
    next()
  } else {
    if (!user.isAddRoutes) {
      const layout: RouteRecordRaw = routes.find(
        (route) => route.name === 'layout'
      ) as RouteRecordRaw
      const userRouteList = formatUserRoutes(userRoutes as any)
      layout?.children?.push(...userRouteList)

      router.addRoute(layout)
      user.setIsAddRoutes(true)
      next({
        ...to,
        replace: true,
      })
    } else {
      next()
    }
  }

  // console.log(routes)
  // next()
})

router.afterEach(() => {
  // 关闭顶部进度条
  closeProgress()
})

export default router as any
