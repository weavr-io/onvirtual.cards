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
                                    <phone-number-input
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
                                        label="PASSWORD*"
                                        label-for="password"
                                    >
                                        <weavr-password-input
                                            ref="passwordField"
                                            :base-style="passwordBaseStyle"
                                            :class-name="[
                                                'sign-in-password',
                                                isPasswordInvalidAndDirty ? 'is-invalid' : '',
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
import {
    computed,
    ComputedRef,
    defineComponent,
    reactive,
    ref,
    useContext,
    useFetch,
    watch,
    useRouter,
} from '@nuxtjs/composition-api'
import { AxiosResponse } from 'axios'
import ErrorAlert from '~/components/molecules/ErrorAlert.vue'
import ComingSoonCurrencies from '~/components/atoms/ComingSoonCurrencies.vue'
import DobPicker from '~/components/atoms/DobPicker.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import useZodValidation from '~/composables/useZodValidation'
import {
    CreatePasswordRequestModel,
    INITIAL_SENSITIVE_PASSWORD_REQUEST,
    SensitivePassword,
} from '~/plugins/weavr-multi/api/models/authentication'
import {
    ConsumerSourceOfFundsSelectConst,
    CurrencyEnum,
    IDModel,
    IndustryTypeSelectConst,
} from '~/plugins/weavr-multi/api/models/common'
import { ConsumerSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/ConsumerSourceOfFundTypeEnum'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import {
    CreateConsumerFormSchema,
    CreateConsumerRequest,
    INITIAL_CREATE_CONSUMER_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/consumers/requests/CreateConsumerRequest'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import PhoneNumberInput from '~/components/molecules/PhoneNumberInput.vue'

export default defineComponent({
    components: {
        PhoneNumberInput,
        ComingSoonCurrencies,
        LogoOvc,
        ErrorAlert,
        LoaderButton,
        DobPicker,
        WeavrPasswordInput,
    },
    layout: 'auth',
    middleware: 'accessCodeVerified',
    setup() {
        const router = useRouter()
        const { $apiMulti, $config } = useContext()
        const { consumer, showErrorToast, mobileCountries, countryOptionsWithDefault } = useBase()
        const { accessCodes, consumers, errors } = useStores(['accessCodes', 'consumers', 'errors'])

        const passwordField = ref<typeof WeavrPasswordInput | null>(null)
        const rootMobileNumber = ref('')
        const numberIsValid = ref<boolean | null>(null)
        const passwordStrength = ref(0)
        const isPasswordInvalidAndDirty = ref<boolean>(false)

        const registrationRequest: CreateConsumerRequest & { password: SensitivePassword } =
            reactive({
                ...INITIAL_CREATE_CONSUMER_REQUEST(),
                profileId: $config.profileId.consumers,
                acceptedTerms: false,
                baseCurrency: CurrencyEnum.EUR,
                password: INITIAL_SENSITIVE_PASSWORD_REQUEST(),
            })

        const recaptcha = ref(undefined)

        const validation = computed(() => {
            return useZodValidation(CreateConsumerFormSchema, registrationRequest)
        })

        const industryOccupationOptions = computed(() => {
            return IndustryTypeSelectConst
        })

        const dobState = computed(() => {
            return {
                day: validation.value.getState('rootUser,dateOfBirth,day') ?? undefined,
                month: validation.value.getState('rootUser,dateOfBirth,month') ?? undefined,
                year: validation.value.getState('rootUser,dateOfBirth,year') ?? undefined,
            }
        })

        const dobInvalidFeedback = computed(() => {
            return (
                validation.value.getInvalidFeedback('rootUser,dateOfBirth,day') ||
                validation.value.getInvalidFeedback('rootUser,dateOfBirth,month') ||
                validation.value.getInvalidFeedback('rootUser,dateOfBirth,year')
            )
        })

        const sourceOfFundsOptions = computed(() => {
            return ConsumerSourceOfFundsSelectConst
        })
        const shouldShowOtherSourceOfFunds = computed(() => {
            return registrationRequest.sourceOfFunds === ConsumerSourceOfFundTypeEnum.OTHER
        })

        const passwordBaseStyle: ComputedRef<SecureElementStyleWithPseudoClasses> = computed(() => {
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
        })

        const config = computed(() => {
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
        })

        const isRecaptchaEnabled = computed(() => {
            return typeof process.env.RECAPTCHA !== 'undefined'
        })

        const isLoadingRegistration = computed(() => {
            return consumers?.consumerState.isLoadingRegistration
        })

        const isPasswordValid = computed(() => {
            return passwordStrength.value >= 2
        })

        useFetch(() => {
            $apiMulti.ipify.get().then((ip) => {
                registrationRequest.ipAddress = ip.data.ip
            })
        })

        const submitForm = async (e) => {
            errors?.resetState()
            try {
                e.preventDefault()

                validation.value.touch() && (await validation.value.validate())

                if (!isPasswordValid.value) {
                    isPasswordInvalidAndDirty.value = true
                }

                if (numberIsValid.value === null) {
                    numberIsValid.value = false
                }

                if (validation.value.isInvalid.value || !numberIsValid.value) {
                    return
                }

                if (isPasswordValid.value) {
                    consumers?.setIsLoadingRegistration(true)
                    passwordField.value?.createToken().then(
                        (tokens) => {
                            if (tokens.tokens.password !== '') {
                                registrationRequest.password.value = tokens.tokens.password
                                doRegister()
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
                stopRegistrationLoading()
                showErrorToast(error)
            }
        }

        const strengthCheck = (val) => {
            passwordStrength.value = val.id
        }

        const passwordInteraction = (val: { empty: boolean; valid: boolean }) => {
            !val.empty
                ? (registrationRequest.password.value = '******')
                : (registrationRequest.password.value = '')
        }

        const doRegister = () => {
            consumers
                ?.create(registrationRequest as CreateConsumerRequest)
                .then(onConsumerCreated)
                .catch(registrationFailed)
        }

        const onConsumerCreated = (res: AxiosResponse<ConsumerModel>) => {
            createPassword(res.data.rootUser.id.id!)
        }

        const createPassword = async (rootUserId: IDModel) => {
            const passwordRequest: CreatePasswordRequestModel = {
                password: {
                    value: registrationRequest.password.value as string,
                },
            }
            await $apiMulti.passwords
                .store({
                    userId: rootUserId,
                    data: passwordRequest,
                })
                .then(onRegisteredSuccessfully.bind(this))
        }

        const onRegisteredSuccessfully = () => {
            accessCodes?.deleteAccessCode()

            if (!registrationRequest.rootUser) {
                return
            }
            return router.push({
                path: '/login/verify',
                query: {
                    send: 'true',
                    cons: consumer.value?.id.id,
                    email: registrationRequest.rootUser.email,
                },
            })
        }

        const registrationFailed = (err) => {
            stopRegistrationLoading()
            const _errCode = err.response.data.errorCode
            showErrorToast(_errCode)
        }

        const phoneUpdate = (number) => {
            registrationRequest.rootUser!.mobile!.countryCode = '+' + number.countryCallingCode
            registrationRequest.rootUser!.mobile!.number = number.nationalNumber
            if (number.phoneNumber) {
                numberIsValid.value = number.isValid
            }
        }

        const updateDOB = (val: ComputedRef) => {
            Object.assign(registrationRequest.rootUser.dateOfBirth, {
                year: val.value.year,
                month: val.value.month === null ? null : val.value.month + 1,
                day: val.value.day,
            })
        }

        const stopRegistrationLoading = () => {
            consumers?.setIsLoadingRegistration(false)
        }

        watch(passwordStrength, (data) => {
            if (validation.value.dirty.value && data) {
                isPasswordInvalidAndDirty.value = false
                validation.value.validate()
            }
        })

        return {
            recaptcha,
            config,
            passwordField,
            submitForm,
            validation,
            registrationRequest,
            dobInvalidFeedback,
            rootMobileNumber,
            dobState,
            updateDOB,
            numberIsValid,
            mobileCountries,
            phoneUpdate,
            countryOptionsWithDefault,
            industryOccupationOptions,
            sourceOfFundsOptions,
            shouldShowOtherSourceOfFunds,
            passwordBaseStyle,
            isPasswordInvalidAndDirty,
            passwordInteraction,
            strengthCheck,
            isRecaptchaEnabled,
            isLoadingRegistration,
        }
    },
})
</script>
