import { Context, Plugin } from '@nuxt/types'
import { authStore, errorsStore } from '~/utils/store-accessor'

const axiosPlugin: Plugin = (ctxt: Context, inject) => {
    const axiosMulti = ctxt.$axios.create({
        headers: {
            common: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        },
        baseURL: ctxt.$config.multiApi.baseUrl,
    })

    function onError(error) {
        const code = parseInt(error.response && error.response.status)
        switch (code) {
            case 401:
                if (error.response.config.url !== '/logout') authStore(ctxt.store).logout()
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
                    authStore(ctxt.store).resetTokenAndStates()
                    ctxt.redirect('/login')
                }
                break
            case 409:
                errorsStore(ctxt.store).SET_CONFLICT(error)
                break
            default:
                errorsStore(ctxt.store).SET_ERROR(error)
                break
        }

        return Promise.reject(error)
    }

    axiosMulti.interceptors.response.use((res) => res, onError)

    // Inject to context as $axiosMulti
    inject('axiosMulti', axiosMulti)
}

export default axiosPlugin
