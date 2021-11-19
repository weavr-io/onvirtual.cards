import { Middleware } from '@nuxt/types'
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'

const kyVerified: Middleware = async ({ store, route, redirect }) => {
  if (authStore(store).isLoggedIn) {
    if (authStore(store).isConsumer) {
      try {
        if (route.name === 'managed-accounts-kyb') {
          return redirect('/managed-accounts/kyc')
        }

        await consumersStore(store).get()
        await consumersStore(store)
          .getKYC()
          .finally(async () => {
            await consumersStore(store).checkKYC()
          })

        if (route.name === 'managed-accounts-kyc') {
          return redirect('/managed-accounts/add')
        }
      } catch (e) {
        if (consumersStore(store).kyc!.fullDueDiligence! === KYCStatusEnum.PENDING_REVIEW) {
          return redirect('/managed-accounts')
        }

        if (route.name === 'managed-accounts-add' || route.name === 'managed-accounts') {
          return redirect('/managed-accounts')
        }
      }
    } else {
      try {
        if (route.name?.includes('managed-accounts-kyc')) {
          return redirect('/managed-accounts/kyb')
        }

        await corporatesStore(store).get()
        await corporatesStore(store)
          .getKyb()
          .finally(async () => {
            await corporatesStore(store).checkKYB()
          })

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
