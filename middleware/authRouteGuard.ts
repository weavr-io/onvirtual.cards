import { Middleware } from '~/node_modules/@nuxt/types'
import config from '~/config'

const Cookie = process.client ? require('js-cookie') : undefined

const authRouteGuard: Middleware = async ({ store, route, redirect }) => {
  const authCookie = Cookie.get(config.ONV_COOKIE_NAME)

  if (!authCookie) {
    return redirect('/login')
  }
}

export default authRouteGuard
