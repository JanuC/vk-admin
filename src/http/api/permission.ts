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
