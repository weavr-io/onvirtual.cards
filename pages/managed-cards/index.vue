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
      <b-row>
        <b-col>
          <b-card-group columns v-if="cards">
            <weavr-card v-for="(card, key) in cards" :key="key" no-body class="mb-3" :card="card"></weavr-card>
          </b-card-group>
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
}
</script>
