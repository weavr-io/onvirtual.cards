import { Action, Module, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'

@Module({
  name: 'loaderModule',
  namespaced: true,
  stateFactory: true
})
export default class Loader extends StoreModule {
  isLoading: boolean = false

  @Mutation
  SET_IS_LOADING(val: boolean) {
    this.isLoading = val
  }

  @Action
  start() {
    this.SET_IS_LOADING(true)
  }

  @Action
  stop() {
    this.SET_IS_LOADING(false)
  }
}
