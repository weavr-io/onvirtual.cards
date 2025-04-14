import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { DateTime } from 'luxon'
import type { Cards as CardState } from '~/local/models/store/cards'
import type { ManagedCardModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel'
import type { PaginatedManagedCardsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/responses/PaginatedManagedCardsResponse'
import type { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import type { GetManagedCardsRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardsRequest'
import type { CreateManagedCard } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/CreateManagedCard'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import type { UpdateManagedCard } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpdateManagedCard'
import type { ManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/ManagedCardStatementRequest'
import type { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { TransactionStateTypeEnum } from '~/plugins/weavr-multi/api/models/transfers/enums/TransactionStateTypeEnum'
import { TransactionTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/enums/TransactionTypeEnum'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'

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
    const nuxtApp = computed(() => useNuxtApp())
    const apiMulti = computed(() => nuxtApp.value.$apiMulti)

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

    const setStatement = (statements: StatementResponseModel | null, append = false) => {
        if (!statements) {
            cardState.statements = null
            return
        }

        if (append && cardState.statements && statements.entry) {
            cardState.statements = {
                ...statements,
                entry: [...(cardState.statements.entry || []), ...(statements.entry || [])],
            }
        } else {
            cardState.statements = statements
        }

        setFilteredStatement()
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
        const req = apiMulti.value.managedCards.index(filters)

        req.then((res) => {
            setCards(res.data)
        })

        return req
    }

    const hasDestroyedCards = () => {
        return apiMulti.value.managedCards
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
        const req = apiMulti.value.managedCards.store(request)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const update = (params: { id: IDModel; request: UpdateManagedCard }) => {
        const req = apiMulti.value.managedCards.update(params)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const getCardStatement = (req: ManagedCardStatementRequest, append = false) => {
        setIsLoading(true)

        const xhr = apiMulti.value.managedCards.statement(req.id, req.request)

        xhr.then((res) => {
            setStatement(res.data, append)
        }).finally(() => {
            setIsLoading(false)
        })

        return xhr
    }

    const clearCardStatements = () => {
        setStatement(null)
    }

    const getManagedCard = (id: string) => {
        const req = apiMulti.value.managedCards.show(id)

        req.then((res) => {
            setManagedCard(res.data)
        })

        return req
    }

    const block = (id: IDModel) => {
        setIsLoading(true)

        const req = apiMulti.value.managedCards.block(id)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const unblock = (id: IDModel) => {
        setIsLoading(true)

        const req = apiMulti.value.managedCards.unblock(id)

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const remove = (id: string) => {
        setIsLoading(true)

        const req = apiMulti.value.managedCards.remove(id)

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
        setStatement,
        getManagedCard,
        block,
        unblock,
        remove,
    }
})

export type useCardsStore = ReturnType<typeof useCardsStore>
