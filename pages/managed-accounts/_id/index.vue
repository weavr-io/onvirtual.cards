<template>
    <div>
        <section v-if="!hasAlert && !pendingDataOrError">
            <statement :filters="filters" />
            <infinite-loading spinner="spiral" @infinite="infiniteScroll">
                <template #no-more>
                    <span />
                </template>
                <template #no-results>
                    <div />
                </template>
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
import { useBase } from '~/composables/useBase'
import { useKyVerified } from '~/composables/useKyVerified'
import Statement from '~/components/organisms/accounts/statement/AccountStatement.vue'

definePageMeta({
    layout: 'dashboard',
    middleware: 'ky-verified',
})
const route = useRoute()
const { accounts } = useStores(['accounts'])
const { pendingDataOrError } = useBase()
const { hasAlert } = useKyVerified()
const { getStartOfMonth, getEndOfMonth } = useLuxon()
accounts?.setStatements(null)
const filters: Ref<GetManagedAccountStatementRequest | undefined> = ref(undefined)
const page = ref(0)
const usingFetch = ref(true)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const filteredStatement = computed(() => {
    return accounts?.filteredStatement
})

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

useAsyncData(async () => {
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
        page.value++

        const _request: GetManagedAccountStatementRequest = { ...filters.value }

        _request!.offset = (page.value * +_request!.limit!).toString()

        accounts
            ?.getStatements({
                id: route.params.id as string,
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
</script>
