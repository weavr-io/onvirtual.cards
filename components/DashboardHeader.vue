<template>
  <b-container>
    <b-row class="px-0 mb-5 border-bottom" align-v="end" align-h="between">
      <b-col>
        <b-nav class="dashboard-header">
          <b-nav-item to="/managed-cards" active-class="active">
            Cards
          </b-nav-item>
          <b-nav-item to="/managed-accounts" active-class="active">
            Account
          </b-nav-item>
        </b-nav>
      </b-col>
      <template v-if="isManagedAccounts">
        <b-col class="pb-2">
          <b-row v-if="account" align-h="end" align-v="end">
            <b-col cols="2" lg="1" class="text-right">
              <b-button :to="'/managed-accounts/' + account.id.id + '/topup'" variant="secondary" class="add-funds">
                +
              </b-button>
            </b-col>
            <b-col cols="auto">
              <div class="account-balance">
                <p class="mb-0 text-muted font-size-small account-balance-label">
                  balance
                </p>
                <p class="mb-0 account-balance-value">
                  {{ account.balances.availableBalance | weavr_currency(account.currency) }}
                </p>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </template>
      <b-col v-if="isManagedCards">
        <b-col class="pb-2">
          <b-row align-h="end" align-v="end">
            <div v-if="cardCurrency" class="account-balance">
              <p class="mb-0 text-muted account-balance-label">
                total balance
              </p>
              <p class="mb-0 account-balance-value">
                {{ cardsBalance | weavr_currency(cardCurrency) }}
              </p>
            </div>
          </b-row>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'

import * as AccountsStore from '~/store/modules/Accounts'
import * as CardsStore from '~/store/modules/Cards'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

const Accounts = namespace(AccountsStore.name)
const Cards = namespace(CardsStore.name)

@Component
export default class DashboardHeader extends Vue {
  @Accounts.Getter account: ManagedAccountsSchemas.ManagedAccount | null | undefined

  @Accounts.Getter('totalAvailableBalance') accountsBalance

  @Cards.Getter('totalAvailableBalance') cardsBalance

  @Cards.Getter('currency') cardCurrency

  get isManagedCards(): boolean {
    if (this.$route.matched[0].name) {
      return ['managed-cards', 'managed-cards-id-statement'].indexOf(this.$route.matched[0].name) !== -1
    } else {
      return false
    }
  }

  get isManagedAccounts(): boolean {
    if (this.$route.matched[0].name) {
      return ['managed-accounts', 'managed-accounts-id'].indexOf(this.$route.matched[0].name) !== -1
    } else {
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.account-balance {
  .account-balance-label {
    font-size: 0.8rem;
  }

  .account-balance-value {
    font-size: 1.5rem;
  }
}

.add-funds {
  border-radius: 100%;
  padding: 13px 10px 18px;
  line-height: 0;
  font-size: 20px;
}

.account {
  &-name {
    font-size: 1.2rem;
  }

  &-expiry {
    &-label {
      font-size: 0.8rem;
    }
  }
}

.account-view-details {
  background: #F0EDDE;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  display: block;
  font-size: 0.6rem;
}
</style>
