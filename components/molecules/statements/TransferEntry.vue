<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction increase">
                    <img alt="Transfer" loading="lazy" src="@/assets/svg/statement/transfer.svg" />
                </div>
            </div>
        </b-col>
        <b-col>
            <div class="transaction-type">
                <div class="transaction">
                    <template v-if="isOut">To {{ destination }}</template>
                    <template v-if="isIn">From {{ source }}</template>
                </div>
            </div>
            <b-row class="text-muted">
                <b-col> Personal Transfer</b-col>
                <b-col class="text-right">
                    <TransactionCardFee :transaction="transaction" />
                </b-col>
            </b-row>
        </b-col>
        <b-col class="text-right" cols="3" xl="2">
            <TransactionAmount :transaction="transaction" />
        </b-col>
    </b-row>
</template>
<script lang="ts" setup>
import { PropType } from '@nuxtjs/composition-api'
import { computed } from 'vue'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import TransactionAmount from '~/components/atoms/TransactionAmount.vue'
import TransactionCardFee from '~/components/atoms/TransactionCardFee.vue'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const source = computed(() => props.transaction?.additionalFields?.sourceInstrumentFriendlyName)

const destination = computed(
    () => props.transaction?.additionalFields?.destinationInstrumentFriendlyName,
)

const isOut = computed(() => destination.value !== undefined)

const isIn = computed(() => source.value !== undefined)
</script>
