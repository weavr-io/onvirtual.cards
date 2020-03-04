<template>
  <b-form @submit="submitForm" novalidate>
    <h2 class="text-center font-weight-lighter mb-5">
      Company Details
    </h2>

    <b-form-group :state="isInvalid($v.form.companyName)" label="Company Name:">
      <b-form-input v-model="form.companyName" />
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.companyRegistrationNumber)" label="Company Registration Number:">
      <b-form-input v-model="form.companyRegistrationNumber" />
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.companyRegistrationAddress)" label="Company Registration Address:">
      <b-form-input v-model="form.companyRegistrationAddress" />
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.registrationCountry)" label="Registration Country:">
      <b-form-select v-model="form.registrationCountry" :options="countiesOptions" />
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.companyRegistrationDate)" label="Company Registration Date:">
      <b-form-input v-model="companyRegistrationDate" @update="updatedCompanyRegistrationDate" type="date" />
<!--      <b-form-datepicker v-model="companyRegistrationDate" @update="updatedCompanyRegistrationDate" :max="maxDate"-->
<!--                         :dropup="true" />-->
    </b-form-group>
    <b-form-row>
      <b-col>
        <b-form-checkbox v-model="form.acceptedTerms" :state="isInvalid($v.form.acceptedTerms)">
          I accept the <a href="https://www.onvirtual.cards/terms/" target="_blank" class="link">terms and use</a>
        </b-form-checkbox>
      </b-col>
    </b-form-row>
    <b-form-row class="mt-5">
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

  public maxDate = new Date()

  @Prop() readonly request!: CorporatesSchemas.CreateCorporateRequest

  mounted() {
    this.form.companyName = this.request.companyName
    this.form.companyRegistrationNumber = this.request.companyRegistrationNumber
    this.form.companyRegistrationAddress = this.request.companyRegistrationAddress
    this.form.registrationCountry = this.request.registrationCountry
    this.form.companyRegistrationDate = this.request.companyRegistrationDate
    this.form.supportEmail = this.request.rootEmail
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
<style lang="scss" scope>
.b-form-datepicker.form-control {
  > .btn {
    /*display: none;*/
  }
}
</style>
