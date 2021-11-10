import { Action, Module, Mutation } from 'vuex-module-decorators'
import { $api } from '~/utils/api'
import { authStore, loaderStore } from '~/utils/store-accessor'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
import { StoreModule } from '~/store/storeModule'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/consumers/models/ConsumerModel'
import { GetConsumerKYCResponse } from '~/plugins/weavr-multi/api/models/consumers/responses/GetConsumerKYCResponse'

@Module({
  name: 'consumersModule',
  namespaced: true,
  stateFactory: true,
})
export default class Consumers extends StoreModule {
  isLoading: boolean = false

  consumer: ConsumerModel | null = null
  kyc: GetConsumerKYCResponse | null = null

  @Mutation
  SET_IS_LOADING(isLoading: boolean) {
    this.isLoading = isLoading
  }

  @Mutation
  SET_CONSUMER(consumer: ConsumerModel) {
    this.consumer = consumer
  }

  @Mutation
  SET_KYC(_kyc: GetConsumerKYCResponse) {
    this.kyc = _kyc
  }

  @Action({ rawError: true })
  create(request: any) {
    loaderStore(this.store).start()

    const req = $api.post('/app/api/consumers/_/create', request)

    req.then((_res) => {
      this.SET_CONSUMER(_res.data)
    })

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  update(request: any) {
    loaderStore(this.store).start()

    const req = $api.post('/app/api/consumers/' + request.consumerId + '/update', request.request)

    req.then((_res) => {
      this.SET_CONSUMER(_res.data)
    })

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  get() {
    loaderStore(this.store).start()
    this.SET_IS_LOADING(true)

    // const req = $api.post('/app/api/consumers/' + id + '/get', {})
    const req = this.store.$apiMulti.consumers.show()

    req.then((_res) => {
      this.SET_CONSUMER(_res.data)
    })
    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  sendVerificationCodeEmail(request) {
    return $api.post('/app/api/consumers/' + request.consumerId + '/email/send_verification_code', request.request)
  }

  @Action({ rawError: true })
  sendVerificationCodeMobile(request) {
    return $api.post('/app/api/consumers/' + request.consumerId + '/mobile/send_verification_code', request.request)
  }

  @Action({ rawError: true })
  verifyMobile(request) {
    return $api.post('/app/api/consumers/' + request.consumerId + '/mobile/verify', request.request)
  }

  @Action({ rawError: true })
  getKYC() {
    // if (this.consumer === null) {
    //   const _id = authStore(this.store).identity?.id
    //   await this.get()
    // }

    // const _res = this.consumer.kyc.fullDueDiligence === FullDueDiligence.APPROVED
    //
    // if (!_res) {
    //   return Promise.reject(new Error('KYC not approved'))
    // } else {
    //   return Promise.resolve()
    // }

    const req = this.store.$apiMulti.consumers.showKYC()
    req.then((res) => {
      this.SET_KYC(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  startKYC(consumerId) {
    return $api.post('/app/api/consumers/' + consumerId + '/kyc/start', {})
  }
}
