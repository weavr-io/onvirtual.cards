<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction increase">
                    <img
                        alt="Charge Fee"
                        loading="lazy"
                        src="@/assets/svg/statement/withdrawal.svg"
                    />
                </div>
            </div>
        </b-col>
        <b-col>
            <div class="transaction-type">
                <div class="transaction text-capitalize">
                    {{ chargeFeeType }}
                </div>
            </div>
            <div class="text-muted">
                <b-row class="d-flex align-items-center">
                    <b-col cols="6" class="text-left">
                        <span v-if="props.transaction.sourceAmount">
                            {{ currency }} = {{ currencySymbol
                            }}{{ props.transaction.additionalFields.exchangeRate }}
                        </span>
                    </b-col>
                    <b-col cols="6" class="text-right">
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
import { PropType } from '@nuxtjs/composition-api'
import { computed } from 'vue'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { weavrCurrency, weavrCurrencySymbol } from '~/utils/helper'
import TransactionAmount from '~/components/atoms/TransactionAmount.vue'
import TransactionCardFee from '~/components/atoms/TransactionCardFee.vue'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const chargeFeeType = computed(() =>
    props.transaction?.additionalFields?.chargeFeeType.split('_').join(' ').toLowerCase(),
)

const currencySymbol = computed(() => weavrCurrencySymbol(props.transaction?.sourceAmount.currency))
const currency = computed(() => weavrCurrency(100, props.transaction?.transactionAmount.currency))
</script>
