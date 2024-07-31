interface RouteDataProps {
  id: string
  path: string
  component: string
  title: string
  icon: string
  name: string
  parent?: RouteDataProps
  children?: RouteDataProps[]
  name: string
  parentId: string | null
  order: number
  roleIds: string[]
  roles: RoleProps[]
  isTopRoute: 0 | 1
  createTime: Date
  updateTime: Date
}

interface QueryRouteProps {
  title: string
  current: number
  pageSize: number
}

interface RouteDialogProps {
  isShow: boolean
  type: 'edit' | 'create' | 'detail'
  id: string
}

interface RouteFormProps {
  path: string
  component: string
  title: string
  name: string
  icon?: string
  parentId?: string
  roleIds: string[]
  isTopRoute: 0 | 1
}

interface OrderProps {
  id: string
  order: number
}
