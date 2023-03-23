import { Middleware } from '@nuxt/types'
import { authStore } from '~/utils/store-accessor'
import { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/access/responses/LoginWithPasswordResponse'
import config from '~/config'

const Cookie = process.client ? require('js-cookie') : undefined

function scaCheck(route, redirect) {
  if (
    !route.name?.startsWith('register') &&
    !route.name?.startsWith('profile-address') &&
    !route.name?.startsWith('login') &&
    localStorage.getItem('stepUp') === 'FALSE'
  ) {
    return redirect('/login/sca')
  }
}

const cookieMiddleware: Middleware = async ({ store, route, redirect }) => {
  let auth: LoginWithPasswordResponse | null = null

  const authCookie = Cookie.get(config.ONV_COOKIE_NAME)
  if (authCookie) {
    try {
      auth = JSON.parse(authCookie)
      await authStore(store).SET_AUTH(auth)
      scaCheck(route, redirect)
    } catch (err) {
      // No valid cookie found
      await authStore(store).logout()
    }
  } else {
    if (localStorage.getItem('stepUp')) {
      localStorage.removeItem('stepUp')
    }
    if (localStorage.getItem('scaSmsSent')) {
      localStorage.removeItem('scaSmsSent')
    }
  }
}

export default cookieMiddleware
