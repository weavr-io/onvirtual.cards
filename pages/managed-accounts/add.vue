<template>
  <section>
    <b-container>
      <b-row>
        <b-col md="4" offset-md="4">
          <b-card class="border-0">
            <b-card-title class="mb-5 text-center font-weight-lighter">
              Select Account Currency
            </b-card-title>
            <b-form @submit="doAdd">
              <b-form-row>
                <b-col>
                  <b-form-group :state="isInvalid($v.createManagedAccountRequest.currency)" label="Currency">
                    <b-form-select v-model="createManagedAccountRequest.currency" :options="currencyOptions" />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <loader-button :is-loading="isLoading" button-text="finish" class="mt-5 text-center" />
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { namespace } from 'vuex-class'
import { Component, mixins } from 'nuxt-property-decorator'
import { required, maxLength } from 'vuelidate/lib/validators'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

import * as AuthStore from '~/store/modules/Auth'
import config from '~/config'
import { Schemas } from '~/api/Schemas'
import BaseMixin from '~/minixs/BaseMixin'
import LoginResult = Schemas.LoginResult
import { accountsStore } from '~/utils/store-accessor'

const Auth = namespace(AuthStore.name)

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    createManagedAccountRequest: {
      friendlyName: {
        required,
        maxLength: maxLength(50)
      },
      currency: {
        required
      }
    }
  }
})
export default class AddCardPage extends mixins(BaseMixin) {

  get isLoading() {
    return this.stores.accounts.isLoading
  }

  @Auth.Getter auth!: LoginResult

  currencyOptions = [
    { value: 'EUR', text: 'Euro - EUR' },
    { value: 'GBP', text: 'Great Britain Pound - GBP' },
    { value: 'USD', text: 'US Dollars - USD' }
  ]

  public createManagedAccountRequest!: ManagedAccountsSchemas.CreateManagedAccountRequest

  doAdd(evt) {
    evt.preventDefault()

    if (this.$v.createManagedAccountRequest) {
      this.$v.createManagedAccountRequest.$touch()
      if (this.$v.createManagedAccountRequest.$anyError) {
        return
      }
    }

    this.stores.accounts.add(this.createManagedAccountRequest)
            .then(() => {
              this.$router.push('/managed-accounts')
            })
            .catch((err) => {
              const data = err.response.data

              const error = data.message ? data.message : data.errorCode

              this.$weavrToastError(error)
            })
  }

  async asyncData({ store, redirect }) {
    const createManagedAccountRequest: ManagedAccountsSchemas.CreateManagedAccountRequest = {
      profileId: AuthStore.Helpers.isConsumer(store)
              ? config.profileId.managed_accounts_consumers
              : config.profileId.managed_accounts_corporates,
      friendlyName: 'Main Account',
      currency: 'EUR'
    }

    if (AuthStore.Helpers.isConsumer(store)) {
      await accountsStore(store).add(createManagedAccountRequest)

      redirect('/managed-accounts')
    }

    return {
      createManagedAccountRequest: createManagedAccountRequest
    }
  }
}
</script>
