import request from '..'

export const getPermListByFilter = (
  params: QueryPermFormProps
): Promise<ResponseProps<PermDataProps[]>> => {
  return request({
    method: 'GET',
    url: '/permission/list/filter',
    params,
  })
}

export const getPermMenu = (): Promise<ResponseProps<PermDataProps[]>> => {
  return request({
    method: 'GET',
    url: '/permission/list/menu',
  })
}

export const createNewPerm = (data: PermFormProps) => {
  return request({
    method: 'POST',
    url: '/permission',
    data,
  })
}

export const getPermById = (
  id: string
): Promise<ResponseProps<PermDataProps & { roleIds: string[] }>> => {
  return request({
    method: 'GET',
    url: `/permission/${id}`,
  })
}

export const updatePermById = (id: string, data: PermFormProps) => {
  return request({
    method: 'PATCH',
    url: `/permission/${id}`,
    data,
  })
}

export const delPermById = (id: string) => {
  return request({
    method: 'DELETE',
    url: `/permission/${id}`,
  })
}

export const updatePermOrder = (data: OrderProps[]) => {
  return request({
    method: 'PATCH',
    url: '/route/list/order',
    data,
  })
}
