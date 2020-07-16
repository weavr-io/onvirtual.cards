<template>
  <b-form @submit="submitForm">
    <b-row>
      <b-col>
        <h2 class="text-center font-weight-lighter">
          Choose account to top up from
        </h2>
      </b-col>
    </b-row>
    <b-row class="py-5 my-5">
      <b-col>
        <b-form-group class="weavr-account-radio" :state="isInvalid($v.request.source.id)">
          <b-form-radio-group
                  v-model="request.source.id"
                  :options="formattedAccounts"
                  name="source-account-options"
                  stacked
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-center">
        <b-button type="submit" variant="secondary">
          next
          <span class="pl-5">-></span>
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, mixins } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import { namespace } from '~/node_modules/vuex-class'
import BaseMixin from '~/minixs/BaseMixin'

@Component({
  validations: {
    request: {
      source: {
        id: {
          required
        }
      }
    }
  }
})
export default class AccountSelectionForm extends mixins(BaseMixin) {
  get accounts() {
    return this.stores.accounts.accounts
  }

  public request = {
    source: {
      type: 'managed_accounts',
      id: null
    }
  }

  @Emit()
  submitForm(e) {
    console.log('here')
    e.preventDefault()

    if (this.$v.request) {
      this.$v.request.$touch()
      if (this.$v.request.$anyError) {
        this.$weavrToastError('Please select an account to top up from.')
        return null
      }
    }

    return this.request
  }

  get formattedAccounts(): { value: string; text: string; html: string }[] {
    if (!this.accounts) {
      return []
    }

    const _accounts = this.accounts.account.filter((_account: ManagedAccountsSchemas.ManagedAccount) => {
      return _account.active
    })

    return _accounts.map((val: ManagedAccountsSchemas.ManagedAccount) => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: val.currency,
        minimumFractionDigits: 2,
        currencyDisplay: 'symbol'
      })

      let _availableBalance = 0
      if (val.balances.availableBalance) {
        _availableBalance = parseInt(val.balances.availableBalance) / 100
      }

      const isDisabled = _availableBalance < 10

      let disabledP = ''
      if (isDisabled) {
        disabledP = '<em class="m-0 text-danger">Not enough funds.</em>'
      }

      return {
        value: val.id.id,
        text: val.friendlyName,
        html:
                '<div class="row w-100">' +
                '<div class="col col-6 account-name"><p class="m-0">' +
                val.friendlyName +
                '</p>' +
                disabledP +
                '</div>' +
                '<div class="col col-6 account-balance text-right">' +
                formatter.format(_availableBalance) +
                '</div>' +
                '</div>',
        disabled: isDisabled
      }
    })
  }
}
</script>
