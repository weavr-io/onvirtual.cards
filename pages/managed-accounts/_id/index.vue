<template>
  <section v-if="!hasAlert">
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
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import * as CorporatesStore from '~/store/modules/Corporates'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import * as ViewStore from '~/store/modules/View'
import { Corporate } from '~/api/Models/Corporates/Corporate'
import { StatementEntry } from '~/api/Models/Statements/StatementEntry'

const Accounts = namespace(AccountsStore.name)
const Consumers = namespace(ConsumersStore.name)
const Corporates = namespace(CorporatesStore.name)
const View = namespace(ViewStore.name)

@Component({
  layout: 'dashboard',
  components: {
    Statement: () => import('~/components/accounts/statement/statement.vue')
  }
})
export default class AccountPage extends VueWithRouter {
  @Accounts.Getter account!: ManagedAccountsSchemas.ManagedAccount | null

  @Accounts.Getter filteredStatement: StatementEntry[] | undefined

  @Consumers.Getter consumer!: Consumer | null

  @Corporates.Getter corporate!: Corporate | null

  @View.Getter hasAlert!: boolean

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
    } else {
      const _corporateId = AuthStore.Helpers.identityId(store)
      if (_corporateId) {
        await CorporatesStore.Helpers.getCorporateDetails(store, _corporateId)
      }
    }

    return { accountId: _accountId }
  }
}
</script>
