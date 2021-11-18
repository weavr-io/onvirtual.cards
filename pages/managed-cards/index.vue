<template>
  <div>
    <section>
      <b-container class="mb-5 mt-n4">
        <b-row align-v="center">
          <b-col>
            <b-form-checkbox v-if="showDeletedSwitch" v-model="showDeleted" name="check-button" switch>
              <template v-if="showDeleted">
                Hide
              </template>
              <template v-else>
                Show
              </template>
              deleted cards
            </b-form-checkbox>
          </b-col>
          <b-col v-if="identityVerified" class="text-right">
            <b-button to="/managed-cards/add" variant="border-primary">
              + add new card
            </b-button>
          </b-col>
        </b-row>
      </b-container>
      <b-container v-if="!hasAlert" class="mt-5">
        <b-row v-if="hasCards" cols="1" cols-md="3">
          <b-col v-for="(card, key) in cards" :key="key">
            <weavr-card :card="card" no-body class="mb-5" />
          </b-col>
        </b-row>
        <b-row v-else>
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
      </b-container>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Watch } from 'nuxt-property-decorator'

import BaseMixin from '~/minixs/BaseMixin'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import CardsMixin from '~/minixs/CardsMixin'

@Component({
  layout: 'dashboard',
  watchQuery: true,
  components: {
    WeavrCard: () => import('~/components/cards/card.vue'),
    KybAlert: () => import('~/components/corporates/KYBAlert.vue')
  }
})
export default class CardsPage extends mixins(BaseMixin, CardsMixin) {
  public showDeleted: boolean = false

  public showDeletedSwitch: boolean = false

  get hasAlert() {
    return this.stores.view.hasAlert
  }

  // async asyncData({ store, route }) {
  // if (route.query.showDeleted) {
  //   _active = NullableBoolean.FALSE
  // } else {
  //   _active = NullableBoolean.TRUE
  // }
  //
  // await cardsStore(store).getCards({
  //   paging: {
  //     offset: 0,
  //     limit: 0
  //   },
  //   active: _active
  // })
  //
  // const _showDeletedSwitch = await $api.post('/app/api/managed_cards/get', {
  //   paging: {
  //     offset: 0,
  //     limit: 1
  //   },
  //   active: NullableBoolean.FALSE
  // })
  //
  // return {
  //   showDeleted: route.query.showDeleted,
  //   showDeletedSwitch: _showDeletedSwitch.data.count > 0
  // }
  // }

  fetch() {
    return this.stores.cards.getCards()
  }

  @Watch('showDeleted')
  showDeletedChanged(val) {
    this.showDeleted = val
    this.$router.push({
      path: this.$route.path,
      query: { showDeleted: val }
    })
  }

  get showKybAlert(): boolean {
    if (this.stores.corporates.kyb) {
      return this.stores.corporates.kyb.kybStatus !== KYBStatusEnum.APPROVED
    } else {
      return false
    }
  }
}
</script>
