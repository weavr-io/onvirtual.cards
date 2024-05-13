<template>
    <b-form @submit.prevent="submitForm">
        <b-row>
            <b-col>
                <h2 class="text-center font-weight-lighter">Choose account to top up from</h2>
            </b-col>
        </b-row>
        <b-row class="py-5 my-5">
            <b-col>
                <b-form-group :state="validation.getState('id')" class="weavr-account-radio">
                    <b-form-radio-group
                        v-model="source.id"
                        :options="formattedAccounts"
                        name="source-account-options"
                        stacked
                    />
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="text-center">
                <b-button type="submit" variant="secondary">
                    next
                    <span class="pl-5">-></span>
                </b-button>
            </b-col>
        </b-row>
    </b-form>
</template>
<script lang="ts">
import { reactive } from 'vue'
import { Emit, mixins } from 'nuxt-property-decorator'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import {
    INITIAL_INSTRUMENT_ID,
    type InstrumentID,
    InstrumentIDSchema,
} from '~/plugins/weavr-multi/api/models/common/models/InstrumentIdModel'
import BaseMixin from '~/mixins/BaseMixin'
import ValidationMixin from '~/mixins/ValidationMixin'
import useZodValidation from '~/composables/useZodValidation'

export default class AccountSelectionForm extends mixins(BaseMixin, ValidationMixin) {
    source: InstrumentID = reactive(INITIAL_INSTRUMENT_ID())

    get validation() {
        return useZodValidation(InstrumentIDSchema, this.source)
    }

    get accounts() {
        return this.accountsStore.accountState.accounts
    }

    get formattedAccounts(): { value: string; text: string; html: string }[] {
        if (!this.accounts?.accounts) {
            return []
        }

        const _accounts = this.accounts.accounts.filter((account) => {
            return account.state.state === ManagedInstrumentStateEnum.ACTIVE
        })

        return _accounts.map((account) => {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: account.currency,
                minimumFractionDigits: 2,
                currencyDisplay: 'symbol',
            })

            let _availableBalance = 0
            if (account.balances.availableBalance) {
                _availableBalance = account.balances.availableBalance / 100
            }

            const isDisabled = _availableBalance < 10

            let disabledP = ''
            if (isDisabled) {
                disabledP = '<em class="m-0 text-danger">Not enough funds.</em>'
            }

            return {
                value: account.id,
                text: account.friendlyName,
                html:
                    '<div class="row w-100">' +
                    '<div class="col col-6 account-name"><p class="m-0">' +
                    account.friendlyName +
                    '</p>' +
                    disabledP +
                    '</div>' +
                    '<div class="col col-6 account-balance text-right">' +
                    formatter.format(_availableBalance) +
                    '</div>' +
                    '</div>',
                disabled: isDisabled,
            }
        })
    }

    @Emit()
    async submitForm() {
        await this.validation.validate()

        if (this.validation.isInvalid.value) {
            this.showErrorToast('Please select an account to top up from.')
            return null
        }

        return this.source
    }
}
</script>
