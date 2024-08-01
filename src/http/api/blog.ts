import request from '..'

export const createNewBlog = (data: newBlogProps) => {
  return request({
    method: 'POST',
    url: '/blog',
    data,
  })
}

export const getBlogListByFilter = (params: QueryBlogParamsProps): Promise<ResponseProps<BlogResProps>> => {
  return request({
    method: 'GET',
    url: '/blog/list/filter',
    params,
  })
}

export const downloadBlog = (fileName: string): Promise<BlobPart> => {
  return request({
    method: 'GET',
    url: '/blog/file/download',
    params: { fileName },
    responseType: 'blob',
  })
}

export const deleteBlogById = (id: string) => {
  return request({
    method: 'DELETE',
    url: `/blog/${id}`,
  })
}

export const getBlogById = (id: string): Promise<ResponseProps<BlogProps>> => {
  return request({
    method: 'GET',
    url: `/blog/${id}`,
  })
}

export const updateBlogById = (id: string, data: newBlogProps) => {
  return request({
    method: 'PATCH',
    url: `/blog/${id}`,
    data,
  })
}

export const updateBlogCountById = (id: string) => {
  return request({
    method: 'PATCH',
    url: `/blog/view/count/${id}`,
  })
}
