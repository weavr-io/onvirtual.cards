import { Middleware } from '~/node_modules/@nuxt/types'
import { useAccessCodesStore } from '~/store/accessCodes'

const accessCodeVerified: Middleware = async ({ redirect, route, $config }) => {
    if (!$config.production) {
        return
    }

    const accessCodeStore = useAccessCodesStore()

    const accessCode = () => {
        return +localStorage.getItem('onv-access-code')! ?? undefined
    }

    if (accessCode()) {
        await accessCodeStore.verifyAccessCode({ code: accessCode() }).catch(() => {
            redirect('/register')
        })
    } else if (route.name !== 'register') {
        redirect('/register')
    }
}

export default accessCodeVerified
