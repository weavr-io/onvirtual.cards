<template>
    <div>
        <section>
            <b-container class="mb-5">
                <b-row align-v="end">
                    <b-col class="pe-0" cols="auto">
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
                    <b-col class="text-right d-flex justify-content-end ps-0">
                        <div v-b-tooltip.hover :title="identityVerificationMessage">
                            <b-button
                                :disabled="!identityVerified"
                                to="/managed-cards/add"
                                class="btn-border-primary bg-transparent"
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
                            @blocked="getAndShowCards"
                            @unblocked="getAndShowCards"
                        />
                    </b-col>
                </b-row>
                <b-row v-else>
                    <b-col class="py-5 text-center">
                        <h4 class="fw-light">You have no cards.</h4>
                        <h5 class="fw-lighter">
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

<script lang="ts" setup>
import { useBase } from '~/composables/useBase'
import { useCards } from '~/composables/useCards'
import { useKyVerified } from '~/composables/useKyVerified'
import { useGlobalAsyncData } from '~/composables/useGlobalAsyncData'
import { useStores } from '~/composables/useStores'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
import WeavrCard from '~/components/organisms/cards/CardComponent.vue'

definePageMeta({
    layout: 'dashboard',
    middleware: 'ky-verified',
})

const route = useRoute()
const router = useRouter()
const { identityVerified } = useBase()
const { hasAlert } = useKyVerified()
const { cards, hasCards } = useCards()
const { cards: cardsStore } = useStores(['cards'])

const showDestroyedSwitch = ref(false)

const showDestroyed = computed(() => {
    return route.query.showDestroyed === 'true'
})

const identityVerificationMessage = computed(() => {
    if (!identityVerified) return 'Pending identity verification'

    return undefined
})

const cardStateFilters = computed(() => {
    return showDestroyed.value
        ? []
        : [ManagedInstrumentStateEnum.ACTIVE, ManagedInstrumentStateEnum.BLOCKED]
})

const getCards = async (_state: ManagedInstrumentStateEnum[]) => {
    await cardsStore?.getCards({
        state: _state.join(','),
    })
}

const getAndShowCards = async () => {
    try {
        await getCards(cardStateFilters.value)

        const hasDestroyed = await cardsStore?.hasDestroyedCards()
        showDestroyedSwitch.value = !!hasDestroyed
    } catch (e) {
        throw new Error('Error finding cards')
    }
}

const { pendingDataOrError } = await useGlobalAsyncData('getAndShowCards', async () => {
    await getAndShowCards()
})

const showDestroyedChanged = async (val) => {
    const status = val.target.checked

    await router.push({
        path: route.path,
        query: { showDestroyed: status },
    })

    const state = status
        ? []
        : [ManagedInstrumentStateEnum.ACTIVE, ManagedInstrumentStateEnum.BLOCKED]

    await getCards(state).catch(() => {})
}
</script>
