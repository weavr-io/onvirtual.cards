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
                We sent you a verification code by SMS.  Please enter that code to verify your mobile number.
              </b-card-text>
            </b-card>
            <b-card class="py-5">
              <error-alert />
              <form id="form-send-verification" @submit="sendVerificationCodeMobile" v-if="!sent">
                <b-form-group label="MOBILE NUMBER:">
                  <vue-phone-number-input
                    :value="mobile.number"
                    @update="phoneUpdate"
                    :only-countries="mobileCountries"
                    :defaultCountryCode="mobile.countryCode"
                    :border-radius="0"
                    :error="numberIsValid === false"
                    color="#6C1C5C"
                    error-color="#F50E4C"
                    valid-color="#6D7490"
                    default-country-code="GB"
                  />
                  <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                    This field must be a valid mobile number.
                  </b-form-invalid-feedback>
                </b-form-group>
                <loader-button :is-loading="isLoading" button-text="Send" class="mt-5 text-right mb-0" />
              </form>
              <form id="form-verify" @submit="doVerify" v-if="sent">
                <b-form-group label="MOBILE NUMBER:">
                  <vue-phone-number-input
                    :value="mobile.number"
                    @update="phoneUpdate"
                    :only-countries="mobileCountries"
                    :defaultCountryCode="mobile.countryCode"
                    :border-radius="0"
                    :error="numberIsValid === false"
                    color="#6C1C5C"
                    error-color="#F50E4C"
                    valid-color="#6D7490"
                    default-country-code="GB"
                    disabled
                  />
                  <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                    This field must be a valid mobile number.
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Validation Code:">
                  <b-form-input v-model="verifyMobileRequest.request.nonce" />
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
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import { VerifyMobileRequest } from '~/api/Requests/Consumers/VerifyMobileRequest'
import { Consumer } from '~/api/Models/Consumers/Consumer'

const Countries = require('~/static/json/countries.json')

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

  public verifyMobileRequest!: VerifyMobileRequest

  sent: boolean = false

  mobile = {
    countryCode: 'GB',
    number: ''
  }

  numberIsValid: boolean | null = null

  get mobileCountries(): string[] {
    return Countries.map((_c) => {
      return _c['alpha-2']
    })
  }

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

    const _mobileNumber = request.request.mobileCountryCode + request.request.mobileNumber
    const _parsedNumber = parsePhoneNumberFromString(_mobileNumber)

    return {
      verifyMobileRequest: request,
      mobile: {
        countryCode: _parsedNumber?.country,
        number: request.request.mobileNumber
      }
    }
  }

  sendVerificationCodeMobile(evt) {
    evt.preventDefault()
    ConsumersStore.Helpers.sendVerificationCodeMobile(this.$store, this.verifyMobileRequest).then(() => {
      this.sent = true
    })
  }

  doVerify(evt) {
    evt.preventDefault()
    ConsumersStore.Helpers.verifyMobile(this.$store, this.verifyMobileRequest).then(
      this.goToDashboard.bind(this),
      this.errorOccurred.bind(this)
    )
  }

  errorOccurred(err) {}

  goToDashboard() {
    this.$router.push('/')
  }

  phoneUpdate(number) {
    this.$set(this.mobile, 'number', number.formatNational ? number.formatNational : number.phoneNumber)
    this.verifyMobileRequest.request.mobileCountryCode = number.countryCallingCode
    this.verifyMobileRequest.request.mobileNumber = number.nationalNumber
    this.numberIsValid = number.isValid
  }
}
</script>
