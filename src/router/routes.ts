import { RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/views/layout/Layout.vue"),
  },
  {
    path: "/login",
    component: () => import("@/views/login/Login.vue"),
  },
  {
    path: "/404",
    component: () => import("@/views/404/NotFound.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
]

export default routes
