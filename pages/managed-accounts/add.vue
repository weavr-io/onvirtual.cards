<template>
    <section>
        <b-container>
            <b-row align-h="center">
                <b-col lg="4" md="9">
                    <b-card v-if="isCorporate" class="border-0">
                        <b-card-title class="mb-5 text-center font-weight-lighter">
                            Select Account Currency
                        </b-card-title>
                        <b-form @submit.prevent="doAdd">
                            <b-form-row>
                                <b-col>
                                    <b-form-group
                                        :state="validation.getState('currency')"
                                        label="Currency"
                                    >
                                        <b-form-select
                                            v-model="createManagedAccountRequest.currency"
                                            :options="currencyOptions"
                                        />
                                    </b-form-group>
                                </b-col>
                            </b-form-row>
                            <LoaderButton
                                :is-loading="localIsBusy"
                                class="mt-5 text-center"
                                text="finish"
                            />
                        </b-form>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>
<script lang="ts">
import { reactive } from 'vue'
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { CurrencySelectConst } from '~/plugins/weavr-multi/api/models/common/consts/CurrencySelectConst'
import {
    type ManagedAccount,
    ManagedAccountSchema,
    INITIAL_MA_REQUEST,
} from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/CreateManagedAccountRequest'
import BaseMixin from '~/mixins/BaseMixin'
import AccountsMixin from '~/mixins/AccountsMixin'
import ValidationMixin from '~/mixins/ValidationMixin'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    components: {
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/atoms/LoaderButton.vue'),
    },
    middleware: ['kyVerified'],
})
export default class AddAccountPage extends mixins(BaseMixin, AccountsMixin, ValidationMixin) {
    localIsBusy = false
    createManagedAccountRequest: ManagedAccount = reactive(INITIAL_MA_REQUEST)

    get validation() {
        return useZodValidation(ManagedAccountSchema, this.createManagedAccountRequest)
    }

    get currencyOptions() {
        return CurrencySelectConst.filter((item) => {
            return item.value === this.profileBaseCurrency
        })
    }

    async fetch() {
        await this.accountsStore
            .index({
                profileId: this.accountJurisdictionProfileId,
                state: ManagedInstrumentStateEnum.ACTIVE,
                offset: '0',
            })
            .then(async (res) => {
                if (parseInt(res.data.count!) < 1) {
                    if (this.isConsumer) {
                        await this.accountsStore
                            .create(this.createManagedAccountRequest)
                            .then(async (res) => {
                                await this.accountsStore.upgradeIban(res.data.id)
                                return this.goToManagedAccountIndex()
                            })
                            .catch((err) => {
                                const data = err.response.data
                                const error = data.message ? data.message : data.errorCode

                                this.showErrorToast(error)
                                this.goToManagedAccountIndex()
                            })
                    }
                } else {
                    return this.goToManagedAccountIndex()
                }
            })
    }

    async doAdd() {
        await this.validation.validate()

        if (this.validation.isInvalid.value) return

        this.localIsBusy = true

        await this.accountsStore
            .create(this.createManagedAccountRequest)
            .then(async (res) => {
                await this.accountsStore.upgradeIban(res.data.id)
                return this.goToManagedAccountIndex()
            })
            .catch((err) => {
                const data = err.response.data
                const error = data.message ? data.message : data.errorCode

                this.showErrorToast(error)
            })

        this.localIsBusy = false
    }

    @Watch('isConsumer', { immediate: true })
    updateProfileId() {
        this.createManagedAccountRequest.profileId = this.accountJurisdictionProfileId
    }
}
</script>
