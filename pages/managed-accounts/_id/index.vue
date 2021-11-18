<template>
  <div>
    <section v-if="!hasAlert && !$fetchState.pending">
      <statement :filters="filters" />
      test
      <pre>
        {{ filters }}
      </pre>
    </section>
    <!--    <infinite-loading spinner="spiral" @infinite="infiniteScroll">-->
    <!--      <span slot="no-more" />-->
    <!--      <div slot="no-results" />-->
    <!--    </infinite-loading>-->
  </div>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'

import { OrderType } from '~/api/Enums/OrderType'
import BaseMixin from '~/minixs/BaseMixin'
import RouterMixin from '~/minixs/RouterMixin'
import AccountsMixin from '~/minixs/AccountsMixin'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'

const dot = require('dot-object')
const moment = require('moment')

@Component({
  watchQuery: true,
  layout: 'dashboard',
  components: {
    Statement: () => import('~/components/accounts/statement/statement.vue')
  }
})
export default class AccountPage extends mixins(BaseMixin, RouterMixin, AccountsMixin) {
  filters: GetManagedAccountStatementRequest | null = null

  page: number = 0

  get filteredStatement() {
    return this.stores.accounts.filteredStatement
  }

  get hasAlert() {
    return this.stores.view.hasAlert
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
      orderByTimestamp: OrderType.DESC,
      paging: {
        limit: 100,
        offset: 0
      },
      ..._filters
    }

    const _req = {
      id: _accountId,
      filters: _statementFilters
    }

    this.filters = { ..._filters }

    await this.stores.accounts.getStatements(_req)
  }

  infiniteScroll($state) {
    setTimeout(() => {
      this.page++

      const _request: GetManagedAccountStatementRequest = { ...this.filters }
      _request!.offset = (this.page * +_request!.limit!).toString()

      this.stores.accounts
        .getCardStatementPage({
          id: this.$route.params.id,
          filters: _request
        })
        .then((res) => {
          if (res.data.responseCount! < _request.limit!) {
            $state.complete()
            console.log('complete')
          } else {
            console.log('loaded')
            $state.loaded()
          }
        })
    }, 500)
  }
}
</script>
