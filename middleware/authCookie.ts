import type { Middleware } from '~/node_modules/@nuxt/types'
import { useBase } from '~/composables/useBase'
import config from '~/config'

const Cookie = (await import('js-cookie')).default
const { authStore } = useBase()

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

const cookieMiddleware: Middleware = async ({ route, redirect }) => {
    const authCookie = Cookie.get(config.ONV_COOKIE_NAME)

    if (authCookie) {
        try {
            const auth = JSON.parse(authCookie)
            await authStore.setAuth(auth)
            scaCheck(route, redirect)
        } catch (err) {
            // No valid cookie found
            await authStore.logout()
        }
    } else {
        localStorage.removeItem('stepUp')
        localStorage.removeItem('scaSmsSent')
    }
}

export default cookieMiddleware
