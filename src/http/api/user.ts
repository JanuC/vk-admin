interface DataProp<T> {
  code: number
  data: T
  message: string
  success: boolean
}

import request from '..'

export const getAllUser = () => {
  return request({
    method: 'GET',
    url: '/user',
  })
}
