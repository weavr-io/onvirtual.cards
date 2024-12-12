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
                <div class="transaction">Incoming Wire Transfer</div>
                <div class="text-muted small">
                    {{
                        $formattingFilters.dateTime.formatMilliToDateTime(
                            props.transaction.processedTimestamp,
                        )
                    }}
                    • {{ props.transaction.additionalFields.sender }}
                </div>
            </div>
        </b-col>
        <b-col align-self="end">
            <TransactionCardFee
                class="text-muted small d-flex justify-content-end"
                :transaction="props.transaction"
            />
        </b-col>
        <b-col class="text-right" cols="3" xl="2">
            <TransactionAmount :transaction="props.transaction" />
        </b-col>
    </b-row>
</template>
<script lang="ts" setup>
import { PropType } from '@nuxtjs/composition-api'
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
