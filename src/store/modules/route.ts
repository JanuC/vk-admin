import { defineStore } from 'pinia'

import { Names } from '../name'

export const useRouteStore = defineStore(Names.Route, {
  state: () => {
    return {
      isAddRoutes: false,
    }
  },
  actions: {
    setIsAddRoutes(flag: boolean) {
      this.isAddRoutes = flag
    },
  },
  // persist: true,
})
