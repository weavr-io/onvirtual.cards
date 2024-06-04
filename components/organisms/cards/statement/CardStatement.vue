<template>
    <div>
        <b-row align-h="between" align-v="center" class="mb-3">
            <b-col cols="9" sm="auto">
                <div class="d-flex justify-content-start justify-content-lg-start align-items-end">
                    <label class="mr-2 mr-lg-4 font-weight-lighter" for="transaction-timeframe"
                        >All Transactions</label
                    >
                    <b-form-select
                        id="transaction-timeframe"
                        :options="months"
                        :value="filterDate"
                        class="w-auto d-inline-block pl-2"
                        @change="filterMonthChange"
                    />
                </div>
            </b-col>
            <b-col class="d-flex justify-content-center justify-content-lg-end" cols="3" sm="auto">
                <div>
                    <b-button
                        class="px-0 d-flex align-items-center font-weight-lighter text-decoration-none no-focus"
                        variant="link"
                        @click="downloadStatement"
                    >
                        <download-icon class="mr-2" />
                        <p class="d-none d-sm-inline m-0">download</p>
                    </b-button>
                </div>
                <div v-if="isCardActive" class="ml-2 ml-sm-5">
                    <b-button
                        class="px-0 d-flex align-items-center font-weight-lighter text-decoration-none no-focus"
                        variant="link"
                        @click="confirmDeleteCard"
                    >
                        <delete-icon class="mr-2" />
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
<script lang="ts">
import {
    defineComponent,
    computed,
    PropType,
    useRoute,
    useRouter,
    getCurrentInstance,
} from '@nuxtjs/composition-api'
import dot from 'dot-object'
import { AxiosError } from 'axios'
import { useStores } from '~/composables/useStores'
import { useLuxon } from '~/composables/useLuxon'
import { useCards } from '~/composables/useCards'
import { useBase } from '~/composables/useBase'
import { useFilters } from '~/composables/useFilters'
import { useRouterFilter } from '~/composables/useRouterFilter'
import { GetManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardStatementRequest'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'
import { InstrumentEnum } from '~/plugins/weavr-multi/api/models/common/enums/InstrumentEnum'

export default defineComponent({
    // TODO: Update this after nuxt bridge
    components: {
        DownloadIcon: () => import('~/assets/svg/download.svg?inline'),
        DeleteIcon: () => import('~/assets/svg/delete.svg?inline'),
        StatementItem: () => import('~/components/organisms/StatementItem.vue'),
    },
    props: {
        filters: {
            type: Object as PropType<GetManagedCardStatementRequest>,
            default: null,
        },
    },
    setup(props) {
        const route = useRoute()
        const router = useRouter()
        const { proxy: root } = getCurrentInstance() || {}
        const { cards, accounts, transfers } = useStores(['cards', 'accounts', 'transfers'])
        const { formatDate, getStartOfMonth, getEndOfMonth } = useLuxon()
        const { managedCard, cardId, isCardActive, downloadAsCSV } = useCards()
        const { monthsFilter } = useFilters()
        const { showErrorToast, showSuccessToast, accountJurisdictionProfileId } = useBase()
        const { setFilters } = useRouterFilter()

        const months = computed(() => {
            if (!managedCard.value) return []

            return monthsFilter(managedCard.value.creationTimestamp)
        })

        const filterDate = computed(() => {
            if (!props.filters) return {}

            return {
                start: props.filters.fromTimestamp,
                end: props.filters.toTimestamp,
            }
        })

        const filteredStatement = computed(() => cards?.cardState.filteredStatement)

        const filterMonthChange = (val) => {
            setFilters({
                fromTimestamp: val.start,
                toTimestamp: val.end,
            })
        }

        const downloadStatement = () => {
            const _routeQueries = dot.object(route.value.query)
            const _filters = _routeQueries.filters ? _routeQueries.filters : {}

            if (!_filters.fromTimestamp) {
                _filters.fromTimestamp = getStartOfMonth.value
            }

            if (!_filters.toTimestamp) {
                _filters.fromTimestamp = getEndOfMonth.value
            }

            const filters: GetManagedCardStatementRequest = {
                showFundMovementsOnly: false,
                orderByTimestamp: OrderEnum.DESC,
                limit: 100,
                offset: 0,
                ..._filters,
            }

            downloadAsCSV({
                id: cardId.value,
                filters,
            })
        }

        const confirmDeleteCard = () => {
            root!.$bvModal
                .msgBoxConfirm(
                    'Are you sure you want to delete this card? Any remaining balance will be returned to your account.',
                    {
                        buttonSize: 'sm',
                        centered: true,
                        cancelVariant: 'link',
                    },
                )
                .then((value) => {
                    if (value) {
                        doDeleteCard()
                    }
                })
        }

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
                            profileId: root!.$config.profileId.transfers!,
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
                await cards?.remove(cardId.value).then(() => {
                    showSuccessToast('Card has been deleted', 'Card Action')
                })
                await router.push('/managed-cards')
            } catch (err) {
                const data = (err as AxiosError<any>).response?.data
                const error = data.message ? data.message : data.errorCode

                showErrorToast(error)
            }
        }

        return {
            isCardActive,
            months,
            filterDate,
            filteredStatement,
            filterMonthChange,
            formatDate,
            downloadStatement,
            confirmDeleteCard,
        }
    },
})
</script>
