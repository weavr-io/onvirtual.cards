<template>
    <div>
        {{ currency }}
        <div v-if="transaction.sourceAmount" class="text-muted">{{ currencyWithOp }}</div>
    </div>
</template>
<script lang="ts" setup>
import { weavrCurrency, weavrCurrencyWithOperator } from '~/utils/helper'
import type { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const currencyWithOp = computed(() => weavrCurrencyWithOperator(props.transaction?.sourceAmount))
const currency = computed(() => weavrCurrency(props.transaction?.transactionAmount))
</script>
