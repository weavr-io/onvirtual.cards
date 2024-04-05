import { defineStore } from 'pinia'
import { reactive, computed, getCurrentInstance } from 'vue'
import type { Cards as CardState } from '~/local/models/store/cards'
import type { PaginatedManagedCardsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/responses/PaginatedManagedCardsResponse'
import type { GetManagedCardsRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardsRequest'
import type { ManagedCardModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel'
import type { CreateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/CreateManagedCardRequest'
import type { UpdateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpdateManagedCardRequest'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import type { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import type { ManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/ManagedCardStatementRequest'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { TransactionTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/enums/TransactionTypeEnum'
import { TransactionStateTypeEnum } from '~/plugins/weavr-multi/api/models/transfers/enums/TransactionStateTypeEnum'

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
    const { proxy: root } = getCurrentInstance() || {}
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

        const _entries = cardState.statements.entry?.filter((transaction) => {
            const _shouldDisplay = ![
                TransactionTypeEnum.AUTHORISATION_REVERSAL,
                TransactionTypeEnum.AUTHORISATION_EXPIRY,
                TransactionTypeEnum.AUTHORISATION_DECLINE,
            ].includes(transaction.transactionId.type)

            if (!_shouldDisplay) return false

            if (transaction.transactionId.type === TransactionTypeEnum.AUTHORISATION) {
                if (
                    transaction.additionalFields?.authorisationState ===
                    TransactionStateTypeEnum.COMPLETED
                ) {
                    return false
                }
            }

            return true
        })

        const _out = {}

        _entries?.forEach((_entry) => {
            if (_entry.processedTimestamp) {
                const _processedTimestamp = parseInt(_entry.processedTimestamp)
                // @ts-ignore
                const _date = DateTime.fromJSDate(_processedTimestamp).startOf('day').toMillis()

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
        if (statements?.entry) {
            return cardState.statements?.entry?.push(...statements.entry)
        }

        return (cardState.statements = statements)
    }

    const resetStatement = () => {
        cardState.statements = null
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
        const req = root!.$apiMulti.managedCards.index(filters)

        req.then((res) => {
            setCards(res.data)
        })

        return req
    }

    const hasDestroyedCards = () => {
        return root!.$apiMulti.managedCards
            .index({
                state: ManagedInstrumentStateEnum.DESTROYED,
                limit: 1,
                offset: 0,
            })
            .then((res) => {
                return !!res.data.cards?.length
            })
    }

    const addCard = (request: CreateManagedCardRequest) => {
        const req = root!.$apiMulti.managedCards.store(request)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const update = (params: { id: IDModel; request: UpdateManagedCardRequest }) => {
        const req = root!.$apiMulti.managedCards.update(params)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const getCardStatement = (req: ManagedCardStatementRequest) => {
        setIsLoading(true)

        const xhr = root!.$apiMulti.managedCards.statement(req.id, req.request)

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
        const req = root!.$apiMulti.managedCards.show(id)

        req.then((res) => {
            setManagedCard(res.data)
        })

        return req
    }

    const block = (id: IDModel) => {
        setIsLoading(true)

        const req = root!.$apiMulti.managedCards.block(id)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const unblock = (id: IDModel) => {
        setIsLoading(true)

        const req = root!.$apiMulti.managedCards.unblock(id)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const remove = (id: string) => {
        setIsLoading(true)

        const req = root!.$apiMulti.managedCards.remove(id)

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
