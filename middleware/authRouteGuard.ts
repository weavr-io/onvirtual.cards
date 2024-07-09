import config from '~/config'

const Cookie = import.meta.client ? require('js-cookie') : undefined

export default defineNuxtRouteMiddleware((to) => {
    const authCookie = Cookie.get(config.ONV_COOKIE_NAME)

    if (!authCookie) {
        const queryParam = to.query

        if (queryParam.cons && queryParam.email) {
            return navigateTo(`/login/verify?email=${queryParam.email}&cons=${queryParam.cons}`)
        }

        return navigateTo('/login')
    }
})
