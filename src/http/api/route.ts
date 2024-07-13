import request from '..'

export const createNewRoute = (data: RouteFormProps) => {
  return request({
    method: 'POST',
    url: '/route',
    data,
  })
}

export const getAllRoutes = (): Promise<ResponseProps<RouteDataProps[]>> => {
  return request({
    method: 'GET',
    url: '/route/list/all',
  })
}

export const getRoutesByPage = (
  params: any
): Promise<ResponseProps<RouteDataProps[]>> => {
  return request({
    method: 'GET',
    url: '/route/list/page',
    params,
  })
}

export const getRoutesIsParent = (): Promise<
  ResponseProps<RouteDataProps[]>
> => {
  return request({
    method: 'GET',
    url: '/route/list/parent',
  })
}
