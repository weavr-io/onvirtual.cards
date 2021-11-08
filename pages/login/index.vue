<template>
  <b-col lg="6" offset-lg="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <b-card body-class="p-card">
      <h3 class="text-center font-weight-light mb-5">
        Login
      </h3>

      <form id="contact-form" @submit.prevent="login" class="mt-5">
        <error-alert
          message="Incorrect email and password combination. If you do not have an account please click on Register."
        />
        <b-form-group id="ig-code" label="EMAIL" label-for="form-code">
          <b-form-input
            id="from-code"
            v-model="loginRequest.code"
            class="form-control"
            name="setCode"
            placeholder="Email"
          />
        </b-form-group>
        <client-only placeholder="Loading...">
          <label class="d-block">PASSWORD</label>
          <weavr-password-input
            ref="passwordField"
            :options="{ placeholder: 'Password' }"
            :base-style="passwordBaseStyle"
            @onKeyUp="checkOnKeyUp"
            class-name="sign-in-password"
            name="password"
          />
        </client-only>

        <div class="mt-2">
          <b-link to="/password/reset" class="small text-decoration-underline text-grey">
            Forgot password?
          </b-link>
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
import { Component, mixins, Ref, Watch } from 'nuxt-property-decorator'
import { Schemas } from '~/api/Schemas'
import * as ConsumersStore from '~/store/modules/Consumers'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import BaseMixin from '~/minixs/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { authStore } from '~/utils/store-accessor'

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    WeavrPasswordInput
  }
})
export default class LoginPage extends mixins(BaseMixin) {
  get isLoggedIn() {
    return this.stores.auth.isLoggedIn
  }

  get isLoading() {
    return this.stores.auth.isLoading
  }

  @Watch('isLoggedIn')
  isLoggedInChanged(val) {
    console.warn(val)
  }

  @Ref('passwordField')
  passwordField!: WeavrPasswordInput

  public loginRequest: Schemas.LoginRequest = {
    code: '',
    password: ''
  }

  login() {
    console.log('Login Function')

    try {
      this.passwordField.createToken().then(
        (tokens) => {
          console.log('Password tokenisation success')
          this.loginRequest.password = tokens.tokens.password
          this.stores.auth.authenticate(this.loginRequest).then(this.goToDashboard.bind(this))
        },
        (e) => {
          console.log('tokenisation failed', e)
        }
      )
    } catch (error) {
      console.log('Login error:', error)
    }
  }

  async goToDashboard(res) {
    console.log('auth success')
    const _id = res.data.credential.type + '-' + res.data.credential.id
    try {
      this.$segment.identify(_id, {
        email: this.loginRequest.code
      })
    } catch (e) {}

    if (this.stores.auth.isConsumer) {
      await ConsumersStore.Helpers.get(this.$store, this.stores.auth.identity.id)
    }

    this.$router.push('/')
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log('Submit form throught password enter')
      this.login()
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

  asyncData({ store, redirect }) {
    const isLoggedIn = authStore(store).isLoggedIn

    if (isLoggedIn) {
      redirect('/')
    }
  }

  receiveMessage(event) {
    console.log('MESSAGE', event.data)
  }

  beforeMount() {
    window.addEventListener('message', this.receiveMessage, false)
  }

  beforeDestroy() {
    window.removeEventListener('message', this.receiveMessage, false)
  }
}
</script>
