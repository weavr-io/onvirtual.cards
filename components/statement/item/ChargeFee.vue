<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction increase">
                    <img alt="" src="~/assets/svg/statement/withdrawal.svg" />
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
                <b-row>
                    <b-col>
                        <span v-if="transaction.sourceAmount">
                            {{ currency }} = {{ currencySymbol
                            }}{{ transaction.additionalFields.exchangeRate }}
                        </span>
                    </b-col>
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
import { weavrCurrency, weavrCurrencySymbol } from '~/utils/helper'

@Component({
    components: {
        Amount: () => import('~/components/statement/item/common/Amount.vue'),
        CardFee: () => import('~/components/statement/item/common/CardFee.vue'),
    },
})
export default class StatementItemAdditionalField extends Vue {
    @Prop()
    readonly transaction!: StatementEntryModel

    get chargeFeeType(): string | undefined {
        return this.transaction.additionalFields?.chargeFeeType.split('_').join(' ').toLowerCase()
    }

    get currencySymbol() {
        return weavrCurrencySymbol(this.transaction.sourceAmount.currency)
    }

    get currency() {
        return weavrCurrency(100, this.transaction.transactionAmount.currency)
    }
}
</script>
