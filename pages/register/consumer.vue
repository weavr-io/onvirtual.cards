<template>
  <section>
    <b-container>
      <b-row class="full-height-vh" align-v="center">
        <b-col md="6" offset-md="3">
          <div class="text-center pb-5">
            <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
          </div>
          <b-card no-body class="overflow-hidden">
            <registration-nav />
            <b-card-body class="px-6 py-5">
              <div class="form-screens">
                <error-alert />
                <div v-if="screen === 0" class="form-screen">
                  <register-form :request="registrationRequest" @submit-form="submitRegistrationDetails" />
                </div>
                <div v-if="screen === 1" class="form-screen">
                  <consumer-personal-details-form
                    :request="registrationRequest"
                    @submit-form="submitPersonalDetails"
                    @go-back="goBack"
                  />
                </div>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'

import config from '~/config'
import { CreateConsumerRequest } from '~/api/Requests/Consumers/CreateConsumerRequest'
import { _Requests, Helpers } from '~/store/modules/Contracts/Consumers'
import * as ConsumersStore from '~/store/modules/Consumers'
import { Consumer } from '~/api/Models/Consumers/Consumer'

const Consumers = namespace(ConsumersStore.name)

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    RegisterForm: () => import('~/components/registration/RegisterForm1.vue'),
    ConsumerPersonalDetailsForm: () => import('~/components/registration/ConsumerPersonalDetails.vue'),
    CompanyDetailsForm: () => import('~/components/registration/CompanyDetails.vue'),
    RegistrationNav: () => import('~/components/registration/Nav.vue')
  }
})
export default class ConsumerRegistrationPage extends VueWithRouter {
  @Consumers.Getter consumer!: Consumer

  public registrationRequest: CreateConsumerRequest = {
    profileId: 0,
    name: '',
    surname: '',
    email: '',
    credentialCode: '',
    secretType: {
      firstSecretType: 'passwords'
    },
    mobileCountryCode: '',
    mobileNumber: ''
  }

  public password: string = ''

  screen = 0

  nextScreen() {
    this.screen++
  }

  goBack() {
    this.screen--
  }

  submitRegistrationDetails(_data) {
    if (_data != null) {
      this.registrationRequest.credentialCode = _data.rootUsername
      this.registrationRequest.email = _data.rootEmail
      this.password = _data.password
      this.nextScreen()
    }
  }

  submitPersonalDetails(_data) {
    if (_data != null) {
      this.registrationRequest.name = _data.rootName
      this.registrationRequest.surname = _data.rootSurname
      this.registrationRequest.mobileCountryCode = '+' + _data.rootMobileCountryCode
      this.registrationRequest.mobileNumber = _data.rootMobileNumber
      this.doRegister()
    }
  }

  mounted() {
    super.mounted()

    this.registrationRequest.profileId = config.profileId.consumers
  }

  doRegister() {
    Helpers.create(this.$store, this.registrationRequest)
      .then(this.doCreatePasswordIdentity.bind(this))
      .catch(this.registrationFailed.bind(this))
  }

  registrationFailed(err) {

    const _errCode = err.response.data.errorCode

    if (_errCode === 'ROOT_USERNAME_NOT_UNIQUE' || _errCode === 'ROOT_EMAIL_NOT_UNIQUE') {
      this.screen = 0
    } else {
      this.$weavrToastError(_errCode)
    }
  }

  doCreatePasswordIdentity() {
    const _req: _Requests.CreatePasswordIdentity = {
      consumerId: this.consumer.id.id,
      request: {
        profileId: this.registrationRequest.profileId
      }
    }
    Helpers.createPasswordIdentity(this.$store, _req).then(this.sendVerifyEmail.bind(this))
  }

  sendVerifyEmail() {
    Helpers.sendVerificationCodeEmail(this.$store, {
      consumerId: this.consumer.id.id,
      request: {
        emailAddress: this.registrationRequest.email
      }
    }).then(this.goToVerifyEmail.bind(this))
  }

  goToVerifyEmail() {
    this.$router.push({
      path: '/register/verify',
      query: { cons: this.consumer.id.id, email: this.registrationRequest.email }
    })
  }
}
</script>
