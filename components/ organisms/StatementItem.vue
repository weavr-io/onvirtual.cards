<template>
    <div>
        <template v-if="transactionType.raw === 'AUTHORISATION'">
            <Authorisation :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transactionType.raw === 'CHARGE_FEE'">
            <ChargeFee :transaction="transaction" class="my-3" />
        </template>
        <template v-else-if="transactionType.raw === 'DEPOSIT'">
            <Deposit :transaction="transaction" class="my-3" />
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
                    <Amount :transaction="transaction" />
                </b-col>
            </b-row>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from '@nuxtjs/composition-api'
import { computed } from 'vue'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import Authorisation from '~/components/statement/item/Authorisation.vue'
import Deposit from '~/components/statement/item/Deposit.vue'
import ManualTransaction from '~/components/statement/item/ManualTransaction.vue'
import ChargeFee from '~/components/statement/item/ChargeFee.vue'
import MerchantRefund from '~/components/statement/item/MerchantRefund.vue'
import Settlement from '~/components/statement/item/Settlement.vue'
import Transfer from '~/components/statement/item/Transfer.vue'
import Send from '~/components/statement/item/Send.vue'
import Withdrawal from '~/components/statement/item/Withdrawal.vue'
import FeeReversal from '~/components/statement/item/FeeReversal.vue'
import Amount from '~/components/statement/item/common/Amount.vue'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const transactionType = computed(() => {
    return {
        formatted: props.transaction.transactionId.type.replace('_', ' '),
        raw: props.transaction.transactionId.type,
    }
})
</script>
