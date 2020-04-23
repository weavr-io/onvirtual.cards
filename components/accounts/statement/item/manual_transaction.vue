<template>
  <b-row align-v="center">
    <b-col cols="1">
      <div class="transaction-type-icon">
        <div class="transaction increase">
          <manual-transaction-icon />
        </div>
      </div>
    </b-col>
    <b-col>
      <div class="transaction-type">
        <div class="transaction">
          From OnVirtual.Cards
        </div>
      </div>
<!--      <div class="text-muted">Transfer</div>-->
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
    ManualTransactionIcon: () => import('~/assets/svg/statement/manual_transaction.svg?inline')
  }
})
export default class StatementItemAdditionalField extends Vue {
  @Prop()
  readonly transaction!: ManagedAccountsSchemas.ManagedAccountStatementEntry

}
</script>
