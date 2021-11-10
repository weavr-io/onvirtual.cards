<template>
  <section class="py-5">
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <template v-if="isConsumer">
            <b-form novalidate @submit="doUpdateConsumer">
              <error-alert />
              <b-form-row>
                <b-col>
                  <b-form-group label="FIRST NAME">
                    <b-form-input :value="rootName" class="form-control" placeholder="John" readonly disabled />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="LAST NAME">
                    <b-form-input :value="rootSurname" class="form-control" placeholder="Doe" readonly disabled />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col>
                  <b-form-group label="E-Mail">
                    <b-form-input
                      v-model="updateConsumer.email"
                      :state="isInvalid($v.updateConsumer.email)"
                      class="form-control"
                      placeholder="example@email.com"
                    />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col>
                  <b-form-group label="MOBILE NUMBER">
                    <vue-phone-number-input
                      :value="mobile.number"
                      :error="numberIsValid === false"
                      :border-radius="0"
                      :default-country-code="mobile.countryCode"
                      color="#6C1C5C"
                      error-color="#F50E4C"
                      valid-color="#6D7490"
                      @update="consumerPhoneUpdate"
                    />
                    <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                      This field must be a valid mobile number.
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row class="my-4">
                <b-col class="text-center">
                  <b-link to="/profile/password/change" class="link">
                    Change password
                  </b-link>
                </b-col>
              </b-form-row>
              <b-row class="mt-5" align-v="center">
                <b-col class="text-center">
                  <loader-button :is-loading="isLoading" button-text="save" />
                </b-col>
              </b-row>
            </b-form>
            <pre>
              {{ consumer }}
            </pre>
          </template>
          <template v-if="isCorporate">
            <b-form novalidate @submit="doUpdateCorporate">
              <error-alert />
              <b-form-row>
                <b-col>
                  <b-form-group label="FIRST NAME">
                    <b-form-input v-model="updateCorporate.body.name" class="form-control" placeholder="John" />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="LAST NAME">
                    <b-form-input v-model="updateCorporate.body.surname" class="form-control" placeholder="Doe" />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col>
                  <b-form-group label="E-Mail">
                    <b-form-input
                      v-model="updateCorporate.body.email"
                      :state="isInvalid($v.updateCorporate.body.email)"
                      class="form-control"
                      placeholder="johndoe@email.com"
                    />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col>
                  <b-form-group label="MOBILE NUMBER">
                    <vue-phone-number-input
                      :value="mobile.mobileNumber"
                      :error="numberIsValid === false"
                      :border-radius="0"
                      :default-country-code="mobile.mobileCountryCode"
                      color="#6C1C5C"
                      error-color="#F50E4C"
                      valid-color="#6D7490"
                      @update="corporatePhoneUpdate"
                    />
                    <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                      This field must be a valid mobile number.
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row class="my-4">
                <b-col class="text-center">
                  <b-link to="/profile/password/change" class="link">
                    Change password
                  </b-link>
                </b-col>
              </b-form-row>
              <b-row class="mt-5" align-v="center">
                <b-col class="text-center">
                  <loader-button :is-loading="isLoading" button-text="save" />
                </b-col>
              </b-row>
            </b-form>
          </template>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'

import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { email, required } from 'vuelidate/lib/validators'

import { UpdateCorporateUserFullRequest } from '~/api/Requests/Corporates/UpdateCorporateUserFullRequest'
import BaseMixin from '~/minixs/BaseMixin'
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'
import { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/UpdateConsumerRequest'

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    updateConsumer: {
      mobile: {
        number: {
          required
        },
        countryCode: { required }
      },
      email: {
        required,
        email
      }
    },
    updateCorporate: {
      number: {
        required
      },
      countryCode: { required },
      email: {
        required,
        email
      }
    }
  }
})
export default class Profile extends mixins(BaseMixin) {
  numberIsValid: boolean | null = null
  updateConsumer!: UpdateConsumerRequest
  updateCorporate!: UpdateCorporateUserFullRequest

  isLoading: boolean = false

  mobile!: {
    countryCode: string
    number: string
  }

  async asyncData({ store }) {
    if (authStore(store).isConsumer) {
      const _consumer = consumersStore(store).consumer

      const _parsedNumber = parsePhoneNumberFromString(
        _consumer!.rootUser.mobile.countryCode + _consumer!.rootUser.mobile.number
      )

      const _updateConsumerRequest: UpdateConsumerRequest = {
        mobile: {
          countryCode: _consumer!.rootUser.mobile.countryCode,
          number: _consumer!.rootUser.mobile.number
        },
        email: _consumer?.rootUser.email
      }

      return {
        updateConsumer: _updateConsumerRequest,
        mobile: {
          countryCode: _parsedNumber?.country,
          number: _consumer?.rootUser.mobile.number
        }
      }
    } else if (authStore(store).isCorporate) {
      const _corporateUser = await corporatesStore(store).getUser({
        corporateId: _id,
        userId: _corporate.credential!.id
      })

      const _parsedNumber = parsePhoneNumberFromString(
        _corporateUser.data.mobileCountryCode! + _corporateUser.data.mobileNumber!
      )

      const _updateCorporateRequest: UpdateCorporateUserFullRequest = {
        corporateId: _id,
        userId: _corporate.credential!.id,
        body: {
          name: _corporateUser.data.name,
          surname: _corporateUser.data.surname,
          mobileCountryCode: _corporateUser.data.mobileCountryCode,
          mobileNumber: _corporateUser.data.mobileNumber,
          email: _corporateUser.data.email
        }
      }

      return {
        updateCorporate: _updateCorporateRequest,
        mobile: {
          mobileCountryCode: _parsedNumber?.country,
          mobileNumber: _corporateUser.data.mobileNumber
        }
      }
    }
  }

  consumerPhoneUpdate(number) {
    this.$set(this.mobile, 'number', number.formatNational ? number.formatNational : number.phoneNumber)
    this.updateConsumer.mobile!.number = number.phoneNumber
    this.numberIsValid = number.isValid
  }

  corporatePhoneUpdate(number) {
    this.$set(this.mobile, 'number', number.formatNational ? number.formatNational : number.phoneNumber)
    this.updateCorporate.mobile.number = number.phoneNumber
    this.numberIsValid = number.isValid
  }

  doUpdateConsumer(e) {
    e.preventDefault()

    if (this.numberIsValid === null) {
      this.numberIsValid = false
    }

    if (this.$v.updateConsumer) {
      this.$v.updateConsumer.$touch()
      if (this.$v.updateConsumer.$anyError || !this.numberIsValid) {
        return null
      }
    }

    this.isLoading = true

    this.stores.consumers.update(this.updateConsumer).then(() => {
      this.isLoading = false
    })
  }

  doUpdateCorporate(e) {
    e.preventDefault()

    if (this.numberIsValid === null) {
      this.numberIsValid = false
    }

    if (this.$v.updateCorporate) {
      this.$v.updateCorporate.$touch()
      if (this.$v.updateCorporate.$anyError || !this.numberIsValid) {
        return null
      }
    }

    this.isLoading = true

    this.stores.corporates.updateUser(this.updateCorporate).then(() => {
      this.isLoading = false
    })
  }
}
</script>
