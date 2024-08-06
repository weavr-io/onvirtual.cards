<template>
    <section>
        <b-container>
            <b-row v-if="pendingDataOrError">
                <b-col>
                    <LoadingSpinner center show />
                </b-col>
            </b-row>
            <b-row v-else align-h="center">
                <b-col lg="6" md="9">
                    <b-card class="border-0">
                        <b-card-title class="mb-5 text-center fw-lighter">
                            Update Card
                        </b-card-title>
                        <b-card-body>
                            <b-form @submit.prevent="doUpdate">
                                <b-form-row v-if="!isConsumer">
                                    <b-col>
                                        <b-form-group label="CARDHOLDER MOBILE NUMBER">
                                            <phone-number-input
                                                :border-radius="0"
                                                :default-country-code="mobile.countryCode"
                                                :error="numberIsValid === false"
                                                :value="mobile.cardholderMobileNumber"
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
                                <b-form-row>
                                    <b-col>
                                        <b-form-group
                                            :invalid-feedback="
                                                validation.getInvalidFeedback('friendlyName')
                                            "
                                            :state="validation.getState('friendlyName')"
                                            label="CUSTOM CARD NAME"
                                        >
                                            <b-form-input
                                                v-model="updateManagedCardRequest.friendlyName"
                                                placeholder="eg. travel expenses"
                                            />
                                        </b-form-group>
                                    </b-col>
                                </b-form-row>
                                <LoaderButton
                                    :is-loading="isLoading"
                                    class="mt-5 text-center"
                                    text="next"
                                />
                            </b-form>
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>
<script lang="ts" setup>
import { type CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js'
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import {
    INITIAL_MC_UPDATE_REQUEST,
    ManagedCardUpdateSchema,
    type UpdateManagedCard,
} from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpdateManagedCard'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
import useZodValidation from '~/composables/useZodValidation'
import PhoneNumberInput from '~/components/molecules/PhoneNumberInput.vue'

const route = useRoute()
const router = useRouter()
const { pendingDataOrError, isCorporate, isConsumer, showSuccessToast, showErrorToast } = useBase()
const { cards } = useStores(['cards'])

const numberIsValid: Ref<boolean | null> = ref(null)
const mobile = ref<{ countryCode: CountryCode | undefined; cardholderMobileNumber: string }>({
    countryCode: 'GB',
    cardholderMobileNumber: '',
})
const isUpdating = ref(false)
const updateManagedCardRequest: UpdateManagedCard = reactive({
    ...INITIAL_MC_UPDATE_REQUEST(),
    cardholderMobileNumber: mobile.value,
})

const validation = computed(() => {
    return useZodValidation(
        ManagedCardUpdateSchema.pick({
            friendlyName: true,
            ...(isCorporate.value && { cardholderMobileNumber: true }),
        }).required(),
        updateManagedCardRequest,
    )
})

const isLoading = computed(() => {
    // TODO: add || pendingData.value
    return cards?.cardState.isLoading || isUpdating.value
})

const cardId = computed(() => {
    return route.params.id
})

useAsyncData(async () => {
    const card = await cards?.getManagedCard(cardId.value as string)
    if (card) {
        const parsedNumber = parsePhoneNumberFromString(card.data.cardholderMobileNumber)

        // add key cardholderMobileNumber only if isCorporate
        Object.assign(updateManagedCardRequest, {
            friendlyName: card.data.friendlyName,
            ...(isCorporate.value && { cardholderMobileNumber: '' }),
        })

        mobile.value.countryCode = parsedNumber?.country
        mobile.value.cardholderMobileNumber = parsedNumber?.nationalNumber.toString() || ''
    }
})

const doUpdate = async () => {
    if (isConsumer) {
        numberIsValid.value = true
    }

    if (numberIsValid.value === null) {
        numberIsValid.value = false
    }

    await validation.value.validate()

    if (validation.value.isInvalid.value || !numberIsValid.value) {
        return
    }

    isUpdating.value = true

    await cards
        ?.update({
            id: cardId.value as string,
            request: updateManagedCardRequest as UpdateManagedCard,
        })
        .then(() => {
            showSuccessToast('Card name changed')
            router.push('/managed-cards')
        })
        .finally(() => {
            isUpdating.value = false
        })
        .catch(() => {
            showErrorToast('Card name change error')
        })
}

const phoneUpdate = (number) => {
    mobile.value.cardholderMobileNumber = number.formatNational
        ? number.formatNational
        : number.phoneNumber
    updateManagedCardRequest.cardholderMobileNumber = number.formattedNumber
    numberIsValid.value = number.isValid
    validation.value.validate()
}
</script>
