<template>
  <b-col md="6" offset-md="3">
    <b-card no-body class="overflow-hidden">
      <b-card-body class="p-card">
        <div class="form-screens">
          <error-alert />
          <div class="form-screen">
            <b-form @submit="submitForm" novalidate>
              <h3 class="text-center font-weight-light mb-5">
                Your address details
              </h3>
              <b-form-group label="Address Line 1*">
                <b-form-input
                        :state="isInvalid($v.form.request.address.addressLine1)"
                        v-model="form.request.address.addressLine1"
                        placeholder="Address Line 1"
                />
                <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label="Address Line 2">
                <b-form-input
                        :state="isInvalid($v.form.request.address.addressLine2)"
                        v-model="form.request.address.addressLine2"
                        placeholder="Address Line 2"
                />
              </b-form-group>
              <b-form-group label="City*">
                <b-form-input
                        :state="isInvalid($v.form.request.address.city)"
                        v-model="form.request.address.city"
                        placeholder="City"
                />
              </b-form-group>
              <b-form-group label="Country*">
                <b-form-select
                        :state="isInvalid($v.form.request.address.country)"
                        v-model="form.request.address.country"
                        :options="countiesOptions"
                        placeholder="Registration Country"
                />
              </b-form-group>
              <b-form-group label="Post Code*">
                <b-form-input
                        :state="isInvalid($v.form.request.address.postCode)"
                        v-model="form.request.address.postCode"
                        placeholder="Post Code"
                />
              </b-form-group>
              <b-form-group label="State">
                <b-form-input
                        :state="isInvalid($v.form.request.address.state)"
                        v-model="form.request.address.state"
                        placeholder="State"
                />
              </b-form-group>
              <b-row class="mt-4" align-v="center">
                <b-col class="text-center">
                  <loader-button :is-loading="isLoading" button-text="set address" />
                </b-col>
              </b-row>
            </b-form>
          </div>
        </div>
      </b-card-body>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { maxLength, required } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'

import * as ConsumersStore from '~/store/modules/Consumers'
import * as AuthStore from '~/store/modules/Auth'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import { UpdateConsumerRequest } from '~/api/Requests/Consumers/UpdateConsumerRequest'

const Consumers = namespace(ConsumersStore.name)
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
          country: { required, maxLength: maxLength(2) },
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
    CompanyDetailsForm: () => import('~/components/registration/CompanyDetails.vue'),
    RegistrationNav: () => import('~/components/registration/Nav.vue'),
    ComingSoonCurrencies: () => import('~/components/comingSoonCurrencies.vue')
  }
})
export default class ConsunmerAddressPage extends VueWithRouter {
  @Consumers.Getter consumer!: Consumer

  form!: UpdateConsumerRequest

  isLoading: boolean = false

  async asyncData({ store }) {
    const _res = await ConsumersStore.Helpers.get(store, AuthStore.Helpers.identityId(store)!)

    const _form: UpdateConsumerRequest = {
      consumerId: AuthStore.Helpers.identityId(store)!,
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

    this.isLoading = true

    if (this.$v.form) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return null
      }
    }

    ConsumersStore.Helpers.update(this.$store, this.form).then(this.addressUpdated.bind(this))
  }

  async addressUpdated() {
    this.isLoading = false

    const _auth = AuthStore.Helpers.auth(this.$store)
    let _cons = ConsumersStore.Helpers.consumer(this.$store)

    if (_cons === null) {
      await ConsumersStore.Helpers.get(this.$store, _auth.identity!.id!)
      _cons = ConsumersStore.Helpers.consumer(this.$store)
    }

    if (_cons && _cons.kyc && !_cons.kyc.emailVerified) {
      this.$router.push('/register/verify')
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
}
</script>