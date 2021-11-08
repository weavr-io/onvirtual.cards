<template>
  <b-col md="6" offset-md="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <coming-soon-currencies />

    <b-card no-body class="overflow-hidden">
      <b-overlay :show="isLoadingRegistration" rounded opacity="0.6" spinner-small spinner-variant="primary">
        <b-card-body class="p-card">
          <div class="form-screens">
            <error-alert />
            <div class="form-screen">
              <b-form novalidate @submit.prevent="submitForm">
                <h3 class="text-center font-weight-light mb-5">
                  Register
                </h3>

                <b-form-group label="First Name">
                  <b-form-input
                    v-model="registrationRequest.name"
                    :state="isInvalid($v.registrationRequest.name)"
                    placeholder="First Name"
                  />
                  <b-form-invalid-feedback v-if="!$v.registrationRequest.name.required">
                    This field is required
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback v-if="!$v.registrationRequest.name.maxLength">
                    Name is too long.
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Last Name">
                  <b-form-input
                    v-model="registrationRequest.surname"
                    :state="isInvalid($v.registrationRequest.surname)"
                    placeholder="Last Name"
                  />
                  <b-form-invalid-feedback v-if="!$v.registrationRequest.surname.required">
                    This field is required
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback v-if="!$v.registrationRequest.surname.maxLength">
                    Surname is too long.
                  </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group label="Date of Birth">
                  <dob-picker
                    :value="dateOfBirth"
                    :placeholders="['Day', 'Month', 'Year']"
                    month-format="long"
                    show-labels="false"
                    select-class="form-control"
                    label-class="small flex-fill"
                    class="d-flex"
                    @input="updateDOB"
                    @change="updateDOB"
                  />
                  <b-form-invalid-feedback :state="isInvalid($v.registrationRequest.dateOfBirth)">
                    This field is required.
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group :state="isInvalid($v.registrationRequest.email)" label="Email">
                  <b-form-input
                    v-model="$v.registrationRequest.email.$model"
                    :state="isInvalid($v.registrationRequest.email)"
                    placeholder="name@email.com"
                    @input="delayTouch($v.registrationRequest.email)"
                  />
                  <b-form-invalid-feedback>Email address invalid.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="MOBILE NUMBER">
                  <vue-phone-number-input
                    v-model="rootMobileNumber"
                    :only-countries="mobileCountries"
                    :border-radius="0"
                    :error="numberIsValid === false"
                    color="#6C1C5C"
                    error-color="#F50E4C"
                    valid-color="#6D7490"
                    default-country-code="GB"
                    @update="phoneUpdate"
                  />
                  <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                    This field must be a valid mobile number.
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group :state="isInvalid($v.registrationRequest.occupation)" label="Industry*">
                  <b-form-select
                    v-model="$v.registrationRequest.occupation.$model"
                    :state="isInvalid($v.registrationRequest.occupation)"
                    :options="industryOccupationOptions"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group :state="isInvalid($v.registrationRequest.sourceOfFunds)" label="Source of Funds*">
                  <b-form-select
                    v-model="$v.registrationRequest.sourceOfFunds.$model"
                    :state="isInvalid($v.registrationRequest.sourceOfFunds)"
                    :options="sourceOfFundsOptions"
                  />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group v-if="shouldShowOtherSourceOfFunds" label="Other">
                  <b-form-input
                    v-model="registrationRequest.sourceOfFundsOther"
                    :state="isInvalid($v.registrationRequest.sourceOfFundsOther)"
                    placeholder="Specify Other Source of Funds"
                  />
                </b-form-group>
                <client-only placeholder="Loading...">
                  <div :class="{ 'is-dirty': $v.registrationRequest.$dirty }">
                    <label class="d-block">PASSWORD</label>
                    <weavr-password-input
                      ref="passwordField"
                      :options="{ placeholder: '****', classNames: { empty: 'is-invalid' } }"
                      :base-style="passwordBaseStyle"
                      class-name="sign-in-password"
                      name="password"
                      required="true"
                      @onKeyUp="checkOnKeyUp"
                    />
                    <small class="form-text text-muted">Minimum 8, Maximum 50 characters.</small>
                  </div>
                </client-only>
                <b-form-row class="small mt-3 text-muted">
                  <b-col>
                    <b-form-group>
                      <b-form-checkbox
                        v-model="$v.registrationRequest.acceptedTerms.$model"
                        :state="isInvalid($v.registrationRequest.acceptedTerms)"
                        unchecked-value="FALSE"
                        value="TRUE"
                      >
                        I accept the
                        <a
                          href="https://www.onvirtual.cards/terms/consumer"
                          target="_blank"
                          class="text-decoration-underline text-muted"
                          >terms of use</a
                        >
                        and
                        <a
                          href="https://www.onvirtual.cards/policy/"
                          target="_blank"
                          class="text-decoration-underline text-muted"
                          >privacy policy</a
                        >
                      </b-form-checkbox>
                      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <div v-if="isRecaptchaEnabled" class="mt-2 d-flex justify-content-center">
                  <recaptcha class="mx-auto" />
                </div>
                <b-row class="mt-4" align-v="center">
                  <b-col class="text-center">
                    <loader-button :is-loading="isLoadingRegistration" button-text="continue" />
                  </b-col>
                </b-row>
              </b-form>
            </div>
          </div>
        </b-card-body>
      </b-overlay>
    </b-card>
  </b-col>
</template>
<script lang="ts">
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { email, maxLength, required, sameAs } from 'vuelidate/lib/validators'

import config from '~/config'
import { CreateConsumerRequest } from '~/api/Requests/Consumers/CreateConsumerRequest'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import { CreatePassword } from '~/api/Requests/Auth/CreatePassword'
import { CreatePasswordIdentity } from '~/api/Requests/Auth/CreatePasswordIdentity'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import { ValidatePasswordRequest } from '~/api/Requests/Auth/ValidatePasswordRequest'
import { Schemas } from '~/api/Schemas'
import BaseMixin from '~/minixs/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { BooleanString } from '~/api/Generic/BooleanString'
import { SourceOfFunds, SourceOfFundsOptions } from '~/api/Enums/Corporates/SourceOfFunds'
import { IndustryOccupationOptions } from '~/api/Enums/Corporates/IndustryOccupation'

const Countries = require('~/static/json/countries.json')

const touchMap = new WeakMap()

@Component({
  layout: 'auth',
  validations: {
    registrationRequest: {
      email: {
        required,
        email
      },
      name: {
        required,
        maxLength: maxLength(20)
      },
      surname: {
        required,
        maxLength: maxLength(20)
      },
      mobileCountryCode: {
        required
      },
      mobileNumber: {
        required
      },
      dateOfBirth: {
        required
      },
      acceptedTerms: {
        required,
        sameAs: sameAs(() => BooleanString.TRUE)
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
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    RegisterForm: () => import('~/components/registration/RegisterForm1.vue'),
    ConsumerPersonalDetailsForm: () => import('~/components/registration/ConsumerPersonalDetails.vue'),
    RegistrationNav: () => import('~/components/registration/Nav.vue'),
    ComingSoonCurrencies: () => import('~/components/comingSoonCurrencies.vue'),
    DobPicker: () => import('~/components/fields/dob-picker.vue'),
    WeavrPasswordInput
  }
})
export default class ConsumerRegistrationPage extends mixins(BaseMixin) {
  get consumer(): Consumer | null {
    return this.stores.consumers.consumer
  }

  private $recaptcha: any

  @Ref('passwordField')
  passwordField!: WeavrPasswordInput

  rootMobileNumber = ''
  numberIsValid: boolean | null = null

  isLoadingRegistration: boolean = false

  dateOfBirth = null

  public registrationRequest: CreateConsumerRequest = {
    profileId: 0,
    name: '',
    surname: '',
    email: '',
    mobileCountryCode: '',
    mobileNumber: '',
    baseCurrency: 'EUR',
    dateOfBirth: null,
    occupation: null,
    sourceOfFunds: null,
    sourceOfFundsOther: '',
    acceptedTerms: BooleanString.FALSE
  }

  get industryOccupationOptions() {
    return IndustryOccupationOptions
  }

  get sourceOfFundsOptions() {
    return SourceOfFundsOptions
  }

  get shouldShowOtherSourceOfFunds(): boolean {
    return this.registrationRequest.sourceOfFunds === SourceOfFunds.OTHER
  }

  public password: string = ''

  mounted() {
    this.registrationRequest.profileId = config.profileId.consumers
  }

  doRegister() {
    this.isLoadingRegistration = true
    this.stores.consumers
      .create(this.registrationRequest)
      .then(this.doCreatePasswordIdentity.bind(this))
      .catch(this.registrationFailed.bind(this))
  }

  registrationFailed(err) {
    this.isLoadingRegistration = false
    const _errCode = err.response.data.errorCode

    if (_errCode === 'USERNAME_NOT_UNIQUE' || _errCode === 'EMAIL_NOT_UNIQUE') {
    } else {
      this.$weavrToastError(_errCode)
    }

    window.scrollTo(0, 0)
  }

  doCreatePasswordIdentity() {
    const _req: CreatePasswordIdentity = {
      id: this.consumer!.id.id,
      request: {
        profileId: this.registrationRequest.profileId
      }
    }
    this.stores.auth
      .createPasswordIdentity(_req)
      .then(this.doCreatePassword.bind(this), this.registrationFailed.bind(this))
  }

  doCreatePassword() {
    const _req: CreatePassword = {
      id: this.consumer!.id.id,
      request: {
        credentialType: 'ROOT',
        identityId: this.consumer!.id.id,
        password: {
          value: this.password
        }
      }
    }

    this.stores.auth.createPassword(_req).then(this.waitAndDoLogin.bind(this), this.registrationFailed.bind(this))
  }

  waitAndDoLogin() {
    this.sleep(2000).then(this.doLogin.bind(this))
  }

  doLogin() {
    const _loginRequest: Schemas.LoginRequest = {
      code: this.registrationRequest.email,
      password: this.password
    }

    this.stores.auth.authenticate(_loginRequest).then(this.goToAdressInputScreen.bind(this))
  }

  // sendVerifyEmail() {
  //   ConsumerHelpers.sendVerificationCodeEmail(this.$store, {
  //     consumerId: this.consumer.id.id,
  //     request: {
  //       emailAddress: this.registrationRequest.email
  //     }
  //   }).then(this.goToAdressInputScreen.bind(this), this.registrationFailed.bind(this))
  // }

  goToAdressInputScreen() {
    this.isLoadingRegistration = false
    this.$router.push({ path: '/profile/address' })
  }

  get passwordBaseStyle(): SecureElementStyleWithPseudoClasses {
    return {
      color: '#495057',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      fontFamily: "'Be Vietnam', sans-serif",
      fontWeight: '400',
      lineHeight: '24px',
      margin: '0',
      padding: '6px 12px',
      textIndent: '0px',
      '::placeholder': {
        color: '#B6B9C7',
        fontWeight: '400'
      }
    }
  }

  async submitForm() {
    try {
      if (this.numberIsValid === null) {
        this.numberIsValid = false
      }

      if (this.$v.registrationRequest) {
        this.$v.registrationRequest.$touch()
        if (this.$v.registrationRequest.$anyError || !this.numberIsValid) {
          return null
        }
      }

      if (this.isRecaptchaEnabled) {
        const token = await this.$recaptcha.getResponse()
        console.log('ReCaptcha token:', token)
        await this.$recaptcha.reset()
      }

      this.passwordField.createToken().then(
        (tokens) => {
          if (tokens.tokens.password !== '') {
            this.password = tokens.tokens.password

            this.validatePassword()
          } else {
            return null
          }
        },
        (e) => {
          console.error(e)
          return null
        }
      )
    } catch (error) {
      console.log('Login error:', error)
    }
  }

  validatePassword() {
    const _request: ValidatePasswordRequest = {
      identityProfileId: config.profileId.corporates ? config.profileId.corporates : '',
      credentialType: 'ROOT',
      password: {
        value: this.password
      }
    }

    this.stores.auth.validatePassword(_request).then(this.doRegister.bind(this))
  }

  checkOnKeyUp(e) {
    console.log('checkOnKeyUp')
    if (e.key === 'Enter') {
      e.preventDefault()
      this.submitForm()
    }
  }

  phoneUpdate(number) {
    this.registrationRequest.mobileCountryCode = '+' + number.countryCallingCode
    this.registrationRequest.mobileNumber = number.nationalNumber
    this.numberIsValid = number.isValid
    console.log(number)
  }

  get mobileCountries(): string[] {
    return Countries.map((_c) => {
      return _c['alpha-2']
    })
  }

  delayTouch($v) {
    $v.$reset()
    if (touchMap.has($v)) {
      clearTimeout(touchMap.get($v))
    }
    touchMap.set($v, setTimeout($v.$touch, 1000))
  }

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

  updateDOB(val) {
    console.log(val)
    this.registrationRequest.dateOfBirth = {
      year: val.getFullYear(),
      month: val.getMonth() + 1,
      day: val.getDate()
    }
  }

  get isRecaptchaEnabled(): boolean {
    return typeof process.env.RECAPTCHA !== 'undefined'
  }
}
</script>
