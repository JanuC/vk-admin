import { defineStore } from 'pinia'

import { Names } from '../name'

export const useUserStore = defineStore(Names.User, {
  state: () => {
    return {
      userInfo: {} as UserProps,
      // accessToken: '',
    }
  },
  actions: {
    setUserInfo(userInfo: UserProps) {
      this.userInfo = userInfo
    },
    // setToken(token: string) {
    //   this.accessToken = token
    // },
  },
  persist: {
    key: 'user',
    storage: localStorage,
  },
})
