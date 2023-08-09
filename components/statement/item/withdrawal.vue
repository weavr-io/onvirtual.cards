<template>
    <b-row align-v="center" :class="{ 'text-muted': isPending }">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction">
                    <img src="~/assets/svg/statement/withdrawal.svg" alt="" />
                </div>
            </div>
        </b-col>
        <b-col>
            <div class="transaction-type">
                <div class="transaction">Withdrawal</div>
            </div>
            <b-row class="text-muted">
                <b-col>
                    <b-badge v-if="isPending" variant="grey-light" class="text-muted"
                        >Pending</b-badge
                    >
                </b-col>
                <b-col class="text-right">
                    <card-fee :transaction="transaction" />
                </b-col>
            </b-row>
        </b-col>
        <b-col class="text-right" cols="3" xl="2">
            <amount :transaction="transaction" />
        </b-col>
    </b-row>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

@Component({
    components: {
        Amount: () => import('~/components/statement/item/common/amount.vue'),
        CardFee: () => import('~/components/statement/item/common/cardFee.vue'),
    },
})
export default class StatementItemAdditionalField extends Vue {
    @Prop()
    readonly transaction!: StatementEntryModel

    get isPending(): boolean {
        return this.transaction.additionalFields?.withdrawalState !== 'COMPLETED'
    }
}
</script>
