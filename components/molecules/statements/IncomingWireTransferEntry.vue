<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction">
                    <img :src="depositIcon" alt="Deposit" loading="lazy" />
                </div>
            </div>
        </b-col>
        <b-col>
            <div class="transaction-type">
                <div class="transaction">Incoming Wire Transfer</div>
                <div class="text-muted small">
                    {{ senderInfo }}
                </div>
            </div>
        </b-col>
        <b-col align-self="end">
            <TransactionCardFee
                :transaction="props.transaction"
                class="text-muted small d-flex justify-content-end pb-1"
            />
        </b-col>
        <b-col class="text-right" cols="3" xl="2">
            <TransactionAmount :transaction="props.transaction" />
        </b-col>
    </b-row>
</template>
<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import type { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { FormattingFiltersModule } from '~/plugins/formattingFilters/FormattingFiltersModule'
import TransactionAmount from '~/components/atoms/TransactionAmount.vue'
import TransactionCardFee from '~/components/atoms/TransactionCardFee.vue'
import depositIcon from '@/assets/svg/statement/deposit.svg?url'

const { dateTime } = new FormattingFiltersModule()

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const senderInfo = computed(() => {
    return `${dateTime.formatMilliToDateTime(props.transaction.processedTimestamp)} • ${props.transaction.additionalFields.sender}`
})
</script>
