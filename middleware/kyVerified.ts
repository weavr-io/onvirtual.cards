import { Middleware } from '@nuxt/types'
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'

const kyVerified: Middleware = async ({ store, route, redirect }) => {
  if (authStore(store).isLoggedIn) {
    if (authStore(store).isConsumer) {
      try {
        const _consumerId = authStore(store).auth.identity.id
        await consumersStore(store).get(_consumerId)

        await consumersStore(store).checkKYC

        if (route.path === '/managed-accounts/kyc') {
          redirect('/managed-accounts/add')
        }
      } catch (e) {
        if (consumersStore(store).consumer.kyc!.fullDueDiligence! === FullDueDiligence.PENDING_REVIEW) {
          redirect('/managed-accounts')
        } else if (route.path === '/managed-accounts/add') {
          redirect('/managed-accounts/kyc')
        }
      }
    } else {
      try {
        const _corpId = authStore(store).auth.identity.id

        await corporatesStore(store).getCorporateDetails(_corpId)
        await corporatesStore(store).checkKYB()

        if (route.path === '/managed-accounts/kyb') {
          redirect('/managed-accounts/add')
        }
      } catch (e) {
        if (route.path === '/managed-accounts/add' || route.path === '/managed-cards/add') {
          redirect('/managed-accounts/kyb')
        }
      }
    }
  } else {
    redirect('/login')
  }
}
export default kyVerified
