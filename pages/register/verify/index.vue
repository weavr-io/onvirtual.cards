<template>
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
        <form id="contact-form" class="mt-5" @submit="doVerify">
          <b-alert :show="showEmailResentSuccessAlert" variant="success">
            The verification code was resent by email.
          </b-alert>
          <p class="text-center mb-5 text-grey">
            We’ve just sent you a verification code by email. Enter code below to verify your email address.
          </p>
          <error-alert class="mt-3" />
          <b-row>
            <b-col md="4" offset-md="4">
              <b-form-group label="">
                <b-form-input
                  v-model="verifyEmailRequest.verificationCode"
                  :state="isInvalid($v.verifyEmailRequest.verificationCode)"
                  placeholder="000000"
                  class="text-center"
                />
                <b-form-invalid-feedback>This field is required and must be 6 characters.</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <loader-button :is-loading="isLoading" button-text="verify" class="mt-5 text-center" />
        </form>
        <div class="mt-4 text-center">
          <small class="text-grey">
            Didn’t receive a code?
            <b-link class="text-decoration-underline text-grey" @click="sendVerifyEmail">Send again</b-link>
            .
          </small>
        </div>
      </b-card>
    </div>
  </b-col>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { maxLength, minLength, required } from 'vuelidate/lib/validators'
import BaseMixin from '~/minixs/BaseMixin'
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'
import { VerifyEmailRequest } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmailRequest'

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    verifyEmailRequest: {
      verificationCode: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(6)
      }
    }
  }
})
export default class EmailVerificationPage extends mixins(BaseMixin) {
  validate({ route }) {
    return route.query.email !== undefined
  }

  showEmailResentSuccess: boolean = false

  private verifyEmailRequest!: VerifyEmailRequest

  get isLoggedIn() {
    return this.stores.auth.isLoggedIn
  }

  get isLoading() {
    return this.stores.auth.isLoading
  }

  get showEmailResentSuccessAlert(): boolean {
    if (this.$route.query.send === 'true') {
      return false
    } else {
      return this.showEmailResentSuccess
    }
  }

  asyncData({ route, redirect, store }) {
    const request: VerifyEmailRequest = {
      email: route.query.email + '',
      verificationCode: route.query.nonce ? route.query.nonce + '' : ''
    }

    if (request.verificationCode !== '') {
      if (authStore(store).isConsumer) {
        consumersStore(store)
          .verifyEmail(request)
          .then(() => {
            if (authStore(store).isLoggedIn) {
              redirect('/')
            } else {
              redirect('/login')
            }
          })
      } else {
        // else treat as Corporate
        corporatesStore(store)
          .verifyEmail(request)
          .then(() => {
            if (authStore(store).isLoggedIn) {
              redirect('/')
            } else {
              redirect('/login')
            }
          })
      }
    }

    return {
      verifyEmailRequest: request
    }
  }

  async mounted() {
    if (this.$route.query.send === 'true') {
      await this.sendVerifyEmail()
    }
  }

  async sendVerifyEmail() {
    if (this.isConsumer) {
      await this.sendVerifyEmailConsumers()
    } else {
      // else treat as corporate
      await this.sendVerifyEmailCorporates()
    }
  }

  async sendVerifyEmailConsumers() {
    await this.stores.consumers
      .sendVerificationCodeEmail({
        email: this.verifyEmailRequest.email
      })
      .then(() => {
        this.showEmailResentSuccess = true
      })
  }

  async sendVerifyEmailCorporates() {
    await this.stores.corporates
      .sendVerificationCodeEmail({
        email: this.verifyEmailRequest.email
      })
      .then(() => {
        this.showEmailResentSuccess = true
      })
  }

  doVerify(evt) {
    evt.preventDefault()

    if (this.$v.verifyEmailRequest) {
      this.$v.verifyEmailRequest.$touch()
      if (this.$v.verifyEmailRequest.$anyError) {
        return null
      }
    }

    this.isConsumer
      ? this.stores.consumers.verifyEmail(this.verifyEmailRequest).then(this.nextPage)
      : this.stores.corporates.verifyEmail(this.verifyEmailRequest).then(this.nextPage)
  }

  nextPage() {
    this.goToVerifyMobile()
  }

  goToVerifyMobile() {
    this.$router.push({
      path: '/register/verify/mobile',
      query: {
        send: 'true',
        cons: this.$route.query.cons,
        corp: this.$route.query.corp,
        mobileNumber: this.$route.query.mobileNumber,
        mobileCountryCode: this.$route.query.mobileCountryCode
      }
    })
  }
}
</script>
