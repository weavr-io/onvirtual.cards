<template>
  <b-col md="8" offset-md="2" lg="6" offset-lg="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <div>
      <b-card class="py-5 px-5 mt-5">
        <h3 class="font-weight-light text-center">
          Let's also verify your phone number
        </h3>
        <b-row>
          <b-col md="6" offset-md="3" class="text-center">
            <b-img fluid src="/img/mobile.svg" class="mt-5 mb-2" />
          </b-col>
        </b-row>
        <error-alert />
        <p class="text-center my-5 text-grey">
          We’ve just sent you a verification code by SMS. Enter code below to verify your phone number.
        </p>
        <form id="form-verify" @submit.prevent="doVerify">
          <b-row>
            <b-col cols="6" offset="3">
              <b-form-group label="">
                <b-form-input
                  v-model="$v.request.verificationCode.$model"
                  :state="isInvalid($v.request.verificationCode)"
                  placeholder="000000"
                  class="text-center"
                />
                <b-form-invalid-feedback>This field is required and must be 6 characters.</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <loader-button :is-loading="isLoading" button-text="verify" class="mt-5 text-center mb-0" />
        </form>
        <b-alert
          :show="dismissCountDown"
          variant="white"
          class="text-center mt-4 mb-0 text-muted small"
          @dismiss-count-down="countDownChanged"
        >
          {{ dismissCountDown }} seconds until you can send another verification code
        </b-alert>
        <div v-if="!dismissCountDown" class="mt-4 text-center">
          <template v-if="verificationIssue">
            <small class="text-grey"
              >We could not verify your mobile number. Please contact support for assistance</small
            >
          </template>
          <template v-else>
            <small class="text-grey">
              Didn’t receive a code?
              <b-link class="text-decoration-underline text-grey" @click="sendVerifyPhone">Send again</b-link>
              .
            </small>
          </template>
        </div>
      </b-card>
    </div>
  </b-col>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { maxLength, minLength, required } from 'vuelidate/lib/validators'
import BaseMixin from '~/minixs/BaseMixin'
import { authStore, identitiesStore } from '~/utils/store-accessor'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { AuthVerifyEnrolRequest } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/requests/AuthVerifyEnrolRequest'
import ValidationMixin from '~/minixs/ValidationMixin'

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    request: {
      verificationCode: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(6)
      }
    }
  }
})
export default class EmailVerificationPage extends mixins(BaseMixin, ValidationMixin) {
  isLoading: boolean = false

  request: Nullable<AuthVerifyEnrolRequest> = {
    verificationCode: null
  }

  verificationIssue: boolean = false

  dismissSecs = 60
  dismissCountDown = 0

  async asyncData({ store, redirect }) {
    const identities = identitiesStore(store)

    if (identities.identity === null) {
      await identities.getIdentity()
    }

    if (!authStore(store).isLoggedIn) {
      redirect('/')
    }

    if (!identities.emailVerified) {
      return redirect('/register/verify')
    } else if (identities.mobileNumberVerified) {
      return redirect('/')
    }
  }

  mounted() {
    if (this.$route.query.send && this.$route.query.send === 'true') {
      this.sendVerifyPhone()
    }
  }

  async sendVerifyPhone() {
    this.showAlert()
    this.isLoading = true
    await this.stores.auth.enrollAuthFactors(SCAOtpChannelEnum.SMS).then(() => (this.isLoading = false))
  }

  async doVerify() {
    this.$v.$touch()
    if (this.$v.$invalid) {
      return null
    }

    this.isLoading = true

    const req: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrolRequest } = {
      channel: SCAOtpChannelEnum.SMS,
      body: this.request as AuthVerifyEnrolRequest
    }

    await this.stores.auth
      .verifyAuthFactors(req)
      .finally(() => {
        this.stores.identities.SET_MOBILE_VERIFIED(true)
        this.goToIndex()
      })
      .catch((e) => {
        this.errorOccurred(e)
        this.isLoading = false
      })
  }

  countDownChanged(dismissCountDown) {
    this.dismissCountDown = dismissCountDown
  }

  showAlert() {
    this.dismissCountDown = this.dismissSecs
  }

  errorOccurred(err) {
    console.log(err)
  }
}
</script>
