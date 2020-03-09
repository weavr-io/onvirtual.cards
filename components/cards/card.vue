<template>
  <div id="managedCard">
    <b-card
      :bg-variant="bgVariant"
      :class="{ 'card-frozen': isFrozen }"
      no-body
      class="border-0 cards-card shadow-hover-sm"
    >
      <b-card-body class="card-body onvirtual-card">
        <b-link :to="'/managed-cards/' + card.id.id + '/statement'">
          <b-container fluid class="p-0">
            <b-row>
              <b-col class="card-balance text-right">
                {{ card.balances.availableBalance | weavr_currency(card.currency) }}
              </b-col>
            </b-row>
            <b-row class="mt-5 mb-4">
              <b-col>
                <b-row>
                  <b-col>
                    <div class="card-name text-nowrap">
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
                <div class="card-name-on-card text-nowrap ">
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
        <b-button class="card-options-button" @click="toggleShowOptions">
          <b-icon icon="three-dots-vertical"/>
        </b-button>
      </b-card-body>
    </b-card>
    <b-row class="card-options" v-if="showOptions">
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
import { BIcon, BIconThreeDotsVertical } from 'bootstrap-vue'
import * as CardsStore from '~/store/modules/Cards'

@Component({
  components: {
    BIcon,
    BIconThreeDotsVertical
  }
})
export default class WeavrCard extends VueWithRouter {
  @Prop() readonly card!: ManagedCardsSchemas.ManagedCard

  showOptions: boolean = false

  get bgVariant(): string {
    if (!this.isFrozen) {
      return 'card'
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

  toggleShowOptions(){
    this.showOptions = !this.showOptions
  }
}
</script>
