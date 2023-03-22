<template>
  <b-col lg="6" md="8" offset-lg="3" offset-md="2">
    <div class="text-center pb-5">
      <img alt="onvirtual.cards" class="d-inline-block align-top" src="/img/logo.svg" width="200" />
    </div>
    <b-card body-class="p-card">
      <h3 class="text-center font-weight-light mb-4">Add your phone number</h3>
      <p class="text-center mb-5">
        We need your phone number to send you one-time passwords when logging in. we will not share this with anyone.
      </p>
      <b-form novalidate @submit.prevent="submitForm">
        <b-form-group label="MOBILE NUMBER">
          <vue-phone-number-input
            v-model="rootMobileNumber"
            :border-radius="0"
            :error="numberIsValid === false"
            :only-countries="mobileCountries"
            color="#6C1C5C"
            default-country-code="GB"
            error-color="#F50E4C"
            valid-color="#6D7490"
            @update="phoneUpdate"
          />
          <b-form-invalid-feedback v-if="numberIsValid === false" force-show style="position: absolute">
            This field must be a valid mobile number.
          </b-form-invalid-feedback>
        </b-form-group>
        <loader-button :is-loading="isLoading" button-text="save number" class="text-center mt-5" />
      </b-form>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import ValidationMixin from '~/mixins/ValidationMixin'
import BaseMixin from '~/mixins/BaseMixin'
import { DeepNullable } from '~/global'
import { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/UpdateConsumerRequest'
import { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'
import { MobileModel } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'

@Component({
  layout: 'auth',
  validations: {
    registrationRequest: {
      rootUser: {
        mobile: {
          countryCode: {
            required,
          },
          number: {
            required,
          },
        },
      },
    },
  },
  components: {
    LoaderButton: () => import('~/components/LoaderButton.vue'),
  },
})
export default class LoginPage extends mixins(ValidationMixin, BaseMixin) {
  isLoading: boolean = false

  rootMobileNumber = ''
  numberIsValid: boolean | null = null

  updateRequest: DeepNullable<{ mobile: MobileModel }> = {
    mobile: {
      number: null,
      countryCode: '+356',
    },
  }

  get consumerStore() {
    return this.stores.consumers
  }

  submitForm(e) {
    this.isLoading = true

    try {
      e.preventDefault()

      if (this.numberIsValid === null) {
        this.numberIsValid = false
      }

      if (this.$v.$anyError || !this.numberIsValid) {
        this.isLoading = false
        return null
      }

      this.isConsumer
        ? this.stores.consumers.update(this.updateRequest as UpdateConsumerRequest)
        : this.stores.corporates.update(this.updateRequest as UpdateCorporateRequest)

      this.$router.push('/register/verify/mobile')
    } catch (error) {
      this.showErrorToast(error)
    } finally {
      this.isLoading = false
    }
  }

  phoneUpdate(number) {
    this.updateRequest.mobile!.countryCode = `+${number.countryCallingCode}`
    this.updateRequest.mobile!.number = number.nationalNumber
    this.numberIsValid = number.isValid
  }
}
</script>
