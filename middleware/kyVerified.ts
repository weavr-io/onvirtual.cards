import type { Middleware } from '@nuxt/types'
import { initialiseStores } from '~/utils/pinia-store-accessor'

const kyVerified: Middleware = async ({ route, redirect }) => {
    const { auth, consumers, corporates } = initialiseStores(['auth', 'consumers', 'corporates'])
    if (auth?.isLoggedIn) {
        if (auth?.isConsumer) {
            try {
                if (route.name === 'managed-accounts-kyb') {
                    return redirect('/managed-accounts/kyc')
                }

                await consumers?.checkKYC()

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

                await corporates?.checkKYB()

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
