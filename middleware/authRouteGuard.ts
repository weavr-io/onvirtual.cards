import type { Middleware } from '~/node_modules/@nuxt/types'
import config from '~/config'

const Cookie = process.client ? require('js-cookie') : undefined

const authRouteGuard: Middleware = ({ redirect, route }) => {
    const authCookie = Cookie.get(config.ONV_COOKIE_NAME)

    if (!authCookie) {
        const queryParam = route.query
        if (queryParam.cons && queryParam.email) {
            return redirect(`/login/verify?email=${queryParam.email}&cons=${queryParam.cons}`)
        }
        return redirect('/login')
    }
}

export default authRouteGuard
