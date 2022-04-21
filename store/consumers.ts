import { Action, Module, Mutation } from 'vuex-module-decorators'
import { identitiesStore, loaderStore } from '~/utils/store-accessor'
import { StoreModule } from '~/store/storeModule'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { GetConsumerKYCResponse } from '~/plugins/weavr-multi/api/models/identities/consumers/responses/GetConsumerKYCResponse'
import { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/UpdateConsumerRequest'
import { CreateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/CreateConsumerRequest'
import { VerifyEmailRequest } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmailRequest'
import { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/common/models/SendVerificationCodeRequest'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'

const defaultState = {
  isLoading: false,
  consumer: null,
  kyc: null
}

@Module({
  name: 'consumersModule',
  namespaced: true,
  stateFactory: true
})
export default class Consumers extends StoreModule {
  isLoading: boolean = defaultState.isLoading

  consumer: ConsumerModel | null = defaultState.consumer

  kyc: GetConsumerKYCResponse | null = defaultState.kyc

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

  @Mutation
  RESET_STATE() {
    Object.keys(defaultState).forEach((key) => {
      this[key] = defaultState[key]
    })
  }

  @Action({ rawError: true })
  create(request: CreateConsumerRequest) {
    loaderStore(this.store).start()

    const req = this.store.$apiMulti.consumers.store(request)

    req.then((_res) => {
      this.SET_CONSUMER(_res.data)
      identitiesStore(this.store).SET_IDENTITY(_res.data)
    })

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  update(request: UpdateConsumerRequest) {
    const req = this.store.$apiMulti.consumers.update(request)
    req.then((_res) => {
      this.SET_CONSUMER(_res.data)
      identitiesStore(this.store).SET_IDENTITY(_res.data)
    })

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  get() {
    loaderStore(this.store).start()
    this.SET_IS_LOADING(true)

    const req = this.store.$apiMulti.consumers.show()

    req
      .then((_res) => {
        this.SET_CONSUMER(_res.data)
        identitiesStore(this.store).SET_IDENTITY(_res.data)
      })
      .finally(() => {
        loaderStore(this.store).stop()
        this.SET_IS_LOADING(false)
      })

    return req
  }

  @Action({ rawError: true })
  getKYC() {
    const req = this.store.$apiMulti.consumers.showKYC()
    req.then((res) => {
      this.SET_KYC(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  async checkKYC() {
    if (!this.consumer) {
      await this.get()
    }
    if (!this.kyc) {
      await this.getKYC()
    }

    if (this.kyc?.fullDueDiligence !== KYCStatusEnum.APPROVED) {
      return Promise.reject(new Error('KYC not approved'))
    } else {
      return Promise.resolve()
    }
  }

  @Action({ rawError: true })
  verifyEmail(request: VerifyEmailRequest) {
    return this.store.$apiMulti.consumers.verifyEmail(request)
  }

  @Action({ rawError: true })
  sendVerificationCodeEmail(request: SendVerificationCodeRequest) {
    return this.store.$apiMulti.consumers.sendVerificationCode(request)
  }

  @Action({ rawError: true })
  startKYC() {
    const _res = this.store.$apiMulti.consumers.startKYC()
    return _res
  }
}
