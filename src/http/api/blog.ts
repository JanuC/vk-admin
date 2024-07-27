import request from '..'

export const createNewBlog = (data: newBlogProps) => {
  return request({
    method: 'POST',
    url: '/blog',
    data,
  })
}
