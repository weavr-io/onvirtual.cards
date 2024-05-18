<template>
    <b-col lg="6" md="9">
        <div class="mb-5">
            <LogoOvc classes="mb-5" />
            <b-card class="overflow-hidden" no-body>
                <b-card-body class="px-4 mx-3 py-5 p-sm-card">
                    <div class="form-screens">
                        <transition mode="out-in" name="fade">
                            <div v-if="screen === 0" key="1" class="form-screen">
                                <register-form @submit-form="form1Submit" />
                            </div>
                            <div v-else key="2" class="form-screen">
                                <personal-details-form
                                    :base-form="registrationRequest"
                                    @submit="form2Submit"
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
import { AxiosResponse } from 'axios'
import { Component, mixins } from 'nuxt-property-decorator'
import { reactive } from 'vue'
import BaseMixin from '~/mixins/BaseMixin'
import { LoginWithPassword } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPassword'
import { CreatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/CreatePasswordRequestModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import {
    CreateCorporateRequest,
    INITIAL_CREATE_CORPORATE_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import { initialiseStores } from '~/utils/pinia-store-accessor'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common'

@Component({
    layout: 'auth',
    components: {
        LogoOvc,
        LoaderButton: () => import('~/components/atoms/LoaderButton.vue'),
        RegisterForm: () => import('~/components/organisms/registration/RegisterForm.vue'),
        PersonalDetailsForm: () =>
            import('~/components/organisms/registration/PersonalDetails.vue'),
        RegistrationNav: () => import('~/components/molecules/registration/RegistrationNav.vue'),
    },
    middleware: 'accessCodeVerified',
})
export default class RegistrationPage extends mixins(BaseMixin) {
    screen = 0
    passwordStrength = 0

    registrationRequest: CreateCorporateRequest & {
        password?: string
    } = reactive({
        ...INITIAL_CREATE_CORPORATE_REQUEST(),
        profileId: this.$config.profileId.corporates,
        acceptedTerms: false,
        baseCurrency: CurrencyEnum.EUR,
        password: undefined,
    })

    strengthCheck(val) {
        this.passwordStrength = val.id
    }

    goBack() {
        this.screen--
    }

    asyncData({ redirect }) {
        const { auth } = initialiseStores(['auth'])
        const isLoggedIn = auth?.isLoggedIn
        if (isLoggedIn) {
            redirect('/dashboard')
        }
    }

    fetch() {
        this.$apiMulti.ipify.get().then((ip) => {
            this.registrationRequest.ipAddress = ip.data.ip
        })
    }

    form1Submit(_data: { email: string; password: string; acceptedTerms: boolean }) {
        this.registrationRequest.rootUser.email = _data.email
        this.registrationRequest.password = _data.password
        this.registrationRequest.acceptedTerms = _data.acceptedTerms
        this.screen = 1
        this.stopRegistrationLoading()
    }

    form2Submit(_data) {
        this.registrationRequest = { ..._data }
        this.doRegister()
    }

    doRegister() {
        this.corporatesStore.setIsLoadingRegistration(true)
        this.corporatesStore
            .create(this.registrationRequest)
            .then(this.onCorporateCreated)
            .catch(this.registrationFailed)
    }

    stopRegistrationLoading() {
        this.corporatesStore.setIsLoadingRegistration(false)
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
        this.accessCodes.deleteAccessCode()
        if (!this.registrationRequest.rootUser) {
            return
        }
        const loginRequest: LoginWithPassword = {
            email: this.registrationRequest.rootUser.email as string,
            password: {
                value: this.registrationRequest.password as string,
            },
        }
        const _req = this.authStore.loginWithPassword(loginRequest)
        _req.then(() => {
            this.setSCAstorage()
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
            this.showErrorToast(_errCode)
        }
    }
}
</script>
