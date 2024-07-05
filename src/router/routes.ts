import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/layout/Layout.vue'),
    redirect: 'dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),

        meta: { title: '仪表盘', icon: 'Monitor' },
      },
      {
        path: '/blogs',
        redirect: '/blogs/new',

        meta: { title: '博客系统', icon: 'Notebook' },
        children: [
          {
            path: '/blogs/new',

            meta: { title: '新建博客' },
            component: () => import('@/views/blogs/newBlog/NewBlog.vue'),
          },
          {
            path: '/blogs/management',
            meta: { title: '博客管理' },
            component: () =>
              import('@/views/blogs/blogManagement/BlogManagement.vue'),
          },
        ],
      },
      {
        path: '/permission',
        redirect: '/permission/management',
        meta: { title: '权限系统', icon: 'Unlock' },
        children: [
          {
            path: '/permission/management',
            component: () => import('@/views/permission/Permission.vue'),
            meta: { title: '权限管理' },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import('@/views/404/NotFound.vue'),
  },
]

export default routes
