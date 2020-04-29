<template>
  <b-col lg="6" offset-lg="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <b-card body-class="p-card">
      <h3 class="text-center font-weight-light mb-5">
        Login
      </h3>

      <form id="contact-form" @submit="login" class="mt-5">
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
          <weavr-form ref="passwordForm">
            <label class="d-block">PASSWORD</label>
            <weavr-input
              :options="{ placeholder: 'Password' }"
              :base-style="passwordBaseStyle"
              @onKeyUp="checkOnKeyUp"
              class-name="sign-in-password"
              name="password"
              field="password"
            />
          </weavr-form>
        </client-only>
        <div class="mt-2">
          <b-link to="/password/reset" class="small text-decoration-underline text-grey">
            Forgot password?
          </b-link>
        </div>
        <loader-button :is-loading="isLoading" button-text="sign in" class="text-center mt-5" />
        <div class="mt-4 text-center">
          <small class="text-grey">
            Not yet registered? Register
            <b-link to="/register/corporate" class="text-decoration-underline text-grey">here</b-link>
            .
          </small>
        </div>
      </form>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import { namespace } from 'vuex-class'
import { Component } from 'nuxt-property-decorator'
import { Schemas } from '~/api/Schemas'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import WeavrForm from '~/plugins/weavr/components/WeavrForm.vue'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import * as SecureClientStore from '~/store/modules/SecureClient'

const Auth = namespace(AuthStore.name)

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  }
})
export default class LoginPage extends VueWithRouter {
  @Auth.Getter isLoggedIn

  @Auth.Action authenticate

  @Auth.Getter isLoading!: boolean

  public loginRequest: Schemas.LoginRequest = {
    code: '',
    password: ''
  }

  $refs!: {
    passwordForm: WeavrForm
  }

  login(evt) {
    evt.preventDefault()
    console.log('Login Function')

    // const form: WeavrForm = this.$refs.passwordForm as WeavrForm
    SecureClientStore.Helpers.tokenize(this.$store).then(
      (tokens) => {
        console.log('Password tokenisation success')
        this.loginRequest.password = tokens.password
        this.authenticate(this.loginRequest).then(this.goToDashboard.bind(this))
      },
      (e) => {
        console.log('tokenisation failed', e)
      }
    )
  }

  async goToDashboard(res) {
    console.log('auth success')
    const _id = res.data.credential.type + '-' + res.data.credential.id
    try {
      this.$segment.identify(_id, {
        email: this.loginRequest.code
      })
    } catch (e) {}

    if (AuthStore.Helpers.isConsumer(this.$store)) {
      await ConsumersStore.Helpers.get(this.$store, AuthStore.Helpers.identity(this.$store).id)
    }

    this.$router.push('/')
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log('Submit form throught password enter')
      this.login(e)
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
    const isLoggedIn = store.getters['auth/isLoggedIn']

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
