import config from '~/config'
import * as Error from '~/store/modules/Error'

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

  function onRequest(config) {
    // console.log('Making request to: ' + config.url)
  }

  function onError(error) {
    const code = parseInt(error.response && error.response.status)

    switch (code) {
      case 401:
        store.commit('auth/LOGOUT', error.response, { root: true })
        redirect('/login')
        return
      case 403:
        redirect('/forbidden')
        return
      case 409:
        Error.Helpers.setConflict(store, error)
        break
      default:
        Error.Helpers.setError(store, error)
        break
    }

    return Promise.reject(error)
  }

  api.onRequest(onRequest)
  api.onError(onError)

  // Inject to context as $api
  inject('api', api)
}
