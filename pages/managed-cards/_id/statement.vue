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
            All Transactions
          </h6>
        </b-col>
        <b-col v-if="managedCard.active" class="d-flex justify-content-end">
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
      ref="card-modal"
      hide-footer
      centered
      header-class="border-0"
      body-class="p-0 transparent"
      content-class="transparent-modal"
      size="md"
    >
      <b-card v-if="managedCard" no-body class="border-0 cards-card" bg-variant="card-purple">
        <b-card-body class="card-body-modal card-body onvirtual-card">
          <b-link :to="'/managed-cards/' + managedCard.id.id + '/statement'" class="p-5">
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
  </section>
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'

import { BModal, BIcon, BIconThreeDotsVertical } from 'bootstrap-vue'

import * as ManagedCardsStore from '~/store/modules/Cards'
import * as TransfersStore from '~/store/modules/Transfers'
import { Schemas } from '~/api/Schemas'
import { ManagedCardStatementRequest } from '~/api/Requests/Statements/ManagedCardStatementRequest'
import { TransfersSchemas } from '~/api/TransfersSchemas'
import config from '~/config'
import * as AccountsStore from '~/store/modules/Accounts'
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
import * as CorporatesStore from '~/store/modules/Corporates'
import { KYBState } from '~/api/Enums/KYBState'
import OrderType = Schemas.OrderType

const ManagedCards = namespace(ManagedCardsStore.name)

@Component({
  components: {
    StatementItem: () => import('~/components/statement/item.vue'),
    DeleteIcon: () => import('~/assets/svg/delete.svg?inline'),
    BIcon,
    BIconThreeDotsVertical
  }
})
export default class ManagedCardsTable extends Vue {
  $route

  // @ts-ignore
  $refs: {
    'card-modal': BModal
  }

  cardId: string = ''

  @ManagedCards.Getter filteredStatement

  @ManagedCards.Getter managedCard!: ManagedCardsSchemas.ManagedCard

  public fields = ['processedTimestamp', 'adjustment', 'balanceAfter']

  async asyncData({ store, route }) {
    const _cardId = route.params.id

    const _req: ManagedCardStatementRequest = {
      id: _cardId,
      request: {
        showFundMovementsOnly: true,
        orderByTimestamp: OrderType.DESC
      }
    }

    await store.dispatch('cards/getCardStatement', _req)
    await store.dispatch('cards/getManagedCard', _cardId)

    return { cardId: _cardId }
  }

  toggleModal() {
    this.$refs['card-modal'].toggle()
  }

  get isFrozen() {
    return Object.entries(this.managedCard.state.blockTypes).length > 0 || this.managedCard.state.destroyType !== ''
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
    const _accounts = await AccountsStore.Helpers.index(this.$store)

    if (_accounts.data.count === 1 && this.managedCard) {
      if (this.managedCard.balances.availableBalance && parseInt(this.managedCard.balances.availableBalance) > 0) {
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
      await ManagedCardsStore.Helpers.remove(this.$store, this.cardId)

      this.$router.push('/managed-cards')
    }
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
