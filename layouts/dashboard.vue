<template>
  <div>
    <app-header />
    <dashboard-header />
    <div v-if="!showKybAlert && !showKycAlert && !showVerifyMobileAlert">
      <Nuxt />
    </div>
    <kyb-alert />
    <kyc-alert />
    <b-alert id="account-limit" :show="showVerifyMobileAlert" class="fixed-bottom m-4 p-4" variant="bg-colored">
      We need to verify your mobile number. Please click
      <b-link :to="restrictionLink" class="link">
        here.
      </b-link>
    </b-alert>
    <b-alert id="account-kyc" :show="showKycAlert" v-if="showKycAlert" class="fixed-bottom m-4 p-4" variant="bg-colored">
      Your account is currently restricted to {{ consumer.kyc.allowedLimit | weavr_currency }}. You can lift this
      restriction
      <b-link to="/managed-accounts/kyc" class="link">
        here.
      </b-link>
    </b-alert>
    <div id="loader" v-if="isLoading">
      <div class="loader-spinner">
        <b-spinner />
      </div>
    </div>
    <!-- <app-footer /> -->
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { BaseVue } from '~/base/classes/BaseVue'

import * as LoaderStore from '~/store/modules/Loader'
import { KYBState } from '~/api/Enums/KYBState'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import * as ConsumersStore from '~/store/modules/Consumers'
import * as CorporatesStore from '~/store/modules/Corporates'

const Loader = namespace(LoaderStore.name)
const Consumers = namespace(ConsumersStore.name)
const Corporates = namespace(CorporatesStore.name)

@Component({
  components: {
    AppFooter: () => import('~/components/Footer.vue'),
    AppHeader: () => import('~/components/Header.vue'),
    DashboardHeader: () => import('~/components/DashboardHeader.vue'),
    KybAlert: () => import('~/components/corporates/KYBAlert.vue'),
    KycAlert: () => import('~/components/consumers/KYCAlert.vue')
  }
})
export default class DefaultLayout extends BaseVue {
  @Loader.Getter isLoading

  @Consumers.Getter consumer!: Consumer | null

  @Corporates.Getter corporate!: CorporatesSchemas.Corporate | null

  get showKybAlert(): boolean {
    if (this.corporate && this.corporate.kyb) {
      return this.corporate.kyb.fullCompanyChecksVerified !== KYBState.APPROVED
    } else {
      return false
    }
  }

  get showKycAlert(): boolean {
    if (this.showVerifyMobileAlert) {
      return false
    } else if (this.consumer && this.consumer.kyc) {
      return this.consumer.kyc.fullDueDiligence
        ? this.consumer.kyc.fullDueDiligence !== FullDueDiligence.APPROVED
        : true
    } else {
      return false
    }
  }

  get showVerifyMobileAlert(): boolean {
    if (this.consumer && this.consumer.kyc) {
      return this.consumer.kyc.mobileVerified ? !this.consumer.kyc.mobileVerified : true
    } else {
      return false
    }
  }

  get restrictionLink() {
    if (this.consumer && this.consumer.kyc && this.consumer.kyc.mobileVerified === true) {
      return '/managed-accounts/' + this.$route.params.id + '/topup'
    } else {
      return '/verify/consumers/mobile'
    }
  }
}
</script>
<style lang="scss" scoped>
#account {
  &-limit,
  &-kyc {
    max-width: 350px;
  }
}
</style>
