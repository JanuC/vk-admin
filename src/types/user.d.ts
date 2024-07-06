interface UserProps {
  id: string
  username: string
  nickName: string
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

interface NewUserFormProps {
  username: string
  nickName: string
  phone: string
  email: string
}

interface UserDialogProps {
  isShow: boolean
  type: 'edit' | 'detail' | 'create'
  // dialogForm?: NewUserFormProps | null
}
