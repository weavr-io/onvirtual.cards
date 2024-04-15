import { Action, Module, Mutation } from 'vuex-module-decorators'
import config from '~/config'
import { LoginWithPasswordRequest } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPasswordRequest'
import { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/access/responses/LoginWithPasswordResponse'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { AuthVerifyEnrolRequest } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/requests/AuthVerifyEnrolRequest'
import { GetAuthenticationFactorsResponse } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/responses/GetAuthenticationFactorsResponse'
import { InitiateLostPasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/InitiateLostPasswordRequestModel'
import { ResumeLostPasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ResumeLostPasswordRequestModel'
import { UpdatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/UpdatePasswordRequestModel'
import { ValidatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ValidatePasswordRequestModel'
import { CreatePasswordResponseModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/responses/CreatePasswordResponseModel'
import { IdentityTypeEnum } from '~/plugins/weavr-multi/api/models/common/enums/IdentityTypeEnum'
import { StoreModule } from '~/store/storeModule'
import { $axiosMulti } from '~/utils/api'
import { initialiseStores as initialisePiniaStores } from '~/utils/pinia-store-accessor'
import {
    cardsStore,
    consumersStore,
    corporatesStore,
    identitiesStore,
    transfersStore,
} from '~/utils/store-accessor'

const Cookie = process.client ? require('js-cookie') : undefined

const defaultState = {
    auth: null,
    authFactors: null,
    isLoading: false,
}

@Module({
    name: 'authModule',
    namespaced: true,
    stateFactory: true,
})
export default class Auth extends StoreModule {
    auth: LoginWithPasswordResponse | null = defaultState.auth
    authFactors: GetAuthenticationFactorsResponse | null = defaultState.authFactors
    isLoading: boolean = defaultState.isLoading

    get isLoggedIn(): boolean {
        return this.auth !== null && this.auth.token !== null
    }

    get token() {
        return this.auth?.token
    }

    get hasAuthToken(): boolean {
        return !!this.auth && !!this.auth.token
    }

    get identityId() {
        return this.auth?.identity ? this.auth.identity.id : null
    }

    get isConsumer() {
        return this.auth?.identity.type === IdentityTypeEnum.CONSUMER
    }

    get isCorporate() {
        return this.auth?.identity.type === IdentityTypeEnum.CORPORATE
    }

    get identity() {
        return this.auth?.identity
    }

    @Mutation
    SET_AUTH(auth: LoginWithPasswordResponse | null) {
        this.auth = auth
        Cookie.set(config.ONV_COOKIE_NAME, JSON.stringify(this.auth))

        $axiosMulti.defaults.headers.Authorization = 'Bearer ' + this.auth?.token
    }

    @Mutation
    SET_TOKEN(res: CreatePasswordResponseModel) {
        this.auth!.token = res.token!

        Cookie.set(config.ONV_COOKIE_NAME, this.auth)

        $axiosMulti.defaults.headers.Authorization = 'Bearer ' + this.auth?.token
    }

    @Mutation
    SET_AUTH_FACTORS(res: GetAuthenticationFactorsResponse) {
        this.authFactors = res
    }

    @Mutation
    REMOVE_AUTH(auth: null) {
        this.auth = auth

        Cookie.remove(config.ONV_COOKIE_NAME)

        delete $axiosMulti.defaults.headers.Authorization
    }

    @Mutation
    RESET_STATE() {
        Object.keys(defaultState).forEach((key) => {
            this[key] = defaultState[key]
        })
    }

    @Action({ rawError: true })
    loginWithPassword(request: LoginWithPasswordRequest) {
        const _req = this.store.$apiMulti.authentication.loginWithPassword(request)

        _req.then((res) => {
            this.store.$weavrSetUserToken('Bearer ' + res.data.token)
            this.SET_AUTH(res.data)
        })

        return _req
    }

    @Action({ rawError: true })
    resetTokenAndStates() {
        this.store.$weavrSetUserToken(null)
        this.REMOVE_AUTH(null)
        this.RESET_STATE()
        corporatesStore(this.store).RESET_STATE()
        consumersStore(this.store).RESET_STATE()
        initialisePiniaStores(['accounts'], true)
        cardsStore(this.store).RESET_STATE()
        identitiesStore(this.store).RESET_STATE()
        transfersStore(this.store).RESET_STATE()
        initialisePiniaStores(['users'], true)
    }

    @Action({ rawError: true })
    logout() {
        const _req = this.store.$apiMulti.authentication.logout()

        _req.finally(() => {
            this.resetTokenAndStates()
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
    enrollStepUp(channel: SCAOtpChannelEnum) {
        const _req = this.store.$apiMulti.stepUp.enroll(channel)

        return _req
    }

    @Action({ rawError: true })
    verifyAuthFactors(request: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrolRequest }) {
        const _req = this.store.$apiMulti.additionalFactors.verify(request)

        return _req
    }

    @Action({ rawError: true })
    verifyStepUp(request: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrolRequest }) {
        const _req = this.store.$apiMulti.stepUp.verify(request)

        return _req
    }

    @Action({ rawError: true })
    lostPasswordInitiate(request: InitiateLostPasswordRequestModel) {
        const _req = this.store.$apiMulti.passwords.initiate(request)

        return _req
    }

    @Action({ rawError: true })
    lostPasswordResume(request: ResumeLostPasswordRequestModel) {
        const _req = this.store.$apiMulti.passwords.resume(request)

        return _req
    }

    @Action({ rawError: true })
    validatePassword(request: ValidatePasswordRequestModel) {
        const _req = this.store.$apiMulti.passwords.validate(request)

        return _req
    }
}
