// import { Action, Module, Mutation } from 'vuex-module-decorators'
// import { Consumer } from '~/api/Models/Consumers/Consumer'
// import { $api } from '~/utils/api'
// import { loaderStore } from '~/utils/store-accessor'
// import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
// import { StoreModule } from '~/store/storeModule'
//
// @Module({
//   name: 'ConsumersModule',
//   namespaced: true,
//   stateFactory: true
// })
// export default class ConsumersModule extends StoreModule {
//   isLoading: boolean = false
//   consumer: any = null
//
//   @Mutation
//   SET_IS_LOADING(isLoading: boolean) {
//     this.isLoading = isLoading
//   }
//
//   @Mutation
//   SET_CONSUMER(consumer: Consumer) {
//     this.consumer = consumer
//   }
//
//   @Action
//   create(request: any) {
//     loaderStore(this.store).start()
//
//     const req = $api.post('/app/api/consumers/_/create', request)
//
//     req.then((_res) => {
//       this.SET_CONSUMER(_res.data)
//     })
//
//     req.finally(() => {
//       loaderStore(this.store).stop()
//       this.SET_IS_LOADING(false)
//     })
//
//     return req
//   }
//
//   @Action
//   update(request: any) {
//     loaderStore(this.store).start()
//
//     const req = $api.post('/app/api/consumers/' + request.consumerId + '/update', request.request)
//
//     req.then((_res) => {
//       this.SET_CONSUMER(_res.data)
//     })
//
//     req.finally(() => {
//       loaderStore(this.store).stop()
//       this.SET_IS_LOADING(false)
//     })
//
//     return req
//   }
//
//   @Action
//   get(id) {
//     loaderStore(this.store).start()
//     this.SET_IS_LOADING(true)
//
//     const req = $api.post('/app/api/consumers/' + id + '/get', {})
//
//     req.then((_res) => {
//       this.SET_CONSUMER(_res.data)
//     })
//     req.finally(() => {
//       loaderStore(this.store).stop()
//       this.SET_IS_LOADING(false)
//     })
//
//     return req
//   }
//
//   @Action
//   sendVerificationCodeEmail(request) {
//     return $api.post('/app/api/consumers/' + request.consumerId + '/email/send_verification_code', request.request)
//   }
//
//   @Action
//   sendVerificationCodeMobile(request) {
//     return $api.post('/app/api/consumers/' + request.consumerId + '/mobile/send_verification_code', request.request)
//   }
//
//   @Action
//   verifyMobile(request) {
//     return $api.post('/app/api/consumers/' + request.consumerId + '/mobile/verify', request.request)
//   }
//
//   @Action
//   async checkKYC() {
//     if (this.consumer === null) {
//       // const _id = authStore(this.store).identity.id
//       // await this.get(_id)
//     }
//
//     const _res = this.consumer.kyc.fullDueDiligence === FullDueDiligence.APPROVED
//
//     if (!_res) {
//       return Promise.reject(new Error('KYC not approved'))
//     }
//   }
//
//   @Action
//   startKYC(consumerId) {
//     return $api.post('/app/api/consumers/' + consumerId + '/kyc/start', {})
//   }
// }
