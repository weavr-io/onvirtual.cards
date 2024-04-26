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
                                :disabled="!identityVerified"
                                to="/managed-cards/add"
                                variant="border-primary"
                            >
                                + add new card
                            </b-button>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
            <b-container v-if="!hasAlert" class="mt-5">
                <b-row v-if="pendingDataOrError">
                    <b-col>
                        <LoadingSpinner center show />
                    </b-col>
                </b-row>
                <b-row v-else-if="hasCards" cols="1" cols-lg="3" cols-md="2">
                    <b-col v-for="card in cards" :key="card.id">
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
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import CardsMixin from '~/mixins/CardsMixin'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import KyVerified from '~/mixins/kyVerified'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'

@Component({
    layout: 'dashboard',
    components: {
        LoadingSpinner,
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
        return this.showDestroyed
            ? []
            : [ManagedInstrumentStateEnum.ACTIVE, ManagedInstrumentStateEnum.BLOCKED]
    }

    fetch() {
        return this.getCards(this.cardStateFilters).then(() => {
            return this.cardsStore.hasDestroyedCards().then((res) => {
                this.showDestroyedSwitch = res
            })
        })
    }

    async getCards(_state: ManagedInstrumentStateEnum[]) {
        await this.cardsStore.getCards({
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
