<template>
    <section>
        <b-container>
            <b-row align-h="center">
                <b-col lg="4" md="9">
                    <b-card v-if="base.unRefs.isCorporate" class="border-0">
                        <b-card-title class="mb-5 text-center font-weight-lighter">
                            Select Account Currency
                        </b-card-title>
                        <b-form @submit.prevent="doAdd">
                            <b-form-row>
                                <b-col>
                                    <b-form-group
                                        :state="
                                            validation.isInvalid(
                                                $v.createManagedAccountRequest.currency
                                            )
                                        "
                                        label="Currency"
                                    >
                                        <b-form-select
                                            v-model="createManagedAccountRequest.currency"
                                            :options="currencyOptions"
                                        />
                                    </b-form-group>
                                </b-col>
                            </b-form-row>
                            <loader-button
                                :is-loading="localIsBusy"
                                button-text="finish"
                                class="mt-5 text-center"
                            />
                        </b-form>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>
<script lang="ts">
import { Component, Watch } from 'nuxt-property-decorator'
import { maxLength, required } from 'vuelidate/lib/validators'
import Vue from 'vue'
import { CreateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/CreateManagedAccountRequest'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { CurrencySelectConst } from '~/plugins/weavr-multi/api/models/common/consts/CurrencySelectConst'
import { useBase } from '~/composables/useBase'
import { useAccounts } from '~/composables/useAccounts'
import { useValidation } from '~/composables/useValidation'

@Component({
    components: {
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/LoaderButton.vue'),
    },
    validations: {
        createManagedAccountRequest: {
            friendlyName: {
                required,
                maxLength: maxLength(50),
            },
            currency: {
                required,
            },
        },
    },
    middleware: ['kyVerified'],
})
export default class AddAccountPage extends Vue {
    base = useBase(this)
    accounts = useAccounts(this)
    validation = useValidation()

    localIsBusy: boolean = false

    createManagedAccountRequest: CreateManagedAccountRequest = {
        profileId: '',
        friendlyName: 'Main Account',
        currency: CurrencyEnum.EUR,
    }

    get currencyOptions() {
        return CurrencySelectConst.filter((item) => {
            return item.value === this.base.unRefs.profileBaseCurrency
        })
    }

    async fetch() {
        await this.base.stores.accounts
            .index({
                profileId: this.base.unRefs.accountProfileId,
                state: ManagedInstrumentStateEnum.ACTIVE,
                offset: '0',
            })
            .then(async (res) => {
                if (parseInt(res.data.count!) < 1) {
                    if (this.base.unRefs.isConsumer) {
                        await this.base.stores.accounts
                            .create(this.createManagedAccountRequest)
                            .then(async (res) => {
                                await this.base.stores.accounts.upgradeIban(res.data.id)
                                return this.accounts.goToManagedAccountIndex()
                            })
                            .catch((err) => {
                                const data = err.response.data
                                const error = data.message ? data.message : data.errorCode

                                this.base.showErrorToast(error)
                                this.accounts.goToManagedAccountIndex()
                            })
                    }
                } else {
                    return this.accounts.goToManagedAccountIndex()
                }
            })
    }

    async doAdd() {
        if (this.$v.createManagedAccountRequest) {
            this.$v.createManagedAccountRequest.$touch()
            if (this.$v.createManagedAccountRequest.$anyError) {
                return
            }
        }

        this.localIsBusy = true

        await this.base.stores.accounts
            .create(this.createManagedAccountRequest)
            .then(async (res) => {
                await this.base.stores.accounts.upgradeIban(res.data.id)
                return this.accounts.goToManagedAccountIndex()
            })
            .catch((err) => {
                const data = err.response.data
                const error = data.message ? data.message : data.errorCode

                this.base.showErrorToast(error)
            })

        this.localIsBusy = false
    }

    @Watch('isConsumer', { immediate: true })
    updateProfileId() {
        this.createManagedAccountRequest.profileId = this.base.unRefs.accountProfileId
    }
}
</script>
