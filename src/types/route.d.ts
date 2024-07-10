interface RouteDataProps {
  id: string
  path: string
  component: string
  title: string
  icon?: string
  children?: RouteDataProps[]
  parentId?: string | null
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
  icon?: string
  parentId?: string
  roleIds: string[]
  isTopRoute: 0 | 1
}
