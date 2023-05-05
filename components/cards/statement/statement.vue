<template>
    <div>
        <b-row class="mb-3" align-v="center" align-h="between">
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
            <b-col cols="3" sm="auto" class="d-flex justify-content-center justify-content-lg-end">
                <div>
                    <b-button
                        variant="link"
                        class="px-0 d-flex align-items-center font-weight-lighter text-decoration-none no-focus"
                        @click="downloadStatement"
                    >
                        <download-icon class="mr-2" />
                        <p class="d-none d-sm-inline m-0">download</p>
                    </b-button>
                </div>
                <div v-if="isCardActive" class="ml-2 ml-sm-5">
                    <b-button
                        variant="link"
                        class="px-0 d-flex align-items-center font-weight-lighter text-decoration-none no-focus"
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
                                {{ date | moment_statement }}
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
import { Component, Emit, mixins, Prop } from 'nuxt-property-decorator'
import { AxiosError } from 'axios'
import BaseMixin from '~/mixins/BaseMixin'
import { GetManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardStatementRequest'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'
import CardsMixin from '~/mixins/CardsMixin'
import RouterMixin from '~/mixins/RouterMixin'
import FiltersMixin from '~/mixins/FiltersMixin'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'
import { InstrumentEnum } from '~/plugins/weavr-multi/api/models/common/enums/InstrumentEnum'

const dot = require('dot-object')
const moment = require('moment')

@Component({
    components: {
        DownloadIcon: () => import('~/assets/svg/download.svg?inline'),
        DeleteIcon: () => import('~/assets/svg/delete.svg?inline'),
        StatementItem: () => import('~/components/statement/item.vue'),
    },
})
export default class CardStatement extends mixins(
    BaseMixin,
    RouterMixin,
    FiltersMixin,
    CardsMixin
) {
    @Prop({
        required: true,
        default: null,
    })
    filters!: GetManagedCardStatementRequest | null

    get months() {
        if (!this.managedCard) return []
        return this.monthsFilter(this.managedCard.creationTimestamp)
    }

    filterMonthChange(val) {
        this.setFilters({
            fromTimestamp: val.start,
            toTimestamp: val.end,
        })
    }

    get filterDate() {
        if (!this.filters) return {}
        return {
            start: this.filters.fromTimestamp,
            end: this.filters.toTimestamp,
        }
    }

    get filteredStatement() {
        return this.stores.cards.filteredStatement
    }

    downloadStatement() {
        const _routeQueries = dot.object(this.$route.query)
        const _filters = _routeQueries.filters ? _routeQueries.filters : {}

        if (!_filters.fromTimestamp) {
            _filters.fromTimestamp = moment().startOf('month').valueOf()
        }

        if (!_filters.toTimestamp) {
            _filters.toTimestamp = moment().endOf('month').valueOf()
        }

        const filters: GetManagedCardStatementRequest = {
            showFundMovementsOnly: false,
            orderByTimestamp: OrderEnum.DESC,
            limit: 100,
            offset: 0,
            ..._filters,
        }

        this.downloadAsCSV({
            id: this.cardId,
            filters,
        })
    }

    confirmDeleteCard() {
        this.$bvModal
            .msgBoxConfirm(
                'Are you sure you want to delete this card? Any remaining balance will be returned to your account.',
                {
                    buttonSize: 'sm',
                    centered: true,
                    cancelVariant: 'link',
                }
            )
            .then((value) => {
                if (value) {
                    this.doDeleteCard()
                }
            })
    }

    async doDeleteCard() {
        try {
            this.showSuccessToast('Preparing card for deletion', 'Card Action')
            if (
                this.managedCard?.balances?.availableBalance &&
                this.managedCard.balances.availableBalance > 0
            ) {
                const _accounts = await this.stores.accounts.index({
                    profileId: this.accountProfileId,
                    state: ManagedInstrumentStateEnum.ACTIVE,
                    offset: '0',
                })
                if (_accounts.data.count && _accounts.data.accounts) {
                    const _request: CreateTransferRequest = {
                        profileId: this.$config.profileId.transfers!,
                        source: {
                            type: InstrumentEnum.managedCards,
                            id: this.cardId,
                        },
                        destination: {
                            type: InstrumentEnum.managedAccounts,
                            id: _accounts.data.accounts[0].id,
                        },
                        destinationAmount: {
                            currency: this.managedCard.currency,
                            amount: this.managedCard.balances.availableBalance,
                        },
                    }
                    await this.stores.transfers.execute(_request)
                }
            }
            await this.stores.cards.remove(this.cardId).then(() => {
                this.showSuccessToast('Card has been deleted', 'Card Action')
            })
            await this.$router.push('/managed-cards')
        } catch (err) {
            const data = (err as AxiosError<any>).response?.data
            const error = data.message ? data.message : data.errorCode

            this.showErrorToast(error)
        }
    }

    @Emit()
    updateStatements() {}
}
</script>
