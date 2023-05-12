<template>
    <b-col lg="6" md="9">
        <div class="mb-5">
            <logo base-class="mb-5" />
            <b-card class="overflow-hidden" no-body>
                <b-card-body class="px-4 mx-3 py-5 p-sm-card">
                    <div class="form-screens">
                        <transition mode="out-in" name="fade">
                            <div v-if="screen === 0" key="1" class="form-screen">
                                <register-form @submit-form="form1Submit" />
                            </div>
                            <div v-else key="2" class="form-screen">
                                <personal-details-form
                                    @submit-form="form2Submit"
                                    @strength-check="strengthCheck"
                                    @go-back="goBack"
                                />
                            </div>
                        </transition>
                    </div>
                </b-card-body>
            </b-card>
        </div>
    </b-col>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { AxiosResponse } from 'axios'
import Vue from 'vue'
import { authStore } from '~/utils/store-accessor'
import { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { CreatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/CreatePasswordRequestModel'
import { LoginWithPasswordRequest } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPasswordRequest'
import { DeepNullable, RecursivePartial } from '~/global'
import Logo from '~/components/Logo.vue'
import { useBase } from '~/composables/useBase'

@Component({
    layout: 'auth',
    components: {
        Logo,
        LoaderButton: () => import('~/components/LoaderButton.vue'),
        RegisterForm: () => import('~/components/registration/RegisterForm.vue'),
        PersonalDetailsForm: () => import('~/components/registration/PersonalDetails.vue'),
        RegistrationNav: () => import('~/components/registration/RegistrationNav.vue'),
        ComingSoonCurrencies: () => import('~/components/comingSoonCurrencies.vue'),
    },
    middleware: 'accessCodeVerified',
})
export default class RegistrationPage extends Vue {
    base = useBase(this)

    screen: number = 0
    passwordStrength: number = 0
    private registrationRequest: DeepNullable<
        RecursivePartial<CreateCorporateRequest & { password: string }>
    > = {
        profileId: this.$config.profileId.corporates,
        tag: 'tag',
        rootUser: {
            name: null,
            surname: null,
            email: null,
            mobile: {
                number: null,
                countryCode: '+356',
            },
            companyPosition: null,
        },
        company: {
            type: null,
            name: '',
            registrationNumber: '',
            registrationCountry: '',
        },
        industry: IndustryTypeEnum.ACCOUNTING,
        sourceOfFunds: CorporateSourceOfFundTypeEnum.CIVIL_CONTRACT,
        acceptedTerms: false,
        ipAddress: '',
        baseCurrency: CurrencyEnum.EUR,
    }

    strengthCheck(val) {
        this.passwordStrength = val.id
    }

    goBack() {
        this.screen--
    }

    asyncData({ store, redirect }) {
        const isLoggedIn = authStore(store).isLoggedIn
        if (isLoggedIn) {
            redirect('/dashboard')
        }
    }

    fetch() {
        this.$apiMulti.ipify.get().then((ip) => {
            this.registrationRequest.ipAddress = ip.data.ip
        })
    }

    form1Submit(
        _data: { email: string | null; password: string | null; acceptedTerms: boolean } | null
    ) {
        if (_data !== null) {
            this.registrationRequest.rootUser!.email = _data.email
            this.registrationRequest.password = _data.password
            this.registrationRequest.acceptedTerms = _data.acceptedTerms
            this.screen = 1
            this.stopRegistrationLoading()
        }
    }

    form2Submit(_data) {
        if (_data != null) {
            this.registrationRequest.rootUser!.name = _data.rootUser.name
            this.registrationRequest.rootUser!.surname = _data.rootUser.surname
            this.registrationRequest.rootUser!.companyPosition = _data.rootUser.companyPosition
            this.registrationRequest.rootUser!.mobile! = { ..._data.rootUser.mobile }
            this.registrationRequest.company!.name = _data.company.name
            this.registrationRequest.company!.type = _data.company.type
            this.registrationRequest.company!.registrationNumber = _data.company.registrationNumber
            this.registrationRequest.company!.registrationCountry =
                _data.company.registrationCountry
            this.registrationRequest.industry = _data.industry
            this.registrationRequest.sourceOfFunds = _data.sourceOfFunds
            this.registrationRequest.sourceOfFundsOther = _data.sourceOfFundsOther
            this.doRegister()
        }
    }

    doRegister() {
        this.base.stores.corporates.SET_IS_LOADING_REGISTRATION(true)
        this.base.stores.corporates
            .create(this.registrationRequest as CreateCorporateRequest)
            .then(this.onCorporateCreated)
            .catch(this.registrationFailed)
    }

    stopRegistrationLoading() {
        this.base.stores.corporates.SET_IS_LOADING_REGISTRATION(false)
    }

    onCorporateCreated(res: AxiosResponse<ConsumerModel>) {
        this.createPassword(res.data.rootUser.id.id!)
    }

    createPassword(rootUserId: IDModel) {
        const passwordRequest: CreatePasswordRequestModel = {
            password: {
                value: this.registrationRequest.password as string,
            },
        }
        this.$apiMulti.passwords
            .store({
                userId: rootUserId,
                data: passwordRequest,
            })
            .then(this.onRegisteredSuccessfully.bind(this))
            .catch(this.stopRegistrationLoading)
    }

    onRegisteredSuccessfully() {
        this.base.stores.accessCodes.DELETE_ACCESS_CODE()
        if (!this.registrationRequest.rootUser) {
            return
        }
        const loginRequest: LoginWithPasswordRequest = {
            email: this.registrationRequest.rootUser.email as string,
            password: {
                value: this.registrationRequest.password as string,
            },
        }
        const _req = this.base.stores.auth.loginWithPassword(loginRequest)
        _req.then(() => {
            this.base.setSCAstorage()
            this.stopRegistrationLoading()
            this.$router.push({ path: '/profile/address' })
        })
    }

    registrationFailed(err) {
        this.stopRegistrationLoading()
        const _errCode = err.response.data.errorCode
        if (_errCode === 'ROOT_USERNAME_NOT_UNIQUE' || _errCode === 'ROOT_EMAIL_NOT_UNIQUE') {
            this.screen = 0
        } else {
            this.base.showErrorToast(_errCode)
        }
    }
}
</script>
