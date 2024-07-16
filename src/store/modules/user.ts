import { defineStore } from 'pinia'

import { Names } from '../name'

// interface UserProp {
//   id: string
//   username: string
//   nickName: string
//   isDel: 0 | 1
//   avatar: string | null
//   createTime: Date
//   updateTime: Date
// }

export const useUserStore = defineStore(Names.User, {
  state: () => {
    return {
      userInfo: {} as UserProps,
      accessToken: '',
    }
  },
  actions: {
    setUserInfo(userInfo: UserProps) {
      this.userInfo = userInfo
    },
    setToken(token: string) {
      this.accessToken = token
    },
  },
  persist: {
    key: 'user',
    storage: localStorage,
  },
})
