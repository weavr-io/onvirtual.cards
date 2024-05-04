<template>
    <b-form @submit.prevent="submitForm">
        <b-row>
            <b-col>
                <h2 class="text-center font-weight-lighter">
                    <template v-if="!accountDetails"> No account found</template>
                    <template v-else-if="accountBalance < 0.01"> Not enough funds</template>
                    <template v-else> Top up amount</template>
                </h2>
            </b-col>
        </b-row>
        <b-row v-if="!accountDetails" class="py-5 my-5 text-center">
            <b-col>
                <b-row>
                    <b-col>
                        <h4 class="font-weight-light">
                            You do not have an account to transfer funds from.
                        </h4>
                        <h5 class="font-weight-lighter">Start by creating an account.</h5>
                    </b-col>
                </b-row>
                <b-row class="mt-5">
                    <b-col class="text-center">
                        <b-button to="/managed-accounts" variant="secondary">
                            go to accounts
                            <span class="pl-5">-></span>
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-else-if="accountBalance < 0.01" class="py-5 my-5 text-center">
            <b-col>
                <b-row>
                    <b-col>
                        <h4 class="font-weight-light">
                            You do not have enough funds in your account.
                        </h4>
                        <h5 class="font-weight-lighter">Start by topping up.</h5>
                    </b-col>
                </b-row>
                <b-row class="mt-5">
                    <b-col class="text-center">
                        <b-button to="/managed-cards" variant="secondary">
                            go to cards
                            <span class="pl-5">-></span>
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-else class="py-5 my-5">
            <b-col>
                <b-row>
                    <b-col>
                        <b-form-group
                            :invalid-feedback="validation.getInvalidFeedback('amount')"
                            :state="validation.getState('amount')"
                            label="Amount:"
                        >
                            <b-input-group :prepend="accountDetails.currency">
                                <b-form-input
                                    v-model="request.amount"
                                    min="0.01"
                                    step="0.01"
                                    type="number"
                                />
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row class="mt-5">
                    <b-col class="text-center">
                        <b-button type="submit" variant="secondary">
                            next
                            <span class="pl-5">-></span>
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-form>
</template>
<script lang="ts">
import { reactive } from 'vue'
import { z } from 'zod'
import { Emit, mixins, Prop } from 'nuxt-property-decorator'
import { INVALID_FEEDBACK_CONST } from '~/local/const/InvalidFeedbackConst'
import useZodValidation from '~/composables/useZodValidation'
import BaseMixin from '~/mixins/BaseMixin'
import ValidationMixin from '~/mixins/ValidationMixin'

export default class TopUpForm extends mixins(BaseMixin, ValidationMixin) {
    @Prop({ default: '' }) readonly selectedAccount

    request = reactive({
        amount: null as number | null,
    })

    get amountSchema() {
        return z.object({
            amount: z
                .number()
                .min(0.01, { message: INVALID_FEEDBACK_CONST.minBalance })
                .max(this.accountBalance, { message: INVALID_FEEDBACK_CONST.maxBalance }),
        })
    }

    get validation() {
        return useZodValidation(this.amountSchema, this.request)
    }

    get accounts() {
        return this.accountsStore.accountState.accounts
    }

    get accountDetails() {
        if (this.accounts) {
            return this.accounts.accounts?.find((account) => {
                return account.id === this.selectedAccount.id
            })
        }

        return undefined
    }

    get accountBalance() {
        if (this.accountDetails && this.accountDetails.balances.availableBalance) {
            return this.accountDetails.balances.availableBalance / 100
        }

        return 0
    }

    @Emit()
    async submitForm() {
        await this.validation.validate()

        if (this.validation.isInvalid.value) return null

        return this.request
    }
}
</script>
