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

export const getRoutesByPage = (params: any): Promise<ResponseProps<RouteDataProps[]>> => {
  return request({
    method: 'GET',
    url: '/route/list/page',
    params,
  })
}

export const getRoutesIsParent = (): Promise<ResponseProps<RouteDataProps[]>> => {
  return request({
    method: 'GET',
    url: '/route/list/parent',
  })
}

export const getRouteById = (id: string): Promise<ResponseProps<RouteDataProps>> => {
  return request({
    method: 'GET',
    url: `/route/${id}`,
  })
}

export const updateRouteById = (id: string, data: RouteFormProps) => {
  return request({
    method: 'PATCH',
    url: `/route/${id}`,
    data,
  })
}

export const deleteRouteById = (id: string) => {
  return request({
    method: 'DELETE',
    url: `/route/${id}`,
  })
}

export const updateRouteOrder = (data: OrderProps[]) => {
  return request({
    method: 'PATCH',
    url: '/route/list/order',
    data,
  })
}

export const getAllRouteList = (): Promise<ResponseProps<RouteDataProps[]>> => {
  return request({
    method: 'GET',
    url: '/route/list/all',
  })
}
