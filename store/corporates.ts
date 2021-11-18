import { Action, Module, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'
import { $api } from '~/utils/api'
import { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import { GetCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/identities/corporates/responses/GetCorporateKYBResponse'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import { loaderStore } from '~/utils/store-accessor'
import { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'
import { VerifyEmailRequest } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmailRequest'
import { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/common/models/SendVerificationCodeRequest'

@Module({
  name: 'corporatesModule',
  stateFactory: true,
  namespaced: true
})
export default class Corporates extends StoreModule {
  isLoading: boolean = false

  isLoadingRegistration: boolean = false

  corporate: CorporateModel | null = null

  kyb: GetCorporateKYBResponse | null = null

  @Mutation
  SET_IS_LOADING(_isLoading: boolean) {
    this.isLoading = _isLoading
  }

  @Mutation
  SET_IS_LOADING_REGISTRATION(_isLoadingRegistration: boolean) {
    this.isLoadingRegistration = _isLoadingRegistration
  }

  @Mutation
  SET_CORPORATE(_corporate: CorporateModel) {
    this.corporate = _corporate
  }

  @Mutation
  SET_KYB(kyb: GetCorporateKYBResponse) {
    this.kyb = kyb
  }

  @Action({ rawError: true })
  create(request: CreateCorporateRequest) {
    this.SET_IS_LOADING(true)

    const req = this.store.$apiMulti.corporates.store(request)

    req.then((res) => {
      this.SET_CORPORATE(res.data)
      this.SET_IS_LOADING(false)
    })
    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  update(request: UpdateCorporateRequest) {
    loaderStore(this.store).start()

    const req = this.store.$apiMulti.corporates.update(request)
    req.then((_res) => {
      this.SET_CORPORATE(_res.data)
    })

    req.finally(() => {
      loaderStore(this.store).stop()
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  get() {
    this.SET_IS_LOADING(true)

    const req = this.store.$apiMulti.corporates.show()

    req.then((res) => {
      this.SET_CORPORATE(res.data)
    })
    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  getKyb() {
    const req = this.store.$apiMulti.corporates.getCorporateKYB()
    req.then((res) => {
      this.SET_KYB(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  verifyEmail(request: VerifyEmailRequest) {
    return this.store.$apiMulti.corporates.verifyEmail(request)
  }

  @Action({ rawError: true })
  sendVerificationCodeEmail(request: SendVerificationCodeRequest) {
    return this.store.$apiMulti.corporates.sendVerificationCode(request)
  }

  @Action({ rawError: true })
  async checkKYB() {
    if (this.kyb === undefined || this.kyb === null) {
      await this.getKyb
    }

    const _res = this.kyb?.kybStatus === KYBStatusEnum.APPROVED

    if (!_res) {
      return Promise.reject(new Error('KYB not approved'))
    } else {
      return Promise.resolve()
    }
  }

  @Action({ rawError: true })
  consumeInvite(request: any) {
    return $api.post('/app/api/auth/invites/' + request.id + '/consume', request.body)
  }

  @Action({ rawError: true })
  startKYB() {
    const _res = this.store.$apiMulti.corporates.startKYB()
    return _res
  }
}
