<template>
  <b-row align-v="center">
    <b-col cols="1">
      <div class="transaction-type-icon">
        <div class="transaction increase">
          <img src="~/assets/svg/statement/refund.svg" alt="">
        </div>
      </div>
    </b-col>
    <b-col>
      <div class="transaction-type">
        <div class="transaction">
          {{ transaction.additionalFields.merchantName }}
        </div>
      </div>
      <div class="text-muted">Refund</div>
    </b-col>
    <b-col class="text-right">
      {{ transaction.transactionAmount | weavr_currency_with_operator }}
      <div class="text-muted" v-if="transaction.sourceAmount">
        {{ transaction.sourceAmount | weavr_currency_with_operator }}
      </div>
    </b-col>
  </b-row>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

@Component({
  components: {
    RefundIcon: () => import('~/assets/svg/statement/refund.svg?inline')
  }
})
export default class StatementItemAdditionalField extends Vue {
  @Prop()
  readonly transaction!: ManagedAccountsSchemas.ManagedAccountStatementEntry
}
</script>
