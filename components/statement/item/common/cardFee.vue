<template>
  <span v-if="transaction.cardholderFee.amount > 0">Fee + {{ transaction.cardholderFee | weavr_currency }}</span>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

@Component({ components: {} })
export default class StatementItemCardHolderFee extends Vue {
  @Prop()
  readonly transaction!: StatementEntryModel
}
</script>
