<template>
  <b-row align-v="center">
    <b-col cols="1">
      <div class="transaction-type-icon">
        <div class="transaction increase">
          <transfer-icon />
        </div>
      </div>
    </b-col>
    <b-col>
      <div class="transaction-type">
        <div class="transaction">
          <template v-if="isOut">To {{ destination }}</template>
          <template v-if="isIn">From {{ source }}</template>
        </div>
      </div>
      <div class="text-muted">Personal Transfer</div>
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
    TransferIcon: () => import('~/assets/svg/statement/transfer.svg?inline')
  }
})
export default class StatementItemAdditionalField extends Vue {
  @Prop()
  readonly transaction!: ManagedAccountsSchemas.ManagedAccountStatementEntry

  get source() {
    return this.transaction.additionalFields?.sourceInstrumentFriendlyName
  }

  get destination() {
    return this.transaction.additionalFields?.destinationInstrumentFriendlyName
  }

  get isOut() {
    return this.destination !== undefined
  }

  get isIn() {
    return this.source !== undefined
  }
}
</script>
