<template>
  <b-form @submit="submitForm" novalidate>
    <h2 class="text-center font-weight-lighter mb-5">
      Personal Details
    </h2>
    <b-form-group :state="isInvalid($v.form.rootName)" label="First Name:">
      <b-form-input v-model="form.rootName" placeholder="Name" />
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.rootSurname)" label="Last Name:">
      <b-form-input v-model="form.rootSurname" placeholder="Last Name" />
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.rootTitle)" label="Title:">
      <b-form-select v-model="form.rootTitle" :options="titleOptions" />
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.rootCompanyPosition)" label="Company Position:">
      <b-form-input v-model="form.rootCompanyPosition" placeholder="CFO" />
    </b-form-group>
    <label class="d-block">MOBILE NUMBER:</label>
    <vue-phone-number-input v-model="form.rootMobileNumber" @update="phoneUpdate" />
    <b-form-row class="mt-5">
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
    this.form.rootMobileNumber = this.request.rootMobileNumber
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

  phoneUpdate(number){
    this.form.rootMobileCountryCode = number.countryCallingCode
    this.form.rootMobileNumber = number.formatNational
    console.log(number.isValid)
  }
}
</script>

<style lang="scss" scoped>
#input-mobile-country-code {
  max-width: 100px;
}
</style>
