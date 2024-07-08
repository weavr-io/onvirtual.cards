<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction">
                    <img alt="Deposit" loading="lazy" src="@/assets/svg/statement/deposit.svg" />
                </div>
            </div>
        </b-col>
        <b-col>
            <div class="transaction-type">
                <div class="transaction">Deposit</div>
            </div>
            <div class="text-muted">
                <b-row>
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
import { PropType } from 'vue'
import TransactionAmount from '~/components/atoms/TransactionAmount.vue'
import TransactionCardFee from '~/components/atoms/TransactionCardFee.vue'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})
</script>
