<template>
    <b-container>
        <b-row align-v="center" class="mb-2">
            <b-col>
                <b-row>
                    <b-col cols="10" sm="8">
                        <h6 class="font-weight-lighter">
                            <b-row align-v="center">
                                <b-col class="pr-0" cols="auto"> All Transactions</b-col>
                                <b-col class="pl-2" cols="auto">
                                    <b-form-select
                                        :options="months"
                                        :value="filterDate"
                                        class="w-auto d-inline-block"
                                        size="sm"
                                        @change="filterMonthChange"
                                    />
                                </b-col>
                            </b-row>
                        </h6>
                    </b-col>
                    <b-col class="d-flex justify-content-end" cols="2" sm="4">
                        <div class="d-flex align-items-center">
                            <b-button
                                class="p-0 d-flex align-items-center font-weight-lighter text-decoration-none no-focus"
                                variant="link"
                                @click="downloadStatement"
                            >
                                <download-icon class="mr-2" />
                                <p class="d-none d-sm-inline mb-0">download</p>
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
                                        {{ formatDate(date) }}
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
                        <h5 class="font-weight-light">Your transactions will appear here.</h5>
                        <b-button :to="`/managed-accounts/${account.id}/topup`" variant="link">
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
import dot from 'dot-object'
import { DateTime } from 'luxon'
import BaseMixin from '~/mixins/BaseMixin'
import RouterMixin from '~/mixins/RouterMixin'
import FiltersMixin from '~/mixins/FiltersMixin'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import AccountsMixin from '~/mixins/AccountsMixin'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'

@Component({
    components: {
        StatementItem: () => import('~/components/statement/item.vue'),
        DownloadIcon: () => import('~/assets/svg/download.svg?inline'),
    },
})
export default class AccountStatement extends mixins(
    BaseMixin,
    RouterMixin,
    FiltersMixin,
    AccountsMixin,
) {
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
            end: this.filters.toTimestamp,
        }
    }

    get months() {
        return this.monthsFilter(this.account!.creationTimestamp)
    }

    // TODO: Resolve to useBase Composable
    // Move all luxon function calls to utils for reusability
    formatDate(val) {
        const dateTime = DateTime.fromJSDate(val)
        if (dateTime.hasSame(DateTime.now(), 'year')) {
            return dateTime.toFormat('d MMMM')
        }
        return dateTime.toFormat('d MMMM yyyy')
    }

    filterMonthChange(val) {
        this.setFilters({
            fromTimestamp: val.start,
            toTimestamp: val.end,
        })
    }

    downloadStatement() {
        const _routeQueries = dot.object(this.$route.query)
        const _filters = _routeQueries.filters ? _routeQueries.filters : {}

        if (!_filters.fromTimestamp) {
            _filters.fromTimestamp = DateTime.now().startOf('month').toMillis()
        }

        if (!_filters.toTimestamp) {
            _filters.toTimestamp = DateTime.now().endOf('month').toMillis()
        }

        const _req: GetManagedAccountStatementRequest = {
            limit: 100,
            offset: 0,
            showFundMovementsOnly: false,
            orderByTimestamp: OrderEnum.DESC,
            ..._filters,
        }

        this.downloadAsCSV({
            id: this.$route.params.id,
            filters: _req,
        })
    }
}
</script>
