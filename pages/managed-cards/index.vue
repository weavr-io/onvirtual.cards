<template>
  <section>
    <b-container class="mb-5">
      <b-row>
        <b-col class="text-right">
          <b-button to="/managed-cards/add" variant="border-primary">+ add new card</b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="mt-5">
      <b-row v-if="!hasCards">
        <b-col class="py-5 text-center">
          <h4 class="font-weight-light">You have no cards.</h4>
          <h5 class="font-weight-lighter">Click
            <b-link to="/managed-cards/add">add new card</b-link>
            to create your first card.
          </h5>
        </b-col>
      </b-row>
      <b-row v-if="hasCards" cols="1" cols-md="3">
        <b-col v-for="(card, key) in cards" :key="key">
          <weavr-card no-body class="mb-3" :card="card"></weavr-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CardsStore from '~/store/modules/Cards'

const Cards = namespace(CardsStore.name)

@Component({
  layout: 'dashboard',
  components: {
    WeavrCard: () => import('~/components/cards/card.vue')
  }
})
export default class CardsPage extends VueWithRouter {
  @Cards.Getter cards

  asyncData({ store }) {
    return store.dispatch('cards/getCards')
  }

  get hasCards(): boolean {
    return this.cards.length > 0
  }
}
</script>
