import type { RouteLocationNormalized } from 'vue-router'
import config from '~/config'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
    const authCookie = useCookie(config.ONV_COOKIE_NAME)

    if (!authCookie.value) {
        const queryParam = to.query

        if (queryParam.cons && queryParam.email) {
            return navigateTo(`/login/verify?email=${queryParam.email}&cons=${queryParam.cons}`)
        }

        return navigateTo('/login')
    }
})
