<template>
  <b-col md="8" offset-md="2" lg="6" offset-lg="3">
    <b-card no-body class="overflow-hidden">
      <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
        <b-card-body class="p-card">
          <div class="form-screens">
            <error-alert />
            <div class="form-screen">
              <b-form novalidate @submit="submitForm">
                <h3 class="text-center font-weight-light mb-5">Your address details</h3>
                <b-form-group
                  label="Address Line 1*"
                  :state="isInvalid($v.address.addressLine1)"
                  :invalid-feedback="
                    invalidFeedback(
                      $v.address.addressLine1,
                      validateVParams($v.address.addressLine1.$params, $v.address.addressLine1)
                    )
                  "
                >
                  <b-form-input v-model="$v.address.addressLine1.$model" placeholder="Address Line 1" />
                </b-form-group>
                <b-form-group label="Address Line 2">
                  <b-form-input v-model="address.addressLine2" placeholder="Address Line 2" />
                </b-form-group>
                <b-form-group
                  label="City*"
                  :state="isInvalid($v.address.city)"
                  :invalid-feedback="
                    invalidFeedback($v.address.city, validateVParams($v.address.city.$params, $v.address.city))
                  "
                >
                  <b-form-input v-model="$v.address.city.$model" placeholder="City" />
                </b-form-group>
                <b-form-group
                  label="Country*"
                  :state="isInvalid($v.address.country)"
                  :invalid-feedback="
                    invalidFeedback($v.address.country, validateVParams($v.address.country.$params, $v.address.country))
                  "
                >
                  <b-form-select
                    v-model="$v.address.country.$model"
                    :options="countryOptionsWithDefault"
                    placeholder="Registration Country"
                  />
                </b-form-group>
                <b-form-group
                  label="Post Code*"
                  :state="isInvalid($v.address.postCode)"
                  :invalid-feedback="
                    invalidFeedback(
                      $v.address.postCode,
                      validateVParams($v.address.postCode.$params, $v.address.postCode)
                    )
                  "
                >
                  <b-form-input v-model="$v.address.postCode.$model" placeholder="Post Code" />
                </b-form-group>
                <b-form-group label="State">
                  <b-form-input v-model="address.state" placeholder="State" />
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
import BaseMixin from '~/mixins/BaseMixin'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { LegalAddressModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/LegalAddressModel'
import { SourceOfFundsSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/SourceOfFundsSelectConst'
import { IndustryTypeSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/IndustryTypeSelectConst'
import { CorporatesRootUserModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporatesRootUserModel'
import { ConsumersRootUserModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumersRootUserModel'
import ValidationMixin from '~/mixins/ValidationMixin'
import { Nullable } from '~/global'

@Component({
  layout: 'auth',
  validations: {
    address: {
      addressLine1: {
        required,
      },
      city: { required },
      postCode: { required },
      country: {
        required,
        maxLength: maxLength(2),
      },
    },
  },
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    ConsumerPersonalDetailsForm: () => import('~/components/registration/ConsumerPersonalDetails.vue'),
    RegistrationNav: () => import('~/components/registration/Nav.vue'),
    ComingSoonCurrencies: () => import('~/components/comingSoonCurrencies.vue'),
  },
  middleware: ['authRouteGuard'],
})
export default class ConsumerAddressPage extends mixins(BaseMixin, ValidationMixin) {
  address: Nullable<AddressModel | LegalAddressModel> = {
    addressLine1: null,
    addressLine2: null,
    city: null,
    postCode: null,
    state: null,
    country: null,
  }

  isLoading: boolean = false

  fetch() {
    if (this.isConsumer && this.consumer) {
      if (Object.keys(this.consumer.rootUser.address as AddressModel).length !== 0) {
        this.address = { ...this.consumer?.rootUser.address! }
      }
    } else if (this.isCorporate && this.corporate) {
      if (Object.keys(this.corporate.company.registeredAddress as LegalAddressModel).length !== 0) {
        // treat as corporate
        this.address = { ...this.corporate?.company.registeredAddress! }
      }
    }
  }

  get country() {
    return this.address.country !== undefined ? this.address.country : null
  }

  set country(val) {
    this.$set(this.address, 'country', val)
  }

  get sourceOfFundsOptions() {
    return SourceOfFundsSelectConst
  }

  get industryOccupationOptions() {
    return IndustryTypeSelectConst
  }

  submitForm(e) {
    e.preventDefault()

    this.$v.$touch()

    if (this.$v.$invalid) {
      return
    }

    if (this.$v.$anyDirty) {
      this.isLoading = true
      let xhr

      if (this.isConsumer) {
        xhr = this.stores.consumers.update({ address: this.address as AddressModel })
      } else {
        // treat as corporate
        xhr = this.stores.corporates.update({ companyBusinessAddress: this.address as AddressModel })
      }
      xhr.then(this.addressUpdated)

      xhr.finally(() => {
        this.isLoading = false
      })
    } else {
      this.addressUpdated()
    }
  }

  async addressUpdated() {
    let identityRootVerified: CorporatesRootUserModel | ConsumersRootUserModel

    if (this.isConsumer) {
      await this.stores.consumers.get().then((res) => {
        identityRootVerified = res.data.rootUser

        if (identityRootVerified && !(identityRootVerified as ConsumersRootUserModel).emailVerified) {
          this.goToVerify()
        } else {
          this.goToIndex()
        }
      })
    } else if (this.isCorporate) {
      await this.stores.corporates.get().then((res) => {
        identityRootVerified = res.data.rootUser

        if (identityRootVerified && !(identityRootVerified as CorporatesRootUserModel).emailVerified) {
          this.goToVerify()
        } else {
          this.goToIndex()
        }
      })
    }
  }
}
</script>
