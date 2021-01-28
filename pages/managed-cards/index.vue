<template>
  <div>
    <section>
      <b-container class="mb-5 mt-n4">
        <b-row align-v="center">
          <b-col>
            <b-form-checkbox
              v-model="showDeleted"
              v-if="showDeletedSwitch"
              name="check-button"
              switch
            >
              <template v-if="showDeleted">
                Hide
              </template>
              <template v-else>
                Show
              </template>
              deleted cards
            </b-form-checkbox>
          </b-col>
          <b-col v-if="canAddCard" class="text-right">
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
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import { KYBState } from '~/api/Enums/KYBState'
import * as ViewStore from '~/store/modules/View'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
import BaseMixin from '~/minixs/BaseMixin'
import { cardsStore, corporatesStore } from '~/utils/store-accessor'
import { NullableBoolean } from '~/api/Generic/NullableBoolean'
import { $api } from '~/utils/api'

const View = namespace(ViewStore.name)

@Component({
  layout: 'dashboard',
  watchQuery: true,
  components: {
    WeavrCard: () => import('~/components/cards/card.vue'),
    KybAlert: () => import('~/components/corporates/KYBAlert.vue')
  }
})
export default class CardsPage extends mixins(BaseMixin) {
  get corporate() {
    return this.stores.corporates.corporate
  }

  get cards() {
    return this.stores.cards.cards
  }

  @View.Getter hasAlert!: boolean

  public showDeleted: boolean = false

  public showDeletedSwitch: boolean = false

  async asyncData({ store, route }) {
    if (AuthStore.Helpers.isConsumer(store)) {
      const _consumerId = AuthStore.Helpers.identityId(store)
      if (_consumerId) {
        await ConsumersStore.Helpers.get(store, _consumerId)
      }
    } else {
      const _corporateId = AuthStore.Helpers.identityId(store)
      if (_corporateId) {
        await corporatesStore(store).getCorporateDetails(_corporateId)
      }
    }

    let _active: NullableBoolean = NullableBoolean.NULL

    if (route.query.showDeleted) {
      _active = NullableBoolean.FALSE
    } else {
      _active = NullableBoolean.TRUE
    }

    await cardsStore(store).getCards({
      paging: {
        offset: 0,
        limit: 0
      },
      active: _active
    })

    const _showDeletedSwitch = await $api.post('/app/api/managed_cards/get', {
      paging: {
        offset: 0,
        limit: 1
      },
      active: NullableBoolean.FALSE
    })

    return {
      showDeleted: route.query.showDeleted,
      showDeletedSwitch: _showDeletedSwitch.data.count > 0
    }
  }

  @Watch('showDeleted')
  showDeletedChanged(val) {
    this.showDeleted = val
    this.$router.push({ path: this.$route.path, query: { showDeleted: val } })
  }

  get hasCards(): boolean {
    return this.cards.length > 0
  }

  get showKybAlert(): boolean {
    if (this.stores.corporates.kyb) {
      return (
        this.stores.corporates.kyb.fullCompanyChecksVerified !==
        KYBState.APPROVED
      )
    } else {
      return false
    }
  }

  get canAddCard(): boolean {
    if (AuthStore.Helpers.isConsumer(this.$store)) {
      return (
        ConsumersStore.Helpers.consumer(this.$store)?.kyc?.fullDueDiligence ===
        FullDueDiligence.APPROVED
      )
    } else {
      return (
        this.stores.corporates.kyb?.fullCompanyChecksVerified ===
        KYBState.APPROVED
      )
    }
  }
}
</script>
