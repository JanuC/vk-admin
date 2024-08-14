// 访问记录

import request from '..'

export const getUserAccessListByFilter = (params: { startTime: string; endTime: string }): Promise<ResponseProps<UserAccessProps[]>> => {
  return request({
    method: 'GET',
    url: '/user-access/list/filter',
    params,
  })
}

export const getUserAccessCountByDays = (params: QueryUserAccessCountProps): Promise<ResponseProps<UserAccessDateCountProps[]>> => {
  return request({
    method: 'GET',
    url: '/user-access/list/days',
    params,
  })
}
