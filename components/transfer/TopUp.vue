<template>
  <b-form @submit="submitForm">
    <b-row>
      <b-col>
        <h2 class="text-center font-weight-lighter">
          Top up amount
        </h2>
      </b-col>
    </b-row>
    <b-row v-if="accountBalance < 10" class="py-5 my-5 text-center">
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
              back
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
              <b-input-group prepend="EUR">
                <b-form-input v-model="request.amount" type="number" step="0.01" />
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
import { Component, Emit } from 'nuxt-property-decorator'
import { required, minValue, between } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import { namespace } from '~/node_modules/vuex-class'
import * as AccountsStore from '~/store/modules/Accounts'
import { Prop } from '~/node_modules/nuxt-property-decorator'

const Accounts = namespace(AccountsStore.name)

@Component({
  validations: {
    request: {
      amount: {
        required,
        minValue: minValue(10),
        between(value) {
          // @ts-ignore
          return between(10, this.accountBalance)(value)
        }
      }
    }
  }
})
export default class TopUpForm extends VueWithRouter {
  $v

  @Accounts.Getter accounts!: ManagedAccountsSchemas.ManagedAccounts

  @Prop({ default: '' }) readonly selectedAccount

  get invalidMessage() {
    const _min = this.$v.request.amount.$params.between.min
    const _max = this.$v.request.amount.$params.between.max
    return 'Should be between ' + _min + ' and ' + _max
  }

  public request: {
    amount: number | null
  } = {
    amount: null
  }

  get accountDetails() {
    return this.accounts.account.find((_a) => {
      return _a.id.id === this.selectedAccount.id
    })
  }

  get accountBalance() {
    if (this.accountDetails && this.accountDetails.balances.availableBalance) {
      return parseInt(this.accountDetails.balances.availableBalance) / 100
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
