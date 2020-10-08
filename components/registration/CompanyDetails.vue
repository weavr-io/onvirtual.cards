<template>
  <b-form @submit="submitForm" novalidate>
    <h3 class="text-center font-weight-light mb-5">
      Company Details
    </h3>
    <error-alert/>
    <b-form-group label="Company Name">
      <b-form-input
        :state="isInvalid($v.form.companyName)"
        v-model="$v.form.companyName.$model"
        placeholder="Company Name"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Company Registration Number">
      <b-form-input
        :state="isInvalid($v.form.companyRegistrationNumber)"
        v-model="$v.form.companyRegistrationNumber.$model"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Company Registration Address">
      <b-form-textarea
        :state="isInvalid($v.form.companyRegistrationAddress)"
        v-model="$v.form.companyRegistrationAddress.$model"
        rows="4"
        placeholder="Street Name, City"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Registration Country">
      <b-form-select
        :state="isInvalid($v.form.registrationCountry)"
        v-model="$v.form.registrationCountry.$model"
        :options="countiesOptions"
        placeholder="Registration Country"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Company Registration Date">
      <flat-pickr
        v-model="companyRegistrationDate"
        :config="config"
        @on-close="updatedCompanyRegistrationDate"
        class="form-control bg-transparent"
      />
      <b-form-invalid-feedback :state="isInvalid($v.form.companyRegistrationDate)">
        This field is required.
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-row>
      <b-col>
        <b-form-group>
          <b-form-checkbox v-model="$v.form.acceptedTerms.$model" :state="isInvalid($v.form.acceptedTerms)">
            I accept the <a href="https://www.onvirtual.cards/terms/business" target="_blank" class="text-decoration-underline text-muted">terms of use</a> and <a href="https://www.onvirtual.cards/policy/" target="_blank" class="text-decoration-underline text-muted">privacy policy</a>
          </b-form-checkbox>
          <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row class="mt-5">
      <b-col md="4">
        <b-button @click="goBack" variant="outline">
          <-
        </b-button>
      </b-col>
      <b-col>
        <loader-button :is-loading="isLoadingRegistration" button-text="Finish" class="text-right" />
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, mixins, namespace } from 'nuxt-property-decorator'
import { required, maxLength, sameAs, maxValue } from 'vuelidate/lib/validators'
import BaseMixin from '~/minixs/BaseMixin'

const Countries = require('~/static/json/countries.json')
@Component({
  validations: {
    form: {
      companyName: {
        required,
        maxLength: maxLength(100)
      },
      companyRegistrationNumber: {
        required,
        maxLength: maxLength(20)
      },
      companyRegistrationAddress: {
        required,
        maxLength: maxLength(150)
      },
      registrationCountry: {
        required,
        maxLength: maxLength(2)
      },
      companyRegistrationDate: {
        required,
        maxValue: maxValue(new Date())
      },
      acceptedTerms: {
        required,
        sameAs: sameAs(() => true)
      }
    }
  },
  components: {
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),

  }
})
export default class CompanyDetailsForm extends mixins(BaseMixin) {
  $v

  public maxDate = new Date()

  get isLoadingRegistration(){
    return this.stores.corporates.isLoadingRegistration
  }

  public companyRegistrationDate = ''

  get config() {
    return {
      wrap: false,
      enableTime: false,
      altInput: true,
      altFormat: 'd/m/Y',
      maxDate: new Date(),
      locale: {
        firstDayOfWeek: 1
      }
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

  public form: {
    companyName: string
    companyRegistrationNumber: string
    companyRegistrationAddress: string
    registrationCountry: string
    companyRegistrationDate: null | number
    acceptedTerms: boolean
  } = {
    companyName: '',
    companyRegistrationNumber: '',
    companyRegistrationAddress: '',
    registrationCountry: '',
    companyRegistrationDate: null,
    acceptedTerms: false
  }

  @Emit()
  goBack(e) {
    e.preventDefault()
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

  updatedCompanyRegistrationDate(val) {
    const newDate = new Date(val)
    this.form.companyRegistrationDate = newDate.getTime()
  }
}
</script>
