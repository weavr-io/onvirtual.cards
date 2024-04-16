import { Action, Module, Mutation } from 'vuex-module-decorators'
import { DateTime } from 'luxon'
import { StoreModule } from '~/store/storeModule'
import { PaginatedManagedCardsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/responses/PaginatedManagedCardsResponse'
import { GetManagedCardsRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardsRequest'
import { ManagedCardModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel'
import { CreateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/CreateManagedCardRequest'
import { UpdateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpdateManagedCardRequest'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import { ManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/ManagedCardStatementRequest'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'

const defaultState = {
    isLoading: false,
    cards: null,
    managedCard: null,
    statements: null,
    filteredStatement: {},
}

@Module({
    name: 'cardsModule',
    stateFactory: true,
    namespaced: true,
})
export default class Cards extends StoreModule {
    isLoading: boolean = defaultState.isLoading

    cards: PaginatedManagedCardsResponse | null = defaultState.cards

    managedCard: ManagedCardModel | null = defaultState.managedCard

    statements: StatementResponseModel | null = defaultState.statements

    filteredStatement: any = defaultState.filteredStatement

    @Mutation
    RESET_STATE() {
        Object.keys(defaultState).forEach((key) => {
            this[key] = defaultState[key]
        })
    }

    @Mutation
    SET_FILTERED_STATEMENT() {
        if (this.statements == null) {
            return []
        }

        const _entries = this.statements.entry?.filter((transaction) => {
            const _shouldDisplay = ![
                'AUTHORISATION_REVERSAL',
                'AUTHORISATION_EXPIRY',
                'AUTHORISATION_DECLINE',
            ].includes(transaction.transactionId.type)

            if (!_shouldDisplay) {
                return false
            }

            if (transaction.transactionId.type === 'AUTHORISATION') {
                if (transaction.additionalFields?.authorisationState === 'COMPLETED') {
                    return false
                }
            }

            return true
        })

        const _out = {}

        _entries?.forEach((_entry) => {
            if (_entry.processedTimestamp) {
                const _processedTimestamp = parseInt(_entry.processedTimestamp)

                const _date = DateTime.fromMillis(_processedTimestamp).startOf('day').toString()

                if (!_out[_date]) {
                    _out[_date] = []
                }

                _out[_date].push(_entry)
            }
        })

        this.filteredStatement = _out
    }

    @Mutation
    SET_CARDS(_cards: PaginatedManagedCardsResponse) {
        this.cards = _cards
    }

    @Mutation
    SET_IS_LOADING(_isLoading: boolean) {
        this.isLoading = _isLoading
    }

    @Mutation
    SET_STATEMENT(statements: StatementResponseModel | null) {
        if (!statements) {
            this.statements = statements
        } else if (!this.statements?.entry) {
            this.statements = statements
        } else if (statements.entry) {
            this.statements.entry.push(...statements.entry)
        }
    }

    @Mutation
    RESET_STATEMENT() {
        this.statements = null
    }

    @Mutation
    APPEND_STATEMENT(_statement: StatementResponseModel) {
        if (this.statements === null) {
            this.statements = _statement
        } else {
            _statement.entry!.forEach((_statementEntry) => {
                this.statements?.entry!.push(_statementEntry)
            })
        }
    }

    @Mutation
    SET_MANAGED_CARD(_card: ManagedCardModel) {
        this.managedCard = _card
    }

    @Mutation
    CLEAR_MANAGED_CARD() {
        this.managedCard = null
    }

    @Action({ rawError: true })
    getCards(filters?: GetManagedCardsRequest) {
        const req = this.store.$apiMulti.managedCards.index(filters)

        req.then((res) => {
            this.SET_CARDS(res.data)
        })

        return req
    }

    @Action({ rawError: true })
    hasDestroyedCards() {
        return this.store.$apiMulti.managedCards
            .index({
                state: ManagedInstrumentStateEnum.DESTROYED,
                limit: 1,
                offset: 0,
            })
            .then((res) => {
                return !!res.data.cards?.length
            })
    }

    @Action({ rawError: true })
    addCard(request: CreateManagedCardRequest) {
        const req = this.store.$apiMulti.managedCards.store(request)

        req.finally(() => {
            this.SET_IS_LOADING(false)
        })

        return req
    }

    @Action({ rawError: true })
    update(params: { id: IDModel; request: UpdateManagedCardRequest }) {
        const req = this.store.$apiMulti.managedCards.update(params)

        req.finally(() => {
            this.SET_IS_LOADING(false)
        })

        return req
    }

    @Action({ rawError: true })
    getCardStatement(req: ManagedCardStatementRequest) {
        this.SET_IS_LOADING(true)

        const xhr = this.store.$apiMulti.managedCards.statement(req.id, req.request)

        xhr.then((res) => {
            this.SET_STATEMENT(res.data)
            this.SET_FILTERED_STATEMENT()
        }).finally(() => {
            this.SET_IS_LOADING(false)
        })

        return xhr
    }

    @Action({ rawError: true })
    clearCardStatements() {
        this.SET_STATEMENT(null)
    }

    @Action({ rawError: true })
    getManagedCard(id: string) {
        const req = this.store.$apiMulti.managedCards.show(id)

        req.then((res) => {
            this.SET_MANAGED_CARD(res.data)
        })

        return req
    }

    @Action({ rawError: true })
    block(id) {
        this.SET_IS_LOADING(true)

        const req = this.store.$apiMulti.managedCards.block(id)

        req.finally(() => {
            this.SET_IS_LOADING(false)
        })

        return req
    }

    @Action({ rawError: true })
    unblock(id) {
        this.SET_IS_LOADING(true)

        const req = this.store.$apiMulti.managedCards.unblock(id)

        req.finally(() => {
            this.SET_IS_LOADING(false)
        })

        return req
    }

    @Action({ rawError: true })
    remove(id: string) {
        this.SET_IS_LOADING(true)

        const req = this.store.$apiMulti.managedCards.remove(id)

        req.then(() => {
            this.CLEAR_MANAGED_CARD()
        })

        req.finally(() => {
            this.SET_IS_LOADING(false)
        })

        return req
    }
}
