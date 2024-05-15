import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { useAccessCodesStore } from '~/store/accessCodes'

const accessCode = () => {
    return +localStorage.getItem('onv-access-code')! ?? undefined
}

export default defineNuxtMiddleware(async ({ route, redirect, $config }) => {
    if (!$config.production) return

    try {
        const accessCodeStore = useAccessCodesStore()

        if (accessCode()) {
            await accessCodeStore.verifyAccessCode({ code: accessCode() })
        } else if (route.name !== 'register') {
            redirect('/register')
        }
    } catch (_) {
        redirect('/register')
    }
})
