import { Middleware } from '~/node_modules/@nuxt/types'
import { accessCodesStore } from '~/utils/store-accessor'

const accessCodeVerified: Middleware = async ({ store, redirect, route, $config }) => {
    if (!$config.production) {
        return
    }

    const accessCodeStore = accessCodesStore(store)

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
