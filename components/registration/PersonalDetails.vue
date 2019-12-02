<template>
  <b-form novalidate @submit="submitForm">
    <h2 class="text-center font-weight-lighter mb-5">
      Personal Details
    </h2>
    <b-form-group label="First Name:" :state="isInvalid($v.form.rootName)">
      <b-form-input v-model="form.rootName" />
    </b-form-group>
    <b-form-group label="Last Name:" :state="isInvalid($v.form.rootSurname)">
      <b-form-input v-model="form.rootSurname" />
    </b-form-group>
    <b-form-group label="Title:" :state="isInvalid($v.form.rootTitle)">
      <b-form-select v-model="form.rootTitle" :options="titleOptions" />
    </b-form-group>
    <b-form-group
      label="Company Position:"
      :state="isInvalid($v.form.rootCompanyPosition)"
    >
      <b-form-input v-model="form.rootCompanyPosition" />
    </b-form-group>
    <b-form-group
      label="Mobile Country Code:"
      :state="isInvalid($v.form.rootMobileCountryCode)"
    >
      <b-input-group prepend="+">
        <b-form-input v-model="form.rootMobileCountryCode" />
      </b-input-group>
    </b-form-group>
    <b-form-group
      label="Mobile Number:"
      :state="isInvalid($v.form.rootMobileNumber)"
    >
      <b-form-input v-model="form.rootMobileNumber" />
    </b-form-group>
    <b-form-row class="mt-5">
      <b-col class="text-center">
        <b-button variant="primary" type="submit">
          Continue
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

  titleOptions = [
    { value: 'Mr', text: 'Mr' },
    { value: 'Mrs', text: 'Mrs' },
    { value: 'Ms', text: 'Ms' }
  ]

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

    if (this.$v.form) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return null
      }
    }

    return this.form
  }
}
</script>
