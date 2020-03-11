<template>
  <b-form @submit="submitForm" novalidate>
    <h3 class="text-center font-weight-light mb-5">
      Company Details
    </h3>

    <b-form-group label="Company Name:">
      <b-form-input
        :state="isInvalid($v.form.companyName)"
        v-model="$v.form.companyName.$model"
        placeholder="Company Name"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Company Registration Number:">
      <b-form-input
        :state="isInvalid($v.form.companyRegistrationNumber)"
        v-model="$v.form.companyRegistrationNumber.$model"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Company Registration Address:">
      <b-form-textarea
        :state="isInvalid($v.form.companyRegistrationAddress)"
        v-model="$v.form.companyRegistrationAddress.$model"
        rows="4"
        placeholder="Street Name, City"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Registration Country:">
      <b-form-select
        :state="isInvalid($v.form.registrationCountry)"
        v-model="$v.form.registrationCountry.$model"
        :options="countiesOptions"
        placeholder="Registration Country"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Company Registration Date:">
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
            I accept the <a href="https://www.onvirtual.cards/terms/" target="_blank" class="link">terms and use</a>
          </b-form-checkbox>
          <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row class="mt-6">
      <b-col md="4">
        <b-button @click="goBack" variant="outline">
          <-
        </b-button>
      </b-col>
      <b-col>
        <loader-button :is-loading="isLoading" button-text="Finish" class="text-right" />
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, namespace } from 'nuxt-property-decorator'
import { required, maxLength, email, sameAs, maxValue } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CorporatesStore from '~/store/modules/Corporates'
import { Prop } from '~/node_modules/nuxt-property-decorator'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'

const Countries = require('~/static/json/countries.json')
const Corporates = namespace(CorporatesStore.name)
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
    LoaderButton: () => import('~/components/LoaderButton.vue')
  }
})
export default class CompanyDetailsForm extends VueWithRouter {
  $v

  public maxDate = new Date()

  @Prop() readonly request!: CorporatesSchemas.CreateCorporateRequest

  @Corporates.Getter isLoading

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
