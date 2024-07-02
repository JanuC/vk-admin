// 全局 Notification 通知

import { ElNotification } from 'element-plus'

export const noticeSuccess = (message: string) => {
  ElNotification.success({
    title: 'Success',
    message,
    type: 'success',
    duration: 2000,
  })
}

export const noticeInfo = (message: string) => {
  ElNotification.success({
    title: 'Notice',
    message,
    type: 'info',
    duration: 2000,
  })
}

export const noticeWarn = (message: string) => {
  ElNotification.success({
    title: 'Warn',
    message,
    type: 'warning',
    duration: 2000,
  })
}

export const noticeError = (message: string) => {
  ElNotification.success({
    title: 'Fail',
    message,
    type: 'error',
    duration: 2000,
  })
}
