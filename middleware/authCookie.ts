import { Middleware } from '@nuxt/types'
import { authStore } from '~/utils/store-accessor'
import { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/access/responses/LoginWithPasswordResponse'
import config from '~/config'

const Cookie = process.client ? require('js-cookie') : undefined

const cookieMiddleware: Middleware = async ({ store }) => {
  let auth: LoginWithPasswordResponse | null = null

  const authCookie = Cookie.get(config.ONV_COOKIE_NAME)
  if (authCookie) {
    try {
      auth = JSON.parse(authCookie)
      await authStore(store).SET_AUTH(auth)
    } catch (err) {
      // No valid cookie found
      await authStore(store).logout()
    }
  }
}

export default cookieMiddleware
