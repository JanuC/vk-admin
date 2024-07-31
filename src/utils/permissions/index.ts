import { useStore } from '@/store'

export const checkPermission = (targetPerm: string[]): boolean => {
  const { user } = useStore()
  return targetPerm.every((perm) => user.userInfo.permissions?.includes(perm))
}
