import { useStores } from '~/composables/useStores'

const checkInstrument = (name: string) => {
    return (
        name === 'managed-accounts-add' ||
        name === 'managed-cards-add' ||
        name === 'managed-accounts'
    )
}

export default defineNuxtRouteMiddleware(async (to) => {
    const { auth, consumers, corporates } = useStores(['auth', 'consumers', 'corporates'])

    if (auth?.isLoggedIn) {
        if (auth?.isConsumer) {
            try {
                if (to.name === 'managed-accounts-kyb') {
                    return navigateTo('/managed-accounts/kyc')
                }

                await consumers?.checkKYC()

                if (to.name === 'managed-accounts-kyc') {
                    return navigateTo('/managed-accounts/add')
                }
            } catch (_) {
                if (checkInstrument(String(to.name))) {
                    return navigateTo('/managed-accounts/kyc')
                }
            }
        } else {
            try {
                if (String(to.name)?.includes('managed-accounts-kyc')) {
                    return navigateTo('/managed-accounts/kyb')
                }

                await corporates?.checkKYB()

                if (to.name === 'managed-accounts-kyb') {
                    return navigateTo('/managed-accounts')
                }
            } catch (_) {
                console.log('error type shit')
                if (checkInstrument(String(to.name))) {
                    return navigateTo('/managed-accounts/kyb')
                }
            }
        }
    } else {
        return navigateTo('/login')
    }
})
