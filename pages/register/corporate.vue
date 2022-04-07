<template>
  <b-col lg="6" offset-lg="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <b-card no-body class="overflow-hidden">
      <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
        <b-card-body class="p-card">
          <div class="form-screens">
            <div v-if="screen === 0" class="form-screen">
              <register-form @submit-form="form1Submit" />
            </div>
            <div v-else class="form-screen">
              <personal-details-form @submit-form="form2Submit" @go-back="goBack" />
            </div>
          </div>
        </b-card-body>
      </b-overlay>
    </b-card>
  </b-col>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { AxiosResponse } from 'axios'

import BaseMixin from '~/mixins/BaseMixin'
import { authStore } from '~/utils/store-accessor'
import { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { CreatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/CreatePasswordRequestModel'
import { LoginWithPasswordRequest } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPasswordRequest'

@Component({
  layout: 'auth',
  components: {
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    RegisterForm: () => import('~/components/registration/RegisterForm1.vue'),
    PersonalDetailsForm: () => import('~/components/registration/PersonalDetails.vue'),
    RegistrationNav: () => import('~/components/registration/Nav.vue'),
    ComingSoonCurrencies: () => import('~/components/comingSoonCurrencies.vue')
  },
  middleware: 'accessCodeVerified'
})
export default class RegistrationPage extends mixins(BaseMixin) {
  screen: number = 0

  private registrationRequest: DeepNullable<RecursivePartial<CreateCorporateRequest & { password: string }>> = {
    profileId: this.$config.profileId.corporates,
    tag: 'tag',
    rootUser: {
      name: null,
      surname: null,
      email: null,
      mobile: {
        number: null,
        countryCode: '+356'
      },
      companyPosition: null
    },
    company: {
      type: null,
      name: '',
      registrationNumber: '',
      registrationCountry: ''
    },
    industry: IndustryTypeEnum.ACCOUNTING,
    sourceOfFunds: CorporateSourceOfFundTypeEnum.CIVIL_CONTRACT,
    acceptedTerms: false,
    ipAddress: '',
    baseCurrency: CurrencyEnum.EUR
  }

  get isLoading() {
    return this.stores.corporates.isLoading
  }

  goBack() {
    this.screen--
  }

  asyncData({ store, redirect }) {
    const isLoggedIn = authStore(store).isLoggedIn

    if (isLoggedIn) {
      redirect('/dashboard')
    }
  }

  fetch() {
    this.$apiMulti.ipify.get().then((ip) => {
      this.registrationRequest.ipAddress = ip.data.ip
    })
  }

  form1Submit(_data: { email: string | null; password: string | null; acceptedTerms: boolean } | null) {
    if (_data !== null) {
      this.registrationRequest.rootUser!.email = _data.email
      this.registrationRequest.password = _data.password
      this.registrationRequest.acceptedTerms = _data.acceptedTerms

      this.screen = 1
    }
  }

  form2Submit(_data) {
    if (_data != null) {
      this.registrationRequest.rootUser!.name = _data.rootUser.name
      this.registrationRequest.rootUser!.surname = _data.rootUser.surname
      this.registrationRequest.rootUser!.companyPosition = _data.rootUser.companyPosition
      this.registrationRequest.rootUser!.mobile! = { ..._data.rootUser.mobile }

      this.registrationRequest.company!.name = _data.company.name
      this.registrationRequest.company!.type = _data.company.type
      this.registrationRequest.company!.registrationNumber = _data.company.registrationNumber
      this.registrationRequest.company!.registrationCountry = _data.company.registrationCountry

      this.registrationRequest.industry = _data.industry
      this.registrationRequest.sourceOfFunds = _data.sourceOfFunds
      this.registrationRequest.sourceOfFundsOther = _data.sourceOfFundsOther

      this.doRegister()
    }
  }

  doRegister() {
    this.stores.corporates.SET_IS_LOADING_REGISTRATION(true)

    this.stores.corporates
      .create(this.registrationRequest as CreateCorporateRequest)
      .then(this.onCorporateCreated)
      .catch(this.registrationFailed)
  }

  onCorporateCreated(res: AxiosResponse<ConsumerModel>) {
    this.createPassword(res.data.id, res.data.rootUser.id.id!)
  }

  createPassword(identity: IdentityIdModel, rootUserId: IDModel) {
    const passwordRequest: CreatePasswordRequestModel = {
      password: {
        value: this.registrationRequest.password as string
      }
    }
    this.$apiMulti.passwords
      .store({
        userId: rootUserId,
        data: passwordRequest
      })
      .then(this.onRegisteredSuccessfully.bind(this))
  }

  onRegisteredSuccessfully() {
    this.stores.accessCodes.DELETE_ACCESS_CODE()

    if (!this.registrationRequest.rootUser) {
      return
    }

    const loginRequest: LoginWithPasswordRequest = {
      email: this.registrationRequest.rootUser.email as string,
      password: {
        value: this.registrationRequest.password as string
      }
    }

    const _req = this.stores.auth.loginWithPassword(loginRequest)

    _req.then(() => {
      this.$router.push({ path: '/profile/address' })
    })
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
}
</script>
