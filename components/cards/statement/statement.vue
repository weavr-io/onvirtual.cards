<template>
  <div>
    <b-row class="mb-3" align-v="center">
      <b-col>
        <h6 class="font-weight-lighter">
          <b-row align-v="center">
            <b-col cols="auto"> All Transactions </b-col>
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
        <div v-if="cards.unRefs.isCardActive" class="ml-5">
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
import { Component, Emit, Prop } from 'nuxt-property-decorator'
import { AxiosError } from 'axios'
import Vue from 'vue'
import { GetManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardStatementRequest'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'
import { InstrumentEnum } from '~/plugins/weavr-multi/api/models/common/enums/InstrumentEnum'
import { useBase } from '~/composables/useBase'
import { useFilters } from '~/composables/useFilters'
import { useRouter } from '~/composables/useRouter'
import { useCards } from '~/composables/useCards'

const dot = require('dot-object')
const moment = require('moment')

@Component({
  components: {
    DownloadIcon: () => import('~/assets/svg/download.svg?inline'),
    DeleteIcon: () => import('~/assets/svg/delete.svg?inline'),
    StatementItem: () => import('~/components/statement/item.vue'),
  },
})
export default class CardStatement extends Vue {
  base = useBase(this)
  filtersComp = useFilters()
  cards = useCards(this)
  router = useRouter(this)

  @Prop({
    required: true,
    default: null,
  })
  filters!: GetManagedCardStatementRequest | null

  get months() {
    if (!this.cards.unRefs.managedCard) return []
    return this.filtersComp.monthsFilter(this.cards.unRefs.managedCard.creationTimestamp)
  }

  filterMonthChange(val) {
    this.router.setFilters({
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
    return this.base.stores.cards.filteredStatement
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

    this.cards.downloadAsCSV({
      id: this.cards.unRefs.cardId,
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
      this.base.showSuccessToast('Preparing card for deletion', 'Card Action')
      if (
        this.cards.unRefs.managedCard?.balances?.availableBalance &&
        this.cards.unRefs.managedCard.balances.availableBalance > 0
      ) {
        const _accounts = await this.base.stores.accounts.index({
          profileId: this.base.unRefs.accountProfileId,
          state: ManagedInstrumentStateEnum.ACTIVE,
          offset: '0',
        })
        if (_accounts.data.count && _accounts.data.accounts) {
          const _request: CreateTransferRequest = {
            profileId: this.$config.profileId.transfers!,
            source: {
              type: InstrumentEnum.managedCards,
              id: this.cards.unRefs.cardId,
            },
            destination: {
              type: InstrumentEnum.managedAccounts,
              id: _accounts.data.accounts[0].id,
            },
            destinationAmount: {
              currency: this.cards.unRefs.managedCard.currency,
              amount: this.cards.unRefs.managedCard.balances.availableBalance,
            },
          }
          await this.base.stores.transfers.execute(_request)
        }
      }
      await this.base.stores.cards.remove(this.cards.unRefs.cardId).then(() => {
        this.base.showSuccessToast('Card has been deleted', 'Card Action')
      })
      await this.$router.push('/managed-cards')
    } catch (err) {
      const data = (err as AxiosError<any>).response?.data
      const error = data.message ? data.message : data.errorCode

      this.base.showErrorToast(error)
    }
  }

  @Emit()
  updateStatements() {}
}
</script>
