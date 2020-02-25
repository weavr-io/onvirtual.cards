<template>
  <section>
    <b-container>
      <b-row class="full-height-vh py-5" align-v="center">
        <b-col lg="6" offset-lg="3">
          <div class="mx-md-3 px-md-5">
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
                label="E-mail"
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
              <b-form-group id="ig-password" label="Password" label-for="setPassword">
                <b-form-input
                  id="from-password"
                  v-model="form.password.value"
                  :state="isInvalid($v.form.password.value)"
                  class="form-control"
                  type="password"
                  name="setPassword"
                  autocomplete="new-password"
                />
              </b-form-group>
              <div class="text-center">
                <loader-button :is-loading="isLoading" button-text="Set Password" class="mt-5" />
              </div>
            </b-form>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { required, email, maxLength, minLength } from 'vuelidate/lib/validators'
import { BaseVue } from '~/base/classes/BaseVue'
import ErrorAlert from '~/components/ErrorAlert.vue'
import LoaderButton from '~/components/LoaderButton.vue'

import passwordComplexity from '~/plugins/customValidators/passwordComplexity.ts'
import * as AuthStore from '~/store/modules/Auth'
import { LostPasswordValidateRequest } from '~/api/Requests/Auth/LostPasswordValidateRequest'
import { LostPasswordContinueRequest } from '~/api/Requests/Auth/LostPasswordContinueRequest'

const Auth = namespace(AuthStore.name)

@Component({
  layout: 'auth',
  components: {
    ErrorAlert,
    LoaderButton
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        value: {
          required,
          minLength: minLength(8),
          maxLength: maxLength(30),
          passwordComplexity
        }
      }
    }
  }
})
export default class PasswordSentPage extends BaseVue {
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
    super.mounted()
    this.form.nonce = this.$route.params.nonce
    this.form.email = this.$route.params.email

    this.validateNonce.nonce = this.$route.params.nonce
    this.validateNonce.email = this.$route.params.email

    AuthStore.Helpers.lostPasswordValidate(this.$store, this.validateNonce)
  }

  setPassword(evt) {
    evt.preventDefault()
    this.$v.$touch()
    if (!this.$v.$invalid) {
      AuthStore.Helpers.lostPasswordResume(this.$store, this.form).then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>
