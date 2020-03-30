<template>
  <section>
    <b-container>
      <b-row class="full-height-vh" align-v="center">
        <b-col lg="6" offset-lg="3">
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
              <form id="form-verify" @submit="doVerify">
                <!--                <b-form-group label="MOBILE NUMBER:">-->
                <!--                  <vue-phone-number-input-->
                <!--                    :value="mobile.number"-->
                <!--                    @update="phoneUpdate"-->
                <!--                    :only-countries="mobileCountries"-->
                <!--                    :defaultCountryCode="mobile.countryCode"-->
                <!--                    :border-radius="0"-->
                <!--                    :error="numberIsValid === false"-->
                <!--                    color="#6C1C5C"-->
                <!--                    error-color="#F50E4C"-->
                <!--                    valid-color="#6D7490"-->
                <!--                    default-country-code="GB"-->
                <!--                    disabled-->
                <!--                  />-->
                <!--                  <b-form-invalid-feedback v-if="numberIsValid === false" force-show>-->
                <!--                    This field must be a valid mobile number.-->
                <!--                  </b-form-invalid-feedback>-->
                <!--                </b-form-group>-->
                <b-row>
                  <b-col md="4" offset-md="4">
                    <b-form-group label="">
                      <b-form-input
                              v-model="verifyMobileRequest.request.nonce"
                              placeholder="0000"
                              class="text-center"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
                <loader-button :is-loading="isLoading" button-text="verify" class="mt-5 text-center mb-0" />
              </form>
              <div class="mt-4 text-center">
                <small class="text-grey">
                  Didn’t receive a code?
                  <b-link @click="sendVerifyPhone" class="text-decoration-underline text-grey">Send again</b-link>
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
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import { VerifyMobileRequest } from '~/api/Requests/Consumers/VerifyMobileRequest'
import { Consumer } from '~/api/Models/Consumers/Consumer'

const Countries = require('~/static/json/countries.json')

const Consumers = namespace(ConsumersStore.name)

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  }
})
export default class EmailVerificationPage extends VueWithRouter {
  @Consumers.Getter isLoading

  @Consumers.Getter consumer!: Consumer | null

  public verifyMobileRequest!: VerifyMobileRequest

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

  async asyncData({ store, route, redirect }) {
    const request: VerifyMobileRequest = {
      consumerId: 0,
      request: {
        mobileNumber: '',
        mobileCountryCode: '',
        nonce: ''
      }
    }

    if (route.query.cons) {
      request.consumerId = route.query.cons
      request.request.mobileCountryCode = route.query.mobileCountryCode
      request.request.mobileNumber = route.query.mobileNumber
    } else if (AuthStore.Helpers.isConsumer(store)) {
      const _consumerId = AuthStore.Helpers.identityId(store)
      if (_consumerId != null) {
        request.consumerId = _consumerId
        const res = await ConsumersStore.Helpers.get(store, _consumerId)
        request.request.mobileCountryCode = res.data.mobileCountryCode
        request.request.mobileNumber = res.data.mobileNumber
      }
    } else {
      redirect('/')
    }

    const _mobileNumber = request.request.mobileCountryCode + request.request.mobileNumber
    const _parsedNumber = parsePhoneNumberFromString(_mobileNumber)

    await ConsumersStore.Helpers.sendVerificationCodeMobile(store, request)

    return {
      verifyMobileRequest: request,
      mobile: {
        countryCode: _parsedNumber?.country,
        number: request.request.mobileNumber
      }
    }
  }

  doVerify(evt) {
    evt.preventDefault()
    ConsumersStore.Helpers.verifyMobile(this.$store, this.verifyMobileRequest).then(
            this.goToDashboard.bind(this),
            this.errorOccurred.bind(this)
    )
  }

  errorOccurred(err) {
  }

  async goToDashboard() {
    if (AuthStore.Helpers.isConsumer(this.$store)) {
      await ConsumersStore.Helpers.get(this.$store, AuthStore.Helpers.identity(this.$store).id)
    }

    this.$router.push('/')
  }

  sendVerifyPhone() {
    return ConsumersStore.Helpers.sendVerificationCodeMobile(this.$store, this.verifyMobileRequest)
  }

  phoneUpdate(number) {
    this.$set(this.mobile, 'number', number.formatNational ? number.formatNational : number.phoneNumber)
    this.verifyMobileRequest.request.mobileCountryCode = number.countryCallingCode
    this.verifyMobileRequest.request.mobileNumber = number.nationalNumber
    this.numberIsValid = number.isValid
  }
}
</script>
