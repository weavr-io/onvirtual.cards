<template>
    <section>
        <b-container>
            <b-row v-if="pendingDataOrError">
                <b-col>
                    <div class="d-flex flex-column align-items-center">
                        <div class="loader-spinner">
                            <b-spinner />
                        </div>
                    </div>
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
                                                invalidFeedback(
                                                    $v.createManagedCardRequest.nameOnCard,
                                                    validateVParams(
                                                        $v.createManagedCardRequest.nameOnCard
                                                            .$params,
                                                        $v.createManagedCardRequest.nameOnCard,
                                                    ),
                                                    'Name is required and should not exceed 27 characters.',
                                                )
                                            "
                                            :state="
                                                isInvalid($v.createManagedCardRequest.nameOnCard)
                                            "
                                            label="Name of Person using Card"
                                        >
                                            <b-form-input
                                                v-model="
                                                    $v.createManagedCardRequest.nameOnCard.$model
                                                "
                                                :state="
                                                    isInvalid(
                                                        $v.createManagedCardRequest.nameOnCard,
                                                    )
                                                "
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
                                            :state="isInvalid($v.createManagedCardRequest.currency)"
                                            label="Currency"
                                        >
                                            <b-form-select
                                                v-model="
                                                    $v.createManagedCardRequest.currency.$model
                                                "
                                                :options="currencyOptions"
                                            />
                                        </b-form-group>
                                    </b-col>
                                </b-form-row>
                                <b-form-row>
                                    <b-col>
                                        <b-form-group
                                            :invalid-feedback="
                                                invalidFeedback(
                                                    $v.createManagedCardRequest.friendlyName,
                                                    validateVParams(
                                                        $v.createManagedCardRequest.friendlyName
                                                            .$params,
                                                        $v.createManagedCardRequest.friendlyName,
                                                    ),
                                                )
                                            "
                                            :state="
                                                isInvalid($v.createManagedCardRequest.friendlyName)
                                            "
                                            label="ADD A CUSTOM CARD NAME"
                                        >
                                            <b-form-input
                                                v-model="
                                                    $v.createManagedCardRequest.friendlyName.$model
                                                "
                                                placeholder="eg. travel expenses"
                                            />
                                        </b-form-group>
                                    </b-col>
                                </b-form-row>
                                <loader-button
                                    :disabled="$v.$invalid || numberIsValid === false"
                                    :is-loading="localIsBusy"
                                    button-text="next"
                                    class="mt-5 text-center"
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
import { Component, mixins } from 'nuxt-property-decorator'
import { maxLength, required } from 'vuelidate/lib/validators'
import BaseMixin from '~/mixins/BaseMixin'
import { CreateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/CreateManagedCardRequest'
import { ManagedCardModeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardModeEnum'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import ValidationMixin from '~/mixins/ValidationMixin'
import { Nullable } from '~/global'
import { CurrencySelectConst } from '~/plugins/weavr-multi/api/models/common/consts/CurrencySelectConst'

@Component({
    components: {
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/LoaderButton.vue'),
    },
    validations: {
        createManagedCardRequest: {
            friendlyName: {
                required,
                maxLength: maxLength(50),
            },
            currency: {
                required,
            },
            nameOnCard: {
                required,
                maxLength: maxLength(27),
            },
        },
    },
    middleware: ['kyVerified'],
})
export default class AddCardPage extends mixins(BaseMixin, ValidationMixin) {
    showNameOnCardField = false

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

    createManagedCardRequest: Nullable<CreateManagedCardRequest> = {
        profileId: null,
        friendlyName: null,
        currency: null,
        nameOnCard: null,
        cardholderMobileNumber: null,
        billingAddress: null,
        mode: ManagedCardModeEnum.PREPAID_MODE,
    }

    get currencyOptions() {
        return CurrencySelectConst.filter((item) => {
            return item.value === this.profileBaseCurrency
        })
    }

    fetch() {
        if (this.authStore.isConsumer) {
            const _consumer: ConsumerModel = this.consumersStore.consumerState
                .consumer as ConsumerModel
            this.createManagedCardRequest.nameOnCard =
                _consumer.rootUser.name + ' ' + _consumer.rootUser.surname
            this.createManagedCardRequest.cardholderMobileNumber =
                _consumer.rootUser.mobile.countryCode + _consumer.rootUser.mobile.number
        }

        this.showNameOnCardField =
            !this.authStore.isConsumer ||
            (!!this.createManagedCardRequest.nameOnCard &&
                this.createManagedCardRequest.nameOnCard.length > 27)

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

        this.$v.$touch()
        if (this.$v.$invalid || !this.numberIsValid) {
            return
        }

        this.localIsBusy = true

        this.createManagedCardRequest = {
            ...this.createManagedCardRequest,
            profileId: this.cardJurisdictionProfileId,
            billingAddress: {
                ...(this.isConsumer
                    ? (this.consumersStore.consumerState.consumer?.rootUser.address as AddressModel)
                    : (this.corporatesStore.corporateState.corporate?.company
                          .businessAddress as AddressModel)),
            },
        }

        await this.cardStore
            .addCard(this.createManagedCardRequest as CreateManagedCardRequest)
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
