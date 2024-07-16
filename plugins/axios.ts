import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import * as Sentry from '@sentry/browser'
import { initialiseStores } from '~/utils/pinia-store-accessor'

export default defineNuxtPlugin((ctxt, inject) => {
    const { auth, errors } = initialiseStores(['auth', 'errors'])
    const axiosMulti = ctxt.$axios.create({
        headers: {
            common: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        },
        baseURL: ctxt.$config.multiApi.baseUrl,
    })

    function sentryException(error) {
        Sentry.captureException(error)
    }

    function onError(error) {
        const code = parseInt(error.response && error.response.status)
        switch (code) {
            case 401:
                if (error.response.config.url !== '/logout') auth?.logout()
                sentryException(error)
                ctxt.redirect('/login')
                break
            case 403:
                if (
                    ctxt.route.name !== 'login' &&
                    error.response.data.message === 'STEP_UP_REQUIRED' &&
                    localStorage.getItem('stepUp') !== 'TRUE'
                ) {
                    ctxt.redirect('/login/sca')
                } else if (ctxt.route.name !== 'login') {
                    auth?.resetTokenAndStates()
                    ctxt.redirect('/login')
                }
                sentryException(error)
                break
            case 409:
                errors?.setConflict(error)
                sentryException(error)
                break
            default:
                console.log('ahs')
                errors?.setError(error)
                sentryException(error)
                break
        }

        return Promise.reject(error)
    }

    axiosMulti.interceptors.response.use((res) => res, onError)

    // Inject to context as $axiosMulti
    inject('axiosMulti', axiosMulti)
})
