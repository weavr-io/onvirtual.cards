<template>
    <span>{{ `Fee + ${currency}` }}</span>
</template>
<script lang="ts" setup>
import { weavrCurrency } from '~/utils/helper'
import type { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const currency = computed(() => weavrCurrency(props.transaction?.cardholderFee))
</script>
