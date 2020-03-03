<template>
  <div id="managedCard">
    <b-card :bg-variant="bgVariant" no-body class="border-0 cards-card shadow-hover-sm" :class="{'card-frozen': isFrozen}">
      <b-card-body class="card-body">
        <b-link :to="'/managed-cards/' + card.id.id + '/statement'">
          <b-container fluid class="p-0">
            <b-row>
              <b-col>
                <b-row>
                  <b-col>
                    <div class="card-number">•••• {{ card.cardNumberLastFour }}</div>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col>
                    <div class="card-name">
                      {{ card.nameOnCard }}
                    </div>
                  </b-col>
                </b-row>
              </b-col>
              <b-col class="text-right" cols="auto" v-if="!isFrozen">
                <b-img src="/img/mc_symbol.svg" width="50px" />
              </b-col>
            </b-row>

            <b-row align-v="end">
              <b-col cols="8" class="card-balance">
                {{ card.balances.availableBalance | weavr_currency(card.currency) }}
              </b-col>
              <b-col cols="4">
                <div class="card-expiry">
                  <div class="card-expiry-label">
                    EXP
                  </div>
                  <div class="card-expiry-value">
                    {{ card.expiryMmyy | expiryMmyy }}
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-container>
        </b-link>
      </b-card-body>
    </b-card>
    <b-row class="card-options">
      <b-col>
        <b-link @click="toggleFreeze" class="py-3 d-block text-decoration-none">
          <tempalte v-if="!isFrozen">
            <h6 class="m-0 small">
              Freeze card
            </h6>
            <p class="text-muted m-0 small">
              Tap again to unfreeze
            </p>
          </tempalte>
          <template v-else>
            <h6 class="m-0 small">
              Unfreeze card
            </h6>
          </template>
        </b-link>
      </b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'
import * as CardsStore from '~/store/modules/Cards'

@Component({
  components: {}
})
export default class WeavrCard extends VueWithRouter {
  @Prop() readonly card!: ManagedCardsSchemas.ManagedCard

  get bgVariant(): string {
    if (!this.isFrozen) {
      return 'card-purple'
    } else {
      return 'card-disabled'
    }
  }

  get isFrozen() {
    return Object.entries(this.card.state.blockTypes).length > 0 || this.card.state.destroyType !== ''
  }

  toggleFreeze() {
    if (this.isFrozen) {
      this.unfreezeCard()
    } else {
      this.freezeCard()
    }
  }

  freezeCard() {
    CardsStore.Helpers.freeze(this.$store, this.card.id.id).then(
      () => {
        CardsStore.Helpers.getCards(this.$store)
      },
      (err) => {
        const data = err.response.data
        const error = data.message ? data.message : data.errorCode
        this.$weavrToastError(error)
      }
    )
  }

  unfreezeCard() {
    CardsStore.Helpers.unfreeze(this.$store, this.card.id.id).then(
      () => {
        CardsStore.Helpers.getCards(this.$store)
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
