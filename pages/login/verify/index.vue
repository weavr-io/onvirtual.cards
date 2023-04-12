<template>
  <b-col md="9" lg="6">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <div>
      <b-card class="py-5 px-5 mt-5">
        <h3 class="font-weight-light text-center">Check your inbox!</h3>
        <b-row align-h="center">
          <b-col md="6" class="text-center">
            <b-img fluid src="/img/email.svg" class="mt-5 mb-2" />
          </b-col>
        </b-row>
        <form id="contact-form" class="mt-5" @submit.prevent="doVerify">
          <b-alert :show="showEmailResentSuccess" variant="success">
            The verification code was resent by email.
          </b-alert>
          <p class="text-center mb-5 text-grey">
            We’ve just sent you a verification code by email. Enter code below to verify your email address.
          </p>
          <error-alert class="mt-3" />
          <b-row align-h="center">
            <b-col cols="6">
              <b-form-group
                :state="isInvalid($v.verifyEmailRequest.verificationCode)"
                invalid-feedback="This field is required and must be 6 characters"
              >
                <b-form-input
                  v-model="$v.verifyEmailRequest.verificationCode.$model"
                  placeholder="000000"
                  class="text-center"
                  lazy
                />
              </b-form-group>
            </b-col>
          </b-row>
          <loader-button :is-loading="isLoading" button-text="verify" class="mt-5 text-center" />
        </form>
        <div class="mt-4 text-center">
          <small class="text-grey">
            Didn’t receive a code?
            <b-link class="text-decoration-underline text-grey" @click="resendEmail">Send again</b-link>
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
import BaseMixin from '~/mixins/BaseMixin'
import { authStore, consumersStore, corporatesStore, identitiesStore } from '~/utils/store-accessor'
import { VerifyEmailRequest } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmailRequest'
import ValidationMixin from '~/mixins/ValidationMixin'
import { CredentialTypeEnum } from '~/plugins/weavr-multi/api/models/common/CredentialTypeEnum'

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
  },
  validations: {
    verifyEmailRequest: {
      verificationCode: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(6),
      },
    },
  },
})
export default class EmailVerificationPage extends mixins(BaseMixin, ValidationMixin) {
  showEmailResentSuccess: boolean = false

  private verifyEmailRequest!: VerifyEmailRequest

  isLoading: boolean = false

  async asyncData({ route, redirect, store }) {
    const identities = identitiesStore(store)
    const auth = authStore(store)

    if (identities.identity === null) {
      await identities.getIdentity()
    }

    if (!authStore(store).isLoggedIn) {
      redirect('/')
      return
    }

    if (identities.emailVerified || auth.auth?.credentials.type === CredentialTypeEnum.USER) {
      return redirect('/login/verify/mobile')
    }

    const request: VerifyEmailRequest = {
      email: identities.identity!.rootUser?.email,
      verificationCode: route.query.nonce ? `${route.query.nonce}` : '',
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
      verifyEmailRequest: request,
    }
  }

  async mounted() {
    if (this.$route.query.send === 'true') {
      await this.sendVerifyEmail()
    }
  }

  async sendVerifyEmail() {
    this.isLoading = true

    try {
      if (this.isConsumer) {
        await this.sendVerifyEmailConsumers()
      } else {
        // else treat as corporate
        await this.sendVerifyEmailCorporates()
      }
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
    }
  }

  async sendVerifyEmailConsumers() {
    await this.stores.consumers.sendVerificationCodeEmail({
      email: this.verifyEmailRequest.email,
    })
  }

  async sendVerifyEmailCorporates() {
    await this.stores.corporates.sendVerificationCodeEmail({
      email: this.verifyEmailRequest.email,
    })
  }

  resendEmail() {
    this.sendVerifyEmail().then(() => {
      this.showEmailResentSuccess = true
    })
  }

  doVerify() {
    this.$v.$touch()

    if (this.$v.$invalid) {
      return
    }

    this.isLoading = true

    this.isConsumer
      ? this.stores.consumers
          .verifyEmail(this.verifyEmailRequest)
          .then(this.onMobileVerified)
          .catch((e) => {
            this.removeLoader()
            this.stores.errors.SET_CONFLICT(e)
          })
      : this.stores.corporates
          .verifyEmail(this.verifyEmailRequest)
          .then(this.onMobileVerified)
          .catch((e) => {
            this.removeLoader()
            this.stores.errors.SET_CONFLICT(e)
          })
  }

  removeLoader() {
    this.isLoading = false
  }

  onMobileVerified() {
    this.stores.identities.SET_EMAIL_VERIFIED(true)

    return this.$router.push({
      path: '/login/verify/mobile',
      query: {
        send: 'true',
        cons: this.$route.query.cons,
        corp: this.$route.query.corp,
        mobileNumber: this.$route.query.mobileNumber,
        mobileCountryCode: this.$route.query.mobileCountryCode,
      },
    })
  }
}
</script>