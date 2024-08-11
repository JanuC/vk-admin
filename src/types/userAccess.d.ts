type UserAccessProps = {
  id: string
  ip: string
  province: string
  city: string
  visits: number
  username: null | string
  lon: number
  lat: number
  lastVisitTime: Date
  createTime: Date
  updateTime: Date
}

type UserAccessChatProps = Partial<UserAccessProps> & {
  value?: number[]
  itemStyle?: {
    color: string
  }
  tooltip?: any
}
