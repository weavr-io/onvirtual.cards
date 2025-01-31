<template>
    <span class="small">{{ `Fee + ${currency}` }}</span>
</template>
<script lang="ts" setup>
import { PropType } from '@nuxtjs/composition-api'
import { computed } from 'vue'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { weavrCurrency } from '~/utils/helper'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const currency = computed(() => weavrCurrency(props.transaction?.cardholderFee))
</script>
