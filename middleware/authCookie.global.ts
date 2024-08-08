import type { RouteLocationNormalized } from 'vue-router'
import type { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication'
import { useAuthStore } from '~/store/auth'
import config from '~/config'

const scaCheck = async (route) => {
    if (
        !route.name?.startsWith('register') &&
        !route.name?.startsWith('profile-address') &&
        !route.name?.startsWith('login') &&
        !route.name?.startsWith('profile-mobile-add') &&
        localStorage.getItem('stepUp') === 'FALSE'
    ) {
        return await navigateTo('/login/sca')
    }
}

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
    const auth = useAuthStore()
    const authCookie = useCookie(config.ONV_COOKIE_NAME)

    if (authCookie.value) {
        try {
            const authCookieJson = authCookie.value as unknown as LoginWithPasswordResponse
            auth.setAuth(authCookieJson)

            await scaCheck(to)
        } catch (err) {
            // No valid cookie found
            await auth.logout()
        }
    } else {
        localStorage.removeItem('stepUp')
        localStorage.removeItem('scaSmsSent')
    }
})
