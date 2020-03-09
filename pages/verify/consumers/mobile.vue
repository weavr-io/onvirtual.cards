<template>
  <section>
    <b-container>
      <b-row class="full-height-vh" align-v="center">
        <b-col lg="6" offset-lg="3">
          <div class="text-center pb-5">
            <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
          </div>
          <div class="mx-md-3 px-md-5">
            <b-card bg-variant="secondary" text-variant="dark">
              <b-card-text>
                We sent you a verification code by email. Please enter that code to verify your email address.
              </b-card-text>
            </b-card>
            <b-card class="py-5">
              <error-alert />
              <form id="form-send-verification" @submit="sendVerificationCodeMobile" v-if="!sent">
                <b-form-group label="Mobile Country Code:">
                  <b-form-input v-model="request.request.mobileCountryCode" />
                </b-form-group>
                <b-form-group label="Mobile Number:">
                  <b-form-input v-model="request.request.mobileNumber" />
                </b-form-group>
                <loader-button :is-loading="isLoading" button-text="Send" class="mt-5 text-right mb-0" />
              </form>
              <form id="form-verify" @submit="doVerify" v-if="sent">
                <b-form-group label="Mobile Country Code:">
                  <b-form-input v-model="request.request.mobileCountryCode" disabled />
                </b-form-group>
                <b-form-group label="Mobile Number:">
                  <b-form-input v-model="request.request.mobileNumber" disabled />
                </b-form-group>
                <b-form-group label="Validation Code:">
                  <b-form-input v-model="request.request.nonce" />
                </b-form-group>
                <loader-button :is-loading="isLoading" button-text="Verify" class="mt-5 text-right mb-0" />
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
import * as ConsumersStore from '~/store/modules/Consumers'
import { VerifyMobileRequest } from '~/api/Requests/Consumers/VerifyMobileRequest'
import { Consumer } from '~/api/Models/Consumers/Consumer'

const Auth = namespace(AuthStore.name)
const Consumers = namespace(ConsumersStore.name)

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  }
})
export default class EmailVerificationPage extends VueWithRouter {
  @Consumers.Getter isLoading

  @Consumers.Getter consumer!: Consumer | null

  public request!: VerifyMobileRequest

  sent: boolean = false

  async asyncData({ store }) {
    const request: VerifyMobileRequest = {
      consumerId: 0,
      request: {
        mobileNumber: '',
        mobileCountryCode: '',
        nonce: ''
      }
    }

    if (AuthStore.Helpers.isConsumer(store)) {
      const _consumerId = AuthStore.Helpers.identityId(store)
      if (_consumerId != null) {
        request.consumerId = _consumerId
        const res = await ConsumersStore.Helpers.get(store, _consumerId)
        request.request.mobileCountryCode = res.data.mobileCountryCode
        request.request.mobileNumber = res.data.mobileNumber
      }
    }

    return {
      request: request
    }
  }

  sendVerificationCodeMobile(evt) {
    evt.preventDefault()
    ConsumersStore.Helpers.sendVerificationCodeMobile(this.$store, this.request).then(() => {
      this.sent = true
    })
  }

  doVerify(evt) {
    evt.preventDefault()
    ConsumersStore.Helpers.verifyMobile(this.$store, this.request).then(
      this.goToDashboard.bind(this),
      this.errorOccurred.bind(this)
    )
  }

  errorOccurred(err) {}

  goToDashboard() {
    this.$router.push('/')
  }
}
</script>
