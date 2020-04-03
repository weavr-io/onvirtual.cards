<template>
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
                <b-form-input v-model="nonce" @update="nonceChanged" placeholder="000000" class="text-center" />
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
</template>

<script lang="ts">
import { namespace } from 'vuex-class'
import { Component } from 'nuxt-property-decorator'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import * as CorporatesStore from '~/store/modules/Corporates'
import { VerifyMobileRequest as ConsumersVerifyMobileRequest } from '~/api/Requests/Consumers/VerifyMobileRequest'
import { VerifyMobileRequest as CorporatesVerifyMobileRequest } from '~/api/Requests/Corporates/VerifyMobileRequest'
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

  public consumerVerifyMobileRequest!: ConsumersVerifyMobileRequest

  public corporateVerifyMobileRequest!: CorporatesVerifyMobileRequest

  nonce: string = ''

  mobile = {
    countryCode: 'GB',
    number: ''
  }

  numberIsValid: boolean | null = null

  nonceChanged(val) {
    this.consumerVerifyMobileRequest.request.nonce = val
    this.corporateVerifyMobileRequest.request.nonce = val
  }

  get mobileCountries(): string[] {
    return Countries.map((_c) => {
      return _c['alpha-2']
    })
  }

  async asyncData({ store, route, redirect }) {
    const consumerVerifyMobileRequest: ConsumersVerifyMobileRequest = {
      consumerId: 0,
      request: {
        mobileNumber: '',
        mobileCountryCode: '',
        nonce: ''
      }
    }

    const corporateVerifyMobileRequest: CorporatesVerifyMobileRequest = {
      corporateId: 0,
      request: {
        mobileNumber: '',
        mobileCountryCode: '',
        nonce: ''
      }
    }

    let _mobileNumber, _parsedNumber, _number

    if (route.query.cons) {
      consumerVerifyMobileRequest.consumerId = route.query.cons
      consumerVerifyMobileRequest.request.mobileCountryCode = route.query.mobileCountryCode
      consumerVerifyMobileRequest.request.mobileNumber = route.query.mobileNumber

      _mobileNumber =
              consumerVerifyMobileRequest.request.mobileCountryCode + consumerVerifyMobileRequest.request.mobileNumber
      _parsedNumber = parsePhoneNumberFromString(_mobileNumber)
      _number = consumerVerifyMobileRequest.request.mobileNumber

      await ConsumersStore.Helpers.sendVerificationCodeMobile(store, consumerVerifyMobileRequest)
    } else if (route.query.corp) {
      corporateVerifyMobileRequest.corporateId = route.query.corp
      corporateVerifyMobileRequest.request.mobileCountryCode = route.query.mobileCountryCode
      corporateVerifyMobileRequest.request.mobileNumber = route.query.mobileNumber

      _mobileNumber =
              corporateVerifyMobileRequest.request.mobileCountryCode + corporateVerifyMobileRequest.request.mobileNumber
      _parsedNumber = parsePhoneNumberFromString(_mobileNumber)
      _number = corporateVerifyMobileRequest.request.mobileNumber

      await CorporatesStore.Helpers.sendVerificationCodeMobile(store, corporateVerifyMobileRequest)
    } else if (AuthStore.Helpers.isConsumer(store)) {
      const _consumerId = AuthStore.Helpers.identityId(store)
      if (_consumerId != null) {
        consumerVerifyMobileRequest.consumerId = _consumerId
        const res = await ConsumersStore.Helpers.get(store, _consumerId)
        consumerVerifyMobileRequest.request.mobileCountryCode = res.data.mobileCountryCode
        consumerVerifyMobileRequest.request.mobileNumber = res.data.mobileNumber
      }

      _mobileNumber =
              consumerVerifyMobileRequest.request.mobileCountryCode + consumerVerifyMobileRequest.request.mobileNumber
      _parsedNumber = parsePhoneNumberFromString(_mobileNumber)
      _number = consumerVerifyMobileRequest.request.mobileNumber

      await ConsumersStore.Helpers.sendVerificationCodeMobile(store, consumerVerifyMobileRequest)
    } else if (AuthStore.Helpers.isCorporate(store)) {
      const _corporateId = AuthStore.Helpers.identityId(store)
      if (_corporateId != null) {
        corporateVerifyMobileRequest.corporateId = _corporateId
        const res = await ConsumersStore.Helpers.get(store, _corporateId)
        corporateVerifyMobileRequest.request.mobileCountryCode = res.data.mobileCountryCode
        corporateVerifyMobileRequest.request.mobileNumber = res.data.mobileNumber
      }

      _mobileNumber =
              corporateVerifyMobileRequest.request.mobileCountryCode + corporateVerifyMobileRequest.request.mobileNumber
      _parsedNumber = parsePhoneNumberFromString(_mobileNumber)
      _number = corporateVerifyMobileRequest.request.mobileNumber

      await CorporatesStore.Helpers.sendVerificationCodeMobile(store, corporateVerifyMobileRequest)
    } else {
      redirect('/')
    }

    return {
      consumerVerifyMobileRequest: consumerVerifyMobileRequest,
      corporateVerifyMobileRequest: corporateVerifyMobileRequest,
      mobile: {
        countryCode: _parsedNumber?.country,
        number: _number
      }
    }
  }

  doVerify(evt) {
    evt.preventDefault()
    if (this.consumerVerifyMobileRequest.consumerId !== 0) {
      this.doVerifyConsumer()
    } else {
      this.doVerifyCorporate()
    }
  }

  doVerifyCorporate() {
    CorporatesStore.Helpers.verifyMobile(this.$store, this.corporateVerifyMobileRequest).then(
            this.goToDashboard.bind(this),
            this.errorOccurred.bind(this)
    )
  }

  doVerifyConsumer() {
    ConsumersStore.Helpers.verifyMobile(this.$store, this.consumerVerifyMobileRequest).then(
            this.goToDashboard.bind(this),
            this.errorOccurred.bind(this)
    )
  }

  errorOccurred(err) {
    console.log(err)
  }

  async goToDashboard() {
    if (AuthStore.Helpers.isConsumer(this.$store)) {
      await ConsumersStore.Helpers.get(this.$store, AuthStore.Helpers.identity(this.$store).id)
    }

    this.$router.push('/')
  }

  sendVerifyPhone() {
    if (this.consumerVerifyMobileRequest.consumerId !== 0) {
      this.sendVerifyPhoneConsumer()
    } else {
      this.sendVerifyPhoneCorporate()
    }
  }

  sendVerifyPhoneCorporate() {
    return CorporatesStore.Helpers.sendVerificationCodeMobile(this.$store, this.corporateVerifyMobileRequest)
  }

  sendVerifyPhoneConsumer() {
    return ConsumersStore.Helpers.sendVerificationCodeMobile(this.$store, this.consumerVerifyMobileRequest)
  }

  phoneUpdate(number) {
    this.$set(this.mobile, 'number', number.formatNational ? number.formatNational : number.phoneNumber)

    this.consumerVerifyMobileRequest.request.mobileCountryCode = number.countryCallingCode
    this.consumerVerifyMobileRequest.request.mobileNumber = number.nationalNumber

    this.corporateVerifyMobileRequest.request.mobileCountryCode = number.countryCallingCode
    this.corporateVerifyMobileRequest.request.mobileNumber = number.nationalNumber

    this.numberIsValid = number.isValid
  }
}
</script>
