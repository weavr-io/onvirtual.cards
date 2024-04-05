import type { Context, Plugin } from '@nuxt/types'
import { useBase } from '@/composables/useBase'

const { useRuntimeConfig, authStore, errorsStore } = useBase()

const axiosPlugin: Plugin = (ctxt: Context, inject) => {
    const axiosMulti = ctxt.$axios.create({
        headers: {
            common: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        },
        baseURL: useRuntimeConfig().public.multiApi.baseUrl,
    })

    function onError(error) {
        const code = parseInt(error.response && error.response.status)
        switch (code) {
            case 401:
                if (error.response.config.url !== '/logout') authStore.logout()
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
                    authStore.resetTokenAndStates()
                    ctxt.redirect('/login')
                }
                break
            case 409:
                errorsStore.setConflict(error)
                break
            default:
                errorsStore.setError(error)
                break
        }

        return Promise.reject(error)
    }

    axiosMulti.interceptors.response.use((res) => res, onError)

    // Inject to context as $axiosMulti
    inject('axiosMulti', axiosMulti)
}

export default axiosPlugin
