<template>
  <section>
    <b-container>
      <b-row v-if="account" align-v="end" class="mb-5 border-bottom pb-3">
        <b-col>
          <b-row>
            <b-col>
              <p class="account-name m-0">
                {{ account.friendlyName }}
              </p>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="2" lg="1" class="text-right">
          <b-button
            variant="primary"
            class="add-funds"
            :to="'/managed-accounts/' + accountId + '/topup'"
          >
            +
          </b-button>
        </b-col>
        <b-col cols="2" lg="2">
          <div class="account-balance">
            <div class="account-balance-label text-muted">
              balance
            </div>
            <div class="account-balance-value">
              {{
                account.balances.availableBalance
                  | weavr_currency(account.currency)
              }}
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="filteredStatement.length > 0" class="mb-2" align-v="center">
        <b-col>
          <h6 class="font-weight-lighter">
            All Transactions
          </h6>
        </b-col>
      </b-row>
      <b-row v-if="filteredStatement.length > 0">
        <b-col>
          <b-row v-for="(item, key) in filteredStatement.reverse()" :key="key">
            <b-col>
              <statement-item :transaction="item" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row v-if="filteredStatement.length === 0" class="py-5">
        <b-col class="text-center">
          <p>Your transactions will appear here.</p>
          <b-button
            variant="border-primary"
            :to="'/managed-accounts/' + accountId + '/topup'"
          >
            Start by topping up your account.
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

import * as AccountsStore from '~/store/modules/Accounts'
import { OrderType } from '~/api/Enums/OrderType'
import { _Requests } from '~/store/modules/Contracts/Accounts'
const Accounts = namespace(AccountsStore.name)

@Component({
  components: {
    StatementItem: () => import('~/components/accounts/statement/item.vue')
  }
})
export default class AccountPage extends VueWithRouter {
  @Accounts.Getter account:
    | ManagedAccountsSchemas.ManagedAccount
    | null
    | undefined

  @Accounts.Getter filteredStatement:
    | ManagedAccountsSchemas.ManagedAccountStatementEntry[]
    | undefined

  async asyncData({ store, route }) {
    const accountId = route.params.id

    await store.dispatch('accounts/get', accountId)

    const _req: _Requests.ManagedAccountStatementFullRequest = {
      id: accountId,
      body: {
        showFundMovementsOnly: true,
        orderByTimestamp: OrderType.ASC
      }
    }

    await store.dispatch('accounts/getStatement', _req)

    return { accountId: accountId }
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
  background: #c3b5ff;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  display: block;
  font-size: 0.6rem;
}
</style>
