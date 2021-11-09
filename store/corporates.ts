import { Module, Action, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'
import { Corporate } from '~/api/Models/Corporates/Corporate'
import { CreateCorporateRequest } from '~/api/Requests/Corporates/CreateCorporateRequest'
import { CreateCorporateUserFullRequest } from '~/api/Requests/Corporates/CreateCorporateUserFullRequest'
import { KYBState } from '~/api/Enums/KYBState'
import { ConsumeCorporateUserInviteRequest } from '~/api/Requests/Corporates/ConsumeCorporateUserInviteRequest'
import { $api } from '~/utils/api'
import { ValidateCorporateUserInviteRequest } from '~/api/Requests/Corporates/ValidateCorporateUserInviteRequest'
import { CorporateKybStatus } from '~/api/Models/Corporates/CorporateKybStatus'
import { authStore } from '~/utils/store-accessor'

@Module({
  name: 'corporatesModule',
  stateFactory: true,
  namespaced: true
})
export default class Corporates extends StoreModule {
  isLoading: boolean = false

  isLoadingRegistration: boolean = false

  corporate: Corporate | null = null

  kyb: CorporateKybStatus | null = null

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
  SET_CORPORATE(_corporate: Corporate) {
    this.corporate = _corporate
  }

  @Mutation
  SET_KYB(kyb: CorporateKybStatus) {
    this.kyb = kyb
  }

  @Mutation
  SET_USERS(_users) {
    this.users = _users
  }

  @Action({ rawError: true })
  register(request: CreateCorporateRequest) {
    this.SET_IS_LOADING(true)

    const req = $api.post<Corporate>('/app/api/corporates/_/create', request)

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
  getCorporateDetails(corporateId) {
    this.SET_IS_LOADING(true)

    const req = $api.post<Corporate>('/app/api/corporates/' + corporateId + '/get', {})

    req.then((res) => {
      this.SET_CORPORATE(res.data)
    })
    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  getKyb(corporateId: number) {
    const req = $api.post<CorporateKybStatus>('/app/api/corporates/' + corporateId + '/kyb/get', {})

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
  addUser(request: CreateCorporateUserFullRequest) {
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
    if (this.corporate === null) {
      const _corpId = authStore(this.store).identity?.id
      await this.getKyb(_corpId)
    }

    if (this.kyb === undefined || this.kyb === null) {
      await this.getKyb(this.corporate!.id.id)
    }

    const _res = this.kyb!.fullCompanyChecksVerified === KYBState.APPROVED

    if (!_res) {
      return Promise.reject(new Error('KYB not approved'))
    } else {
      return Promise.resolve()
    }
  }

  @Action({ rawError: true })
  validateInvite(request: ValidateCorporateUserInviteRequest) {
    return $api.post('/app/api/corporates/' + request.id + '/invites/' + request.inviteId + '/validate', request.body)
  }

  @Action({ rawError: true })
  consumeInvite(request: ConsumeCorporateUserInviteRequest) {
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
