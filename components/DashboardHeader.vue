<template>
  <b-container>
    <b-row class="px-0 mb-5 border-bottom">
      <b-col>
        <b-nav class="dashboard-header">
          <b-nav-item to="/managed-accounts" active-class="active">Accounts</b-nav-item>
          <b-nav-item to="/managed-cards" active-class="active">Cards</b-nav-item>
        </b-nav>
      </b-col>
      <b-col class="text-right">
        <div class="total-balance">
          <p class="mb-0 text-muted font-size-small">total balance</p>
          <p class="mb-0">{{totalBalance | weavr_currency('EUR')}}</p>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'

import * as AccountsStore from '~/store/modules/Accounts'
import * as CardsStore from '~/store/modules/Cards'

const Accounts = namespace(AccountsStore.name)
const Cards = namespace(CardsStore.name)

@Component
export default class DashboardHeader extends Vue {
  @Accounts.Getter('totalAvailableBalance') accountsBalance
  @Cards.Getter('totalAvailableBalance') cardsBalance

  get totalBalance(): number {
    if (this.$route.fullPath === '/managed-cards') {
      return this.cardsBalance
    } else if (this.$route.fullPath === '/managed-accounts') {
      return this.accountsBalance
    } else {
      return 0
    }
  }
}
</script>


