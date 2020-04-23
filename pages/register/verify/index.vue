<template>
  <b-col md="6" offset-md="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" >
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
                <b-form-input v-model="verifyEmailRequest.request.nonce" placeholder="000000" class="text-center" />
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
</template>

<script lang="ts">
import { namespace } from 'vuex-class'
import { Component } from 'nuxt-property-decorator'
import { Schemas } from '~/api/Schemas'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AuthStore from '~/store/modules/Auth'
import * as CorporatesStore from '~/store/modules/Corporates'
import * as ConsumersStore from '~/store/modules/Consumers'

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

  @Auth.Getter isLoading

  showEmailResentSuccess: boolean = false

  public verifyEmailRequest!: Schemas.verifyEmailRequest

  asyncData({ route, redirect, store }) {
    const request: Schemas.verifyEmailRequest = {
      consumerId: route.query.cons,
      corporateId: route.query.corp,
      request: {
        emailAddress: route.query.email + '',
        nonce: route.query.nonce ? route.query.nonce + '' : ''
      }
    }

    if (request.request.nonce !== '') {
      AuthStore.Helpers.verifyEmail(store, request).then(() => {
        redirect('/login')
      })
    }

    return {
      verifyEmailRequest: request
    }
  }

  async mounted() {
    if (this.verifyEmailRequest.corporateId === undefined && this.verifyEmailRequest.consumerId === undefined) {
      if (AuthStore.Helpers.isConsumer(this.$store)) {
        await this.getConsumerUser()
      } else {
        await this.getCorporateUser()
      }
    }

    if (this.$route.query.send === 'true') {
      this.sendVerifyEmail()
    }
  }

  async getConsumerUser() {
    const _consumerId = AuthStore.Helpers.identityId(this.$store)
    if (_consumerId != null) {
      const res = await ConsumersStore.Helpers.get(this.$store, _consumerId)
      this.verifyEmailRequest.consumerId = _consumerId
      this.verifyEmailRequest.request.emailAddress = res.data.email
    }
  }

  async getCorporateUser() {
    const _corporateId = AuthStore.Helpers.identityId(this.$store)
    const _corporate = AuthStore.Helpers.auth(this.$store)

    if (_corporateId != null && _corporate.credential) {
      const res = await CorporatesStore.Helpers.getUser(this.$store, {
        corporateId: _corporateId,
        userId: _corporate.credential.id
      })

      this.verifyEmailRequest.corporateId = _corporateId
      this.verifyEmailRequest.request.emailAddress = res.data.email
    }
  }

  sendVerifyEmail() {
    if (this.$route.query.cons || AuthStore.Helpers.isConsumer(this.$store)) {
      this.sendVerifyEmailConsumers()
    } else {
      this.sendVerifyEmailCorporates()
    }
  }

  sendVerifyEmailConsumers() {
    ConsumersStore.Helpers.sendVerificationCodeEmail(this.$store, {
      consumerId: this.verifyEmailRequest.consumerId,
      request: {
        emailAddress: this.verifyEmailRequest.request.emailAddress
      }
    }).then(() => {
      this.showEmailResentSuccess = true
    })
  }

  sendVerifyEmailCorporates() {
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
    AuthStore.Helpers.verifyEmail(this.$store, this.verifyEmailRequest).then(this.nextPage.bind(this))
  }

  nextPage() {
    this.goToVerifyMobile()
  }

  goToVerifyMobile() {
    this.$router.push({
      path: '/register/verify/mobile',
      query: {
        cons: this.$route.query.cons,
        corp: this.$route.query.corp,
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
