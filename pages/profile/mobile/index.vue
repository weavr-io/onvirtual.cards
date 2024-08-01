<template>
    <section class="py-5">
        <b-container>
            <b-row align-h="center">
                <b-col md="6">
                    <b-form @submit.prevent="doUpdateIdentityRoot">
                        <error-alert />
                        <b-form-row>
                            <b-col>
                                <b-form-group label="FIRST NAME">
                                    <b-form-input
                                        :value="rootName"
                                        class="form-control"
                                        disabled
                                        placeholder="John"
                                        readonly
                                    />
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="LAST NAME">
                                    <b-form-input
                                        :value="rootSurname"
                                        class="form-control"
                                        disabled
                                        placeholder="Doe"
                                        readonly
                                    />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('email')"
                                    :state="validation.getState('email')"
                                    label="E-Mail"
                                >
                                    <b-form-input
                                        v-model="updateIdentityRootUser.email"
                                        :disabled="isEmailVerified"
                                        class="form-control"
                                        placeholder="example@email.com"
                                    />
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                <b-form-group label="MOBILE NUMBER">
                                    <phone-number-input
                                        :border-radius="0"
                                        :default-country-code="mobileCountryCode"
                                        :disabled="isMobileVerified"
                                        :error="numberIsValid === false"
                                        :value="mobile.number"
                                        color="#6C1C5C"
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
                            </b-col>
                        </b-form-row>
                        <div class="small text-center my-5">
                            If you are already verified and need to update your email or mobile
                            number please contact
                            <a href="mailto: support@onvirtual.cards">support@onvirtual.cards</a>.
                        </div>
                        <b-form-row class="my-4">
                            <b-col class="text-center">
                                <b-link class="link" to="/profile/password/change">
                                    Change password
                                </b-link>
                            </b-col>
                        </b-form-row>
                        <b-row align-v="center" class="mt-5">
                            <b-col class="text-center">
                                <LoaderButton
                                    :disabled="isMobileVerified && isEmailVerified"
                                    :is-loading="isLoading"
                                    text="save"
                                />
                            </b-col>
                        </b-row>
                    </b-form>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script lang="ts" setup>
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { type CountryCode } from 'libphonenumber-js'
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import {
    INITIAL_UPDATE_CONSUMER_REQUEST,
    type UpdateConsumerRequest,
} from '~/plugins/weavr-multi/api/models/identities/consumers/requests/UpdateConsumerRequest'
import {
    type UpdateCorporateRequest,
    UpdateCorporateRequestSchema,
} from '~/plugins/weavr-multi/api/models/identities/corporates'
import ErrorAlert from '~/components/molecules/ErrorAlert.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import useZodValidation from '~/composables/useZodValidation'
import PhoneNumberInput from '~/components/molecules/PhoneNumberInput.vue'

definePageMeta({
    middleware: 'ky-verified',
})

const { isConsumer, consumer, corporate, rootName, rootSurname } = useBase()
const { consumers, corporates } = useStores(['consumers', 'corporates'])
const numberIsValid = ref<boolean | null>(null)
const updateIdentityRootUser = reactive(INITIAL_UPDATE_CONSUMER_REQUEST())
const isLoading = ref(false)
const mobile = ref<{ countryCode: string; number: string }>({
    countryCode: '',
    number: '',
})

const validation = computed(() => {
    return useZodValidation(UpdateCorporateRequestSchema, updateIdentityRootUser)
})

const mobileCountryCode = computed(() => mobile.value.countryCode as CountryCode)

const isMobileVerified = computed(() => {
    return isConsumer.value
        ? consumer.value?.rootUser.mobileNumberVerified
        : corporate.value?.rootUser.mobileNumberVerified
})

const isEmailVerified = computed(() => {
    return isConsumer.value
        ? consumer.value?.rootUser.emailVerified
        : corporate.value?.rootUser.emailVerified
})

useState(() => {
    Object.assign(updateIdentityRootUser, {
        mobile: {
            countryCode: isConsumer.value
                ? (consumer.value?.rootUser?.mobile.countryCode ?? null)
                : (corporate.value?.rootUser?.mobile.countryCode ?? null),
            number: isConsumer.value
                ? (consumer.value?.rootUser?.mobile.number ?? null)
                : (corporate.value?.rootUser?.mobile.number ?? null),
        },
        email: isConsumer.value
            ? (consumer.value?.rootUser?.email ?? null)
            : (corporate.value?.rootUser?.email ?? null),
    })

    if (!(updateIdentityRootUser.mobile?.countryCode && updateIdentityRootUser.mobile.number)) {
        return
    }

    const _parsedNumber = parsePhoneNumberFromString(
        updateIdentityRootUser.mobile!.countryCode! + updateIdentityRootUser.mobile!.number,
    )

    mobile.value = {
        countryCode: _parsedNumber?.country ?? '',
        number: updateIdentityRootUser.mobile?.number ?? '',
    }
})

const phoneUpdate = (number) => {
    mobile.value.countryCode = mobile.value.countryCode && `+${number.countryCallingCode}`
    mobile.value.number = number.phoneNumber

    updateIdentityRootUser.mobile = { ...mobile.value }
    if (number.phoneNumber) {
        numberIsValid.value = number.isValid
    }
}

const doUpdateIdentityRoot = async () => {
    isLoading.value = true

    if (numberIsValid.value === null) {
        numberIsValid.value = false
    }

    await validation.value.validate()

    if (validation.value.isInvalid.value || !numberIsValid.value) {
        isLoading.value = false
        return
    }

    const xhr: Promise<any>[] = []

    isConsumer.value
        ? xhr.push(consumers!.update(updateIdentityRootUser as UpdateConsumerRequest))
        : xhr.push(corporates!.update(updateIdentityRootUser as UpdateCorporateRequest))

    Promise.all(xhr).finally(() => {
        isLoading.value = false
    })
}
</script>
