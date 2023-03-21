<template>
  <b-col md="8" offset-md="2" lg="6" offset-lg="3">
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
                <h3 class="text-center font-weight-light mb-5">Register</h3>

                <b-form-group label="First Name*">
                  <b-form-input
                    v-model="registrationRequest.rootUser.name"
                    :state="isInvalid($v.registrationRequest.rootUser.name)"
                    placeholder="First Name"
                  />
                  <b-form-invalid-feedback v-if="!$v.registrationRequest.rootUser.name.required">
                    This field is required
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback v-if="!$v.registrationRequest.rootUser.name.maxLength">
                    Name is too long.
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Last Name*">
                  <b-form-input
                    v-model="registrationRequest.rootUser.surname"
                    :state="isInvalid($v.registrationRequest.rootUser.surname)"
                    placeholder="Last Name"
                  />
                  <b-form-invalid-feedback v-if="!$v.registrationRequest.rootUser.surname.required">
                    This field is required
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback v-if="!$v.registrationRequest.rootUser.surname.maxLength">
                    Surname is too long.
                  </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group label="Date of Birth*">
                  <dob-picker
                    :placeholders="['Day', 'Month', 'Year']"
                    month-format="long"
                    show-labels="false"
                    select-class="form-control"
                    label-class="small flex-fill"
                    class="d-flex"
                    @input="updateDOB"
                    @change="updateDOB"
                  />
                  <b-form-invalid-feedback :state="isInvalid($v.registrationRequest.rootUser.dateOfBirth)">
                    This field is required.
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group :state="isInvalid($v.registrationRequest.rootUser.email)" label="Email*">
                  <b-form-input
                    v-model="$v.registrationRequest.rootUser.email.$model"
                    :state="isInvalid($v.registrationRequest.rootUser.email)"
                    placeholder="name@email.com"
                    @input="delayTouch($v.registrationRequest.rootUser.email)"
                  />
                  <b-form-invalid-feedback>Email address invalid.</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="MOBILE NUMBER*">
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
                <b-form-group :state="isInvalid($v.registrationRequest.rootUser.occupation)" label="Industry*">
                  <b-form-select
                    v-model="$v.registrationRequest.rootUser.occupation.$model"
                    :state="isInvalid($v.registrationRequest.rootUser.occupation)"
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
                    <label class="d-block">PASSWORD*</label>
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

import { AxiosResponse } from 'axios'

import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import BaseMixin from '~/mixins/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { IndustryTypeSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/IndustryTypeSelectConst'
import { SourceOfFundsSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/SourceOfFundsSelectConst'
import { CreateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/CreateConsumerRequest'
import { ConsumerSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/ConsumerSourceOfFundTypeEnum'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { CreatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/CreatePasswordRequestModel'
import { LoginWithPasswordRequest } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPasswordRequest'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import ValidationMixin from '~/mixins/ValidationMixin'
import { DeepNullable, RecursivePartial } from '~/global'

const Countries = require('~/static/json/countries.json')

const touchMap = new WeakMap()

@Component({
  layout: 'auth',
  validations: {
    registrationRequest: {
      rootUser: {
        name: {
          required,
          maxLength: maxLength(20),
        },
        surname: {
          required,
          maxLength: maxLength(20),
        },
        email: {
          required,
          email,
        },
        mobile: {
          countryCode: {
            required,
          },
          number: {
            required,
          },
        },
        occupation: {
          required,
        },
        dateOfBirth: {
          day: {
            required,
          },
          month: {
            required,
          },
          year: {
            required,
          },
        },
      },
      acceptedTerms: {
        required,
        sameAs: sameAs(() => true),
      },
      sourceOfFunds: {
        required,
      },
      sourceOfFundsOther: {},
    },
  },
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    ConsumerPersonalDetailsForm: () => import('~/components/registration/ConsumerPersonalDetails.vue'),
    RegistrationNav: () => import('~/components/registration/Nav.vue'),
    ComingSoonCurrencies: () => import('~/components/comingSoonCurrencies.vue'),
    DobPicker: () => import('~/components/fields/dob-picker.vue'),
    WeavrPasswordInput,
  },
  middleware: 'accessCodeVerified',
})
export default class ConsumerRegistrationPage extends mixins(BaseMixin, ValidationMixin) {
  // public password: string = ''

  private $recaptcha: any

  @Ref('passwordField')
  passwordField!: WeavrPasswordInput

  rootMobileNumber = ''
  numberIsValid: boolean | null = null

  public registrationRequest: DeepNullable<RecursivePartial<CreateConsumerRequest> & { password: string }> = {
    profileId: this.$config.profileId.consumers,
    tag: 'tag',
    rootUser: {
      name: null,
      surname: null,
      email: null,
      mobile: {
        number: null,
        countryCode: '+356',
      },
      dateOfBirth: {
        day: null,
        month: null,
        year: null,
      },
      occupation: null,
    },
    baseCurrency: CurrencyEnum.EUR,
    ipAddress: null,
    acceptedTerms: false,
    sourceOfFunds: null,
    sourceOfFundsOther: null,
    password: null,
  }

  get industryOccupationOptions() {
    return IndustryTypeSelectConst
  }

  get sourceOfFundsOptions() {
    return SourceOfFundsSelectConst
  }

  get shouldShowOtherSourceOfFunds(): boolean {
    return this.registrationRequest.sourceOfFunds === ConsumerSourceOfFundTypeEnum.OTHER
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
        fontWeight: '400',
      },
    }
  }

  get mobileCountries(): string[] {
    return Countries.map((_c) => {
      return _c['alpha-2']
    })
  }

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

  get isRecaptchaEnabled(): boolean {
    return typeof process.env.RECAPTCHA !== 'undefined'
  }

  get isLoadingRegistration(): boolean {
    return this.stores.consumers.isLoadingRegistration
  }

  fetch() {
    this.$apiMulti.ipify.get().then((ip) => {
      this.registrationRequest.ipAddress = ip.data.ip
    })
  }

  async submitForm() {
    this.stores.errors.RESET_ERROR()
    try {
      this.$v.$touch()

      if (this.numberIsValid === null) {
        this.numberIsValid = false
      }

      if (this.$v.$invalid) {
        return
      }

      if (this.isRecaptchaEnabled) {
        const token = await this.$recaptcha.getResponse()
        await this.$recaptcha.reset()
      }

      this.passwordField.createToken().then(
        (tokens) => {
          if (tokens.tokens.password !== '') {
            this.registrationRequest.password = tokens.tokens.password
            this.doRegister()
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
      this.showErrorToast(error)
    }
  }

  doRegister() {
    this.stores.consumers.SET_IS_LOADING_REGISTRATION(true)
    this.stores.consumers
      .create(this.registrationRequest as CreateConsumerRequest)
      .then(this.onConsumerCreated)
      .catch(this.registrationFailed)
      .finally(this.stopRegistrationLoading)
  }

  onConsumerCreated(res: AxiosResponse<ConsumerModel>) {
    this.createPassword(res.data.id, res.data.rootUser.id.id!)
  }

  createPassword(identity: IdentityIdModel, rootUserId: IDModel) {
    const passwordRequest: CreatePasswordRequestModel = {
      password: {
        value: this.registrationRequest.password as string,
      },
    }
    this.$apiMulti.passwords
      .store({
        userId: rootUserId,
        data: passwordRequest,
      })
      .then(this.onRegisteredSuccessfully.bind(this))
  }

  onRegisteredSuccessfully() {
    this.stores.accessCodes.DELETE_ACCESS_CODE()

    if (!this.registrationRequest.rootUser) {
      return
    }

    const loginRequest: LoginWithPasswordRequest = {
      email: this.registrationRequest.rootUser.email as string,
      password: {
        value: this.registrationRequest.password as string,
      },
    }

    const _req = this.stores.auth.loginWithPassword(loginRequest)

    _req.then(() => {
      localStorage.setItem('stepUp', 'FALSE')
      this.$router.push({ path: '/profile/address' })
    })
  }

  registrationFailed(err) {
    this.stopRegistrationLoading()
    const _errCode = err.response.data.errorCode
    this.showErrorToast(_errCode)
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.submitForm()
    }
  }

  phoneUpdate(number) {
    this.registrationRequest.rootUser!.mobile!.countryCode = '+' + number.countryCallingCode
    this.registrationRequest.rootUser!.mobile!.number = number.nationalNumber
    this.numberIsValid = number.isValid
  }

  delayTouch($v) {
    $v.$reset()
    if (touchMap.has($v)) {
      clearTimeout(touchMap.get($v))
    }
    touchMap.set($v, setTimeout($v.$touch, 1000))
  }

  updateDOB(val) {
    this.registrationRequest.rootUser!.dateOfBirth = {
      year: val.getFullYear(),
      month: val.getMonth() + 1,
      day: val.getDate(),
    }
  }

  stopRegistrationLoading() {
    this.stores.consumers.SET_IS_LOADING_REGISTRATION(false)
  }
}
</script>
