<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction increase">
                    <img
                        v-if="
                            props.transaction.additionalFields.merchantTransactionType ==
                            'CASH_WITHDRAWAL'
                        "
                        alt="Cash Withdrawal"
                        loading="lazy"
                        src="@/assets/svg/statement/atm_withdrawal.svg"
                    />
                    <img
                        v-else
                        alt="Settlement"
                        loading="lazy"
                        src="@/assets/svg/statement/settlement.svg"
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
            <div class="text-muted">
                <b-row>
                    <b-col>
                        <span
                            v-if="
                                props.transaction.additionalFields.merchantTransactionType ==
                                'CASH_WITHDRAWAL'
                            "
                            class="mr-2"
                            >ATM Withdrawal,
                        </span>
                        <span v-else class="mr-2">Purchase, </span>
                        <span
                            v-if="props.transaction.additionalFields.merchantTerminalCountry"
                            class="mr-2"
                            >{{ props.transaction.additionalFields.merchantTerminalCountry }}</span
                        >
                        <span v-if="props.transaction.sourceAmount">
                            {{ currency }}
                            = {{ currencySymbol
                            }}{{ props.transaction.additionalFields.exchangeRate }}
                        </span>
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
import { computed, PropType } from 'vue'
import TransactionAmount from '~/components/atoms/TransactionAmount.vue'
import TransactionCardFee from '~/components/atoms/TransactionCardFee.vue'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { weavrCurrency, weavrCurrencySymbol } from '~/utils/helper'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const currencySymbol = computed(() => weavrCurrencySymbol(props.transaction?.sourceAmount.currency))
const currency = computed(() => weavrCurrency(100, props.transaction?.transactionAmount.currency))
</script>
