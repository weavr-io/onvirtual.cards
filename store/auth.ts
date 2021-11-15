import { Action, Module, Mutation } from 'vuex-module-decorators'
import { $axiosMulti } from '~/utils/api'
import { StoreModule } from '~/store/storeModule'
import { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/access/responses/LoginWithPasswordResponse'
import { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { IdentityTypeEnum } from '~/plugins/weavr-multi/api/models/common/enums/IdentityTypeEnum'
import { LoginWithPasswordRequest } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPasswordRequest'
import { UpdatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/UpdatePasswordRequestModel'
import { CreatePasswordResponseModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/responses/CreatePasswordResponseModel'
import { GetAuthenticationFactorsResponse } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/responses/GetAuthenticationFactorsResponse'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { AuthVerifyEnrolRequest } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/requests/AuthVerifyEnrolRequest'

const Cookie = process.client ? require('js-cookie') : undefined

@Module({
  name: 'authModule',
  namespaced: true,
  stateFactory: true
})
export default class Auth extends StoreModule {
  auth: LoginWithPasswordResponse | null = null
  authFactors: GetAuthenticationFactorsResponse | null = null
  isLoading: boolean = false

  get isLoggedIn(): boolean {
    return this.auth != null && this.auth.token != null
  }

  get token() {
    return this.auth?.token
  }

  get identityId() {
    return this.auth?.identity ? this.auth.identity.id : null
  }

  get isConsumer() {
    return this.auth?.identity ? this.auth?.identity.type === IdentityTypeEnum.CONSUMER : false
  }

  get isCorporate() {
    return this.auth?.identity ? this.auth!.identity.type === IdentityTypeEnum.CORPORATE : false
  }

  get identity() {
    return this.auth?.identity
  }

  @Mutation
  SET_AUTH(auth: LoginWithPasswordResponse | null) {
    this.auth = auth
    Cookie.set('auth-onv', this.auth)

    $axiosMulti.defaults.headers.Authorization = 'Bearer ' + this.auth?.token
  }

  @Mutation
  SET_TOKEN(res: CreatePasswordResponseModel) {
    this.auth!.token = res.token!

    Cookie.set('auth-onv', this.auth)

    $axiosMulti.defaults.headers.Authorization = 'Bearer ' + this.auth?.token
  }

  @Mutation
  SET_AUTH_FACTORS(res: GetAuthenticationFactorsResponse) {
    this.authFactors = res
  }

  @Mutation
  REMOVE_AUTH(auth: null) {
    this.auth = auth

    Cookie.set('auth-onv', this.auth)

    delete $axiosMulti.defaults.headers.Authorization
  }

  @Action({ rawError: true })
  loginWithPassword(request: LoginWithPasswordRequest) {
    const _req = this.store.$apiMulti.authentication.loginWithPassword(request)

    _req.then((res) => {
      this.SET_AUTH(res.data)
    })

    return _req
  }

  @Action({ rawError: true })
  logout() {
    const _req = this.store.$apiMulti.authentication.logout()

    _req.then(() => {
      this.REMOVE_AUTH(null)
    })

    return _req
  }

  @Action({ rawError: true })
  updatePassword(request: UpdatePasswordRequestModel) {
    const _req = this.store.$apiMulti.passwords.update(request)

    _req.then((res) => {
      this.SET_TOKEN(res.data)
    })

    return _req
  }

  @Action({ rawError: true })
  indexAuthFactors() {
    const _req = this.store.$apiMulti.additionalFactors.index()

    _req.then((res) => {
      this.SET_AUTH_FACTORS(res.data)
    })

    return _req
  }

  @Action({ rawError: true })
  enrollAuthFactors(channel: SCAOtpChannelEnum) {
    const _req = this.store.$apiMulti.additionalFactors.enroll(channel)

    return _req
  }

  @Action({ rawError: true })
  verifyAuthFactors(request: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrolRequest }) {
    const _req = this.store.$apiMulti.additionalFactors.verify(request)

    return _req
  }
}
