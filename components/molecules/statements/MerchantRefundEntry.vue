<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction increase">
                    <img alt="Refund" loading="lazy" src="~/assets/svg/statement/refund.svg" />
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
                    <b-col> Refund</b-col>
                    <b-col class="text-right">
                        <CardFee :transaction="transaction" />
                    </b-col>
                </b-row>
            </div>
        </b-col>
        <b-col class="text-right" cols="3" xl="2">
            <Amount :transaction="props.transaction" />
        </b-col>
    </b-row>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue'
import { PropType } from '@nuxtjs/composition-api'
import Amount from '~/components/statement/item/common/Amount.vue'
import CardFee from '~/components/statement/item/common/CardFee.vue'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})
</script>
