// import { useStore } from '@/store'
// import { noticeError } from '@/utils/Notification'
// import axios from 'axios'
// import { refresh } from './api/auth'
// import router from '@/router'
// import _ from 'lodash'

// const request = axios.create({
//   withCredentials: true, // 允许跨域
//   baseURL: import.meta.env.VITE_BASE_URL,
//   timeout: 5000,
// })

// const { loadingStore } = useStore()

// let requestCount: number = 0
// // 开始请求的时间
// let startTime: number
// let minLoadTime: number = 500 // 最少请求时间
// let timer: any

// // 显示 loading
// const showLoading = () => {
//   if (requestCount === 0 && !loadingStore.isLoading) {
//     startTime = Date.now()
//     loadingStore.setIsLoading(true)
//     requestCount++
//   }
// }

// const computedTime = (endTime: number) => {
//   return new Promise((resolve) => {
//     // 时间差
//     let timeDifference = endTime - startTime
//     if (timeDifference > minLoadTime) {
//       hideLoading()
//       resolve(null)
//     } else {
//       timer = setTimeout(() => {
//         hideLoading()
//         resolve(null)
//       }, minLoadTime - timeDifference)
//     }
//   })
// }

// // 隐藏loading
// const hideLoading = () => {
//   requestCount--
//   requestCount = Math.max(requestCount, 0)

//   if (requestCount === 0) {
//     toHideLoading()
//     if (timer) clearTimeout(timer)
//   }
// }

// // 防抖
// const toHideLoading = _.debounce(() => {
//   if (loadingStore.isLoading) {
//     loadingStore.setIsLoading(false)
//   }
// }, 0)

// // 全局请求拦截
// request.interceptors.request.use(
//   (req) => {
//     showLoading()

//     const { user } = useStore()
//     const accessToken = user.accessToken
//     if (accessToken) {
//       req.headers['Authorization'] = `Bearer ${accessToken}`
//     } else {
//       router.push('/login')
//     }
//     return req
//   },
//   async (err) => {
//     console.log('请求拦截时发生错误')
//     computedTime(Date.now())
//     return Promise.reject(err)
//   }
// )

// // 声明 一个全局变量，用于判断当前是否在刷新token
// let isRefreshingToken = false

// // 当前正在刷新token时，存储下同一时间的请求，方便token刷新完成后重新请求
// let requests: any[] = []

// // 全局响应拦截
// request.interceptors.response.use(
//   async (res) => {
//     const { data } = res
//     computedTime(Date.now())
//     return Promise.resolve(data)
//   },
//   async (err) => {
//     const { response, config } = err
//     const { message } = response.data
//     const { user } = useStore()
//     // const router = useRouter()
//     if (response.status === 401) {
//       // 当前 accessToken 已失效
//       const { url } = config

//       if (url === '/auth/refresh') {
//         computedTime(Date.now())
//         noticeError(message)

//         router.push('/login')
//       } else {
//         // 其他请求返回的 401，请求刷新token
//         if (!isRefreshingToken) {
//           isRefreshingToken = true
//           const { username } = user.userInfo

//           try {
//             const res = await refresh({ username })
//             if (res) {
//               const { accessToken } = res.data
//               user.setToken(accessToken)
//               // 设置token在config中
//               config.headers['Authorization'] = `Bearer ${accessToken}`

//               // 拿到了最新的 token，执行刷新token期间的其他请求
//               requests.forEach((callback) => callback(accessToken))

//               // 已完成 token 刷新
//               isRefreshingToken = false
//               computedTime(Date.now())
//               // 执行最开始返回 401 的请求
//               return request(config)
//             }
//           } catch (refreshError) {
//             isRefreshingToken = false
//             computedTime(Date.now())
//             // noticeError('Token刷新失败，请重新登录')
//             router.push('/login')
//           }
//         } else {
//           requestCount = 0
//           computedTime(Date.now())
//           return new Promise((resolve) => {
//             requests.push((token: string) => {
//               // 保存当前请求的 config
//               config.headers['Authorization'] = `Bearer ${token}`
//               // 保存在队列中
//               resolve(request(config))
//             })
//           })
//         }
//       }
//     } else {
//       computedTime(Date.now())
//       noticeError(message)
//     }
//   }
// )

// export default request

import { useStore } from '@/store'
import { noticeError } from '@/utils/Notification'
import axios from 'axios'
import { refresh } from './api/auth'
import router from '@/router'
import _ from 'lodash'

const request = axios.create({
  withCredentials: true, // 允许跨域
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
})

const { loadingStore } = useStore()

let requestCount: number = 0
let startTime: number
let minLoadTime: number = 500 // 最少请求时间
let timer: any

// 显示 loading
const showLoading = () => {
  if (requestCount === 0 && !loadingStore.isLoading) {
    startTime = Date.now()
    loadingStore.setIsLoading(true)
    requestCount++
  }
}

const computedTime = (endTime: number) => {
  return new Promise((resolve) => {
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

// 隐藏loading
const hideLoading = () => {
  requestCount--
  requestCount = Math.max(requestCount, 0)

  if (requestCount === 0) {
    toHideLoading()
    // loadingStore.setIsLoading(false)
    if (timer) clearTimeout(timer)
  }
}

// 防抖
const toHideLoading = _.debounce(() => {
  if (loadingStore.isLoading) {
    loadingStore.setIsLoading(false)
  }
}, 0)

// 全局请求拦截
request.interceptors.request.use(
  (req) => {
    showLoading()

    const { user } = useStore()
    const accessToken = user.accessToken
    if (accessToken) {
      req.headers['Authorization'] = `Bearer ${accessToken}`
    } else {
      router.push('/login')
    }
    return req
  },
  async (err) => {
    console.log('请求拦截时发生错误')
    computedTime(Date.now())
    return Promise.reject(err)
  }
)

let isRefreshingToken = false
let requests: any[] = []

// 全局响应拦截
request.interceptors.response.use(
  async (res) => {
    const { data } = res
    computedTime(Date.now())
    return Promise.resolve(data)
  },
  async (err) => {
    const { response, config } = err
    const { message } = response.data
    const { user } = useStore()

    if (response.status === 401) {
      const { url } = config

      if (url === '/auth/refresh') {
        computedTime(Date.now())
        noticeError(message)
        router.push('/login')
        return Promise.reject(err)
      } else {
        if (!isRefreshingToken) {
          isRefreshingToken = true
          const { username } = user.userInfo

          try {
            const res = await refresh({ username })
            if (res) {
              const { accessToken } = res.data
              user.setToken(accessToken)
              config.headers['Authorization'] = `Bearer ${accessToken}`

              requests.forEach((callback) => callback(accessToken))
              requests = []
              isRefreshingToken = false
              computedTime(Date.now())
              return request(config)
            }
          } catch (refreshError) {
            isRefreshingToken = false
            computedTime(Date.now())
            router.push('/login')
            return Promise.reject(refreshError)
          }
        } else {
          requestCount = 0
          computedTime(Date.now())
          return new Promise((resolve) => {
            requests.push((token: string) => {
              config.headers['Authorization'] = `Bearer ${token}`
              resolve(request(config))
            })
          })
        }
      }
    } else {
      computedTime(Date.now())
      noticeError(message)
      return Promise.reject(err)
    }
  }
)

export default request
