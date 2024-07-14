// 根据用户路由转换成最终需要的路由格式

import { RouteRecordRaw } from 'vue-router'

const modules = import.meta.glob('/src/views/**/*.vue')

export const formatUserRoutes = (
  userRoutes: RouteDataProps[]
): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []
  userRoutes.forEach((route) => {
    const { path, icon, title, component, children } = route
    let routeObj: RouteRecordRaw = {
      path,
      redirect: '',
      component: null,
      children: [],
    }
    const meta = { icon, title }
    routeObj.meta = meta
    if (component) {
      routeObj.component = modules[`/src/views${component}.vue`]
    }
    if (children && Array.isArray(children) && children.length) {
      routeObj.children = formatUserRoutes(children)
    }
    if (routeObj.children.length) {
      routeObj.redirect = routeObj.children[0].path
    }
    routes.push(routeObj)
  })
  return routes
}
