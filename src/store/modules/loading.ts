import { defineStore } from 'pinia'

import { Names } from '../name'

export const useLoadingStore = defineStore(Names.Loading, {
  state: () => {
    return {
      isLoading: false,
      startLoading: 0,
      minLoadingTime: 500,
      requestCount: 0,
    }
  },
  actions: {
    setIsLoading(flag: boolean) {
      if (flag) {
        this.startLoading = Date.now()
        this.requestCount += 1
        this.isLoading = flag
      } else {
        this.requestCount -= 1
        this.requestCount = Math.max(this.requestCount, 0)

        if (this.requestCount === 0) {
          const timeDifference = this.minLoadingTime - (Date.now() - this.startLoading)
          if (timeDifference > 0) {
            setTimeout(() => {
              this.isLoading = flag
            }, timeDifference)
          } else {
            this.isLoading = flag
          }
        }
      }
    },
  },
})
