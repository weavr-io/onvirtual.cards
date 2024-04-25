<template>
    <span v-if="transaction.cardholderFee?.amount"
        >Fee + {{ getCurrency(transaction.cardholderFee!) }}</span
    >
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { CurrencyAmountModel } from '~/plugins/weavr-multi/api/models/common/CurrencyAmountModel'
import { weavrCurrency } from '~/utils/helper'

@Component({ components: {} })
export default class StatementItemCardHolderFee extends Vue {
    @Prop()
    readonly transaction!: StatementEntryModel

    getCurrency(amount: CurrencyAmountModel) {
        return weavrCurrency(amount)
    }
}
</script>
