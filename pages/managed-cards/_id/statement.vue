<template>
  <section>
    <b-container>
      <b-row v-if="managedCard" align-v="end" class="mb-5 border-bottom pb-3">
        <b-col cols="1">
          <b-link @click="toggleModal" class="card-view-details">
            view details
          </b-link>
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <p class="card-name m-0">
                {{ managedCard.nameOnCard }}
              </p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span class="card-number">
                •••• {{ managedCard.cardNumberLastFour }}
              </span>

              <span class="card-expiry ml-5">
                <span class="card-expiry-label">EXP</span>
                <span class="card-expiry-value">
                  {{ managedCard.expiryMmyy | expiryMmyy }}
                </span>
              </span>
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-row align-h="end" align-v="end">
            <b-col class="text-right" col cols="auto">
              <b-button
                v-if="managedCard.active && !isFrozen"
                :to="'/transfer?destination=' + managedCard.id.id"
                variant="secondary"
                class="add-funds"
              >
                +
              </b-button>
            </b-col>
            <b-col col cols="auto">
              <div class="card-balance">
                <div class="card-balance-label text-muted">
                  balance
                </div>
                <div class="card-balance-value">
                  {{
                    managedCard.balances.availableBalance
                      | weavr_currency(managedCard.currency)
                  }}
                </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="mb-3" align-v="center">
        <b-col>
          <h6 class="font-weight-lighter">
            <b-row align-v="center">
              <b-col cols="auto">
                All Transactions
              </b-col>
              <b-col cols="auto">
                <b-form-select
                  :options="months"
                  :value="filterDate"
                  @change="filterMonthChange"
                  class="w-auto d-inline-block"
                />
              </b-col>
            </b-row>
          </h6>
        </b-col>
        <b-col
          lg="7"
          xs="14"
          v-if="managedCard.active"
          class="d-flex justify-content-end"
        >
          <div class="mr-5">
            <b-button
              @click="downloadStatement"
              variant="link"
              class="px-0 d-flex align-items-center font-weight-lighter text-decoration-none"
            >
              <download-icon class="mr-2" />
              download
            </b-button>
          </div>
          <div>
            <b-button
              @click="confirmDeleteCard"
              variant="link"
              class="px-0 d-flex align-items-center font-weight-lighter text-decoration-none"
            >
              <delete-icon class="mr-2" />
              delete card
            </b-button>
          </div>
        </b-col>
      </b-row>

      <b-row v-if="filteredStatement">
        <b-col>
          <b-row
            v-for="(statementEntries, date) in filteredStatement"
            :key="date"
          >
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
    </b-container>

    <b-modal
      ref="card-modal"
      hide-footer
      centered
      header-class="border-0"
      body-class="p-0 transparent"
      content-class="transparent-modal"
      size="md"
    >
      <b-card
        v-if="managedCard"
        no-body
        class="border-0 cards-card"
        bg-variant="card-purple"
      >
        <b-card-body class="card-body-modal card-body onvirtual-card">
          <b-link
            :to="'/managed-cards/' + managedCard.id.id + '/statement'"
            class="p-5"
          >
            <b-container fluid class="p-0">
              <b-row align-h="end">
                <b-col cols="2" class="text-right">
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
                        <weavr-span
                          :token="managedCard.cardNumber"
                          :base-style="{
                            fontFamily: '\'Be Vietnam\', sans-serif',
                            color: '#6C1C5C',
                            lineHeight: '1',
                            fontSize: '20px'
                          }"
                          class="card-select-number"
                          field="cardNumber"
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
                    <div class="card-expiry-label">
                      EXP
                    </div>
                    <div class="card-expiry-value">
                      {{ managedCard.expiryMmyy | expiryMmyy }}
                    </div>
                  </div>
                </b-col>
                <b-col cols="3">
                  <div class="card-cvv">
                    <div class="card-cvv-label">
                      CVV
                    </div>
                    <div class="card-cvv-value">
                      <weavr-span
                        :token="managedCard.cvv"
                        :base-style="{
                          fontFamily: '\'Be Vietnam\', sans-serif',
                          color: '#6C1C5C',
                          lineHeight: '14.4px',
                          fontSize: '14.4px',
                          fontWeight: 300
                        }"
                        class="card-select-number"
                        field="cvv"
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
    <infinite-loading @infinite="infiniteScroll" spinner="spiral">
      <span slot="no-more" />
      <div slot="no-results" />
    </infinite-loading>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'

import { BModal, BIcon, BIconThreeDotsVertical } from 'bootstrap-vue'

import * as TransfersStore from '~/store/modules/Transfers'
import { Schemas } from '~/api/Schemas'
import { ManagedCardStatementRequest } from '~/api/Requests/Statements/ManagedCardStatementRequest'
import { TransfersSchemas } from '~/api/TransfersSchemas'
import config from '~/config'
import { cardsStore } from '~/utils/store-accessor'
import BaseMixin from '~/minixs/BaseMixin'
import { StatementRequest } from '~/api/Requests/Statements/StatementRequest'
import RouterMixin from '~/minixs/RouterMixin'
import FiltersMixin from '~/minixs/FiltersMixin'
import OrderType = Schemas.OrderType
import axios from '~/plugins/axios'
import { $api } from '~/utils/api'

const dot = require('dot-object')

const moment = require('moment')

@Component({
  watchQuery: true,
  components: {
    StatementItem: () => import('~/components/statement/item.vue'),
    DeleteIcon: () => import('~/assets/svg/delete.svg?inline'),
    DownloadIcon: () => import('~/assets/svg/download.svg?inline'),
    BIcon,
    BIconThreeDotsVertical
  }
})
export default class ManagedCardsTable extends mixins(
  BaseMixin,
  RouterMixin,
  FiltersMixin
) {
  $route

  // @ts-ignore
  $refs: {
    'card-modal': BModal
  }

  cardId: string = ''

  filters!: StatementRequest

  page: number = 0

  get filteredStatement() {
    return this.stores.cards.filteredStatement
  }

  get managedCard() {
    return this.stores.cards.managedCard
  }

  get filterDate() {
    return {
      start: this.filters.fromTimestamp,
      end: this.filters.toTimestamp
    }
  }

  filterMonthChange(val) {
    this.setFilters({ fromTimestamp: val.start, toTimestamp: val.end })
    console.log(val)
  }

  public fields = ['processedTimestamp', 'adjustment', 'balanceAfter']

  get months() {
    return this.monthsFilter(parseInt(this.managedCard!.creationTimestamp))
  }

  downloadStatement() {
    const _routeQueries = dot.object(this.$route.query)
    const _filters = _routeQueries.filters ? _routeQueries.filters : {}

    if (!_filters.fromTimestamp) {
      _filters.fromTimestamp = moment()
        .startOf('month')
        .valueOf()
    }

    if (!_filters.toTimestamp) {
      _filters.toTimestamp = moment()
        .endOf('month')
        .valueOf()
    }

    const _req: StatementRequest = {
      showFundMovementsOnly: true,
      orderByTimestamp: OrderType.DESC,
      paging: {
        limit: 100,
        offset: 0
      },
      ..._filters
    }

    this.downloadAsCSV(this.cardId, 'managed_cards', _req)
  }

  async asyncData({ store, route }) {
    const _cardId = route.params.id

    const _routeQueries = dot.object(route.query)
    const _filters = _routeQueries.filters ? _routeQueries.filters : {}

    if (!_filters.fromTimestamp) {
      _filters.fromTimestamp = moment()
        .startOf('month')
        .valueOf()
    }

    if (!_filters.toTimestamp) {
      _filters.toTimestamp = moment()
        .endOf('month')
        .valueOf()
    }

    const _statementFilters: StatementRequest = {
      showFundMovementsOnly: true,
      orderByTimestamp: OrderType.DESC,
      paging: {
        limit: 100,
        offset: 0
      },
      ..._filters
    }

    const _req: ManagedCardStatementRequest = {
      id: _cardId,
      request: _statementFilters
    }

    await cardsStore(store).getCardStatement(_req)
    await cardsStore(store).getManagedCard(_cardId)

    return { cardId: _cardId, filters: _statementFilters }
  }

  toggleModal() {
    this.$refs['card-modal'].toggle()
  }

  get isFrozen() {
    return (
      Object.entries(this.managedCard!.state.blockTypes).length > 0 ||
      this.managedCard!.state.destroyType !== ''
    )
  }

  confirmDeleteCard() {
    this.$bvModal
      .msgBoxConfirm(
        'Are you sure you want to delete this card? Any remaining balance will be returned to your account.',
        {
          buttonSize: 'sm',
          centered: true,
          cancelVariant: 'link'
        }
      )
      .then((value) => {
        if (value) {
          this.doDeleteCard()
        }
      })
  }

  async doDeleteCard() {
    const _accounts = await this.stores.accounts.index()

    if (_accounts.data.count >= 1 && this.managedCard) {
      if (
        this.managedCard.balances.availableBalance &&
        parseInt(this.managedCard.balances.availableBalance) > 0
      ) {
        const _request: TransfersSchemas.CreateTransferRequest = {
          profileId: config.profileId.transfers,
          source: {
            type: 'managed_cards',
            id: this.cardId
          },
          destination: _accounts.data.account[0].id,
          destinationAmount: {
            currency: this.managedCard.currency,
            amount: this.managedCard.balances.availableBalance
          }
        }
        await TransfersStore.Helpers.execute(this.$store, _request)
      }
      await this.stores.cards.remove(this.cardId)

      this.$router.push('/managed-cards')
    }
  }

  infiniteScroll($state) {
    setTimeout(() => {
      this.page++

      const _request: StatementRequest = { ...this.filters }
      _request.paging!.offset = this.page * _request.paging!.limit!

      this.stores.cards
        .getCardStatementPage({ id: this.$route.params.id, request: _request })
        .then((response) => {
          if (response.data.responseCount < _request.paging!.limit!) {
            $state.complete()
            console.log('complete')
          } else {
            console.log('loaded')
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
