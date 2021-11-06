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
import { Component, mixins } from 'nuxt-property-decorator'
import { maxLength, required } from 'vuelidate/lib/validators'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import config from '~/config'
import BaseMixin from '~/minixs/BaseMixin'
import { accountsStore, authStore } from '~/utils/store-accessor'

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
  },
  middleware: ['kyVerified']
})
export default class AddCardPage extends mixins(BaseMixin) {
  get isLoading() {
    return this.stores.accounts.isLoading
  }

  get auth() {
    return this.stores.auth.isLoading
  }

  currencyOptions = [
    {
      value: 'EUR',
      text: 'Euro - EUR'
    },
    {
      value: 'GBP',
      text: 'Great Britain Pound - GBP'
    },
    {
      value: 'USD',
      text: 'US Dollars - USD'
    }
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

    this.stores.accounts
      .add(this.createManagedAccountRequest)
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
      profileId: authStore(store).isConsumer
        ? config.profileId.managed_accounts_consumers
        : config.profileId.managed_accounts_corporates,
      friendlyName: 'Main Account',
      currency: 'EUR'
    }

    const _accounts = await accountsStore(store).index()

    console.log(_accounts.data.count)

    if (_accounts.data.count < 1) {
      if (authStore(store).isConsumer) {
        await accountsStore(store).add(createManagedAccountRequest)
        redirect('/managed-accounts')
      }
      return {
        createManagedAccountRequest: createManagedAccountRequest
      }
    } else {
      redirect('/managed-accounts')
    }
  }
}
</script>
