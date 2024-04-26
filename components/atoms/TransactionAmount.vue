<template>
    <div>
        {{ currency }}
        <div v-if="transaction.sourceAmount" class="text-muted">
            {{ currencyWithOp }}
        </div>
    </div>
</template>
<script lang="ts" setup>
// import { Component, Prop, Vue } from 'nuxt-property-decorator'
// import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
// import { weavrCurrency, weavrCurrencyWithOperator } from '~/utils/helper'

// @Component({ components: {} })
// export default class StatementItemAdditionalField extends Vue {
//     @Prop()
//     readonly transaction!: StatementEntryModel
//
//     get currency() {
//         return weavrCurrency(this.transaction.transactionAmount)
//     }
//
//     get currencyWithOp() {
//         return weavrCurrencyWithOperator(this.transaction.sourceAmount)
//     }
// }

import { PropType } from '@nuxtjs/composition-api'
import { computed } from 'vue'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { weavrCurrency, weavrCurrencyWithOperator } from '~/utils/helper'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const currencyWithOp = computed(() => weavrCurrencyWithOperator(props.transaction?.sourceAmount))
const currency = computed(() => weavrCurrency(props.transaction?.transactionAmount))
</script>
