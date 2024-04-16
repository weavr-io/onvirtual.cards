<template>
    <div>
        <section v-if="!hasAlert && !pendingDataOrError">
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

import dot from 'dot-object'
import { DateTime } from 'luxon'
import AccountsMixin from '~/mixins/AccountsMixin'
import BaseMixin from '~/mixins/BaseMixin'
import RouterMixin from '~/mixins/RouterMixin'
import KyVerified from '~/mixins/kyVerified'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import { initialiseStores } from '~/utils/pinia-store-accessor'

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
export default class AccountPage extends mixins(BaseMixin, RouterMixin, AccountsMixin, KyVerified) {
    filters: GetManagedAccountStatementRequest | null = null

    page = 0

    get filteredStatement() {
        return this.accountsStore.filteredStatement
    }

    asyncData() {
        const { accounts } = initialiseStores(['accounts'])
        accounts?.setStatements(null)
    }

    async fetch() {
        const _accountId = this.$route.params.id

        await this.accountsStore.get(_accountId)

        const _routeQueries = dot.object(this.$route.query)
        const _filters = _routeQueries.filters ? _routeQueries.filters : {}

        if (!_filters.fromTimestamp) {
            _filters.fromTimestamp = DateTime.now().startOf('month').toMillis()
        }

        if (!_filters.toTimestamp) {
            _filters.toTimestamp = DateTime.now().endOf('month').toMillis()
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
        await this.accountsStore.getStatements(_req)
    }

    infiniteScroll($state) {
        setTimeout(() => {
            this.page++

            const _request: GetManagedAccountStatementRequest = { ...this.filters }

            _request!.offset = (this.page * +_request!.limit!).toString()

            this.accountsStore
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
