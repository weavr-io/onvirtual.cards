<template>
    <div>
        <section>
            <statement v-if="!hasAlert && !pendingDataOrError" :filters="filters" />
            <infinite-loading v-else spinner="spiral" @infinite="infiniteScroll">
                <span slot="no-more" />
                <div slot="no-results" />
            </infinite-loading>
        </section>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, useFetch, useRoute, watch } from '@nuxtjs/composition-api'
import dot from 'dot-object'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import { useLuxon } from '~/composables/useLuxon'
import { useStores } from '~/composables/useStores'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common'
import { useBase } from '~/composables/useBase'
import { useKyVerified } from '~/composables/useKyVerified'
import { useAccountsStore } from '~/store/accounts'
import Statement from '~/components/organisms/accounts/statement/AccountStatement.vue'

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
        const { getStartOfMonth, getEndOfMonth } = useLuxon()

        const filters = ref<GetManagedAccountStatementRequest>({})
        const page = ref(0)
        const usingFetch = ref(true)

        const filteredStatement = computed(() => {
            return accounts?.filteredStatement
        })

        const getStatements = async () => {
            const _accountId = route.value.params.id

            await accounts?.get(_accountId)

            const _routeQueries = dot.object(route.value.query)
            const _filters = _routeQueries.filters ? _routeQueries.filters : {}

            if (!_filters.fromTimestamp) {
                _filters.fromTimestamp = getStartOfMonth.value
            }

            if (!_filters.toTimestamp) {
                _filters.toTimestamp = getEndOfMonth.value
            }

            const _statementFilters: GetManagedAccountStatementRequest = {
                showFundMovementsOnly: true,
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
        }

        useFetch(async () => {
            accounts?.setStatements(null)
            await getStatements().finally(() => (usingFetch.value = false))
        })

        watch(
            route,
            async () => {
                if (!usingFetch.value) await getStatements()
            },
            { immediate: true },
        )

        const infiniteScroll = ($state) => {
            setTimeout(() => {
                const accountStore = useAccountsStore()
                if (accountStore.accountState.statements?.count === '10') page.value++

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
