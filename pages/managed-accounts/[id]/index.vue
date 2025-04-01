<template>
    <div>
        <section v-if="!hasAlert && !pendingDataOrError">
            <statement :filters="filters" />
            <infinite-loading class="statement-loader" spinner="spiral" @infinite="infiniteScroll">
                <template #complete><div /></template>
            </infinite-loading>
        </section>
    </div>
</template>

<script lang="ts" setup>
import dot from 'dot-object'
import type { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import { useLuxon } from '~/composables/useLuxon'
import { useStores } from '~/composables/useStores'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common'
import { useKyVerified } from '~/composables/useKyVerified'
import { useGlobalAsyncData } from '~/composables/useGlobalAsyncData'
import Statement from '~/components/organisms/accounts/statement/AccountStatement.vue'

definePageMeta({
    layout: 'dashboard',
    middleware: 'ky-verified',
})
const route = useRoute()
const { accounts } = useStores(['accounts'])
const { hasAlert } = useKyVerified()
const { getStartOfMonth, getEndOfMonth } = useLuxon()
accounts?.setStatements(null)
const filters: Ref<GetManagedAccountStatementRequest | undefined> = ref(undefined)
const page = ref(0)
const usingFetch = ref(true)

const getStatements = async () => {
    const _accountId = route.params.id as string

    await accounts?.get(_accountId)

    const _routeQueries = dot.object(route.query)
    const _filters = _routeQueries.filters ? _routeQueries.filters : {}

    if (!_filters.fromTimestamp) {
        _filters.fromTimestamp = getStartOfMonth.value
    }

    if (!_filters.toTimestamp) {
        _filters.toTimestamp = getEndOfMonth.value
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
}

const { pendingDataOrError } = await useGlobalAsyncData('getStatements', async () => {
    await getStatements().finally(() => (usingFetch.value = false))
})

watch(
    () => route.query,
    async () => {
        if (!usingFetch.value) await getStatements()
    },
    { deep: true },
)

const infiniteScroll = ($state) => {
    setTimeout(() => {
        const currentStatements = accounts?.accountState.statements?.entry || []
        const nextOffset = currentStatements.length

        const limit = Number(filters.value?.limit)

        const lastResponseCount = Number(accounts?.accountState.statements?.responseCount || 0)
        if (nextOffset === 0 || (lastResponseCount > 0 && lastResponseCount < limit)) {
            $state.complete()
            return
        }

        const _request: GetManagedAccountStatementRequest = {
            ...filters.value,
            offset: nextOffset,
        }

        accounts
            ?.getStatements(
                {
                    id: route.params.id as string,
                    filters: _request,
                },
                true,
            )
            .then((res) => {
                const responseCount = Number(res.data.responseCount || 0)

                if (responseCount === 0 || responseCount < limit) {
                    $state.complete()
                } else {
                    $state.loaded()
                }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('Error loading more statements:', error)
                $state.error()
            })
    }, 500)
}
</script>
