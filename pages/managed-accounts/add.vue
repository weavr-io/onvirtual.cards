<template>
  <section>
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <b-card class="border-0">
            <b-card-title class="mb-5 text-center font-weight-lighter">
              Account Name and Currency
            </b-card-title>
            <b-form @submit="doAdd">
              <b-form-row>
                <b-col>
                  <b-form-group
                    label="Friendly Name:"
                    :state="isInvalid($v.request.friendlyName)"
                  >
                    <b-form-input v-model="request.friendlyName" />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col>
                  <b-form-group
                    label="Currency:"
                    :state="isInvalid($v.request.currency)"
                  >
                    <b-form-select
                      v-model="request.currency"
                      :options="currencyOptions"
                    />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <loader-button
                :is-loading="isLoading"
                button-text="add account"
                class="mt-5 text-center"
              />
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { namespace } from 'vuex-class'
import { Component } from 'nuxt-property-decorator'
import { required, maxLength } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

import * as AccountsStore from '~/store/modules/Accounts'
import * as AuthStore from '~/store/modules/Auth'
import config from '~/config'
const Auth = namespace(AuthStore.name)
const Accounts = namespace(AccountsStore.name)

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    request: {
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
export default class AddCardPage extends VueWithRouter {
  @Accounts.Action add

  @Accounts.Getter isLoading

  @Auth.Getter corporateId

  currencyOptions = [
    { value: null, text: 'Please select currecy' },
    { value: 'EUR', text: 'Euro' },
    { value: 'GBP', text: 'Great Britian Pound' }
  ]

  public request: ManagedAccountsSchemas.CreateManagedAccountRequest = {
    profileId: null,
    owner: {
      type: 'corporates',
      id: 0
    },
    friendlyName: '',
    currency: 'EUR',
    fiProvider: 'paynetics',
    createNow: true,
    channelProvider: 'gps'
  }

  doAdd(evt) {
    evt.preventDefault()

    if (this.$v.request) {
      this.$v.request.$touch()
      if (this.$v.request.$anyError) {
        return
      }
    }

    this.add(this.request)
      .then(() => {
        this.$router.push('/managed-accounts')
      })
      .catch((err) => {
        const data = err.response.data

        const error = data.message ? data.message : data.errorCode

        this.$weavrToastError(error)
      })
  }

  mounted() {
    super.mounted()
    this.request.owner.id = this.corporateId
    this.request.profileId = config.profileId.managed_accounts
  }
}
</script>
