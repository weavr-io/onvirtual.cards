<template>
    <section>
        <b-container>
            <template v-if="cards.unRefs.managedCard && !base.unRefs.pendingDataOrError">
                <b-row align-h="between" align-v="end" class="mb-3 border-bottom pb-3">
                    <b-col cols="7" sm="auto">
                        <div class="d-flex align-items-center">
                            <b-link class="card-view-details" @click="toggleModal">
                                view <br />
                                details
                            </b-link>
                            <div class="d-flex flex-column ml-3">
                                <p class="card-name m-0">
                                    {{ cards.unRefs.managedCard.nameOnCard }}
                                </p>
                                <div class="d-flex">
                                    <span class="card-number">
                                        •••• {{ cards.unRefs.managedCard.cardNumberLastFour }}
                                    </span>
                                    <span class="card-expiry ml-2 ml-sm-5">
                                        <span class="card-expiry-label">EXP</span>
                                        <span class="card-expiry-value">
                                            {{ cards.unRefs.managedCard.expiryMmyy | expiryMmyy }}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </b-col>
                    <b-col cols="5" sm="auto">
                        <div class="d-flex align-items-center justify-content-end">
                            <b-button
                                v-if="cards.unRefs.isCardActive"
                                :to="'/transfer?destination=' + cards.unRefs.managedCard.id"
                                class="add-funds mr-3"
                                variant="secondary"
                            >
                                +
                            </b-button>
                            <div class="card-balance">
                                <div class="card-balance-label text-muted">balance</div>
                                <div class="card-balance-value">
                                    {{
                                        cards.unRefs.managedCard.balances.availableBalance |
                                            weavr_currency(cards.unRefs.managedCard.currency)
                                    }}
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
            <b-card
                v-if="cards.unRefs.managedCard"
                bg-variant="card-purple"
                class="border-0 cards-card"
                no-body
            >
                <b-card-body class="card-body-modal card-body onvirtual-card">
                    <b-link
                        :to="`/managed-cards/${cards.unRefs.managedCard.id}/statements`"
                        class="p-5"
                    >
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
                                                {{ cards.unRefs.managedCard.friendlyName }}
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
                                                    :token="
                                                        cards.unRefs.managedCard.cardNumber.value
                                                    "
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
                                        {{ cards.unRefs.managedCard.nameOnCard }}
                                    </div>
                                </b-col>
                                <b-col cols="3">
                                    <div class="card-expiry">
                                        <div class="card-expiry-label">EXP</div>
                                        <div class="card-expiry-value">
                                            {{ cards.unRefs.managedCard.expiryMmyy | expiryMmyy }}
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
                                                    fontWeight: 300,
                                                }"
                                                :token="cards.unRefs.managedCard.cvv.value"
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

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { StatementFiltersRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/StatementFiltersRequest'
import { ManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/ManagedCardStatementRequest'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'
import Statement from '~/components/cards/statement/statement.vue'
import WeavrCvvSpan from '~/plugins/weavr/components/WeavrCVVSpan.vue'
import WeavrCardNumberSpan from '~/plugins/weavr/components/WeavrCardNumberSpan.vue'
import { useBase } from '~/composables/useBase'
import { useCards } from '~/composables/useCards'

const dot = require('dot-object')
const moment = require('moment')

@Component({
    watch: {
        '$route.query': 'fetchCardStatements',
    },
    components: {
        WeavrCardNumberSpan,
        WeavrCvvSpan,
        Statement,
        StatementItem: () => import('~/components/statement/item.vue'),
    },
})
export default class ManagedCardsStatements extends Vue {
    base = useBase(this)
    cards = useCards(this)

    filters: StatementFiltersRequest | null = null

    page: number = 0

    isLoading: boolean | null = true

    fields = ['processedTimestamp', 'adjustment', 'balanceAfter']

    async fetch() {
        this.page = 0
        this.$weavrSetUserToken('Bearer ' + this.base.stores.auth.token)

        await this.base.stores.cards.getManagedCard(this.cards.unRefs.cardId)
        await this.fetchCardStatements()
    }

    async fetchCardStatements() {
        const routeQueries = dot.object(this.$route.query)
        const filters = routeQueries.filters || {}

        if (!filters?.fromTimestamp) {
            filters.fromTimestamp = moment().startOf('month').valueOf()
        }

        if (!filters?.toTimestamp) {
            filters.toTimestamp = moment().endOf('month').valueOf()
        }

        const statementFilters: StatementFiltersRequest = {
            showFundMovementsOnly: false,
            orderByTimestamp: OrderEnum.DESC,
            limit: 100,
            offset: 0,
            ...filters,
        }

        const _req: ManagedCardStatementRequest = {
            id: this.cards.unRefs.cardId,
            request: statementFilters,
        }

        this.filters = statementFilters

        this.base.stores.cards.clearCardStatements()
        await this.base.stores.cards.getCardStatement(_req)
    }

    toggleIsLoading() {
        this.isLoading = !this.isLoading
    }

    toggleModal() {
        this.$bvModal.show('cardModal')
    }

    infiniteScroll($state) {
        setTimeout(() => {
            this.page++

            const request: StatementFiltersRequest = { ...this.filters }
            request.offset = this.page * +request.limit!

            this.base.stores.cards
                .getCardStatement({
                    id: this.$route.params.id,
                    request,
                })
                .then((response) => {
                    if (
                        !response.data.responseCount ||
                        response.data.responseCount < request.limit!
                    ) {
                        $state.complete()
                    } else {
                        $state.loaded()
                    }
                })
        }, 500)
    }
}
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
