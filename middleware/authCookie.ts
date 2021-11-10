import { Middleware } from '@nuxt/types'
import { authStore } from '~/utils/store-accessor'
import { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/responses/LoginWithPasswordResponse'

const Cookie = process.client ? require('js-cookie') : undefined

const cookieMiddleware: Middleware = async ({ store }) => {
  let auth: LoginWithPasswordResponse | null = null

  const authCookie = Cookie.get('auth-onv')
  if (authCookie) {
    try {
      auth = JSON.parse(authCookie)
      await authStore(store).SET_AUTH(auth)
      console.log('valid cookie found')
    } catch (err) {
      debugger
      // No valid cookie found
      console.log('no valid cookie found')
    }
  }
}

export default cookieMiddleware
