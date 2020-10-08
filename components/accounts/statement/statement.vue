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
                          @change="filterMonthChange"
                          class="w-auto d-inline-block"
                  />
                </b-col>
              </b-row>
            </h6>
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
            <b-button :to="'/managed-accounts/' + account.id.id + '/topup'" variant="link">
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
import BaseMixin from '~/minixs/BaseMixin'
import RouterMixin from '~/minixs/RouterMixin'
import { ManagedAccountStatementRequest } from '~/api/Requests/ManagedAccountStatementRequest'
import FiltersMixin from '~/minixs/FiltersMixin'

const moment = require('moment')

@Component({
  components: {
    StatementItem: () => import('~/components/statement/item.vue')
  }
})
export default class AccountStatement extends mixins(BaseMixin, RouterMixin, FiltersMixin) {
  get filteredStatement() {
    return this.stores.accounts.filteredStatement
  }

  get account() {
    return this.stores.accounts.account
  }

  get availableBalance() {
    if (this.stores.accounts.account) {
      return this.stores.accounts.account.balances.availableBalance
    } else {
      return 0
    }
  }

  @Prop() filters!: ManagedAccountStatementRequest

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

  filterMonthChange(val) {
    this.setFilters({ fromTimestamp: val.start, toTimestamp: val.end })
    console.log(val)
  }

  get months() {
    return this.monthsFilter(parseInt(this.account!.creationTimestamp))
  }
}
</script>
