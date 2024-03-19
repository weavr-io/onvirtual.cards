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
                            :invalid-feedback="invalidMessage"
                            :state="isInvalid($v.request.amount)"
                            label="Amount:"
                        >
                            <b-input-group :prepend="accountDetails.currency">
                                <b-form-input
                                    v-model="$v.request.amount.$model"
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
import { Component, Emit, mixins, Prop } from 'nuxt-property-decorator'
import { between, required } from 'vuelidate/lib/validators'
import BaseMixin from '~/mixins/BaseMixin'
import ValidationMixin from '~/mixins/ValidationMixin'

@Component({
    validations: {
        request: {
            amount: {
                required,
                between(this: TopUpForm, value) {
                    return between(0.01, this.accountBalance)(value)
                },
            },
        },
    },
})
export default class TopUpForm extends mixins(BaseMixin, ValidationMixin) {
    @Prop({ default: '' }) readonly selectedAccount
    public request: {
        amount: number | null
    } = {
        amount: null,
    }

    get accounts() {
        return this.stores.accounts.accounts
    }

    get invalidMessage() {
        const _min = this.$v.request.amount?.$params.between.min
        const _max = this.$v.request.amount?.$params.between.max

        const _currency = this.accountDetails ? this.accountDetails.currency : 'EUR'
        return 'Should be between ' + _currency + ' ' + _min + ' and ' + _currency + ' ' + _max
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
        } else {
            return 0
        }
    }

    @Emit()
    submitForm() {
        this.$v.$touch()
        if (this.$v.$invalid) {
            return null
        }

        return this.request
    }
}
</script>
