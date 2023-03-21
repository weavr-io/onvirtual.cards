<template>
  <b-form @submit.prevent="tryToSubmitForm">
    <h3 class="text-center font-weight-light mb-5">Register</h3>
    <error-alert />
    <b-row>
      <b-col lg="6" class="border-lg-right pr-lg-4">
        <b-form-group label="First Name*">
          <b-form-input
            v-model="$v.form.rootUser.name.$model"
            :state="isInvalid($v.form.rootUser.name)"
            placeholder="Name"
          />
          <b-form-invalid-feedback v-if="!$v.form.rootUser.name.required">
            This field is required
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.form.rootUser.name.maxLength"> Name is too long.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Last Name*">
          <b-form-input
            v-model="$v.form.rootUser.surname.$model"
            :state="isInvalid($v.form.rootUser.surname)"
            placeholder="Last Name"
          />
          <b-form-invalid-feedback v-if="!$v.form.rootUser.surname.required">
            This field is required
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.form.rootUser.surname.maxLength">
            Surname is too long.
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          :state="isInvalid($v.form.rootUser.email)"
          :invalid-feedback="
            invalidFeedback(
              $v.form.rootUser.email,
              validateVParams($v.form.rootUser.email.$params, $v.form.rootUser.email)
            )
          "
          label="Email*"
        >
          <b-form-input v-model="$v.form.rootUser.email.$model" placeholder="name@email.com" />
        </b-form-group>
        <client-only placeholder="Loading...">
          <div>
            <label class="d-block">PASSWORD*</label>
            <weavr-password-input
              ref="passwordField"
              :options="{ placeholder: '****' }"
              :base-style="passwordBaseStyle"
              :class-name="['sign-in-password', { 'is-invalid': isInvalidPassword }]"
              name="password"
              required="true"
              @onChange="passwordInteraction"
            />
            <small class="form-text text-muted mb-3">Minimum 8, Maximum 50 characters.</small>
          </div>
        </client-only>
        <b-form-group label="MOBILE NUMBER*">
          <vue-phone-number-input
            :value="form.rootUser.mobile.number"
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
        <b-form-group label="Company Name*">
          <b-form-input
            v-model="$v.form.company.name.$model"
            :state="isInvalid($v.form.company.name)"
            placeholder="Company Name"
          />
          <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Company Registration Number*">
          <b-form-input
            v-model="$v.form.company.registrationNumber.$model"
            :state="isInvalid($v.form.company.registrationNumber)"
            placeholder="C00000"
          />
          <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
      <b-col lg="6" class="pl-lg-4">
        <b-form-group label="Company Type*">
          <b-form-select
            v-model="$v.form.company.type.$model"
            :state="isInvalid($v.form.company.type)"
            :options="companyTypeOptionsWithDefault"
            placeholder="Company Type"
          />
          <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Registration Country*">
          <b-form-select
            v-model="$v.form.company.registrationCountry.$model"
            :state="isInvalid($v.form.company.registrationCountry)"
            :options="countryOptionsWithDefault"
            placeholder="Registration Country"
          />
          <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group :state="isInvalid($v.form.industry)" label="Industry*">
          <b-form-select
            v-model="$v.form.industry.$model"
            :state="isInvalid($v.form.industry)"
            :options="industryOccupationOptions"
          />
          <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group :state="isInvalid($v.form.sourceOfFunds)" label="Source of Funds*">
          <b-form-select
            v-model="$v.form.sourceOfFunds.$model"
            :state="isInvalid($v.form.sourceOfFunds)"
            :options="sourceOfFundsOptions"
          />
          <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group v-if="shouldShowOtherSourceOfFunds" label="Other">
          <b-form-input
            v-model="form.sourceOfFundsOther"
            :state="isInvalid($v.form.sourceOfFundsOther)"
            placeholder="Specify Other Source of Funds"
          />
        </b-form-group>
        <b-form-group :state="isInvalid($v.form.rootUser.companyPosition)" label="My position within the company is*">
          <b-form-radio
            v-model="$v.form.rootUser.companyPosition.$model"
            :state="isInvalid($v.form.rootUser.companyPosition)"
            name="company-position"
            value="AUTHORISED_REPRESENTATIVE"
          >
            I am a representative (with the relevant power of attorney)
          </b-form-radio>
          <b-form-radio
            v-model="$v.form.rootUser.companyPosition.$model"
            :state="isInvalid($v.form.rootUser.companyPosition)"
            name="company-position"
            value="DIRECTOR"
          >
            I am a director
          </b-form-radio>
        </b-form-group>
        <p class="smaller text-muted">
          To open account on behalf of the company you need to be a director or authorised representative. To enable us
          to verify your identity, role and authorisation as part of our customer due diligence process, we will later
          ask you to upload the relevant ID and power of attorney documents.
        </p>
        <b-form-row class="small mt-3 text-muted">
          <b-col>
            <b-form-group>
              <b-form-checkbox v-model="$v.form.acceptedTerms.$model" :state="isInvalid($v.form.acceptedTerms)">
                I accept the
                <a
                  href="https://www.onvirtual.cards/terms/business"
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
          <recaptcha />
        </div>
      </b-col>
    </b-row>
    <b-form-row class="mt-5">
      <b-col class="text-center">
        <loader-button :is-loading="isLoadingRegistration" button-text="continue" />
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, mixins, Ref } from 'nuxt-property-decorator'
import { email, maxLength, required, sameAs } from 'vuelidate/lib/validators'

import BaseMixin from '~/mixins/BaseMixin'
import { IndustryTypeSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/IndustryTypeSelectConst'
import { SourceOfFundsSelectConst } from '~/plugins/weavr-multi/api/models/common/consts/SourceOfFundsSelectConst'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import { CompanyTypeSelectConst } from '~/plugins/weavr-multi/api/models/identities/corporates/consts/CompanyTypeSelectConst'
import { SelectOptionsModel } from '~/models/local/generic/SelectOptionsModel'
import ValidationMixin from '~/mixins/ValidationMixin'
import { DeepNullable, RecursivePartial } from '~/global'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'

const Countries = require('~/static/json/countries.json')

@Component({
  validations: {
    form: {
      rootUser: {
        name: {
          required,
          maxLength: maxLength(20)
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
          number: {
            required
          },
          countryCode: {
            required
          }
        },
        companyPosition: {
          required
        }
      },
      company: {
        type: {
          required
        },
        name: {
          required,
          maxLength: maxLength(100)
        },
        registrationNumber: {
          required,
          maxLength: maxLength(20)
        },
        registrationCountry: {
          required,
          maxLength: maxLength(2)
        }
      },
      industry: {
        required
      },
      sourceOfFunds: {
        required,
      },
      sourceOfFundsOther: {},
      acceptedTerms: {
        required,
        sameAs: sameAs(() => true),
      },
      password: {
        required,
      },
    },
  },
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  }
})
export default class PersonalDetailsForm extends mixins(BaseMixin, ValidationMixin) {
  private $recaptcha: any

  @Ref('passwordField')
  passwordField!: WeavrPasswordInput

  companyTypeOptionsWithDefault: SelectOptionsModel[] = CompanyTypeSelectConst

  numberIsValid: boolean | null = null

  public form: DeepNullable<RecursivePartial<CreateCorporateRequest & { password: string }>> = {
    rootUser: {
      name: null,
      surname: null,
      email: null,
      mobile: {
        number: null,
        countryCode: ''
      },
      companyPosition: null
    },
    company: {
      type: null,
      name: null,
      registrationNumber: null,
      registrationCountry: null
    },
    industry: null,
    sourceOfFunds: null,
    acceptedTerms: false,
    sourceOfFundsOther: null,
    password: null,
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

  get isInvalidPassword() {
    return this.$v.form.password?.$anyError
  }

  get mobileCountries(): string[] {
    return Countries.map((_c) => {
      return _c['alpha-2']
    })
  }

  get isLoadingRegistration() {
    return this.stores.corporates.isLoadingRegistration
  }

  get industryOccupationOptions() {
    return IndustryTypeSelectConst
  }

  get sourceOfFundsOptions() {
    return SourceOfFundsSelectConst
  }

  get shouldShowOtherSourceOfFunds(): boolean {
    return this.form.sourceOfFunds === CorporateSourceOfFundTypeEnum.OTHER
  }

  get isRecaptchaEnabled(): boolean {
    return typeof process.env.RECAPTCHA !== 'undefined'
  }

  phoneUpdate(number) {
    this.$v.form.rootUser!.mobile.number.$touch()
    this.$set(this.form.rootUser!.mobile!, 'countryCode', '+' + number.countryCallingCode)
    this.$set(this.form.rootUser!.mobile!, 'number', number.phoneNumber)
    this.numberIsValid = number.isValid
  }

  passwordInteraction(val: { empty: boolean; valid: boolean }) {
    !val.empty ? (this.form.password = '******') : (this.form.password = '')
  }

  async tryToSubmitForm(e) {
    try {
      e.preventDefault()

      this.$v.$touch()

      if (this.numberIsValid === null) {
        this.numberIsValid = false
      }

      if (this.$v.$invalid || !this.numberIsValid) {
        return
      }

      if (this.isRecaptchaEnabled) {
        await this.$recaptcha.reset()
      }

      this.passwordField.createToken().then(
        (tokens) => {
          if (tokens.tokens.password !== '') {
            this.form.password = tokens.tokens.password

            this.submitForm()
          } else {
            return null
          }
        },
        (e) => {
          this.showErrorToast(e, 'Tokenization Error')
        }
      )
    } catch (error) {
      this.showErrorToast(error, 'Registration Error')
    }
  }

  @Emit()
  submitForm() {
    this.stores.errors.RESET_ERROR()
    return this.form
  }
}
</script>

<style lang="scss" scoped>
#input-mobile-country-code {
  max-width: 100px;
}
</style>
