import request from '..'

interface DataProp<T> {
  code: number
  data: T
  message: string
  success: boolean
}

export const createNewBlogTag = (data: any): Promise<DataProp<any>> => {
  return request({
    method: 'POST',
    url: '/blog-tag/new',
    data,
  })
}

export const getBlogTags = (searchVal: string): Promise<DataProp<any>> => {
  return request({
    method: 'GET',
    url: '/blog-tag',
    params: { searchVal },
  })
}

export const updateBlogTagById = (
  id: string,
  data: any
): Promise<DataProp<any>> => {
  return request({
    method: 'PATCH',
    url: `/blog-tag/${id}`,
    data,
  })
}

export const delBlogTagByIds = (ids: string[]): Promise<DataProp<any>> => {
  return request({
    method: 'DELETE',
    url: 'blog-tag',
    data: { ids },
  })
}
