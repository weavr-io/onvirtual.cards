import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { useAccessCodesStore } from '~/store/accessCodes'

export default defineNuxtMiddleware(({ route, redirect, $config }) => {
    if (!$config.production) return

    const accessCodeStore = useAccessCodesStore()

    const accessCode = () => {
        return +localStorage.getItem('onv-access-code')! ?? undefined
    }

    if (accessCode()) {
        accessCodeStore.verifyAccessCode({ code: accessCode() }).catch(() => {
            redirect('/register')
        })
    } else if (route.name !== 'register') {
        redirect('/register')
    }
})
