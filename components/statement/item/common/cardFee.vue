<template>
    <span>{{ `Fee + ${currency}` }}</span>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { weavrCurrency } from '~/utils/helper'

@Component({ components: {} })
export default class StatementItemCardHolderFee extends Vue {
    @Prop()
    readonly transaction!: StatementEntryModel

    get currency() {
        return weavrCurrency(this.transaction.cardholderFee)
    }
}
</script>
