import { Action, Module, Mutation } from 'vuex-module-decorators'
import { TransfersSchemas } from '~/api/TransfersSchemas'
import { loaderStore } from '~/utils/store-accessor'
import { $api } from '~/utils/api'
import { StoreModule } from '~/store/storeModule'

@Module({
  name: 'transfersModule',
  namespaced: true,
  stateFactory: true
})
export default class Transfers extends StoreModule {
  isLoading: boolean = false

  @Mutation
  SET_IS_LOADING(isLoading: boolean) {
    this.isLoading = isLoading
  }

  @Action
  execute(request: TransfersSchemas.CreateTransferRequest) {
    loaderStore(this.store).start()

    const req = $api.post('/app/api/transfers/_/execute', request)

    req.finally(() => {
      loaderStore(this.store).stop()
    })

    return req
  }
}
