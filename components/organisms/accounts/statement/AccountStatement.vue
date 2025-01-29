<template>
    <div>
        <b-row align-h="between" align-v="center" class="mb-3">
            <b-col cols="9" sm="auto">
                <div class="d-flex justify-content-start justify-content-lg-start align-items-end">
                    <label class="me-2 me-lg-4 fw-lighter mb-2" for="transaction-timeframe"
                        >All Transactions</label
                    >
                    <b-form-select
                        id="transaction-timeframe"
                        v-model="filterDate"
                        :options="months"
                        class="w-auto d-inline-block ps-2 custom-select"
                    />
                </div>
            </b-col>
            <b-col class="d-flex justify-content-center justify-content-lg-end" cols="3" sm="auto">
                <div>
                    <b-button
                        class="px-0 d-flex align-items-center fw-lighter text-decoration-none no-focus"
                        variant="link"
                        @click="downloadStatement"
                    >
                        <download-icon class="me-2" />
                        <p class="d-none d-sm-inline m-0">download</p>
                    </b-button>
                </div>
            </b-col>
        </b-row>
        <b-row align-h="between" align-v="center" class="mb-3">
            <b-col>
                <template v-if="filteredStatement && filteredStatementLength > 0">
                    <b-row v-for="(statementEntries, date) in filteredStatement" :key="date">
                        <b-col>
                            <b-row v-for="(statement, key) in statementEntries" :key="key">
                                <b-col>
                                    <statement-item :transaction="statement" />
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </template>
                <template v-else-if="availableBalance === 0">
                    <b-row class="py-5">
                        <b-col class="text-center">
                            <h5 class="fw-light">Your transactions will appear here.</h5>
                            <b-button :to="`/managed-accounts/${account?.id}/topup`" variant="link">
                                Start by topping up your account.
                            </b-button>
                        </b-col>
                    </b-row>
                </template>
            </b-col>
        </b-row>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStores } from '~/composables/useStores'
import { useLuxon } from '~/composables/useLuxon'
import { useAccounts } from '~/composables/useAccounts'
import { useFilters } from '~/composables/useFilters'
import { useRouterFilter } from '~/composables/useRouterFilter'
import type { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import DownloadIcon from '~/assets/svg/download.svg'
import dot from 'dot-object'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common'

// Define props
const props = defineProps({
    filters: {
        type: Object as PropType<GetManagedAccountStatementRequest>,
        required: true,
    },
})

// Setup logic
const route = useRoute()
const { accounts } = useStores(['accounts'])
const { getStartOfMonth, getEndOfMonth } = useLuxon()
const { account, downloadAsCSV } = useAccounts()
const { monthsFilter } = useFilters()
const { setFilters } = useRouterFilter()

const filteredStatement = computed(() => accounts?.filteredStatement)

const availableBalance = computed(() => {
    return account.value?.balances.availableBalance || 0
})

const filteredStatementLength = computed(() => {
    return filteredStatement.value ? Object.keys(filteredStatement.value).length : 0
})

const filterDate = computed({
    get() {
        return {
            start: props.filters.fromTimestamp as unknown as number,
            end: props.filters.toTimestamp as unknown as number,
        }
    },
    set(newValue) {
        setFilters({
            fromTimestamp: newValue.start,
            toTimestamp: newValue.end,
        })
    },
})
const months = computed(() => {
    return account.value ? monthsFilter(account.value.creationTimestamp) : []
})

const downloadStatement = () => {
    const _routeQueries = dot.object(route.query)
    const _filters = _routeQueries.filters ? _routeQueries.filters : {}

    if (!_filters.fromTimestamp) {
        _filters.fromTimestamp = getStartOfMonth.value
    }

    if (!_filters.toTimestamp) {
        _filters.fromTimestamp = getEndOfMonth.value
    }

    const filters: GetManagedAccountStatementRequest = {
        limit: 100,
        offset: 0,
        showFundMovementsOnly: false,
        orderByTimestamp: OrderEnum.DESC,
        ..._filters,
    }

    downloadAsCSV({
        id: account.value?.id as string,
        filters,
    })
}
</script>
