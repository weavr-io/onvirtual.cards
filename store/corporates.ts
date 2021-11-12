import { Action, Module, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'
import { $api } from '~/utils/api'
import { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import { GetCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/identities/corporates/responses/GetCorporateKYBResponse'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/UpdateConsumerRequest'
import { loaderStore } from '~/utils/store-accessor'
import { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'

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

  users: any = null

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

  @Mutation
  SET_USERS(_users) {
    this.users = _users
  }

  @Action({ rawError: true })
  create(request: CreateCorporateRequest) {
    this.SET_IS_LOADING(true)

    // const req = $api.post<Corporate>('/app/api/corporates/_/create', request)

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

    // const req = $api.post<Corporate>('/app/api/corporates/' + corporateId + '/get', {})
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
    // const req = $api.post<CorporateKybStatus>('/app/api/corporates/' + corporateId + '/kyb/get', {})
    const req = this.store.$apiMulti.corporates.getCorporateKYB()
    req.then((res) => {
      this.SET_KYB(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  getUsers(corporateId) {
    this.SET_IS_LOADING(true)

    const req = $api.post('/app/api/corporates/' + corporateId + '/users/get', {})

    req.then((res) => {
      this.SET_USERS(res.data)
    })
    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  getUser(params) {
    this.SET_IS_LOADING(true)

    const req = $api.post('/app/api/corporates/' + params.corporateId + '/users/' + params.userId + '/get', {})

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  updateUser(request) {
    this.SET_IS_LOADING(true)

    const req = $api.post(
      '/app/api/corporates/' + request.corporateId + '/users/' + request.userId + '/update',
      request.body
    )

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  addUser(request: any) {
    this.SET_IS_LOADING(true)

    const req = $api.post('/app/api/corporates/' + request.corporateId + '/users/_/create', request.request)

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  sendUserInvite(request: { corporateId: string; inviteId: string }) {
    this.SET_IS_LOADING(true)

    const req = $api.post('/app/api/corporates/' + request.corporateId + '/invites/' + request.inviteId + '/send', {})

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  sendVerificationCodeEmail(request) {
    return $api.post('/app/api/corporates/' + request.corporateId + '/users/email/send_verification_code', request.body)
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
  validateInvite(request: any) {
    return $api.post('/app/api/corporates/' + request.id + '/invites/' + request.inviteId + '/validate', request.body)
  }

  @Action({ rawError: true })
  consumeInvite(request: any) {
    return $api.post('/app/api/auth/invites/' + request.id + '/consume', request.body)
  }

  @Action({ rawError: true })
  startKYB(corporateId) {
    return $api.post('/app/api/corporates/' + corporateId + '/kyb/start', {})
  }

  @Action({ rawError: true })
  sendVerificationCodeMobile(request) {
    return $api.post(
      '/app/api/corporates/' + request.corporateId + '/users/mobile/send_verification_code',
      request.request
    )
  }

  @Action({ rawError: true })
  verifyMobile(request) {
    return $api.post('/app/api/corporates/' + request.corporateId + '/users/mobile/verify', request.request)
  }
}
