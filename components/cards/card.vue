<template>
  <b-card no-body class="border-0 cards-card shadow-hover-sm" :bg-variant="bgVariant">
    <b-card-body class="card-body">
      <b-link :to="'/managed-cards/' + card.id.id + '/statement'">
        <b-container fluid class="p-0">
          <b-row>
            <b-col>
              <b-row>
                <b-col>
                  <div class="card-number">•••• {{card.cardNumberLastFour}}</div>
                </b-col>
              </b-row>

              <b-row>
                <b-col>
                  <div class="card-name">{{card.nameOnCard}}</div>
                </b-col>
              </b-row>
            </b-col>
            <b-col class="text-right">
              <b-img src="/img/mc_symbol.svg" width="50px" />
            </b-col>
          </b-row>

          <b-row align-v="end">
            <b-col
              cols="8"
              class="card-balance"
            >{{ card.balances.availableBalance | weavr_currency(card.currency)}}</b-col>
            <b-col cols="4">
              <div class="card-expiry">
                <div class="card-expiry-label">EXP</div>
                <div class="card-expiry-value">{{card.expiryMmyy|expiryMmyy}}</div>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-link>
    </b-card-body>
  </b-card>
</template>
<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'

@Component({
  components: {}
})
export default class WeavrCard extends VueWithRouter {
  @Prop() readonly card!: any

  get bgVariant(): string {
    if (this.card.active) {
      return 'card-purple'
    } else {
      return 'card-disabled'
    }
  }
}
</script>
