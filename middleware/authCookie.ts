import { Middleware } from '@nuxt/types'
import { authStore } from '~/utils/store-accessor'
import { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/access/responses/LoginWithPasswordResponse'

const Cookie = process.client ? require('js-cookie') : undefined

const cookieMiddleware: Middleware = async ({ store, redirect }) => {
  let auth: LoginWithPasswordResponse | null = null

  const authCookie = Cookie.get('auth-onv')
  if (authCookie) {
    try {
      auth = JSON.parse(authCookie)
      await authStore(store).SET_AUTH(auth)
      console.log('valid cookie found')
    } catch (err) {
      // No valid cookie found
      await authStore(store).logout()
      console.log('no valid cookie found')
    }
  }
}

export default cookieMiddleware
