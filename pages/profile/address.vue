<template>
    <b-col lg="6" md="9">
        <div class="mb-5">
            <b-card class="overflow-hidden" no-body>
                <b-card-body class="px-4 mx-3 py-5 p-md-card">
                    <div class="form-screens">
                        <error-alert />
                        <div class="form-screen">
                            <b-form novalidate @submit.prevent="submitForm">
                                <h3 class="text-center font-weight-light mb-5">
                                    Your address details
                                </h3>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('addressLine1')
                                    "
                                    :state="validation.getState('addressLine1')"
                                    label="Address Line 1*"
                                >
                                    <b-form-input
                                        v-model="address.addressLine1"
                                        placeholder="Address Line 1"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        validation.getInvalidFeedback('addressLine2')
                                    "
                                    :state="validation.getState('addressLine2')"
                                    label="Address Line 2"
                                >
                                    <b-form-input
                                        v-model="address.addressLine2"
                                        placeholder="Address Line 2"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('city')"
                                    :state="validation.getState('city')"
                                    label="City*"
                                >
                                    <b-form-input v-model="address.city" placeholder="City" />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('country')"
                                    :state="validation.getState('country')"
                                    label="Country*"
                                >
                                    <b-form-select
                                        v-model="address.country"
                                        :options="countryOptionsWithDefault"
                                        placeholder="Registration Country"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('postCode')"
                                    :state="validation.getState('postCode')"
                                    label="Post Code*"
                                >
                                    <b-form-input
                                        v-model="address.postCode"
                                        placeholder="Post Code"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="validation.getInvalidFeedback('state')"
                                    :state="validation.getState('state')"
                                    label="State"
                                >
                                    <b-form-input v-model="address.state" placeholder="State" />
                                </b-form-group>
                                <b-row align-v="center" class="mt-4">
                                    <b-col class="text-center">
                                        <LoaderButton :is-loading="isLoading" text="continue" />
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
import { reactive } from 'vue'
import { Component, mixins } from 'nuxt-property-decorator'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/models/AddressModel'
import { SourceOfFundsSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/SourceOfFundsSelectConst'
import { IndustryTypeSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/IndustryTypeSelectConst'
import { CorporatesRootUserModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporatesRootUserModel'
import { ConsumersRootUserModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumersRootUserModel'
import {
    type AddressType,
    AddressSchema,
    INITIAL_ADDRESS,
} from '~/plugins/weavr-multi/api/models/common/models/AddressModel'
import BaseMixin from '~/mixins/BaseMixin'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    layout: 'auth',
    components: {
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/atoms/LoaderButton.vue'),
        RegistrationNav: () => import('~/components/molecules/registration/RegistrationNav.vue'),
    },
    middleware: ['authRouteGuard'],
})
export default class ConsumerAddressPage extends mixins(BaseMixin) {
    address: AddressType = reactive(INITIAL_ADDRESS)

    get validation() {
        return useZodValidation(AddressSchema, this.address)
    }

    isLoading = false

    get country() {
        return this.address?.country
    }

    set country(val) {
        this.$set(this.address, 'country', val)
    }

    get sourceOfFundsOptions() {
        return SourceOfFundsSelectConst
    }

    get industryOccupationOptions() {
        return IndustryTypeSelectConst
    }

    fetch() {
        if (this.isConsumer && this.consumer) {
            if (Object.keys(this.consumer.rootUser.address as AddressModel).length) {
                this.address = { ...this.consumer.rootUser.address! }
            }
        } else if (this.isCorporate && this.corporate) {
            if (Object.keys(this.corporate.company.registeredAddress as AddressModel).length) {
                // treat as corporate
                this.address = { ...this.corporate.company.registeredAddress! }
            }
        }
    }

    async submitForm() {
        await this.validation.validate()

        if (!this.validation.isInvalid) return null

        this.isLoading = true
        let xhr: Promise<unknown>

        if (this.isConsumer) {
            xhr = this.consumersStore.update({ address: this.address as AddressModel })
        } else {
            // treat as corporate
            xhr = this.corporatesStore.update({
                companyBusinessAddress: this.address as AddressModel,
            })
        }
        xhr.then(this.addressUpdated).finally(() => {
            this.isLoading = false
        })
    }

    async addressUpdated() {
        let identityRootVerified: CorporatesRootUserModel | ConsumersRootUserModel

        if (this.isConsumer) {
            await this.consumersStore.get().then((res) => {
                identityRootVerified = res.data.rootUser

                if (
                    identityRootVerified &&
                    !(identityRootVerified as ConsumersRootUserModel).emailVerified
                ) {
                    this.goToVerify()
                } else {
                    this.goToIndex()
                }
            })
        } else if (this.isCorporate) {
            await this.corporatesStore.get().then((res) => {
                identityRootVerified = res.data.rootUser

                if (
                    identityRootVerified &&
                    !(identityRootVerified as CorporatesRootUserModel).emailVerified
                ) {
                    this.goToVerify()
                } else {
                    this.goToIndex()
                }
            })
        }
    }
}
</script>
