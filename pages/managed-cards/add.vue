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
                            Create Card
                        </b-card-title>
                        <b-card-body>
                            <b-alert :show="showError" class="text-center" variant="danger">
                                Error creating new card. <br />Contact support if problem persists.
                            </b-alert>
                            <b-form v-if="!showError" @submit.prevent="doAdd">
                                <b-form-row v-if="showNameOnCardField">
                                    <b-col>
                                        <b-form-group
                                            :invalid-feedback="
                                                validation.getInvalidFeedback('nameOnCard')
                                            "
                                            :state="validation.getState('nameOnCard')"
                                            label="Name of Person using Card"
                                        >
                                            <b-form-input
                                                v-model="createManagedCardRequest.nameOnCard"
                                                placeholder="eg. Elon Musk"
                                            />
                                        </b-form-group>
                                    </b-col>
                                </b-form-row>
                                <b-form-row v-if="!isConsumer">
                                    <b-col>
                                        <b-form-group label="CARDHOLDER MOBILE NUMBER">
                                            <phone-number-input
                                                :border-radius="0"
                                                :error="numberIsValid === false"
                                                :value="mobile.number"
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
                                    </b-col>
                                </b-form-row>
                                <b-form-row>
                                    <b-col>
                                        <b-form-group
                                            :invalid-feedback="
                                                validation.getInvalidFeedback('currency')
                                            "
                                            :state="validation.getState('currency')"
                                            label="Currency"
                                        >
                                            <b-form-select
                                                v-model="createManagedCardRequest.currency"
                                                :options="currencyOptions"
                                            />
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
                                            label="ADD A CUSTOM CARD NAME"
                                        >
                                            <b-form-input
                                                v-model="createManagedCardRequest.friendlyName"
                                                placeholder="eg. travel expenses"
                                            />
                                        </b-form-group>
                                    </b-col>
                                </b-form-row>
                                <LoaderButton
                                    :is-loading="localIsBusy"
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
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import useZodValidation from '~/composables/useZodValidation'
import {
    type Address,
    CurrencyEnum,
    CurrencySelectConst,
} from '~/plugins/weavr-multi/api/models/common'
import type { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import {
    type CreateManagedCard,
    CreateManagedCardSchema,
    INITIAL_MANAGED_CARD_REQUEST,
} from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/CreateManagedCard'
import PhoneNumberInput from '~/components/molecules/PhoneNumberInput.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'

definePageMeta({
    middleware: 'ky-verified',
})

const router = useRouter()
const { pendingDataOrError, profileBaseCurrency, isConsumer, cardJurisdictionProfileId } = useBase()
const { auth, cards, consumers, corporates } = useStores([
    'auth',
    'cards',
    'consumers',
    'corporates',
])

const showError = ref(false)
const localIsBusy = ref(false)
const mobile = ref({
    countryCode: '',
    number: '',
})
const numberIsValid = ref<boolean | null>(null)
const createManagedCardRequest: CreateManagedCard = reactive(INITIAL_MANAGED_CARD_REQUEST())

const validation = computed(() => {
    return useZodValidation(
        CreateManagedCardSchema.pick({
            friendlyName: true,
            currency: true,
            nameOnCard: true,
        }),
        createManagedCardRequest,
    )
})

const currencyOptions = computed(() => {
    return CurrencySelectConst.filter((item) => {
        return item.value === profileBaseCurrency.value
    })
})

const showNameOnCardField = computed(() => {
    return (
        !auth?.isConsumer ||
        (!!createManagedCardRequest.nameOnCard && createManagedCardRequest.nameOnCard.length > 27)
    )
})

useState(() => {
    if (auth?.isConsumer) {
        const _consumer = consumers?.consumerState.consumer as unknown as ConsumerModel
        createManagedCardRequest.nameOnCard = `${_consumer.rootUser.name} ${_consumer.rootUser.surname}`
        createManagedCardRequest.cardholderMobileNumber =
            _consumer.rootUser.mobile.countryCode + _consumer.rootUser.mobile.number
        createManagedCardRequest.profileId = useRuntimeConfig().public.profileId.consumers
    }

    createManagedCardRequest.currency = profileBaseCurrency.value as unknown as CurrencyEnum
})

const doAdd = async () => {
    if (localIsBusy.value) {
        return
    }

    if (isConsumer.value) {
        numberIsValid.value = true
    }

    if (numberIsValid.value === null) {
        numberIsValid.value = false
    }

    await validation.value.validate()
    if (validation.value.isInvalid.value || !numberIsValid.value) {
        return
    }

    localIsBusy.value = true

    const address = isConsumer.value
        ? (consumers?.consumerState.consumer?.rootUser.address as Address)
        : (corporates?.corporateState.corporate?.company.businessAddress as Address)

    Object.assign(createManagedCardRequest, {
        ...createManagedCardRequest,
        profileId: cardJurisdictionProfileId.value,
        billingAddress: address,
    })

    await cards
        ?.addCard(createManagedCardRequest as CreateManagedCard)
        .then(() => {
            router.push('/managed-cards')
        })
        .catch((err) => {
            if (err.response.status) {
                showError.value = true
            }
        })

    localIsBusy.value = false
}

const phoneUpdate = (number) => {
    mobile.value.number = number.phoneNumber
    mobile.value.countryCode = number.countryCallingCode
    createManagedCardRequest.cardholderMobileNumber =
        '+' + number.countryCallingCode + number.phoneNumber
    if (number.phoneNumber) {
        numberIsValid.value = number.isValid
    }
}
</script>
