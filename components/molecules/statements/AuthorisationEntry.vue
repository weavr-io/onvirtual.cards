<template>
    <b-row align-v="center" class="text-muted">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction">
                    <img
                        alt="Authorisation"
                        loading="lazy"
                        src="@/assets/svg/statement/authorisation.svg"
                    />
                </div>
            </div>
        </b-col>
        <b-col>
            <div class="transaction-type">
                <div class="transaction">
                    {{ props.transaction.additionalFields.merchantName }}
                </div>
            </div>
            <b-row class="text-muted">
                <b-col>
                    <b-badge v-if="isPending" class="text-muted mr-2" variant="grey-light"
                        >Pending
                    </b-badge>
                    <span class="mr-2">Purchase</span>
                    <span
                        v-if="props.transaction.additionalFields.merchantTerminalCountry"
                        class="mr-2"
                        >{{ props.transaction.additionalFields.merchantTerminalCountry }}</span
                    >
                    <span v-if="props.transaction.sourceAmount"
                        >{{ currency }} = {{ currencySymbol
                        }}{{ props.transaction.additionalFields.exchangeRate }}</span
                    >
                </b-col>
                <b-col class="text-right">
                    <TransactionCardFee :transaction="props.transaction" />
                </b-col>
            </b-row>
        </b-col>
        <b-col class="text-right" cols="3" xl="2">
            <TransactionAmount :transaction="props.transaction" />
        </b-col>
    </b-row>
</template>
<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import TransactionAmount from '~/components/atoms/TransactionAmount.vue'
import { weavrCurrency, weavrCurrencySymbol } from '~/utils/helper'
import TransactionCardFee from '~/components/atoms/TransactionCardFee.vue'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const isPending = computed(
    () => props.transaction?.additionalFields?.authorisationState !== 'COMPLETED',
)
const currencySymbol = computed(() => weavrCurrencySymbol(props.transaction?.sourceAmount.currency))
const currency = computed(() => weavrCurrency(100, props.transaction?.transactionAmount.currency))
</script>
