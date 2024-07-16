import { useRouteStore } from './modules/route'
import { useUserStore } from './modules/user'
export const useStore = () => {
  return {
    user: useUserStore(),
    routeStore: useRouteStore(),
  }
}
