import request from '..'

export const getUserList = (
  params: QueryFormProps
): Promise<ResponseProps<{ records: UserProps[]; totalCount: number }>> => {
  return request({
    method: 'GET',
    url: '/user/list',
    params,
  })
}

// export const getUserListCount = (
//   params: QueryFormProps
// ): Promise<ResponseProps<number>> => {
//   return request({
//     method: 'GET',
//     url: '/user/list/count',
//     params,
//   })
// }

export const getUserById = (id: string): Promise<ResponseProps<UserProps>> => {
  return request({
    method: 'GET',
    url: `/user/${id}`,
  })
}

export const createUser = (data: NewUserFormProps) => {
  return request({
    method: 'POST',
    url: '/user',
    data,
  })
}

export const updateUserById = (id: string, data: NewUserFormProps) => {
  return request({
    method: 'PATCH',
    url: `/user/${id}`,
    data,
  })
}

export const deleteUserById = (id: string) => {
  return request({
    method: 'DELETE',
    url: `/user/${id}`,
  })
}

export const changeUserStatus = (
  id: string,
  data: Pick<UserProps, 'isEnable'>
) => {
  return request({
    method: 'PATCH',
    url: `/user/status/${id}`,
    data,
  })
}
