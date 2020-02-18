<template>
  <section>
    <statement />
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
  layout: 'dashboard',
  components: {
    Statement: () => import('~/components/accounts/statement/statement.vue')
  }
})
export default class AccountPage extends VueWithRouter {
  @Accounts.Getter account: ManagedAccountsSchemas.ManagedAccount | null | undefined

  @Accounts.Getter filteredStatement: ManagedAccountsSchemas.ManagedAccountStatementEntry[] | undefined

  async asyncData({ store, route }) {
    const _accountId = route.params.id

    await AccountsStore.Helpers.get(store, _accountId)

    const _req: _Requests.ManagedAccountStatementFullRequest = {
      id: _accountId,
      body: {
        showFundMovementsOnly: true,
        orderByTimestamp: OrderType.DESC
      }
    }

    await AccountsStore.Helpers.getStatement(store, _req)

    return { accountId: _accountId }
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
