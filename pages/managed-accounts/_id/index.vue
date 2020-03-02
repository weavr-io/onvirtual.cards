<template>
  <div>
    <section>
      <statement />
    </section>
    <b-alert
            id="account-limit"
            :show="consumer.kyc.allowedLimit.amount == 0"
            class="fixed-bottom m-4 p-4"
            variant="bg-colored"
    >
      Your account is currently restricted to {{ consumer.kyc.allowedLimit | weavr_currency }}. You can lift this
      restriction
      <b-link :to="restrictionLink" class="link">here</b-link>
      .
    </b-alert>
  </div>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

import * as AccountsStore from '~/store/modules/Accounts'
import { OrderType } from '~/api/Enums/OrderType'
import { _Requests } from '~/store/modules/Contracts/Accounts'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import { Consumer } from '~/api/Models/Consumers/Consumer'

const Accounts = namespace(AccountsStore.name)
const Consumers = namespace(ConsumersStore.name)

@Component({
  layout: 'dashboard',
  components: {
    Statement: () => import('~/components/accounts/statement/statement.vue')
  }
})
export default class AccountPage extends VueWithRouter {
  @Accounts.Getter account!: ManagedAccountsSchemas.ManagedAccount | null

  @Accounts.Getter filteredStatement: ManagedAccountsSchemas.ManagedAccountStatementEntry[] | undefined

  @Consumers.Getter consumer!: Consumer | null

  accountId!: number

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

    if (AuthStore.Helpers.isConsumer(store)) {
      const _consumerId = AuthStore.Helpers.identityId(store)
      if (_consumerId) {
        await ConsumersStore.Helpers.get(store, _consumerId)
      }
    }

    return { accountId: _accountId }
  }

  get restrictionLink() {
    if (this.consumer && this.consumer.kyc && this.consumer.kyc.mobileVerified === true) {
      return '/managed-accounts/' + this.accountId + '/topup'
    } else {
      return '/verify/consumers/mobile'
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
  background: #c3b5ff;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  display: block;
  font-size: 0.6rem;
}

#account-limit {
  max-width: 350px;
}
</style>
