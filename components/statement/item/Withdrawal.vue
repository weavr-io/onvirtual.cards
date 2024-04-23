<template>
    <b-row :class="{ 'text-muted': isPending }" align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction">
                    <img alt="" src="~/assets/svg/statement/withdrawal.svg" />
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
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

@Component({
    components: {
        Amount: () => import('~/components/statement/item/common/Amount.vue'),
        CardFee: () => import('~/components/statement/item/common/CardFee.vue'),
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
