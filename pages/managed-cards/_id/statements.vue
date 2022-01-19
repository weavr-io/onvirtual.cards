<template>
  <section>
    <b-container>
      <template v-if="managedCard">
        <b-row align-v="end" class="mb-5 border-bottom pb-3">
          <b-col cols="1">
            <b-link class="card-view-details" @click="toggleModal">
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
                <span class="card-number"> •••• {{ managedCard.cardNumberLastFour }} </span>

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
                  v-if="isActive"
                  :to="'/transfer?destination=' + managedCard.id"
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
                    {{ managedCard.balances.availableBalance | weavr_currency(managedCard.currency) }}
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
                    class="w-auto d-inline-block"
                    @change="filterMonthChange"
                  />
                </b-col>
              </b-row>
            </h6>
          </b-col>
          <b-col lg="7" xs="14" class="d-flex justify-content-end">
            <div>
              <b-button
                variant="link"
                class="px-0 d-flex align-items-center font-weight-lighter text-decoration-none"
                @click="downloadStatement"
              >
                <download-icon class="mr-2" />
                download
              </b-button>
            </div>
            <div v-if="isActive" class="ml-5">
              <b-button
                variant="link"
                class="px-0 d-flex align-items-center font-weight-lighter text-decoration-none"
                @click="confirmDeleteCard"
              >
                <delete-icon class="mr-2" />
                delete card
              </b-button>
            </div>
          </b-col>
        </b-row>
      </template>
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
    </b-container>

    <b-modal
      id="cardModal"
      hide-footer
      centered
      header-class="border-0"
      body-class="p-0 transparent"
      content-class="transparent-modal"
      size="md"
    >
      <b-card v-if="managedCard" no-body class="border-0 cards-card" bg-variant="card-purple">
        <b-card-body class="card-body-modal card-body onvirtual-card">
          <b-link :to="'/managed-cards/' + managedCard.id + '/statements'" class="p-5">
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
                        <weavr-card-number-span
                          :token="managedCard.cardNumber.value"
                          :base-style="{
                            fontFamily: '\'Be Vietnam\', sans-serif',
                            color: '#6C1C5C',
                            lineHeight: '1',
                            fontSize: '20px'
                          }"
                          class="card-select-number"
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
                      <weavr-cvv-span
                        :token="managedCard.cvv.value"
                        :base-style="{
                          fontFamily: '\'Be Vietnam\', sans-serif',
                          color: '#6C1C5C',
                          lineHeight: '14.4px',
                          fontSize: '14.4px',
                          fontWeight: 300
                        }"
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
import { Component, mixins } from 'nuxt-property-decorator'

import { BIcon, BIconThreeDotsVertical } from 'bootstrap-vue'

import { Schemas } from '~/api/Schemas'
import BaseMixin from '~/minixs/BaseMixin'
import RouterMixin from '~/minixs/RouterMixin'
import FiltersMixin from '~/minixs/FiltersMixin'
import AccountsMixin from '~/minixs/AccountsMixin'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'
import { InstrumentEnum } from '~/plugins/weavr-multi/api/models/common/enums/InstrumentEnum'
import { StatementFiltersRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/StatementFiltersRequest'
import { ManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/ManagedCardStatementRequest'
import OrderType = Schemas.OrderType
import CardsMixin from '~/minixs/CardsMixin'
import { GetManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardStatementRequest'

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
export default class ManagedCardsStatements extends mixins(BaseMixin, RouterMixin, FiltersMixin, CardsMixin) {
  $route

  filters!: StatementFiltersRequest

  page: number = 0

  async fetch() {
    const routeQueries = dot.object(this.$route.query)
    const filters = routeQueries.filters || {}

    if (!filters.fromTimestamp) {
      filters.fromTimestamp = moment()
        .startOf('month')
        .valueOf()
    }

    if (!filters?.toTimestamp) {
      filters.toTimestamp = moment()
        .endOf('month')
        .valueOf()
    }

    const statementFilters: StatementFiltersRequest = {
      showFundMovementsOnly: false,
      orderByTimestamp: OrderType.DESC,
      limit: 100,
      offset: 0,
      ...filters
    }

    this.filters = statementFilters

    const _req: ManagedCardStatementRequest = {
      id: this.cardId,
      request: statementFilters
    }

    await this.stores.cards.getCardStatement(_req)
    await this.stores.cards.getManagedCard(this.cardId)

    this.$weavrSetUserToken('Bearer ' + this.stores.auth.token)
  }

  get cardId() {
    return this.$route.params.id
  }

  get filteredStatement() {
    return this.stores.cards.filteredStatement
  }

  get managedCard() {
    return this.stores.cards.managedCard
  }

  get filterDate() {
    if (!this.filters) return {}
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
    if (!this.managedCard) return ''
    return this.monthsFilter(this.managedCard.creationTimestamp)
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

    const filters: GetManagedCardStatementRequest = {
      showFundMovementsOnly: false,
      orderByTimestamp: OrderType.DESC,
      limit: 100,
      offset: 0,
      ..._filters
    }

    this.downloadAsCSV({ id: this.cardId, filters })
  }

  toggleModal() {
    this.$bvModal.show('cardModal')
  }

  get isActive() {
    return this.managedCard && this.managedCard.state.state === ManagedInstrumentStateEnum.ACTIVE
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
    const _accounts = await this.stores.accounts.index({
      profileId: this.stores.auth.isConsumer
        ? this.$config.profileId.managed_accounts_consumers!
        : this.$config.profileId.managed_accounts_corporates!,
      state: ManagedInstrumentStateEnum.ACTIVE,
      offset: '0'
    })

    if (_accounts.data.count && _accounts.data.accounts && this.managedCard) {
      if (this.managedCard.balances?.availableBalance && this.managedCard.balances.availableBalance > 0) {
        const _request: CreateTransferRequest = {
          profileId: this.$config.profileId.transfers!,
          source: {
            type: InstrumentEnum.managedCards,
            id: this.cardId
          },
          destination: {
            type: InstrumentEnum.managedAccounts,
            id: _accounts.data.accounts[0].id
          },
          destinationAmount: {
            currency: this.managedCard.currency,
            amount: this.managedCard.balances.availableBalance
          }
        }
        await this.stores.transfers.execute(_request)
      }
      await this.stores.cards.remove(this.cardId)

      await this.$router.push('/managed-cards')
    }
  }

  infiniteScroll($state) {
    setTimeout(() => {
      this.page++

      const request: StatementFiltersRequest = { ...this.filters }
      request.offset = this.page * +request.limit!

      this.stores.cards.getCardStatement({ id: this.$route.params.id, request }).then((response) => {
        if (!response.data.responseCount || response.data.responseCount < request.limit!) {
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
