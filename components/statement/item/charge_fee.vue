<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction increase">
                    <img src="~/assets/svg/statement/withdrawal.svg" alt="" />
                </div>
            </div>
        </b-col>
        <b-col>
            <div class="transaction-type">
                <div class="transaction text-capitalize">
                    {{ chargeFeeType }}
                </div>
            </div>
            <div class="text-muted">
                <b-row>
                    <b-col>
                        <span v-if="transaction.sourceAmount">
                            {{ getCurrency(100, transaction.transactionAmount.currency) }} =
                            {{ getCurrencySymbol(transaction.sourceAmount.currency)
                            }}{{ transaction.additionalFields.exchangeRate }}
                        </span>
                    </b-col>
                    <b-col class="text-right">
                        <card-fee :transaction="transaction" />
                    </b-col>
                </b-row>
            </div>
        </b-col>
        <b-col class="text-right" cols="3" xl="2">
            <amount :transaction="transaction" />
        </b-col>
    </b-row>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { weavrCurrency, weavrCurrencySymbol } from '~/utils/helper'

@Component({
    components: {
        Amount: () => import('~/components/statement/item/common/amount.vue'),
        CardFee: () => import('~/components/statement/item/common/cardFee.vue'),
    },
})
export default class StatementItemAdditionalField extends Vue {
    @Prop()
    readonly transaction!: StatementEntryModel

    get chargeFeeType(): string | undefined {
        return this.transaction.additionalFields?.chargeFeeType.split('_').join(' ').toLowerCase()
    }

    getCurrencySymbol(val: string) {
        return weavrCurrencySymbol(val)
    }

    getCurrency(balance: number, currency: string) {
        return weavrCurrency(balance, currency)
    }
}
</script>
