<template>
    <b-row align-v="center" class="text-muted">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction">
                    <img src="~/assets/svg/statement/authorisation.svg" alt="" />
                </div>
            </div>
        </b-col>
        <b-col>
            <div class="transaction-type">
                <div class="transaction">
                    {{ transaction.additionalFields.merchantName }}
                </div>
            </div>
            <b-row class="text-muted">
                <b-col>
                    <b-badge v-if="isPending" variant="grey-light" class="text-muted mr-2"
                        >Pending</b-badge
                    >
                    <span class="mr-2">Purchase</span>
                    <span
                        v-if="transaction.additionalFields.merchantTerminalCountry"
                        class="mr-2"
                        >{{ transaction.additionalFields.merchantTerminalCountry }}</span
                    >
                    <span v-if="transaction.sourceAmount"
                        >{{ currency }} = {{ currencySymbol
                        }}{{ transaction.additionalFields.exchangeRate }}</span
                    >
                </b-col>
                <b-col class="text-right">
                    <card-fee :transaction="transaction" />
                </b-col>
            </b-row>
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

    get isPending(): boolean {
        return this.transaction.additionalFields?.authorisationState !== 'COMPLETED'
    }

    get currencySymbol() {
        return weavrCurrencySymbol(this.transaction.sourceAmount.currency)
    }

    get currency() {
        return weavrCurrency(100, this.transaction.transactionAmount.currency)
    }
}
</script>
