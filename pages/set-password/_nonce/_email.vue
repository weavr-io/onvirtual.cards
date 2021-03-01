<template>
  <b-col lg="6" offset-lg="3">
    <b-card no-body class="overflow-hidden">
      <b-card-body class="p-6">
        <div class="text-center">
          <h2 class="font-weight-lighter">
            Set password
          </h2>
        </div>
        <error-alert
          message="The reset password link is invalid or has expired.  Please restart the password restart process."
        />
        <b-form id="contact-form" @submit="setPassword" class="mt-5">
          <b-form-group
            id="ig-email"
            :state="isInvalid($v.form.email)"
            :invalid-feedback="invalidFeedback($v.form.email, 'email')"
            label="Email"
            label-for="setEmail"
          >
            <b-form-input
              id="setEmail"
              v-model="form.email"
              :state="isInvalid($v.form.email)"
              class="form-control"
              type="text"
              name="setEmail"
              autocomplete="email"
            />
          </b-form-group>
          <client-only placeholder="Loading...">
            <div :class="{ 'is-dirty': $v.form.$dirty }">
              <label class="d-block">PASSWORD:</label>
              <weavr-password-input
                ref="passwordField"
                :options="{ placeholder: '****', classNames: { empty: 'is-invalid' } }"
                :base-style="passwordBaseStyle"
                @onKeyUp="checkOnKeyUp"
                class-name="sign-in-password"
                name="password"
                required="true"
              />
            </div>
            <small class="form-text text-muted">Minimum 8, Maximum 50 characters.</small>
          </client-only>
          <div class="text-center">
            <loader-button :is-loading="isLoading" button-text="Set Password" class="mt-5" />
          </div>
        </b-form>
      </b-card-body>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { required, email } from 'vuelidate/lib/validators'
import ErrorAlert from '~/components/ErrorAlert.vue'
import LoaderButton from '~/components/LoaderButton.vue'

import * as AuthStore from '~/store/modules/Auth'
import { LostPasswordValidateRequest } from '~/api/Requests/Auth/LostPasswordValidateRequest'
import { LostPasswordContinueRequest } from '~/api/Requests/Auth/LostPasswordContinueRequest'
import { ValidatePasswordRequest } from '~/api/Requests/Auth/ValidatePasswordRequest'
import config from '~/config'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import BaseMixin from '~/minixs/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'

const Auth = namespace(AuthStore.name)

@Component({
  layout: 'auth',
  components: {
    ErrorAlert,
    LoaderButton,
    WeavrPasswordInput
  },
  validations: {
    form: {
      email: {
        required,
        email
      }
    }
  }
})
export default class PasswordSentPage extends mixins(BaseMixin) {
  @Ref('passwordField')
  passwordField!: WeavrPasswordInput

  @Auth.Getter isLoading!: boolean

  protected form: LostPasswordContinueRequest = {
    nonce: '',
    email: '',
    password: {
      value: ''
    }
  }

  protected validateNonce: LostPasswordValidateRequest = {
    nonce: '',
    email: ''
  }

  mounted() {
    this.form.nonce = this.$route.params.nonce
    this.form.email = this.$route.params.email

    this.validateNonce.nonce = this.$route.params.nonce
    this.validateNonce.email = this.$route.params.email

    AuthStore.Helpers.lostPasswordValidate(this.$store, this.validateNonce)
  }

  setPassword(evt) {
    evt.preventDefault()

    if (this.$v.form) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return null
      }
    }

    this.passwordField.createToken().then(
      (tokens) => {
        if (tokens.tokens.password !== '') {
          this.form.password.value = tokens.tokens.password
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
  }

  validatePassword() {
    const _request: ValidatePasswordRequest = {
      identityProfileId: config.profileId.corporates ? config.profileId.corporates : '',
      credentialType: 'ROOT',
      password: {
        value: this.form.password.value ? this.form.password.value : ''
      }
    }

    AuthStore.Helpers.validatePassword(this.$store, _request).then(this.submitForm.bind(this))
  }

  submitForm() {
    AuthStore.Helpers.lostPasswordResume(this.$store, this.form).then(() => {
      this.$router.push('/login')
    })
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.setPassword(e)
    }
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
}
</script>
