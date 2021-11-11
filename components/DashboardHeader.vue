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
            <b-col v-if="canAddFunds" cols="2" lg="1" class="text-right">
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
import { Component, mixins } from 'nuxt-property-decorator'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
import { KYBState } from '~/api/Enums/KYBState'
import BaseMixin from '~/minixs/BaseMixin'

@Component
export default class DashboardHeader extends mixins(BaseMixin) {
  get account() {
    return this.stores.accounts.account
  }

  get accountsBalance() {
    return this.stores.accounts.totalAvailableBalance
  }

  get cardCurrency() {
    return this.stores.cards.currency
  }

  get cardsBalance() {
    return this.stores.cards.totalAvailableBalance
  }

  get isManagedCards(): boolean {
    if (this.$route.matched[0].name) {
      return ['managed-cards', 'managed-cards-id-statement'].includes(this.$route.matched[0].name)
    } else {
      return false
    }
  }

  get isManagedAccounts(): boolean {
    if (this.$route.matched[0].name) {
      return ['managed-accounts', 'managed-accounts-id'].includes(this.$route.matched[0].name)
    } else {
      return false
    }
  }

  get canAddFunds(): boolean {
    if (this.isConsumer) {
      return this.stores.consumers.kyc?.fullDueDiligence === FullDueDiligence.APPROVED
    } else if (this.isCorporate) {
      return this.stores.corporates.kyb?.fullCompanyChecksVerified === KYBState.APPROVED
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
  background: #f0edde;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  display: block;
  font-size: 0.6rem;
}
</style>
