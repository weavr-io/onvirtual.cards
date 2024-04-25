<template>
    <b-row :class="{ 'text-muted': isPending }" align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction">
                    <img
                        alt="Withdrawal"
                        loading="lazy"
                        src="~/assets/svg/statement/withdrawal.svg"
                    />
                </div>
            </div>
        </b-col>
        <b-col>
            <div class="transaction-type">
                <div class="transaction">Withdrawal</div>
            </div>
            <b-row class="text-muted">
                <b-col>
                    <b-badge v-if="isPending" class="text-muted" variant="grey-light"
                        >Pending
                    </b-badge>
                </b-col>
                <b-col class="text-right">
                    <CardFee :transaction="transaction" />
                </b-col>
            </b-row>
        </b-col>
        <b-col class="text-right" cols="3" xl="2">
            <Amount :transaction="transaction" />
        </b-col>
    </b-row>
</template>
<script lang="ts" setup>
import { PropType } from '@nuxtjs/composition-api'
import { computed } from 'vue'
import Amount from '~/components/statement/item/common/Amount.vue'
import CardFee from '~/components/statement/item/common/CardFee.vue'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

const props = defineProps({
    transaction: {
        type: Object as PropType<StatementEntryModel>,
        required: true,
    },
})

const isPending = computed(
    () => props.transaction?.additionalFields?.withdrawalState !== 'COMPLETED',
)
</script>
