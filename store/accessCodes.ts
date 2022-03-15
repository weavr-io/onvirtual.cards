import { Action, Module } from '~/node_modules/vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'

@Module({
  name: 'accessCodesModule',
  stateFactory: true,
  namespaced: true
})
export default class AccessCodes extends StoreModule {
  @Action({ rawError: true })
  verifyAccessCode(code: number) {
    return this.store.$apiMulti.accessCodes.verifyAccessCode(code)
  }
}
