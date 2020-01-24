<template>
  <b-form novalidate @submit="submitForm">
    <h2 class="text-center font-weight-lighter mb-5">
      Company Details
    </h2>

    <b-form-group label="Company Name:" :state="isInvalid($v.form.companyName)">
      <b-form-input v-model="form.companyName" />
    </b-form-group>
    <b-form-group label="Company Registration Number:" :state="isInvalid($v.form.companyRegistrationNumber)">
      <b-form-input v-model="form.companyRegistrationNumber" />
    </b-form-group>
    <b-form-group label="Company Registration Address:" :state="isInvalid($v.form.companyRegistrationAddress)">
      <b-form-input v-model="form.companyRegistrationAddress" />
    </b-form-group>
    <b-form-group label="Registration Country:" :state="isInvalid($v.form.registrationCountry)">
      <b-form-select v-model="form.registrationCountry" :options="countiesOptions" />
    </b-form-group>
    <b-form-group label="Company Registration Date:" :state="isInvalid($v.form.companyRegistrationDate)">
      <b-form-input v-model="companyRegistrationDate" type="date" @update="updatedCompanyRegistrationDate" />
    </b-form-group>
    <b-form-group label="Company Email:" :state="isInvalid($v.form.supportEmail)">
      <b-form-input v-model="form.supportEmail" type="email" />
    </b-form-group>
    <b-form-row>
      <b-col>
        <b-form-checkbox v-model="form.acceptedTerms" :state="isInvalid($v.form.acceptedTerms)">
          I accept the terms and use
        </b-form-checkbox>
      </b-col>
    </b-form-row>
    <b-form-row class="my-5">
      <b-col>
        <b-button variant="outline" @click="goBack"><-</b-button>
      </b-col>
      <b-col>
        <loader-button :is-loading="isLoading" button-text="Finish" class="text-right" />
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, namespace } from 'nuxt-property-decorator'
import { required, maxLength, email, sameAs } from 'vuelidate/lib/validators'
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
        required
      },
      supportEmail: {
        required,
        email
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

  @Prop() readonly request!: CorporatesSchemas.CreateCorporateRequest

  mounted() {
    this.form.companyName = this.request.companyName
    this.form.companyRegistrationNumber = this.request.companyRegistrationNumber
    this.form.companyRegistrationAddress = this.request.companyRegistrationAddress
    this.form.registrationCountry = this.request.registrationCountry
    this.form.companyRegistrationDate = this.request.companyRegistrationDate
    this.form.supportEmail = this.request.supportEmail
    this.form.acceptedTerms = this.request.acceptedTerms
  }

  @Corporates.Getter isLoading

  public companyRegistrationDate = ''

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
    supportEmail: string
    acceptedTerms: boolean
  } = {
    companyName: '',
    companyRegistrationNumber: '',
    companyRegistrationAddress: '',
    registrationCountry: '',
    companyRegistrationDate: null,
    supportEmail: '',
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
