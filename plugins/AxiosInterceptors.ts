import { api } from '~/api/Axios'

export default function createInterceptors() {
  return (store) => {
    function onError(error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            store.commit('auth/LOGOUT', error.resxponse, { root: true })
            // @ts-ignore
            window.$nuxt.$router.push('/login')
            break
          case 403:
            // @ts-ignore
            window.$nuxt.$router.replace('/forbidden')
            break
          default:
            store.commit('error/SET_ERROR', error.response, { root: true })
            return Promise.reject(error)
        }
      }
    }

    api.interceptors.request.use(undefined, onError)
    api.interceptors.response.use(undefined, onError)
  }
}
