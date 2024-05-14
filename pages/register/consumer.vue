<template>
    <b-col lg="6" md="9">
        <div class="mb-5">
            <LogoOvc classes="mb-5" />
            <ComingSoonCurrencies />
            <b-card class="overflow-hidden" no-body>
                <b-card-body class="px-4 mx-3 py-5 p-sm-card">
                    <div class="form-screens">
                        <error-alert />
                        <div class="form-screen">
                            <b-form novalidate @submit.prevent="submitForm">
                                <h3 class="text-center font-weight-light mb-5">Register</h3>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('rootUser,name')
                                    "
                                    :state="validation.getState('rootUser,name')"
                                    label="First Name*"
                                >
                                    <b-form-input
                                        v-model="registrationRequest.rootUser.name"
                                        placeholder="First Name"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('rootUser,surname')
                                    "
                                    :state="validation.getState('rootUser,surname')"
                                    label="Last Name*"
                                >
                                    <b-form-input
                                        v-model="registrationRequest.rootUser.surname"
                                        placeholder="Last Name"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="dobInvalidFeedback"
                                    :state="
                                        dobInvalidFeedback === undefined
                                            ? null
                                            : !!dobInvalidFeedback
                                    "
                                    label="Date of Birth*"
                                >
                                    <dob-picker
                                        :placeholders="['Day', 'Month', 'Year']"
                                        :state="dobState"
                                        class="d-flex"
                                        label-class="small flex-fill"
                                        month-format="long"
                                        select-class="form-control"
                                        show-labels="false"
                                        @blur="updateDOB"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('rootUser,email')
                                    "
                                    :state="validation.getState('rootUser,email')"
                                    label="Email*"
                                >
                                    <b-form-input
                                        v-model="registrationRequest.rootUser.email"
                                        placeholder="name@email.com"
                                    />
                                </b-form-group>
                                <b-form-group label="MOBILE NUMBER*">
                                    <vue-phone-number-input
                                        v-model="rootMobileNumber"
                                        :border-radius="0"
                                        :error="numberIsValid === false"
                                        :only-countries="mobileCountries"
                                        color="#6C1C5C"
                                        default-country-code="GB"
                                        error-color="#F50E4C"
                                        valid-color="#6D7490"
                                        @update="phoneUpdate"
                                    />
                                    <b-form-invalid-feedback
                                        v-if="numberIsValid === false"
                                        force-show
                                    >
                                        This field must be a valid mobile number.
                                    </b-form-invalid-feedback>
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('rootUser,address,country')
                                    "
                                    :state="validation.getState('rootUser,address,country')"
                                    label="Country*"
                                >
                                    <b-form-select
                                        v-model="registrationRequest.rootUser.address.country"
                                        :options="countryOptionsWithDefault"
                                        placeholder="Registration Country"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('rootUser,occupation')
                                    "
                                    :state="validation.getState('rootUser,occupation')"
                                    label="Industry*"
                                >
                                    <b-form-select
                                        v-model="registrationRequest.rootUser.occupation"
                                        :options="industryOccupationOptions"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('sourceOfFunds')
                                    "
                                    :state="validation.getState('sourceOfFunds')"
                                    label="Source of Funds*"
                                >
                                    <b-form-select
                                        v-model="registrationRequest.sourceOfFunds"
                                        :options="sourceOfFundsOptions"
                                    />
                                </b-form-group>
                                <b-form-group
                                    v-if="shouldShowOtherSourceOfFunds"
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('sourceOfFundsOther')
                                    "
                                    :state="validation.getState('sourceOfFundsOther')"
                                    label="Other"
                                >
                                    <b-form-input
                                        v-model="registrationRequest.sourceOfFundsOther"
                                        placeholder="Specify Other Source of Funds"
                                    />
                                </b-form-group>
                                <client-only placeholder="Loading...">
                                    <b-form-group
                                        :state="validation.getState('password,value')"
                                        label="Password"
                                        label-for="password"
                                    >
                                        <weavr-password-input
                                            ref="passwordField"
                                            :base-style="passwordBaseStyle"
                                            :class-name="[
                                                'sign-in-password',
                                                { 'is-invalid': isPasswordInvalidAndDirty },
                                            ]"
                                            :options="{ placeholder: '****' }"
                                            name="password"
                                            required="true"
                                            @onChange="passwordInteraction"
                                            @onStrength="strengthCheck"
                                        />
                                        <small
                                            :class="
                                                isPasswordInvalidAndDirty
                                                    ? 'text-danger'
                                                    : 'text-muted'
                                            "
                                            class="form-text mb-3"
                                            >- min 8 characters <br />- uppercase letter <br />-
                                            digit and a special character</small
                                        >
                                    </b-form-group>
                                </client-only>
                                <b-form-row class="small mt-3 text-muted">
                                    <b-col>
                                        <b-form-group
                                            :invalid-feedback="
                                                validation.getInvalidFeedback('acceptedTerms')
                                            "
                                            :state="validation.getState('acceptedTerms')"
                                        >
                                            <b-form-checkbox
                                                v-model="registrationRequest.acceptedTerms"
                                                :state="validation.getState('acceptedTerms')"
                                            >
                                                I accept the
                                                <a
                                                    class="text-decoration-underline text-muted"
                                                    href="https://www.onvirtual.cards/terms/consumer"
                                                    target="_blank"
                                                    >terms of use</a
                                                >
                                                and
                                                <a
                                                    class="text-decoration-underline text-muted"
                                                    href="https://www.onvirtual.cards/policy/"
                                                    target="_blank"
                                                    >privacy policy</a
                                                >*
                                            </b-form-checkbox>
                                        </b-form-group>
                                    </b-col>
                                </b-form-row>
                                <div
                                    v-if="isRecaptchaEnabled"
                                    class="mt-2 d-flex justify-content-center"
                                >
                                    <recaptcha class="mx-auto" />
                                </div>
                                <b-row align-v="center" class="mt-4">
                                    <b-col class="text-center">
                                        <LoaderButton
                                            :is-loading="isLoadingRegistration"
                                            text="continue"
                                        />
                                    </b-col>
                                </b-row>
                            </b-form>
                        </div>
                    </div>
                </b-card-body>
            </b-card>
        </div>
    </b-col>
</template>
<script lang="ts">
import { ComputedRef } from '@nuxtjs/composition-api'
import { AxiosResponse } from 'axios'
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { reactive } from 'vue'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import BaseMixin from '~/mixins/BaseMixin'

import ComingSoonCurrencies from '~/components/atoms/ComingSoonCurrencies.vue'
import useZodValidation from '~/composables/useZodValidation'
import {
    INITIAL_SENSITIVE_PASSWORD_REQUEST,
    SensitivePassword,
} from '~/plugins/weavr-multi/api/models/authentication'
import { CreatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/CreatePasswordRequestModel'
import { IndustryTypeSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/IndustryTypeSelectConst'
import { SourceOfFundsSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/SourceOfFundsSelectConst'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import { ConsumerSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/ConsumerSourceOfFundTypeEnum'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import {
    CreateConsumerFormSchema,
    CreateConsumerRequest,
    INITIAL_CREATE_CONSUMER_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/consumers/requests/CreateConsumerRequest'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'

@Component({
    layout: 'auth',
    components: {
        ComingSoonCurrencies,
        LogoOvc,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/atoms/LoaderButton.vue'),
        RegistrationNav: () => import('~/components/molecules/registration/RegistrationNav.vue'),
        DobPicker: () => import('~/components/atoms/DobPicker.vue'),
        WeavrPasswordInput,
    },
    middleware: 'accessCodeVerified',
})
export default class ConsumerRegistrationPage extends mixins(BaseMixin) {
    @Ref('passwordField')
    passwordField!: WeavrPasswordInput

    rootMobileNumber = ''
    numberIsValid: boolean | null = null
    passwordStrength = 0

    public registrationRequest: CreateConsumerRequest & { password: SensitivePassword } = reactive({
        ...INITIAL_CREATE_CONSUMER_REQUEST(),
        profileId: this.$config.profileId.consumers,
        acceptedTerms: false,
        baseCurrency: CurrencyEnum.EUR,
        password: INITIAL_SENSITIVE_PASSWORD_REQUEST(),
    })

    private $recaptcha: any

    get validation() {
        return useZodValidation(CreateConsumerFormSchema, this.registrationRequest)
    }

    get isPasswordInvalidAndDirty(): boolean {
        return !this.isPasswordValid && this.validation.dirty.value
    }

    get industryOccupationOptions() {
        return IndustryTypeSelectConst
    }

    get dobState() {
        return {
            day: this.validation.getState('rootUser,dateOfBirth,day'),
            month: this.validation.getState('rootUser,dateOfBirth,month'),
            year: this.validation.getState('rootUser,dateOfBirth,year'),
        }
    }

    get dobInvalidFeedback() {
        return (
            this.validation.getInvalidFeedback('rootUser,dateOfBirth,day') ||
            this.validation.getInvalidFeedback('rootUser,dateOfBirth,month') ||
            this.validation.getInvalidFeedback('rootUser,dateOfBirth,year')
        )
    }

    get sourceOfFundsOptions() {
        return SourceOfFundsSelectConst
    }

    get shouldShowOtherSourceOfFunds(): boolean {
        return this.registrationRequest.sourceOfFunds === ConsumerSourceOfFundTypeEnum.OTHER
    }

    get passwordBaseStyle(): SecureElementStyleWithPseudoClasses {
        return {
            color: '#495057',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            fontFamily: "'Be Vietnam', sans-serif",
            fontWeight: '400',
            lineHeight: '24px',
            margin: '0',
            padding: '6px 12px',
            textIndent: '0px',
            '::placeholder': {
                color: '#B6B9C7',
                fontWeight: '400',
            },
        }
    }

    get config() {
        return {
            wrap: false,
            enableTime: false,
            altInput: true,
            altFormat: 'd/m/Y',
            maxDate: new Date(),
            locale: {
                firstDayOfWeek: 1,
            },
        }
    }

    get isRecaptchaEnabled(): boolean {
        return typeof process.env.RECAPTCHA !== 'undefined'
    }

    get isLoadingRegistration(): boolean {
        return this.consumersStore.consumerState.isLoadingRegistration
    }

    get isPasswordValid(): boolean {
        return this.passwordStrength >= 2
    }

    fetch() {
        this.$apiMulti.ipify.get().then((ip) => {
            this.registrationRequest.ipAddress = ip.data.ip
        })
    }

    async submitForm(e) {
        this.errorsStore.resetState()
        try {
            e.preventDefault()

            this.validation.touch() && (await this.validation.validate())

            if (this.numberIsValid === null) {
                this.numberIsValid = false
            }

            if (this.validation.isInvalid.value || !this.numberIsValid) {
                return
            }

            if (this.isPasswordValid) {
                this.consumersStore.setIsLoadingRegistration(true)
                this.passwordField.createToken().then(
                    (tokens) => {
                        if (tokens.tokens.password !== '') {
                            this.registrationRequest.password.value = tokens.tokens.password
                            this.doRegister()
                        } else {
                            return null
                        }
                    },
                    () => {
                        return null
                    },
                )
            }
        } catch (error: any) {
            this.stopRegistrationLoading()
            this.showErrorToast(error)
        }
    }

    strengthCheck(val) {
        this.passwordStrength = val.id
    }

    passwordInteraction(val: { empty: boolean; valid: boolean }) {
        !val.empty
            ? (this.registrationRequest.password.value = '******')
            : (this.registrationRequest.password.value = '')
    }

    doRegister() {
        this.consumersStore
            .create(this.registrationRequest as CreateConsumerRequest)
            .then(this.onConsumerCreated)
            .catch(this.registrationFailed)
    }

    onConsumerCreated(res: AxiosResponse<ConsumerModel>) {
        this.createPassword(res.data.rootUser.id.id!)
    }

    async createPassword(rootUserId: IDModel) {
        const passwordRequest: CreatePasswordRequestModel = {
            password: {
                value: this.registrationRequest.password.value as string,
            },
        }
        await this.$apiMulti.passwords
            .store({
                userId: rootUserId,
                data: passwordRequest,
            })
            .then(this.onRegisteredSuccessfully.bind(this))
    }

    onRegisteredSuccessfully() {
        this.accessCodes.deleteAccessCode()

        if (!this.registrationRequest.rootUser) {
            return
        }
        return this.$router.push({
            path: '/login/verify',
            query: {
                send: 'true',
                cons: this.consumer?.id.id,
                email: this.registrationRequest.rootUser.email,
            },
        })
    }

    registrationFailed(err) {
        this.stopRegistrationLoading()
        const _errCode = err.response.data.errorCode
        this.showErrorToast(_errCode)
    }

    phoneUpdate(number) {
        this.registrationRequest.rootUser!.mobile!.countryCode = '+' + number.countryCallingCode
        this.registrationRequest.rootUser!.mobile!.number = number.nationalNumber
        this.numberIsValid = number.isValid
    }

    updateDOB(val: ComputedRef) {
        Object.assign(this.registrationRequest.rootUser.dateOfBirth, {
            year: val.value.year,
            month: val.value.month === null ? null : val.value.month + 1,
            day: val.value.day,
        })
    }

    stopRegistrationLoading() {
        this.consumersStore.setIsLoadingRegistration(false)
    }
}
</script>
