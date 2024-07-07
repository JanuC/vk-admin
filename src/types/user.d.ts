interface UserProps {
  id: string
  username: string
  nickName: string
  phone: string
  email: string
  isEnable: 0 | 1
  isDefault: 0 | 1
  address: string
  area: string[]
  roleIds: string[]
  avatar: string
  createTime: Date
  updateTime: Date
}

interface QueryFormProps {
  username: string
  current: number
  pageSize: number
}

interface FilterUserProps {
  username: string
}

interface NewUserFormProps
  extends Omit<UserProps, 'id', 'createTime', 'updateTime', 'isDefault'> {}

interface UserDialogProps {
  isShow: boolean
  type: 'edit' | 'detail' | 'create'
  id: string
  // dialogForm?: NewUserFormProps | null
}

interface dialogUserFormProps
  extends Omit<UserProps, 'id' | 'createTime' | 'updateTime'> {
  area: string[]
  password: string
  confirmPassword: string
}
