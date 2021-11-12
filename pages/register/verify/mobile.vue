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
                <b-form-input
                  v-model="nonce"
                  :state="isInvalid($v.nonce)"
                  placeholder="000000"
                  class="text-center"
                  @update="nonceChanged"
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
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { maxLength, minLength, required } from 'vuelidate/lib/validators'
import { VerifyMobileRequest as ConsumersVerifyMobileRequest } from '~/api/Requests/Consumers/VerifyMobileRequest'
import { VerifyMobileRequest as CorporatesVerifyMobileRequest } from '~/api/Requests/Corporates/VerifyMobileRequest'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import BaseMixin from '~/minixs/BaseMixin'
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'

const Countries = require('~/static/json/countries.json')

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    nonce: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(6)
    }
  }
})
export default class EmailVerificationPage extends mixins(BaseMixin) {
  get isLoading() {
    return this.stores.consumers.isLoading
  }

  get consumer(): Consumer | null {
    return this.stores.consumers.consumer
  }

  public consumerVerifyMobileRequest!: ConsumersVerifyMobileRequest

  public corporateVerifyMobileRequest!: CorporatesVerifyMobileRequest

  nonce: string = ''

  verificationIssue: boolean = false

  mobile = {
    countryCode: 'GB',
    number: ''
  }

  dismissSecs = 60
  dismissCountDown = 0

  numberIsValid: boolean | null = null

  countDownChanged(dismissCountDown) {
    this.dismissCountDown = dismissCountDown
  }

  showAlert() {
    this.dismissCountDown = this.dismissSecs
  }

  nonceChanged(val) {
    this.consumerVerifyMobileRequest.request.nonce = val
    this.corporateVerifyMobileRequest.request.nonce = val
  }

  get mobileCountries(): string[] {
    return Countries.map((_c) => {
      return _c['alpha-2']
    })
  }

  async asyncData({ store, redirect }) {
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

    if (authStore(store).isConsumer) {
      const _consumerId = authStore(store).identityId

      if (_consumerId != null) {
        const res = await consumersStore(store).get(_consumerId)
        consumerVerifyMobileRequest.consumerId = _consumerId
        consumerVerifyMobileRequest.request.mobileCountryCode = res.data.mobileCountryCode
        consumerVerifyMobileRequest.request.mobileNumber = res.data.mobileNumber
      }

      _mobileNumber =
        consumerVerifyMobileRequest.request.mobileCountryCode + consumerVerifyMobileRequest.request.mobileNumber
      _parsedNumber = parsePhoneNumberFromString(_mobileNumber)
      _number = consumerVerifyMobileRequest.request.mobileNumber
    } else if (authStore(store).isCorporate) {
      const _corporateId = authStore(store).identityId
      const _corporate = authStore(store).auth

      if (_corporateId != null && _corporate.credential) {
        const res = await corporatesStore(store).getUser({
          corporateId: _corporateId,
          userId: _corporate.credential.id
        })

        corporateVerifyMobileRequest.corporateId = _corporateId

        if (res.data.mobileCountryCode != null) {
          corporateVerifyMobileRequest.request.mobileCountryCode = res.data.mobileCountryCode
        }
        if (res.data.mobileNumber != null) {
          corporateVerifyMobileRequest.request.mobileNumber = res.data.mobileNumber
        }
      }

      _mobileNumber =
        corporateVerifyMobileRequest.request.mobileCountryCode + corporateVerifyMobileRequest.request.mobileNumber
      _parsedNumber = parsePhoneNumberFromString(_mobileNumber)
      _number = corporateVerifyMobileRequest.request.mobileNumber
    } else {
      redirect('/')
    }

    return {
      consumerVerifyMobileRequest,
      corporateVerifyMobileRequest,
      mobile: {
        countryCode: _parsedNumber?.country,
        number: _number
      }
    }
  }

  doVerify(evt) {
    evt.preventDefault()

    if (this.$v.nonce) {
      this.$v.nonce.$touch()
      if (this.$v.nonce.$anyError) {
        return null
      }
    }

    if (this.consumerVerifyMobileRequest.consumerId !== 0) {
      this.doVerifyConsumer()
    } else {
      this.doVerifyCorporate()
    }
  }

  doVerifyCorporate() {
    this.stores.corporates
      .verifyMobile(this.corporateVerifyMobileRequest)
      .then(this.getCorporate.bind(this), this.errorOccurred.bind(this))
  }

  doVerifyConsumer() {
    this.stores.consumers
      .verifyMobile(this.consumerVerifyMobileRequest)
      .then(this.getConsumer.bind(this), this.errorOccurred.bind(this))
  }

  errorOccurred(err) {
    console.log(err)
  }

  getCorporate() {
    this.stores.corporates
      .get(this.corporateVerifyMobileRequest.corporateId)
      .then(this.goToDashboard.bind(this), this.errorOccurred.bind(this))
  }

  getConsumer() {
    this.stores.consumers
      .get(this.consumerVerifyMobileRequest.consumerId)
      .then(this.goToIndex(), this.errorOccurred.bind(this))
  }

  mounted() {
    if (this.$route.query.send && this.$route.query.send === 'true') {
      this.sendVerifyPhone()
    }
  }

  sendVerifyPhone() {
    this.showAlert()
    if (this.consumerVerifyMobileRequest.consumerId !== 0) {
      this.sendVerifyPhoneConsumer()
    } else {
      this.sendVerifyPhoneCorporate()
    }
  }

  sendVerifyPhoneCorporate() {
    return this.stores.corporates.sendVerificationCodeMobile(this.corporateVerifyMobileRequest).catch(() => {
      this.verificationIssue = true
      this.dismissCountDown = 0
    })
  }

  sendVerifyPhoneConsumer() {
    return this.stores.consumers.sendVerificationCodeMobile(this.consumerVerifyMobileRequest).catch(() => {
      this.verificationIssue = true
      this.dismissCountDown = 0
    })
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
