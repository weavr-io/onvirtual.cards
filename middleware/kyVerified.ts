import { Middleware } from '@nuxt/types'
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'

const kyVerified: Middleware = async ({ store, route, redirect }) => {
  if (authStore(store).isLoggedIn) {
    if (authStore(store).isConsumer) {
      try {
        // await consumersStore(store).get()
        await consumersStore(store).getKYC()

        if (route.name === 'managed-accounts-kyc') {
          return redirect('/managed-accounts/add')
        }
      } catch (e) {
        if (consumersStore(store).kyc!.fullDueDiligence! === FullDueDiligence.PENDING_REVIEW) {
          return redirect('/managed-accounts')
        }

        if (route.name === 'managed-accounts-add' || route.name === 'managed-accounts') {
          return redirect('/managed-accounts/kyc')
        }
      }
    } else {
      try {
        const _corpId = authStore(store).auth?.identity.id

        await corporatesStore(store).getCorporateDetails(_corpId)
        await corporatesStore(store).checkKYB()

        if (route.name === 'managed-accounts-kyb') {
          return redirect('/managed-accounts/add')
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
