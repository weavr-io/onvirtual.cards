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
                        <download-icon class="me-2 mt-1" />
                        <p class="d-none d-sm-inline m-0">download</p>
                    </b-button>
                </div>
                <div v-if="isCardActive" class="ms-2 ms-sm-5">
                    <b-button
                        class="px-0 d-flex align-items-center fw-lighter text-decoration-none no-focus"
                        variant="link"
                        @click="confirmDeleteCard"
                    >
                        <delete-icon class="me-2" />
                        <p class="d-none d-sm-inline m-0">delete card</p>
                    </b-button>
                </div>
            </b-col>
        </b-row>
        <b-row v-if="filteredStatement">
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
    </div>
</template>

<script lang="ts" setup>
import { computed, type PropType, ref, watch } from 'vue'
import dot from 'dot-object'
import { useModalController } from 'bootstrap-vue-next'
import type { FetchError } from 'ofetch'
import type { GetManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardStatementRequest'
import type { StatementFiltersRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/StatementFiltersRequest'
import type { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'
import { useStores } from '~/composables/useStores'
import { useLuxon } from '~/composables/useLuxon'
import { useCards } from '~/composables/useCards'
import { useBase } from '~/composables/useBase'
import { useFilters } from '~/composables/useFilters'
import { useRouterFilter } from '~/composables/useRouterFilter'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { InstrumentEnum } from '~/plugins/weavr-multi/api/models/common/enums/InstrumentEnum'
import StatementItem from '~/components/organisms/StatementItem.vue'
import DownloadIcon from '~/assets/svg/download.svg'
import DeleteIcon from '~/assets/svg/delete.svg'

const props = defineProps({
    filters: {
        type: Object as PropType<StatementFiltersRequest>,
        default: null,
    },
})

const route = useRoute()
const router = useRouter()
const { cards, accounts, transfers } = useStores(['cards', 'accounts', 'transfers'])
const { formatDate, getStartOfMonth, getEndOfMonth } = useLuxon()
const { managedCard, cardId, isCardActive, downloadAsCSV } = useCards()
const { monthsFilter } = useFilters()
const { showErrorToast, showSuccessToast, accountJurisdictionProfileId } = useBase()
const { setFilters } = useRouterFilter()
const { confirm } = useModalController()
const isInitialLoad = ref(true)

const months = computed(() => {
    if (!managedCard.value) return []

    return monthsFilter(managedCard.value.creationTimestamp)
})

const filterDate = computed({
    get: () => {
        if (!props.filters) return {}

        return {
            start: props.filters.fromTimestamp,
            end: props.filters.toTimestamp,
        }
    },
    set: (val) => {
        filterMonthChange(val)
    },
})

const confirmDeleteCard = () => {
    confirm?.({
        props: {
            body: 'Are you sure you want to delete this card? Any remaining balance will be returned to your account.',
            title: 'Confirm',
            okTitle: 'Yes',
            cancelTitle: 'No',
            centered: true,
            hideHeader: true,
        },
    }).then((value) => {
        if (value) {
            doDeleteCard()
        }
    })
}

const filteredStatement = computed(() => cards?.cardState.filteredStatement)

const filterMonthChange = (val) => {
    if (!val || !val.start || !val.end) return

    setFilters({
        fromTimestamp: val.start,
        toTimestamp: val.end,
    })
}

const downloadStatement = () => {
    const _routeQueries = dot.object(route.query)
    const _filters = _routeQueries.filters ? _routeQueries.filters : {}

    if (!_filters.fromTimestamp) {
        _filters.fromTimestamp = getStartOfMonth.value
    }

    if (!_filters.toTimestamp) {
        _filters.toTimestamp = getEndOfMonth.value
    }

    const filters: GetManagedCardStatementRequest = {
        showFundMovementsOnly: false,
        orderByTimestamp: OrderEnum.DESC,
        limit: 100,
        offset: 0,
        ..._filters,
    }

    downloadAsCSV({
        id: cardId.value as string,
        filters,
    })
}

watch(
    route,
    (data) => {
        if (isInitialLoad.value && !data.query.filters && months.value.length > 0) {
            isInitialLoad.value = false

            filterMonthChange({
                start: months.value[0].value.start,
                end: months.value[0].value.end,
            })
        }
    },
    { immediate: true },
)

const doDeleteCard = async () => {
    try {
        showSuccessToast('Preparing card for deletion', 'Card Action')
        if (managedCard?.value?.balances?.availableBalance) {
            const _accounts = await accounts?.index({
                profileId: accountJurisdictionProfileId.value,
                state: ManagedInstrumentStateEnum.ACTIVE,
                offset: '0',
            })
            if (_accounts?.data.count && _accounts?.data.accounts) {
                const _request: CreateTransferRequest = {
                    profileId: useRuntimeConfig().public.profileId.transfers!,
                    source: {
                        type: InstrumentEnum.managedCards,
                        id: cardId.value,
                    },
                    destination: {
                        type: InstrumentEnum.managedAccounts,
                        id: _accounts?.data.accounts[0].id,
                    },
                    destinationAmount: {
                        currency: managedCard.value?.currency,
                        amount: managedCard.value?.balances?.availableBalance,
                    },
                }
                await transfers?.execute(_request)
            }
        }
        await cards?.remove(cardId.value as string).then(() => {
            showSuccessToast('Card has been deleted', 'Card Action')
        })
        await router.push('/managed-cards')
    } catch (err) {
        const data = (err as FetchError<any>).response?._data
        const error = data.message ? data.message : data.errorCode

        showErrorToast(error)
    }
}
</script>
