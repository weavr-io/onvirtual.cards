<template>
  <section>
    <b-container>
      <b-row class="full-height-vh py-5" align-v="center">
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
                <client-only placeholder="Loading...">
                  <weavr-form ref="passwordForm" :class="{ 'is-dirty': $v.form.$dirty }">
                    <label class="d-block">PASSWORD:</label>
                    <weavr-input
                      :options="{ placeholder: '****', classNames: { empty: 'is-invalid' } }"
                      :base-style="{
                        color: '#000',
                        fontSize: '13px',
                        fontSmoothing: 'antialiased',
                        fontFamily: '\'Be Vietnam\', sans-serif',
                        fontWeight: '300',
                        margin: '0',
                        padding: '0.375rem 0.75rem',
                        textIndent: '0px',
                        '::placeholder': {
                          color: '#bbc0c8',
                          fontWeight: '200'
                        }
                      }"
                      @onKeyUp="checkOnKeyUp"
                      class-name="sign-in-password"
                      name="password"
                      field="password"
                      required="true"
                    />
                  </weavr-form>
                </client-only>
                <div class="text-center">
                  <loader-button :is-loading="isLoading" button-text="Set Password" class="mt-5" />
                </div>
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { required, email } from 'vuelidate/lib/validators'
import { BaseVue } from '~/base/classes/BaseVue'
import ErrorAlert from '~/components/ErrorAlert.vue'
import LoaderButton from '~/components/LoaderButton.vue'

import * as AuthStore from '~/store/modules/Auth'
import { LostPasswordValidateRequest } from '~/api/Requests/Auth/LostPasswordValidateRequest'
import { LostPasswordContinueRequest } from '~/api/Requests/Auth/LostPasswordContinueRequest'
import WeavrForm from '~/plugins/weavr/components/WeavrForm.vue'

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
      }
    }
  }
})
export default class PasswordSentPage extends BaseVue {
  $refs!: {
    passwordForm: WeavrForm
  }

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

    if (this.$v.form) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return null
      }
    }

    const form: WeavrForm = this.$refs.passwordForm as WeavrForm
    form.tokenize(
      (tokens) => {
        if (tokens.password !== '') {
          this.form.password.value = tokens.password

          AuthStore.Helpers.lostPasswordResume(this.$store, this.form).then(() => {
            this.$router.push('/login')
          })
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
}
</script>
