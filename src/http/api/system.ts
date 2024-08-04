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
