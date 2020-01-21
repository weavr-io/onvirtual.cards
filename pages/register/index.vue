<template>
  <section class="h-100 bg-pattern">
    <b-container class="d-flex h-100">
      <b-row class="w-100 align-self-center">
        <b-col id="login-box" class="my-5 bg-white" md="6" offset-md="3">
          <div class="mt-5 text-center pb-5">
            <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="DevPay" >
          </div>
          <div class="my-4 mx-3">
            <div class="form-screens">
              <error-alert />
              <div v-if="screen === 0" class="form-screen">
                <register-form @submit-form="form1Submit" />
              </div>
              <div v-if="screen === 1" class="form-screen">
                <personal-details-form @submit-form="form2Submit" />
              </div>
              <div v-if="screen === 2" class="form-screen">
                <company-details-form @submit-form="form3Submit" />
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { namespace } from 'vuex-class'
import { Component } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CorporatesStore from '~/store/modules/Corporates'
import * as AuthStore from '~/store/modules/Auth'

import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import config from '~/config'
import { _Functions } from '~/store/modules/Contracts/Corporates'

const Corporates = namespace(CorporatesStore.name)
const Auth = namespace(AuthStore.name)

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    RegisterForm: () => import('~/components/registration/RegisterForm1.vue'),
    PersonalDetailsForm: () => import('~/components/registration/PersonalDetails.vue'),
    CompanyDetailsForm: () => import('~/components/registration/CompanyDetails.vue')
  }
})
export default class RegistrationPage extends VueWithRouter {
  @Corporates.Action register

  @Corporates.Action createCorporatePasswordIdentity

  @Corporates.Action createCorporatePassword

  @Corporates.Action
  sendVerificationCodeEmail!: _Functions.sendVerificationCodeEmail

  @Corporates.Getter isLoading

  @Auth.Getter isLoggedIn

  @Corporates.Getter corporate

  screen = 0

  public password: string = ''

  nextScreen() {
    this.screen++
  }

  public registrationRequest: CorporatesSchemas.CreateCorporateRequest = {
    active: true,
    acceptedTerms: false,
    companyBusinessAddress: '',
    companyName: '',
    companyRegistrationAddress: '',
    companyRegistrationNumber: '',
    companyRegistrationDate: 0,
    companyType: CorporatesSchemas.CompanyType.LLC,
    ipAddress: '111.222.333.444',
    profileId: 0,
    registrationCountry: 'MT',
    rootCompanyPosition: '',
    rootEmail: '',
    rootMobileCountryCode: '',
    rootMobileNumber: '',
    rootName: '',
    rootSecretType: { firstSecretType: 'passwords' },
    rootSurname: '',
    rootTitle: '',
    rootUsername: '',
    supportEmail: ''
  }

  form1Submit(_data) {
    if (_data != null) {
      this.registrationRequest.rootUsername = _data.rootUsername
      this.registrationRequest.rootEmail = _data.rootEmail
      this.password = _data.password
      this.nextScreen()
    }
  }

  form2Submit(_data) {
    if (_data != null) {
      this.registrationRequest.rootName = _data.rootName
      this.registrationRequest.rootSurname = _data.rootSurname
      this.registrationRequest.rootTitle = _data.rootTitle
      this.registrationRequest.rootCompanyPosition = _data.rootCompanyPosition
      this.registrationRequest.rootMobileCountryCode = '+' + _data.rootMobileCountryCode
      this.registrationRequest.rootMobileNumber = _data.rootMobileNumber
      this.nextScreen()
    }
  }

  form3Submit(_data) {
    if (_data != null) {
      this.registrationRequest.companyName = _data.companyName
      this.registrationRequest.companyRegistrationNumber = _data.companyRegistrationNumber
      this.registrationRequest.companyRegistrationAddress = _data.companyRegistrationAddress
      this.registrationRequest.registrationCountry = _data.registrationCountry
      this.registrationRequest.companyRegistrationDate = _data.companyRegistrationDate
      this.registrationRequest.supportEmail = _data.supportEmail
      this.registrationRequest.acceptedTerms = _data.acceptedTerms

      this.doRegister()
    }
  }

  doRegister() {
    this.registrationRequest.companyBusinessAddress = this.registrationRequest.companyRegistrationAddress

    this.register(this.registrationRequest).then(this.doCreateCorporatePasswordIdentity.bind(this))
  }

  doCreateCorporatePasswordIdentity() {
    const _req: CorporatesSchemas.CreateCorporatePasswordIdentity = {
      corporateId: this.corporate.id.id,
      request: {
        profileId: this.registrationRequest.profileId
      }
    }
    this.createCorporatePasswordIdentity(_req).then(this.doCreateCorporatePassword.bind(this))
  }

  doCreateCorporatePassword() {
    const _req: CorporatesSchemas.CreateCorporatePassword = {
      corporateId: this.corporate.id.id,
      request: {
        credentialType: 'ROOT',
        identityId: this.corporate.id.id,
        password: {
          value: this.password
        }
      }
    }

    this.createCorporatePassword(_req).then(this.sendVerifyEmail.bind(this))
  }

  sendVerifyEmail() {
    this.sendVerificationCodeEmail({
      corporateId: this.corporate.id.id,
      body: {
        emailAddress: this.registrationRequest.rootEmail
      }
    }).then(this.goToVerifyEmail.bind(this))
  }

  goToVerifyEmail() {
    this.$router.push('/register/verify/corporates/' + this.corporate.id.id)
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.register(e)
    }
  }

  mounted() {
    super.mounted()

    this.registrationRequest.profileId = config.profileId.corporates
  }

  asyncData({ store, redirect }) {
    const isLoggedIn = store.getters['auth/isLoggedIn']

    if (isLoggedIn) {
      redirect('/dashboard')
    }
  }
}
</script>
