<template>
    <b-col lg="6" md="9">
        <div class="mb-5">
            <b-card class="overflow-hidden" no-body>
                <b-card-body class="px-4 mx-3 py-5 p-md-card">
                    <div class="form-screens">
                        <error-alert />
                        <div class="form-screen">
                            <b-form novalidate @submit="submitForm">
                                <h3 class="text-center font-weight-light mb-5">
                                    Your address details
                                </h3>
                                <b-form-group
                                    :invalid-feedback="
                                        invalidFeedback(
                                            $v.address.addressLine1,
                                            validateVParams(
                                                $v.address.addressLine1.$params,
                                                $v.address.addressLine1,
                                            ),
                                        )
                                    "
                                    :state="isInvalid($v.address.addressLine1)"
                                    label="Address Line 1*"
                                >
                                    <b-form-input
                                        v-model="address.addressLine1"
                                        placeholder="Address Line 1"
                                    />
                                </b-form-group>
                                <b-form-group label="Address Line 2">
                                    <b-form-input
                                        v-model="address.addressLine2"
                                        placeholder="Address Line 2"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        invalidFeedback(
                                            $v.address.city,
                                            validateVParams(
                                                $v.address.city.$params,
                                                $v.address.city,
                                            ),
                                        )
                                    "
                                    :state="isInvalid($v.address.city)"
                                    label="City*"
                                >
                                    <b-form-input v-model="address.city" placeholder="City" />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        invalidFeedback(
                                            $v.address.country,
                                            validateVParams(
                                                $v.address.country.$params,
                                                $v.address.country,
                                            ),
                                        )
                                    "
                                    :state="isInvalid($v.address.country)"
                                    label="Country*"
                                >
                                    <b-form-select
                                        v-model="address.country"
                                        :options="countryOptionsWithDefault"
                                        placeholder="Registration Country"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :invalid-feedback="
                                        invalidFeedback(
                                            $v.address.postCode,
                                            validateVParams(
                                                $v.address.postCode.$params,
                                                $v.address.postCode,
                                            ),
                                        )
                                    "
                                    :state="isInvalid($v.address.postCode)"
                                    label="Post Code*"
                                >
                                    <b-form-input
                                        v-model="address.postCode"
                                        placeholder="Post Code"
                                    />
                                </b-form-group>
                                <b-form-group label="State">
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
import { Component, mixins } from 'nuxt-property-decorator'
import { maxLength, required } from 'vuelidate/lib/validators'
import BaseMixin from '~/mixins/BaseMixin'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { LegalAddressModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/LegalAddressModel'
import { SourceOfFundsSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/SourceOfFundsSelectConst'
import { IndustryTypeSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/IndustryTypeSelectConst'
import { CorporatesRootUserModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporatesRootUserModel'
import { ConsumersRootUserModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumersRootUserModel'
import ValidationMixin from '~/mixins/ValidationMixin'
import { Nullable } from '~/global'
// @TODO[OLEG] - REFACTOR TO ZOD

@Component({
    layout: 'auth',
    validations: {
        address: {
            addressLine1: {
                required,
            },
            city: { required },
            postCode: { required },
            country: {
                required,
                maxLength: maxLength(2),
            },
        },
    },
    components: {
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/atoms/LoaderButton.vue'),
        RegistrationNav: () => import('~/components/molecules/registration/RegistrationNav.vue'),
    },
    middleware: ['authRouteGuard'],
})
export default class ConsumerAddressPage extends mixins(BaseMixin, ValidationMixin) {
    address: Nullable<AddressModel | LegalAddressModel> = {
        addressLine1: null,
        addressLine2: null,
        city: null,
        postCode: null,
        state: null,
        country: null,
    }

    isLoading = false

    get country() {
        return this.address.country !== undefined ? this.address.country : null
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
            if (Object.keys(this.consumer.rootUser.address as AddressModel).length !== 0) {
                this.address = { ...this.consumer.rootUser.address! }
            }
        } else if (this.isCorporate && this.corporate) {
            if (
                Object.keys(this.corporate.company.registeredAddress as LegalAddressModel)
                    .length !== 0
            ) {
                // treat as corporate
                this.address = { ...this.corporate.company.registeredAddress! }
            }
        }
    }

    submitForm(e) {
        e.preventDefault()

        this.$v.$touch()

        if (this.$v.$invalid) {
            return
        }

        if (this.$v.$anyDirty) {
            this.isLoading = true
            let xhr

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
        } else {
            this.addressUpdated()
        }
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
