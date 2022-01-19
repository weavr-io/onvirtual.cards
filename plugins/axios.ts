import { Plugin } from '@nuxt/types'
import { authStore, errorsStore } from '~/utils/store-accessor'

const axiosPlugin: Plugin = (ctxt, inject) => {
  // Todo: remove api
  const api = ctxt.$axios.create({
    headers: {
      common: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    },
    baseURL: ctxt.$config.api.baseUrl
  })

  const axiosMulti = ctxt.$axios.create({
    headers: {
      common: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    },
    baseURL: ctxt.$config.multiApi.baseUrl
  })

  function onRequest(config) {
    console.log('Making request to: ' + config.url)
  }

  function onError(error) {
    const code = parseInt(error.response && error.response.status)

    switch (code) {
      case 401:
        authStore(ctxt.store).logout()
        ctxt.redirect('/login')
        return
      case 403:
        ctxt.redirect('/forbidden')
        return
      case 409:
        errorsStore(ctxt.store).SET_CONFLICT(error)
        break
      default:
        errorsStore(ctxt.store).SET_ERROR(error)
        break
    }

    return Promise.reject(error)
  }

  axiosMulti.interceptors.response.use((res) => res, onError)
  // axiosMulti.onError(onError)

  api.onRequest(onRequest)
  api.onError(onError)

  // Inject to context as $api
  inject('api', api)

  // Inject to context as $axiosMulti
  inject('axiosMulti', axiosMulti)
}

export default axiosPlugin
