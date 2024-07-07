interface QueryRoleProps {
  name: string
  current: number
  pageSize: number
}

interface RoleProps {
  id: string
  name: string
  isCommon: 0 | 1
  isDefault: 0 | 1
  enumVal: string
  createTime?: Date
  updateTime?: Date
}

interface RoleDialogFormProps {
  name: string
  // isDefault: 0 | 1
  enumVal: string
}

// interface RoleFormProps extends Pick<RoleProps, 'name' | 'isDefault'> {
//   id?: string
// }

interface RoleDialogProps {
  isShow: boolean
  type: 'edit' | 'create' | 'detail'
  id: string
}
