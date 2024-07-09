import axios from 'axios'
import { initialiseStores } from '~/utils/pinia-store-accessor'

export default defineNuxtPlugin(({ vueApp }) => {
    const config = useRuntimeConfig().public
    const route = useRoute()
    const { auth, errors } = initialiseStores(['auth', 'errors'])
    const axiosMulti = axios.create({
        headers: {
            common: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        },
        baseURL: config.multiApi.baseUrl,
    })

    function onError(error) {
        const code = parseInt(error.response?.status)
        switch (code) {
            case 401:
                if (error.response.config.url !== '/logout') auth?.logout()
                navigateTo('/login')
                break
            case 403:
                if (
                    route.name !== 'login' &&
                    error.response.data.message === 'STEP_UP_REQUIRED' &&
                    localStorage.getItem('stepUp') !== 'TRUE'
                ) {
                    navigateTo('/login/sca')
                } else if (route.name !== 'login') {
                    auth?.resetTokenAndStates()
                    navigateTo('/login')
                }
                break
            case 409:
                errors?.setConflict(error)
                break
            default:
                errors?.setError(error)
                break
        }

        return Promise.reject(new Error(error))
    }

    axiosMulti.interceptors.response.use((res) => res, onError)

    vueApp.provide('axiosMulti', axiosMulti)
})
