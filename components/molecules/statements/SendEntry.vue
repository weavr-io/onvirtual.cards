<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction increase">
                    <template v-if="isOut">
                        <img alt="Send" loading="lazy" src="@/assets/svg/statement/send.svg" />
                    </template>
                    <template v-if="isIn">
                        <img
                            alt="Receive"
                            loading="lazy"
                            src="@/assets/svg/statement/receive.svg"
                        />
                    </template>
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
            <div class="text-muted">
                <b-row>
                    <b-col> Transfer</b-col>
                    <b-col class="text-right">
                        <TransactionCardFee :transaction="transaction" />
                    </b-col>
                </b-row>
            </div>
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

const source = computed(() => props.transaction?.additionalFields?.sourceIdentityName)
const destination = computed(() => props.transaction?.additionalFields?.destinationIdentityName)
const isOut = computed(
    () => props.transaction?.additionalFields?.destinationIdentityName !== undefined,
)
const isIn = computed(() => props.transaction?.additionalFields?.sourceIdentityName !== undefined)
</script>
