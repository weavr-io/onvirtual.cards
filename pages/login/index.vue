<template>
  <section>
    <b-container>
      <b-row class="full-height-vh" align-v="center">
        <b-col lg="6" offset-lg="3">
          <div class="text-center pb-5">
            <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="DevPay" />
          </div>
          <b-card body-class="px-6 py-5">
            <h2 class="text-center font-weight-lighter mb-6">
              Login
            </h2>

            <form id="contact-form" @submit="login" class="mt-5">
              <error-alert
                message="Incorrect email and password combination.  If you do not have an account please click on Register."
              />
              <b-form-group id="ig-code" label="Username:" label-for="form-code">
                <b-form-input id="from-code" v-model="loginRequest.code" class="form-control" name="setCode" />
              </b-form-group>
              <client-only placeholder="Loading...">
                <weavr-form ref="passwordForm">
                  <label class="d-block">Password:</label>
                  <weavr-input
                    :options="{ placeholder: 'Password' }"
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
                  />
                </weavr-form>
              </client-only>
              <loader-button
                :is-loading="isLoading"
                button-text="sign in"
                class="text-center mt-6"
              />
              <div class="text-center mt-3">
                <b-button to="/password/reset" variant="link" size="sm">
                  Forgot password?
                </b-button>
              </div>
            </form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { namespace } from 'vuex-class'
import { Component } from 'nuxt-property-decorator'
import { Schemas } from '~/api/Schemas'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AuthStore from '~/store/modules/Auth'
import config from '~/config'
import WeavrForm from '~/plugins/weavr/components/WeavrForm.vue'

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
    programmeId: config.api.programmeId,
    code: '',
    password: ''
  }

  $refs!: {
    passwordForm: WeavrForm
  }

  login(evt) {
    evt.preventDefault()
    const form: WeavrForm = this.$refs.passwordForm as WeavrForm
    form.tokenize(
      (tokens) => {
        this.loginRequest.password = tokens.password
        this.authenticate(this.loginRequest).then(this.goToDashboard.bind(this))
      },
      (e) => {
        console.error(e)
      }
    )
  }

  goToDashboard() {
    if (this.isLoggedIn) {
      this.$router.push('/dashboard')
    }
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.login(e)
    }
  }

  asyncData({ store, redirect }) {
    const isLoggedIn = store.getters['auth/isLoggedIn']

    if (isLoggedIn) {
      redirect('/dashboard')
    }
  }
}
</script>
