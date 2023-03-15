<template>
  <b-col md="8" offset-md="2" lg="6" offset-lg="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <b-card body-class="p-card">
      <h3 class="text-center font-weight-light mb-5">Login</h3>

      <form id="contact-form" class="mt-5" @submit.prevent="login">
        <error-alert
          message="Incorrect email and password combination. If you do not have an account please click on Register."
        />
        <b-form-group
          id="login-email"
          label="Email"
          label-for="form-email"
          :invalid-feedback="validation.invalidFeedback($v.loginRequest.email, 'email')"
          :state="validation.isInvalid($v.loginRequest.email)"
        >
          <b-form-input
            id="from-email"
            v-model="loginRequest.email"
            class="form-control"
            name="Email"
            placeholder="Email"
          />
        </b-form-group>
        <client-only placeholder="Loading...">
          <label class="d-block">PASSWORD</label>
          <weavr-password-input
            ref="passwordField"
            :options="{ placeholder: 'Password' }"
            :base-style="passwordBaseStyle"
            :class-name="['sign-in-password', { 'is-invalid': isInvalidPassword }]"
            name="password"
            aria-invalid="true"
            @onKeyUp="checkOnKeyUp"
            @onChange="passwordInteraction"
          />
          <b-form-invalid-feedback v-if="isInvalidPassword"> Please enter your password </b-form-invalid-feedback>
        </client-only>

        <div class="mt-2">
          <b-link to="/password/reset" class="small text-decoration-underline text-grey"> Forgot password? </b-link>
        </div>

        <b-form-group class="mt-5 text-center">
          <b-overlay :show="isLoading" rounded="pill" class="d-inline-block" spinner-small>
            <b-button type="submit" variant="secondary">
              sign in
              <span class="pl-5">-></span>
            </b-button>
          </b-overlay>
        </b-form-group>
        <div class="mt-4 text-center">
          <small class="text-grey">
            Not yet registered? Register
            <b-link to="/register" class="text-decoration-underline text-grey">here</b-link>
            .
          </small>
        </div>
      </form>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import { Component, Ref, Watch } from 'nuxt-property-decorator'
import { email, required } from 'vuelidate/lib/validators'
import Vue from 'vue'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { authStore } from '~/utils/store-accessor'
import { LoginWithPasswordRequest } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPasswordRequest'
import { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/access/responses/LoginWithPasswordResponse'
import { useBase } from '~/composables/useBase'
import { useValidation } from '~/composables/useValidation'

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    WeavrPasswordInput,
  },
  validations: {
    loginRequest: {
      email: {
        required,
        email,
      },
      password: {
        value: {
          required,
        },
      },
    },
  },
})
export default class LoginPage extends Vue {
  base = useBase(this)
  validation = useValidation()

  isLoading: boolean = false

  private loginRequest: LoginWithPasswordRequest = {
    email: '',
    password: {
      value: '',
    },
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
    return this.$v.loginRequest?.password?.value.$anyError
  }

  passwordInteraction(val: { empty: boolean; valid: boolean }) {
    !val.empty ? (this.loginRequest.password.value = '******') : (this.loginRequest.password.value = '')
  }

  login() {
    this.$v.$touch()
    if (!this.$v.$invalid) {
      try {
        this.isLoading = true
        this.base.stores.errors.SET_ERROR(null)
        this.passwordField.createToken().then(
          (tokens) => {
            this.loginRequest.password.value = tokens.tokens.password
            this.base.stores.auth
              .loginWithPassword(this.loginRequest)
              .then((res) => {
                this.goToDashboard(res.data)
              })
              .catch((err) => {
                this.isLoading = false
                this.base.stores.errors.SET_ERROR(err)
              })
          },
          (e) => {
            this.base.showErrorToast(e, 'Tokenization Error')
          }
        )
      } catch (error) {
        this.base.showErrorToast(error, 'Login Error')
      }
    }
  }

  async goToDashboard(res: LoginWithPasswordResponse) {
    const _id = res.credentials.type! + '-' + res.credentials.id
    try {
      this.$segment.identify(_id, {
        email: this.loginRequest.email,
      })
    } catch (e) {}

    if (this.base.stores.auth.isConsumer) {
      await this.base.stores.consumers.get()
    }

    await this.base.goToIndex()
    this.isLoading = false
  }

  asyncData({ store, redirect }) {
    const isLoggedIn = authStore(store).isLoggedIn

    if (isLoggedIn) {
      redirect('/')
    }
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.login()
    }
  }

  @Watch('isLoggedIn')
  isLoggedInChanged(val) {
    console.warn(val)
  }

  @Ref('passwordField')
  passwordField!: WeavrPasswordInput
}
</script>
