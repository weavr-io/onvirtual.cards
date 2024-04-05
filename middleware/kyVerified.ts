import type { Middleware } from '@nuxt/types'
import { useBase } from '~/composables/useBase'

const { authStore, consumersStore, corporatesStore } = useBase()
const kyVerified: Middleware = async ({ route, redirect }) => {
    if (authStore.isLoggedIn) {
        if (authStore.isConsumer) {
            try {
                if (route.name === 'managed-accounts-kyb') {
                    return redirect('/managed-accounts/kyc')
                }

                await consumersStore.checkKYC()

                if (route.name === 'managed-accounts-kyc') {
                    return redirect('/managed-accounts/add')
                }
            } catch (_) {
                if (
                    route.name === 'managed-accounts-add' ||
                    route.name === 'managed-cards-add' ||
                    route.name === 'managed-accounts'
                ) {
                    return redirect('/managed-accounts/kyc')
                }
            }
        } else {
            try {
                if (route.name?.includes('managed-accounts-kyc')) {
                    return redirect('/managed-accounts/kyb')
                }

                await corporatesStore.checkKYB()

                if (route.name === 'managed-accounts-kyb') {
                    return redirect('/managed-accounts')
                }
            } catch (_) {
                if (
                    route.name === 'managed-accounts-add' ||
                    route.name === 'managed-cards-add' ||
                    route.name === 'managed-accounts'
                ) {
                    return redirect('/managed-accounts/kyb')
                }
            }
        }
    } else {
        return redirect('/login')
    }
}
export default kyVerified
