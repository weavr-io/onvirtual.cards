<template>
  <div>
    <template v-if="transaction.txId.type === 'AUTHORISATION'">
      <authorisation :transaction="transaction" class="my-3" />
    </template>
    <template v-else-if="transaction.txId.type === 'AUTHORISATION_REVERSAL'">
<!--      <authorisation-reversal :transaction="transaction" class="my-3" />-->
    </template>
    <template v-else-if="transaction.txId.type === 'MANUAL_TRANSACTION'">
      <manual-transaction :transaction="transaction" class="my-3" />
    </template>
    <template v-else-if="transaction.txId.type === 'MERCHANT_REFUND'">
      <merchant-refund :transaction="transaction" class="my-3" />
    </template>
    <template v-else-if="transaction.txId.type === 'SEND'">
      <send :transaction="transaction" class="my-3" />
    </template>
    <template v-else-if="transaction.txId.type === 'SETTLEMENT'">
      <settlement :transaction="transaction" class="my-3" />
    </template>
    <template v-else-if="transaction.txId.type === 'TRANSFER'">
      <transfer :transaction="transaction" class="my-3" />
    </template>
    <template v-else>
      <b-row class="my-3" align-v="center">
        <b-col cols="1" />
        <b-col>
          <div class="transaction-type">
            <div class="transaction">
              {{ transaction.txId.type }}
            </div>
          </div>
          <div class="text-muted">
            <span>{{ transaction.processedTimestamp | milli_to_moment | moment('HH:mm') }}</span>
            <additional-field :value="transaction.additionalFields" />
          </div>
        </b-col>
        <b-col class="text-right">
          {{ transaction.adjustment }}
        </b-col>
      </b-row>
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

@Component({
  components: {
    AdditionalField: () => import('~/components/accounts/statement/additionalField.vue'),
    Transfer: () => import('~/components/accounts/statement/item/transfer.vue'),
    Send: () => import('~/components/accounts/statement/item/send.vue'),
    MerchantRefund: () => import('~/components/accounts/statement/item/merchant_refund.vue'),
    ManualTransaction: () => import('~/components/accounts/statement/item/manual_transaction.vue'),
    Authorisation: () => import('~/components/accounts/statement/item/authorisation.vue'),
    Settlement: () => import('~/components/accounts/statement/item/settlement.vue'),
    AuthorisationReversal: () => import('~/components/accounts/statement/item/authorisation_reversal.vue')
  }
})
export default class StatementItem extends Vue {
  @Prop({ default: '' })
  readonly transaction!: ManagedAccountsSchemas.ManagedAccountStatementEntry

  get transactionType(): string {
    return this.transaction.txId.type.replace('_', ' ')
  }
}
</script>
