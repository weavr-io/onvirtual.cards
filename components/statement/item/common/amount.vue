<template>
  <div>
    {{ transaction.transactionAmount | weavr_currency }}
    <div v-if="transaction.sourceAmount" class="text-muted">
      {{ transaction.sourceAmount | weavr_currency_with_operator }}
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

@Component({ components: {} })
export default class StatementItemAdditionalField extends Vue {
  @Prop()
  readonly transaction!: StatementEntryModel
}
</script>
