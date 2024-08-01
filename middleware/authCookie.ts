import config from '~/config'
import { useAuthStore } from '~/store/auth'

const scaCheck = (route) => {
    if (
        !route.name?.startsWith('register') &&
        !route.name?.startsWith('profile-address') &&
        !route.name?.startsWith('login') &&
        !route.name?.startsWith('profile-mobile-add') &&
        localStorage.getItem('stepUp') === 'FALSE'
    ) {
        return navigateTo('/login/sca')
    }
}

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()
    const authCookie = useCookie(config.ONV_COOKIE_NAME)

    if (authCookie.value) {
        try {
            const authCookieJson = JSON.parse(authCookie.value)
            await auth.setAuth(authCookieJson)

            scaCheck(to)
        } catch (err) {
            // No valid cookie found
            await auth.logout()
        }
    } else {
        localStorage.removeItem('stepUp')
        localStorage.removeItem('scaSmsSent')
    }
})
