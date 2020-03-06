<template>
  <div id="managedCard">
    <b-card
      :bg-variant="bgVariant"
      :class="{ 'card-frozen': isFrozen }"
      no-body
      class="border-0 cards-card shadow-hover-sm"
    >
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
              <b-col v-if="!isFrozen" class="text-right" cols="auto">
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
        <b-link @click="toggleFreeze" class="mt-3 py-2 d-block text-decoration-none">
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
              <p class="text-muted m-0 small" v-if="!isFrozen">
                Tap again to unfreeze
              </p>
            </b-col>
          </b-row>
        </b-link>
        <b-link class="py-2 d-block text-decoration-none" :to="'/managed-cards/' + card.id.id + '/edit'">
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
