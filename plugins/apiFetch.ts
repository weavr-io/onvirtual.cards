import { $fetch, type FetchOptions } from 'ofetch'
import { useStores } from '~/composables/useStores'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig().public
    const route = useRoute()
    const router = useRouter()
    const { auth, errors } = useStores(['auth', 'errors'])

    const apiFetch = $fetch.create({
        baseURL: config.multiApi.baseUrl,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        onRequest({ options }) {
            const token = auth?.token
            if (token) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                } as Headers
            }
        },
        onResponseError({ response, request }) {
            const code = response.status
            const message = response._data?.message
            const url = response.url || (request instanceof Request ? request.url : '') || ''

            switch (code) {
                case 401:
                    if (!url.includes('/logout')) auth?.logout()
                    router.push('/login')
                    break
                case 403:
                    if (
                        route.name !== 'login' &&
                        message === 'STEP_UP_REQUIRED' &&
                        localStorage.getItem('stepUp') !== 'TRUE'
                    ) {
                        router.push('/login/sca')
                    } else if (route.name !== 'login') {
                        auth?.resetTokenAndStates()
                        router.push('/login')
                    }
                    break
                case 409:
                    errors?.setConflict(response as any)
                    break
                default:
                    errors?.setError(response)
                    break
            }
        },
    })

    async function apiFetchWrapper<T>(
        url: string,
        options: FetchOptions<'json'> = {},
    ): Promise<{ data: T }> {
        const data = await apiFetch<T>(url, options)
        return { data }
    }

    return {
        provide: {
            apiFetch: apiFetchWrapper,
        },
    }
})
