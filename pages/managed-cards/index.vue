<template>
  <div>
    <section>
      <b-container class="mb-5 mt-n4">
        <b-row>
          <b-col class="text-right">
            <b-button to="/managed-cards/add" variant="border-primary">
              + add new card
            </b-button>
          </b-col>
        </b-row>
      </b-container>
      <b-container v-if="!hasAlert" class="mt-5">
        <b-row v-if="!hasCards">
          <b-col class="py-5 text-center">
            <h4 class="font-weight-light">
              You have no cards.
            </h4>
            <h5 class="font-weight-lighter">
              Click
              <b-link to="/managed-cards/add">
                add new card
              </b-link>
              to create your first card.
            </h5>
          </b-col>
        </b-row>
        <b-row v-if="hasCards" cols="1" cols-md="3">
          <b-col v-for="(card, key) in cards" :key="key">
            <weavr-card :card="card" no-body class="mb-5" />
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CardsStore from '~/store/modules/Cards'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import * as CorporatesStore from '~/store/modules/Corporates'
import { KYBState } from '~/api/Enums/KYBState'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import * as ViewStore from '~/store/modules/View'

const Cards = namespace(CardsStore.name)
const Corporates = namespace(CorporatesStore.name)
const View = namespace(ViewStore.name)

@Component({
  layout: 'dashboard',
  components: {
    WeavrCard: () => import('~/components/cards/card.vue'),
    KybAlert: () => import('~/components/corporates/KYBAlert.vue')
  }
})
export default class CardsPage extends VueWithRouter {
  @Corporates.Getter corporate!: CorporatesSchemas.Corporate | null

  @Cards.Getter cards

  @View.Getter hasAlert!: boolean

  async asyncData({ store }) {
    if (AuthStore.Helpers.isConsumer(store)) {
      const _consumerId = AuthStore.Helpers.identityId(store)
      if (_consumerId) {
        await ConsumersStore.Helpers.get(store, _consumerId)
      }
    } else {
      const _corporateId = AuthStore.Helpers.identityId(store)
      if (_corporateId) {
        await CorporatesStore.Helpers.getCorporateDetails(store, _corporateId)
      }
    }

    await CardsStore.Helpers.getCards(store)
  }

  get hasCards(): boolean {
    return this.cards.length > 0
  }

  get showKybAlert(): boolean {
    if (this.corporate && this.corporate.kyb) {
      return this.corporate.kyb.fullCompanyChecksVerified !== KYBState.APPROVED
    } else {
      return false
    }
  }
}
</script>
