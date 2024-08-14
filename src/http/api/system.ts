import request from '..'

export const getOperationLogsListByFilter = (params: QueryOperationLogsParamsProps): Promise<ResponseProps<FilterListProps>> => {
  return request({
    method: 'GET',
    url: '/user-logger/list/filter',
    params,
  })
}

export const getOperationLogById = (id: string): Promise<ResponseProps<OperationLogsProps>> => {
  return request({
    method: 'GET',
    url: `/user-logger/${id}`,
  })
}

export const getOperationLogListByUsername = (params: QueryOperationLogListByUserProps): Promise<ResponseProps<FilterListProps>> => {
  return request({
    method: 'GET',
    url: '/user-logger/list/user',
    params,
  })
}

export const getServerMemUsedInfo = (params: QueryMemUsedParamsProps) => {
  return request({
    method: 'GET',
    url: '/system/mem-used',
    params,
  })
}
