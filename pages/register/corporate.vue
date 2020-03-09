<template>
  <section>
    <b-container>
      <b-row class="full-height-vh" align-v="center">
        <b-col lg="6" offset-lg="3" class="my-6">
          <div class="text-center pb-5">
            <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards">
          </div>
          <b-card no-body class="overflow-hidden">
            <!--            <registration-nav />-->
            <b-card-body class="p-6">
              <div class="form-screens">
                <error-alert />
                <div :class="{ 'd-none': screen !== 0 }" class="form-screen">
                  <register-form :request="registrationRequest" @submit-form="form1Submit" />
                </div>
                <div :class="{ 'd-none': screen !== 1 }" class="form-screen">
                  <personal-details-form :request="registrationRequest" @submit-form="form2Submit" @go-back="goBack" />
                </div>
                <div :class="{ 'd-none': screen !== 2 }" class="form-screen">
                  <company-details-form :request="registrationRequest" @submit-form="form3Submit" @go-back="goBack" />
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
import { namespace } from 'vuex-class'
import { Component } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CorporatesStore from '~/store/modules/Corporates'
import * as AuthStore from '~/store/modules/Auth'

import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import config from '~/config'
import { CreatePassword } from '~/api/Requests/Auth/CreatePassword'
import { CreatePasswordIdentity } from '~/api/Requests/Auth/CreatePasswordIdentity'

const Corporates = namespace(CorporatesStore.name)
const Auth = namespace(AuthStore.name)

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    RegisterForm: () => import('~/components/registration/RegisterForm1.vue'),
    PersonalDetailsForm: () => import('~/components/registration/PersonalDetails.vue'),
    CompanyDetailsForm: () => import('~/components/registration/CompanyDetails.vue'),
    RegistrationNav: () => import('~/components/registration/Nav.vue')
  }
})
export default class RegistrationPage extends VueWithRouter {
  @Corporates.Action register

  @Corporates.Getter isLoading

  @Auth.Getter isLoggedIn

  @Corporates.Getter corporate

  screen = 2

  public password: string = ''

  nextScreen() {
    this.screen++
  }

  goBack() {
    this.screen--
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
      this.registrationRequest.supportEmail = _data.rootEmail
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
      this.registrationRequest.rootMobileCountryCode = _data.rootMobileCountryCode
      this.registrationRequest.rootMobileNumber = _data.rootMobileNumber
      this.nextScreen()
    }
  }

  form3Submit(_data) {
    console.log(_data)
    if (_data != null) {
      this.registrationRequest.companyName = _data.companyName
      this.registrationRequest.companyRegistrationNumber = _data.companyRegistrationNumber
      this.registrationRequest.companyRegistrationAddress = _data.companyRegistrationAddress
      this.registrationRequest.registrationCountry = _data.registrationCountry
      this.registrationRequest.companyRegistrationDate = _data.companyRegistrationDate
      this.registrationRequest.acceptedTerms = _data.acceptedTerms

      this.doRegister()
    }
  }

  doRegister() {
    this.registrationRequest.companyBusinessAddress = this.registrationRequest.companyRegistrationAddress

    this.register(this.registrationRequest)
      .then(this.doCreateCorporatePasswordIdentity.bind(this))
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

  doCreateCorporatePasswordIdentity() {
    const _req: CreatePasswordIdentity = {
      id: this.corporate.id.id,
      request: {
        profileId: this.registrationRequest.profileId
      }
    }
    AuthStore.Helpers.createPasswordIdentity(this.$store, _req).then(this.doCreateCorporatePassword.bind(this))
  }

  doCreateCorporatePassword() {
    const _req: CreatePassword = {
      id: this.corporate.id.id,
      request: {
        credentialType: 'ROOT',
        identityId: this.corporate.id.id,
        password: {
          value: this.password
        }
      }
    }

    AuthStore.Helpers.createPassword(this.$store, _req).then(this.sendVerifyEmail.bind(this))
  }

  sendVerifyEmail() {
    CorporatesStore.Helpers.sendVerificationCodeEmail(this.$store, {
      corporateId: this.corporate.id.id,
      body: {
        emailAddress: this.registrationRequest.rootEmail
      }
    }).then(this.goToVerifyEmail.bind(this))
  }

  goToVerifyEmail() {
    this.$router.push({
      path: '/register/verify',
      query: { corp: this.corporate.id.id, email: this.registrationRequest.rootEmail }
    })
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
