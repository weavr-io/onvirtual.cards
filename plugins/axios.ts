import config from '~/config'
import { authStore, errorsStore } from '~/utils/store-accessor'

export default function({ $axios, redirect, store }, inject) {
  const api = $axios.create({
    headers: {
      common: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    },
    baseURL: config.api.baseUrl
  })

  const axiosMulti = $axios.create({
    headers: {
      common: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    },
    baseURL: config.multiApi.baseUrl
  })

  function onRequest(config) {
    console.log('Making request to: ' + config.url)
  }

  function onError(error) {
    const code = parseInt(error.response && error.response.status)

    switch (code) {
      case 401:
        authStore(store).LOGOUT()
        redirect('/login')
        return
      case 403:
        redirect('/forbidden')
        return
      case 409:
        errorsStore(store).SET_CONFLICT(error)
        break
      default:
        errorsStore(store).SET_ERROR(error)
        break
    }

    return Promise.reject(error)
  }

  axiosMulti.interceptors.response.use(undefined, onError)

  api.onRequest(onRequest)
  api.onError(onError)

  // Inject to context as $api
  inject('api', api)

  // Inject to context as $axiosMulti
  inject('axiosMulti', axiosMulti)
}
