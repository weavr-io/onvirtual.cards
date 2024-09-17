<template>
    <section>
        <b-container>
            <template v-if="managedCard && !pendingDataOrError">
                <b-row align-h="between" align-v="end" class="mb-3 border-bottom pb-3">
                    <b-col cols="7" sm="auto">
                        <div class="d-flex align-items-center">
                            <b-link class="card-view-details" @click="isCardModalVisible = true">
                                view <br />
                                details
                            </b-link>
                            <div class="d-flex flex-column ms-3">
                                <p class="card-name m-0">
                                    {{ managedCard.nameOnCard }}
                                </p>
                                <div class="d-flex">
                                    <span class="card-number">
                                        •••• {{ managedCard.cardNumberLastFour }}
                                    </span>
                                    <span class="card-expiry ms-2 ms-sm-5">
                                        <span class="card-expiry-label">EXP</span>
                                        <span
                                            v-if="managedCard.expiryMmyy"
                                            class="card-expiry-value ps-1"
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
                                class="me-3 add-funds"
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
            v-model="isCardModalVisible"
            body-class="p-0 transparent"
            centered
            content-class="transparent-modal"
            header-class="border-0"
            hide-footer
            hide-header-close
            size="md"
            @hidden="toggleIsLoading"
        >
            <b-card v-if="managedCard" class="border-0 cards-card bg-card-purple" no-body>
                <b-card-body class="card-body-modal card-body onvirtual-card">
                    <nuxt-link :to="`/managed-cards/${managedCard.id}/statements`" class="p-5">
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
                                                <div
                                                    v-if="isLoading"
                                                    class="skeleton-loader mb-1"
                                                ></div>
                                                <weavr-card-number-span
                                                    v-show="!isLoading"
                                                    :base-style="{
                                                        fontFamily: '\'Be Vietnam\', sans-serif',
                                                        color: '#6C1C5C',
                                                        lineHeight: '1',
                                                        fontSize: '20px',
                                                    }"
                                                    :token="managedCardNumber"
                                                    class="card-select-number"
                                                    @on-change="toggleIsLoading"
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
                                            <div
                                                v-if="isLoading"
                                                class="skeleton-loader mb-1"
                                            ></div>
                                            <weavr-cvv-span
                                                v-show="!isLoading"
                                                :base-style="{
                                                    fontFamily: '\'Be Vietnam\', sans-serif',
                                                    color: '#6C1C5C',
                                                    lineHeight: '14.4px',
                                                    fontSize: '14.4px',
                                                    fontWeight: '300',
                                                }"
                                                :token="managedCardCvv"
                                                class="card-select-number"
                                            />
                                        </div>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-container>
                    </nuxt-link>
                </b-card-body>
            </b-card>
        </b-modal>
        <infinite-loading class="statement-loader" spinner="spiral" @infinite="infiniteScroll">
            <template #complete>
                <div />
            </template>
        </infinite-loading>
    </section>
</template>

<script lang="ts" setup>
import dot from 'dot-object'
import { useLuxon } from '~/composables/useLuxon'
import { useCards } from '~/composables/useCards'
import { useStores } from '~/composables/useStores'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common'
import type { ManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/ManagedCardStatementRequest'
import type { StatementFiltersRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/StatementFiltersRequest'
import { expiryMmyy, weavrCurrency } from '~/utils/helper'
import { useGlobalAsyncData } from '~/composables/useGlobalAsyncData'
import WeavrCvvSpan from '~/plugins/weavr/components/WeavrCVVSpan.vue'
import WeavrCardNumberSpan from '~/plugins/weavr/components/WeavrCardNumberSpan.vue'
import Statement from '~/components/organisms/cards/statement/CardStatement.vue'

const route = useRoute()
const { $weavrSetUserToken } = useNuxtApp()
const { managedCard, cardId, isCardActive } = useCards()
const { getStartOfMonth, getEndOfMonth } = useLuxon()
const { auth, cards } = useStores(['auth', 'cards'])
const isCardModalVisible = ref(false)

const managedCardNumber = computed(() => {
    return managedCard.value?.cardNumber?.value || ''
})

const managedCardCvv = computed(() => {
    return managedCard.value?.cvv?.value || ''
})

const filters: Ref<StatementFiltersRequest | undefined> = ref(undefined)
const page = ref(0)
const isLoading: Ref<boolean> = ref(true)

const currency = computed(() => {
    return weavrCurrency(managedCard.value?.balances?.availableBalance, managedCard.value?.currency)
})

const expiryDate = computed(() => {
    return expiryMmyy(managedCard.value?.expiryMmyy)
})

const fetchCardStatements = async () => {
    const routeQueries = dot.object(route.query)
    const localFilters = routeQueries.filters || {}

    if (!localFilters?.fromTimestamp) {
        localFilters.fromTimestamp = getStartOfMonth.value
    }

    if (!localFilters?.toTimestamp) {
        localFilters.toTimestamp = getEndOfMonth.value
    }

    const statementFilters: StatementFiltersRequest = {
        showFundMovementsOnly: false,
        orderByTimestamp: OrderEnum.DESC,
        limit: 100,
        offset: 0,
        ...localFilters,
    }

    const _req: ManagedCardStatementRequest = {
        id: cardId.value as string,
        request: statementFilters,
    }

    filters.value = { ...statementFilters }

    cards?.clearCardStatements()
    await cards?.getCardStatement(_req)
}

const loadCardAndStatements = async () => {
    page.value = 0
    ;($weavrSetUserToken as (token: string) => void)(`Bearer ${auth?.token}`)

    await cards?.getManagedCard(cardId.value as string)
    await fetchCardStatements()
}

const { pendingDataOrError } = await useGlobalAsyncData('loadCardAndStatements', async () => {
    await loadCardAndStatements()
})

const toggleIsLoading = () => {
    isLoading.value = !isLoading.value
}

const infiniteScroll = ($state) => {
    setTimeout(() => {
        page.value++

        const request: StatementFiltersRequest = { ...filters.value }
        request.offset = page.value * +request.limit! || 0

        cards
            ?.getCardStatement({
                id: route.params.id as string,
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

watch(() => route.query, fetchCardStatements, { deep: true })
</script>

<style lang="scss" scoped>
.card-number {
    .skeleton-loader {
        width: 30ch;
    }
}

.card-cvv-value {
    .skeleton-loader {
        width: 5ch;
    }
}

.card-balance {
    .card-balance-label {
        font-size: 0.8rem;
    }

    .card-balance-value {
        font-size: 1.5rem;
    }
}

:deep(.add-funds) {
    border-radius: 100%;
    font-size: 20px;
    line-height: 0;
    padding: 13px 10px 18px;
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
    display: block;
    font-size: 0.6rem;
    padding: 10px;
    text-align: center;
    text-decoration: none;
}

.card-view-details:hover {
    text-decoration: underline;
}
</style>
