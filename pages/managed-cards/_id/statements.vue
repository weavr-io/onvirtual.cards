<template>
    <section>
        <b-container>
            <template v-if="managedCard && !pendingDataOrError">
                <b-row align-h="between" align-v="end" class="mb-3 border-bottom pb-3">
                    <b-col cols="7" sm="auto">
                        <div class="d-flex align-items-center">
                            <b-link class="card-view-details" @click="toggleModal">
                                view <br />
                                details
                            </b-link>
                            <div class="d-flex flex-column ml-3">
                                <p class="card-name m-0">
                                    {{ managedCard.nameOnCard }}
                                </p>
                                <div class="d-flex">
                                    <span class="card-number">
                                        •••• {{ managedCard.cardNumberLastFour }}
                                    </span>
                                    <span class="card-expiry ml-2 ml-sm-5">
                                        <span class="card-expiry-label">EXP</span>
                                        <span
                                            v-if="managedCard.expiryMmyy"
                                            class="card-expiry-value"
                                        >
                                            {{ expiryDate }}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </b-col>
                    <b-col cols="5" sm="auto">
                        <div class="d-flex align-items-center justify-content-end">
                            <b-button
                                v-if="isCardActive"
                                :to="'/transfer?destination=' + managedCard.id"
                                class="add-funds mr-3"
                                variant="secondary"
                            >
                                +
                            </b-button>
                            <div class="card-balance">
                                <div class="card-balance-label text-muted">balance</div>
                                <div
                                    v-if="managedCard.balances?.availableBalance"
                                    class="card-balance-value"
                                >
                                    {{ currency }}
                                </div>
                            </div>
                        </div>
                    </b-col>
                </b-row>
                <statement :filters="filters" />
            </template>
        </b-container>

        <b-modal
            id="cardModal"
            body-class="p-0 transparent"
            centered
            content-class="transparent-modal"
            header-class="border-0"
            hide-footer
            hide-header-close
            size="md"
            @hidden="toggleIsLoading"
        >
            <b-card v-if="managedCard" bg-variant="card-purple" class="border-0 cards-card" no-body>
                <b-card-body class="card-body-modal card-body onvirtual-card">
                    <b-link :to="`/managed-cards/${managedCard.id}/statements`" class="p-5">
                        <b-container class="p-0" fluid>
                            <b-row align-h="end">
                                <b-col class="text-right" cols="2">
                                    <b-img src="/img/mc_symbol.svg" width="50px" />
                                </b-col>
                            </b-row>
                            <b-row class="mt-5 mb-5">
                                <b-col>
                                    <b-row>
                                        <b-col>
                                            <div class="card-name">
                                                {{ managedCard.friendlyName }}
                                            </div>
                                        </b-col>
                                    </b-row>
                                    <b-row class="mt-2">
                                        <b-col>
                                            <div class="card-number">
                                                <b-skeleton
                                                    v-if="isLoading"
                                                    class="mb-1"
                                                    width="30ch"
                                                />
                                                <weavr-card-number-span
                                                    v-show="!isLoading"
                                                    :base-style="{
                                                        fontFamily: '\'Be Vietnam\', sans-serif',
                                                        color: '#6C1C5C',
                                                        lineHeight: '1',
                                                        fontSize: '20px',
                                                    }"
                                                    :token="managedCard.cardNumber?.value"
                                                    class="card-select-number"
                                                    @onChange="toggleIsLoading"
                                                />
                                            </div>
                                        </b-col>
                                    </b-row>
                                </b-col>
                            </b-row>
                            <b-row align-v="end">
                                <b-col cols="6">
                                    <div class="card-name-on-card text-truncate">
                                        {{ managedCard.nameOnCard }}
                                    </div>
                                </b-col>
                                <b-col cols="3">
                                    <div class="card-expiry">
                                        <div class="card-expiry-label">EXP</div>
                                        <div
                                            v-if="managedCard.expiryMmyy"
                                            class="card-expiry-value"
                                        >
                                            {{ expiryDate }}
                                        </div>
                                    </div>
                                </b-col>
                                <b-col cols="3">
                                    <div class="card-cvv mb-1">
                                        <div class="card-cvv-label mb-2">CVV</div>
                                        <div class="card-cvv-value">
                                            <b-skeleton v-if="isLoading" class="m-0" width="5ch" />
                                            <weavr-cvv-span
                                                v-show="!isLoading"
                                                :base-style="{
                                                    fontFamily: '\'Be Vietnam\', sans-serif',
                                                    color: '#6C1C5C',
                                                    lineHeight: '14.4px',
                                                    fontSize: '14.4px',
                                                    fontWeight: '300',
                                                }"
                                                :token="managedCard.cvv?.value"
                                                class="card-select-number"
                                            />
                                        </div>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-link>
                </b-card-body>
            </b-card>
        </b-modal>
        <infinite-loading spinner="spiral" @infinite="infiniteScroll">
            <span slot="no-more" />
            <div slot="no-results" />
        </infinite-loading>
    </section>
</template>

<script lang="ts" setup>
import {
    Ref,
    computed,
    getCurrentInstance,
    ref,
    useContext,
    useFetch,
    useRoute,
    watch,
} from '@nuxtjs/composition-api'
import dot from 'dot-object'
import { DateTime } from 'luxon'
import Statement from '~/components/cards/statement/statement.vue'
import { useBase } from '~/composables/useBase'
import { useCards } from '~/composables/useCards'
import { useStores } from '~/composables/useStores'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common'
import { ManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/ManagedCardStatementRequest'
import { StatementFiltersRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/StatementFiltersRequest'
import WeavrCvvSpan from '~/plugins/weavr/components/WeavrCVVSpan.vue'
import WeavrCardNumberSpan from '~/plugins/weavr/components/WeavrCardNumberSpan.vue'
import { expiryMmyy, weavrCurrency } from '~/utils/helper'

const route = useRoute()

const { proxy: root } = getCurrentInstance() || {}
const { $weavrSetUserToken } = useContext()
const { managedCard, cardId, isCardActive } = useCards()
const { pendingDataOrError } = useBase()
const { auth, cards } = useStores(['auth', 'cards'])

const filters: Ref<StatementFiltersRequest | null> = ref(null)
const page = ref(0)
const isLoading: Ref<boolean | null> = ref(null)

const currency = computed(() => {
    return weavrCurrency(managedCard.value?.balances?.availableBalance, managedCard.value?.currency)
})

const expiryDate = computed(() => {
    return expiryMmyy(managedCard.value?.expiryMmyy)
})

useFetch(async () => {
    page.value = 0

    $weavrSetUserToken(`Bearer ${auth?.token}`)

    await cards?.getManagedCard(cardId.value)
    await fetchCardStatements()
})

const fetchCardStatements = async () => {
    const routeQueries = dot.object(route.value.query)
    const filters = routeQueries.filters || {}

    if (!filters.value?.fromTimestamp) {
        filters.value.fromTimestamp = DateTime.now().startOf('month').toMillis()
    }

    if (!filters.value?.toTimestamp) {
        filters.value.toTimestamp = DateTime.now().endOf('month').toMillis()
    }

    const statementFilters: StatementFiltersRequest = {
        showFundMovementsOnly: false,
        orderByTimestamp: OrderEnum.DESC,
        limit: 100,
        offset: 0,
        ...filters.value,
    }

    const _req: ManagedCardStatementRequest = {
        id: cardId.value,
        request: statementFilters,
    }

    filters.value = statementFilters

    cards?.clearCardStatements()
    await cards?.getCardStatement(_req)
}

const toggleIsLoading = () => {
    isLoading.value = !isLoading.value
}

const infiniteScroll = ($state) => {
    setTimeout(() => {
        page.value++

        const request: StatementFiltersRequest = { ...filters.value }
        request.offset = page.value * +request.limit!

        cards
            ?.getCardStatement({
                id: route.value.params.id,
                request,
            })
            .then((response) => {
                if (!response.data.responseCount || response.data.responseCount < request.limit!) {
                    $state.complete()
                } else {
                    $state.loaded()
                }
            })
    }, 500)
}

const toggleModal = () => {
    root!.$bvModal.show('cardModal')
}

watch(route.value.query, fetchCardStatements)
</script>

<style lang="scss" scoped>
.card-balance {
    .card-balance-label {
        font-size: 0.8rem;
    }

    .card-balance-value {
        font-size: 1.5rem;
    }
}

.add-funds {
    border-radius: 100%;
    padding: 13px 10px 18px;
    line-height: 0;
    font-size: 20px;
}

.card {
    &-name {
        font-size: 1.2rem;
    }

    &-cvv,
    &-expiry {
        &-label {
            font-size: 0.8rem;
        }
    }
}

.card-view-details {
    background: #f0edde;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    display: block;
    font-size: 0.6rem;
}
</style>
