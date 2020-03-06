<template>
  <b-form @submit="submitForm" novalidate>
    <h3 class="text-center font-weight-light mb-5">
      Personal Details
    </h3>
    <b-form-group label="First Name:">
      <b-form-input v-model="form.rootName" :state="isInvalid($v.form.rootName)" placeholder="Name" />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Last Name:">
      <b-form-input :state="isInvalid($v.form.rootSurname)" v-model="form.rootSurname" placeholder="Last Name" />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Title:">
      <b-form-select :state="isInvalid($v.form.rootTitle)" v-model="form.rootTitle" :options="titleOptions" required />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Company Position:">
      <b-form-input
        :state="isInvalid($v.form.rootCompanyPosition)"
        v-model="form.rootCompanyPosition"
        placeholder="CFO"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>

    <b-form-group label="MOBILE NUMBER:">
      <vue-phone-number-input v-model="rootMobileNumber" @update="phoneUpdate" :only-countries="mobileCountries" default-country-code="MT"  />
      <b-form-invalid-feedback v-if="numberIsValid === false">
        This field must be a valid mobile number.
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-row class="mt-6">
      <b-col md="4">
        <b-button @click="goBack" variant="outline">
          <-
        </b-button>
      </b-col>
      <b-col class="text-right">
        <b-button variant="secondary" type="submit">
          continue
          <span class="pl-5">-></span>
        </b-button>
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit } from 'nuxt-property-decorator'
import { required, maxLength } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { Prop } from '~/node_modules/nuxt-property-decorator'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'
const Countries = require('~/static/json/countries.json')

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
      rootTitle: {
        required
      },
      rootCompanyPosition: {
        required
      },
      rootMobileCountryCode: {
        required
      },
      rootMobileNumber: {
        required
      }
    }
  }
})
export default class PersonalDetailsForm extends VueWithRouter {
  $v

  @Prop() readonly request!: CorporatesSchemas.CreateCorporateRequest

  mounted() {
    this.form.rootName = this.request.rootName
    this.form.rootSurname = this.request.rootSurname
    this.form.rootCompanyPosition = this.request.rootCompanyPosition
    this.form.rootMobileCountryCode = this.request.rootMobileCountryCode
    this.rootMobileNumber = this.request.rootMobileNumber
  }

  rootMobileNumber = ''
  numberIsValid: boolean | null = null

  get mobileCountries(): string[] {
    return Countries.map((_c) => {
      return _c['alpha-2']
    })
  }

  titleOptions = [
    { value: null, text: 'Mr / Ms / Mrs', disabled: true },
    { value: 'Mr', text: 'Mr' },
    { value: 'Mrs', text: 'Mrs' },
    { value: 'Ms', text: 'Ms' }
  ]

  public form = {
    rootName: '',
    rootSurname: '',
    rootTitle: null,
    rootCompanyPosition: '',
    rootMobileCountryCode: '',
    rootMobileNumber: ''
  }

  @Emit()
  submitForm(e) {
    e.preventDefault()

    if (this.$v.form) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
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

<style lang="scss" scoped>
#input-mobile-country-code {
  max-width: 100px;
}
</style>
