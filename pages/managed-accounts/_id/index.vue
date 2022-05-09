<template>
  <div>
    <section v-if="!hasAlert && !$fetchState.pending">
      <statement :filters="filters" />
      <infinite-loading spinner="spiral" @infinite="infiniteScroll">
        <span slot="no-more" />
        <div slot="no-results" />
      </infinite-loading>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'

import BaseMixin from '~/mixins/BaseMixin'
import RouterMixin from '~/mixins/RouterMixin'
import AccountsMixin from '~/mixins/AccountsMixin'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import { accountsStore } from '~/utils/store-accessor'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'
import KyVerified from '~/mixins/kyVerified'

const dot = require('dot-object')
const moment = require('moment')

@Component({
  watch: {
    '$route.query': '$fetch'
  },
  layout: 'dashboard',
  components: {
    Statement: () => import('~/components/accounts/statement/statement.vue')
  },
  middleware: 'kyVerified'
})
export default class AccountPage extends mixins(BaseMixin, RouterMixin, AccountsMixin, KyVerified) {
  filters: GetManagedAccountStatementRequest | null = null

  page: number = 0

  get filteredStatement() {
    return this.stores.accounts.filteredStatement
  }

  asyncData({ store }) {
    accountsStore(store).SET_STATEMENTS(null)
  }

  async fetch() {
    const _accountId = this.$route.params.id

    await this.stores.accounts.get(_accountId)

    const _routeQueries = dot.object(this.$route.query)
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

    const _statementFilters: GetManagedAccountStatementRequest = {
      showFundMovementsOnly: false,
      orderByTimestamp: OrderEnum.DESC,
      limit: 10,
      offset: 0,
      ..._filters
    }

    const _req = {
      id: _accountId,
      filters: _statementFilters
    }

    this.filters = { ..._statementFilters }

    this.page = 0
    await this.stores.accounts.getStatements(_req)
  }

  infiniteScroll($state) {
    setTimeout(() => {
      this.page++

      const _request: GetManagedAccountStatementRequest = { ...this.filters }

      _request!.offset = (this.page * +_request!.limit!).toString()

      this.stores.accounts
        .getStatements({
          id: this.$route.params.id,
          filters: _request
        })
        .then((res) => {
          if (res.data.responseCount! < _request.limit!) {
            $state.complete()
          } else {
            $state.loaded()
          }
        })
    }, 500)
  }
}
</script>
