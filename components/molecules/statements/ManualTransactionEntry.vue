<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction increase">
                    <img alt="Refund" loading="lazy" :src="manualTransactionIcon" />
                </div>
            </div>
        </b-col>
        <b-col>
            <div class="transaction-type">
                <div class="transaction">Manual Adjustment</div>
            </div>
            <div class="text-muted">
                <b-row>
                    <b-col>
                        {{ props.transaction.additionalFields.note }}
                    </b-col>
                    <b-col class="text-right">
                        <TransactionCardFee :transaction="props.transaction" />
                    </b-col>
                </b-row>
            </div>
        </b-col>
        <b-col class="text-right" cols="3" xl="2">
            <TransactionAmount :transaction="props.transaction" />
        </b-col>
    </b-row>
</template>
<script lang="ts" setup>
import type { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import TransactionCardFee from '~/components/atoms/TransactionCardFee.vue'
import TransactionAmount from '~/components/atoms/TransactionAmount.vue'
import manualTransactionIcon from '@/assets/svg/statement/manual_transaction.svg?url'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})
</script>
