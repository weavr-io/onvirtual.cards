<template>
    <div>
        <section>
            <b-container class="mb-5">
                <b-row align-v="end">
                    <b-col class="pr-0" cols="auto">
                        <div v-if="showDestroyedSwitch" class="d-flex align-items-center">
                            <b-form-checkbox
                                :checked="showDestroyed"
                                name="check-button"
                                switch
                                @change="showDestroyedChanged"
                            />
                            <template v-if="showDestroyed">Hide</template>
                            <template v-else>Show</template>
                            destroyed cards
                        </div>
                    </b-col>
                    <b-col class="text-right d-flex justify-content-end pl-0">
                        <div v-b-tooltip.hover :title="identityVerificationMessage">
                            <b-button
                                :disabled="!base.unRefs.identityVerified"
                                to="/managed-cards/add"
                                variant="border-primary"
                            >
                                + add new card
                            </b-button>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
            <b-container v-if="!kyVerified.unRefs.hasAlert" class="mt-5">
                <b-row v-if="base.unRefs.pendingDataOrError">
                    <b-col class="d-flex flex-column align-items-center">
                        <div class="loader-spinner">
                            <b-spinner />
                        </div>
                    </b-col>
                </b-row>
                <b-row v-else-if="cards.unRefs.hasCards" cols="1" cols-lg="3" cols-md="2">
                    <b-col v-for="card in cards.unRefs.cards" :key="card.id">
                        <weavr-card
                            :card="card"
                            class="mb-5"
                            @blocked="$fetch"
                            @unblocked="$fetch"
                        />
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
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { useBase } from '~/composables/useBase'
import { useKyVerified } from '~/composables/useKyVerified'
import { useCards } from '~/composables/useCards'

@Component({
    layout: 'dashboard',
    components: {
        WeavrCard: () => import('~/components/cards/card.vue'),
        KybAlert: () => import('~/components/corporates/KYBAlert.vue'),
    },
    middleware: ['kyVerified'],
})
export default class CardsPage extends Vue {
    base = useBase(this)
    kyVerified = useKyVerified(this)
    cards = useCards(this)

    showDestroyedSwitch = false

    get showDestroyed() {
        return this.$route.query.showDestroyed === 'true'
    }

    get identityVerificationMessage() {
        if (!this.base.unRefs.identityVerified) return 'Pending identity verification'
        return undefined
    }

    get cardStateFilters() {
        return this.showDestroyed
            ? []
            : [ManagedInstrumentStateEnum.ACTIVE, ManagedInstrumentStateEnum.BLOCKED]
    }

    fetch() {
        return this.getCards(this.cardStateFilters).then(() => {
            return this.base.stores.cards.hasDestroyedCards().then((res) => {
                this.showDestroyedSwitch = res
            })
        })
    }

    async getCards(_state: ManagedInstrumentStateEnum[]) {
        await this.base.stores.cards.getCards({
            state: _state.join(','),
        })
    }

    async showDestroyedChanged(val) {
        await this.$router.push({
            path: this.$route.path,
            query: { showDestroyed: val },
        })

        const state = val
            ? []
            : [ManagedInstrumentStateEnum.ACTIVE, ManagedInstrumentStateEnum.BLOCKED]

        await this.getCards(state).catch(() => {})
    }
}
</script>
