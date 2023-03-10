import { useCsv } from '~/composables/useCsv'
import { useBase } from '~/composables/useBase'
import { computed } from '~/node_modules/vue'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { GetManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardStatementRequest'
import weavrMultiPlugin from '~/plugins/weavr-multi'
import { ApiModule } from '~/plugins/weavr-multi/api/ApiModule'

export function useCards() {
  const { downloadBlobToCsv } = useCsv()
  const { stores, router } = useBase()

  const isManagedCards = computed<boolean>(() => {
    if (router.matched[0].name) {
      return ['managed-cards', 'managed-cards-id-statements'].includes(router.matched[0].name)
    } else {
      return false
    }
  })

  const managedCard = computed(() => {
    return stores.cards.managedCard
  })

  const cardId = computed(() => {
    return router.params.id
  })

  const cards = computed(() => {
    return stores.cards.cards?.cards
  })

  const hasCards = computed(() => {
    return !!cards.value?.length
  })

  const cardsBalance = computed(() => {
    return stores.cards.totalAvailableBalance
  })

  const cardCurrency = computed(() => {
    return stores.cards
  })

  const isCardActive = computed(() => {
    return managedCard.value && managedCard.value.state.state === ManagedInstrumentStateEnum.ACTIVE
  })

  function downloadAsCSV(params: { id: IDModel; filters: GetManagedCardStatementRequest }) {
    const req = ApiModule.managedCards.downloadStatement(params)

    req.then((res) => {
      downloadBlobToCsv(res.data)
    })
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
