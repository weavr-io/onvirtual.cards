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
                                <h3 class="text-center fw-light mb-5">Register</h3>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('rootUser,name')
                                    "
                                    :state="validation.getState('rootUser,name')"
                                    label="First Name*"
                                    class="mb-3"
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
                                    class="mb-3"
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
                                    class="mb-3"
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
                                    class="mb-3"
                                >
                                    <b-form-input
                                        v-model="registrationRequest.rootUser.email"
                                        placeholder="name@email.com"
                                    />
                                </b-form-group>
                                <b-form-group label="MOBILE NUMBER*" class="mb-3">
                                    <phone-number-input
                                        :value="registrationRequest.rootUser.mobile.number"
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
                                    class="mb-3"
                                >
                                    <b-form-select
                                        v-model="countryModel"
                                        :options="countryOptionsWithDefault"
                                        class="custom-select"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('rootUser,occupation')
                                    "
                                    :state="validation.getState('rootUser,occupation')"
                                    label="Industry*"
                                    class="mb-3"
                                >
                                    <b-form-select
                                        v-model="registrationRequest.rootUser.occupation"
                                        :options="industryOccupationOptions"
                                        class="custom-select"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('sourceOfFunds')
                                    "
                                    :state="validation.getState('sourceOfFunds')"
                                    label="Source of Funds*"
                                    class="mb-3"
                                >
                                    <b-form-select
                                        v-model="registrationRequest.sourceOfFunds"
                                        :options="sourceOfFundsOptions"
                                        class="custom-select"
                                    />
                                </b-form-group>
                                <b-form-group
                                    v-if="shouldShowOtherSourceOfFunds"
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('sourceOfFundsOther')
                                    "
                                    :state="validation.getState('sourceOfFundsOther')"
                                    label="Other"
                                    class="mb-3"
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
                                            @on-change="passwordInteraction"
                                            @on-strength="strengthCheck"
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
                                            class="mb-3"
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
                                    <client-only>
                                        <recaptcha-form
                                            :key="captchaKey"
                                            @error-callback="handleErrorCallback"
                                            @expired-callback="handleExpiredCallback"
                                            @load-callback="handleLoadCallback"
                                        />
                                    </client-only>
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

<script lang="ts" setup>
import type { AxiosResponse } from 'axios'
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import {
    type CreatePasswordRequestModel,
    INITIAL_SENSITIVE_PASSWORD_REQUEST,
    type SensitivePassword,
} from '~/plugins/weavr-multi/api/models/authentication'
import {
    ConsumerSourceOfFundsSelectConst,
    CurrencyEnum,
    type IDModel,
    IndustryTypeSelectConst,
} from '~/plugins/weavr-multi/api/models/common'
import { ConsumerSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/ConsumerSourceOfFundTypeEnum'
import type { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import {
    CreateConsumerFormSchema,
    type CreateConsumerRequest,
    INITIAL_CREATE_CONSUMER_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/consumers/requests/CreateConsumerRequest'
import type { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import useZodValidation from '~/composables/useZodValidation'
import ErrorAlert from '~/components/molecules/ErrorAlert.vue'
import ComingSoonCurrencies from '~/components/atoms/ComingSoonCurrencies.vue'
import DobPicker from '~/components/atoms/DobPicker.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import PhoneNumberInput from '~/components/molecules/PhoneNumberInput.vue'
import type { ApiInterface } from '~/plugins/weavr-multi/api/ApiInterface'

definePageMeta({
    layout: 'auth',
    middleware: ['access-code-verified'],
})

const router = useRouter()
const { profileId } = useRuntimeConfig().public
const { $apiMulti } = useNuxtApp()
const { consumer, showErrorToast, mobileCountries, countryOptionsWithDefault } = useBase()
const { accessCodes, consumers, errors } = useStores(['accessCodes', 'consumers', 'errors'])
const captchaKey = ref<number>(0)

const passwordField = ref<typeof WeavrPasswordInput | null>(null)
const numberIsValid = ref<boolean | null>(null)
const passwordStrength = ref(0)
const isCaptchaVerified = ref(false)

const registrationRequest: CreateConsumerRequest & { password: SensitivePassword } = reactive({
    ...INITIAL_CREATE_CONSUMER_REQUEST(),
    profileId: profileId.consumers,
    acceptedTerms: false,
    baseCurrency: CurrencyEnum.EUR,
    password: INITIAL_SENSITIVE_PASSWORD_REQUEST(),
})

const validation = computed(() => {
    return useZodValidation(CreateConsumerFormSchema, registrationRequest)
})

const isPasswordInvalidAndDirty = computed(() => {
    return !isPasswordValid && validation.value.dirty.value
})

const industryOccupationOptions = computed(() => {
    return IndustryTypeSelectConst
})

const countryModel = computed({
    get: () => registrationRequest.rootUser.address?.country ?? null,
    set: (value: string) => {
        if (!registrationRequest.rootUser.address) {
            registrationRequest.rootUser.address = {}
        }

        registrationRequest.rootUser.address.country = value
    },
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

const isRecaptchaEnabled = computed(() => {
    return typeof useRuntimeConfig().public.recaptcha.siteKey !== 'undefined'
})

const isLoadingRegistration = computed(() => {
    return consumers?.consumerState.isLoadingRegistration
})

const isPasswordValid = computed(() => {
    return passwordStrength.value >= 2
})

const handleErrorCallback = () => {
    isCaptchaVerified.value = false
}

const handleExpiredCallback = () => {
    isCaptchaVerified.value = false
}

const handleLoadCallback = (res: unknown) => {
    try {
        if (res) {
            isCaptchaVerified.value = true
        }
    } catch (e) {
        console.error(e)
    }
}

useAsyncData(async () => {
    await ($apiMulti as ApiInterface).ipify.get().then((ip) => {
        registrationRequest.ipAddress = ip.data.ip
    })
})

onMounted(() => {
    captchaKey.value++
})

const submitForm = async (e) => {
    errors?.resetState()

    try {
        e.preventDefault()

        validation.value.touch() && (await validation.value.validate())

        if (numberIsValid.value === null) {
            numberIsValid.value = false
        }

        if (validation.value.isInvalid.value || !numberIsValid.value) {
            return
        }

        if (!isCaptchaVerified.value) return

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
    await ($apiMulti as ApiInterface).passwords
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
    registrationRequest.rootUser!.mobile!.countryCode =
        number.countryCallingCode && `+${number.countryCallingCode}`
    registrationRequest.rootUser!.mobile!.number =
        number.phoneNumber && number.phoneNumber.replace(/\s+/g, '')
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
</script>
