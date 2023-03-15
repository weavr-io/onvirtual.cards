import { reactive, computed } from 'vue'
import { useCsv } from '~/composables/useCsv'
import { useBase } from '~/composables/useBase'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { GetManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardStatementRequest'

export function useCards(root) {
  const { downloadBlobToCsv } = useCsv()
  const { stores } = useBase(root)

  const isManagedCards = computed<boolean>(() => {
    if (root.$route.matched[0].name) {
      return ['managed-cards', 'managed-cards-id-statements'].includes(root.$route.matched[0].name)
    } else {
      return false
    }
  })

  const managedCard = computed(() => {
    return stores.cards.managedCard
  })

  const cardId = computed(() => {
    return root.$route.params.id
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
    const req = root.$apiMulti.managedCards.downloadStatement(params)

    req.then((res) => {
      downloadBlobToCsv(res.data)
    })
  }

  const unRefs = reactive({
    isManagedCards,
    managedCard,
    cardId,
    cards,
    hasCards,
    cardsBalance,
    cardCurrency,
    isCardActive,
  })

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
    unRefs,
  }
}
