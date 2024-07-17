import { defineStore } from 'pinia'

import { Names } from '../name'

export const useLoadingStore = defineStore(Names.Loading, {
  state: () => {
    return {
      isLoading: false,
      requestCount: 0,
    }
  },
  // getters: {
  //   addRequesetCount() {
  //     this.requestCount += 1
  //   },
  //   decRequestCount() {
  //     this.requestCount -= 1
  //     this.requestCount = Math.max(this.requestCount, 0)
  //     if (this.requestCount === 0) {
  //       this.isLoading = false
  //     }
  //   },
  // },
  actions: {
    setIsLoading(flag: boolean) {
      this.isLoading = flag
    },
    addRequesetCount() {
      this.requestCount += 1
      console.log('xx')

      if (!this.requestCount) this.isLoading = true
    },
    decRequestCount() {
      this.requestCount -= 1
      this.requestCount = Math.max(this.requestCount, 0)
      if (this.requestCount === 0) {
        this.isLoading = false
      }
    },
  },
})
