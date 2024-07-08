import request from '..'

export const getRoleList = (
  params: QueryRoleProps
): Promise<ResponseProps<RoleProps[]>> => {
  return request({
    method: 'GET',
    url: '/role/list/page',
    params,
  })
}

export const getRoleListCount = (
  params: QueryRoleProps
): Promise<ResponseProps<number>> => {
  return request({
    method: 'GET',
    url: '/role/list/count',
    params,
  })
}

export const createNewRole = (data: any) => {
  return request({
    method: 'POST',
    url: '/role',
    data,
  })
}

export const updateRole = (id: string, data: any) => {
  return request({
    method: 'PATCH',
    url: `/role/${id}`,
    data,
  })
}

export const getRoleById = (id: string): Promise<ResponseProps<RoleProps>> => {
  return request({
    method: 'GET',
    url: `/role/${id}`,
  })
}

export const getAllRoles = (): Promise<ResponseProps<RoleProps[]>> => {
  return request({
    method: 'GET',
    url: '/role/list/all',
  })
}

export const changeRoleStatus = (id: string, data: { isEnable: number }) => {
  return request({
    method: 'PATCH',
    url: `/role/status/${id}`,
    data,
  })
}

export const delRoleById = (id: string) => {
  return request({
    method: 'DELETE',
    url: `/role/${id}`,
  })
}
