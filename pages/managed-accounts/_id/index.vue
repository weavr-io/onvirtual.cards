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
import {
    computed,
    defineComponent,
    Ref,
    ref,
    useAsync,
    useFetch,
    useRoute,
} from '@nuxtjs/composition-api'
import dot from 'dot-object'
import { DateTime } from 'luxon'
import Statement from '~/components/accounts/statement/statement.vue'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import { useStores } from '~/composables/useStores'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common'
import { useBase } from '~/composables/useBase'
import { useKyVerified } from '~/composables/useKyVerified'

export default defineComponent({
    components: {
        Statement,
    },
    layout: 'dashboard',
    middleware: 'kyVerified',
    setup() {
        const route = useRoute()
        const { accounts } = useStores(['accounts'])
        const { pendingDataOrError } = useBase()
        const { hasAlert } = useKyVerified()

        const filters: Ref<GetManagedAccountStatementRequest | null> = ref(null)
        const page = ref(0)

        const filteredStatement = computed(() => {
            return accounts?.filteredStatement
        })

        useAsync(() => {
            accounts?.setStatements(null)
        })

        useFetch(async () => {
            const _accountId = route.value.params.id

            await accounts?.get(_accountId)

            const _routeQueries = dot.object(route.value.query)
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

            filters.value = { ..._statementFilters }

            page.value = 0
            await accounts?.getStatements(_req)
        })

        const infiniteScroll = ($state) => {
            setTimeout(() => {
                page.value++

                const _request: GetManagedAccountStatementRequest = { ...filters.value }

                _request!.offset = (page.value * +_request!.limit!).toString()

                accounts
                    ?.getStatements({
                        id: route.value.params.id,
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

        return { filters, infiniteScroll, pendingDataOrError, hasAlert, filteredStatement }
    },
})
</script>
