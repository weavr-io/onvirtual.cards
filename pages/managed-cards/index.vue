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
import {
    computed,
    defineComponent,
    ref,
    useFetch,
    useRoute,
    useRouter,
} from '@nuxtjs/composition-api'
import WeavrCard from '~/components/cards/card.vue'
import { useBase } from '~/composables/useBase'
import { useCards } from '~/composables/useCards'
import { useKyVerified } from '~/composables/useKyVerified'
import { useStores } from '~/composables/useStores'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'

export default defineComponent({
    components: {
        WeavrCard,
        LoadingSpinner,
    },
    layout: 'dashboard',
    middleware: 'kyVerified',
    setup() {
        const route = useRoute()
        const router = useRouter()
        const { identityVerified, pendingDataOrError } = useBase()
        const { hasAlert } = useKyVerified()
        const { cards, hasCards } = useCards()
        const { cards: cardsStore } = useStores(['cards'])

        const showDestroyedSwitch = ref(false)

        const showDestroyed = computed(() => {
            return route.value.query.showDestroyed === 'true'
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

        useFetch(() => {
            return getCards(cardStateFilters.value).then(() => {
                return cardsStore?.hasDestroyedCards().then((res) => {
                    showDestroyedSwitch.value = res
                })
            })
        })

        const getCards = async (_state: ManagedInstrumentStateEnum[]) => {
            await cardsStore?.getCards({
                state: _state.join(','),
            })
        }

        const showDestroyedChanged = async (val) => {
            await router.push({
                path: route.value.path,
                query: { showDestroyed: val },
            })

            const state = val
                ? []
                : [ManagedInstrumentStateEnum.ACTIVE, ManagedInstrumentStateEnum.BLOCKED]

            await getCards(state).catch(() => {})
        }

        return {
            showDestroyedSwitch,
            showDestroyed,
            showDestroyedChanged,
            identityVerificationMessage,
            identityVerified,
            hasAlert,
            pendingDataOrError,
            cards,
            hasCards,
        }
    },
})
</script>
