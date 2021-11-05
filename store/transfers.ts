// import { Action, Module, Mutation } from 'vuex-module-decorators'
// import { BaseVuexModule } from '~/store/baseVuexModule'
// import { TransfersSchemas } from '~/api/TransfersSchemas'
// import { loaderStore } from '~/utils/store-accessor'
// import { $api } from '~/utils/api'
//
// @Module({
//   name: 'TransfersModule',
//   namespaced: true,
//   stateFactory: true,
// })
// export default class TransfersModule extends BaseVuexModule {
//   isLoading: boolean = false
//
//   @Mutation
//   SET_IS_LOADING(isLoading: boolean) {
//     this.isLoading = isLoading
//   }
//
//   @Action
//   execute(request: TransfersSchemas.CreateTransferRequest) {
//     loaderStore(this.store).start()
//
//     const req = $api.post('/app/api/transfers/_/execute', request)
//
//     req.finally(() => {
//       loaderStore(this.store).stop()
//     })
//
//     return req
//   }
// }
