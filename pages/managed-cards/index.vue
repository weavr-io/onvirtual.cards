<template>
  <div>
    <section>
      <b-container class="mb-5 mt-n4">
        <b-row align-v="center">
          <b-col>
            <b-form-checkbox
              v-if="showDestroyedSwitch"
              :checked="showDestroyed"
              name="check-button"
              switch
              @change="showDestroyedChanged"
            >
              <template v-if="showDestroyed"> Hide</template>
              <template v-else> Show</template>
              destroyed cards
            </b-form-checkbox>
          </b-col>
          <b-col class="text-right d-flex justify-content-end">
            <div v-b-tooltip.hover :title="identityVerificationMessage">
              <b-button to="/managed-cards/add" :disabled="!identityVerified" variant="border-primary">
                + add new card
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-container>
      <b-container v-if="!hasAlert" class="mt-5">
        <b-row v-if="$fetchState.pending">
          <b-col class="d-flex flex-column align-items-center">
            <div class="loader-spinner">
              <b-spinner />
            </div>
          </b-col>
        </b-row>
        <b-row v-else-if="hasCards" cols="1" cols-md="3">
          <b-col v-for="card in cards" :key="card.id">
            <weavr-card :card="card" class="mb-5" @blocked="$fetch" @unblocked="$fetch" />
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col class="py-5 text-center">
            <h4 class="font-weight-light">You have no cards.</h4>
            <h5 class="font-weight-lighter">
              Click
              <b-link to="/managed-cards/add"> add new card</b-link>
              to create your first card.
            </h5>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import CardsMixin from '~/mixins/CardsMixin'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import KyVerified from '~/mixins/kyVerified'

@Component({
  layout: 'dashboard',
  components: {
    WeavrCard: () => import('~/components/cards/card.vue'),
    KybAlert: () => import('~/components/corporates/KYBAlert.vue'),
  },
  middleware: ['kyVerified'],
})
export default class CardsPage extends mixins(BaseMixin, CardsMixin, KyVerified) {
  showDestroyedSwitch = false

  get showDestroyed() {
    return this.$route.query.showDestroyed === 'true'
  }

  get identityVerificationMessage() {
    if (!this.identityVerified) return 'Pending identity verification'
    return undefined
  }

  get cardStateFilters() {
    return this.showDestroyed ? [] : [ManagedInstrumentStateEnum.ACTIVE, ManagedInstrumentStateEnum.BLOCKED]
  }

  fetch() {
    return this.getCards(this.cardStateFilters).then(() => {
      return this.stores.cards.hasDestroyedCards().then((res) => {
        this.showDestroyedSwitch = res
      })
    })
  }

  async getCards(_state: ManagedInstrumentStateEnum[]) {
    await this.stores.cards.getCards({
      state: _state.join(','),
    })
  }

  async showDestroyedChanged(val) {
    await this.$router.push({
      path: this.$route.path,
      query: { showDestroyed: val },
    })

    const state = val ? [] : [ManagedInstrumentStateEnum.ACTIVE, ManagedInstrumentStateEnum.BLOCKED]

    await this.getCards(state)
  }
}
</script>
