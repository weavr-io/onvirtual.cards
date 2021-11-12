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
                    v-model="address.addressLine1"
                    :state="isInvalid($v.address.addressLine1)"
                    placeholder="Address Line 1"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Address Line 2">
                  <b-form-input
                    v-model="address.addressLine2"
                    :state="isInvalid($v.address.addressLine2)"
                    placeholder="Address Line 2"
                  />
                </b-form-group>
                <b-form-group label="City*">
                  <b-form-input v-model="address.city" :state="isInvalid($v.address.city)" placeholder="City" />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Country*">
                  <b-form-select
                    v-model="address.country"
                    :state="isInvalid($v.address.country)"
                    :options="countiesOptions"
                    placeholder="Registration Country"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Post Code*">
                  <b-form-input
                    v-model="address.postCode"
                    :state="isInvalid($v.address.postCode)"
                    placeholder="Post Code"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="State">
                  <b-form-input v-model="address.state" :state="isInvalid($v.address.state)" placeholder="State" />
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
import BaseMixin from '~/minixs/BaseMixin'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { LegalAddressModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/LegalAddressModel'
import { SourceOfFundsSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/SourceOfFundsSelectConst'
import { IndustryTypeSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/IndustryTypeSelectConst'
import { CorporatesRootUserModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporatesRootUserModel'
import { ConsumersRootUserModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumersRootUserModel'

const Countries = require('~/static/json/countries.json')

@Component({
  layout: 'auth',
  validations: {
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
export default class ConsumerAddressPage extends mixins(BaseMixin) {
  address!: AddressModel | LegalAddressModel

  isLoading: boolean = false

  fetch() {
    if (this.isConsumer) {
      this.address = { ...this.consumer?.rootUser.address! }
    } else if (this.isCorporate) {
      this.address = { ...this.corporate?.company.registeredAddress! }
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

    let xhr

    if (this.isConsumer) {
      xhr = this.stores.consumers.update({ address: this.address as AddressModel })
    } else if (this.isCorporate) {
      xhr = this.stores.corporates.update({ companyBusinessAddress: this.address as AddressModel })
    }
    xhr.then(this.addressUpdated)

    xhr.finally(() => {
      this.isLoading = false
    })
  }

  async addressUpdated() {
    let identityRootVerified: CorporatesRootUserModel | ConsumersRootUserModel

    if (this.isConsumer) {
      await this.stores.consumers.get().then((res) => {
        identityRootVerified = res.data.rootUser

        if (identityRootVerified && !(identityRootVerified as ConsumersRootUserModel).emailVerified) {
          this.goToRegisterVerify()
        } else {
          this.goToIndex()
        }
      })
    } else if (this.isCorporate) {
      await this.stores.corporates.get().then((res) => {
        identityRootVerified = res.data.rootUser

        if (identityRootVerified && !(identityRootVerified as CorporatesRootUserModel).emailVerified) {
          this.goToRegisterVerify()
        } else {
          this.goToIndex()
        }
      })
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
    return SourceOfFundsSelectConst
  }

  get industryOccupationOptions() {
    return IndustryTypeSelectConst
  }

  goToRegisterVerify() {
    return this.$router.push({
      path: '/register/verify',
      query: {
        send: 'true'
      }
    })
  }
}
</script>
