<template>
  <b-col md="6" offset-md="3">
    <b-card no-body class="overflow-hidden">
      <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
        <b-card-body class="p-card">
          <div class="form-screens">
            <error-alert />
            <div class="form-screen">
              <b-form novalidate @submit="submitForm">
                <h3 class="text-center font-weight-light mb-5">
                  Your address details
                </h3>
                <b-form-group label="Address Line 1*">
                  <b-form-input
                    v-model="form.request.address.addressLine1"
                    :state="isInvalid($v.form.request.address.addressLine1)"
                    placeholder="Address Line 1"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Address Line 2">
                  <b-form-input
                    v-model="form.request.address.addressLine2"
                    :state="isInvalid($v.form.request.address.addressLine2)"
                    placeholder="Address Line 2"
                  />
                </b-form-group>
                <b-form-group label="City*">
                  <b-form-input
                    v-model="form.request.address.city"
                    :state="isInvalid($v.form.request.address.city)"
                    placeholder="City"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Country*">
                  <b-form-select
                    v-model="form.request.address.country"
                    :state="isInvalid($v.form.request.address.country)"
                    :options="countiesOptions"
                    placeholder="Registration Country"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Post Code*">
                  <b-form-input
                    v-model="form.request.address.postCode"
                    :state="isInvalid($v.form.request.address.postCode)"
                    placeholder="Post Code"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="State">
                  <b-form-input
                    v-model="form.request.address.state"
                    :state="isInvalid($v.form.request.address.state)"
                    placeholder="State"
                  />
                </b-form-group>
                <b-row class="mt-4" align-v="center">
                  <b-col class="text-center">
                    <loader-button :is-loading="isLoading" button-text="continue" />
                  </b-col>
                </b-row>
              </b-form>
            </div>
          </div>
        </b-card-body>
      </b-overlay>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { maxLength, required } from 'vuelidate/lib/validators'

import { Consumer } from '~/api/Models/Consumers/Consumer'
import { UpdateConsumerRequest } from '~/api/Requests/Consumers/UpdateConsumerRequest'
import { SourceOfFunds, SourceOfFundsOptions } from '~/api/Enums/Consumers/SourceOfFunds'
import { IndustryOccupationOptions } from '~/api/Enums/Consumers/IndustryOccupation'
import BaseMixin from '~/minixs/BaseMixin'
import { authStore, consumersStore } from '~/utils/store-accessor'

const Countries = require('~/static/json/countries.json')

@Component({
  layout: 'auth',
  validations: {
    form: {
      request: {
        address: {
          addressLine1: {
            required
          },
          addressLine2: {},
          city: { required },
          country: {
            required,
            maxLength: maxLength(2)
          },
          postCode: { required },
          state: {}
        }
      }
    }
  },
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    RegisterForm: () => import('~/components/registration/RegisterForm1.vue'),
    ConsumerPersonalDetailsForm: () => import('~/components/registration/ConsumerPersonalDetails.vue'),
    RegistrationNav: () => import('~/components/registration/Nav.vue'),
    ComingSoonCurrencies: () => import('~/components/comingSoonCurrencies.vue')
  }
})
export default class ConsunmerAddressPage extends mixins(BaseMixin) {
  get consumer(): Consumer | null {
    return this.stores.consumers.consumer
  }

  form!: UpdateConsumerRequest

  isLoading: boolean = false

  async asyncData({ store }) {
    const _res = await consumersStore(store).get(authStore(store).identityId!)

    const _form: UpdateConsumerRequest = {
      consumerId: authStore(store).identityId!,
      request: {
        // @ts-ignore
        address: { ..._res.data.address }
      }
    }

    return {
      form: _form
    }
  }

  submitForm(e) {
    e.preventDefault()

    if (this.$v.form) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return null
      }
    }

    this.isLoading = true

    const xhr = this.stores.consumers.update(this.form)
    xhr.then(this.addressUpdated.bind(this))
    xhr.finally(() => {
      this.isLoading = false
    })
  }

  async addressUpdated() {
    const _auth = this.stores.auth.auth
    let _cons = this.stores.consumers.consumer

    if (_cons === null) {
      await this.stores.consumers.get(_auth.identity!.id!)
      _cons = this.stores.consumers.consumer
    }

    if (_cons && _cons.kyc && !_cons.kyc.emailVerified) {
      this.$router.push({
        path: '/register/verify',
        query: {
          send: 'true'
        }
      })
    } else {
      this.$router.push('/')
    }
  }

  get countiesOptions() {
    return Countries.map((_c) => {
      return {
        text: _c.name,
        value: _c['alpha-2']
      }
    })
  }

  get sourceOfFundsOptions() {
    return SourceOfFundsOptions
  }

  get industryOccupationOptions() {
    return IndustryOccupationOptions
  }

  get shouldShowOtherSourceOfFunds(): boolean {
    return this.form.request.sourceOfFunds === SourceOfFunds.OTHER
  }
}
</script>
