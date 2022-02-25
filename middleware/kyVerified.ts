import { Middleware } from '@nuxt/types'
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'

const kyVerified: Middleware = async ({ store, route, redirect }) => {
  const authStoreInstance = authStore(store)
  if (authStoreInstance.isLoggedIn) {
    if (authStoreInstance.isConsumer) {
      try {
        if (route.name === 'managed-accounts-kyb') {
          return redirect('/managed-accounts/kyc')
        }

        await consumersStore(store).checkKYC()

        if (route.name === 'managed-accounts-kyc') {
          return redirect('/managed-accounts/add')
        }
      } catch (e) {
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

        await corporatesStore(store).checkKYB()

        if (route.name === 'managed-accounts-kyb') {
          return redirect('/managed-accounts')
        }
      } catch (e) {
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
