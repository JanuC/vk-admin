interface DataProp<T> {
  code: number
  data: T
  message: string
  success: boolean
}

import request from '..'

export const getUserList = (
  params: QueryFormProps
): Promise<ResponseProps<UserProps[]>> => {
  return request({
    method: 'GET',
    url: '/user',
    params,
  })
}

export const getUserListCount = (
  params: QueryFormProps
): Promise<ResponseProps<number>> => {
  return request({
    method: 'GET',
    url: '/user/count',
    params,
  })
}
