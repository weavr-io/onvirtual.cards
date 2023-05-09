<template>
    <div>
        <template v-if="transaction.transactionId.type === 'AUTHORISATION'">
            <authorisation :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transaction.transactionId.type === 'CHARGE_FEE'">
            <charge-fee :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transaction.transactionId.type === 'DEPOSIT'">
            <deposit :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transaction.transactionId.type === 'MANUAL_TRANSACTION'">
            <manual-transaction :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transaction.transactionId.type === 'MERCHANT_REFUND'">
            <merchant-refund :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transaction.transactionId.type === 'SEND'">
            <send :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transaction.transactionId.type === 'SETTLEMENT'">
            <settlement :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transaction.transactionId.type === 'TRANSFER'">
            <transfer :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transaction.transactionId.type === 'WITHDRAWAL'">
            <withdrawal :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transaction.transactionId.type === 'FEE_REVERSAL'">
            <fee-reversal :transaction="transaction" class="my-3" />
        </template>
        <template v-else>
            <b-row class="my-3" align-v="center">
                <b-col cols="1" />
                <b-col>
                    <div class="transaction-type">
                        <div class="transaction">
                            {{ transaction.transactionId.type }}
                        </div>
                    </div>
                </b-col>
                <b-col class="text-right">
                    <amount :transaction="transaction" />
                </b-col>
            </b-row>
        </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

@Component({
    components: {
        Transfer: () => import('~/components/statement/item/transfer.vue'),
        Send: () => import('~/components/statement/item/send.vue'),
        MerchantRefund: () => import('~/components/statement/item/merchant_refund.vue'),
        ManualTransaction: () => import('~/components/statement/item/manual_transaction.vue'),
        Authorisation: () => import('~/components/statement/item/authorisation.vue'),
        Settlement: () => import('~/components/statement/item/settlement.vue'),
        Deposit: () => import('~/components/statement/item/deposit.vue'),
        Withdrawal: () => import('~/components/statement/item/withdrawal.vue'),
        Amount: () => import('~/components/statement/item/common/amount.vue'),
        FeeReversal: () => import('~/components/statement/item/fee_reversal.vue'),
        ChargeFee: () => import('~/components/statement/item/charge_fee.vue'),
    },
})
export default class StatementItem extends Vue {
    @Prop({ default: '' })
    readonly transaction!: StatementEntryModel

    get transactionType(): string {
        return this.transaction.transactionId.type.replace('_', ' ')
    }
}
</script>
