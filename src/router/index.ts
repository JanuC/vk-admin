import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'
import { openProgress, closeProgress } from '@/utils/NProgress/NProgress'
import routes from './routes'
import { useStore } from '../store/index'
import { formatUserRoutes } from '@/utils/routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  // 开启顶部进度条
  openProgress()
  const { user, routeStore } = useStore()

  const { routes: userRoutes } = user.userInfo

  if (to.path === '/login') {
    next()
  } else {
    if (!routeStore.isAddRoutes && userRoutes) {
      const layout: RouteRecordRaw = routes.find((route) => route.name === 'layout') as RouteRecordRaw

      // console.log('lay', layout)
      const userRouteList = formatUserRoutes(userRoutes as any)
      // console.log(userRouteList)

      // layout?.children?.push(...userRouteList)
      layout?.children?.splice(1, layout?.children!.length, ...userRouteList)

      router.addRoute(layout)

      routeStore.setIsAddRoutes(true)
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
