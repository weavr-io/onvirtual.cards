import { Action, Module, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'
import { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import { GetCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/identities/corporates/responses/GetCorporateKYBResponse'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import { identitiesStore } from '~/utils/store-accessor'
import { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'
import { VerifyEmailRequest } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmailRequest'
import { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/common/models/SendVerificationCodeRequest'
import { PUK_COUNTRY_CODES } from '~/utils/jurisdiction'

const defaultState = {
    isLoading: false,
    isLoadingRegistration: false,
    corporate: null,
    kyb: null,
}

@Module({
    name: 'corporatesModule',
    stateFactory: true,
    namespaced: true,
})
export default class Corporates extends StoreModule {
    isLoading: boolean = defaultState.isLoading

    isLoadingRegistration: boolean = defaultState.isLoadingRegistration

    corporate: CorporateModel | null = defaultState.corporate

    kyb: GetCorporateKYBResponse | null = defaultState.corporate

    get regCountry() {
        return this.corporate?.company.countryOfRegistration || ''
    }

    get isUk() {
        return PUK_COUNTRY_CODES.includes(this.regCountry)
    }

    @Mutation
    SET_IS_LOADING(_isLoading: boolean) {
        this.isLoading = _isLoading
    }

    @Mutation
    SET_IS_LOADING_REGISTRATION(_isLoadingRegistration: boolean) {
        this.isLoadingRegistration = _isLoadingRegistration
    }

    @Mutation
    RESET_STATE() {
        Object.keys(defaultState).forEach((key) => {
            this[key] = defaultState[key]
        })
    }

    @Mutation
    SET_CORPORATE(corporate: CorporateModel) {
        this.corporate = corporate
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
            identitiesStore(this.store).SET_IDENTITY(res.data)
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
        const req = this.store.$apiMulti.corporates.update(request)
        req.then((_res) => {
            this.SET_CORPORATE(_res.data)
            identitiesStore(this.store).SET_IDENTITY(_res.data)
        })

        req.finally(() => {
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
            identitiesStore(this.store).SET_IDENTITY(res.data)
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
        if (!this.corporate) {
            await this.get()
        }
        if (!this.kyb) {
            await this.getKyb()
        }

        if (this.kyb?.kybStatus !== KYBStatusEnum.APPROVED) {
            return Promise.reject(new Error('KYB not approved'))
        } else {
            return Promise.resolve()
        }
    }

    @Action({ rawError: true })
    startKYB() {
        return this.store.$apiMulti.corporates.startKYB()
    }
}
