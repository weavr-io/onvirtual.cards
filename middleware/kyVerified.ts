import { Middleware } from '@nuxt/types'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
import { corporatesStore } from '~/utils/store-accessor'

const kyVerified: Middleware = async ({ store, route, redirect }) => {
  if (AuthStore.Helpers.isLoggedIn(store)) {
    if (AuthStore.Helpers.isConsumer(store)) {
      try {
        await ConsumersStore.Helpers.checkKYC(store)

        if (route.path === '/managed-accounts/kyc') {
          redirect('/managed-accounts/add')
        }
      } catch (e) {
        if (route.path === '/managed-accounts/add') {
          redirect('/managed-accounts/kyc')
        }
      }
    } else {
      try {
        await corporatesStore(store).checkKYB()
        if (route.path === '/managed-accounts/kyb') {
          redirect('/managed-accounts/add')
        }
      } catch (e) {
        if (route.path === '/managed-accounts/add') {
          redirect('/managed-accounts/kyb')
        }
      }
    }
  } else {
    redirect('/login')
  }
}

export default kyVerified
