import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import config from '~/config'
import { useAuthStore } from '~/store/auth'

const Cookie = process.client ? require('js-cookie') : undefined

const scaCheck = (route, redirect) => {
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

export default defineNuxtMiddleware(async ({ route, redirect }) => {
    const auth = useAuthStore()
    const authCookie = Cookie.get(config.ONV_COOKIE_NAME)

    if (authCookie) {
        try {
            const authCookieJson = JSON.parse(authCookie)
            await auth.setAuth(authCookieJson)

            scaCheck(route, redirect)
        } catch (err) {
            // No valid cookie found
            await auth.logout()
        }
    } else {
        localStorage.removeItem('stepUp')
        localStorage.removeItem('scaSmsSent')
    }
})
