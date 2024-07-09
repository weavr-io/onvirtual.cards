import { useAccessCodesStore } from '~/store/accessCodes'

const accessCode = () => {
    const accessCode = localStorage.getItem('onv-access-code')
    return accessCode !== null ? +accessCode : undefined
}

export default defineNuxtRouteMiddleware(async (to) => {
    if (!useRuntimeConfig().public.production) return

    try {
        const accessCodeStore = useAccessCodesStore()

        if (accessCode()) {
            await accessCodeStore.verifyAccessCode({ code: accessCode() })
        } else if (to.name !== 'register') {
            navigateTo('/register')
        }
    } catch (_) {
        navigateTo('/register')
    }
})
