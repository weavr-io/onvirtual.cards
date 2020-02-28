<template>
  <section>
    <b-container>
      <b-row class="full-height-vh" align-v="center">
        <b-col md="6" offset-md="3">
          <div class="text-center pb-5">
            <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
          </div>
          <div class="mx-md-3 px-md-5">
            <b-card class="mt-5" bg-variant="secondary" text-variant="dark">
              <b-card-text>
                We sent you a verification code by email. Please enter that code to verify your email address.
              </b-card-text>
            </b-card>
            <b-card class="px-5 py-3 mt-5">
              <form id="contact-form" class="mt-5" @submit="doVerify">
                <!--              <b-form-group label="Email:">-->
                <!--                <b-form-input v-model="request.request.emailAddress" type="email" />-->
                <!--              </b-form-group>-->
                <b-form-group label="Validation Code:">
                  <b-form-input v-model="request.request.nonce" />
                </b-form-group>
                <loader-button :is-loading="isLoading" button-text="Verify" class="my-5 text-right" />
              </form>
            </b-card>
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
    this.request.corporateId = this.$route.query.corp
    this.request.consumerId = this.$route.query.cons
    this.request.request.emailAddress = this.$route.query.email + ''
    this.request.request.nonce = this.$route.query.nonce ? this.$route.query.nonce + '' : ''

    if (this.request.request.nonce !== '') {
      this.verifyEmail(this.request).then(this.goToLogin.bind(this))
    }
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
