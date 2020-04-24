<template>
  <div>
    {{ transaction.transactionAmount | weavr_currency_with_operator }}
    <div v-if="transaction.sourceAmount" class="text-muted">
      {{ transaction.sourceAmount | weavr_currency_with_operator }}
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { StatementEntry } from '~/api/Models/Statements/StatementEntry'

@Component({ components: {} })
export default class StatementItemAdditionalField extends Vue {
  @Prop()
  readonly transaction!: StatementEntry
}
</script>
