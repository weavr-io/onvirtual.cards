import type { Middleware } from '~/node_modules/@nuxt/types'
import { useBase } from '~/composables/useBase'

const { accessCodesStore } = useBase()
const accessCodeVerified: Middleware = async ({ redirect, route, $config }) => {
    if (!$config.production) {
        return
    }

    const accessCode = () => {
        const item = localStorage.getItem('onv-access-code')
        return item !== null ? +item : undefined
    }

    if (accessCode()) {
        await accessCodesStore.verifyAccessCode({ code: accessCode() }).catch(() => {
            redirect('/register')
        })
    } else if (route.name !== 'register') {
        redirect('/register')
    }
}

export default accessCodeVerified
