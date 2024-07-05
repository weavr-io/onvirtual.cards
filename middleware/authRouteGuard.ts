import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import config from '~/config'

const Cookie = process.client ? require('js-cookie') : undefined

export default defineNuxtMiddleware(({ route, redirect }) => {
    const authCookie = Cookie.get(config.ONV_COOKIE_NAME)

    if (!authCookie) {
        const queryParam = route.query

        if (queryParam.cons && queryParam.email) {
            return redirect(`/login/verify?email=${queryParam.email}&cons=${queryParam.cons}`)
        }

        return redirect('/login')
    }
})
