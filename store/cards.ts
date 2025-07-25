import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { DateTime } from 'luxon'
import { computed } from '@nuxtjs/composition-api'
import type { Cards as CardState } from '~/local/models/store/cards'
import { ManagedCardModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel'
import { TransactionStateTypeEnum } from '~/plugins/weavr-multi/api/models/transfers/enums/TransactionStateTypeEnum'
import { TransactionTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/enums/TransactionTypeEnum'
import { PaginatedManagedCardsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/responses/PaginatedManagedCardsResponse'
import { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import { GetManagedCardsRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardsRequest'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { CreateManagedCard } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/CreateManagedCard'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import { UpdateManagedCard } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpdateManagedCard'
import { ManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/ManagedCardStatementRequest'
import { useAuthStore } from '~/store/auth'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

const initState = (): CardState => {
    return {
        isLoading: false,
        cards: null,
        managedCard: null,
        statements: null,
        filteredStatement: {},
    }
}

export const useCardsStore = defineStore('cards', () => {
    const store = useAuthStore()
    const cardState: CardState = reactive(initState())

    const currency = computed(() =>
        cardState.cards?.cards?.length ? cardState.cards.cards[0].currency : null,
    )
    const totalAvailableBalance = computed(() => {
        let total = 0
        if (!cardState.cards) return total

        cardState.cards.cards?.forEach((card: ManagedCardModel) => {
            if (card.balances?.availableBalance) {
                total += card.balances.availableBalance
            }
        })

        return total
    })

    const resetState = () => {
        const data = initState()
        Object.keys(data).forEach((key) => {
            cardState[key] = data[key]
        })
    }

    const setFilteredStatement = () => {
        if (!cardState.statements) return []

        const _entries = cardState.statements.entry?.filter((transaction: StatementEntryModel) => {
            const transactionType = (transaction.txId?.type ||
                transaction.transactionId?.type) as TransactionTypeEnum

            const _shouldDisplay = ![
                TransactionTypeEnum.AUTHORISATION_REVERSAL,
                TransactionTypeEnum.AUTHORISATION_EXPIRY,
                TransactionTypeEnum.AUTHORISATION_DECLINE,
            ].includes(transactionType)

            if (!_shouldDisplay) return false

            if (
                transactionType === TransactionTypeEnum.AUTHORISATION &&
                transaction.additionalFields?.authorisationState ===
                    TransactionStateTypeEnum.COMPLETED
            ) {
                return false
            }

            return true
        })

        const _out = {}
        _entries?.forEach((_entry) => {
            if (_entry.processedTimestamp) {
                const _processedTimestamp = parseInt(_entry.processedTimestamp)
                // @ts-ignore
                const _date = DateTime.fromMillis(_processedTimestamp).startOf('day').toMillis()

                if (!_out[_date]) {
                    _out[_date] = []
                }
                _out[_date].push(_entry)
            }
        })

        cardState.filteredStatement = _out
    }

    const setCards = (_cards: PaginatedManagedCardsResponse) => {
        cardState.cards = _cards
    }

    const setIsLoading = (_isLoading: boolean) => {
        cardState.isLoading = _isLoading
    }

    const setStatement = (statements: StatementResponseModel | null) => {
        resetStatement()
        resetFilteredStatement()
        if (statements?.entry) {
            if (cardState.statements?.entry) {
                cardState.statements.entry = statements.entry
            } else {
                cardState.statements = statements
            }
        }
    }

    const resetStatement = () => {
        cardState.statements = null
    }

    const resetFilteredStatement = () => {
        cardState.filteredStatement = null
    }

    const appendStatement = (_statement: StatementResponseModel) => {
        if (cardState.statements) {
            return _statement.entry!.forEach((_statementEntry) => {
                cardState.statements?.entry!.push(_statementEntry)
            })
        }

        cardState.statements = _statement
    }

    const setManagedCard = (_card: ManagedCardModel) => {
        cardState.managedCard = _card
    }

    const clearManagedCard = () => {
        cardState.managedCard = null
    }

    const getCards = (filters?: GetManagedCardsRequest) => {
        const req = store.$nuxt.$apiMulti.managedCards.index(filters)

        req.then((res) => {
            setCards(res.data)
        })

        return req
    }

    const hasDestroyedCards = () => {
        return store.$nuxt.$apiMulti.managedCards
            .index({
                state: ManagedInstrumentStateEnum.DESTROYED,
                limit: 1,
                offset: 0,
            })
            .then((res) => {
                return !!res.data.cards?.length
            })
    }

    const addCard = (request: CreateManagedCard) => {
        const req = store.$nuxt.$apiMulti.managedCards.store(request)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const update = (params: { id: IDModel; request: UpdateManagedCard }) => {
        const req = store.$nuxt.$apiMulti.managedCards.update(params)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const getCardStatement = (req: ManagedCardStatementRequest) => {
        setIsLoading(true)

        const xhr = store.$nuxt.$apiMulti.managedCards.statement(req.id, req.request)

        xhr.then((res) => {
            setStatement(res.data)
            setFilteredStatement()
        }).finally(() => {
            setIsLoading(false)
        })

        return xhr
    }

    const clearCardStatements = () => {
        setStatement(null)
    }

    const getManagedCard = (id: string) => {
        const req = store.$nuxt.$apiMulti.managedCards.show(id)

        req.then((res) => {
            setManagedCard(res.data)
        })

        return req
    }

    const block = (id: IDModel) => {
        setIsLoading(true)

        const req = store.$nuxt.$apiMulti.managedCards.block(id)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const unblock = (id: IDModel) => {
        setIsLoading(true)

        const req = store.$nuxt.$apiMulti.managedCards.unblock(id)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const remove = (id: string) => {
        setIsLoading(true)

        const req = store.$nuxt.$apiMulti.managedCards.remove(id)

        req.then(() => {
            clearManagedCard()
        })

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    return {
        cardState,
        currency,
        totalAvailableBalance,
        resetState,
        resetStatement,
        appendStatement,
        getCards,
        hasDestroyedCards,
        addCard,
        update,
        getCardStatement,
        clearCardStatements,
        getManagedCard,
        block,
        unblock,
        remove,
    }
})

export type useCardsStore = ReturnType<typeof useCardsStore>
