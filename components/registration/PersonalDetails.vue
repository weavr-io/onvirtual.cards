<template>
  <b-form @submit="submitForm" novalidate>
    <h3 class="text-center font-weight-light mb-5">
      A few more steps
    </h3>
    <error-alert />
    <b-form-group label="First Name">
      <b-form-input v-model="$v.form.rootName.$model" :state="isInvalid($v.form.rootName)" placeholder="Name" />
      <b-form-invalid-feedback v-if="!$v.form.rootName.required">
        This field is required
      </b-form-invalid-feedback>
      <b-form-invalid-feedback v-if="!$v.form.rootName.maxLength">
        Name is too long.
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Last Name">
      <b-form-input
        :state="isInvalid($v.form.rootSurname)"
        v-model="$v.form.rootSurname.$model"
        placeholder="Last Name"
      />
      <b-form-invalid-feedback v-if="!$v.form.rootSurname.required">
        This field is required
      </b-form-invalid-feedback>
      <b-form-invalid-feedback v-if="!$v.form.rootSurname.maxLength">
        Surname is too long.
      </b-form-invalid-feedback>
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
        placeholder="C00000"
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
    <b-form-group :state="isInvalid($v.form.occupation)" label="Industry">
      <b-form-select
        v-model="$v.form.occupation.$model"
        :state="isInvalid($v.form.occupation)"
        :options="industryOccupationOptions"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.sourceOfFunds)" label="Source of Funds">
      <b-form-select
        v-model="$v.form.sourceOfFunds.$model"
        :state="isInvalid($v.form.sourceOfFunds)"
        :options="sourceOfFundsOptions"
      />
      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group v-if="shouldShowOtherSourceOfFunds" label="Other">
      <b-form-input
        :state="isInvalid($v.form.sourceOfFundsOther)"
        v-model="form.sourceOfFundsOther"
        placeholder="Specify Other Source of Funds"
      />
    </b-form-group>
    <b-form-group label="My position within the company is">
      <b-form-radio v-model="$v.form.rootCompanyPosition.$model" name="company-position" value="Representative">
        I am a representative (with the relevant power of attorney)
      </b-form-radio>
      <b-form-radio v-model="$v.form.rootCompanyPosition.$model" name="company-position" value="Director">
        I am a director
      </b-form-radio>
    </b-form-group>
    <p class="smaller text-muted">
      To open account on behalf of the company you need to be a director or authorised representative. To enable us to
      verify your identity, role and authorisation as part of our customer due diligence process, we will later ask you
      to upload the relevant ID and power of attorney documents.
    </p>

    <b-form-row class="mt-5">
      <b-col md="4">
        <b-button @click="goBack" variant="outline">
          <-
        </b-button>
      </b-col>
      <b-col class="text-right">
        <loader-button :is-loading="isLoadingRegistration" button-text="continue" class="text-right" />
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, namespace } from 'nuxt-property-decorator'
import { required, maxLength } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CorporatesStore from '~/store/modules/Corporates'
import { IndustryOccupation, IndustryOccupationOptions } from '~/api/Enums/Corporates/IndustryOccupation'
import { SourceOfFunds, SourceOfFundsOptions } from '~/api/Enums/Corporates/SourceOfFunds'
const Corporates = namespace(CorporatesStore.name)

const Countries = require('~/static/json/countries.json')

@Component({
  validations: {
    form: {
      rootName: {
        required,
        maxLength: maxLength(20)
      },
      rootSurname: {
        required,
        maxLength: maxLength(20)
      },
      rootCompanyPosition: {
        required
      },
      rootMobileCountryCode: {
        required
      },
      rootMobileNumber: {
        required
      },
      companyName: {
        required,
        maxLength: maxLength(100)
      },
      companyRegistrationNumber: {
        required,
        maxLength: maxLength(20)
      },
      registrationCountry: {
        required,
        maxLength: maxLength(2)
      },
      occupation: {
        required
      },
      sourceOfFunds: {
        required
      },
      sourceOfFundsOther: {}
    }
  },
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  }
})
export default class PersonalDetailsForm extends VueWithRouter {
  $v

  @Corporates.Getter isLoadingRegistration

  rootMobileNumber = ''
  numberIsValid: boolean | null = null

  get mobileCountries(): string[] {
    return Countries.map((_c) => {
      return _c['alpha-2']
    })
  }

  public form: {
    companyName: string
    companyRegistrationNumber: string
    registrationCountry: string
    rootName: string
    rootSurname: string
    rootCompanyPosition: string
    rootMobileCountryCode: string
    rootMobileNumber: string
    occupation: IndustryOccupation | null
    sourceOfFunds: SourceOfFunds | null
    sourceOfFundsOther: string
  } = {
    rootName: '',
    rootSurname: '',
    rootCompanyPosition: '',
    rootMobileCountryCode: '',
    rootMobileNumber: '',
    companyName: '',
    companyRegistrationNumber: '',
    registrationCountry: '',
    sourceOfFunds: null,
    sourceOfFundsOther: '',
    occupation: null
  }

  get countiesOptions() {
    return Countries.map((_c) => {
      return {
        text: _c.name,
        value: _c['alpha-2']
      }
    })
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

  get industryOccupationOptions() {
    return IndustryOccupationOptions
  }

  get sourceOfFundsOptions() {
    return SourceOfFundsOptions
  }
}
</script>

<style lang="scss" scoped>
#input-mobile-country-code {
  max-width: 100px;
}
</style>
