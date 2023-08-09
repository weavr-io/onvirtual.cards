<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction increase">
                    <template v-if="isOut">
                        <send-icon />
                    </template>
                    <template v-if="isIn">
                        <receive-icon />
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
                    <b-col> Transfer </b-col>
                    <b-col class="text-right">
                        <card-fee :transaction="transaction" />
                    </b-col>
                </b-row>
            </div>
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
        ReceiveIcon: () => import('~/assets/svg/statement/receive.svg?inline'),
        SendIcon: () => import('~/assets/svg/statement/send.svg?inline'),
        Amount: () => import('~/components/statement/item/common/amount.vue'),
        CardFee: () => import('~/components/statement/item/common/cardFee.vue'),
    },
})
export default class StatementItemAdditionalField extends Vue {
    @Prop()
    readonly transaction!: StatementEntryModel

    get source() {
        return this.transaction.additionalFields?.sourceIdentityName
    }

    get destination() {
        return this.transaction.additionalFields?.destinationIdentityName
    }

    get isOut() {
        return this.transaction.additionalFields?.destinationIdentityName !== undefined
    }

    get isIn() {
        return this.transaction.additionalFields?.sourceIdentityName !== undefined
    }
}
</script>
