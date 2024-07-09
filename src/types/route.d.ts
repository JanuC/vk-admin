interface RouteDataProps {
  id: string
  path: string
  component: string
  title: string
  icon: string
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
