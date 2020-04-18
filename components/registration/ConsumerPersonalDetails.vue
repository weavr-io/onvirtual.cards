<template>
  <b-form @submit="submitForm" novalidate>
    <h3 class="text-center font-weight-light mb-5">
      Personal Details
    </h3>
    <b-form-group label="First Name">
      <b-form-input v-model="form.rootName" :state="isInvalid($v.form.rootName)" placeholder="First Name" />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Last Name">
      <b-form-input :state="isInvalid($v.form.rootSurname)" v-model="form.rootSurname" placeholder="Last Name" />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="MOBILE NUMBER">
      <vue-phone-number-input
        v-model="rootMobileNumber"
        @update="phoneUpdate"
        :only-countries="mobileCountries"
        :border-radius="0"
        :error="numberIsValid === false"
        color="#6C1C5C"
        error-color="#F50E4C"
        valid-color="#6D7490"
        default-country-code="GB"
      />
      <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
        This field must be a valid mobile number.
      </b-form-invalid-feedback>
    </b-form-group>
    <b-row class="mt-6" align-v="center">
      <b-col md="4">
        <b-button @click="goBack" variant="outline" class="pl-0">
          <-
        </b-button>
      </b-col>
      <b-col class="text-right">
        <loader-button :is-loading="isLoading" button-text="finish" class="text-right" />
      </b-col>
    </b-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, namespace } from 'nuxt-property-decorator'
import { required, maxLength } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as ConsumersStore from '~/store/modules/Consumers'

const Countries = require('~/static/json/countries.json')

const Consumers = namespace(ConsumersStore.name)

@Component({
  validations: {
    form: {
      rootName: {
        required,
        maxLength: maxLength(100)
      },
      rootSurname: {
        required,
        maxLength: maxLength(100)
      },
      rootMobileCountryCode: {
        required
      },
      rootMobileNumber: {
        required
      }
    }
  },
  components: {
    LoaderButton: () => import('~/components/LoaderButton.vue')
  }
})
export default class PersonalDetailsForm extends VueWithRouter {
  $v

  rootMobileNumber = ''
  numberIsValid: boolean | null = null

  @Consumers.Getter isLoading!: boolean

  titleOptions = [
    { value: 'Mr', text: 'Mr' },
    { value: 'Mrs', text: 'Mrs' },
    { value: 'Ms', text: 'Ms' }
  ]

  get mobileCountries(): string[] {
    return Countries.map((_c) => {
      return _c['alpha-2']
    })
  }

  public form = {
    rootName: '',
    rootSurname: '',
    rootTitle: '',
    rootCompanyPosition: '',
    rootMobileCountryCode: '',
    rootMobileNumber: ''
  }

  @Emit()
  submitForm(e) {
    e.preventDefault()

    if (this.numberIsValid === null) {
      this.numberIsValid = false
    }

    if (this.$v.form) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError || !this.numberIsValid) {
        return null
      }
    }

    return this.form
  }

  @Emit()
  goBack(e) {
    e.preventDefault()
  }

  phoneUpdate(number) {
    this.form.rootMobileCountryCode = '+' + number.countryCallingCode
    this.form.rootMobileNumber = number.nationalNumber
    this.numberIsValid = number.isValid
  }
}
</script>
