<template>
  <div>
    <app-header />
    <dashboard-header />
    <Nuxt />
    <kyb-alert />
    <kyc-alert />
    <b-alert
      id="verify-mobile"
      :show="showVerifyMobileAlert && !showVerifyEmailAlert"
      class="fixed-bottom bottom-left-alert m-4 p-4"
      variant="bg-colored"
    >
      We need to verify your mobile number. Please click
      <b-link to="/register/verify/mobile" class="link">
        here.
      </b-link>
    </b-alert>
    <b-alert
      id="verify-email"
      :show="showVerifyEmailAlert"
      class="fixed-bottom bottom-left-alert m-4 p-4"
      variant="bg-colored"
    >
      We need to verify your email address. Please click
      <b-link to="/register/verify" class="link">
        here.
      </b-link>
    </b-alert>
    <!--    <b-alert id="account-kyc" v-if="showKycAlert" :show="true" class="fixed-bottom m-4 p-4" variant="bg-colored">-->
    <!--      Your account is currently restricted to {{ allowedLimit | weavr_currency }}. You can lift this restriction-->
    <!--      <b-link to="/managed-accounts/kyc" class="link">-->
    <!--        here.-->
    <!--      </b-link>-->
    <!--    </b-alert>-->
    <div v-if="isLoading" id="loader">
      <div class="loader-spinner">
        <b-spinner />
      </div>
    </div>
    <!-- <app-footer /> -->
    <cookie-policy />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import * as ViewStore from '~/store/modules/View'
import { Schemas } from '~/api/Schemas'
import BaseMixin from '~/minixs/BaseMixin'
import CurrencyAmount = Schemas.CurrencyAmount

const View = namespace(ViewStore.name)

@Component({
  components: {
    AppFooter: () => import('~/components/Footer.vue'),
    AppHeader: () => import('~/components/Header.vue'),
    DashboardHeader: () => import('~/components/DashboardHeader.vue'),
    KybAlert: () => import('~/components/corporates/KYBAlert.vue'),
    KycAlert: () => import('~/components/consumers/KYCAlert.vue'),
    cookiePolicy: () => import('~/components/cookie.vue')
  }
})
export default class DefaultLayout extends mixins(BaseMixin) {
  get isLoading() {
    return this.stores.loader.isLoading
  }

  @View.Getter showKybAlert!: boolean

  @View.Getter showKycAlert!: boolean

  @View.Getter showVerifyMobileAlert!: boolean

  @View.Getter showVerifyEmailAlert!: boolean

  get accounts() {
    return this.stores.accounts.accounts
  }

  get consumer(): Consumer | null {
    return this.stores.consumers.consumer
  }

  get corporate() {
    return this.stores.corporates.corporate
  }

  get allowedLimit(): CurrencyAmount {
    const _out: CurrencyAmount = {
      amount: 10000,
      currency: 'EUR'
    }

    if (this.accounts) {
      if (this.accounts.account.length > 0) {
        if (this.accounts.account[0].currency === 'GBP') {
          _out.amount = 8000
          _out.currency = 'GBP'
        }
      }
    }

    return _out
  }
}
</script>
<style lang="scss" scoped>
.bottom-left-alert {
  max-width: 350px;
}

#account {
  &-limit,
  &-kyc {
    max-width: 350px;
  }
}
</style>
