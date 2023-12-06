import { Middleware } from '@nuxt/types'
import { authStore } from '~/utils/store-accessor'
import config from '~/config'

const Cookie = process.client ? require('js-cookie') : undefined

function scaCheck(route, redirect) {
    if (
        !route.name?.startsWith('register') &&
        !route.name?.startsWith('profile-address') &&
        !route.name?.startsWith('login') &&
        !route.name?.startsWith('profile-mobile-add') &&
        localStorage.getItem('stepUp') === 'FALSE'
    ) {
        return redirect('/login/sca')
    }
}

const cookieMiddleware: Middleware = async ({ store, route, redirect }) => {
    const _authStore = authStore(store)

    const authCookie = Cookie.get(config.ONV_COOKIE_NAME)

    if (authCookie) {
        try {
            const auth = JSON.parse(authCookie)
            await _authStore.SET_AUTH(auth)
            scaCheck(route, redirect)
        } catch (err) {
            // No valid cookie found
            await _authStore.logout()
        }
    } else {
        localStorage.removeItem('stepUp')
        localStorage.removeItem('scaSmsSent')
    }
}

export default cookieMiddleware
