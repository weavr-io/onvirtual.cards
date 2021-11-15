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
          </template>
          <template v-if="isCorporate">
            <b-form novalidate @submit="doUpdateCorporate">
              <error-alert />
              <b-form-row>
                <b-col>
                  <b-form-group label="FIRST NAME">
                    <b-form-input :value="rootName" class="form-control" placeholder="John" disabled readonly />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="LAST NAME">
                    <b-form-input :value="rootSurname" class="form-control" placeholder="Doe" disabled readonly />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col>
                  <b-form-group label="E-Mail">
                    <b-form-input
                      v-model="updateCorporate.email"
                      :state="isInvalid($v.updateCorporate.email)"
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
import BaseMixin from '~/minixs/BaseMixin'
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'
import { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/UpdateConsumerRequest'
import { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'

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
    }
  }
})
export default class Profile extends mixins(BaseMixin) {
  numberIsValid: boolean | null = null
  updateConsumer!: UpdateConsumerRequest
  updateCorporate!: UpdateCorporateRequest

  isLoading: boolean = false

  mobile!: {
    countryCode: string
    number: string
  }

  asyncData({ store }) {
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
      const _corporate = corporatesStore(store).corporate

      const _parsedNumber = parsePhoneNumberFromString(
        _corporate!.rootUser?.mobile.countryCode! + _corporate!.rootUser?.mobile.number!
      )

      const _updateCorporateRequest: UpdateCorporateRequest = {
        mobile: {
          countryCode: _corporate!.rootUser.mobile.countryCode,
          number: _corporate!.rootUser.mobile.number
        },
        email: _corporate?.rootUser.email
      }

      return {
        updateCorporate: _updateCorporateRequest,
        mobile: {
          countryCode: _parsedNumber?.country,
          number: _corporate?.rootUser.mobile.number
        }
      }
    }
  }

  consumerPhoneUpdate(number) {
    this.$set(this.mobile, 'number', number.phoneNumber)
    this.$set(this.mobile, 'countryCode', '+' + number.countryCallingCode)
    this.updateConsumer.mobile = { ...this.mobile }
    this.numberIsValid = number.isValid
  }

  corporatePhoneUpdate(number) {
    this.$set(this.mobile, 'number', number.phoneNumber)
    this.$set(this.mobile, 'countryCode', '+' + number.countryCallingCode)

    this.updateCorporate.mobile = { ...this.mobile }

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

    this.stores.consumers.update(this.updateConsumer).finally(() => {
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

    this.stores.corporates.updateUser(this.updateCorporate).finally(() => {
      this.isLoading = false
    })
  }
}
</script>
