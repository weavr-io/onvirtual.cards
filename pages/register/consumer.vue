<template>
    <b-col lg="6" md="9">
        <div class="mb-5">
            <LogoOvc classes="mb-5" />
            <coming-soon-currencies />
            <b-card class="overflow-hidden" no-body>
                <b-card-body class="px-4 mx-3 py-5 p-sm-card">
                    <div class="form-screens">
                        <error-alert />
                        <div class="form-screen">
                            <b-form novalidate @submit.prevent="submitForm">
                                <h3 class="text-center font-weight-light mb-5">Register</h3>
                                <b-form-group label="First Name*">
                                    <b-form-input
                                        v-model="registrationRequest.rootUser.name"
                                        :state="isInvalid($v.registrationRequest.rootUser.name)"
                                        placeholder="First Name"
                                    />
                                    <b-form-invalid-feedback
                                        v-if="!$v.registrationRequest.rootUser.name.required"
                                    >
                                        This field is required
                                    </b-form-invalid-feedback>
                                    <b-form-invalid-feedback
                                        v-if="!$v.registrationRequest.rootUser.name.maxLength"
                                    >
                                        Name is too long.
                                    </b-form-invalid-feedback>
                                </b-form-group>
                                <b-form-group label="Last Name*">
                                    <b-form-input
                                        v-model="registrationRequest.rootUser.surname"
                                        :state="isInvalid($v.registrationRequest.rootUser.surname)"
                                        placeholder="Last Name"
                                    />
                                    <b-form-invalid-feedback
                                        v-if="!$v.registrationRequest.rootUser.surname.required"
                                    >
                                        This field is required
                                    </b-form-invalid-feedback>
                                    <b-form-invalid-feedback
                                        v-if="!$v.registrationRequest.rootUser.surname.maxLength"
                                    >
                                        Surname is too long.
                                    </b-form-invalid-feedback>
                                </b-form-group>

                                <b-form-group label="Date of Birth*">
                                    <dob-picker
                                        :placeholders="['Day', 'Month', 'Year']"
                                        class="d-flex"
                                        label-class="small flex-fill"
                                        month-format="long"
                                        select-class="form-control"
                                        show-labels="false"
                                        @change="updateDOB"
                                        @input="updateDOB"
                                    />
                                    <b-form-invalid-feedback
                                        :state="
                                            isInvalid($v.registrationRequest.rootUser.dateOfBirth)
                                        "
                                    >
                                        This field is required.
                                    </b-form-invalid-feedback>
                                </b-form-group>
                                <b-form-group
                                    :state="isInvalid($v.registrationRequest.rootUser.email)"
                                    label="Email*"
                                >
                                    <b-form-input
                                        v-model="$v.registrationRequest.rootUser.email.$model"
                                        :state="isInvalid($v.registrationRequest.rootUser.email)"
                                        placeholder="name@email.com"
                                        @input="delayTouch($v.registrationRequest.rootUser.email)"
                                    />
                                    <b-form-invalid-feedback
                                        >Email address invalid.
                                    </b-form-invalid-feedback>
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
                                    :state="
                                        isInvalid($v.registrationRequest.rootUser.address.country)
                                    "
                                    label="Country*"
                                >
                                    <b-form-select
                                        v-model="
                                            $v.registrationRequest.rootUser.address.country.$model
                                        "
                                        :options="countryOptionsWithDefault"
                                        :state="
                                            isInvalid(
                                                $v.registrationRequest.rootUser.address.country,
                                            )
                                        "
                                        placeholder="Registration Country"
                                    />
                                    <b-form-invalid-feedback>
                                        This field is required.
                                    </b-form-invalid-feedback>
                                </b-form-group>
                                <b-form-group
                                    :state="isInvalid($v.registrationRequest.rootUser.occupation)"
                                    label="Industry*"
                                >
                                    <b-form-select
                                        v-model="$v.registrationRequest.rootUser.occupation.$model"
                                        :options="industryOccupationOptions"
                                        :state="
                                            isInvalid($v.registrationRequest.rootUser.occupation)
                                        "
                                    />
                                    <b-form-invalid-feedback
                                        >This field is required.
                                    </b-form-invalid-feedback>
                                </b-form-group>
                                <b-form-group
                                    :state="isInvalid($v.registrationRequest.sourceOfFunds)"
                                    label="Source of Funds*"
                                >
                                    <b-form-select
                                        v-model="$v.registrationRequest.sourceOfFunds.$model"
                                        :options="sourceOfFundsOptions"
                                        :state="isInvalid($v.registrationRequest.sourceOfFunds)"
                                    />
                                    <b-form-invalid-feedback
                                        >This field is required.
                                    </b-form-invalid-feedback>
                                </b-form-group>
                                <b-form-group v-if="shouldShowOtherSourceOfFunds" label="Other">
                                    <b-form-input
                                        v-model="registrationRequest.sourceOfFundsOther"
                                        :state="
                                            isInvalid($v.registrationRequest.sourceOfFundsOther)
                                        "
                                        placeholder="Specify Other Source of Funds"
                                    />
                                </b-form-group>
                                <client-only placeholder="Loading...">
                                    <div>
                                        <label class="d-block">PASSWORD*</label>
                                        <weavr-password-input
                                            ref="passwordField"
                                            :base-style="passwordBaseStyle"
                                            :options="{ placeholder: '****' }"
                                            class-name="sign-in-password"
                                            name="password"
                                            required="true"
                                            @onChange="passwordInteraction"
                                            @onStrength="strengthCheck"
                                        />
                                        <small
                                            :class="
                                                !isPasswordValidAndDirty
                                                    ? 'text-danger'
                                                    : 'text-muted'
                                            "
                                            class="form-text mb-3"
                                            >- min 8 characters <br />- uppercase letter <br />-
                                            digit and a special character</small
                                        >
                                    </div>
                                </client-only>
                                <b-form-row class="small mt-3 text-muted">
                                    <b-col>
                                        <b-form-group>
                                            <b-form-checkbox
                                                v-model="
                                                    $v.registrationRequest.acceptedTerms.$model
                                                "
                                                :state="
                                                    isInvalid($v.registrationRequest.acceptedTerms)
                                                "
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
                                            <b-form-invalid-feedback
                                                >This field is required.
                                            </b-form-invalid-feedback>
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
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { email, maxLength, required, sameAs } from 'vuelidate/lib/validators'

import { AxiosResponse } from 'axios'

import LogoOvc from '~/components/atoms/LogoOvc.vue'
import { DeepNullable, RecursivePartial } from '~/global'
import BaseMixin from '~/mixins/BaseMixin'
import ValidationMixin from '~/mixins/ValidationMixin'
import { CreatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/CreatePasswordRequestModel'
import { IndustryTypeSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/IndustryTypeSelectConst'
import { SourceOfFundsSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/SourceOfFundsSelectConst'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { ConsumerSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/ConsumerSourceOfFundTypeEnum'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { CreateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/CreateConsumerRequest'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'

const touchMap = new WeakMap()

@Component({
    layout: 'auth',
    validations: {
        registrationRequest: {
            rootUser: {
                name: {
                    required,
                    maxLength: maxLength(20),
                },
                surname: {
                    required,
                    maxLength: maxLength(20),
                },
                email: {
                    required,
                    email,
                },
                mobile: {
                    countryCode: {
                        required,
                    },
                    number: {
                        required,
                    },
                },
                occupation: {
                    required,
                },
                dateOfBirth: {
                    day: {
                        required,
                    },
                    month: {
                        required,
                    },
                    year: {
                        required,
                    },
                },
                address: {
                    country: {
                        required,
                    },
                },
            },
            acceptedTerms: {
                required,
                sameAs: sameAs(() => true),
            },
            sourceOfFunds: {
                required,
            },
            sourceOfFundsOther: {},
            password: {
                required,
            },
        },
    },
    components: {
        LogoOvc,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/atoms/LoaderButton.vue'),
        RegistrationNav: () => import('~/components/registration/RegistrationNav.vue'),
        ComingSoonCurrencies: () => import('~/components/comingSoonCurrencies.vue'),
        DobPicker: () => import('~/components/fields/dob-picker.vue'),
        WeavrPasswordInput,
    },
    middleware: 'accessCodeVerified',
})
export default class ConsumerRegistrationPage extends mixins(BaseMixin, ValidationMixin) {
    @Ref('passwordField')
    passwordField!: WeavrPasswordInput

    rootMobileNumber = ''
    numberIsValid: boolean | null = null
    passwordStrength = 0
    public registrationRequest: DeepNullable<
        RecursivePartial<CreateConsumerRequest> & { password: string }
    > = {
        profileId: this.$config.profileId.consumers,
        tag: 'tag',
        rootUser: {
            name: null,
            surname: null,
            email: null,
            mobile: {
                number: null,
                countryCode: '+356',
            },
            dateOfBirth: {
                day: null,
                month: null,
                year: null,
            },
            address: {
                country: null,
            },
            occupation: null,
        },
        baseCurrency: CurrencyEnum.EUR,
        ipAddress: null,
        acceptedTerms: false,
        sourceOfFunds: null,
        sourceOfFundsOther: null,
        password: null,
    }

    private $recaptcha: any

    get isPasswordValidAndDirty() {
        return !this.$v.registrationRequest.password?.$dirty ? true : this.isPasswordValid
    }

    get industryOccupationOptions() {
        return IndustryTypeSelectConst
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

    submitForm(e) {
        this.errorsStore.resetState()
        try {
            e.preventDefault()

            this.$v.$touch()

            if (this.numberIsValid === null) {
                this.numberIsValid = false
            }

            if (this.$v.$invalid || !this.numberIsValid) {
                return
            }

            if (this.isPasswordValid) {
                this.consumersStore.setIsLoadingRegistration(true)
                this.passwordField.createToken().then(
                    (tokens) => {
                        if (tokens.tokens.password !== '') {
                            this.registrationRequest.password = tokens.tokens.password
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
            ? (this.registrationRequest.password = '******')
            : (this.registrationRequest.password = '')
        this.$v.registrationRequest.password?.$touch()
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

    delayTouch($v) {
        $v.$reset()
        if (touchMap.has($v)) {
            clearTimeout(touchMap.get($v))
        }
        touchMap.set($v, setTimeout($v.$touch, 1000))
    }

    updateDOB(val) {
        this.registrationRequest.rootUser!.dateOfBirth = {
            year: val.getFullYear(),
            month: val.getMonth() + 1,
            day: val.getDate(),
        }
    }

    stopRegistrationLoading() {
        this.consumersStore.setIsLoadingRegistration(false)
    }
}
</script>
