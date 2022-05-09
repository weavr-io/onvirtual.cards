<template>
  <b-container>
    <b-row class="mb-2" align-v="center">
      <b-col>
        <b-row>
          <b-col>
            <h6 class="font-weight-lighter">
              <b-row align-v="center">
                <b-col cols="auto">
                  All Transactions
                </b-col>
                <b-col cols="auto">
                  <b-form-select
                    :options="months"
                    :value="filterDate"
                    class="w-auto d-inline-block"
                    @change="filterMonthChange"
                  />
                </b-col>
              </b-row>
            </h6>
          </b-col>
          <b-col lg="7" xs="14" class="d-flex justify-content-end">
            <div>
              <b-button
                variant="link"
                class="px-0 d-flex align-items-center font-weight-lighter text-decoration-none"
                @click="downloadStatement"
              >
                <download-icon class="mr-2" />
                download
              </b-button>
            </div>
          </b-col>
        </b-row>
        <b-row v-if="filteredStatement && filteredStatementLength > 0">
          <b-col>
            <b-row v-for="(statementEntries, date) in filteredStatement" :key="date">
              <b-col>
                <b-row class="mt-4">
                  <b-col class="text-muted">
                    {{ date | moment_statement }}
                  </b-col>
                </b-row>
                <b-row v-for="(statement, key) in statementEntries" :key="key">
                  <b-col>
                    <statement-item :transaction="statement" />
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row v-else-if="availableBalance === 0" class="py-5">
          <b-col class="text-center">
            <h5 class="font-weight-light">
              Your transactions will appear here.
            </h5>
            <b-button :to="'/managed-accounts/' + account.id + '/topup'" variant="link">
              Start by topping up your account.
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>
<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import RouterMixin from '~/mixins/RouterMixin'
import FiltersMixin from '~/mixins/FiltersMixin'

import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import AccountsMixin from '~/mixins/AccountsMixin'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'

const moment = require('moment')

const dot = require('dot-object')

@Component({
  components: {
    StatementItem: () => import('~/components/statement/item.vue'),
    DownloadIcon: () => import('~/assets/svg/download.svg?inline')
  }
})
export default class AccountStatement extends mixins(BaseMixin, RouterMixin, FiltersMixin, AccountsMixin) {
  @Prop() filters!: GetManagedAccountStatementRequest

  get filteredStatement() {
    return this.stores.accounts.filteredStatement
  }

  get availableBalance() {
    if (this.stores.accounts.account) {
      return this.stores.accounts.account.balances.availableBalance
    } else {
      return 0
    }
  }

  get filteredStatementLength(): number {
    if (this.filteredStatement) {
      return Object.keys(this.filteredStatement).length
    } else {
      return 0
    }
  }

  get filterDate() {
    return {
      start: this.filters.fromTimestamp,
      end: this.filters.toTimestamp
    }
  }

  get months() {
    return this.monthsFilter(this.account!.creationTimestamp)
  }

  filterMonthChange(val) {
    this.setFilters({
      fromTimestamp: val.start,
      toTimestamp: val.end
    })
  }

  downloadStatement() {
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

    const _req: GetManagedAccountStatementRequest = {
      limit: 100,
      offset: 0,
      showFundMovementsOnly: false,
      orderByTimestamp: OrderEnum.DESC,
      ..._filters
    }

    this.downloadAsCSV({
      id: this.$route.params.id,
      filters: _req
    })
  }
}
</script>
