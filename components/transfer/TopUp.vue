<template>
  <b-form @submit="submitForm">
    <b-row>
      <b-col>
        <h2 class="text-center font-weight-lighter">
          <template v-if="accountBalance < 0.01">
            Not enough funds
          </template>
          <template v-else>
            Top up amount
          </template>
        </h2>
      </b-col>
    </b-row>
    <b-row v-if="accountBalance < 0.01" class="py-5 my-5 text-center">
      <b-col>
        <b-row>
          <b-col>
            <h4 class="font-weight-light">
              You do not have enough funds in your account.
            </h4>
            <h5 class="font-weight-lighter">
              Start by topping up.
            </h5>
          </b-col>
        </b-row>
        <b-row class="mt-5">
          <b-col class="text-center">
            <b-button to="/" variant="secondary">
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
            <b-form-group :state="isInvalid($v.request.amount)" :invalid-feedback="invalidMessage" label="Amount:">
              <b-input-group :prepend="accountDetails.currency">
                <b-form-input v-model="$v.request.amount.$model" type="number" step="0.01" min="0.01" />
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
import { Component, Emit, mixins } from 'nuxt-property-decorator'
import { required, between } from 'vuelidate/lib/validators'
import { Prop } from '~/node_modules/nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'

@Component({
  validations: {
    request: {
      amount: {
        required,
        between(value) {
          // @ts-ignore
          return between(0.01, this.accountBalance)(value)
        }
      }
    }
  }
})
export default class TopUpForm extends mixins(BaseMixin) {
  $v

  get accounts() {
    return this.stores.accounts.accounts
  }

  @Prop({ default: '' }) readonly selectedAccount

  get invalidMessage() {
    const _min = this.$v.request.amount.$params.between.min
    const _max = this.$v.request.amount.$params.between.max

    const _currency = this.accountDetails ? this.accountDetails.currency : 'EUR'
    return 'Should be between ' + _currency + ' ' + _min + ' and ' + _currency + ' ' + _max
  }

  public request: {
    amount: number | null
  } = {
    amount: null
  }

  get accountDetails() {
    if (this.accounts) {
      return this.accounts.accounts.find((account) => {
        return account.id === this.selectedAccount.id
      })
    }
  }

  get accountBalance() {
    if (this.accountDetails && this.accountDetails.balances.availableBalance) {
      return this.accountDetails.balances.availableBalance / 100
    } else {
      return 0
    }
  }

  @Emit() submitForm(e) {
    e.preventDefault()

    if (this.$v.request) {
      this.$v.request.$touch()
      if (this.$v.request.$anyError) {
        return null
      }
    }

    return this.request
  }
}
</script>
