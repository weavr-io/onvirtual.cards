<template>
    <div>
        <section v-if="!kyVerified.unRefs.hasAlert && !base.unRefs.pendingDataOrError">
            <statement :filters="filters" />
            <infinite-loading spinner="spiral" @infinite="infiniteScroll">
                <span slot="no-more" />
                <div slot="no-results" />
            </infinite-loading>
        </section>
    </div>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'
import { accountsStore } from '~/utils/store-accessor'
import { useBase } from '~/composables/useBase'
import { useKyVerified } from '~/composables/useKyVerified'

const dot = require('dot-object')
const moment = require('moment')

@Component({
    watch: {
        '$route.query': '$fetch',
    },
    layout: 'dashboard',
    components: {
        Statement: () => import('~/components/accounts/statement/statement.vue'),
    },
    middleware: 'kyVerified',
})
export default class AccountPage extends Vue {
    base = useBase(this)
    kyVerified = useKyVerified(this)

    filters: GetManagedAccountStatementRequest | null = null

    page: number = 0

    get filteredStatement() {
        return this.base.stores.accounts.filteredStatement
    }

    asyncData({ store }) {
        accountsStore(store).SET_STATEMENTS(null)
    }

    async fetch() {
        const _accountId = this.$route.params.id

        await this.base.stores.accounts.get(_accountId)

        const _routeQueries = dot.object(this.$route.query)
        const _filters = _routeQueries.filters ? _routeQueries.filters : {}

        if (!_filters.fromTimestamp) {
            _filters.fromTimestamp = moment().startOf('month').valueOf()
        }

        if (!_filters.toTimestamp) {
            _filters.toTimestamp = moment().endOf('month').valueOf()
        }

        const _statementFilters: GetManagedAccountStatementRequest = {
            showFundMovementsOnly: false,
            orderByTimestamp: OrderEnum.DESC,
            limit: 10,
            offset: 0,
            ..._filters,
        }

        const _req = {
            id: _accountId,
            filters: _statementFilters,
        }

        this.filters = { ..._statementFilters }

        this.page = 0
        await this.base.stores.accounts.getStatements(_req)
    }

    infiniteScroll($state) {
        setTimeout(() => {
            this.page++

            const _request: GetManagedAccountStatementRequest = { ...this.filters }

            _request!.offset = (this.page * +_request!.limit!).toString()

            this.base.stores.accounts
                .getStatements({
                    id: this.$route.params.id,
                    filters: _request,
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
