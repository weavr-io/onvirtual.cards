<template>
  <b-container>
    <b-row class="px-0 mb-4 border-bottom dashboard-header-height" align-v="end" align-h="between">
      <b-col cols="7">
        <b-nav class="dashboard-header">
          <b-nav-item to="/managed-cards" active-class="active"> Cards</b-nav-item>
          <b-nav-item to="/managed-accounts" active-class="active"> Account</b-nav-item>
        </b-nav>
      </b-col>
      <b-col v-if="isManagedAccounts" class="pb-2">
        <b-row v-if="account" align-h="end" align-v="end">
          <b-col v-if="canAddFunds" cols="2" lg="1" class="text-right mr-3 mr-sm-2">
            <b-button :to="'/managed-accounts/' + account.id + '/topup'" variant="secondary" class="add-funds">
              +
            </b-button>
          </b-col>
          <b-col cols="auto">
            <div class="account-balance">
              <p class="mb-0 text-muted font-size-small account-balance-label">balance</p>
              <p class="mb-0 account-balance-value">
                {{ account.balances.availableBalance | weavr_currency(account.currency) }}
              </p>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col v-if="isManagedCards">
        <b-col class="pb-2">
          <b-row align-h="end" align-v="end">
            <div v-if="hasCards" class="account-balance">
              <p class="mb-0 text-muted account-balance-label">total balance</p>
              <p class="mb-0 account-balance-value">
                {{ cardsBalance | weavr_currency(cardCurrency.currency) }}
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
import BaseMixin from '~/mixins/BaseMixin'
import CardsMixin from '~/mixins/CardsMixin'
import AccountsMixin from '~/mixins/AccountsMixin'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'

@Component
export default class DashboardHeader extends mixins(BaseMixin, CardsMixin, AccountsMixin) {
  get canAddFunds(): boolean {
    if (this.isConsumer) {
      return this.stores.consumers.kyc?.fullDueDiligence === KYCStatusEnum.APPROVED
    } else if (this.isCorporate) {
      return this.stores.corporates.kyb?.kybStatus === KYBStatusEnum.APPROVED
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
