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
      <amount :transaction="transaction" />
    </b-col>
  </b-row>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { StatementEntry } from '~/api/Models/Statements/StatementEntry'

@Component({
  components: {
    Amount: () => import('~/components/statement/item/common/amount.vue')
  }
})
export default class StatementItemAdditionalField extends Vue {
  @Prop()
  readonly transaction!: StatementEntry
}
</script>
