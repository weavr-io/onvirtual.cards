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
                            Update Card
                        </b-card-title>
                        <b-card-body>
                            <b-form @submit.prevent="doUpdate">
                                <b-form-row v-if="!isConsumer">
                                    <b-col>
                                        <b-form-group label="CARDHOLDER MOBILE NUMBER">
                                            <vue-phone-number-input
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
<script lang="ts">
import { reactive } from 'vue'
import { Component, mixins } from 'nuxt-property-decorator'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import {
    INITIAL_MC_UPDATE_REQUEST,
    ManagedCardUpdateSchema,
    type UpdateManagedCard,
    UpdateManagedCardRequest,
} from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpdateManagedCardRequest'
import BaseMixin from '~/mixins/BaseMixin'
import ValidationMixin from '~/mixins/ValidationMixin'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    components: {
        LoadingSpinner,
        LoaderButton,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    },
})
export default class EditCardPage extends mixins(BaseMixin, ValidationMixin) {
    numberIsValid: boolean | null = null
    mobile = {
        countryCode: 'GB',
        cardholderMobileNumber: '',
    }

    isUpdating = false
    updateManagedCardRequest: UpdateManagedCard = reactive(INITIAL_MC_UPDATE_REQUEST)

    get validation() {
        return useZodValidation(ManagedCardUpdateSchema, this.updateManagedCardRequest)
    }

    get isLoading() {
        return this.cardsStore.cardState.isLoading || this.isUpdating || this.$fetchState.pending
    }

    get auth() {
        return this.authStore.authState.auth
    }

    get cardId() {
        return this.$route.params.id
    }

    async fetch() {
        const card = await this.cardsStore.getManagedCard(this.cardId)
        const parsedNumber = parsePhoneNumberFromString(card.data.cardholderMobileNumber)

        // add key cardholderMobileNumber only if isCorporate
        this.updateManagedCardRequest = {
            friendlyName: card.data.friendlyName,
            ...(this.isCorporate && { cardholderMobileNumber: '' }),
        }

        this.mobile.countryCode = parsedNumber?.country || ''
        this.mobile.cardholderMobileNumber = parsedNumber?.nationalNumber.toString() || ''
    }

    async doUpdate() {
        if (this.isConsumer) {
            this.numberIsValid = true
        }

        if (this.numberIsValid === null) {
            this.numberIsValid = false
        }

        await this.validation.validate()
        if (this.validation.isInvalid || !this.numberIsValid) {
            return
        }

        this.isUpdating = true

        this.cardsStore
            .update({
                id: this.cardId,
                request: this.updateManagedCardRequest as UpdateManagedCardRequest,
            })
            .then(() => {
                this.showSuccessToast('Card name changed')
                this.$router.push('/managed-cards')
            })
            .finally(() => {
                this.isUpdating = false
            })
            .catch(() => {
                this.showErrorToast('Card name change error')
            })
    }

    phoneUpdate(number) {
        this.$set(
            this.mobile,
            'cardholderMobileNumber',
            number.formatNational ? number.formatNational : number.phoneNumber,
        )
        this.updateManagedCardRequest!.cardholderMobileNumber = number.formattedNumber
        this.numberIsValid = number.isValid

        this.validation.validate()
    }
}
</script>
