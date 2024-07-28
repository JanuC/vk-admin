import request from '..'

export const uploadImage = (data: any): Promise<ResponseProps<FileProps>> => {
  return request({
    method: 'POST',
    url: '/file/image',
    data,
  })
}
