import axios from 'axios'
import router from '@/router'
import { ElNotification } from 'element-plus'
import { refresh } from '@/http/api/auth'
import { useStore } from '@/store'

const request = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
})

request.interceptors.request.use(
  (req) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      req.headers['Authorization'] = `Bearer ${accessToken}`
    } else {
      router.push('/ligin')
    }
    return req
  },
  (err) => {
    console.log('请求拦截错误', err)
    return Promise.reject(err)
  }
)

// 声明一个全局变量，用于当前是否正在刷新token
let isRefreshingToken = false

// 当前正在刷新token时，存储下同一时间的请求，方便token刷新完成后重新请求
let requests: any[] = []

// 响应拦截
request.interceptors.response.use(
  (res: any) => {
    const { data } = res
    return Promise.resolve(data)
  },
  async (err) => {
    const { user } = useStore()
    const { response, config } = err

    const { message } = response.data
    if (response.status === 401) {
      const { url } = config
      if (url === '/auth/refresh') {
        // 如果是请求刷新token接口返回的 401，说明全部token都已经失效
        ElNotification({
          title: 'Failed',
          message,
          type: 'error',
        })
        router.push('/login')
      } else {
        // 请求其他接口返回的 401，可能只是  accessToken 失效
        if (!isRefreshingToken) {
          // 说明当前没有在刷新 token
          isRefreshingToken = true

          const { username } = user.userInfo

          const res = await refresh({ username })

          if (res) {
            const { accessToken } = res.data
            // 存储 token
            localStorage.setItem('accessToken', accessToken)

            // 设置token在config中
            config.headers['Authorization'] = `Bearer ${accessToken}`

            // 拿到了最新的 token，执行刷新token期间的其他请求
            requests.forEach((callback) => callback(accessToken))

            // 已完成 token 刷新
            isRefreshingToken = false

            // 执行最开始返回 401 的请求
            return request(config)
          }
        }
      }
    } else {
      ElNotification({
        title: 'Failed',
        message,
        type: 'error',
      })
    }
  }
)

export default request
