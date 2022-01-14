<template>
  <div id="managedCard">
    <b-card
      :bg-variant="bgVariant"
      :class="{ 'card-frozen': isFrozen }"
      no-body
      class="border-0 cards-card shadow-hover-sm"
    >
      <b-card-body class="card-body onvirtual-card">
        <b-aspect :aspect="'1.6:1'" class="overflow-hidden">
          <b-link :to="'/managed-cards/' + card.id.id + '/statements'">
            <b-container fluid class="p-0">
              <b-row>
                <b-col class="card-balance text-right">
                  {{ card.balances.availableBalance | weavr_currency(card.currency) }}
                </b-col>
              </b-row>
              <b-row class="mt-3 mb-3">
                <b-col>
                  <b-row>
                    <b-col>
                      <div class="card-name text-truncate">
                        {{ card.friendlyName }}
                      </div>
                    </b-col>
                  </b-row>
                  <b-row class="mt-2">
                    <b-col>
                      <div class="card-number">•••• {{ card.cardNumberLastFour }}</div>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row align-v="end">
                <b-col cols="6">
                  <div class="card-name-on-card text-truncate ">
                    {{ card.nameOnCard }}
                  </div>
                </b-col>
                <b-col cols="3">
                  <div class="card-expiry">
                    <div class="card-expiry-label">
                      EXP
                    </div>
                    <div class="card-expiry-value">
                      {{ card.expiryMmyy | expiryMmyy }}
                    </div>
                  </div>
                </b-col>
                <b-col cols="2" class="text-right">
                  <b-img src="/img/mc_symbol.svg" width="50px" />
                </b-col>
              </b-row>
            </b-container>
          </b-link>
          <b-button v-if="isActive" class="card-options-button" @click="toggleShowOptions">
            <b-icon icon="three-dots-vertical" />
          </b-button>
        </b-aspect>
      </b-card-body>
    </b-card>
    <b-row v-if="showOptions && isActive" class="card-options">
      <b-col>
        <b-link class="mt-3 py-2 d-block text-decoration-none" @click="toggleFreeze">
          <b-row align-v="center">
            <b-col cols="auto">
              <b-img fluid src="/img/freeze-icon.svg" />
            </b-col>
            <b-col>
              <h6 class="m-0 small">
                <template v-if="!isFrozen">
                  Freeze card
                </template>
                <template v-else>
                  Unfreeze card
                </template>
              </h6>
              <p v-if="!isFrozen" class="text-muted m-0 small">
                Tap again to unfreeze
              </p>
            </b-col>
          </b-row>
        </b-link>
        <b-link :to="'/managed-cards/' + card.id.id + '/edit'" class="py-2 d-block text-decoration-none">
          <b-row align-v="center">
            <b-col cols="auto">
              <b-img fluid src="/img/edit-icon.svg" />
            </b-col>
            <b-col>
              <h6 class="m-0 small">
                Edit card
              </h6>
              <p class="text-muted m-0 small">
                Change name and other details
              </p>
            </b-col>
          </b-row>
        </b-link>
      </b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { BIcon, BIconThreeDotsVertical } from 'bootstrap-vue'
import BaseMixin from '~/minixs/BaseMixin'
import { ManagedCardModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'

@Component({
  components: {
    BIcon,
    BIconThreeDotsVertical
  }
})
export default class WeavrCard extends mixins(BaseMixin) {
  @Prop() readonly card!: ManagedCardModel

  showOptions: boolean = false

  get bgVariant(): string {
    if (!this.isFrozen) {
      return 'card'
    } else {
      return 'card-disabled'
    }
  }

  get isFrozen() {
    return false
    // return Object.entries(this.card.state.state.blockTypes).length > 0 || this.card.state.destroyType !== ''
  }

  get isActive() {
    return this.card.state.state === ManagedInstrumentStateEnum.ACTIVE
  }

  toggleFreeze() {
    if (this.isFrozen) {
      this.unfreezeCard()
    } else {
      this.freezeCard()
    }
  }

  getCards() {
    return this.$router.push({
      path: this.$route.path,
      query: { ...this.$route.query, u: new Date().getTime() + '' }
    })
  }

  freezeCard() {
    this.stores.cards.freeze(this.card.id).then(
      () => {
        this.getCards()
      },
      (err) => {
        const data = err.response.data
        const error = data.message ? data.message : data.errorCode
        this.$weavrToastError(error)
      }
    )
  }

  unfreezeCard() {
    this.stores.cards.unfreeze(this.card.id).then(
      () => {
        this.getCards()
      },
      (err) => {
        const data = err.response.data
        const error = data.message ? data.message : data.errorCode
        this.$weavrToastError(error)
      }
    )
  }

  toggleShowOptions() {
    this.showOptions = !this.showOptions
  }
}
</script>
