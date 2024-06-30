// 登录相关

interface DataProp<T> {
  code: number
  data: T
  message: string
  success: boolean
}

import request from '..'

export const getCaptcha = () => {
  return request({
    method: 'GET',
    url: '/captcha',
  })
}

export const login = (data: any): Promise<DataProp<any>> => {
  return request({
    method: 'POST',
    url: '/auth/login',
    data,
  })
}

export const register = (data: any): Promise<DataProp<any>> => {
  return request({
    method: 'POST',
    url: '/auth/register',
    data,
  })
}

export const refresh = (data: any): Promise<DataProp<any>> => {
  return request({
    method: 'POST',
    url: '/auth/refresh',
    data,
  })
}

export const logout = (data: any): Promise<DataProp<any>> => {
  return request({
    method: 'POST',
    url: '/auth/logout',
    data,
  })
}
