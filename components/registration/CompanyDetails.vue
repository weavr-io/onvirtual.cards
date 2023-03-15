<template>
  <b-form novalidate @submit="submitForm">
    <h3 class="text-center font-weight-light mb-5">Company Details</h3>
    <error-alert />
    <b-form-group label="Company Name">
      <b-form-input
        v-model="$v.form.companyName.$model"
        :state="validation.isInvalid($v.form.companyName)"
        placeholder="Company Name"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Company Registration Number">
      <b-form-input
        v-model="$v.form.companyRegistrationNumber.$model"
        :state="validation.isInvalid($v.form.companyRegistrationNumber)"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Company Registration Address">
      <b-form-textarea
        v-model="$v.form.companyRegistrationAddress.$model"
        :state="validation.isInvalid($v.form.companyRegistrationAddress)"
        rows="4"
        placeholder="Street Name, City"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Registration Country">
      <b-form-select
        v-model="$v.form.registrationCountry.$model"
        :state="validation.isInvalid($v.form.registrationCountry)"
        :options="countiesOptions"
        placeholder="Registration Country"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Company Registration Date">
      <flat-pickr
        v-model="companyRegistrationDate"
        :config="config"
        class="form-control bg-transparent"
        @on-close="updatedCompanyRegistrationDate"
      />
      <b-form-invalid-feedback :state="validation.isInvalid($v.form.companyRegistrationDate)">
        This field is required.
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-row>
      <b-col>
        <b-form-group>
          <b-form-checkbox v-model="$v.form.acceptedTerms.$model" :state="validation.isInvalid($v.form.acceptedTerms)">
            I accept the
            <a
              href="https://www.onvirtual.cards/terms/business"
              target="_blank"
              class="text-decoration-underline text-muted"
              >terms of use</a
            >
            and
            <a href="https://www.onvirtual.cards/policy/" target="_blank" class="text-decoration-underline text-muted"
              >privacy policy</a
            >
          </b-form-checkbox>
          <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row class="mt-5">
      <b-col md="4">
        <b-button variant="outline" @click="goBack"> <- </b-button>
      </b-col>
      <b-col>
        <loader-button :is-loading="isLoadingRegistration" button-text="Finish" class="text-right" />
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit } from 'nuxt-property-decorator'
import { maxLength, maxValue, required, sameAs } from 'vuelidate/lib/validators'
import Vue from 'vue'
import { useBase } from '~/composables/useBase'
import { useValidation } from '~/composables/useValidation'

const Countries = require('~/static/json/countries.json')
@Component({
  validations: {
    form: {
      companyName: {
        required,
        maxLength: maxLength(100),
      },
      companyRegistrationNumber: {
        required,
        maxLength: maxLength(20),
      },
      companyRegistrationAddress: {
        required,
        maxLength: maxLength(150),
      },
      registrationCountry: {
        required,
        maxLength: maxLength(2),
      },
      companyRegistrationDate: {
        required,
        maxValue: maxValue(new Date()),
      },
      acceptedTerms: {
        required,
        sameAs: sameAs(() => true),
      },
    },
  },
  components: {
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
  },
})
export default class CompanyDetailsForm extends Vue {
  base = useBase(this)
  validation = useValidation()

  $v

  public maxDate = new Date()

  get isLoadingRegistration() {
    return this.base.stores.corporates.isLoadingRegistration
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
        firstDayOfWeek: 1,
      },
    }
  }

  get countiesOptions() {
    return Countries.map((_c) => {
      return {
        text: _c.name,
        value: _c['alpha-2'],
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
    acceptedTerms: false,
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
