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
                        <b-card-title class="mb-5 text-center font-weight-lighter">
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
                                            <vue-phone-number-input
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
<script lang="ts">
import { reactive } from 'vue'
import { Component, mixins } from 'nuxt-property-decorator'
import {
    CreateManagedCard,
    CreateManagedCardSchema,
    INITIAL_MANAGED_CARD_REQUEST,
} from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/CreateManagedCard'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { Address } from '~/plugins/weavr-multi/api/models/common/models/Address'
import { CurrencySelectConst } from '~/plugins/weavr-multi/api/models/common/consts/CurrencySelectConst'
import BaseMixin from '~/mixins/BaseMixin'

import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
import useZodValidation from '~/composables/useZodValidation'

// Continue

@Component({
    components: {
        LoadingSpinner,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/atoms/LoaderButton.vue'),
    },
    middleware: ['kyVerified'],
})
export default class AddCardPage extends mixins(BaseMixin) {
    showError = false

    localIsBusy = false

    mobile: {
        countryCode: string
        number: string
    } = {
        countryCode: '',
        number: '',
    }

    numberIsValid: boolean | null = null

    createManagedCardRequest: CreateManagedCard = reactive(INITIAL_MANAGED_CARD_REQUEST())

    get validation() {
        return useZodValidation(
            CreateManagedCardSchema.pick({
                friendlyName: true,
                currency: true,
                nameOnCard: true,
            }),
            this.createManagedCardRequest,
        )
    }

    get currencyOptions() {
        return CurrencySelectConst.filter((item) => {
            return item.value === this.profileBaseCurrency
        })
    }

    get showNameOnCardField() {
        return (
            !this.authStore.isConsumer ||
            (!!this.createManagedCardRequest.nameOnCard &&
                this.createManagedCardRequest.nameOnCard.length > 27)
        )
    }

    fetch() {
        if (this.authStore.isConsumer) {
            const _consumer = this.consumersStore.consumerState.consumer as unknown as ConsumerModel
            this.createManagedCardRequest.nameOnCard = `${_consumer.rootUser.name} ${_consumer.rootUser.surname}`
            this.createManagedCardRequest.cardholderMobileNumber =
                _consumer.rootUser.mobile.countryCode + _consumer.rootUser.mobile.number
            this.createManagedCardRequest.profileId = this.$config.profileId.consumers
        }

        this.createManagedCardRequest.currency = this.profileBaseCurrency
    }

    async doAdd() {
        if (this.localIsBusy) {
            return
        }

        if (this.isConsumer) {
            this.numberIsValid = true
        }

        if (this.numberIsValid === null) {
            this.numberIsValid = false
        }

        await this.validation.validate()
        if (this.validation.isInvalid.value || !this.numberIsValid) {
            return
        }

        this.localIsBusy = true

        Object.assign(this.createManagedCardRequest, {
            ...this.createManagedCardRequest,
            profileId: this.cardJurisdictionProfileId,
            billingAddress: {
                ...(this.isConsumer
                    ? (this.consumersStore.consumerState.consumer?.rootUser.address as Address)
                    : (this.corporatesStore.corporateState.corporate?.company
                          .businessAddress as Address)),
            },
        })

        await this.cardsStore
            .addCard(this.createManagedCardRequest as CreateManagedCard)
            .then(() => {
                this.$router.push('/managed-cards')
            })
            .catch((err) => {
                if (err.response.status) {
                    this.showError = true
                }
            })

        this.localIsBusy = false
    }

    phoneUpdate(number) {
        this.mobile.number = number.phoneNumber
        this.mobile.countryCode = number.countryCallingCode
        this.createManagedCardRequest.cardholderMobileNumber =
            '+' + number.countryCallingCode + number.phoneNumber
        this.numberIsValid = number.isValid
    }
}
</script>
