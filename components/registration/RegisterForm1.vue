<template>
  <b-form @submit.prevent="tryToSubmitForm">
    <h3 class="text-center font-weight-light mb-5">Register</h3>
    <error-alert />
    <b-form-group
      :state="validation.isInvalid($v.form.email)"
      :invalid-feedback="
        validation.invalidFeedback($v.form.email, validation.validateVParams($v.form.email.$params, $v.form.email))
      "
      label="Email"
    >
      <b-form-input v-model="$v.form.email.$model" placeholder="name@email.com" />
    </b-form-group>
    <client-only placeholder="Loading...">
      <div>
        <label class="d-block">PASSWORD</label>
        <weavr-password-input
          ref="passwordField"
          :options="{ placeholder: '****' }"
          :base-style="passwordBaseStyle"
          :class-name="['sign-in-password', { 'is-invalid': isInvalidPassword }]"
          name="password"
          required="true"
          @onKeyUp="checkOnKeyUp"
          @onChange="passwordInteraction"
        />
        <small class="form-text text-muted">Minimum 8, Maximum 50 characters.</small>
      </div>
    </client-only>
    <b-form-row class="small mt-3 text-muted">
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
    <div v-if="isRecaptchaEnabled" class="mt-2 d-flex justify-content-center">
      <recaptcha />
    </div>
    <b-form-row class="mt-5">
      <b-col class="text-center">
        <b-button variant="secondary" type="submit">
          continue
          <span class="pl-5">-></span>
        </b-button>
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, Ref } from 'nuxt-property-decorator'
import { email, required, sameAs } from 'vuelidate/lib/validators'
import Vue from 'vue'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { useBase } from '~/composables/useBase'
import { useValidation } from '~/composables/useValidation'

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
  },
})
export default class RegisterForm1 extends Vue {
  base = useBase(this)
  validation = useValidation()

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

  get isInvalidPassword() {
    return this.$v.form?.password?.value.$anyError
  }

  async tryToSubmitForm() {
    try {
      this.$v.$touch()

      if (this.$v.$invalid) {
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
          this.base.showErrorToast(e, 'Tokenization Error')
        }
      )
    } catch (error) {
      this.base.showErrorToast(error, 'Registration Error')
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
  }

  @Emit()
  submitForm() {
    this.base.stores.errors.RESET_ERROR()
    return this.form
  }
}
</script>
