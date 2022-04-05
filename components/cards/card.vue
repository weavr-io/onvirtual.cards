<template>
  <div id="managedCard">
    <b-card
      :bg-variant="bgVariant"
      :class="{ 'card-frozen': isBlocked }"
      no-body
      class="border-0 cards-card shadow-hover-sm"
    >
      <b-card-body class="card-body onvirtual-card">
        <b-aspect :aspect="'1.6:1'" class="overflow-hidden">
          <b-link :to="statementsLink">
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
          <b-button v-if="!isDestroyed" class="card-options-button" @click="toggleShowOptions">
            <b-icon icon="three-dots-vertical" />
          </b-button>
        </b-aspect>
      </b-card-body>
    </b-card>
    <b-row v-if="showOptions && !isDestroyed" class="card-options">
      <b-col>
        <b-link class="mt-3 py-2 d-block text-decoration-none" @click="toggleBlock">
          <b-row align-v="center">
            <b-col cols="auto">
              <b-img fluid src="/img/freeze-icon.svg" />
            </b-col>
            <b-col>
              <h6 class="m-0 small">
                <template v-if="!isBlocked">
                  Freeze card
                </template>
                <template v-else>
                  Unfreeze card
                </template>
              </h6>
              <p v-if="!isBlocked" class="text-muted m-0 small">
                Tap again to unfreeze
              </p>
            </b-col>
          </b-row>
        </b-link>
        <b-link :to="editLink" class="py-2 d-block text-decoration-none">
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
import { Component, Emit, mixins, Prop } from 'nuxt-property-decorator'
import { BIcon, BIconThreeDotsVertical } from 'bootstrap-vue'
import BaseMixin from '~/mixins/BaseMixin'
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
    return this.isActive ? 'card' : 'card-disabled'
  }

  get isBlocked() {
    return this.card.state.state === ManagedInstrumentStateEnum.BLOCKED
  }

  get isActive() {
    return this.card.state.state === ManagedInstrumentStateEnum.ACTIVE
  }

  get isDestroyed() {
    return this.card.state.state === ManagedInstrumentStateEnum.DESTROYED
  }

  get editLink() {
    if (!this.card) return undefined
    return `/managed-cards/${this.card.id}/edit`
  }

  get statementsLink() {
    if (!this.card) return undefined
    return `/managed-cards/${this.card.id}/statements`
  }

  toggleBlock() {
    if (this.isBlocked) {
      this.unblockCard()
    } else {
      this.blockCard()
    }
  }

  blockCard() {
    this.stores.cards
      .block(this.card.id)
      .then(this.blocked)
      .catch((err) => {
        const data = err.response.data
        const error = data.message ? data.message : data.errorCode
        this.$weavrToastError(error)
      })
  }

  unblockCard() {
    this.stores.cards
      .unblock(this.card.id)
      .then(this.unblocked)
      .catch((err) => {
        const data = err.response.data
        const error = data.message ? data.message : data.errorCode
        this.$weavrToastError(error)
      })
  }

  toggleShowOptions() {
    this.showOptions = !this.showOptions
  }

  @Emit('blocked')
  blocked() {}

  @Emit('unblocked')
  unblocked() {}
}
</script>
