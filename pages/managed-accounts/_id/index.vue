<template>
  <div>
    <section v-if="!hasAlert">
      <statement :filters="filters" />
    </section>
    <infinite-loading @infinite="infiniteScroll" spinner="spiral" >
      <span slot="no-more"></span>
      <div slot="no-results"></div>
    </infinite-loading>
  </div>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'

import { OrderType } from '~/api/Enums/OrderType'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import * as CorporatesStore from '~/store/modules/Corporates'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import * as ViewStore from '~/store/modules/View'
import { Corporate } from '~/api/Models/Corporates/Corporate'
import BaseMixin from '~/minixs/BaseMixin'
import { ManagedAccountStatementRequest } from '~/api/Requests/ManagedAccountStatementRequest'
import RouterMixin from '~/minixs/RouterMixin'
import { accountsStore } from '~/utils/store-accessor'

const Consumers = namespace(ConsumersStore.name)
const Corporates = namespace(CorporatesStore.name)
const View = namespace(ViewStore.name)
const dot = require('dot-object')
const moment = require('moment')

@Component({
  layout: 'dashboard',
  components: {
    Statement: () => import('~/components/accounts/statement/statement.vue')
  }
})
export default class AccountPage extends mixins(BaseMixin, RouterMixin) {
  get account() {
    return this.stores.accounts.account
  }

  get filteredStatement() {
    return this.stores.accounts.filteredStatement
  }

  @Consumers.Getter consumer!: Consumer | null

  @Corporates.Getter corporate!: Corporate | null

  @View.Getter hasAlert!: boolean

  accountId!: number

  filters!: ManagedAccountStatementRequest

  page: number = 0

  async asyncData({ store, route }) {
    const _accountId = route.params.id

    await accountsStore(store).get(_accountId)

    const _routeQueries = dot.object(route.query)
    const _filters = _routeQueries.filters ? _routeQueries.filters : {}

    if (!_filters.fromTimestamp) {
      _filters.fromTimestamp = moment()
        .startOf('month')
        .valueOf()
    }

    if (!_filters.toTimestamp) {
      _filters.toTimestamp = moment()
        .endOf('month')
        .valueOf()
    }

    const _statementFilters: ManagedAccountStatementRequest = {
      showFundMovementsOnly: true,
      orderByTimestamp: OrderType.DESC,
      paging: {
        limit: 10,
        offset: 0
      },
      ..._filters
    }

    const _req = {
      id: _accountId,
      body: _statementFilters
    }

    await accountsStore(store).getStatement(_req)

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

    return { accountId: _accountId, filters: _statementFilters }
  }

  infiniteScroll($state) {
    setTimeout(() => {
      this.page++

      const _request: ManagedAccountStatementRequest = { ...this.filters }
      _request.paging!.offset = this.page * _request.paging!.limit!

      this.stores.accounts.getCardStatementPage({ id: this.$route.params.id, body: _request }).then((response) => {
        if (response.data.responseCount > 0) {
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    }, 500)
  }
}
</script>
