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
          Manual Adjustment
        </div>
      </div>
      <div class="text-muted">
        <b-row>
          <b-col>
            {{ transaction.additionalFields.note }}
          </b-col>
          <b-col class="text-right">
            <card-fee :transaction="transaction" />
          </b-col>
        </b-row>
      </div>
    </b-col>
    <b-col class="text-right" cols="3" xl="2">
      <amount :transaction="transaction" />
    </b-col>
  </b-row>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { StatementEntry } from '~/api/Models/Statements/StatementEntry'

@Component({
  components: {
    ManualTransactionIcon: () => import('~/assets/svg/statement/manual_transaction.svg?inline'),
    Amount: () => import('~/components/statement/item/common/amount.vue'),
    CardFee: () => import('~/components/statement/item/common/cardFee.vue')
  }
})
export default class StatementItemAdditionalField extends Vue {
  @Prop()
  readonly transaction!: StatementEntry

}
</script>
