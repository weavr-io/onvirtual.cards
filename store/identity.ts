import { Module, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import { Action } from '~/node_modules/vuex-module-decorators'
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'

const defaultState = {
  identity: null,
  emailVerified: false,
  mobileNumberVerified: false
}

@Module({
  name: 'identitiesModule',
  namespaced: true,
  stateFactory: true
})
export default class Identity extends StoreModule {
  identity: ConsumerModel | CorporateModel | null = defaultState.identity

  emailVerified: boolean = defaultState.emailVerified

  mobileNumberVerified: boolean = defaultState.mobileNumberVerified

  @Mutation
  SET_IDENTITY(identity: ConsumerModel | CorporateModel | null) {
    this.identity = identity
    this.emailVerified = identity?.rootUser?.emailVerified ?? false
    this.mobileNumberVerified = identity?.rootUser?.mobileNumberVerified ?? false
  }

  @Mutation
  SET_EMAIL_VERIFIED(verified: boolean) {
    this.emailVerified = verified
  }

  @Mutation
  SET_MOBILE_VERIFIED(verified: boolean) {
    this.mobileNumberVerified = verified
  }

  @Mutation
  RESET_STATE() {
    Object.keys(defaultState).forEach((key) => {
      this[key] = defaultState[key]
    })
  }

  @Action({ rawError: true })
  getIdentity() {
    if (authStore(this.store).isConsumer) {
      return consumersStore(this.store).get()
    } else if (authStore(this.store).isCorporate) {
      return corporatesStore(this.store).get()
    }
  }
}
