import { api } from '~/api/Axios'
import * as Error from '~/store/modules/Error'

export default function createInterceptors() {
  return (store) => {
    function onError(error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            store.commit('auth/LOGOUT', error.response, { root: true })
            // @ts-ignore
            window.$nuxt.$router.push('/login')
            break
          case 403:
            // @ts-ignore
            window.$nuxt.$router.replace('/forbidden')
            break
          case 409:
            Error.Helpers.setConflict(store, error)
            return Promise.reject(error)
          default:
            Error.Helpers.setError(store, error)
            return Promise.reject(error)
        }
      }
    }

    api.interceptors.request.use(undefined, onError)
    api.interceptors.response.use(undefined, onError)
  }
}
