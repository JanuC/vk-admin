import axios from 'axios'
import router from '@/router'
// import { ElNotification } from 'element-plus'
import { noticeError } from '@/utils/Notification'
import { refresh } from '@/http/api/auth'
import { useStore } from '@/store'
import { ElLoading } from 'element-plus'
import _ from 'lodash'

const request = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
})

// 是否正在请求中
let loading: any

// 当前请求数
let requestCount: number = 0

// 开始请求的时间
let startTime: number

// 显示 loading
const showLoading = (target?: HTMLElement) => {
  if (requestCount === 0 && !loading) {
    startTime = Date.now()
    loading = ElLoading.service({
      lock: true,
      text: '加载中...',
      target: target || 'body',
    })
  }
  requestCount++
}

let timer: any
// 隐藏loading
const hideLoading = () => {
  requestCount--
  requestCount = Math.max(requestCount, 0)

  if (requestCount === 0) {
    toHideLoading()
    if (timer) clearTimeout(timer)
  }
}

// 防抖
const toHideLoading = _.debounce(() => {
  loading.close()
  loading = null
}, 100)

let minLoadTime: number = 500 // 最少请求时间
const computedTime = (endTime: number) => {
  return new Promise((resolve) => {
    // 时间差
    let timeDifference = endTime - startTime
    if (timeDifference > minLoadTime) {
      hideLoading()
      resolve(null)
    } else {
      timer = setTimeout(() => {
        hideLoading()
        resolve(null)
      }, minLoadTime - timeDifference)
    }
  })
}

request.interceptors.request.use(
  (req) => {
    showLoading()

    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      req.headers['Authorization'] = `Bearer ${accessToken}`
    } else {
      router.push('/login')
    }
    return req
  },
  async (err) => {
    // computedTime(Da)
    await computedTime(Date.now())
    console.log('请求被拦截', err)

    return Promise.reject(err)
  }
)

// 声明一个全局变量，用于当前是否正在刷新token
let isRefreshingToken = false

// 当前正在刷新token时，存储下同一时间的请求，方便token刷新完成后重新请求
let requests: any[] = []

// 响应拦截
request.interceptors.response.use(
  async (res: any) => {
    const { data } = res
    await computedTime(Date.now())
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
        noticeError(message)
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
      await computedTime(Date.now())
      noticeError(message)
    }
    return Promise.reject(err)
  }
)

export default request
