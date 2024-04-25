<template>
    <div>
        {{ getCurrency(transaction.transactionAmount) }}
        <div v-if="transaction.sourceAmount" class="text-muted">
            {{ getCurrencyWithOp(transaction.sourceAmount) }}
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { CurrencyAmountModel } from '~/plugins/weavr-multi/api/models/common/CurrencyAmountModel'
import { weavrCurrency, weavrCurrencyWithOperator } from '~/utils/helper'

@Component({ components: {} })
export default class StatementItemAdditionalField extends Vue {
    @Prop()
    readonly transaction!: StatementEntryModel

    getCurrency(amount: CurrencyAmountModel) {
        return weavrCurrency(amount)
    }

    getCurrencyWithOp(amount: CurrencyAmountModel) {
        return weavrCurrencyWithOperator(amount)
    }
}
</script>
