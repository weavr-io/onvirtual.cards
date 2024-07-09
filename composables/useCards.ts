import { useCsv } from '~/composables/useCsv'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { useCardsStore } from '~/store/cards'
import { ManagedCardsApi } from '~/plugins/weavr-multi/api/ManagedCardsApi'
import type { GetManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardStatementRequest'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common'

export const useCards = () => {
    const route = useRoute()
    const cardsStore = useCardsStore()
    const { downloadBlobToCsv } = useCsv()
    const { downloadStatement } = new ManagedCardsApi()

    const isManagedCards = computed(() => {
        if (route.matched[0].name) {
            return ['managed-cards', 'managed-cards-id-statements'].includes(
                String(route.matched[0].name),
            )
        }
        return false
    })

    const managedCard = computed(() => {
        return cardsStore?.cardState.managedCard
    })

    const cardId = computed(() => {
        return route.params.id
    })

    const cards = computed(() => {
        return cardsStore?.cardState.cards?.cards
    })

    const hasCards = computed(() => {
        return !!cards.value?.length
    })

    const cardsBalance = computed(() => {
        return cardsStore.totalAvailableBalance
    })

    const cardCurrency = computed(() => {
        return cardsStore.currency
    })

    const isCardActive = computed(() => {
        return (
            managedCard.value && managedCard.value.state.state === ManagedInstrumentStateEnum.ACTIVE
        )
    })

    const downloadAsCSV = async (params: {
        id: IDModel
        filters: GetManagedCardStatementRequest
    }) => {
        const response = await downloadStatement(params)
        downloadBlobToCsv(response)
    }

    return {
        isManagedCards,
        managedCard,
        cardId,
        cards,
        hasCards,
        cardsBalance,
        cardCurrency,
        isCardActive,
        downloadAsCSV,
    }
}
