type PermDataProps = {
  id: string
  name: string
  enumVal: string
  parent: PermDataProps
  parentId: string | null
  isMenu: number
  desc: string | null
  childrem: PermDataProps[]
  roles: RoleProps[]
  order: number
  createBy: string
  createTime: Date
}

type PermDialogProps = {
  isShow: boolean
  type: 'edit' | 'create' | 'detail'
  id: string
}

type QueryPermFormProps = Pick<PermDataProps, 'type' | 'name' | 'enumVal'>

type PermFormProps = Pick<
  PermDataProps,
  'name' | 'enumVal' | 'desc' | 'parentId' | 'isMenu'
> & {
  roleIds: string[]
}
