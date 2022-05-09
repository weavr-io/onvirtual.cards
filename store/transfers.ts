import { Action, Module, Mutation } from 'vuex-module-decorators'
import { loaderStore } from '~/utils/store-accessor'
import { StoreModule } from '~/store/storeModule'
import { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'

const defaultState = {
  isLoading: false
}

@Module({
  name: 'transfersModule',
  namespaced: true,
  stateFactory: true
})
export default class Transfers extends StoreModule {
  isLoading: boolean = defaultState.isLoading

  @Mutation
  RESET_STATE() {
    Object.keys(defaultState).forEach((key) => {
      this[key] = defaultState[key]
    })
  }

  @Mutation
  SET_IS_LOADING(isLoading: boolean) {
    this.isLoading = isLoading
  }

  @Action
  execute(request: CreateTransferRequest) {
    loaderStore(this.store).start()

    const req = this.store.$apiMulti.transfers.store(request)

    req.finally(() => {
      loaderStore(this.store).stop()
    })

    return req
  }
}
