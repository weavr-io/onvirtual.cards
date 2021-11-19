<template>
  <section>
    <b-container>
      <b-row>
        <b-col md="4" offset-md="4">
          <b-card v-if="isCorporate" class="border-0">
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
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { maxLength, required } from 'vuelidate/lib/validators'
import BaseMixin from '~/minixs/BaseMixin'
import { CreateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/CreateManagedAccountRequest'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import AccountsMixin from '~/minixs/AccountsMixin'

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
export default class AddCardPage extends mixins(BaseMixin, AccountsMixin) {
  createManagedAccountRequest: CreateManagedAccountRequest = {
    profileId: '',
    friendlyName: 'Main Account',
    currency: CurrencyEnum.EUR
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

  get isLoading() {
    return this.stores.accounts.isLoading
  }

  get auth() {
    return this.stores.auth.isLoading
  }

  async fetch() {
    await this.stores.accounts.index().then(async (res) => {
      if (parseInt(res.data.count!) < 1) {
        if (this.isConsumer) {
          await this.stores.accounts
            .create(this.createManagedAccountRequest)
            .then(async (res) => {
              await this.stores.accounts.upgradeIban(res.data.id)
              return this.goToManagedAccountIndex()
            })
            .catch((err) => {
              const data = err.response.data

              const error = data.message ? data.message : data.errorCode

              this.$weavrToastError(error)
              this.goToManagedAccountIndex()
            })
        }
      } else {
        return this.goToManagedAccountIndex()
      }
    })
  }

  doAdd(evt) {
    evt.preventDefault()

    if (this.$v.createManagedAccountRequest) {
      this.$v.createManagedAccountRequest.$touch()
      if (this.$v.createManagedAccountRequest.$anyError) {
        return
      }
    }

    this.stores.accounts
      .create(this.createManagedAccountRequest)
      .then(async (res) => {
        await this.stores.accounts.upgradeIban(res.data.id)
        return this.goToManagedAccountIndex()
      })
      .catch((err) => {
        const data = err.response.data

        const error = data.message ? data.message : data.errorCode

        this.$weavrToastError(error)
      })
  }

  @Watch('isConsumer', { immediate: true })
  updateProfileId() {
    this.createManagedAccountRequest.profileId = this.profileId
  }
}
</script>
