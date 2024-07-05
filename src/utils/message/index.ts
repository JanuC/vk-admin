import { ElMessage } from 'element-plus'

export const messageSuccess = (message: string) => {
  ElMessage({
    message,
    type: 'success',
    duration: 2000,
  })
}

export const messageWarning = (message: string) => {
  ElMessage({
    message,
    type: 'warning',
    duration: 2000,
  })
}

export const messageError = (message: string) => {
  ElMessage({
    message,
    type: 'error',
    duration: 2000,
  })
}

export const messageInfo = (message: string) => {
  ElMessage({
    message,
    type: 'info',
    duration: 2000,
  })
}
