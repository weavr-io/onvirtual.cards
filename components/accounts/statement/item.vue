<template>
  <div>
    <b-row class="mt-4 mb-3">
      <b-col class="text-muted">
        {{
          transaction.processedTimestamp
            | milli_to_moment
            | moment('from', 'now')
        }}
      </b-col>
    </b-row>
    <b-row class="mb-3" align-v="center">
      <b-col cols="1">
        <div class="transaction-type-icon">
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
            <template v-if="transaction.txId.type === 'transfers'">
              <template v-if="isIncrease">
                Account Load
              </template>
              <template v-if="isDecrease">
                Account Unload
              </template>
            </template>
            <template v-else-if="transaction.txId.type === 'settlements'">
              Deposit
            </template>
            <template v-else>
              {{ transaction.txId.type }}
            </template>
          </div>
        </div>
        <!-- <div class="transaction-from text-muted">From:</div> -->
      </b-col>
      <b-col class="text-right">
        {{ transaction.adjustment | weavr_currency(transaction.currency) }}
      </b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

@Component({})
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
