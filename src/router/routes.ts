import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/layout/Layout.vue'),
    redirect: 'dashboard',
    name: 'layout',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),

        meta: { title: '仪表盘', icon: 'Monitor' },
      },
      // {
      //   path: '/blogs',
      //   redirect: '/blogs/new',

      //   meta: { title: '博客系统', icon: 'Notebook' },
      //   children: [
      //     {
      //       path: '/blogs/new',

      //       meta: { title: '新建博客' },
      //       component: () => import('@/views/blogs/newBlog/NewBlog.vue'),
      //     },
      //     {
      //       path: '/blogs/management',
      //       meta: { title: '博客管理' },
      //       component: () =>
      //         import('@/views/blogs/blogManagement/BlogManagement.vue'),
      //     },
      //   ],
      // },
      // {
      //   path: '/user',
      //   redirect: '/user/user-management',
      //   meta: { title: '用户系统', icon: 'User' },
      //   children: [
      //     {
      //       path: '/user/user-manamgement',
      //       meta: { title: '用户管理' },
      //       component: () => import('@/views/user/UserManagement.vue'),
      //     },
      //     {
      //       path: '/user/role-manamgement',
      //       meta: { title: '角色管理' },
      //       component: () => import('@/views/user/RoleManagement.vue'),
      //     },
      //     {
      //       path: '/user/permission-management',
      //       component: () => import('@/views/user/PermissionManagement.vue'),
      //       meta: { title: '权限管理' },
      //     },
      //     {
      //       path: '/user/route-management',
      //       meta: { title: '路由管理' },
      //       component: () => import('@/views/user/RouteManagement.vue'),
      //     },
      //   ],
      // },
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
