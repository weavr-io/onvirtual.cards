<template>
  <section>
    <b-container>
      <b-row class="full-height-vh" align-v="center">
        <b-col md="6" offset-md="3">
          <div class="text-center pb-5">
            <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
          </div>
          <div>
            <b-card class="py-5 px-5 mt-5">
              <h3 class="font-weight-light text-center">
                Check your inbox!
              </h3>
              <b-row>
                <b-col md="6" offset-md="3" class="text-center">
                  <b-img fluid src="/img/email.svg" class="mt-5 mb-2" />
                </b-col>
              </b-row>
              <form id="contact-form" @submit="doVerify" class="mt-5">
                <b-alert :show="showEmailResentSuccess" variant="success">
                  The verification code was resent by email.
                </b-alert>
                <p class="text-center mb-5 text-grey">
                  We’ve just sent you a verification code by email. Enter code below to verify your email address.
                </p>
                <error-alert class="mt-3" />
                <b-row>
                  <b-col md="4" offset-md="4">
                    <b-form-group label="">
                      <b-form-input v-model="verifyEmailRequest.request.nonce" placeholder="0000" class="text-center" />
                    </b-form-group>
                  </b-col>
                </b-row>
                <loader-button :is-loading="isLoading" button-text="verify" class="mt-5 text-center" />
              </form>
              <div class="mt-4 text-center">
                <small class="text-grey">
                  Didn’t receive a code?
                  <b-link @click="sendVerifyEmail" class="text-decoration-underline text-grey">Send again</b-link>
                  .
                </small>
              </div>
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
import * as CorporatesStore from '~/store/modules/Corporates'

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

  showEmailResentSuccess: boolean = false

  public verifyEmailRequest!: Schemas.verifyEmailRequest

  asyncData({ route, redirect }) {
    const request: Schemas.verifyEmailRequest = {
      consumerId: route.query.cons,
      corporateId: route.query.corp,
      request: {
        emailAddress: route.query.email + '',
        nonce: route.query.nonce ? route.query.nonce + '' : ''
      }
    }

    if (request.request.nonce !== '') {
      this.verifyEmail(request).then(() => {
        redirect('/login')
        // if (route.query.cons) {
        //   redirect('/register/verify/mobile')
        // } else {
        //   redirect('/login')
        // }
      })
    }

    return {
      verifyEmailRequest: request
    }
  }

  sendVerifyEmail() {
    CorporatesStore.Helpers.sendVerificationCodeEmail(this.$store, {
      corporateId: this.verifyEmailRequest.corporateId,
      body: {
        emailAddress: this.verifyEmailRequest.request.emailAddress
      }
    }).then(() => {
      this.showEmailResentSuccess = true
    })
  }

  doVerify(evt) {
    evt.preventDefault()
    this.verifyEmail(this.verifyEmailRequest).then(this.nextPage.bind(this))
  }

  nextPage() {
    if (this.$route.query.cons) {
      this.$router.push('/login')
      // this.goToVerifyMobile()
    } else {
      this.$router.push('/login')
    }
  }

  goToVerifyMobile() {
    this.$router.push({
      path: '/register/verify/mobile',
      query: {
        cons: this.$route.query.cons,
        mobileNumber: this.$route.query.mobileNumber,
        mobileCountryCode: this.$route.query.mobileCountryCode
      }
    })
  }

  goToLogin() {
    this.$router.push('/login')
  }
}
</script>
