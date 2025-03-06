<template>
    <div>
        <template v-if="transactionType.raw === 'AUTHORISATION'">
            <Authorisation :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transactionType.raw === 'CHARGE_FEE'">
            <ChargeFee :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="['DEPOSIT', 'INCOMING_WIRE_TRANSFER'].includes(transactionType.raw)">
            <IncomingWireTransfer :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transactionType.raw === 'MANUAL_TRANSACTION'">
            <ManualTransaction :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transactionType.raw === 'MERCHANT_REFUND'">
            <MerchantRefund :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transactionType.raw === 'SEND'">
            <Send :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transactionType.raw === 'SETTLEMENT'">
            <Settlement :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transactionType.raw === 'TRANSFER'">
            <Transfer :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transactionType.raw === 'WITHDRAWAL'">
            <Withdrawal :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transactionType.raw === 'FEE_REVERSAL'">
            <FeeReversal :transaction="transaction" class="my-3" />
        </template>
        <template v-else>
            <b-row align-v="center" class="my-3">
                <b-col cols="1" />
                <b-col>
                    <div class="transaction-type">
                        <div class="transaction">
                            {{ transactionType.formatted }}
                        </div>
                    </div>
                </b-col>
                <b-col class="text-right">
                    <TransactionAmount :transaction="transaction" />
                </b-col>
            </b-row>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from '@nuxtjs/composition-api'
import { computed } from 'vue'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import Authorisation from '~/components/molecules/statements/AuthorisationEntry.vue'
import IncomingWireTransfer from '~/components/molecules/statements/IncomingWireTransferEntry.vue'
import ManualTransaction from '~/components/molecules/statements/ManualTransactionEntry.vue'
import ChargeFee from '~/components/molecules/statements/ChargeFeeEntry.vue'
import MerchantRefund from '~/components/molecules/statements/MerchantRefundEntry.vue'
import Settlement from '~/components/molecules/statements/SettlementEntry.vue'
import Transfer from '~/components/molecules/statements/TransferEntry.vue'
import Send from '~/components/molecules/statements/SendEntry.vue'
import Withdrawal from '~/components/molecules/statements/WithdrawalEntry.vue'
import FeeReversal from '~/components/molecules/statements/FeeReversalEntry.vue'
import TransactionAmount from '~/components/atoms/TransactionAmount.vue'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const transactionType = computed(() => {
    return {
        formatted: props.transaction.txId.type.replace('_', ' '),
        raw: props.transaction.txId.type,
    }
})
</script>
