<template>
    <b-col lg="6" md="9">
        <LogoOvc :link="false" classes="pb-5" />
        <b-card body-class="p-card">
            <h3 class="text-center fw-light mb-4">Add your phone number</h3>
            <p class="text-center mb-5">
                We need your phone number to send you one-time passwords when logging in. we will
                not share this with anyone.
            </p>
            <b-form novalidate @submit.prevent="submitForm">
                <b-form-group label="MOBILE NUMBER*">
                    <phone-number-input
                        :border-radius="0"
                        :error="numberIsValid === false"
                        :only-countries="mobileCountries"
                        :value="updateRequest.mobile.number"
                        color="#6C1C5C"
                        default-country-code="GB"
                        error-color="#F50E4C"
                        valid-color="#6D7490"
                        @update="phoneUpdate"
                    />
                    <b-form-invalid-feedback
                        v-if="numberIsValid === false"
                        force-show
                        style="position: absolute"
                    >
                        This field must be a valid mobile number.
                    </b-form-invalid-feedback>
                </b-form-group>
                <LoaderButton :is-loading="isLoading" class="text-center mt-5" text="save number" />
            </b-form>
        </b-card>
    </b-col>
</template>

<script lang="ts" setup>
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import {
    SCAFactorStatusEnum,
    SCAOtpChannelEnum,
} from '~/plugins/weavr-multi/api/models/authentication'
import {
    CredentialTypeEnum,
    INITIAL_MOBILE_REQUEST,
    type Mobile,
} from '~/plugins/weavr-multi/api/models/common'
import type { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/UpdateConsumerRequest'
import {
    RootUserMobileSchema,
    type UpdateCorporateRequest,
} from '~/plugins/weavr-multi/api/models/identities/corporates'
import type { UpdateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UpdateUserRequestModel'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import useZodValidation from '~/composables/useZodValidation'
import PhoneNumberInput from '~/components/molecules/PhoneNumberInput.vue'

definePageMeta({
    layout: 'auth',
    middleware: 'ky-verified',
})

const router = useRouter()
const { isConsumer, showErrorToast, mobileCountries } = useBase()
const { auth, consumers, corporates, users } = useStores([
    'auth',
    'consumers',
    'corporates',
    'users',
])

const isLoading = ref(false)
const numberIsValid = ref<boolean | null>(null)
const updateRequest: { mobile: Mobile } = reactive({
    mobile: {
        ...INITIAL_MOBILE_REQUEST(),
    },
})

const validation = computed(() => {
    return useZodValidation(RootUserMobileSchema, updateRequest)
})

useAsyncData(async () => {
    await auth?.indexAuthFactors()

    const smsAuthFactors = auth?.authState.authFactors?.factors?.filter(
        (factor) => factor.channel === SCAOtpChannelEnum.SMS,
    )

    if (smsAuthFactors && smsAuthFactors[0].status !== SCAFactorStatusEnum.PENDING_VERIFICATION) {
        return router.replace('/dashboard')
    }
})

const submitForm = async () => {
    isLoading.value = true

    if (numberIsValid.value === null) {
        numberIsValid.value = false
    }

    try {
        await validation.value.validate()

        if (validation.value.isInvalid.value || !numberIsValid.value) {
            isLoading.value = false
            return null
        }

        if (auth?.authState.auth?.credentials.type === CredentialTypeEnum.ROOT) {
            isConsumer.value
                ? await consumers?.update(updateRequest as UpdateConsumerRequest)
                : await corporates?.update(updateRequest as UpdateCorporateRequest)
        } else {
            await users?.update({
                id: auth!.authState.auth!.credentials.id,
                data: updateRequest as UpdateUserRequestModel,
            })
        }
        await router.push({
            path: '/login/verify/mobile',
            query: {
                send: 'true',
            },
        })
    } catch (error: any) {
        showErrorToast(error)
    } finally {
        isLoading.value = false
    }
}

const phoneUpdate = (number) => {
    updateRequest.mobile.countryCode = number.countryCallingCode && `+${number.countryCallingCode}`
    updateRequest.mobile.number = number.phoneNumber
    if (number.phoneNumber) {
        numberIsValid.value = number.isValid
    }
}
</script>
