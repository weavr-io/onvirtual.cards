<template>
  <div>
    <b-row class="my-3" align-v="center">
      <b-col cols="1">
        <div class="transaction-type-icon" v-if="isIncrease || isDecrease">
          <div v-if="isIncrease" class="transaction increase">
            :up:
          </div>
          <div v-if="isDecrease" class="transaction decrease">
            :down:
          </div>
        </div>
      </b-col>
      <b-col>
        <div class="transaction-type">
          <div class="transaction text-capitalize">
            <template v-if="transaction.txId.type === 'TRANSFER'">
              <transfer :transaction="transaction" />
            </template>
            <template v-else-if="transaction.txId.type === 'SETTLEMENT'">
              Deposit
            </template>
            <template v-else-if="transaction.txId.type === 'AUTHORISATION'">
              Purchase (Pending)
            </template>
            <template v-else>
              {{ transaction.txId.type | weavr_lowercase }}
            </template>
          </div>
        </div>
        <div class="text-muted">
          <span>{{ transaction.processedTimestamp | milli_to_moment | moment('HH:mm') }}</span>
          <additional-field :value="transaction.additionalFields" />
        </div>
      </b-col>
      <b-col class="text-right">
        <span v-if="isIncrease">+</span>{{ transaction.adjustment | weavr_currency(transaction.currency) }}
      </b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

@Component({
  components: {
    AdditionalField: () => import('~/components/accounts/statement/additionalField.vue'),
    Transfer: () => import('~/components/accounts/statement/transfer.vue')
  }
})
export default class StatementItem extends Vue {
  @Prop({ default: '' })
  readonly transaction!: ManagedAccountsSchemas.ManagedAccountStatementEntry

  get isIncrease(): boolean {
    if (this.transaction.adjustment) {
      return this.transaction.adjustment > 0
    } else {
      return false
    }
  }

  get isDecrease(): boolean {
    if (this.transaction.adjustment) {
      return this.transaction.adjustment < 0
    } else {
      return false
    }
  }

  get transactionType(): string {
    return this.transaction.txId.type.replace('_', ' ')
  }
}
</script>
<style lang="scss" scoped>
.transaction-type-icon {
  background: #eaedf6;
  text-align: center;
  border-radius: 10px;
  font-size: 30px;
  color: #6d7490;
  font-weight: 100;
  padding: 5px;
}
</style>
