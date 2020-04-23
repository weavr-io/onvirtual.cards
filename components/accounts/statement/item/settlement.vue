<template>
  <b-row align-v="center">
    <b-col cols="1">
      <div class="transaction-type-icon">
        <div class="transaction increase">
          <img src="~/assets/svg/statement/settlement.svg" alt="">
        </div>
      </div>
    </b-col>
    <b-col>
      <div class="transaction-type">
        <div class="transaction">
          {{ transaction.additionalFields.merchantName }}
        </div>
      </div>
      <div class="text-muted">
        <span class="mr-2">Purchase, </span>
        <span v-if="transaction.additionalFields.merchantTerminalCountry" class="mr-2">{{ transaction.additionalFields.merchantTerminalCountry }}</span>
        <span v-if="transaction.sourceAmount">
          {{ 100 | weavr_currency(transaction.transactionAmount.currency) }} =
          {{ transaction.sourceAmount.currency | weavr_currency_symbol }}{{ transaction.additionalFields.exchangeRate }}
        </span>
      </div>
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
  }
})
export default class StatementItemAdditionalField extends Vue {
  @Prop()
  readonly transaction!: ManagedAccountsSchemas.ManagedAccountStatementEntry
}
</script>
