<template>
  <section>
    <b-container>
      <b-row v-if="managedCard" align-v="end" class="mb-5 border-bottom pb-3">
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
        <b-col cols="2" lg="1" class="text-right">
          <b-button
            v-if="managedCard.active && !isFrozen"
            variant="primary"
            class="add-funds"
            :to="'/transfer?destination=' + managedCard.id.id"
          >
            +
          </b-button>
        </b-col>
        <b-col cols="2" lg="2">
          <div class="card-balance">
            <div class="card-balance-label text-muted">
              balance
            </div>
            <div class="card-balance-value">
              {{ managedCard.balances.availableBalance | weavr_currency(managedCard.currency) }}
            </div>
          </div>
        </b-col>
        <b-col cols="1" lg="1" class="text-right">
          <b-dropdown variant="link" toggle-class="text-decoration-none" no-caret>
            <template v-slot:button-content>
              <b-icon icon="three-dots-vertical" />
            </template>
            <b-dropdown-item v-if="!isFrozen" @click="freezeCard">
              Freeze Card
            </b-dropdown-item>
            <b-dropdown-item v-if="isFrozen" @click="unfreezeCard">
              Unfreeze Card
            </b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
      <b-row class="mb-5" align-v="center">
        <b-col>
          <h6 class="font-weight-lighter">
            All Transactions
          </h6>
        </b-col>
        <b-col class="text-right">
          <!--          <b-button-->
          <!--            v-if="managedCard && managedCard.active"-->
          <!--            variant="link"-->
          <!--            class="px-0"-->
          <!--            @click="deleteCard"-->
          <!--          >-->
          <!--            delete card-->
          <!--          </b-button>-->
        </b-col>
      </b-row>

      <b-row v-if="filteredStatement">
        <b-col>
          <b-row v-for="(item, key) in filteredStatement" :key="key">
            <b-col>
              <statement-item :transaction="item" />
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
        <b-card-body class="card-body-modal">
          <b-link :to="'/managed-cards/' + managedCard.id.id + '/statement'">
            <b-container fluid class="p-0">
              <b-row>
                <b-col>
                  <b-row>
                    <b-col>
                      <div class="card-number">
                        <weavr-span
                          class="card-select-number"
                          field="cardNumber"
                          :token="managedCard.cardNumber"
                          :base-style="{
                            fontFamily: '\'Be Vietnam\', sans-serif',
                            color: '#000',
                            lineHeight: '1',
                            fontSize: '20px'
                          }"
                        />
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <div class="card-name">
                        {{ managedCard.nameOnCard }}
                      </div>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col class="text-right">
                  <b-img src="/img/mc_symbol.svg" width="50px" />
                </b-col>
              </b-row>
              <b-row align-v="end">
                <b-col cols="6" />
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
                        class="card-select-number"
                        field="cvv"
                        :token="managedCard.cvv"
                        :base-style="{
                          fontFamily: '\'Be Vietnam\', sans-serif',
                          color: '#000',
                          lineHeight: '25px',
                          fontSize: '25px'
                        }"
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
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'
import { Schemas } from '~/api/Schemas'
import OrderType = Schemas.OrderType

const ManagedCards = namespace(ManagedCardsStore.name)

@Component({
  components: {
    StatementItem: () => import('~/components/cards/statement/item.vue'),
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

  @ManagedCards.Getter managedCard

  @ManagedCards.Action destroyManagedCard

  @ManagedCards.Action freeze

  @ManagedCards.Action unfreeze

  public fields = ['processedTimestamp', 'adjustment', 'balanceAfter']

  async asyncData({ store, route }) {
    const _cardId = route.params.id

    const _req: ManagedCardsSchemas.GetManagedCardStatementRequest = {
      id: _cardId,
      request: {
        showFundMovementsOnly: true,
        orderByTimestamp: OrderType.ASC
      }
    }

    await store.dispatch('cards/getCardStatement', _req)
    await store.dispatch('cards/getManagedCard', _cardId)

    return { cardId: _cardId }
  }

  toggleModal() {
    this.$refs['card-modal'].toggle()
  }

  freezeCard() {
    this.freeze(this.cardId).then(
      () => {
        this.$weavrToast('Card Frozen')
      },
      (err) => {
        const data = err.response.data
        const error = data.message ? data.message : data.errorCode
        this.$weavrToastError(error)
      }
    )
  }

  unfreezeCard() {
    this.unfreeze(this.cardId).then(
      () => {
        this.$weavrToast('Card Unfrozen')
      },
      (err) => {
        const data = err.response.data
        const error = data.message ? data.message : data.errorCode
        this.$weavrToastError(error)
      }
    )
  }

  get isFrozen() {
    return Object.entries(this.managedCard.state.blockTypes).length > 0 || this.managedCard.state.destroyType !== ''
  }

  deleteCard() {
    const _req: ManagedCardsSchemas.DestroyRequest = {
      id: this.cardId,
      body: {
        destroyType: 'Final'
      }
    }

    this.destroyManagedCard(_req).then(
      () => {
        this.$router.push('/managed-cards')
      },
      (err) => {
        const data = err.response.data
        const error = data.message ? data.message : data.errorCode
        this.$weavrToastError(error)
      }
    )
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
  background: #c3b5ff;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  display: block;
  font-size: 0.6rem;
}

.card-body-modal {
  .card {
    &-name {
      font-size: 2rem;
      padding: 40px 0;
    }

    &-balance,
    &-expiry-value,
    &-cvv-value {
      font-size: 25px;
      line-height: 25px;
    }
  }
}
</style>
