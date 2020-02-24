<template>
  <section class="full-height bg-pattern">
    <b-container class="d-flex h-100">
      <b-row class="w-100 align-self-center">
        <b-col lg="6" offset-lg="3">
          <div class="mt-5 text-center pb-5">
            <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
          </div>
          <div class="mx-md-3 px-md-5">
            <b-card class="mt-5" bg-variant="secondary" text-variant="white">
              <b-card-text>
                We sent you a verification code by email. Please enter that
                code to verify your email address.
              </b-card-text>
            </b-card>
            <form id="contact-form" class="mt-5" @submit="doVerify">
              <b-form-group label="Email:">
                <b-form-input v-model="request.request.emailAddress" type="email" />
              </b-form-group>
              <b-form-group label="Validation Code:">
                <b-form-input v-model="request.request.nonce" />
              </b-form-group>
              <loader-button :is-loading="isLoading" button-text="Verify" class="my-5 text-right" />
            </form>
          </div>
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

const Auth = namespace(AuthStore.name)

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  }
})
export default class EmailVerificationPage extends VueWithRouter {
  @Auth.Getter isLoggedIn

  @Auth.Action verifyEmail

  @Auth.Getter isLoading

  public request: Schemas.verifyEmailRequest = {
    consumerId: null,
    corporateId: null,
    request: {
      emailAddress: '',
      nonce: ''
    }
  }

  mounted() {
    this.request.corporateId = this.$route.params.corporate
  }

  doVerify(evt) {
    evt.preventDefault()
    this.verifyEmail(this.request).then(this.goToLogin.bind(this))
  }

  goToLogin() {
    this.$router.push('/login')
  }
}
</script>
