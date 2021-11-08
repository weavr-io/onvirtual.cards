<template>
  <b-col lg="6" offset-lg="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <b-card no-body class="overflow-hidden">
      <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
        <b-card-body class="p-card">
          <div class="form-screens">
            <div :class="{ 'd-none': screen !== 0 }" class="form-screen">
              <register-form :request="registrationRequest" @submit-form="form1Submit" />
            </div>
            <div :class="{ 'd-none': screen !== 1 }" class="form-screen">
              <personal-details-form :request="registrationRequest" @submit-form="form2Submit" @go-back="goBack" />
            </div>
          </div>
        </b-card-body>
      </b-overlay>
    </b-card>
  </b-col>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import config from '~/config'
import { CreatePassword } from '~/api/Requests/Auth/CreatePassword'
import { CreatePasswordIdentity } from '~/api/Requests/Auth/CreatePasswordIdentity'
import { Schemas } from '~/api/Schemas'
import { CompanyType } from '~/api/Enums/Corporates/CompanyType'
import { CreateCorporateRequest } from '~/api/Requests/Corporates/CreateCorporateRequest'
import BaseMixin from '~/minixs/BaseMixin'
import { BooleanString } from '~/api/Generic/BooleanString'
import { authStore } from '~/utils/store-accessor'

@Component({
  layout: 'auth',
  components: {
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    RegisterForm: () => import('~/components/registration/RegisterForm1.vue'),
    PersonalDetailsForm: () => import('~/components/registration/PersonalDetails.vue'),
    RegistrationNav: () => import('~/components/registration/Nav.vue'),
    ComingSoonCurrencies: () => import('~/components/comingSoonCurrencies.vue')
  }
})
export default class RegistrationPage extends mixins(BaseMixin) {
  get isLoading() {
    return this.stores.corporates.isLoading
  }

  get isLoggedIn() {
    return this.stores.auth.isLoggedIn
  }

  get corporate() {
    return this.stores.corporates.corporate
  }

  screen = 0

  public password: string = ''

  nextScreen() {
    this.screen++
  }

  goBack() {
    this.screen--
  }

  public registrationRequest: Nullable<CreateCorporateRequest> = {
    active: true,
    acceptedTerms: BooleanString.FALSE,
    companyName: '',
    companyRegistrationNumber: '',
    companyType: CompanyType.LLC,
    ipAddress: '111.222.333.444',
    profileId: '0',
    registrationCountry: 'MT',
    rootCompanyPosition: '',
    rootEmail: '',
    rootMobileCountryCode: '',
    rootMobileNumber: '',
    rootName: '',
    rootSurname: '',
    supportEmail: '',
    industry: null,
    sourceOfFunds: null,
    sourceOfFundsOther: '',
    kybProviderKey: 'sumsub'
  }

  form1Submit(_data) {
    if (_data != null) {
      this.registrationRequest.rootEmail = _data.rootEmail
      this.registrationRequest.supportEmail = _data.rootEmail
      this.password = _data.password

      this.registrationRequest.acceptedTerms = _data.acceptedTerms

      this.screen = 1
    }
  }

  form2Submit(_data) {
    if (_data != null) {
      this.registrationRequest.rootName = _data.rootName
      this.registrationRequest.rootSurname = _data.rootSurname
      this.registrationRequest.rootCompanyPosition = _data.rootCompanyPosition
      this.registrationRequest.rootMobileCountryCode = _data.rootMobileCountryCode
      this.registrationRequest.rootMobileNumber = _data.rootMobileNumber

      this.registrationRequest.companyName = _data.companyName
      this.registrationRequest.companyRegistrationNumber = _data.companyRegistrationNumber
      this.registrationRequest.registrationCountry = _data.registrationCountry

      this.registrationRequest.industry = _data.industry
      this.registrationRequest.sourceOfFunds = _data.sourceOfFunds
      this.registrationRequest.sourceOfFundsOther = _data.sourceOfFundsOther

      this.doRegister()
    }
  }

  doRegister() {
    this.stores.corporates.SET_IS_LOADING_REGISTRATION(true)

    this.stores.corporates
      .register(this.registrationRequest as CreateCorporateRequest)
      .then(this.doCreateCorporatePasswordIdentity.bind(this))
      .catch(this.registrationFailed.bind(this))
  }

  registrationFailed(err) {
    this.stores.corporates.SET_IS_LOADING_REGISTRATION(false)
    const _errCode = err.response.data.errorCode

    if (_errCode === 'ROOT_USERNAME_NOT_UNIQUE' || _errCode === 'ROOT_EMAIL_NOT_UNIQUE') {
      this.screen = 0
    } else {
      this.$weavrToastError(_errCode)
    }
  }

  doCreateCorporatePasswordIdentity() {
    const _req: CreatePasswordIdentity = {
      id: this.corporate!.id.id,
      request: {
        profileId: this.registrationRequest.profileId!
      }
    }
    this.stores.auth
      .createPasswordIdentity(_req)
      .then(this.doCreateCorporatePassword.bind(this), this.registrationFailed.bind(this))
  }

  doCreateCorporatePassword() {
    const _req: CreatePassword = {
      id: this.corporate!.id.id,
      request: {
        credentialType: 'ROOT',
        identityId: this.corporate!.id.id,
        password: {
          value: this.password
        }
      }
    }

    this.stores.auth.createPassword(_req).then(this.waitAndDoLogin.bind(this), this.registrationFailed.bind(this))
  }

  waitAndDoLogin() {
    this.sleep(2000).then(this.doLogin.bind(this))
  }

  doLogin() {
    const _loginRequest: Schemas.LoginRequest = {
      code: this.registrationRequest.rootEmail!,
      password: this.password
    }

    this.stores.auth
      .authenticate(_loginRequest)
      .then(this.goToVerifyEmail.bind(this), this.registrationFailed.bind(this))
  }

  goToVerifyEmail() {
    this.stores.corporates.SET_IS_LOADING_REGISTRATION(false)
    this.$router.push({
      path: '/register/verify',
      query: {
        send: 'true',
        corp: this.corporate!.id.id + '',
        email: this.registrationRequest.rootEmail,
        mobileNumber: this.registrationRequest.rootMobileNumber,
        mobileCountryCode: this.registrationRequest.rootMobileCountryCode
      }
    })
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.stores.corporates.register(e)
    }
  }

  mounted() {
    this.registrationRequest.profileId = config.profileId.corporates
  }

  asyncData({ store, redirect }) {
    const isLoggedIn = authStore(store).isLoggedIn

    if (isLoggedIn) {
      redirect('/dashboard')
    }
  }
}
</script>
