<template>
    <b-row align-v="center">
        <b-col cols="1">
            <div class="transaction-type-icon">
                <div class="transaction increase">
                    <img
                        v-if="
                            transaction.additionalFields.merchantTransactionType ==
                            'CASH_WITHDRAWAL'
                        "
                        alt=""
                        src="~/assets/svg/statement/atm_withdrawal.svg"
                    />
                    <img v-else alt="" src="~/assets/svg/statement/settlement.svg" />
                </div>
            </div>
        </b-col>
        <b-col>
            <div class="transaction-type">
                <div class="transaction">
                    {{ transaction.additionalFields.merchantName }}
                </div>
            </div>
            <div class="text-muted">
                <b-row>
                    <b-col>
                        <span
                            v-if="
                                transaction.additionalFields.merchantTransactionType ==
                                'CASH_WITHDRAWAL'
                            "
                            class="mr-2"
                            >ATM Withdrawal,
                        </span>
                        <span v-else class="mr-2">Purchase, </span>
                        <span
                            v-if="transaction.additionalFields.merchantTerminalCountry"
                            class="mr-2"
                            >{{ transaction.additionalFields.merchantTerminalCountry }}</span
                        >
                        <span v-if="transaction.sourceAmount">
                            {{ 100 | weavr_currency(transaction.transactionAmount.currency) }}
                            = {{ transaction.sourceAmount.currency | weavr_currency_symbol
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

@Component({
    components: {
        Amount: () => import('~/components/statement/item/common/Amount.vue'),
        CardFee: () => import('~/components/statement/item/common/CardFee.vue'),
    },
})
export default class StatementItemAdditionalField extends Vue {
    @Prop()
    readonly transaction!: StatementEntryModel
}
</script>
