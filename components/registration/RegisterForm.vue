<template>
  <b-form @submit.prevent="tryToSubmitForm">
    <h3 class="text-center font-weight-light mb-5">Register</h3>
    <error-alert />
    <b-form-group
      :state="isInvalid($v.form.email)"
      :invalid-feedback="invalidFeedback($v.form.email, validateVParams($v.form.email.$params, $v.form.email))"
      label="Email*"
    >
      <b-form-input v-model="$v.form.email.$model" placeholder="name@email.com" />
    </b-form-group>
    <client-only placeholder="Loading...">
      <div>
        <label class="d-block">PASSWORD*</label>
        <weavr-password-input
          ref="passwordField"
          :options="{ placeholder: '****' }"
          :base-style="passwordBaseStyle"
          class-name="sign-in-password"
          name="password"
          required="true"
          @onKeyUp="checkOnKeyUp"
          @onChange="passwordInteraction"
          @onStrength="strengthCheck"
        />
        <small class="form-text mb-3" :class="!isPasswordValidAndDirty ? 'text-danger' : 'text-muted'"
          >- min 8 characters <br />- uppercase letter <br />- digit and a special character</small
        >
      </div>
    </client-only>
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
            <a href="https://www.onvirtual.cards/policy/" target="_blank" class="text-decoration-underline text-muted"
              >privacy policy</a
            >*
          </b-form-checkbox>
          <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-form-row>
    <div v-if="isRecaptchaEnabled" class="mt-2 d-flex justify-content-center">
      <recaptcha />
    </div>
    <b-form-row class="mt-5">
      <b-col class="text-center">
        <loader-button :is-loading="isLoadingRegistration" button-text="continue" class="text-center" />
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, mixins, Ref } from 'nuxt-property-decorator'
import { email, required, sameAs } from 'vuelidate/lib/validators'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import BaseMixin from '~/mixins/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import ValidationMixin from '~/mixins/ValidationMixin'
import LoaderButton from '~/components/LoaderButton.vue'

@Component({
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        value: {
          required,
        },
      },
      acceptedTerms: {
        required,
        sameAs: sameAs(() => true),
      },
    },
  },
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    WeavrPasswordInput,
    LoaderButton,
  },
})
export default class RegisterForm extends mixins(BaseMixin, ValidationMixin) {
  private $recaptcha: any
  @Ref('passwordField')
  passwordField!: WeavrPasswordInput

  form: {
    email: string | null
    password: {
      value: string | null
    }
    acceptedTerms: boolean
  } = {
    email: null,
    password: { value: null },
    acceptedTerms: false,
  }

  passwordStrength: number = 0

  get isPasswordValidAndDirty(): boolean {
    return !this.$v.form.password?.$dirty ? true : this.isPasswordValid
  }

  get isPasswordValid(): boolean {
    return this.passwordStrength >= 2
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

  get isRecaptchaEnabled(): boolean {
    return typeof process.env.RECAPTCHA !== 'undefined'
  }

  get isLoadingRegistration() {
    return this.stores.corporates.isLoadingRegistration
  }

  tryToSubmitForm() {
    this.stores.errors.RESET_ERROR()
    try {
      this.$v.$touch()
      if (this.$v.$invalid || !this.isPasswordValid) {
        return
      }
      if (this.isRecaptchaEnabled) {
        this.startRegistrationLoading()
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
      }
    } catch (error) {
      this.showErrorToast(error, 'Registration Error')
    }
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.tryToSubmitForm()
    }
  }

  passwordInteraction(val: { empty: boolean; valid: boolean }) {
    !val.empty ? (this.form.password.value = '******') : (this.form.password.value = '')
    this.$v.form.password?.$touch()
  }

  startRegistrationLoading() {
    this.stores.corporates.SET_IS_LOADING_REGISTRATION(true)
  }

  @Emit()
  submitForm() {
    this.stores.errors.RESET_ERROR()
    return this.form
  }

  @Emit()
  strengthCheck(val) {
    this.passwordStrength = val.id
  }
}
</script>
